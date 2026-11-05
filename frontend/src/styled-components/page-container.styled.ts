import { Box, Container, styled } from '@mui/material';

export const StyledPageHero = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.brand.main,
  backgroundImage: `radial-gradient(ellipse at 50% 0%, ${theme.palette.brand.light} 0, ${theme.palette.brand.main} 65%)`,
  color: theme.palette.brand.contrastText,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const StyledPageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));
