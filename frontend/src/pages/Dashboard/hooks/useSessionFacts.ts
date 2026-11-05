import { useMemo } from 'react';

import { useLanguage } from '../../../contexts/language-context';
import { AlertLevel, IPlayerMetrics, ISession, TThresholdMap } from '../../../models';
import { formatCount } from '../../../utilities';
import { ISessionFactItem, summarizeSession } from '../utilities';

/** Session facts for the header as ready-to-render items; zero counts are left out. */
export const useSessionFacts = (
  players: IPlayerMetrics[],
  thresholds: TThresholdMap,
  session: ISession | null,
): ISessionFactItem[] => {
  const { t } = useLanguage();
  const labels = t.dashboard.hero.facts;

  return useMemo(() => {
    if (!session || !players.length) return [];
    const facts = summarizeSession(players, thresholds, session);
    const items: ISessionFactItem[] = [
      {
        value: facts.criticalAlerts,
        label: formatCount(facts.criticalAlerts, ...labels.critical),
        level: AlertLevel.Critical,
      },
      {
        value: facts.warningAlerts,
        label: formatCount(facts.warningAlerts, ...labels.warning),
        level: AlertLevel.Warning,
      },
      {
        value: facts.reducedMinutesPlayers,
        label: formatCount(facts.reducedMinutesPlayers, ...labels.reducedMinutes),
        level: null,
      },
      {
        value: facts.playersWithoutRpe,
        label: formatCount(facts.playersWithoutRpe, ...labels.withoutRpe),
        level: null,
      },
    ];
    return items.filter(item => item.value > 0);
  }, [players, thresholds, session, labels]);
};
