import { getAiClient } from '../../ai/ai-client.factory';
import { AiClient } from '../../ai/ai.types';
import { Player } from '../../entities/player.entity';
import { ReportKind } from '../../shared/enums';
import { HttpError } from '../../shared/http-error';
import { hashContext } from '../reports/context-hash';
import { requestValidatedJson } from '../reports/model-request';
import { resolveReport } from '../reports/report-cache.service';
import { ReportParams } from '../reports/reports.schemas';
import { ReportProgress } from '../reports/reports.types';
import { toPlayerMetricsRow, toSessionSummary, toThresholdMap } from '../sessions/sessions.mappers';
import { findTeamThresholds } from '../sessions/sessions.repository';
import { buildEvolutionContext } from './evolution-context';
import { validateEvolutionAgainstContext } from './evolution-validator';
import { toPlayerSummary } from './players.mappers';
import { findAllPlayers, findPlayerById, findPlayerSessions } from './players.repository';
import { modelEvolutionSchema } from './players.schemas';
import { EvolutionContext, PlayerEvolutionReport, PlayerSummary } from './players.types';
import {
    buildEvolutionSystemPrompt,
    buildEvolutionUserPrompt,
    PLAYER_EVOLUTION_PROMPT_VERSION,
    PLAYER_EVOLUTION_TEMPERATURE,
} from './prompts/player-evolution.prompt';

export const getPlayers = async (): Promise<PlayerSummary[]> => {
    const players = await findAllPlayers();
    return players.map(toPlayerSummary);
};

const getPlayerOrFail = async (id: number): Promise<Player> => {
    const player = await findPlayerById(id);
    if (!player) throw HttpError.notFound(`Player ${id} not found`);
    return player;
};

export const generatePlayerEvolutionReport = async (
    playerId: number,
    params: ReportParams,
    progress: ReportProgress = {},
): Promise<PlayerEvolutionReport> => {
    const client = getAiClient();
    if (!client) throw new HttpError(503, 'AI_NOT_CONFIGURED', 'AI_API_KEY is not configured');

    const player = await getPlayerOrFail(playerId);
    const [rows, thresholds] = await Promise.all([findPlayerSessions(playerId), findTeamThresholds(player.teamId)]);
    if (!rows.length) throw new HttpError(422, 'PLAYER_WITHOUT_SESSIONS', `Player ${playerId} has no recorded sessions`);

    // The context is built before the cache lookup because its hash is part of the key.
    const inputs = rows.map((row) => ({ session: toSessionSummary(row.session!), row: toPlayerMetricsRow(row) }));
    const context = buildEvolutionContext(toPlayerSummary(player), inputs, toThresholdMap(thresholds));
    const cacheKey = {
        kind: ReportKind.PlayerEvolution,
        subjectId: playerId,
        language: params.language,
        audience: params.audience,
        promptVersion: PLAYER_EVOLUTION_PROMPT_VERSION,
        model: client.model,
        contextHash: hashContext(context),
    };

    return resolveReport(cacheKey, params.force, progress, () => writeEvolutionReport(client, context, params, progress));
};

const writeEvolutionReport = async (
    client: AiClient,
    context: EvolutionContext,
    params: ReportParams,
    progress: ReportProgress,
): Promise<PlayerEvolutionReport> => {
    const { data, model } = await requestValidatedJson(
        client,
        {
            system: buildEvolutionSystemPrompt(params),
            user: buildEvolutionUserPrompt(context),
            temperature: PLAYER_EVOLUTION_TEMPERATURE,
            schema: modelEvolutionSchema,
            validate: (report) => validateEvolutionAgainstContext(report, context),
            logContext: { playerId: context.player.player_id },
        },
        progress,
    );

    return {
        player: context.player,
        sessions: context.sessions,
        trends: context.trends,
        summary: data.summary,
        observations: data.observations,
        meta: {
            language: params.language,
            audience: params.audience,
            model,
            prompt_version: PLAYER_EVOLUTION_PROMPT_VERSION,
            generated_at: new Date().toISOString(),
            cached: false,
        },
    };
};
