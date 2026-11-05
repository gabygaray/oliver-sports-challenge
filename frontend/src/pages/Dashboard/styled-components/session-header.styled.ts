import { alpha, Box, FormControl, styled, ToggleButtonGroup } from '@mui/material';

import { TFactTone } from '../utilities';

export const StyledHeroTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const StyledHeroTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  maxWidth: '40rem',
}));

/** The session select sits on the dark band, so field, label and icon take the band's text color. */
export const StyledHeroSelect = styled(FormControl)(({ theme }) => {
  const text = theme.palette.pitch.contrastText;
  return {
    minWidth: 360,
    [theme.breakpoints.down('sm')]: { width: '100%', minWidth: 0 },

    '& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': {
      color: alpha(text, 0.8),
    },
    '& .MuiOutlinedInput-root': {
      color: text,
      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(text, 0.45) },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(text, 0.8) },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: text },
    },
    '& .MuiSelect-icon': { color: alpha(text, 0.8) },
  };
});

export const StyledFactList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: theme.spacing(3, 0, 0),
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5, 4),
}));

/** Alert tones are lightened versions of the palette so they stay legible on the dark band. */
export const StyledFact = styled('li', {
  shouldForwardProp: prop => prop !== '$tone',
})<{ $tone: TFactTone }>(({ theme, $tone }) => {
  const text = theme.palette.pitch.contrastText;
  const toneColor = {
    critical: theme.palette.error.light,
    warning: theme.palette.warning.light,
    neutral: text,
  }[$tone];
  return {
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(1),
    color: alpha(text, 0.85),

    '& .fact-value': {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '-0.02em',
      fontFeatureSettings: '"tnum" 1',
      color: toneColor,
    },
  };
});

export const StyledHeroControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

/** Language switch on the dark band: light borders and text, the selected one filled. */
export const StyledHeroToggle = styled(ToggleButtonGroup)(({ theme }) => {
  const text = theme.palette.pitch.contrastText;
  return {
    '& .MuiToggleButton-root': {
      color: alpha(text, 0.85),
      borderColor: alpha(text, 0.45),
      paddingInline: theme.spacing(1.5),
      fontWeight: 600,
    },
    '& .MuiToggleButton-root.Mui-selected': {
      color: theme.palette.pitch.main,
      backgroundColor: text,
    },
    '& .MuiToggleButton-root.Mui-selected:hover': {
      backgroundColor: alpha(text, 0.9),
    },
  };
});
