/** Subset of the chat completions payloads this client reads and writes. */
export interface ChatCompletionUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
    completion_tokens_details?: { reasoning_tokens?: number } | null;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatCompletionResponse {
    model?: string;
    choices?: { message?: { content?: string | null }; finish_reason?: string | null }[];
    usage?: ChatCompletionUsage | null;
}

export interface ChatCompletionChunk {
    model?: string;
    choices?: { delta?: { content?: string | null }; finish_reason?: string | null }[];
    usage?: ChatCompletionUsage | null;
}

export interface StreamedCompletion {
    text: string;
    model?: string;
    finishReason?: string | null;
    usage?: ChatCompletionUsage | null;
}
