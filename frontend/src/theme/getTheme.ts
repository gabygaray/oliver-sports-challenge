import { ThemeOptions } from '@mui/material/styles';

import { customPalette, FONT_FAMILY, TABULAR_FIGURES } from './themePrimitives';

declare module '@mui/material/styles' {
  interface Palette {
    /** The navy band of the OLIVER site: header background, with its deep blue for the glow. */
    brand: Palette['primary'];
  }
  interface PaletteOptions {
    brand?: PaletteOptions['primary'];
  }
}

export const getTheme = (): ThemeOptions => ({
  palette: {
    mode: 'light',
    primary: { main: customPalette.primary, dark: customPalette.primaryDark },
    secondary: { main: customPalette.secondary },
    brand: {
      main: customPalette.brand,
      light: customPalette.brandDeep,
      contrastText: customPalette.brandText,
    },
    warning: { main: customPalette.warning },
    error: { main: customPalette.critical },
    background: { default: customPalette.background, paper: customPalette.paper },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: FONT_FAMILY,
    h3: { fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.02em', lineHeight: 1.15 },
    h6: { fontWeight: 600, fontSize: '1.0625rem' },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    caption: { lineHeight: 1.4 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiChip: {
      styleOverrides: { label: { fontFeatureSettings: TABULAR_FIGURES } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { whiteSpace: 'nowrap', fontFeatureSettings: TABULAR_FIGURES },
        // Eleven columns have to fit a laptop screen without a horizontal scrollbar.
        sizeSmall: { padding: '6px 10px' },
        head: { fontWeight: 600, color: customPalette.primaryDark },
      },
    },
  },
});
