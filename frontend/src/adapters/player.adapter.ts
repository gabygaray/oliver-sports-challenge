import { IPlayer, IPlayerEvolutionReport } from '../models';
import { IPlayerApiResponse, IPlayerEvolutionReportApiResponse } from '../utilities';
import { toReportMeta, toThresholdAlert } from './report.adapter';
import { toSession } from './session.adapter';

const toPlayer = (player: IPlayerApiResponse): IPlayer => ({
  playerId: player.player_id,
  playerName: player.player_name,
  position: player.position,
  shirtNumber: player.shirt_number,
});

export const getPlayersAdapter = (response: IPlayerApiResponse[]): IPlayer[] =>
  response.map(toPlayer);

export const getPlayerEvolutionAdapter = (
  response: IPlayerEvolutionReportApiResponse,
): IPlayerEvolutionReport => ({
  player: toPlayer(response.player),
  sessions: response.sessions.map(row => ({
    session: toSession(row.session),
    values: row.metrics,
    reducedMinutes: row.reduced_minutes,
    alerts: row.alerts.map(toThresholdAlert),
  })),
  trends: response.trends.map(trend => ({
    metric: trend.metric,
    first: trend.first,
    last: trend.last,
    changePct: trend.change_pct,
  })),
  summary: response.summary,
  observations: response.observations,
  meta: toReportMeta(response.meta),
});
