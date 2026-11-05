import { Typography } from '@mui/material';

import { DASHBOARD_CONTENT } from '../content';
import { StyledHighlightList } from '../styled-components';
import { IReportHighlightsProps } from '../utilities';

export const ReportHighlights = ({ highlights }: IReportHighlightsProps) =>
  highlights.length === 0 ? (
    <Typography variant="body2" color="text.secondary">
      {DASHBOARD_CONTENT.report.highlightsEmpty}
    </Typography>
  ) : (
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
