import { FETCH_ERROR_STATUS, UNKNOWN_ERROR_CODE } from './apiError.constants';
import { IApiError, IApiErrorBody } from './apiError.types';

const hasErrorBody = (data: unknown): data is IApiErrorBody =>
  typeof data === 'object' && data !== null && 'error' in data;

/** Maps an RTK Query error to its code and the server message, if any. */
export const getApiError = (error: unknown): IApiError => {
  const { status, data } =
    (error as { status?: unknown; data?: unknown } | undefined) ?? {};

  if (status === FETCH_ERROR_STATUS) return { code: FETCH_ERROR_STATUS, message: '' };
  if (hasErrorBody(data)) return { code: data.error.code, message: data.error.message };
  return { code: UNKNOWN_ERROR_CODE, message: '' };
};

/** The text the UI shows: the translated message for the code, else the server's, else the generic one. */
export const resolveApiErrorMessage = (
  error: IApiError,
  messages: Record<string, string>,
): string => messages[error.code] ?? (error.message || messages[UNKNOWN_ERROR_CODE]);
