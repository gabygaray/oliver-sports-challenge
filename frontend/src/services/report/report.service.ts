import { getSessionReportAdapter } from '../../adapters';
import { IReportParams, ISessionReport } from '../../models';
import { IReportBody, METHOD } from '../../utilities';
import { baseApi } from '../api';
import { QUERY_URL_SESSIONS } from '../URL';

export const reportApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // A mutation rather than a query: each click should hit the model again, never the cache.
    generateSessionReport: builder.mutation<ISessionReport, IReportParams>({
      query: ({ sessionId, language, audience }) => {
        const body: IReportBody = { language, audience };
        return {
          url: QUERY_URL_SESSIONS.sessionReport(sessionId),
          method: METHOD.POST,
          body,
        };
      },
      transformResponse: getSessionReportAdapter,
    }),
  }),
});

export const { useGenerateSessionReportMutation } = reportApi;
