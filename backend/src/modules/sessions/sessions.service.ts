import { Session } from '../../entities/session.entity';
import { HttpError } from '../../shared/http-error';
import { toPlayerMetricsRow, toSessionSummary, toThresholdMap } from './sessions.mappers';
import { findAllSessions, findSessionById, findSessionMetrics, findTeamThresholds } from './sessions.repository';
import { MetricsQuery } from './sessions.schemas';
import { SessionMetricsResponse, SessionSummary } from './sessions.types';

export const getSessions = async (): Promise<SessionSummary[]> => {
    const sessions = await findAllSessions();
    return sessions.map(toSessionSummary);
};

export const getSessionOrFail = async (id: number): Promise<Session> => {
    const session = await findSessionById(id);
    if (!session) throw HttpError.notFound(`Session ${id} not found`);
    return session;
};

export const getSessionMetrics = async (id: number, query: MetricsQuery): Promise<SessionMetricsResponse> => {
    const session = await getSessionOrFail(id);
    const [rows, thresholds] = await Promise.all([findSessionMetrics(id, query), findTeamThresholds(session.teamId)]);

    return {
        session: toSessionSummary(session),
        thresholds: toThresholdMap(thresholds),
        metrics: rows.map(toPlayerMetricsRow),
    };
};
