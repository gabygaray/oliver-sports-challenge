import { AlertLevel, IThresholdLimits } from '../models';
import { EMPTY_VALUE_LABEL, LOCALE } from './constants';
import { METRIC_UNITS } from './metric.constants';
import { MetricKey } from '../models';

const numberFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

export const formatMetricValue = (value: number | null): string =>
  value === null ? EMPTY_VALUE_LABEL : numberFormatter.format(value);

export const formatMetricWithUnit = (metric: MetricKey, value: number | null): string => {
  const unit = METRIC_UNITS[metric];
  const formatted = formatMetricValue(value);
  return value !== null && unit ? `${formatted} ${unit}` : formatted;
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
