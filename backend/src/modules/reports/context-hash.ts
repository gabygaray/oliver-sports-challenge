import { createHash } from 'node:crypto';

/** Fingerprint of the data a report was written from; part of the cache key, so changed data invalidates it. */
export const hashContext = (context: unknown): string => createHash('sha256').update(JSON.stringify(context)).digest('hex');
