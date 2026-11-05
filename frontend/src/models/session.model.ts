import { MetricKey } from './metric.enums';
import { SessionType } from './session.enums';

export type TSortOrder = 'asc' | 'desc';

export interface ISession {
  id: number;
  date: string;
  title: string;
  type: SessionType;
  durationMin: number;
}

/** Metric values are keyed by MetricKey so table columns and chart series can read them generically. */
export interface IPlayerMetrics {
  playerId: number;
  playerName: string;
  position: string;
  shirtNumber: number;
  values: Record<MetricKey, number | null>;
}

export interface IThresholdLimits {
  warning: number;
  critical: number | null;
}

export type TThresholdMap = Partial<Record<MetricKey, IThresholdLimits>>;

export interface ISessionMetrics {
  session: ISession;
  thresholds: TThresholdMap;
  players: IPlayerMetrics[];
}

export interface IMetricsQuery {
  sessionId: number;
  playerId?: number;
  orderBy?: MetricKey;
  order?: TSortOrder;
}
