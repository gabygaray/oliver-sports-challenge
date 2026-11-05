import { useMemo, useState } from 'react';

import { useGetSessionsQuery } from '../../../services';
import { getApiError } from '../../../utilities';
import { IUseSessionSelection } from '../utilities';

/** Loads the session list and keeps the selected one, defaulting to the most recent. */
export const useSessionSelection = (): IUseSessionSelection => {
  const { data, isLoading, isError, error, refetch } = useGetSessionsQuery();
  const [pickedSessionId, setPickedSessionId] = useState<number | null>(null);

  const sessions = useMemo(() => data ?? [], [data]);

  // The API orders by date ascending, so the last item is the latest session.
  const selectedSessionId = pickedSessionId ?? sessions.at(-1)?.id ?? null;
  const selectedSession = sessions.find(({ id }) => id === selectedSessionId) ?? null;

  return {
    sessions,
    selectedSession,
    selectedSessionId,
    isLoading,
    isError,
    errorMessage: isError ? getApiError(error).message : '',
    selectSession: setPickedSessionId,
    refetch,
  };
};
