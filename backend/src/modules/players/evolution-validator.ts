import { findProseOutsideContext } from '../reports/report-validator';
import { ModelEvolution } from './players.schemas';
import { EvolutionContext } from './players.types';

/** The prose may only quote figures and names that exist in the context; integers up to the session count pass as counts. */
export const validateEvolutionAgainstContext = (report: ModelEvolution, context: EvolutionContext): string[] =>
    findProseOutsideContext([report.summary, ...report.observations], context, context.sessions.length);
