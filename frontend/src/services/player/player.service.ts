import { getPlayerEvolutionAdapter, getPlayersAdapter } from '../../adapters';
import { IEvolutionParams, IPlayer, IPlayerEvolutionReport } from '../../models';
import { IReportBody, METHOD, TAG_TYPES_PLAYERS } from '../../utilities';
import { baseApi } from '../api';
import { QUERY_URL_PLAYERS } from '../URL';

export const playerApi = baseApi
  .enhanceEndpoints({ addTagTypes: [TAG_TYPES_PLAYERS.players] })
  .injectEndpoints({
    endpoints: builder => ({
      getPlayers: builder.query<IPlayer[], void>({
        query: () => ({
          url: QUERY_URL_PLAYERS.getBasePathPlayers(),
          method: METHOD.GET,
        }),
        transformResponse: getPlayersAdapter,
        providesTags: [TAG_TYPES_PLAYERS.players],
      }),

      generatePlayerEvolutionReport: builder.mutation<
        IPlayerEvolutionReport,
        IEvolutionParams
      >({
        query: ({ playerId, language, audience, force }) => {
          const body: IReportBody = { language, audience, force };
          return {
            url: QUERY_URL_PLAYERS.playerEvolutionReport(playerId),
            method: METHOD.POST,
            body,
          };
        },
        transformResponse: getPlayerEvolutionAdapter,
      }),
    }),
  });

export const { useGetPlayersQuery, useGeneratePlayerEvolutionReportMutation } = playerApi;
