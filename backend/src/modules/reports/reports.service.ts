import { getAiClient } from '../../ai/ai-client.factory';
import { AiClient } from '../../ai/ai.types';
import { ReportKind } from '../../shared/enums';
import { HttpError } from '../../shared/http-error';
import { toPlayerMetricsRow, toSessionSummary, toThresholdMap } from '../sessions/sessions.mappers';
import { findSessionMetrics, findTeamThresholds } from '../sessions/sessions.repository';
import { getSessionOrFail } from '../sessions/sessions.service';
import { hashContext } from './context-hash';
import { requestValidatedJson } from './model-request';
import {
    buildSystemPrompt,
    buildUserPrompt,
    SESSION_REPORT_MAX_TOKENS,
    SESSION_REPORT_PROMPT_VERSION,
    SESSION_REPORT_TEMPERATURE,
} from './prompts/session-report.prompt';
import { resolveReport } from './report-cache.service';
import { buildReportContext, detectThresholdAlerts } from './report-context';
import { validateReportAgainstContext } from './report-validator';
import { modelReportSchema, ReportParams } from './reports.schemas';
import { ReportContext, ReportProgress, SessionReport, ThresholdAlert } from './reports.types';

export const generateSessionReport = async (sessionId: number, params: ReportParams, progress: ReportProgress = {}): Promise<SessionReport> => {
    const client = getAiClient();
    if (!client) throw new HttpError(503, 'AI_NOT_CONFIGURED', 'AI_API_KEY is not configured');

    const session = await getSessionOrFail(sessionId);
    const [rows, thresholds] = await Promise.all([findSessionMetrics(sessionId, { order: 'desc' }), findTeamThresholds(session.teamId)]);
    if (!rows.length) throw new HttpError(422, 'SESSION_WITHOUT_METRICS', `Session ${sessionId} has no player metrics`);

    // The context is built before the cache lookup because its hash is part of the key.
    const metrics = rows.map(toPlayerMetricsRow);
    const alerts = detectThresholdAlerts(metrics, toThresholdMap(thresholds));
    const context = buildReportContext(toSessionSummary(session), metrics, alerts);
    const cacheKey = {
        kind: ReportKind.Session,
        subjectId: sessionId,
        language: params.language,
        audience: params.audience,
        promptVersion: SESSION_REPORT_PROMPT_VERSION,
        model: client.model,
        contextHash: hashContext(context),
    };

    // Alerts are recomputed on every request, cached reports included.
    const report = await resolveReport(cacheKey, params.force, progress, () => writeSessionReport(client, context, alerts, params, progress));
    return { ...report, alerts };
};

const writeSessionReport = async (
    client: AiClient,
    context: ReportContext,
    alerts: ThresholdAlert[],
    params: ReportParams,
    progress: ReportProgress,
): Promise<SessionReport> => {
    const { data, model } = await requestValidatedJson(
        client,
        {
            system: buildSystemPrompt(params),
            user: buildUserPrompt(context),
            temperature: SESSION_REPORT_TEMPERATURE,
            maxTokens: SESSION_REPORT_MAX_TOKENS,
            schema: modelReportSchema,
            validate: (report) => validateReportAgainstContext(report, context),
            logContext: { sessionId: context.session.id },
        },
        progress,
    );

    const names = new Map(context.players.map((player) => [player.player_id, player.player_name]));
    return {
        session: context.session,
        summary: data.summary,
        highlights: data.highlights.map((highlight) => ({ ...highlight, player_name: names.get(highlight.player_id) ?? '' })),
        alerts,
        meta: {
            language: params.language,
            audience: params.audience,
            model,
            prompt_version: SESSION_REPORT_PROMPT_VERSION,
            generated_at: new Date().toISOString(),
            cached: false,
        },
    };
};
