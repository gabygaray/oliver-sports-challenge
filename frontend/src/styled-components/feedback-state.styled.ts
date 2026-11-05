import { Box, styled } from '@mui/material';

export const StyledFeedbackState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(6, 2),
  textAlign: 'center',
  color: theme.palette.text.secondary,

  '& .feedback-icon': {
    fontSize: 40,
  },
}));
