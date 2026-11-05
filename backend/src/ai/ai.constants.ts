/** finish_reason the chat completions API reports when the output hit max_tokens. */
export const FINISH_REASON_LENGTH = 'length';

/** Transient 5xx answers are retried with exponential backoff (1 s, 2 s); anything else fails immediately. */
export const MAX_SEND_ATTEMPTS = 3;
export const RETRY_BASE_DELAY_MS = 1000;

/** Delay before retry number `attempt` (1-based): 1 s, 2 s, 4 s… */
export const retryDelayMs = (attempt: number): number => RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
