import { AiStreamHandler } from './ai.types';
import { ChatCompletionChunk, StreamedCompletion } from './openai-compatible.types';

const DATA_PREFIX = 'data:';
const DONE_MARKER = '[DONE]';

/** A malformed chunk is skipped rather than failing the whole stream. */
const parseChunk = (data: string): ChatCompletionChunk | null => {
    try {
        return JSON.parse(data) as ChatCompletionChunk;
    } catch {
        return null;
    }
};

/** Parses one line of the event stream into the running result; non-SSE lines are kept as the trailer. */
const consumeLine = (line: string, result: StreamedCompletion, onText: AiStreamHandler): void => {
    if (!line) return;
    if (!line.startsWith(DATA_PREFIX)) {
        result.trailer += line;
        return;
    }
    const data = line.slice(DATA_PREFIX.length).trim();
    if (data === DONE_MARKER) {
        result.done = true;
        return;
    }

    const chunk = parseChunk(data);
    if (!chunk) return;

    result.model ??= chunk.model;
    if (chunk.usage) result.usage = chunk.usage;
    const choice = chunk.choices?.[0];
    if (choice?.finish_reason) result.finishReason = choice.finish_reason;
    const delta = choice?.delta?.content;
    if (delta) {
        result.text += delta;
        onText(result.text);
    }
};

/** Reads the streamed completion line by line and forwards the text so far on every content delta. */
export const readCompletionStream = async (response: Response, onText: AiStreamHandler): Promise<StreamedCompletion> => {
    const result: StreamedCompletion = { text: '', done: false, trailer: '' };
    if (!response.body) return result;

    // Chunks do not align with lines, so the trailing partial line waits for the next chunk.
    let pending = '';
    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
        const lines = (pending + chunk).split('\n');
        pending = lines.pop() ?? '';
        for (const line of lines) consumeLine(line.trim(), result, onText);
    }
    consumeLine(pending.trim(), result, onText);

    return result;
};
