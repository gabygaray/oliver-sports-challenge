import { IPlayerMetrics, ISession, ISessionMetrics, MetricKey } from '../models';
import {
  IPlayerMetricsApiResponse,
  ISessionApiResponse,
  ISessionMetricsApiResponse,
} from '../utilities';

export const toSession = (session: ISessionApiResponse): ISession => ({
  id: session.id,
  date: session.date,
  title: session.title,
  type: session.type,
  durationMin: session.duration_min,
});

export const getSessionsAdapter = (response: ISessionApiResponse[]): ISession[] =>
  response.map(toSession);

const toPlayerMetrics = (row: IPlayerMetricsApiResponse): IPlayerMetrics => ({
  playerId: row.player_id,
  playerName: row.player_name,
  position: row.position,
  shirtNumber: row.shirt_number,
  values: {
    [MetricKey.MinutesPlayed]: row.minutes_played,
    [MetricKey.TotalDistanceM]: row.total_distance_m,
    [MetricKey.HighSpeedRunningM]: row.high_speed_running_m,
    [MetricKey.Sprints]: row.sprints,
    [MetricKey.MaxSpeedKmh]: row.max_speed_kmh,
    [MetricKey.Accelerations]: row.accelerations,
    [MetricKey.Rpe]: row.rpe,
    [MetricKey.WorkloadAu]: row.workload_au,
  },
});

export const getSessionMetricsAdapter = (
  response: ISessionMetricsApiResponse,
): ISessionMetrics => ({
  session: toSession(response.session),
  thresholds: response.thresholds,
  players: response.metrics.map(toPlayerMetrics),
});
