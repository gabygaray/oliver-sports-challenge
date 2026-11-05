import { MetricKey } from '../../shared/enums';
import { HIGHLIGHTS_TARGET, NAME_SEQUENCE, NUMBER_TOKEN, SENTENCE_START } from './reports.constants';
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

/** Every full name present in the context (players, session titles), so any name the model writes can be traced back to the data. */
const collectNames = (value: unknown, acc: Set<string>): Set<string> => {
    if (typeof value === 'string') for (const match of value.matchAll(NAME_SEQUENCE)) acc.add(match[0]);
    else if (Array.isArray(value)) for (const item of value) collectNames(item, acc);
    else if (value && typeof value === 'object') for (const item of Object.values(value)) collectNames(item, acc);
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

/** A run of capitalised words with no known name inside is an unknown name; the first word of a sentence does not count. */
const findUnknownNames = (text: string, known: string[]): string[] => {
    const unknown: string[] = [];
    for (const match of text.matchAll(NAME_SEQUENCE)) {
        const sequence = match[0];
        if (known.some((name) => sequence.includes(name))) continue;
        const atSentenceStart = SENTENCE_START.test(text.slice(0, match.index));
        const candidate = atSentenceStart ? sequence.split(' ').slice(1).join(' ') : sequence;
        if (candidate.includes(' ')) unknown.push(candidate);
    }
    return unknown;
};

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

/** Flags every full name in `texts` that does not occur anywhere in `context`. */
export const findNamesOutsideContext = (texts: string[], context: unknown): string[] => {
    const knownNames = [...collectNames(context, new Set<string>())];
    const violations: string[] = [];
    for (const text of texts) {
        const unknown = findUnknownNames(text, knownNames);
        if (unknown.length) violations.push(`names not present in the data: ${unknown.join(', ')}`);
    }
    return violations;
};

/** Every snake_case key of the context (and the metric keys): none of them is an ordinary word, so one in the prose is a leak of the JSON. */
const collectJsonKeys = (value: unknown, acc: Set<string>): Set<string> => {
    if (Array.isArray(value)) for (const item of value) collectJsonKeys(item, acc);
    else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) {
            if (key.includes('_')) acc.add(key);
            collectJsonKeys(item, acc);
        }
    }
    return acc;
};

export const findJsonKeysInProse = (texts: string[], context: unknown): string[] => {
    const keys = [...collectJsonKeys(context, new Set(Object.values(MetricKey).filter((key) => key.includes('_'))))];
    const violations: string[] = [];
    for (const text of texts) {
        const leaked = keys.filter((key) => text.includes(key));
        if (leaked.length) violations.push(`JSON keys written in the prose instead of plain words: ${leaked.join(', ')}`);
    }
    return violations;
};

/** All prose checks together: the figures and the names the model wrote must exist in the context, and no JSON key may leak. */
export const findProseOutsideContext = (texts: string[], context: unknown, maxCount: number): string[] => [
    ...findFiguresOutsideContext(texts, context, maxCount),
    ...findNamesOutsideContext(texts, context),
    ...findJsonKeysInProse(texts, context),
];

/** A highlight must point to a leader of the metric it names and quote that player's own value for it. */
const validateHighlight = (highlight: ModelReport['highlights'][number], context: ReportContext): string[] => {
    const player = context.players.find((row) => row.player_id === highlight.player_id);
    if (!player) return [`highlight references unknown player_id ${highlight.player_id}`];

    const violations: string[] = [];
    const isLeader = context.leaders[highlight.metric]?.some((leader) => leader.player_id === highlight.player_id);
    if (!isLeader) violations.push(`${player.player_name} is not among the leaders of ${highlight.metric}`);

    const actual = player[highlight.metric];
    if (actual !== highlight.value) violations.push(`${player.player_name}'s ${highlight.metric} is ${actual}, not ${highlight.value}`);
    return violations;
};

/** Returns the reasons the report contradicts the data; an empty list means it is safe to deliver. */
export const validateReportAgainstContext = (report: ModelReport, context: ReportContext): string[] => {
    const violations: string[] = [];
    const seen = new Set<number>();

    const leaderIds = new Set(
        Object.values(context.leaders)
            .flat()
            .map((leader) => leader.player_id),
    );
    const required = Math.min(HIGHLIGHTS_TARGET, leaderIds.size);
    if (report.highlights.length < required) violations.push(`at least ${required} highlights are required, got ${report.highlights.length}`);

    for (const highlight of report.highlights) {
        if (seen.has(highlight.player_id)) violations.push(`player_id ${highlight.player_id} is highlighted more than once`);
        seen.add(highlight.player_id);
        violations.push(...validateHighlight(highlight, context));
    }

    const texts = [report.summary, ...report.highlights.map((highlight) => highlight.reason)];
    return [...violations, ...findProseOutsideContext(texts, context, context.players.length)];
};
