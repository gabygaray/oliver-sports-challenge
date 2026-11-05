import { AlertLevel, IThresholdLimits, MetricKey } from '../models';
import { EMPTY_VALUE_LABEL } from './constants';
import { METRIC_UNITS } from './metric.constants';

const numberFormatters = new Map<string, Intl.NumberFormat>();

/** One formatter per locale, created on first use. */
const numberFormatter = (locale: string): Intl.NumberFormat => {
  const cached = numberFormatters.get(locale);
  if (cached) return cached;
  const created = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  numberFormatters.set(locale, created);
  return created;
};

export const formatMetricValue = (value: number | null, locale: string): string =>
  value === null ? EMPTY_VALUE_LABEL : numberFormatter(locale).format(value);

export const formatMetricWithUnit = (
  metric: MetricKey,
  value: number | null,
  locale: string,
): string => {
  const unit = METRIC_UNITS[metric];
  const formatted = formatMetricValue(value, locale);
  return value !== null && unit ? `${formatted} ${unit}` : formatted;
};

/** "Distancia total (m)", or the bare label for metrics without a unit. */
export const formatMetricLabelWithUnit = (metric: MetricKey, label: string): string => {
  const unit = METRIC_UNITS[metric];
  return unit ? `${label} (${unit})` : label;
};

/** Strictly above the limit, matching how the backend raises alerts: equal is not an alert. */
export const getAlertLevel = (
  value: number | null,
  limits?: IThresholdLimits,
): AlertLevel | null => {
  if (value === null || !limits) return null;
  if (limits.critical !== null && value > limits.critical) return AlertLevel.Critical;
  if (value > limits.warning) return AlertLevel.Warning;
  return null;
};
