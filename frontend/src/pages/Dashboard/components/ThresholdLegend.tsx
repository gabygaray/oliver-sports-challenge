import { Typography } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { METRIC_KEYS } from '../../../utilities';
import { StyledLegend, StyledLegendItem, StyledMetricValue } from '../styled-components';
import { getThresholdLegendParts, IThresholdLegendProps } from '../utilities';

export const ThresholdLegend = ({ thresholds }: IThresholdLegendProps) => {
  const { t, locale } = useLanguage();
  const entries = METRIC_KEYS.flatMap(metric => {
    const limits = thresholds[metric];
    return limits
      ? [{ metric, parts: getThresholdLegendParts(metric, limits, locale) }]
      : [];
  });
  if (!entries.length) return null;

  return (
    <StyledLegend>
      <Typography variant="caption">{t.dashboard.metrics.legendTitle}:</Typography>
      {entries.map(({ metric, parts }) => (
        <StyledLegendItem key={metric}>
          <span>{t.metricLabels[metric]}</span>
          {parts.map(({ level, label }) => (
            <StyledMetricValue key={level} $level={level} title={t.alertLevels[level]}>
              {label}
            </StyledMetricValue>
          ))}
        </StyledLegendItem>
      ))}
    </StyledLegend>
  );
};
