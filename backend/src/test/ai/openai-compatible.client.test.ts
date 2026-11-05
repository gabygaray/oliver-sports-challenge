import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AiAbortedError, AiProviderError, AiRateLimitError, AiTimeoutError } from '../../ai/ai.errors';
import { OpenAiCompatibleClient } from '../../ai/openai-compatible.client';

vi.mock('../../config/logger', () => ({ logger: { info: vi.fn(), warn: vi.fn() } }));
vi.mock('../../ai/ai.constants', () => ({ FINISH_REASON_LENGTH: 'length', MAX_SEND_ATTEMPTS: 3, retryDelayMs: () => 1 }));

const config = { baseUrl: 'https://ai.test/v1', apiKey: 'k', model: 'm', timeoutMs: 50, reasoningTokensAllowance: 1500 };
const client = new OpenAiCompatibleClient(config);
const request = { system: 's', user: 'u' };

const jsonResponse = (status: number, body: unknown, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

const completion = (content: string) => ({ model: 'm-1', choices: [{ message: { content } }], usage: { prompt_tokens: 1, completion_tokens: 2 } });

/** Resolves only when the signal aborts, like a provider that never answers. */
const hangingFetch = (_url: unknown, init?: RequestInit) =>
    new Promise<Response>((_, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)));

const sseBody = (events: string[]) =>
    new ReadableStream<Uint8Array>({
        start(controller) {
            const encoder = new TextEncoder();
            for (const event of events) controller.enqueue(encoder.encode(event));
            controller.close();
        },
    });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('OpenAiCompatibleClient.generateJson', () => {
    it('parses the completion and strips markdown fences', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(200, completion('```json\n{"ok":true}\n```')));

        await expect(client.generateJson(request)).resolves.toEqual({
            json: { ok: true },
            text: '```json\n{"ok":true}\n```',
            truncated: false,
            model: 'm-1',
            usage: { input_tokens: 1, output_tokens: 2, reasoning_tokens: null },
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('reports the reasoning tokens when the provider details them', async () => {
        const usage = { prompt_tokens: 10, completion_tokens: 900, completion_tokens_details: { reasoning_tokens: 850 } };
        fetchMock.mockResolvedValueOnce(jsonResponse(200, { ...completion('{"ok":true}'), usage }));

        await expect(client.generateJson(request)).resolves.toMatchObject({ usage: { output_tokens: 900, reasoning_tokens: 850 } });
    });

    it('sends the caller max_tokens as is while reasoning is off', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(200, completion('{"ok":true}')));
        await client.generateJson({ ...request, maxTokens: 800 });

        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({ max_tokens: 800 });
    });

    it('adds the reasoning allowance to max_tokens while reasoning is on, so thinking cannot cut the answer', async () => {
        const reasoning = new OpenAiCompatibleClient({ ...config, reasoningEffort: 'low' });
        fetchMock.mockResolvedValueOnce(jsonResponse(200, completion('{"ok":true}')));
        await reasoning.generateJson({ ...request, maxTokens: 800 });

        expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({ max_tokens: 2300, reasoning_effort: 'low' });
    });

    it('reports a completion stopped at max_tokens as truncated instead of failing on the broken JSON', async () => {
        fetchMock.mockResolvedValueOnce(
            jsonResponse(200, {
                ...completion('{"summary": "cut'),
                choices: [{ message: { content: '{"summary": "cut' }, finish_reason: 'length' }],
            }),
        );

        await expect(client.generateJson(request)).resolves.toMatchObject({ json: null, text: '{"summary": "cut', truncated: true });
    });

    it('replays the rejected answer and the feedback as extra turns on a retry', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(200, completion('{"ok":2}')));
        const retry = { previousAnswer: '{"ok":1}', feedback: 'fix it' };

        await client.generateJson({ ...request, retry });

        const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(body.messages).toEqual([
            { role: 'system', content: 's' },
            { role: 'user', content: 'u' },
            { role: 'assistant', content: '{"ok":1}' },
            { role: 'user', content: 'fix it' },
        ]);
    });

    it('retries transient 5xx answers and succeeds on the third attempt', async () => {
        fetchMock
            .mockResolvedValueOnce(jsonResponse(503, { error: 'busy' }))
            .mockResolvedValueOnce(jsonResponse(502, { error: 'bad gateway' }))
            .mockResolvedValueOnce(jsonResponse(200, completion('{"ok":1}')));

        await expect(client.generateJson(request)).resolves.toMatchObject({ json: { ok: 1 } });
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('gives up after the last allowed attempt', async () => {
        fetchMock.mockImplementation(async () => jsonResponse(503, { error: 'busy' }));

        await expect(client.generateJson(request)).rejects.toBeInstanceOf(AiProviderError);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('does not retry a rate limit and keeps the retry-after hint', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse(429, { error: 'slow down' }, { 'retry-after': '7' }));

        await expect(client.generateJson(request)).rejects.toMatchObject({ retryAfterSeconds: 7 });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        fetchMock.mockResolvedValueOnce(jsonResponse(429, {}));
        await expect(client.generateJson(request)).rejects.toBeInstanceOf(AiRateLimitError);
    });

    it('turns the deadline into AiTimeoutError', async () => {
        fetchMock.mockImplementation(hangingFetch);

        await expect(client.generateJson(request)).rejects.toBeInstanceOf(AiTimeoutError);
    });

    it("turns the caller's cancellation into AiAbortedError", async () => {
        fetchMock.mockImplementation(hangingFetch);
        const controller = new AbortController();
        const pending = client.generateJson({ ...request, signal: controller.signal });
        controller.abort();

        await expect(pending).rejects.toBeInstanceOf(AiAbortedError);
    });
});

describe('OpenAiCompatibleClient.streamJson', () => {
    it('forwards every delta and returns the joined JSON', async () => {
        const chunk = (content: string) => `data: ${JSON.stringify({ model: 'm-1', choices: [{ delta: { content } }] })}\n\n`;
        fetchMock.mockResolvedValueOnce(
            new Response(sseBody([chunk('{"sum'), chunk('mary": "ho'), 'data: not-json\n\n', chunk('la"}'), 'data: [DONE]\n\n']), { status: 200 }),
        );
        const deltas: string[] = [];

        const result = await client.streamJson(request, (delta) => deltas.push(delta));

        expect(deltas).toEqual(['{"sum', 'mary": "ho', 'la"}']);
        expect(result).toMatchObject({ json: { summary: 'hola' }, model: 'm-1' });
    });

    it('handles a line split across two network chunks', async () => {
        const line = `data: ${JSON.stringify({ choices: [{ delta: { content: '{"a":1}' } }] })}\n`;
        fetchMock.mockResolvedValueOnce(new Response(sseBody([line.slice(0, 10), line.slice(10)]), { status: 200 }));

        await expect(client.streamJson(request, () => undefined)).resolves.toMatchObject({ json: { a: 1 } });
    });
});
