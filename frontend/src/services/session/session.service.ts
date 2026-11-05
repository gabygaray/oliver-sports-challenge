import { getSessionMetricsAdapter, getSessionsAdapter } from '../../adapters';
import { IMetricsQuery, ISession, ISessionMetrics } from '../../models';
import { IMetricsQueryParams, METHOD, TAG_TYPES_SESSIONS } from '../../utilities';
import { baseApi } from '../api';
import { QUERY_URL_SESSIONS } from '../URL';

export const sessionApi = baseApi
  .enhanceEndpoints({ addTagTypes: [TAG_TYPES_SESSIONS.sessions] })
  .injectEndpoints({
    endpoints: builder => ({
      getSessions: builder.query<ISession[], void>({
        query: () => ({
          url: QUERY_URL_SESSIONS.getBasePathSessions(),
          method: METHOD.GET,
        }),
        transformResponse: getSessionsAdapter,
        providesTags: [TAG_TYPES_SESSIONS.sessions],
      }),

      // Sorting happens in the API, so every column change is a new query key.
      getSessionMetrics: builder.query<ISessionMetrics, IMetricsQuery>({
        query: ({ sessionId, playerId, orderBy, order }) => {
          const params: IMetricsQueryParams = {
            player_id: playerId,
            order_by: orderBy,
            order,
          };
          return {
            url: QUERY_URL_SESSIONS.sessionMetrics(sessionId),
            method: METHOD.GET,
            params,
          };
        },
        transformResponse: getSessionMetricsAdapter,
        providesTags: [TAG_TYPES_SESSIONS.sessions],
      }),
    }),
  });

export const { useGetSessionsQuery, useGetSessionMetricsQuery } = sessionApi;
