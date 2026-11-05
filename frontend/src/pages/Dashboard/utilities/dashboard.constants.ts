import { MetricKey } from '../../../models';
import { ISortState } from './dashboard.types';

export const DEFAULT_CHART_METRIC = MetricKey.TotalDistanceM;

/** Same cut-off the API uses: under this share of the session minutes a player's totals are not comparable. */
export const REDUCED_MINUTES_RATIO = 0.75;

export const CHART_HEIGHT = 380;

/** Full names on a band axis of twelve players only fit tilted; the bottom margin makes room for them. */
export const CHART_AXIS_LABEL_STYLE = { angle: -35, textAnchor: 'end' } as const;
export const CHART_MARGIN = { left: 88, bottom: 112 };

/** No column means the API default order: by shirt number. */
export const INITIAL_SORT: ISortState = { orderBy: null, order: 'desc' };

/** Ids that tie each select to its label for assistive technology. */
export const SELECT_LABEL_IDS = {
  session: 'session-selector-label',
  chartMetric: 'chart-metric-label',
  reportLanguage: 'report-language-label',
  reportAudience: 'report-audience-label',
  player: 'evolution-player-label',
} as const;

/** Bars with no alert use the primary color; the others take the level color. */
export const CHART_LABEL_KEY = 'label';
export const CHART_VALUE_KEY = 'value';

/** Metrics shown in the evolution table and trend chips; minutes are context, not a trend. */
export const EVOLUTION_METRICS = [
  MetricKey.TotalDistanceM,
  MetricKey.HighSpeedRunningM,
  MetricKey.Sprints,
  MetricKey.MaxSpeedKmh,
  MetricKey.Accelerations,
  MetricKey.Rpe,
  MetricKey.WorkloadAu,
] as const;
