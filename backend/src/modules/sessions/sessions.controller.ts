import { Request, Response } from 'express';
import { metricsQuerySchema, sessionIdParamsSchema } from './sessions.schemas';
import { getSessionMetrics, getSessions } from './sessions.service';

export const listSessions = async (_req: Request, res: Response): Promise<void> => {
    res.json(await getSessions());
};

export const listSessionMetrics = async (req: Request, res: Response): Promise<void> => {
    const { id } = sessionIdParamsSchema.parse(req.params);
    const query = metricsQuerySchema.parse(req.query);
    res.json(await getSessionMetrics(id, query));
};
