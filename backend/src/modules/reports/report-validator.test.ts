import { describe, expect, it } from 'vitest';
import { buildReportContext } from './report-context';
import { validateReportAgainstContext } from './report-validator';
import { ROWS_FIXTURE, SESSION_FIXTURE, THRESHOLDS_FIXTURE } from './report.fixtures';
import { ModelReport } from './reports.schemas';

const context = buildReportContext(SESSION_FIXTURE, ROWS_FIXTURE, THRESHOLDS_FIXTURE);

const report = (overrides: Partial<ModelReport> = {}): ModelReport => ({
    summary: 'Santiago Molina alcanzó una carga de 810 AU y Bruno Acosta sumó 29 sprints.',
    highlights: [{ player_id: 6, reason: 'Lideró la distancia total con 10488 m.' }],
    ...overrides,
});

describe('validateReportAgainstContext', () => {
    it('accepts a report whose players and figures exist in the context', () => {
        expect(validateReportAgainstContext(report(), context)).toEqual([]);
    });

    it('rejects highlights of players outside the roster', () => {
        const violations = validateReportAgainstContext(report({ highlights: [{ player_id: 99, reason: 'Gran partido.' }] }), context);
        expect(violations).toEqual([expect.stringContaining('unknown player_id 99')]);
    });

    it('rejects the same player highlighted twice', () => {
        const highlights = [
            { player_id: 6, reason: 'Lideró la distancia total con 10488 m.' },
            { player_id: 6, reason: 'Sumó 58 aceleraciones.' },
        ];
        expect(validateReportAgainstContext(report({ highlights }), context)).toEqual([expect.stringContaining('more than once')]);
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
        const highlights = [{ player_id: 11, reason: 'Corrió 12345 m.' }];
        const violations = validateReportAgainstContext(report({ summary: 'Carga de 999 AU.', highlights }), context);
        expect(violations).toHaveLength(2);
    });
});
