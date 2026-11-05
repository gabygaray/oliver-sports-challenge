import { Request, Response } from 'express';
import { toErrorResponse } from '../../middlewares/error-handler';
import { openEventStream } from '../../shared/event-stream';
import { sessionIdParamsSchema } from '../sessions/sessions.schemas';
import { reportParamsSchema } from './reports.schemas';
import { generateSessionReport } from './reports.service';

export const createSessionReport = async (req: Request, res: Response): Promise<void> => {
    const { id } = sessionIdParamsSchema.parse(req.params);
    const params = reportParamsSchema.parse(req.body ?? {});
    res.json(await generateSessionReport(id, params));
};

/**
 * Same report over Server-Sent Events: `status` for progress, `summary` with the text so far,
 * then one final `report` or `error`. Invalid params still fail with a regular 400 before the stream opens.
 */
export const streamSessionReport = async (req: Request, res: Response): Promise<void> => {
    const { id } = sessionIdParamsSchema.parse(req.params);
    const params = reportParamsSchema.parse(req.query);
    const stream = openEventStream(req, res);

    try {
        const report = await generateSessionReport(id, params, {
            signal: stream.signal,
            onStage: (stage) => stream.send('status', { stage }),
            onSummary: (text) => stream.send('summary', { text }),
        });
        stream.send('report', report);
    } catch (error) {
        stream.send('error', toErrorResponse(error).body.error);
    } finally {
        stream.close();
    }
};
