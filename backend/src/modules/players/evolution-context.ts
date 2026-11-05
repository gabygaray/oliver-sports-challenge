import { detectThresholdAlerts } from '../reports/report-context';
import { REDUCED_MINUTES_RATIO } from '../reports/reports.constants';
import { ThresholdMap } from '../sessions/sessions.types';
import { TREND_METRICS } from './players.constants';
import { EvolutionContext, MetricTrend, PlayerSessionInput, PlayerSessionRow, PlayerSummary } from './players.types';

const toSessionRow = ({ session, row }: PlayerSessionInput, thresholds: ThresholdMap): PlayerSessionRow => {
    const { minutes_played, total_distance_m, high_speed_running_m, sprints, max_speed_kmh, accelerations, rpe, workload_au } = row;
    return {
        session,
        metrics: { minutes_played, total_distance_m, high_speed_running_m, sprints, max_speed_kmh, accelerations, rpe, workload_au },
        reduced_minutes: row.minutes_played < session.duration_min * REDUCED_MINUTES_RATIO,
        alerts: detectThresholdAlerts([row], thresholds),
    };
};

/** First vs last comparable session per metric; sessions with reduced minutes or missing values are skipped. */
export const computeTrends = (rows: PlayerSessionRow[]): MetricTrend[] =>
    TREND_METRICS.map((metric) => {
        const values = rows
            .filter((row) => !row.reduced_minutes)
            .flatMap((row) => (row.metrics[metric] === null ? [] : [row.metrics[metric] as number]));
        const first = values[0] ?? null;
        const last = values.length > 1 ? values[values.length - 1] : null;
        const change_pct = first !== null && last !== null && first !== 0 ? Number((((last - first) / first) * 100).toFixed(1)) : null;
        return { metric, first, last, change_pct };
    });

export const buildEvolutionContext = (player: PlayerSummary, inputs: PlayerSessionInput[], thresholds: ThresholdMap): EvolutionContext => {
    const sessions = inputs.map((input) => toSessionRow(input, thresholds));
    return {
        player,
        sessions,
        comparable_sessions: sessions.filter((row) => !row.reduced_minutes).length,
        sessions_without_rpe: sessions.filter((row) => row.metrics.rpe === null).map((row) => row.session.id),
        trends: computeTrends(sessions),
        thresholds,
    };
};
