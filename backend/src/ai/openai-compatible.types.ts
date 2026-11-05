/** Subset of the chat completions payloads this client reads. */
export interface ChatCompletionUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
}

export interface ChatCompletionResponse {
    model?: string;
    choices?: { message?: { content?: string | null } }[];
    usage?: ChatCompletionUsage | null;
}

export interface ChatCompletionChunk {
    model?: string;
    choices?: { delta?: { content?: string | null } }[];
    usage?: ChatCompletionUsage | null;
}

export interface StreamedCompletion {
    text: string;
    model?: string;
    usage?: ChatCompletionUsage | null;
}
