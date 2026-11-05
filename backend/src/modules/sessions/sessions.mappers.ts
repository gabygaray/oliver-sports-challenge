import { MetricThreshold } from '../../entities/metric-threshold.entity';
import { PlayerSession } from '../../entities/player-session.entity';
import { Session } from '../../entities/session.entity';
import { PlayerMetricsRow, SessionSummary, ThresholdMap } from './sessions.types';

export const toSessionSummary = (session: Session): SessionSummary => ({
    id: session.id,
    date: session.date,
    title: session.title,
    type: session.type,
    duration_min: session.durationMin,
});

/** Flattens the player join into one row; `player` is always loaded by the repository query. */
export const toPlayerMetricsRow = (row: PlayerSession): PlayerMetricsRow => ({
    player_id: row.playerId,
    player_name: row.player?.name ?? '',
    position: row.player?.position ?? '',
    shirt_number: row.player?.shirtNumber ?? 0,
    minutes_played: row.minutesPlayed,
    total_distance_m: row.totalDistanceM,
    high_speed_running_m: row.highSpeedRunningM,
    sprints: row.sprints,
    max_speed_kmh: row.maxSpeedKmh,
    accelerations: row.accelerations,
    rpe: row.rpe,
    workload_au: row.workloadAu,
});

export const toThresholdMap = (thresholds: MetricThreshold[]): ThresholdMap =>
    Object.fromEntries(thresholds.map((threshold) => [threshold.metric, { warning: threshold.warning, critical: threshold.critical }]));
