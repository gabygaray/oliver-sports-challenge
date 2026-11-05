import { Typography } from '@mui/material';

import { ALERT_LEVEL_LABELS, METRIC_KEYS, METRIC_LABELS } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledLegend, StyledLegendItem, StyledMetricValue } from '../styled-components';
import { getThresholdLegendParts, IThresholdLegendProps } from '../utilities';

export const ThresholdLegend = ({ thresholds }: IThresholdLegendProps) => {
  const entries = METRIC_KEYS.flatMap(metric => {
    const limits = thresholds[metric];
    return limits ? [{ metric, parts: getThresholdLegendParts(metric, limits) }] : [];
  });
  if (!entries.length) return null;

  return (
    <StyledLegend>
      <Typography variant="caption">{DASHBOARD_CONTENT.metrics.legendTitle}:</Typography>
      {entries.map(({ metric, parts }) => (
        <StyledLegendItem key={metric}>
          <span>{METRIC_LABELS[metric]}</span>
          {parts.map(({ level, label }) => (
            <StyledMetricValue
              key={level}
              $level={level}
              title={ALERT_LEVEL_LABELS[level]}
            >
              {label}
            </StyledMetricValue>
          ))}
        </StyledLegendItem>
      ))}
    </StyledLegend>
  );
};
