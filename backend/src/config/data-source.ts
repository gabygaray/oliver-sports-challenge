import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { Team } from '../entities/team.entity';
import { Player } from '../entities/player.entity';
import { Session } from '../entities/session.entity';
import { PlayerSession } from '../entities/player-session.entity';
import { MetricThreshold } from '../entities/metric-threshold.entity';
import { AiReport } from '../entities/ai-report.entity';
import { InitialSchema1762200000000 } from '../migrations/1762200000000-initial-schema';
import { AiReports1762300000000 } from '../migrations/1762300000000-ai-reports';

export const dataSource = new DataSource({
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [Team, Player, Session, PlayerSession, MetricThreshold, AiReport],
    migrations: [InitialSchema1762200000000, AiReports1762300000000],
    synchronize: false,
    logging: false,
});
