import { describe, expect, it } from 'vitest';
import { ReportParams } from '../../../../modules/reports/reports.schemas';
import { buildFixtureContext } from '../../../fixtures/report.fixtures';
import {
    buildSystemPrompt,
    SESSION_REPORT_MAX_TOKENS,
    SESSION_REPORT_PROMPT_VERSION,
    SESSION_REPORT_TEMPERATURE,
} from '../../../../modules/reports/prompts/session-report.prompt';

const VARIANTS: ReportParams[] = [
    { language: 'es', audience: 'coach', force: false },
    { language: 'es', audience: 'player', force: false },
    { language: 'en', audience: 'coach', force: false },
    { language: 'en', audience: 'player', force: false },
];

/** The snapshot is the rendered prompt plus its sampling parameters; any change fails until snapshot, version and CHANGELOG are updated together. */
describe('session report prompt', () => {
    it.each(VARIANTS)('renders version $language/$audience as snapshotted', (params) => {
        expect({
            version: SESSION_REPORT_PROMPT_VERSION,
            temperature: SESSION_REPORT_TEMPERATURE,
            maxTokens: SESSION_REPORT_MAX_TOKENS,
            prompt: buildSystemPrompt(params),
        }).toMatchSnapshot();
    });

    it('describes every field the model receives, at the top level and inside "team"', () => {
        const prompt = buildSystemPrompt(VARIANTS[0]);
        const context = buildFixtureContext();
        for (const key of [...Object.keys(context), ...Object.keys(context.team)]) expect(prompt).toContain(`"${key}"`);
    });

    it('addresses the players with "vos" only in Spanish for the player audience', () => {
        expect(buildSystemPrompt(VARIANTS[1])).toContain('"vos"');
        for (const params of [VARIANTS[0], VARIANTS[2], VARIANTS[3]]) expect(buildSystemPrompt(params)).not.toContain('"vos"');
    });
});
