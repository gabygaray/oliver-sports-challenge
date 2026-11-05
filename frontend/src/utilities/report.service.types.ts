import {
  AlertLevel,
  ISessionReport,
  MetricKey,
  ReportAudience,
  ReportLanguage,
  TReportStage,
} from '../models';
import { ISessionApiResponse } from './session.service.types';

import { IApiError } from './apiError.types';

export interface IReportBody {
  language: ReportLanguage;
  audience: ReportAudience;
  force?: boolean;
}

export interface IReportMetaApiResponse {
  language: ReportLanguage;
  audience: ReportAudience;
  model: string;
  prompt_version: string;
  generated_at: string;
  cached: boolean;
}

/** Callbacks for the SSE channel; `onReport` and `onError` are terminal. */
export interface IReportStreamHandlers {
  onStage: (stage: TReportStage) => void;
  onSummary: (text: string) => void;
  onReport: (report: ISessionReport) => void;
  onError: (error: IApiError) => void;
}

export interface IReportHighlightApiResponse {
  player_id: number;
  player_name: string;
  reason: string;
}

export interface IThresholdAlertApiResponse {
  player_id: number;
  player_name: string;
  metric: MetricKey;
  value: number;
  limit: number;
  level: AlertLevel;
}

export interface ISessionReportApiResponse {
  session: ISessionApiResponse;
  summary: string;
  highlights: IReportHighlightApiResponse[];
  alerts: IThresholdAlertApiResponse[];
  meta: IReportMetaApiResponse;
}
