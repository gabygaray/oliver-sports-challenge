import { Typography } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { BRAND_LOGO_SRC, BRAND_NAME, formatLongDate } from '../../../utilities';
import { useSessionFacts } from '../hooks';
import {
  StyledBrand,
  StyledHeroControls,
  StyledHeroTitle,
  StyledHeroTop,
} from '../styled-components';
import { ISessionHeaderProps } from '../utilities';
import { LanguageToggle } from './LanguageToggle';
import { SessionFacts } from './SessionFacts';
import { SessionSelector } from './SessionSelector';

/** Dark band with the session identity and the facts a coach asks first. */
export const SessionHeader = ({ selection, metrics }: ISessionHeaderProps) => {
  const { t, locale } = useLanguage();
  const { sessions, selectedSession, selectedSessionId, isLoading, selectSession } =
    selection;
  const facts = useSessionFacts(metrics.players, metrics.thresholds, selectedSession);

  return (
    <>
      <StyledHeroTop>
        <StyledBrand>
          <img src={BRAND_LOGO_SRC} alt={BRAND_NAME} />
          <span className="brand-divider" aria-hidden />
          <Typography variant="body2">{t.appName}</Typography>
        </StyledBrand>
        <StyledHeroControls>
          <SessionSelector
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            isLoading={isLoading}
            onChange={selectSession}
          />
          <LanguageToggle />
        </StyledHeroControls>
      </StyledHeroTop>

      {selectedSession && (
        <>
          <StyledHeroTitle>
            <Typography component="h1" variant="h3">
              {selectedSession.title}
            </Typography>
            <Typography variant="body1">
              {t.dashboard.hero.subtitle(
                t.sessionTypes[selectedSession.type],
                formatLongDate(selectedSession.date, locale),
                selectedSession.durationMin,
              )}
            </Typography>
          </StyledHeroTitle>
          <SessionFacts facts={facts} isLoading={metrics.isLoading} />
        </>
      )}
    </>
  );
};
