import { SyntheticEvent } from 'react';

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
  formatMetricWithUnit,
  getAlertLevel,
  METRIC_KEYS,
  METRIC_LABELS,
} from '../../../utilities';
import { REDUCED_MINUTES_RATIO } from './dashboard.constants';
import { ISessionFacts, IThresholdLegendPart, TFactTone } from './dashboard.types';

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

/** "> 600 AU" per level, so the legend paints each limit with the same color as the table cells. */
export const getThresholdLegendParts = (
  metric: MetricKey,
  limits: IThresholdLimits,
): IThresholdLegendPart[] => {
  const parts = [
    {
      level: AlertLevel.Warning,
      label: `> ${formatMetricWithUnit(metric, limits.warning)}`,
    },
  ];
  if (limits.critical !== null) {
    parts.push({
      level: AlertLevel.Critical,
      label: `> ${formatMetricWithUnit(metric, limits.critical)}`,
    });
  }
  return parts;
};

/** Lowercases a label for mid-sentence use; an acronym such as RPE keeps its capitals. */
const inSentence = (label: string): string =>
  label === label.toUpperCase() ? label : label.toLowerCase();

/** "Santiago Molina, carga 810 AU (> 750 AU)"; the level is the group the chip sits in. */
export const formatAlertChip = (alert: IThresholdAlert): string =>
  `${alert.playerName}, ${inSentence(METRIC_LABELS[alert.metric])} ${formatMetricWithUnit(alert.metric, alert.value)} (> ${formatMetricWithUnit(alert.metric, alert.limit)})`;

export const groupAlertsByLevel = (
  alerts: IThresholdAlert[],
): Record<AlertLevel, IThresholdAlert[]> => ({
  [AlertLevel.Critical]: alerts.filter(alert => alert.level === AlertLevel.Critical),
  [AlertLevel.Warning]: alerts.filter(alert => alert.level === AlertLevel.Warning),
});

/** Tone of a header fact: alert levels keep their color, counts without a level stay neutral. */
export const toFactTone = (level: AlertLevel | null): TFactTone => {
  if (level === AlertLevel.Critical) return 'critical';
  return level === AlertLevel.Warning ? 'warning' : 'neutral';
};

/** Level of the alert raised for `metric` in a session row, if any. */
export const findAlertLevel = (
  alerts: IThresholdAlert[],
  metric: MetricKey,
): AlertLevel | null => alerts.find(alert => alert.metric === metric)?.level ?? null;

/** For controls nested in a clickable header: opening the info must not trigger the sort. */
export const stopEventPropagation = (event: SyntheticEvent): void =>
  event.stopPropagation();

export const analysisTabId = (tab: string): string => `analysis-tab-${tab}`;

export const analysisPanelId = (tab: string): string => `analysis-panel-${tab}`;

export const formatChangePct = (changePct: number | null, fallback: string): string =>
  changePct === null ? fallback : `${changePct > 0 ? '+' : ''}${changePct} %`;
