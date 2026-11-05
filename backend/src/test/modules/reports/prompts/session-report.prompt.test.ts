import { describe, expect, it } from 'vitest';
import { ReportParams } from '../../../../modules/reports/reports.schemas';
import { buildSystemPrompt, SESSION_REPORT_PROMPT_VERSION } from '../../../../modules/reports/prompts/session-report.prompt';

const VARIANTS: ReportParams[] = [
    { language: 'es', audience: 'coach', force: false },
    { language: 'es', audience: 'player', force: false },
    { language: 'en', audience: 'coach', force: false },
    { language: 'en', audience: 'player', force: false },
];

/** The snapshot is the rendered prompt; a wording change fails until the snapshot, the version and the CHANGELOG are updated together. */
describe('session report prompt', () => {
    it.each(VARIANTS)('renders version $language/$audience as snapshotted', (params) => {
        expect({ version: SESSION_REPORT_PROMPT_VERSION, prompt: buildSystemPrompt(params) }).toMatchSnapshot();
    });

    it('addresses the players with "vos" only in Spanish for the player audience', () => {
        expect(buildSystemPrompt(VARIANTS[1])).toContain('"vos"');
        for (const params of [VARIANTS[0], VARIANTS[2], VARIANTS[3]]) expect(buildSystemPrompt(params)).not.toContain('"vos"');
    });
});
