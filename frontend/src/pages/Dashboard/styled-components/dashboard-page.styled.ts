import { Box, styled } from '@mui/material';

/** Chart and AI report share a row on wide screens; the report keeps a readable column width. */
export const StyledAnalysisGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
  gap: theme.spacing(4),
  alignItems: 'start',

  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
}));
