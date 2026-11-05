import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { playersRouter } from './modules/players/players.router';
import { reportsRouter } from './modules/reports/reports.router';
import { sessionsRouter } from './modules/sessions/sessions.router';

export const createApp = (): Express => {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN }));
    app.use(express.json());
    app.use(pinoHttp({ logger, autoLogging: env.NODE_ENV !== 'test' }));

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    app.use('/sessions', sessionsRouter);
    app.use('/sessions', reportsRouter);
    app.use('/players', playersRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
