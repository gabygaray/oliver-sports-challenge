import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { AiClient, AiJsonRequest, AiJsonResponse } from '../../../ai/ai.types';
import { requestValidatedJson } from '../../../modules/reports/model-request';
import { EXHAUSTED_VIOLATION, TRUNCATED_VIOLATION } from '../../../modules/reports/reports.constants';

vi.mock('../../../config/logger', () => ({ logger: { info: vi.fn(), warn: vi.fn(), debug: vi.fn() } }));

const answer = (overrides: Partial<AiJsonResponse>): AiJsonResponse => ({
    json: null,
    text: '',
    truncated: false,
    model: 'm',
    usage: null,
    ...overrides,
});

/** Answers in order and records every request. */
const clientAnswering = (answers: AiJsonResponse[]): AiClient & { requests: AiJsonRequest[] } => {
    const requests: AiJsonRequest[] = [];
    const generateJson = vi.fn(async (request: AiJsonRequest) => {
        requests.push(request);
        return answers[requests.length - 1];
    });
    return { model: 'm', requests, generateJson, streamJson: generateJson };
};

const request = {
    system: 's',
    user: 'u',
    temperature: 0,
    maxTokens: 800,
    schema: z.object({ ok: z.boolean() }),
    validate: () => [],
    logContext: {},
};

describe('requestValidatedJson', () => {
    it('tells the model its reasoning used up the limit when a truncated answer has almost no text', async () => {
        const client = clientAnswering([answer({ truncated: true, text: '' }), answer({ json: { ok: true }, text: '{"ok":true}' })]);

        await expect(requestValidatedJson(client, request, {})).resolves.toMatchObject({ data: { ok: true } });
        expect(client.requests[1].retry?.feedback).toContain(EXHAUSTED_VIOLATION);
    });

    it('asks for a shorter answer when a truncated answer had already written a long text', async () => {
        const longCut = `{"summary": "${'palabra '.repeat(20)}`;
        const client = clientAnswering([answer({ truncated: true, text: longCut }), answer({ json: { ok: true }, text: '{"ok":true}' })]);

        await requestValidatedJson(client, request, {});
        expect(client.requests[1].retry).toMatchObject({ previousAnswer: longCut, feedback: expect.stringContaining(TRUNCATED_VIOLATION) });
    });

    it('fails with 502 and the violations after the single retry', async () => {
        const client = clientAnswering([answer({ truncated: true }), answer({ truncated: true })]);

        await expect(requestValidatedJson(client, request, {})).rejects.toMatchObject({
            status: 502,
            code: 'AI_INVALID_RESPONSE',
            details: { violations: [EXHAUSTED_VIOLATION] },
        });
        expect(client.requests).toHaveLength(2);
    });
});
