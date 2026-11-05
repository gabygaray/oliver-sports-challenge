import { describe, expect, it } from 'vitest';
import { extractPartialSummary } from '../../../modules/reports/partial-summary';

describe('extractPartialSummary', () => {
    it('returns null before the summary key has streamed in', () => {
        expect(extractPartialSummary('{"summ')).toBeNull();
    });

    it('returns the text received so far while the string is still open', () => {
        expect(extractPartialSummary('{"summary": "La sesión regis')).toBe('La sesión regis');
    });

    it('stops at the closing quote once the string is complete', () => {
        expect(extractPartialSummary('{"summary":"Listo.","highlights":[')).toBe('Listo.');
    });

    it('unescapes quotes and newlines and ignores a dangling backslash', () => {
        expect(extractPartialSummary('{"summary": "Dijo \\"basta\\".\\nFin')).toBe('Dijo "basta".\nFin');
        expect(extractPartialSummary('{"summary": "Dijo \\')).toBe('Dijo ');
    });
});
