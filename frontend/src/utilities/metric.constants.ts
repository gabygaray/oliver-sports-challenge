import { MetricKey } from '../models';

/** Units are the same in every language; the labels live in the translations. */
export const METRIC_UNITS: Record<MetricKey, string> = {
  [MetricKey.MinutesPlayed]: 'min',
  [MetricKey.TotalDistanceM]: 'm',
  [MetricKey.HighSpeedRunningM]: 'm',
  [MetricKey.Sprints]: '',
  [MetricKey.MaxSpeedKmh]: 'km/h',
  [MetricKey.Accelerations]: '',
  [MetricKey.Rpe]: '',
  [MetricKey.WorkloadAu]: 'AU',
};

export const METRIC_KEYS = Object.values(MetricKey);
