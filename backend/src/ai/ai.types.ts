export interface AiJsonRequest {
    system: string;
    user: string;
    temperature?: number;
    maxTokens?: number;
    /** Lets the caller cancel the request, for example when an SSE client disconnects. */
    signal?: AbortSignal;
}

export type AiDeltaHandler = (chunk: string) => void;

export interface AiUsage {
    input_tokens: number;
    output_tokens: number;
}

export interface AiJsonResponse {
    json: unknown;
    model: string;
    usage: AiUsage | null;
}

/** Minimal contract the report services depend on; swapping providers means a new implementation only. */
export interface AiClient {
    readonly model: string;
    generateJson(request: AiJsonRequest): Promise<AiJsonResponse>;
    /** Same result as generateJson, but `onDelta` receives the raw text as the model produces it. */
    streamJson(request: AiJsonRequest, onDelta: AiDeltaHandler): Promise<AiJsonResponse>;
}

export type ReasoningEffort = 'none' | 'low' | 'medium' | 'high';

export interface OpenAiCompatibleConfig {
    baseUrl: string;
    apiKey: string;
    model: string;
    timeoutMs: number;
    reasoningEffort?: ReasoningEffort;
}
