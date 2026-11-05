import { AiAbortedError, AiAuthError, AiError, AiInvalidResponseError, AiRateLimitError, AiTimeoutError } from '../../ai/ai.errors';
import { HttpError } from '../../shared/http-error';

/** Translates provider failures into the HTTP contract; the provider layer stays unaware of HTTP. */
export const toHttpError = (error: AiError): HttpError => {
    if (error instanceof AiAbortedError) return new HttpError(499, 'CLIENT_CLOSED_REQUEST', 'The client went away before the report was ready');
    if (error instanceof AiTimeoutError) return new HttpError(504, 'AI_TIMEOUT', 'The AI provider took too long to answer');
    if (error instanceof AiRateLimitError) {
        return new HttpError(429, 'AI_RATE_LIMITED', 'The AI provider rate limit was reached, try again later', {
            retry_after_seconds: error.retryAfterSeconds,
        });
    }
    if (error instanceof AiAuthError) return new HttpError(503, 'AI_NOT_CONFIGURED', 'The AI provider rejected the configured credentials');
    if (error instanceof AiInvalidResponseError) return new HttpError(502, 'AI_INVALID_RESPONSE', 'The AI provider returned an unusable response');
    return new HttpError(502, 'AI_PROVIDER_ERROR', 'The AI provider is unavailable');
};
