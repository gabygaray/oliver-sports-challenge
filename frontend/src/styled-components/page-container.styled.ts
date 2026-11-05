import { Box, Container, styled } from '@mui/material';

export const StyledPageHero = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.pitch.main,
  color: theme.palette.pitch.contrastText,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const StyledPageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(5),
}));
