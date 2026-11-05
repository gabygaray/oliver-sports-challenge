import { AiDeltaHandler } from './ai.types';
import { ChatCompletionChunk, StreamedCompletion } from './openai-compatible.types';

/** A malformed chunk is skipped rather than failing the whole stream. */
const parseChunk = (data: string): ChatCompletionChunk | null => {
    try {
        return JSON.parse(data) as ChatCompletionChunk;
    } catch {
        return null;
    }
};

/** Parses one `data:` line of the event stream into the running result; anything else is ignored. */
const consumeLine = (line: string, result: StreamedCompletion, onDelta: AiDeltaHandler): void => {
    if (!line.startsWith('data:')) return;
    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') return;

    const chunk = parseChunk(data);
    if (!chunk) return;

    result.model ??= chunk.model;
    if (chunk.usage) result.usage = chunk.usage;
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
        result.text += delta;
        onDelta(delta);
    }
};

/**
 * Consumes the single streamed HTTP response of a chat completion: the body is iterated as it
 * arrives, split into `data:` lines, and every content delta is forwarded before the joined text is returned.
 */
export const readCompletionStream = async (response: Response, onDelta: AiDeltaHandler): Promise<StreamedCompletion> => {
    const result: StreamedCompletion = { text: '' };
    if (!response.body) return result;

    // Chunks do not align with lines, so the trailing partial line waits for the next chunk.
    let pending = '';
    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
        const lines = (pending + chunk).split('\n');
        pending = lines.pop() ?? '';
        for (const line of lines) consumeLine(line.trim(), result, onDelta);
    }
    consumeLine(pending.trim(), result, onDelta);

    return result;
};
