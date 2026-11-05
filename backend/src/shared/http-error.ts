/** Error carrying the HTTP status and a stable code the frontend can branch on. */
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
        public readonly details?: unknown,
    ) {
        super(message);
        this.name = 'HttpError';
    }

    static notFound(message: string): HttpError {
        return new HttpError(404, 'NOT_FOUND', message);
    }
}
