import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),

    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().int().positive().default(5432),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1),

    AI_BASE_URL: z.string().url(),
    // Optional so the API can boot without a key; the report endpoint reports it as unavailable.
    AI_API_KEY: z.string().optional(),
    AI_MODEL: z.string().min(1),
    AI_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
    // Reports are prose over precomputed figures, so model reasoning only adds latency. Unset it for providers that reject the field.
    AI_REASONING_EFFORT: z.preprocess((value) => (value === '' ? undefined : value), z.enum(['none', 'low', 'medium', 'high']).optional()),
    // Gemini counts reasoning tokens against max_tokens; added on top of the prose limit while reasoning is on.
    AI_REASONING_TOKENS_ALLOWANCE: z.coerce.number().int().nonnegative().default(1500),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
