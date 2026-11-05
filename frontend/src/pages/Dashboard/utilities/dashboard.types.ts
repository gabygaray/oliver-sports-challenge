import { ReactNode } from 'react';

import { AnalysisTab } from './dashboard.enums';
import {
  AlertLevel,
  IPlayer,
  IMetricTrend,
  IPlayerEvolutionReport,
  IPlayerMetrics,
  IPlayerSessionRow,
  IReportHighlight,
  IReportMeta,
  ISession,
  ISessionReport,
  IThresholdAlert,
  IThresholdLimits,
  MetricKey,
  ReportAudience,
  ReportLanguage,
  TReportStage,
  TSortOrder,
  TThresholdMap,
} from '../../../models';

export interface ISessionFacts {
  criticalAlerts: number;
  warningAlerts: number;
  reducedMinutesPlayers: number;
  playersWithoutRpe: number;
}

export type TFactTone = 'critical' | 'warning' | 'neutral';

export interface ISessionFactItem {
  value: number;
  label: string;
  level: AlertLevel | null;
}

export interface ISessionHeaderProps {
  selection: IUseSessionSelection;
  metrics: IUseSessionMetrics;
}

export interface ISessionFactsProps {
  facts: ISessionFactItem[];
  isLoading: boolean;
}

export interface IMetricsTableSectionProps {
  metrics: IUseSessionMetrics;
}

export interface ISessionSelectorProps {
  sessions: ISession[];
  selectedSessionId: number | null;
  isLoading: boolean;
  onChange: (sessionId: number) => void;
}

export interface IUseSessionSelection {
  sessions: ISession[];
  selectedSession: ISession | null;
  selectedSessionId: number | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  selectSession: (sessionId: number) => void;
  refetch: () => void;
}

export interface ISortState {
  orderBy: MetricKey | null;
  order: TSortOrder;
}

export interface IUseSessionMetrics {
  players: IPlayerMetrics[];
  thresholds: TThresholdMap;
  sort: ISortState;
  toggleSort: (metric: MetricKey) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage: string;
  refetch: () => void;
}

export interface IMetricsTableProps {
  players: IPlayerMetrics[];
  thresholds: TThresholdMap;
  sort: ISortState;
  isFetching: boolean;
  onSort: (metric: MetricKey) => void;
}

export interface IMetricCellProps {
  metric: MetricKey;
  value: number | null;
  limits?: IThresholdLimits;
}

export interface IThresholdLegendProps {
  thresholds: TThresholdMap;
}

/** One limit of the legend: the level gives the color, the label the formatted value. */
export interface IThresholdLegendPart {
  level: AlertLevel;
  label: string;
}

export interface IMetricColumnHeaderProps {
  metric: MetricKey;
}

export interface IChartBar {
  label: string;
  value: number | null;
  level: AlertLevel | null;
}

export interface IChartReferenceLine {
  level: AlertLevel;
  value: number;
  color: string;
  labelColor: string;
}

export interface IUseMetricChart {
  metric: MetricKey;
  setMetric: (metric: MetricKey) => void;
  bars: IChartBar[];
  barColors: string[];
  referenceLines: IChartReferenceLine[];
  /** Top of the Y axis: the highest bar or threshold plus headroom, so a threshold line is never clipped. */
  yMax: number;
}

export interface IAnalysisTabsProps {
  sessionId: number;
}

export interface IAnalysisTabPanelProps {
  tab: AnalysisTab;
  active: AnalysisTab;
  children: ReactNode;
}

export interface IUseAnalysisTabs {
  tab: AnalysisTab;
  selectTab: (tab: AnalysisTab) => void;
}

export interface IMetricChartProps {
  players: IPlayerMetrics[];
  thresholds: TThresholdMap;
}

export interface IReportPanelProps {
  sessionId: number;
}

export interface IReportResultProps {
  report: ISessionReport;
  onRegenerate: () => void;
}

export interface IReportHighlightsProps {
  highlights: IReportHighlight[];
}

export interface IReportAlertsProps {
  alerts: IThresholdAlert[];
}

export interface IReportAlertGroupProps {
  level: AlertLevel;
  alerts: IThresholdAlert[];
}

export interface IReportSkeletonProps {
  message: string;
  /** The summary streamed so far, shown in place of its placeholder lines. */
  summary?: ReactNode;
}

export interface IEvolutionSkeletonProps {
  message: string;
}

export interface IMetricsSectionProps {
  sessionId: number;
}

export type TReportStatus = 'idle' | 'loading' | 'success' | 'error';

export interface IUseReportOptions {
  /** The app language: the report is written in the language the screen is read in. */
  language: ReportLanguage;
  audience: ReportAudience;
  setAudience: (audience: ReportAudience) => void;
}

export interface IReportOptionsProps {
  audience: ReportAudience;
  disabled: boolean;
  setAudience: (audience: ReportAudience) => void;
}

export interface IUseSessionReportStream extends IUseReportOptions {
  status: TReportStatus;
  stage: TReportStage | null;
  /** Summary text received so far while the model is still writing. */
  partialSummary: string;
  report: ISessionReport | null;
  errorMessage: string;
  generate: () => void;
  regenerate: () => void;
}

export interface IUsePlayerEvolution extends IUseReportOptions {
  players: IPlayer[];
  selectedPlayerId: number | null;
  selectPlayer: (playerId: number) => void;
  isLoadingPlayers: boolean;
  report: IPlayerEvolutionReport | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  errorMessage: string;
  generate: () => void;
  regenerate: () => void;
}

export interface IEvolutionTrendsProps {
  trends: IMetricTrend[];
}

export interface IEvolutionSessionsTableProps {
  sessions: IPlayerSessionRow[];
}

export interface IEvolutionResultProps {
  report: IPlayerEvolutionReport;
  onRegenerate: () => void;
}

export interface IReportMetaLineProps {
  meta: IReportMeta;
  onRegenerate: () => void;
}
