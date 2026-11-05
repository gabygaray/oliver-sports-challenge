import { Box, styled } from '@mui/material';

export const StyledReportForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),

  '& .MuiFormControl-root': {
    minWidth: 180,
  },

  [theme.breakpoints.down('sm')]: {
    '& .MuiFormControl-root, & .MuiButton-root': {
      width: '100%',
    },
  },
}));

export const StyledReportSummary = styled('p')(({ theme }) => ({
  margin: 0,
  lineHeight: 1.7,
  color: theme.palette.text.primary,
}));

export const StyledHighlightList = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const StyledAlertChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

/** Live summary while streaming: a blinking caret marks that more text is coming. */
export const StyledStreamingSummary = styled(StyledReportSummary)(({ theme }) => ({
  color: theme.palette.text.secondary,

  '&::after': {
    content: '"▍"',
    marginLeft: theme.spacing(0.25),
    color: theme.palette.primary.main,
    animation: 'blink 1s steps(2, start) infinite',
  },

  '@keyframes blink': {
    to: { visibility: 'hidden' },
  },

  '@media (prefers-reduced-motion: reduce)': {
    '&::after': { animation: 'none' },
  },
}));

export const StyledMetaLine = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const StyledTrendChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));
