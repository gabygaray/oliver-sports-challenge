import { AiError, AiInvalidResponseError } from '../../ai/ai.errors';
import { AiClient, AiJsonResponse } from '../../ai/ai.types';
import { logger } from '../../config/logger';
import { HttpError } from '../../shared/http-error';
import { toHttpError } from './ai-error.mapper';
import { extractPartialSummary } from './partial-summary';
import { buildRetryFeedback } from './prompts/retry-feedback.prompt';
import { MAX_MODEL_ATTEMPTS } from './reports.constants';
import { ModelRequest, ReportProgress } from './reports.types';

/** Asks the model for JSON, checks shape and content, and retries once with feedback before failing with 502. */
export const requestValidatedJson = async <T>(
    client: AiClient,
    request: ModelRequest<T>,
    progress: ReportProgress,
): Promise<{ data: T; model: string }> => {
    let user = request.user;
    let lastViolations: string[] = [];

    for (let attempt = 1; attempt <= MAX_MODEL_ATTEMPTS; attempt++) {
        if (attempt > 1) progress.onStage?.('retrying');
        const response = await callModel(client, request.system, user, request.temperature, progress);
        const parsed = request.schema.safeParse(response.json);

        lastViolations = parsed.success
            ? request.validate(parsed.data)
            : parsed.error.issues.map((issue) => `invalid field ${issue.path.join('.') || '(root)'}: ${issue.message}`);

        if (parsed.success && !lastViolations.length) return { data: parsed.data, model: response.model };

        logger.warn({ attempt, ...request.logContext, violations: lastViolations }, 'Model answer rejected');
        user = request.user + buildRetryFeedback(lastViolations);
    }

    throw new HttpError(502, 'AI_INVALID_RESPONSE', 'The model could not produce a report consistent with the data', {
        violations: lastViolations,
    });
};

const callModel = async (client: AiClient, system: string, user: string, temperature: number, progress: ReportProgress): Promise<AiJsonResponse> => {
    const { onSummary, signal } = progress;
    try {
        if (!onSummary) return await client.generateJson({ system, user, temperature, signal });

        // Only the summary is readable mid-stream; it is re-extracted from the growing JSON on every delta.
        let buffer = '';
        let lastSummary = '';
        return await client.streamJson({ system, user, temperature, signal }, (chunk) => {
            buffer += chunk;
            const summary = extractPartialSummary(buffer);
            if (summary !== null && summary !== lastSummary) {
                lastSummary = summary;
                onSummary(summary);
            }
        });
    } catch (error) {
        // Malformed JSON gets the same corrective retry as an answer that fails validation.
        if (error instanceof AiInvalidResponseError) return { json: null, model: client.model, usage: null };
        if (error instanceof AiError) throw toHttpError(error);
        throw error;
    }
};
