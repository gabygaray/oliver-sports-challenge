import { STREAM_ERROR_CODE } from './apiError.constants';
import { IApiError } from './apiError.types';

export const parseStreamEvent = <T>(event: MessageEvent<string>): T =>
  JSON.parse(event.data) as T;

/** A server-sent `error` event carries a body; a dropped connection arrives with no data at all. */
export const toStreamError = (event: Event): IApiError => {
  const data = (event as MessageEvent<string | undefined>).data;
  return data
    ? parseStreamEvent<IApiError>(event as MessageEvent<string>)
    : { code: STREAM_ERROR_CODE, message: '' };
};
