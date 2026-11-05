import { z } from 'zod';
import { MetricKey, SessionType } from '../shared/enums';

const thresholdSchema = z.object({ warning: z.number(), critical: z.number().optional() });

const playerSessionSchema = z.object({
    player_id: z.number().int(),
    minutes_played: z.number().int(),
    total_distance_m: z.number().int(),
    high_speed_running_m: z.number().int(),
    sprints: z.number().int(),
    max_speed_kmh: z.number(),
    accelerations: z.number().int(),
    rpe: z.number().int().nullable(),
    workload_au: z.number().int().nullable(),
});

/** Shape of session_data.json. Validated before touching the database so a broken file fails fast. */
export const seedFileSchema = z.object({
    team: z.object({ id: z.number().int(), name: z.string(), sport: z.string() }),
    thresholds: z.record(z.nativeEnum(MetricKey), thresholdSchema),
    players: z.array(
        z.object({
            id: z.number().int(),
            name: z.string(),
            position: z.string().max(3),
            shirt_number: z.number().int(),
        }),
    ),
    sessions: z.array(
        z.object({
            id: z.number().int(),
            date: z.string().date(),
            title: z.string(),
            type: z.nativeEnum(SessionType),
            duration_min: z.number().int(),
            player_sessions: z.array(playerSessionSchema),
        }),
    ),
});

export type SeedFile = z.infer<typeof seedFileSchema>;
