import { useEffect, useMemo, useRef, useState } from 'react';

import {
  useGeneratePlayerEvolutionReportMutation,
  useGetPlayersQuery,
} from '../../../services';
import { getApiError } from '../../../utilities';
import { IUsePlayerEvolution } from '../utilities';
import { useReportOptions } from './useReportOptions';

/** Player picker plus the evolution report mutation; the result is dropped when the player changes. */
export const usePlayerEvolution = (): IUsePlayerEvolution => {
  const options = useReportOptions();
  const { data, isLoading: isLoadingPlayers } = useGetPlayersQuery();
  const [pickedPlayerId, setPickedPlayerId] = useState<number | null>(null);
  const [generateReport, { data: report, isLoading, isError, error, reset }] =
    useGeneratePlayerEvolutionReportMutation();

  const players = useMemo(() => data ?? [], [data]);
  const selectedPlayerId = pickedPlayerId ?? players[0]?.playerId ?? null;

  // `reset` changes identity on every trigger, so only an actual player change may call it.
  const lastPlayerId = useRef(selectedPlayerId);
  useEffect(() => {
    if (lastPlayerId.current === selectedPlayerId) return;
    lastPlayerId.current = selectedPlayerId;
    reset();
  }, [selectedPlayerId, reset]);

  const generate = (force = false) => {
    if (selectedPlayerId === null) return;
    generateReport({
      playerId: selectedPlayerId,
      language: options.language,
      audience: options.audience,
      force,
    });
  };

  return {
    ...options,
    players,
    selectedPlayerId,
    selectPlayer: setPickedPlayerId,
    isLoadingPlayers,
    report: report ?? null,
    isLoading,
    isError,
    isEmpty: !report && !isLoading && !isError,
    errorMessage: isError ? getApiError(error).message : '',
    generate: () => generate(false),
    regenerate: () => generate(true),
  };
};
