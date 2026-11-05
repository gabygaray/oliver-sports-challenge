import { setTimeout as sleep } from 'node:timers/promises';
import { logger } from '../config/logger';
import { AiAbortedError, AiAuthError, AiInvalidResponseError, AiProviderError, AiRateLimitError, AiTimeoutError } from './ai.errors';
import { AiClient, AiDeltaHandler, AiJsonRequest, AiJsonResponse, OpenAiCompatibleConfig } from './ai.types';
import { MAX_SEND_ATTEMPTS, retryDelayMs } from './ai.constants';
import { ChatCompletionResponse } from './openai-compatible.types';
import { readCompletionStream } from './sse-stream.reader';

/** Chat completions client for any OpenAI-compatible API (Gemini, Groq, OpenRouter, Ollama). */
export class OpenAiCompatibleClient implements AiClient {
    readonly model: string;

    constructor(private readonly config: OpenAiCompatibleConfig) {
        this.model = config.model;
    }

    async generateJson(request: AiJsonRequest): Promise<AiJsonResponse> {
        return this.withTimeout(request.signal, async (signal) => {
            const response = await this.send(this.buildBody(request, false), signal);
            const completion = (await response.json()) as ChatCompletionResponse;
            return this.toJsonResponse(completion.choices?.[0]?.message?.content, completion.model, completion.usage);
        });
    }

    async streamJson(request: AiJsonRequest, onDelta: AiDeltaHandler): Promise<AiJsonResponse> {
        return this.withTimeout(request.signal, async (signal) => {
            const response = await this.send(this.buildBody(request, true), signal);
            const streamed = await readCompletionStream(response, onDelta);
            return this.toJsonResponse(streamed.text, streamed.model, streamed.usage);
        });
    }

    private buildBody(request: AiJsonRequest, stream: boolean): unknown {
        return {
            model: this.model,
            temperature: request.temperature ?? 0.3,
            max_tokens: request.maxTokens,
            reasoning_effort: this.config.reasoningEffort,
            response_format: { type: 'json_object' },
            stream,
            messages: [
                { role: 'system', content: request.system },
                { role: 'user', content: request.user },
            ],
        };
    }

    private toJsonResponse(content?: string | null, model?: string, usage?: ChatCompletionResponse['usage']): AiJsonResponse {
        const text = content?.trim() ?? '';
        if (!text) throw new AiInvalidResponseError('empty completion', text);

        return {
            json: parseJson(text),
            model: model ?? this.model,
            usage: usage ? { input_tokens: usage.prompt_tokens ?? 0, output_tokens: usage.completion_tokens ?? 0 } : null,
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

    /** Sends the request; transient 5xx answers are retried with growing pauses, anything else surfaces immediately. */
    private async send(body: unknown, signal: AbortSignal, attempt = 1): Promise<Response> {
        try {
            const response = await fetch(`${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.apiKey}` },
                body: JSON.stringify(body),
                signal,
            });
            if (!response.ok) throw await this.toProviderError(response);
            return response;
        } catch (error) {
            const transient = error instanceof AiProviderError && error.retryable;
            if (!transient || attempt >= MAX_SEND_ATTEMPTS) throw error;
            await sleep(retryDelayMs(attempt), undefined, { signal });
            return this.send(body, signal, attempt + 1);
        }
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

/** Some models wrap JSON in markdown fences even in JSON mode; strip them before parsing. */
const parseJson = (text: string): unknown => {
    const unfenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    try {
        return JSON.parse(unfenced);
    } catch {
        throw new AiInvalidResponseError('completion is not valid JSON', text);
    }
};
