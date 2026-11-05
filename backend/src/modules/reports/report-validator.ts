import { NUMBER_TOKEN } from './reports.constants';
import { ModelReport } from './reports.schemas';
import { ReportContext } from './reports.types';

/** Every number present in the context, so any figure the model quotes can be traced back to the data. */
const collectNumbers = (value: unknown, acc: Set<number>): Set<number> => {
    if (typeof value === 'number') acc.add(Math.abs(value));
    else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) for (const part of value.split('-')) acc.add(Number(part));
    else if (Array.isArray(value)) for (const item of value) collectNumbers(item, acc);
    else if (value && typeof value === 'object') for (const item of Object.values(value)) collectNumbers(item, acc);
    return acc;
};

/** "10.488", "10,488" and "29,6" are all valid spellings; try the token as decimal and as thousands-separated. */
const tokenCandidates = (token: string): number[] => [Number(token.replace(',', '.')), Number(token.replace(/[.,]/g, ''))];

const findUnknownNumbers = (text: string, allowed: Set<number>, maxCount: number): string[] =>
    (text.match(NUMBER_TOKEN) ?? []).filter((token) => {
        const candidates = tokenCandidates(token);
        // Integers up to the roster size are counts ("2 jugadores"), not metrics, so they are not checked against the data.
        if (candidates.some((candidate) => Number.isInteger(candidate) && candidate >= 0 && candidate <= maxCount)) return false;
        return !candidates.some((candidate) => allowed.has(candidate));
    });

/** Flags every figure in `texts` that cannot be found in `context`; `maxCount` bounds the integers treated as plain counts. */
export const findFiguresOutsideContext = (texts: string[], context: unknown, maxCount: number): string[] => {
    const allowedNumbers = collectNumbers(context, new Set<number>());
    const violations: string[] = [];
    for (const text of texts) {
        const unknown = findUnknownNumbers(text, allowedNumbers, maxCount);
        if (unknown.length) violations.push(`numbers not present in the data: ${unknown.join(', ')}`);
    }
    return violations;
};

/** Returns the reasons the report contradicts the data; an empty list means it is safe to deliver. */
export const validateReportAgainstContext = (report: ModelReport, context: ReportContext): string[] => {
    const violations: string[] = [];
    const rosterIds = new Set(context.players.map((player) => player.player_id));

    const seen = new Set<number>();
    for (const highlight of report.highlights) {
        if (!rosterIds.has(highlight.player_id)) violations.push(`highlight references unknown player_id ${highlight.player_id}`);
        if (seen.has(highlight.player_id)) violations.push(`player_id ${highlight.player_id} is highlighted more than once`);
        seen.add(highlight.player_id);
    }

    const texts = [report.summary, ...report.highlights.map((highlight) => highlight.reason)];
    return [...violations, ...findFiguresOutsideContext(texts, context, context.players.length)];
};
