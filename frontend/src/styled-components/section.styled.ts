import { alpha, Box, styled } from '@mui/material';

/** Every section is a card on the grey page background, so the blocks read as separate units; the emphasised one is tinted. */
export const StyledSection = styled(Box, {
  shouldForwardProp: prop => prop !== '$emphasis',
})<{ $emphasis?: boolean }>(({ theme, $emphasis }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minWidth: 0,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },

  ...($emphasis && {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  }),
}));

export const StyledSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));
