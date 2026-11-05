import { ToggleButton } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { ReportLanguage } from '../../../models';
import { StyledHeroToggle } from '../styled-components';

/** ES / EN switch for the whole app; a null value means the active button was clicked again. */
export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <StyledHeroToggle
      size="small"
      exclusive
      value={language}
      onChange={(_event, value: ReportLanguage | null) => value && setLanguage(value)}
      aria-label={t.languageToggleLabel}
    >
      {Object.values(ReportLanguage).map(value => (
        <ToggleButton key={value} value={value} aria-label={t.languageNames[value]}>
          {value.toUpperCase()}
        </ToggleButton>
      ))}
    </StyledHeroToggle>
  );
};
