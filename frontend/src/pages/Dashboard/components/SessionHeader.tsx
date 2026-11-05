import { Typography } from '@mui/material';

import { formatLongDate } from '../../../utilities';
import { DASHBOARD_CONTENT, SESSION_TYPE_LABELS } from '../content';
import { useSessionFacts } from '../hooks';
import { StyledHeroTitle, StyledHeroTop } from '../styled-components';
import { ISessionHeaderProps } from '../utilities';
import { SessionFacts } from './SessionFacts';
import { SessionSelector } from './SessionSelector';

/** Dark band with the session identity and the facts a coach asks first. */
export const SessionHeader = ({ selection, metrics }: ISessionHeaderProps) => {
  const { sessions, selectedSession, selectedSessionId, isLoading, selectSession } =
    selection;
  const facts = useSessionFacts(metrics.players, metrics.thresholds, selectedSession);

  return (
    <>
      <StyledHeroTop>
        <Typography variant="body2">{DASHBOARD_CONTENT.appName}</Typography>
        <SessionSelector
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          isLoading={isLoading}
          onChange={selectSession}
        />
      </StyledHeroTop>

      {selectedSession && (
        <>
          <StyledHeroTitle>
            <Typography component="h1" variant="h3">
              {selectedSession.title}
            </Typography>
            <Typography variant="body1">
              {SESSION_TYPE_LABELS[selectedSession.type]} del{' '}
              {formatLongDate(selectedSession.date)}, {selectedSession.durationMin}{' '}
              {DASHBOARD_CONTENT.hero.durationSuffix}
            </Typography>
          </StyledHeroTitle>
          <SessionFacts facts={facts} isLoading={metrics.isLoading} />
        </>
      )}
    </>
  );
};
