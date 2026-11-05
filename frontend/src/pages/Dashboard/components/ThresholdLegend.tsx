import { Chip, Typography } from '@mui/material';

import { METRIC_KEYS } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledLegend } from '../styled-components';
import { formatThresholdLegend, IThresholdLegendProps } from '../utilities';

export const ThresholdLegend = ({ thresholds }: IThresholdLegendProps) => {
  const entries = METRIC_KEYS.flatMap(metric => {
    const limits = thresholds[metric];
    return limits ? [{ metric, label: formatThresholdLegend(metric, limits) }] : [];
  });
  if (!entries.length) return null;

  return (
    <StyledLegend>
      <Typography variant="caption">{DASHBOARD_CONTENT.metrics.legendTitle}:</Typography>
      {entries.map(({ metric, label }) => (
        <Chip key={metric} size="small" variant="outlined" label={label} />
      ))}
    </StyledLegend>
  );
};
