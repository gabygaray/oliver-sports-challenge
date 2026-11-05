import { JSON_STRING_BODY, SUMMARY_START } from './reports.constants';

/** Undoes the JSON escapes a model emits inside the summary string. */
const unescape = (text: string): string => text.replace(/\\(["\\/nrt])/g, (_, char: string) => ({ n: '\n', r: '\r', t: '\t' })[char] ?? char);

/**
 * Pulls the `summary` value out of a JSON document that is still being streamed, so the UI can show
 * the text as it grows. Returns null until the key has appeared. A trailing lone backslash is the start
 * of an escape still to arrive, and the body regex leaves it out by construction.
 */
export const extractPartialSummary = (partialJson: string): string | null => {
    const match = SUMMARY_START.exec(partialJson);
    if (!match) return null;

    const rest = partialJson.slice(match.index + match[0].length);
    return unescape(JSON_STRING_BODY.exec(rest)?.[0] ?? '');
};
