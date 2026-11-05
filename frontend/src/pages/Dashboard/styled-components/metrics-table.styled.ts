import { alpha, Box, styled, TableContainer } from '@mui/material';

import { AlertLevel } from '../../../models';
import { ALERT_LEVEL_COLOR } from '../../../utilities';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  position: 'relative',
  overflowX: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

/** Keeps the layout stable while a re-sort is in flight. */
export const StyledTableProgress = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
});

export const StyledMetricValue = styled('span', {
  shouldForwardProp: prop => prop !== '$level',
})<{ $level: AlertLevel | null }>(({ theme, $level }) => {
  if (!$level) return { fontVariantNumeric: 'tabular-nums' };
  const color = theme.palette[ALERT_LEVEL_COLOR[$level]];
  return {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    color: color.dark,
    backgroundColor: alpha(color.main, 0.14),
    padding: theme.spacing(0.25, 1),
    borderRadius: theme.shape.borderRadius,
  };
});

export const StyledLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));
