import {
  API_ERROR_MESSAGES,
  FETCH_ERROR_STATUS,
  UNKNOWN_ERROR_CODE,
} from './apiError.constants';
import { IApiError, IApiErrorBody } from './apiError.types';

const hasErrorBody = (data: unknown): data is IApiErrorBody =>
  typeof data === 'object' && data !== null && 'error' in data;

/** Maps an RTK Query error to a code plus a message the UI can show as is. */
export const getApiError = (error: unknown): IApiError => {
  const { status, data } =
    (error as { status?: unknown; data?: unknown } | undefined) ?? {};

  if (status === FETCH_ERROR_STATUS) {
    return { code: FETCH_ERROR_STATUS, message: API_ERROR_MESSAGES[FETCH_ERROR_STATUS] };
  }

  const code = hasErrorBody(data) ? data.error.code : UNKNOWN_ERROR_CODE;
  return {
    code,
    message: API_ERROR_MESSAGES[code] ?? API_ERROR_MESSAGES[UNKNOWN_ERROR_CODE],
  };
};
