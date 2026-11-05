import { describe, expect, it } from 'vitest';
import { ReportParams } from '../../../../modules/reports/reports.schemas';
import { buildEvolutionSystemPrompt, PLAYER_EVOLUTION_PROMPT_VERSION } from '../../../../modules/players/prompts/player-evolution.prompt';

const VARIANTS: ReportParams[] = [
    { language: 'es', audience: 'coach', force: false },
    { language: 'es', audience: 'player', force: false },
    { language: 'en', audience: 'coach', force: false },
    { language: 'en', audience: 'player', force: false },
];

/** The snapshot is the rendered prompt; a wording change fails until the snapshot, the version and the CHANGELOG are updated together. */
describe('player evolution prompt', () => {
    it.each(VARIANTS)('renders version $language/$audience as snapshotted', (params) => {
        expect({ version: PLAYER_EVOLUTION_PROMPT_VERSION, prompt: buildEvolutionSystemPrompt(params) }).toMatchSnapshot();
    });
});
