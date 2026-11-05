import { Request, Response } from 'express';
import { reportParamsSchema } from '../reports/reports.schemas';
import { playerIdParamsSchema } from './players.schemas';
import { generatePlayerEvolutionReport, getPlayers } from './players.service';

export const listPlayers = async (_req: Request, res: Response): Promise<void> => {
    res.json(await getPlayers());
};

export const createPlayerEvolutionReport = async (req: Request, res: Response): Promise<void> => {
    const { id } = playerIdParamsSchema.parse(req.params);
    const params = reportParamsSchema.parse(req.body ?? {});
    res.json(await generatePlayerEvolutionReport(id, params));
};
