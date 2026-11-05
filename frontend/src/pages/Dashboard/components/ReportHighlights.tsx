import { Typography } from '@mui/material';

import { StyledHighlightList } from '../styled-components';
import { IReportHighlightsProps } from '../utilities';

export const ReportHighlights = ({ highlights }: IReportHighlightsProps) => (
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
