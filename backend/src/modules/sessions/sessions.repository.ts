import { dataSource } from '../../config/data-source';
import { MetricThreshold } from '../../entities/metric-threshold.entity';
import { PlayerSession } from '../../entities/player-session.entity';
import { Session } from '../../entities/session.entity';
import { METRIC_COLUMNS } from './sessions.constants';
import { MetricsQuery } from './sessions.schemas';

export const findAllSessions = (): Promise<Session[]> => dataSource.getRepository(Session).find({ order: { date: 'ASC', id: 'ASC' } });

export const findSessionById = (id: number): Promise<Session | null> => dataSource.getRepository(Session).findOneBy({ id });

export const findSessionMetrics = (sessionId: number, query: MetricsQuery): Promise<PlayerSession[]> => {
    const qb = dataSource
        .getRepository(PlayerSession)
        .createQueryBuilder('ps')
        .innerJoinAndSelect('ps.player', 'player')
        .where('ps.session_id = :sessionId', { sessionId });

    if (query.player_id !== undefined) {
        qb.andWhere('ps.player_id = :playerId', { playerId: query.player_id });
    }

    if (query.order_by) {
        // Nullable metrics (rpe, workload) go last so missing data never tops the ranking.
        qb.orderBy(`ps.${METRIC_COLUMNS[query.order_by]}`, query.order === 'asc' ? 'ASC' : 'DESC', 'NULLS LAST');
    }

    return qb.addOrderBy('player.shirtNumber', 'ASC').getMany();
};

export const findTeamThresholds = (teamId: number): Promise<MetricThreshold[]> => dataSource.getRepository(MetricThreshold).findBy({ teamId });
