import { MetricKey } from '../models';
import {
  IReportMetaApiResponse,
  IThresholdAlertApiResponse,
} from './report.service.types';
import { ISessionApiResponse } from './session.service.types';

export enum TAG_TYPES_PLAYERS {
  players = 'players',
}

export interface IPlayerApiResponse {
  player_id: number;
  player_name: string;
  position: string;
  shirt_number: number;
}

export interface IPlayerSessionRowApiResponse {
  session: ISessionApiResponse;
  metrics: Record<MetricKey, number | null>;
  reduced_minutes: boolean;
  alerts: IThresholdAlertApiResponse[];
}

export interface IMetricTrendApiResponse {
  metric: MetricKey;
  first: number | null;
  last: number | null;
  change_pct: number | null;
}

export interface IPlayerEvolutionReportApiResponse {
  player: IPlayerApiResponse;
  sessions: IPlayerSessionRowApiResponse[];
  trends: IMetricTrendApiResponse[];
  summary: string;
  observations: string[];
  meta: IReportMetaApiResponse;
}
