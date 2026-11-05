import { setTimeout as sleep } from 'node:timers/promises';
import { logger } from '../config/logger';
import { AiAbortedError, AiAuthError, AiInvalidResponseError, AiProviderError, AiRateLimitError, AiTimeoutError } from './ai.errors';
import { AiClient, AiJsonRequest, AiJsonResponse, AiStreamHandler, AiUsage, OpenAiCompatibleConfig } from './ai.types';
import { FINISH_REASON_LENGTH, MAX_SEND_ATTEMPTS, retryDelayMs } from './ai.constants';
import { ChatCompletionResponse, ChatMessage, StreamedCompletion } from './openai-compatible.types';
import { readCompletionStream } from './sse-stream.reader';

/** Chat completions client for any OpenAI-compatible API (Gemini, Groq, OpenRouter, Ollama). */
export class OpenAiCompatibleClient implements AiClient {
    readonly model: string;

    constructor(private readonly config: OpenAiCompatibleConfig) {
        this.model = config.model;
    }

    async generateJson(request: AiJsonRequest): Promise<AiJsonResponse> {
        return this.withTimeout(request.signal, async (signal) => {
            const response = await this.withTransientRetry(() => this.send(this.buildBody(request, false), signal), signal);
            const completion = (await response.json()) as ChatCompletionResponse;
            const choice = completion.choices?.[0];
            return this.toJsonResponse(choice?.message?.content, completion.model, completion.usage, choice?.finish_reason);
        });
    }

    async streamJson(request: AiJsonRequest, onText: AiStreamHandler): Promise<AiJsonResponse> {
        return this.withTimeout(request.signal, async (signal) => {
            const streamed = await this.withTransientRetry(() => this.readStream(this.buildBody(request, true), signal, onText), signal);
            return this.toJsonResponse(streamed.text, streamed.model, streamed.usage, streamed.finishReason);
        });
    }

    /** A stream that ends without `[DONE]` or a finish reason was cut by the provider; its error body, if any, is in the trailer. */
    private async readStream(body: unknown, signal: AbortSignal, onText: AiStreamHandler): Promise<StreamedCompletion> {
        const streamed = await readCompletionStream(await this.send(body, signal), onText);
        if (!streamed.done && !streamed.finishReason) {
            logger.warn({ trailer: streamed.trailer.slice(0, 300) }, 'AI stream cut by the provider');
            throw new AiProviderError(trailerStatus(streamed.trailer), streamed.trailer.slice(0, 300) || 'stream ended early');
        }
        return streamed;
    }

    private buildBody(request: AiJsonRequest, stream: boolean): unknown {
        return {
            model: this.model,
            temperature: request.temperature,
            max_tokens: this.outputLimit(request.maxTokens),
            reasoning_effort: this.config.reasoningEffort,
            response_format: { type: 'json_object' },
            stream,
            // Without it most providers, Gemini included, leave usage out of the stream.
            stream_options: stream ? { include_usage: true } : undefined,
            messages: this.buildMessages(request),
        };
    }

    /** Reasoning tokens share max_tokens with the answer, so they get their own allowance. */
    private outputLimit(maxTokens?: number): number | undefined {
        if (maxTokens === undefined) return undefined;
        const reasoning = this.config.reasoningEffort !== undefined && this.config.reasoningEffort !== 'none';
        return reasoning ? maxTokens + this.config.reasoningTokensAllowance : maxTokens;
    }

    /** A retry replays the rejected answer as an assistant turn and the feedback as the next user turn. */
    private buildMessages({ system, user, retry }: AiJsonRequest): ChatMessage[] {
        const messages: ChatMessage[] = [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ];
        if (retry) messages.push({ role: 'assistant', content: retry.previousAnswer }, { role: 'user', content: retry.feedback });
        return messages;
    }

    /** A truncated completion is never parsed: it is reported as such so the retry asks for a shorter answer. */
    private toJsonResponse(
        content?: string | null,
        model?: string,
        usage?: ChatCompletionResponse['usage'],
        finishReason?: string | null,
    ): AiJsonResponse {
        const text = content?.trim() ?? '';
        const truncated = finishReason === FINISH_REASON_LENGTH;
        if (!text && !truncated) throw new AiInvalidResponseError('empty completion', text);

        return {
            json: truncated ? null : parseJson(text),
            text,
            truncated,
            model: model ?? this.model,
            usage: usage ? toUsage(usage) : null,
        };
    }

    /** One deadline covers the whole exchange, including reading a stream; the caller's signal can cut it short. */
    private async withTimeout<T>(callerSignal: AbortSignal | undefined, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
        const timeoutSignal = AbortSignal.timeout(this.config.timeoutMs);
        const signal = callerSignal ? AbortSignal.any([timeoutSignal, callerSignal]) : timeoutSignal;
        const startedAt = Date.now();

        try {
            const result = await run(signal);
            logger.info({ model: this.model, ms: Date.now() - startedAt }, 'AI completion received');
            return result;
        } catch (error) {
            if (callerSignal?.aborted) throw new AiAbortedError();
            if (timeoutSignal.aborted) throw new AiTimeoutError(this.config.timeoutMs);
            throw error;
        }
    }

    /** Transient 5xx failures, before or during a stream, are retried with growing pauses; anything else surfaces immediately. */
    private async withTransientRetry<T>(run: () => Promise<T>, signal: AbortSignal, attempt = 1): Promise<T> {
        try {
            return await run();
        } catch (error) {
            const transient = error instanceof AiProviderError && error.retryable;
            if (!transient || attempt >= MAX_SEND_ATTEMPTS) throw error;
            await sleep(retryDelayMs(attempt), undefined, { signal });
            return this.withTransientRetry(run, signal, attempt + 1);
        }
    }

    private async send(body: unknown, signal: AbortSignal): Promise<Response> {
        const response = await fetch(`${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.apiKey}` },
            body: JSON.stringify(body),
            signal,
        });
        if (!response.ok) throw await this.toProviderError(response);
        return response;
    }

    private async toProviderError(response: Response): Promise<Error> {
        const detail = (await response.text()).slice(0, 300);
        logger.warn({ status: response.status, detail }, 'AI provider error');

        if (response.status === 429) {
            const retryAfter = Number(response.headers.get('retry-after'));
            return new AiRateLimitError(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null);
        }
        if (response.status === 401 || response.status === 403) return new AiAuthError();
        return new AiProviderError(response.status, detail);
    }
}

const toUsage = (usage: ChatCompletionResponse['usage'] & object): AiUsage => ({
    input_tokens: usage.prompt_tokens ?? 0,
    output_tokens: usage.completion_tokens ?? 0,
    reasoning_tokens: usage.completion_tokens_details?.reasoning_tokens ?? null,
});

/** HTTP status carried by an error body sent mid-stream (Gemini sends `[{ "error": { "code": 503 } }]`); 502 when there is none. */
const trailerStatus = (trailer: string): number => {
    try {
        const parsed: unknown = JSON.parse(trailer);
        const first = Array.isArray(parsed) ? parsed[0] : parsed;
        const code = (first as { error?: { code?: unknown } })?.error?.code;
        return typeof code === 'number' && code >= 400 ? code : 502;
    } catch {
        return 502;
    }
};

/** Some models wrap JSON in markdown fences even in JSON mode; strip them before parsing. */
const parseJson = (text: string): unknown => {
    const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    try {
        return JSON.parse(unfenced);
    } catch {
        throw new AiInvalidResponseError('completion is not valid JSON', text);
    }
};
