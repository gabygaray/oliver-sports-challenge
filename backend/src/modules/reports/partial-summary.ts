import { JSON_STRING_BODY, SUMMARY_START } from './reports.constants';

/** Undoes the JSON escapes a model emits inside the summary string. */
const unescape = (text: string): string => text.replace(/\\(["\\/nrt])/g, (_, char: string) => ({ n: '\n', r: '\r', t: '\t' })[char] ?? char);

/** Pulls the `summary` value out of a JSON document still being streamed; null until the key has appeared. */
export const extractPartialSummary = (partialJson: string): string | null => {
    const match = SUMMARY_START.exec(partialJson);
    if (!match) return null;

    const rest = partialJson.slice(match.index + match[0].length);
    return unescape(JSON_STRING_BODY.exec(rest)?.[0] ?? '');
};
