/** Greens from the pitch: a deep band for the session header, a teal for actions, two alert tones. */
export const customPalette = {
  primary: '#0f766e',
  primaryDark: '#115e59',
  pitch: '#0b3d2e',
  pitchText: '#f2f7f4',
  warning: '#b45309',
  critical: '#c62828',
  background: '#f6f7f6',
  paper: '#ffffff',
} as const;

/** One family with real tabular figures; metrics columns and session facts line up. */
export const FONT_FAMILY = [
  '"IBM Plex Sans"',
  '-apple-system',
  '"Segoe UI"',
  'sans-serif',
].join(',');

export const TABULAR_FIGURES = '"tnum" 1';
