import { Router } from 'express';
import { createSessionReport, streamSessionReport } from './reports.controller';

export const reportsRouter = Router();

reportsRouter.post('/:id/report', createSessionReport);
// EventSource can only GET, so the streaming variant takes its params from the query string.
reportsRouter.get('/:id/report/stream', streamSessionReport);
