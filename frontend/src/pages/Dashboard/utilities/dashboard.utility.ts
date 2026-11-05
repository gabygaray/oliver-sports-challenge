import {
  AlertLevel,
  IPlayerMetrics,
  ISession,
  IThresholdAlert,
  IThresholdLimits,
  MetricKey,
  TThresholdMap,
} from '../../../models';
import {
  ALERT_LEVEL_LABELS,
  formatMetricWithUnit,
  getAlertLevel,
  METRIC_KEYS,
  METRIC_LABELS,
} from '../../../utilities';
import { REDUCED_MINUTES_RATIO } from './dashboard.constants';
import { ISessionFacts, TFactTone } from './dashboard.types';

/** What a coach asks first about a session, computed from the rows and thresholds already on screen. */
export const summarizeSession = (
  players: IPlayerMetrics[],
  thresholds: TThresholdMap,
  session: ISession,
): ISessionFacts => {
  const levels = players.flatMap(player =>
    METRIC_KEYS.map(metric => getAlertLevel(player.values[metric], thresholds[metric])),
  );
  return {
    criticalAlerts: levels.filter(level => level === AlertLevel.Critical).length,
    warningAlerts: levels.filter(level => level === AlertLevel.Warning).length,
    reducedMinutesPlayers: players.filter(
      player =>
        (player.values.minutes_played ?? 0) < session.durationMin * REDUCED_MINUTES_RATIO,
    ).length,
    playersWithoutRpe: players.filter(player => player.values.rpe === null).length,
  };
};

/** "Carga: Advertencia > 600 AU · Crítico > 750 AU", or only the warning part when there is no critical limit. */
export const formatThresholdLegend = (
  metric: MetricKey,
  limits: IThresholdLimits,
): string => {
  const parts = [
    `${ALERT_LEVEL_LABELS[AlertLevel.Warning]} > ${formatMetricWithUnit(metric, limits.warning)}`,
  ];
  if (limits.critical !== null) {
    parts.push(
      `${ALERT_LEVEL_LABELS[AlertLevel.Critical]} > ${formatMetricWithUnit(metric, limits.critical)}`,
    );
  }
  return `${METRIC_LABELS[metric]}: ${parts.join(', ')}`;
};

/** "Santiago Molina, carga 810 AU (crítico > 750 AU)" */
export const formatAlertChip = (alert: IThresholdAlert): string =>
  `${alert.playerName}, ${METRIC_LABELS[alert.metric].toLowerCase()} ${formatMetricWithUnit(alert.metric, alert.value)} (${ALERT_LEVEL_LABELS[alert.level].toLowerCase()} > ${formatMetricWithUnit(alert.metric, alert.limit)})`;

/** Tone of a header fact: alert levels keep their color, counts without a level stay neutral. */
export const toFactTone = (level: AlertLevel | null): TFactTone => {
  if (level === AlertLevel.Critical) return 'critical';
  return level === AlertLevel.Warning ? 'warning' : 'neutral';
};

/** Axis labels only have room for the surname, e.g. "Santiago Molina" → "Molina". */
export const toChartLabel = (playerName: string): string =>
  playerName.trim().split(' ').at(-1) ?? playerName;

/** Level of the alert raised for `metric` in a session row, if any. */
export const findAlertLevel = (
  alerts: IThresholdAlert[],
  metric: MetricKey,
): AlertLevel | null => alerts.find(alert => alert.metric === metric)?.level ?? null;

export const formatChangePct = (changePct: number | null, fallback: string): string =>
  changePct === null ? fallback : `${changePct > 0 ? '+' : ''}${changePct} %`;
