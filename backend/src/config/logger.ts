import { IncomingMessage, ServerResponse } from 'node:http';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from './env';

export const logger = pino({
    level: env.NODE_ENV === 'test' ? 'silent' : 'info',
    transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
});

const toRequestLine = (req: IncomingMessage, res: ServerResponse): string => `${req.method} ${req.url} ${res.statusCode}`;

/** One line per request. The request and response details only travel with 4xx and 5xx answers, where they help to debug. */
export const httpLogger = pinoHttp({
    logger,
    autoLogging: env.NODE_ENV !== 'test',
    customLogLevel: (_req, res, error) => (error || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
    customSuccessMessage: (req, res, responseTime) => `${toRequestLine(req, res)} ${Math.round(responseTime)} ms`,
    customErrorMessage: (req, res) => toRequestLine(req, res),
    // Neither logger carries the request by default; it is attached by hand only where the answer failed.
    quietReqLogger: true,
    quietResLogger: true,
    customSuccessObject: (req, res, val) => (res.statusCode >= 400 ? { ...val, req } : {}),
    customErrorObject: (req, _res, _error, val) => ({ ...val, req }),
});
