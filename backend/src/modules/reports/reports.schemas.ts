import { z } from 'zod';
import { LEADER_METRICS, SENTENCE_MAX_CHARS, SUMMARY_MAX_CHARS } from './reports.constants';

/** `force` arrives as a boolean in JSON bodies and as "true"/"false" in the SSE query string. */
const booleanLike = z.union([z.boolean(), z.enum(['true', 'false']).transform((value) => value === 'true')]).default(false);

export const reportParamsSchema = z.object({
    language: z.enum(['es', 'en']).default('es'),
    audience: z.enum(['coach', 'player']).default('coach'),
    force: booleanLike,
});

/** What the model must return. Alerts are not here on purpose: they are computed in code. */
export const modelReportSchema = z.object({
    summary: z.string().trim().min(1).max(SUMMARY_MAX_CHARS),
    highlights: z
        .array(
            z.object({
                player_id: z.number().int(),
                // Only the metrics that can justify a highlight; anything else fails on shape with the list of valid values.
                metric: z.enum(LEADER_METRICS),
                value: z.number(),
                reason: z.string().trim().min(1).max(SENTENCE_MAX_CHARS),
            }),
        )
        .max(3),
});

export type ReportParams = z.infer<typeof reportParamsSchema>;
export type ModelReport = z.infer<typeof modelReportSchema>;
