import { Typography } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { StyledHighlightList } from '../styled-components';
import { IReportHighlightsProps } from '../utilities';

export const ReportHighlights = ({ highlights }: IReportHighlightsProps) => {
  const { t } = useLanguage();

  if (highlights.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t.dashboard.report.highlightsEmpty}
      </Typography>
    );
  }

  return (
    <StyledHighlightList>
      {highlights.map(highlight => (
        <li key={highlight.playerId}>
          <Typography component="span" variant="subtitle2">
            {highlight.playerName}
          </Typography>
          <Typography component="span" variant="body2" color="text.secondary">
            {': '}
            {highlight.reason}
          </Typography>
        </li>
      ))}
    </StyledHighlightList>
  );
};
