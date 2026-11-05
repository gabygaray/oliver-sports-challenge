import { Chip } from '@mui/material';

import { METRIC_LABELS } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledTrendChips } from '../styled-components';
import { formatChangePct, IEvolutionTrendsProps } from '../utilities';

/** Trends are computed by the API, never by the model. */
export const EvolutionTrends = ({ trends }: IEvolutionTrendsProps) => (
  <StyledTrendChips>
    {trends.map(trend => (
      <Chip
        key={trend.metric}
        size="small"
        variant="outlined"
        label={`${METRIC_LABELS[trend.metric]}: ${formatChangePct(trend.changePct, DASHBOARD_CONTENT.evolution.noTrend)}`}
      />
    ))}
  </StyledTrendChips>
);
