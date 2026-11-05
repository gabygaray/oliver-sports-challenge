import { describe, expect, it } from 'vitest';
import { ReportParams } from '../../../../modules/reports/reports.schemas';
import { buildEvolutionContext, buildPlayerSessionRows } from '../../../../modules/players/evolution-context';
import {
    buildEvolutionSystemPrompt,
    PLAYER_EVOLUTION_MAX_TOKENS,
    PLAYER_EVOLUTION_PROMPT_VERSION,
    PLAYER_EVOLUTION_TEMPERATURE,
} from '../../../../modules/players/prompts/player-evolution.prompt';
import { ROWS_FIXTURE, SESSION_FIXTURE, THRESHOLDS_FIXTURE } from '../../../fixtures/report.fixtures';

const VARIANTS: ReportParams[] = [
    { language: 'es', audience: 'coach', force: false },
    { language: 'es', audience: 'player', force: false },
    { language: 'en', audience: 'coach', force: false },
    { language: 'en', audience: 'player', force: false },
];

/** The snapshot is the rendered prompt plus its sampling parameters; any change fails until snapshot, version and CHANGELOG are updated together. */
describe('player evolution prompt', () => {
    it.each(VARIANTS)('renders version $language/$audience as snapshotted', (params) => {
        expect({
            version: PLAYER_EVOLUTION_PROMPT_VERSION,
            temperature: PLAYER_EVOLUTION_TEMPERATURE,
            maxTokens: PLAYER_EVOLUTION_MAX_TOKENS,
            prompt: buildEvolutionSystemPrompt(params),
        }).toMatchSnapshot();
    });

    it('describes every field the model receives, at the top level and inside each session', () => {
        const prompt = buildEvolutionSystemPrompt(VARIANTS[0]);
        const player = { player_id: 6, player_name: 'Santiago Molina', position: 'MF', shirt_number: 6 };
        const context = buildEvolutionContext(
            player,
            buildPlayerSessionRows([{ session: SESSION_FIXTURE, row: ROWS_FIXTURE[2] }], THRESHOLDS_FIXTURE),
        );
        for (const key of [...Object.keys(context), ...Object.keys(context.sessions[0])]) expect(prompt).toContain(`"${key}"`);
    });
});
