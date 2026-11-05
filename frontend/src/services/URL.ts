const BASE_PATH_SESSIONS = 'sessions';
const BASE_PATH_PLAYERS = 'players';

export const QUERY_URL_SESSIONS = {
  getBasePathSessions: () => `${BASE_PATH_SESSIONS}`,
  sessionMetrics: (sessionId: number) => `${BASE_PATH_SESSIONS}/${sessionId}/metrics`,
  sessionReport: (sessionId: number) => `${BASE_PATH_SESSIONS}/${sessionId}/report`,
  sessionReportStream: (sessionId: number) =>
    `${BASE_PATH_SESSIONS}/${sessionId}/report/stream`,
};

export const QUERY_URL_PLAYERS = {
  getBasePathPlayers: () => `${BASE_PATH_PLAYERS}`,
  playerEvolutionReport: (playerId: number) =>
    `${BASE_PATH_PLAYERS}/${playerId}/evolution-report`,
};
