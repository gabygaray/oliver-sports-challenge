import { z } from 'zod';
import { MetricKey } from '../../shared/enums';

/** Coerced from the URL, so a non-numeric value reads as "must be a number" instead of "received nan". */
export const positiveIntParam = z.coerce.number({ invalid_type_error: 'must be a number' }).int().positive();

export const sessionIdParamsSchema = z.object({
    id: positiveIntParam,
});

export const metricsQuerySchema = z.object({
    player_id: positiveIntParam.optional(),
    order_by: z.nativeEnum(MetricKey).optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
});

export type MetricsQuery = z.infer<typeof metricsQuerySchema>;
