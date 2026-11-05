import { env } from '../config/env';
import { AiClient } from './ai.types';
import { OpenAiCompatibleClient } from './openai-compatible.client';

/** Built once at startup from the validated env; null when no API key is set. */
const aiClient: AiClient | null = env.AI_API_KEY
    ? new OpenAiCompatibleClient({
          baseUrl: env.AI_BASE_URL,
          apiKey: env.AI_API_KEY,
          model: env.AI_MODEL,
          timeoutMs: env.AI_TIMEOUT_MS,
          reasoningEffort: env.AI_REASONING_EFFORT,
      })
    : null;

/** Callers answer "not configured" on null instead of failing at boot. */
export const getAiClient = (): AiClient | null => aiClient;
