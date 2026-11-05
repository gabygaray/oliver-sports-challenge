import { alpha, Box, styled } from '@mui/material';

export const StyledSection = styled(Box, {
  shouldForwardProp: prop => prop !== '$emphasis',
})<{ $emphasis?: boolean }>(({ theme, $emphasis }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minWidth: 0,

  ...($emphasis && {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 1.5,
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
