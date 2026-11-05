/** Shape of every non-2xx answer. */
export interface ErrorBody {
    error: { code: string; message: string; details?: unknown };
}

export interface ErrorResponse {
    status: number;
    body: ErrorBody;
}
