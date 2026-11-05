import { AiError, AiInvalidResponseError } from '../../ai/ai.errors';
import { AiClient, AiJsonRequest, AiJsonResponse, AiRetryTurn } from '../../ai/ai.types';
import { logger } from '../../config/logger';
import { HttpError } from '../../shared/http-error';
import { toHttpError } from './ai-error.mapper';
import { extractPartialSummary } from './partial-summary';
import { buildRetryFeedback } from './prompts/retry-feedback.prompt';
import {
    EMPTY_ANSWER_PLACEHOLDER,
    EXHAUSTED_VIOLATION,
    INVALID_JSON_VIOLATION,
    MAX_MODEL_ATTEMPTS,
    TRUNCATED_TEXT_MIN_CHARS,
    TRUNCATED_VIOLATION,
} from './reports.constants';
import { ModelRequest, ReportProgress } from './reports.types';

/** Asks the model for JSON, checks shape and content, and retries once with feedback before failing with 502. */
export const requestValidatedJson = async <T>(
    client: AiClient,
    request: ModelRequest<T>,
    progress: ReportProgress,
): Promise<{ data: T; model: string }> => {
    let retry: AiRetryTurn | undefined;
    let violations: string[] = [];

    for (let attempt = 1; attempt <= MAX_MODEL_ATTEMPTS; attempt++) {
        if (attempt > 1) progress.onStage?.('retrying');
        const response = await callModel(client, { ...toAiRequest(request), retry, signal: progress.signal }, progress);
        logger.info({ ...request.logContext, attempt, model: response.model, usage: response.usage }, 'Model answer received');

        const parsed = request.schema.safeParse(response.json);
        violations = findViolations(response, parsed, request.validate);
        if (parsed.success && !violations.length) return { data: parsed.data, model: response.model };

        logger.warn({ attempt, ...request.logContext, violations }, 'Model answer rejected');
        logger.debug({ attempt, ...request.logContext, text: response.text }, 'Rejected answer text');
        retry = { previousAnswer: response.text || EMPTY_ANSWER_PLACEHOLDER, feedback: buildRetryFeedback(violations) };
    }

    throw new HttpError(502, 'AI_INVALID_RESPONSE', 'The model could not produce a report consistent with the data', { violations });
};

const toAiRequest = <T>({ system, user, temperature, maxTokens }: ModelRequest<T>): AiJsonRequest => ({ system, user, temperature, maxTokens });

/** Truncation, unparseable JSON, a wrong shape and content that contradicts the data, reported in the model's own terms. */
const findViolations = <T>(
    response: AiJsonResponse,
    parsed: ReturnType<ModelRequest<T>['schema']['safeParse']>,
    validate: ModelRequest<T>['validate'],
): string[] => {
    if (response.truncated) return [response.text.trim().length < TRUNCATED_TEXT_MIN_CHARS ? EXHAUSTED_VIOLATION : TRUNCATED_VIOLATION];
    if (response.json === null) return [INVALID_JSON_VIOLATION];
    if (!parsed.success) return parsed.error.issues.map((issue) => `invalid field ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    return validate(parsed.data);
};

const callModel = async (client: AiClient, request: AiJsonRequest, progress: ReportProgress): Promise<AiJsonResponse> => {
    const { onSummary } = progress;
    try {
        if (!onSummary) return await client.generateJson(request);

        // Only the summary is readable mid-stream; it is re-extracted from the text so far on every delta.
        let lastSummary = '';
        return await client.streamJson(request, (text) => {
            const summary = extractPartialSummary(text);
            if (summary !== null && summary !== lastSummary) {
                lastSummary = summary;
                onSummary(summary);
            }
        });
    } catch (error) {
        // Malformed JSON gets the same corrective retry as an answer that fails validation.
        if (error instanceof AiInvalidResponseError) return { json: null, text: error.rawText, truncated: false, model: client.model, usage: null };
        if (error instanceof AiError) throw toHttpError(error);
        throw error;
    }
};
