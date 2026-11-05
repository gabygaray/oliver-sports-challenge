import { readFileSync } from 'node:fs';
import path from 'node:path';
import { EntityManager } from 'typeorm';
import { dataSource } from '../config/data-source';
import { logger } from '../config/logger';
import { MetricThreshold } from '../entities/metric-threshold.entity';
import { Player } from '../entities/player.entity';
import { PlayerSession } from '../entities/player-session.entity';
import { Session } from '../entities/session.entity';
import { Team } from '../entities/team.entity';
import { MetricKey } from '../shared/enums';
import { SeedFile, seedFileSchema } from './seed.schema';

const DATA_FILE = path.resolve(__dirname, '../../session_data.json');

/** Loads session_data.json. Upserts keep the script idempotent: re-running updates rows instead of failing. */
const seed = async (manager: EntityManager, data: SeedFile): Promise<void> => {
    const teamId = data.team.id;

    await manager.getRepository(Team).upsert({ id: teamId, name: data.team.name, sport: data.team.sport }, ['id']);

    await manager.getRepository(Player).upsert(
        data.players.map((player) => ({ id: player.id, teamId, name: player.name, position: player.position, shirtNumber: player.shirt_number })),
        ['id'],
    );

    await manager.getRepository(MetricThreshold).upsert(
        Object.entries(data.thresholds).map(([metric, limits]) => ({
            teamId,
            metric: metric as MetricKey,
            warning: limits.warning,
            critical: limits.critical ?? null,
        })),
        ['teamId', 'metric'],
    );

    for (const session of data.sessions) {
        await manager
            .getRepository(Session)
            .upsert({ id: session.id, teamId, date: session.date, title: session.title, type: session.type, durationMin: session.duration_min }, [
                'id',
            ]);

        await manager.getRepository(PlayerSession).upsert(
            session.player_sessions.map((row) => ({
                sessionId: session.id,
                playerId: row.player_id,
                minutesPlayed: row.minutes_played,
                totalDistanceM: row.total_distance_m,
                highSpeedRunningM: row.high_speed_running_m,
                sprints: row.sprints,
                maxSpeedKmh: row.max_speed_kmh,
                accelerations: row.accelerations,
                rpe: row.rpe,
                workloadAu: row.workload_au,
            })),
            ['sessionId', 'playerId'],
        );
    }
};

const run = async (): Promise<void> => {
    const data = seedFileSchema.parse(JSON.parse(readFileSync(DATA_FILE, 'utf8')));

    await dataSource.initialize();
    try {
        await dataSource.transaction((manager) => seed(manager, data));
        logger.info(
            { players: data.players.length, sessions: data.sessions.length, thresholds: Object.keys(data.thresholds).length },
            'Seed completed',
        );
    } finally {
        await dataSource.destroy();
    }
};

run().catch((error) => {
    logger.error(error, 'Seed failed');
    process.exit(1);
});
