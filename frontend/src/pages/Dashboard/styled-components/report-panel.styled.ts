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

/** Prose on the left, alerts in a narrower column on the right; one column below the md breakpoint. */
export const StyledReportLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)',
  gap: theme.spacing(4),
  alignItems: 'start',

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: theme.spacing(2.5),
  },
}));

export const StyledAlertsColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

/** Chips stacked vertically in the column; they wrap in rows when the column drops below the prose. */
export const StyledAlertGroupChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),

  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
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
