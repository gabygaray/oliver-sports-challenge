import { AlertLevel, MetricKey } from './metric.enums';
import { ReportAudience, ReportLanguage } from './report.enums';
import { ISession } from './session.model';

export interface IReportParams {
  sessionId: number;
  language: ReportLanguage;
  audience: ReportAudience;
  /** Skips the server cache and asks the model again. */
  force?: boolean;
}

export type TReportStage = 'cached' | 'generating' | 'retrying';

export interface IReportHighlight {
  playerId: number;
  playerName: string;
  reason: string;
}

export interface IThresholdAlert {
  playerId: number;
  playerName: string;
  metric: MetricKey;
  value: number;
  limit: number;
  level: AlertLevel;
}

export interface IReportMeta {
  language: ReportLanguage;
  audience: ReportAudience;
  model: string;
  promptVersion: string;
  generatedAt: string;
  cached: boolean;
}

export interface ISessionReport {
  session: ISession;
  summary: string;
  highlights: IReportHighlight[];
  alerts: IThresholdAlert[];
  meta: IReportMeta;
}
