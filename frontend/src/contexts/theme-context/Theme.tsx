import { CssBaseline } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

import { getTheme } from '../../theme';
import { IThemeProps } from './theme.types';

const theme = createTheme(getTheme(), esES);

export const Theme = ({ children }: IThemeProps) => (
  <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      {children}
    </StyledEngineProvider>
  </ThemeProvider>
);
