import { Box, styled, Tabs } from '@mui/material';

export const StyledAnalysisTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(-1),
}));

/** Same vertical rhythm as a section body, so a panel reads like the card it replaced. */
export const StyledTabPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minWidth: 0,
  // Empty, error and loading states keep a height close to a result, so the card does not jump.
  [theme.breakpoints.up('md')]: {
    minHeight: 420,
  },

  // display:flex would override the hidden attribute of the inactive panel.
  '&[hidden]': {
    display: 'none',
  },
}));
