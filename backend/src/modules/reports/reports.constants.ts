import { MetricKey } from '../../shared/enums';

/** One corrective retry: the validator's findings go back to the model before giving up. */
export const MAX_MODEL_ATTEMPTS = 2;

/** Violation reported when the completion could not be parsed, so the retry feedback says what actually happened. */
export const INVALID_JSON_VIOLATION = 'the answer was not a valid JSON object';

/** Violation reported when the provider stopped at max_tokens; a retry of the same length would be cut again. */
export const TRUNCATED_VIOLATION = 'the answer was cut off by the output limit: write a shorter summary and shorter sentences';

/** Violation reported when the limit ran out before any answer was written. */
export const EXHAUSTED_VIOLATION =
    'the output limit ran out before the answer was written: reply with the JSON object directly, without reasoning first';

/** Below this length a truncated completion counts as never started. */
export const TRUNCATED_TEXT_MIN_CHARS = 50;

/** Stands in for an empty completion in the retry turn; providers reject empty assistant messages. */
export const EMPTY_ANSWER_PLACEHOLDER = '(empty answer)';

/** Upper bounds for the prose the model returns; longer text is a sign it ignored the format. */
export const SUMMARY_MAX_CHARS = 1200;
export const SENTENCE_MAX_CHARS = 300;

/** Metrics that can justify a highlight; load metrics (RPE, workload) are alerts, not merits. A tuple so Zod and the prompt can list it. */
export const LEADER_METRICS = [
    MetricKey.TotalDistanceM,
    MetricKey.HighSpeedRunningM,
    MetricKey.Sprints,
    MetricKey.MaxSpeedKmh,
    MetricKey.Accelerations,
] as const;
export const LEADERS_PER_METRIC = 3;

/** "Superar" is read literally: a value equal to the limit is not an alert. */
export const exceedsLimit = (value: number, limit: number): boolean => value > limit;

/** Below this share of the session minutes a player's totals are not comparable with the rest. */
export const REDUCED_MINUTES_RATIO = 0.75;

/** Figures as the model may spell them: 10488, 10.488, 10,488 or 29,6. */
export const NUMBER_TOKEN = /\d+(?:[.,]\d+)*/g;

/** Two or more capitalised words in a row: the shape of a full name in the prose. */
export const NAME_SEQUENCE = /\p{Lu}\p{Ll}+(?: \p{Lu}\p{Ll}+)+/gu;

/** Matches the text right before a sentence start, where the first word is capitalised whatever it is. */
export const SENTENCE_START = /(?:^|[.!?¡¿]\s*)$/;

/** Start of the summary string inside the JSON the model streams. */
export const SUMMARY_START = /"summary"\s*:\s*"/;

/** Body of a JSON string: everything up to the first unescaped quote, or to the end while it is still streaming. */
export const JSON_STRING_BODY = /^(?:[^"\\]|\\.)*/;
