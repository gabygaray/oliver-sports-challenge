import { Router } from 'express';
import { listSessionMetrics, listSessions } from './sessions.controller';

export const sessionsRouter = Router();

sessionsRouter.get('/', listSessions);
sessionsRouter.get('/:id/metrics', listSessionMetrics);
