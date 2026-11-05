import { MetricKey, SessionType } from '../models';

export enum TAG_TYPES_SESSIONS {
  sessions = 'sessions',
}

export interface ISessionApiResponse {
  id: number;
  date: string;
  title: string;
  type: SessionType;
  duration_min: number;
}

export interface IPlayerMetricsApiResponse {
  player_id: number;
  player_name: string;
  position: string;
  shirt_number: number;
  minutes_played: number;
  total_distance_m: number;
  high_speed_running_m: number;
  sprints: number;
  max_speed_kmh: number;
  accelerations: number;
  rpe: number | null;
  workload_au: number | null;
}

export interface IThresholdLimitsApiResponse {
  warning: number;
  critical: number | null;
}

export interface ISessionMetricsApiResponse {
  session: ISessionApiResponse;
  thresholds: Partial<Record<MetricKey, IThresholdLimitsApiResponse>>;
  metrics: IPlayerMetricsApiResponse[];
}

export interface IMetricsQueryParams {
  player_id?: number;
  order_by?: MetricKey;
  order?: 'asc' | 'desc';
}
