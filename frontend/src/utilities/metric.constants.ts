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

/** Definitions shown behind an info icon in the table headers, for the metrics whose name does not explain itself. */
export const METRIC_DESCRIPTIONS: Partial<Record<MetricKey, string>> = {
  [MetricKey.Rpe]:
    'RPE (Rating of Perceived Exertion): esfuerzo percibido que reporta el jugador, en una escala de 1 a 10. Puede faltar si no lo reportó.',
  [MetricKey.WorkloadAu]:
    'Carga de trabajo = RPE × minutos jugados, en unidades arbitrarias (AU). Falta cuando falta el RPE.',
};

export const METRIC_KEYS = Object.values(MetricKey);
