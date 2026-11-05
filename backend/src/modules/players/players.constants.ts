import { MetricKey } from '../../shared/enums';

/** Metrics whose first-vs-last change is precomputed for the evolution report. */
export const TREND_METRICS: MetricKey[] = [
    MetricKey.TotalDistanceM,
    MetricKey.HighSpeedRunningM,
    MetricKey.Sprints,
    MetricKey.MaxSpeedKmh,
    MetricKey.Accelerations,
    MetricKey.Rpe,
    MetricKey.WorkloadAu,
];
