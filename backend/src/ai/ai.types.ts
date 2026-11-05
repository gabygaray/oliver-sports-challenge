/** The rejected answer and the reasons, replayed as assistant and user turns so the model sees what to fix. */
export interface AiRetryTurn {
    previousAnswer: string;
    feedback: string;
}

export interface AiJsonRequest {
    system: string;
    user: string;
    temperature?: number;
    maxTokens?: number;
    retry?: AiRetryTurn;
    /** Lets the caller cancel the request, for example when an SSE client disconnects. */
    signal?: AbortSignal;
}

/** Receives the whole text streamed so far, so a retried stream starts the consumer over. */
export type AiStreamHandler = (text: string) => void;

export interface AiUsage {
    input_tokens: number;
    output_tokens: number;
    /** Share of output_tokens spent on reasoning, when the provider reports it. */
    reasoning_tokens: number | null;
}

export interface AiJsonResponse {
    /** Parsed completion; null when the output was truncated. */
    json: unknown;
    /** Raw completion text, kept so a rejected answer can be shown back to the model. */
    text: string;
    /** True when the provider stopped at max_tokens, so the retry can ask for a shorter answer instead of reporting bad JSON. */
    truncated: boolean;
    model: string;
    usage: AiUsage | null;
}

/** Minimal contract the report services depend on; swapping providers means a new implementation only. */
export interface AiClient {
    readonly model: string;
    generateJson(request: AiJsonRequest): Promise<AiJsonResponse>;
    /** Same result as generateJson, but `onText` receives the raw text as the model produces it. */
    streamJson(request: AiJsonRequest, onText: AiStreamHandler): Promise<AiJsonResponse>;
}

export type ReasoningEffort = 'none' | 'low' | 'medium' | 'high';

export interface OpenAiCompatibleConfig {
    baseUrl: string;
    apiKey: string;
    model: string;
    timeoutMs: number;
    reasoningEffort?: ReasoningEffort;
    /** Added to max_tokens while reasoning is on. */
    reasoningTokensAllowance: number;
}
