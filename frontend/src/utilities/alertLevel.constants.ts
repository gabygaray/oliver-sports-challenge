import { AlertLevel } from '../models';

/** Palette slot each level maps to, shared by table cells, chart bars and report chips. */
export const ALERT_LEVEL_COLOR: Record<AlertLevel, 'warning' | 'error'> = {
  [AlertLevel.Warning]: 'warning',
  [AlertLevel.Critical]: 'error',
};
