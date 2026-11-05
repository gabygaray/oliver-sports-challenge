import { Chip } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { TrendBasis } from '../../../models';
import { StyledTrendChips } from '../styled-components';
import { formatChangePct, IEvolutionTrendsProps } from '../utilities';

/** Trends are computed by the API, never by the model. */
export const EvolutionTrends = ({ trends }: IEvolutionTrendsProps) => {
  const { t } = useLanguage();
  const content = t.dashboard.evolution;
  const trendLabel = (metric: string, basis: TrendBasis): string =>
    basis === TrendBasis.Per90Min ? `${metric} (${content.per90})` : metric;

  return (
    <StyledTrendChips>
      {trends.map(trend => (
        <Chip
          key={trend.metric}
          size="small"
          variant="outlined"
          label={`${trendLabel(t.metricLabels[trend.metric], trend.basis)}: ${formatChangePct(trend.changePct, content.noTrend)}`}
        />
      ))}
    </StyledTrendChips>
  );
};
