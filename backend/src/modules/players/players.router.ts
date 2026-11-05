import { Router } from 'express';
import { createPlayerEvolutionReport, listPlayers } from './players.controller';

export const playersRouter = Router();

playersRouter.get('/', listPlayers);
playersRouter.post('/:id/evolution-report', createPlayerEvolutionReport);
