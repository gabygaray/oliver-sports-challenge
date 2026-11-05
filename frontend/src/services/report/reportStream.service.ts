import { getSessionReportAdapter } from '../../adapters';
import { IReportParams, TReportStage } from '../../models';
import {
  IReportStreamHandlers,
  ISessionReportApiResponse,
  parseStreamEvent,
  toStreamError,
} from '../../utilities';
import { config } from '../api';
import { QUERY_URL_SESSIONS } from '../URL';

/**
 * Opens the Server-Sent Events channel for a session report. Returns a function that closes it;
 * the channel also closes itself after the final `report` or `error` event.
 */
export const openReportStream = (
  { sessionId, language, audience, force = false }: IReportParams,
  handlers: IReportStreamHandlers,
): (() => void) => {
  const query = new URLSearchParams({ language, audience, force: String(force) });
  const url = `${config.apiUrl}/${QUERY_URL_SESSIONS.sessionReportStream(sessionId)}?${query}`;
  const source = new EventSource(url);
  const close = () => source.close();

  source.addEventListener('status', event =>
    handlers.onStage(parseStreamEvent<{ stage: TReportStage }>(event).stage),
  );
  source.addEventListener('summary', event =>
    handlers.onSummary(parseStreamEvent<{ text: string }>(event).text),
  );
  source.addEventListener('report', event => {
    close();
    handlers.onReport(
      getSessionReportAdapter(parseStreamEvent<ISessionReportApiResponse>(event)),
    );
  });
  source.addEventListener('error', event => {
    close();
    handlers.onError(toStreamError(event));
  });

  return close;
};
