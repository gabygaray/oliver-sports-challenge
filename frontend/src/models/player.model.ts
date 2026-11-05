import { MetricKey } from './metric.enums';
import { ReportAudience, ReportLanguage } from './report.enums';
import { IReportMeta, IThresholdAlert } from './report.model';
import { ISession } from './session.model';

export interface IPlayer {
  playerId: number;
  playerName: string;
  position: string;
  shirtNumber: number;
}

export interface IPlayerSessionRow {
  session: ISession;
  values: Record<MetricKey, number | null>;
  /** Under 75% of the session minutes: totals are not comparable with other sessions. */
  reducedMinutes: boolean;
  alerts: IThresholdAlert[];
}

export interface IMetricTrend {
  metric: MetricKey;
  first: number | null;
  last: number | null;
  changePct: number | null;
}

export interface IPlayerEvolutionReport {
  player: IPlayer;
  sessions: IPlayerSessionRow[];
  trends: IMetricTrend[];
  summary: string;
  observations: string[];
  meta: IReportMeta;
}

export interface IEvolutionParams {
  playerId: number;
  language: ReportLanguage;
  audience: ReportAudience;
  force?: boolean;
}
