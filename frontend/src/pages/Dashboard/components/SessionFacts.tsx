import { Skeleton, Typography } from '@mui/material';

import { DASHBOARD_CONTENT } from '../content';
import { StyledFact, StyledFactList } from '../styled-components';
import { ISessionFactsProps, toFactTone } from '../utilities';

export const SessionFacts = ({ facts, isLoading }: ISessionFactsProps) => (
  <StyledFactList>
    {isLoading && (
      <li>
        <Skeleton variant="text" width={240} />
      </li>
    )}
    {!isLoading && !facts.length && (
      <Typography component="li" variant="body2">
        {DASHBOARD_CONTENT.hero.noFacts}
      </Typography>
    )}
    {!isLoading &&
      facts.map(fact => (
        <StyledFact key={fact.label} $tone={toFactTone(fact.level)}>
          <span className="fact-value">{fact.value}</span>
          <span>{fact.label.slice(String(fact.value).length + 1)}</span>
        </StyledFact>
      ))}
  </StyledFactList>
);
