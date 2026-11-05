import { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { enUS, esES } from '@mui/material/locale';

import { ReportLanguage } from '../../models';
import { getTheme } from '../../theme';
import { useLanguage } from '../language-context';
import { IThemeProps } from './theme.types';

const MUI_LOCALES = { [ReportLanguage.Es]: esES, [ReportLanguage.En]: enUS };

/** MUI's own strings (pagination, selects) follow the app language. */
export const Theme = ({ children }: IThemeProps) => {
  const { language } = useLanguage();
  const theme = useMemo(() => createTheme(getTheme(), MUI_LOCALES[language]), [language]);

  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        {children}
      </StyledEngineProvider>
    </ThemeProvider>
  );
};
