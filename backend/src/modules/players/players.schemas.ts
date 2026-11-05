import { z } from 'zod';

export const playerIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

/** The model writes prose only; the per-session rows and trends come from code. */
export const modelEvolutionSchema = z.object({
    summary: z.string().trim().min(1),
    observations: z.array(z.string().trim().min(1)).min(2).max(4),
});

export type ModelEvolution = z.infer<typeof modelEvolutionSchema>;
