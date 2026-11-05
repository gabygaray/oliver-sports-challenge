import { describe, expect, it } from 'vitest';
import { hashContext } from './context-hash';
import { buildReportContext } from './report-context';
import { ROWS_FIXTURE, SESSION_FIXTURE, THRESHOLDS_FIXTURE } from './report.fixtures';

describe('hashContext', () => {
    const context = buildReportContext(SESSION_FIXTURE, ROWS_FIXTURE, THRESHOLDS_FIXTURE);

    it('is stable for the same data', () => {
        const again = buildReportContext(SESSION_FIXTURE, ROWS_FIXTURE, THRESHOLDS_FIXTURE);
        expect(hashContext(again)).toBe(hashContext(context));
        expect(hashContext(context)).toMatch(/^[0-9a-f]{64}$/);
    });

    it('changes when a single metric value changes', () => {
        const rows = ROWS_FIXTURE.map((row) => (row.player_id === 6 ? { ...row, rpe: 8 } : row));
        expect(hashContext(buildReportContext(SESSION_FIXTURE, rows, THRESHOLDS_FIXTURE))).not.toBe(hashContext(context));
    });

    it('changes when a threshold changes', () => {
        const thresholds = { ...THRESHOLDS_FIXTURE, rpe: { warning: 9, critical: null } };
        expect(hashContext(buildReportContext(SESSION_FIXTURE, ROWS_FIXTURE, thresholds))).not.toBe(hashContext(context));
    });
});
