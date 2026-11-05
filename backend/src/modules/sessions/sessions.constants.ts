import { PlayerSession } from '../../entities/player-session.entity';
import { MetricKey } from '../../shared/enums';

/** Query param metric names (snake_case, as in the dataset) to entity properties used by the query builder. */
export const METRIC_COLUMNS: Record<MetricKey, keyof PlayerSession> = {
    [MetricKey.MinutesPlayed]: 'minutesPlayed',
    [MetricKey.TotalDistanceM]: 'totalDistanceM',
    [MetricKey.HighSpeedRunningM]: 'highSpeedRunningM',
    [MetricKey.Sprints]: 'sprints',
    [MetricKey.MaxSpeedKmh]: 'maxSpeedKmh',
    [MetricKey.Accelerations]: 'accelerations',
    [MetricKey.Rpe]: 'rpe',
    [MetricKey.WorkloadAu]: 'workloadAu',
};
