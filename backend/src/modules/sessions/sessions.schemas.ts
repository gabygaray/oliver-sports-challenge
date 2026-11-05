import { z } from 'zod';
import { MetricKey } from '../../shared/enums';

export const sessionIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const metricsQuerySchema = z.object({
    player_id: z.coerce.number().int().positive().optional(),
    order_by: z.nativeEnum(MetricKey).optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
});

export type MetricsQuery = z.infer<typeof metricsQuerySchema>;
