import { describe, expect, it } from 'vitest';
import { MetricKey } from '../../../shared/enums';
import { validateReportAgainstContext } from '../../../modules/reports/report-validator';
import { buildFixtureContext, ROWS_FIXTURE } from '../../fixtures/report.fixtures';
import { ModelReport, modelReportSchema } from '../../../modules/reports/reports.schemas';

const context = buildFixtureContext();

type Highlight = ModelReport['highlights'][number];

const molinaDistance: Highlight = { player_id: 6, metric: MetricKey.TotalDistanceM, value: 10488, reason: 'Lideró la distancia total con 10488 m.' };
const acostaSprints: Highlight = { player_id: 11, metric: MetricKey.Sprints, value: 29, reason: 'Sumó 29 sprints.' };

const report = (overrides: Partial<ModelReport> = {}): ModelReport => ({
    summary: 'Santiago Molina alcanzó una carga de 810 AU y Bruno Acosta sumó 29 sprints.',
    highlights: [molinaDistance, acostaSprints],
    ...overrides,
});

describe('validateReportAgainstContext', () => {
    it('accepts a report whose players and figures exist in the context', () => {
        expect(validateReportAgainstContext(report(), context)).toEqual([]);
    });

    it('requires two highlights while the leaders allow it, and fewer when they do not', () => {
        expect(validateReportAgainstContext(report({ highlights: [molinaDistance] }), context)).toEqual([
            expect.stringContaining('at least 2 highlights'),
        ]);

        // Everybody below 75% of the minutes: no leaders, so an empty list is the right answer.
        const benched = buildFixtureContext(ROWS_FIXTURE.map((row) => ({ ...row, minutes_played: 30 })));
        expect(validateReportAgainstContext(report({ highlights: [] }), benched)).toEqual([]);
    });

    it('rejects highlights of players outside the roster', () => {
        const violations = validateReportAgainstContext(report({ highlights: [{ ...molinaDistance, player_id: 99 }, acostaSprints] }), context);
        expect(violations).toEqual([expect.stringContaining('unknown player_id 99')]);
    });

    it('rejects the same player highlighted twice', () => {
        const highlights: Highlight[] = [
            molinaDistance,
            { player_id: 6, metric: MetricKey.Accelerations, value: 58, reason: 'Sumó 58 aceleraciones.' },
        ];
        expect(validateReportAgainstContext(report({ highlights }), context)).toEqual([expect.stringContaining('more than once')]);
    });

    it("rejects a highlight that attributes another player's figure", () => {
        // 10488 m exists in the data, but it is Molina's distance, not Acosta's.
        const highlights: Highlight[] = [
            molinaDistance,
            { ...acostaSprints, metric: MetricKey.TotalDistanceM, value: 10488, reason: 'Corrió 10488 m.' },
        ];
        const violations = validateReportAgainstContext(report({ highlights }), context);
        expect(violations).toEqual([expect.stringContaining("Bruno Acosta's total_distance_m is 8840, not 10488")]);
    });

    it('rejects a highlight whose player is not a leader of that metric', () => {
        const highlights: Highlight[] = [molinaDistance, { player_id: 1, metric: MetricKey.Sprints, value: 1, reason: 'Hizo 1 sprint.' }];
        const violations = validateReportAgainstContext(report({ highlights }), context);
        expect(violations).toEqual([expect.stringContaining('Nicolás Herrera is not among the leaders of sprints')]);
    });

    it('rejects a highlight on a metric that cannot justify one, such as workload, at the schema level', () => {
        const highlights = [molinaDistance, { player_id: 6, metric: MetricKey.WorkloadAu, value: 810, reason: 'Carga de 810 AU.' }];
        const result = modelReportSchema.safeParse({ ...report(), highlights });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(['highlights', 1, 'metric']);
    });

    it('rejects full names that do not belong to the data', () => {
        const violations = validateReportAgainstContext(report({ summary: 'Destacó Pedro Fernández con 810 AU de carga.' }), context);
        expect(violations).toEqual([expect.stringContaining('Pedro Fernández')]);
    });

    it('accepts roster names anywhere in a sentence and a capitalised word opening a sentence', () => {
        const summary = 'Destacaron Santiago Molina y Bruno Acosta. In September the team covered 10488 m at most. Partido amistoso con alta carga.';
        expect(validateReportAgainstContext(report({ summary }), context)).toEqual([]);
    });

    it('rejects JSON keys written in the prose, metric keys and context keys alike', () => {
        const summary = 'Alerts across workload_au, total_distance_m and rpe affected 5 players.';
        expect(validateReportAgainstContext(report({ summary }), context)).toEqual([expect.stringContaining('total_distance_m, workload_au')]);

        const leaked = 'La carga se mantuvo plana (alerts_summary: 0) para 2 jugadores.';
        expect(validateReportAgainstContext(report({ summary: leaked }), context)).toEqual([expect.stringContaining('alerts_summary')]);
    });

    it('rejects figures that do not appear anywhere in the data', () => {
        const violations = validateReportAgainstContext(report({ summary: 'El equipo promedió 7250 m por jugador.' }), context);
        expect(violations).toEqual([expect.stringContaining('7250')]);
    });

    it('accepts locale spellings of a known figure', () => {
        for (const spelling of ['10.488 m', '10,488 m', '29,5 km/h', '29.5 km/h']) {
            expect(validateReportAgainstContext(report({ summary: `Registró ${spelling}.` }), context)).toEqual([]);
        }
    });

    it('ignores integers up to the roster size (counts) and the parts of the session date', () => {
        const summary = 'Dos jugadores superaron el umbral y 3 quedaron cerca en el partido del 19 de septiembre de 2026.';
        expect(validateReportAgainstContext(report({ summary }), context)).toEqual([]);
    });

    it('checks integers above the roster size like any other figure', () => {
        expect(validateReportAgainstContext(report({ summary: 'Participaron 13 jugadores en total.' }), context)).toEqual([
            expect.stringContaining('13'),
        ]);
    });

    it('reports every offending text, including highlight reasons', () => {
        const highlights = [molinaDistance, { ...acostaSprints, reason: 'Corrió 12345 m.' }];
        const violations = validateReportAgainstContext(report({ summary: 'Carga de 999 AU.', highlights }), context);
        expect(violations).toHaveLength(2);
    });
});
