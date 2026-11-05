import { MetricKey } from '../../shared/enums';

/** One corrective retry: the validator's findings go back to the model before giving up. */
export const MAX_MODEL_ATTEMPTS = 2;

/** Metrics that can justify a highlight; load metrics (RPE, workload) are alerts, not merits. */
export const LEADER_METRICS: MetricKey[] = [
    MetricKey.TotalDistanceM,
    MetricKey.HighSpeedRunningM,
    MetricKey.Sprints,
    MetricKey.MaxSpeedKmh,
    MetricKey.Accelerations,
];
export const LEADERS_PER_METRIC = 3;

/** "Superar" is read literally: a value equal to the limit is not an alert. */
export const exceedsLimit = (value: number, limit: number): boolean => value > limit;

/** Below this share of the session minutes a player's totals are not comparable with the rest. */
export const REDUCED_MINUTES_RATIO = 0.75;

/** Figures as the model may spell them: 10488, 10.488, 10,488 or 29,6. */
export const NUMBER_TOKEN = /\d+(?:[.,]\d+)*/g;

/** Start of the summary string inside the JSON the model streams. */
export const SUMMARY_START = /"summary"\s*:\s*"/;

/** Body of a JSON string: everything up to the first unescaped quote, or to the end while it is still streaming. */
export const JSON_STRING_BODY = /^(?:[^"\\]|\\.)*/;
