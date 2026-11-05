import { MetricKey } from '../models';

export const METRIC_LABELS: Record<MetricKey, string> = {
  [MetricKey.MinutesPlayed]: 'Minutos',
  [MetricKey.TotalDistanceM]: 'Distancia total',
  [MetricKey.HighSpeedRunningM]: 'Alta velocidad',
  [MetricKey.Sprints]: 'Sprints',
  [MetricKey.MaxSpeedKmh]: 'Vel. máxima',
  [MetricKey.Accelerations]: 'Aceleraciones',
  [MetricKey.Rpe]: 'RPE',
  [MetricKey.WorkloadAu]: 'Carga',
};

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
