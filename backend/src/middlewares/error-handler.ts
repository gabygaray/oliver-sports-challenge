import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { HttpError } from '../shared/http-error';
import { ErrorResponse } from '../shared/http.types';

/** Single place that decides how any thrown value looks on the wire; the SSE channel reuses it. */
export const toErrorResponse = (error: unknown): ErrorResponse => {
    if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
        return { status: 400, body: { error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details } } };
    }

    if (error instanceof HttpError) {
        // Logged here because the SSE channel answers 200 and the request logger never sees these.
        if (error.status >= 500) logger.error({ code: error.code, status: error.status, details: error.details }, error.message);
        return { status: error.status, body: { error: { code: error.code, message: error.message, details: error.details } } };
    }

    logger.error(error, 'Unhandled error');
    return { status: 500, body: { error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } } };
};

export const notFoundHandler = (_req: Request, res: Response): void => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    const { status, body } = toErrorResponse(error);
    res.status(status).json(body);
};
