import { Chip } from '@mui/material';

import { TrendBasis } from '../../../models';
import { METRIC_LABELS } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledTrendChips } from '../styled-components';
import { formatChangePct, IEvolutionTrendsProps } from '../utilities';

const { evolution } = DASHBOARD_CONTENT;

const trendLabel = (metric: string, basis: TrendBasis): string =>
  basis === TrendBasis.Per90Min ? `${metric} (${evolution.per90})` : metric;

/** Trends are computed by the API, never by the model. */
export const EvolutionTrends = ({ trends }: IEvolutionTrendsProps) => (
  <StyledTrendChips>
    {trends.map(trend => (
      <Chip
        key={trend.metric}
        size="small"
        variant="outlined"
        label={`${trendLabel(METRIC_LABELS[trend.metric], trend.basis)}: ${formatChangePct(trend.changePct, evolution.noTrend)}`}
      />
    ))}
  </StyledTrendChips>
);
