import { MetricKey, TrendBasis } from '../../shared/enums';

/** Output metrics whose first-vs-last change is precomputed; RPE and workload are load alerts, and a percentage over a 1-10 scale says nothing. */
export const TREND_METRICS: MetricKey[] = [
    MetricKey.TotalDistanceM,
    MetricKey.HighSpeedRunningM,
    MetricKey.Sprints,
    MetricKey.MaxSpeedKmh,
    MetricKey.Accelerations,
];

/** Max speed is a peak and does not grow with minutes; every other trended metric is a total. */
export const ABSOLUTE_TREND_METRICS: MetricKey[] = [MetricKey.MaxSpeedKmh];

export const TREND_REFERENCE_MINUTES = 90;

/** Distances are projected to whole metres; counts and speeds keep one decimal. */
export const TREND_DECIMALS: Partial<Record<MetricKey, number>> = { [MetricKey.TotalDistanceM]: 0, [MetricKey.HighSpeedRunningM]: 0 };

export const trendBasis = (metric: MetricKey): TrendBasis => (ABSOLUTE_TREND_METRICS.includes(metric) ? TrendBasis.Absolute : TrendBasis.Per90Min);
