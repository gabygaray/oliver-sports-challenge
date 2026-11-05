import { z } from 'zod';
import { SENTENCE_MAX_CHARS, SUMMARY_MAX_CHARS } from '../reports/reports.constants';
import { positiveIntParam } from '../sessions/sessions.schemas';

export const playerIdParamsSchema = z.object({
    id: positiveIntParam,
});

/** The model writes prose only; the per-session rows and trends come from code. */
export const modelEvolutionSchema = z.object({
    summary: z.string().trim().min(1).max(SUMMARY_MAX_CHARS),
    observations: z.array(z.string().trim().min(1).max(SENTENCE_MAX_CHARS)).min(2).max(4),
});

export type ModelEvolution = z.infer<typeof modelEvolutionSchema>;
