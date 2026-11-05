import { Request, Response } from 'express';
import { EventStream } from './event-stream.types';

/** Turns the response into a Server-Sent Events channel. Headers go out immediately so the client can attach. */
export const openEventStream = (req: Request, res: Response): EventStream => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    const controller = new AbortController();
    req.on('close', () => controller.abort());

    return {
        signal: controller.signal,
        send: (event, data) => {
            if (res.writableEnded || controller.signal.aborted) return;
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        },
        close: () => {
            if (!res.writableEnded) res.end();
        },
    };
};
