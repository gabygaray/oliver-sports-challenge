import { IReportMeta, ISessionReport, IThresholdAlert } from '../models';
import {
  IReportMetaApiResponse,
  ISessionReportApiResponse,
  IThresholdAlertApiResponse,
} from '../utilities';
import { toSession } from './session.adapter';

export const toThresholdAlert = (alert: IThresholdAlertApiResponse): IThresholdAlert => ({
  playerId: alert.player_id,
  playerName: alert.player_name,
  metric: alert.metric,
  value: alert.value,
  limit: alert.limit,
  level: alert.level,
});

export const toReportMeta = (meta: IReportMetaApiResponse): IReportMeta => ({
  language: meta.language,
  audience: meta.audience,
  model: meta.model,
  promptVersion: meta.prompt_version,
  generatedAt: meta.generated_at,
  cached: meta.cached,
});

export const getSessionReportAdapter = (
  response: ISessionReportApiResponse,
): ISessionReport => ({
  session: toSession(response.session),
  summary: response.summary,
  highlights: response.highlights.map(highlight => ({
    playerId: highlight.player_id,
    playerName: highlight.player_name,
    reason: highlight.reason,
  })),
  alerts: response.alerts.map(toThresholdAlert),
  meta: toReportMeta(response.meta),
});
