/** Base class for provider failures. `retryable` tells callers whether the same request may succeed later. */
export class AiError extends Error {
    constructor(
        message: string,
        public readonly retryable: boolean,
    ) {
        super(message);
        this.name = new.target.name;
    }
}

export class AiTimeoutError extends AiError {
    constructor(public readonly timeoutMs: number) {
        super(`AI provider did not answer within ${timeoutMs} ms`, true);
    }
}

export class AiRateLimitError extends AiError {
    constructor(public readonly retryAfterSeconds: number | null) {
        super('AI provider rate limit exceeded', true);
    }
}

export class AiAuthError extends AiError {
    constructor() {
        super('AI provider rejected the credentials', false);
    }
}

export class AiProviderError extends AiError {
    constructor(
        public readonly status: number,
        detail: string,
    ) {
        super(`AI provider responded with status ${status}: ${detail}`, status >= 500);
    }
}

export class AiInvalidResponseError extends AiError {
    constructor(
        detail: string,
        public readonly rawText: string,
    ) {
        super(`AI provider returned an unusable response: ${detail}`, false);
    }
}

export class AiAbortedError extends AiError {
    constructor() {
        super('AI request was cancelled by the caller', false);
    }
}
