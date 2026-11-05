/** Error envelope the backend returns for every non-2xx answer. */
export interface IApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface IApiError {
  code: string;
  message: string;
}
