import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';

import { AlertLevel, IPlayerMetrics, MetricKey, TThresholdMap } from '../../../models';
import { ALERT_LEVEL_COLOR, getAlertLevel } from '../../../utilities';
import {
  CHART_HEADROOM,
  DEFAULT_CHART_METRIC,
  IChartBar,
  IChartReferenceLine,
  IUseMetricChart,
} from '../utilities';

/** One bar per player for the chosen metric, colored by the alert level it reaches, plus the threshold lines. */
export const useMetricChart = (
  players: IPlayerMetrics[],
  thresholds: TThresholdMap,
): IUseMetricChart => {
  const { palette } = useTheme();
  const [metric, setMetric] = useState<MetricKey>(DEFAULT_CHART_METRIC);
  const limits = thresholds[metric];

  const bars = useMemo<IChartBar[]>(
    () =>
      players.map(player => ({
        label: player.playerName,
        value: player.values[metric],
        level: getAlertLevel(player.values[metric], limits),
      })),
    [players, metric, limits],
  );

  const barColors = useMemo(
    () =>
      bars.map(({ level }) =>
        level ? palette[ALERT_LEVEL_COLOR[level]].main : palette.primary.main,
      ),
    [bars, palette],
  );

  const referenceLines = useMemo<IChartReferenceLine[]>(() => {
    const candidates = [
      { level: AlertLevel.Warning, value: limits?.warning ?? null },
      { level: AlertLevel.Critical, value: limits?.critical ?? null },
    ];
    return candidates.flatMap(({ level, value }) =>
      value === null
        ? []
        : [
            {
              level,
              value,
              color: palette[ALERT_LEVEL_COLOR[level]].main,
              labelColor: palette[ALERT_LEVEL_COLOR[level]].dark,
            },
          ],
    );
  }, [limits, palette]);

  const yMax = useMemo(() => {
    const values = [
      ...bars.map(({ value }) => value ?? 0),
      ...referenceLines.map(({ value }) => value),
    ];
    return Math.max(...values, 0) * CHART_HEADROOM;
  }, [bars, referenceLines]);

  return { metric, setMetric, bars, barColors, referenceLines, yMax };
};
