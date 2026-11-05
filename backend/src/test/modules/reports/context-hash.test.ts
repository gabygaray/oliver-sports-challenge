import { describe, expect, it } from 'vitest';
import { hashContext } from '../../../modules/reports/context-hash';
import { buildFixtureContext, ROWS_FIXTURE, THRESHOLDS_FIXTURE } from '../../fixtures/report.fixtures';

describe('hashContext', () => {
    const context = buildFixtureContext();

    it('is stable for the same data', () => {
        const again = buildFixtureContext();
        expect(hashContext(again)).toBe(hashContext(context));
        expect(hashContext(context)).toMatch(/^[0-9a-f]{64}$/);
    });

    it('changes when a single metric value changes', () => {
        const rows = ROWS_FIXTURE.map((row) => (row.player_id === 6 ? { ...row, rpe: 8 } : row));
        expect(hashContext(buildFixtureContext(rows))).not.toBe(hashContext(context));
    });

    it('changes when a threshold changes the alert picture', () => {
        // Two RPE values of 9 stop being warnings, so alerts_summary changes.
        const thresholds = { ...THRESHOLDS_FIXTURE, rpe: { warning: 9, critical: null } };
        expect(hashContext(buildFixtureContext(ROWS_FIXTURE, thresholds))).not.toBe(hashContext(context));
    });
});
