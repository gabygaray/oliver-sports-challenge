import { createHash } from 'node:crypto';

/**
 * Fingerprint of the exact data a report was written from. It joins the cache key so that a
 * re-seed or a corrected value invalidates the stored report on its own, like a prompt or model change.
 */
export const hashContext = (context: unknown): string => createHash('sha256').update(JSON.stringify(context)).digest('hex');
