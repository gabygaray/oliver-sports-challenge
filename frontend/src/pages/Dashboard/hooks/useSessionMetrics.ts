import { useMemo, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';

import { MetricKey } from '../../../models';
import { useGetSessionMetricsQuery } from '../../../services';
import { useLanguage } from '../../../contexts/language-context';
import { getApiError, resolveApiErrorMessage } from '../../../utilities';
import { INITIAL_SORT, ISortState, IUseSessionMetrics } from '../utilities';

/** Metrics of the selected session, sorted by the API according to the active column. */
export const useSessionMetrics = (sessionId: number | null): IUseSessionMetrics => {
  const { t } = useLanguage();
  const [sort, setSort] = useState<ISortState>(INITIAL_SORT);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetSessionMetricsQuery(
      sessionId === null
        ? skipToken
        : { sessionId, orderBy: sort.orderBy ?? undefined, order: sort.order },
    );

  const toggleSort = (metric: MetricKey) =>
    setSort(current => ({
      orderBy: metric,
      order: current.orderBy === metric && current.order === 'desc' ? 'asc' : 'desc',
    }));

  const players = useMemo(() => data?.players ?? [], [data]);
  const thresholds = useMemo(() => data?.thresholds ?? {}, [data]);

  return {
    players,
    thresholds,
    sort,
    toggleSort,
    isLoading,
    isFetching,
    isError,
    errorMessage: isError ? resolveApiErrorMessage(getApiError(error), t.apiErrors) : '',
    refetch,
  };
};
