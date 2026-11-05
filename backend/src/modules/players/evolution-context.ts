import { TrendDirection } from '../../shared/enums';
import { detectThresholdAlerts, onlyCritical, summarizeAlerts } from '../reports/report-context';
import { REDUCED_MINUTES_RATIO } from '../reports/reports.constants';
import { ThresholdMap } from '../sessions/sessions.types';
import { TREND_METRICS } from './players.constants';
import {
    EvolutionContext,
    MetricTrend,
    ModelPlayerSummary,
    ModelSessionRow,
    PlayerSessionInput,
    PlayerSessionRow,
    PlayerSummary,
} from './players.types';

/** One row per session with every alert, as the API returns them. */
export const buildPlayerSessionRows = (inputs: PlayerSessionInput[], thresholds: ThresholdMap): PlayerSessionRow[] =>
    inputs.map((input) => toSessionRow(input, thresholds));

const toSessionRow = ({ session, row }: PlayerSessionInput, thresholds: ThresholdMap): PlayerSessionRow => {
    const { minutes_played, total_distance_m, high_speed_running_m, sprints, max_speed_kmh, accelerations, rpe, workload_au } = row;
    return {
        session,
        metrics: { minutes_played, total_distance_m, high_speed_running_m, sprints, max_speed_kmh, accelerations, rpe, workload_au },
        reduced_minutes: row.minutes_played < session.duration_min * REDUCED_MINUTES_RATIO,
        alerts: detectThresholdAlerts([row], thresholds),
    };
};

const toDirection = (changePct: number | null): TrendDirection | null => {
    if (changePct === null) return null;
    if (changePct === 0) return TrendDirection.Flat;
    return changePct > 0 ? TrendDirection.Up : TrendDirection.Down;
};

/** First vs last comparable session per metric, each with its date; sessions with reduced minutes or missing values are skipped. */
export const computeTrends = (rows: PlayerSessionRow[]): MetricTrend[] =>
    TREND_METRICS.map((metric) => {
        const points = rows
            .filter((row) => !row.reduced_minutes && row.metrics[metric] !== null)
            .map((row) => ({ date: row.session.date, value: row.metrics[metric] as number }));
        const first = points[0] ?? null;
        const last = points.length > 1 ? points[points.length - 1] : null;
        const change_pct = first && last && first.value !== 0 ? Number((((last.value - first.value) / first.value) * 100).toFixed(1)) : null;
        return {
            metric,
            first: first?.value ?? null,
            first_session_date: first?.date ?? null,
            last: last?.value ?? null,
            last_session_date: last?.date ?? null,
            change_pct,
            direction: toDirection(change_pct),
        };
    });

const toModelPlayerSummary = ({ shirt_number: _shirtNumber, ...player }: PlayerSummary): ModelPlayerSummary => player;

const toModelSessionRow = ({ alerts, ...row }: PlayerSessionRow): ModelSessionRow => ({ ...row, critical_alerts: onlyCritical(alerts) });

export const buildEvolutionContext = (player: PlayerSummary, sessions: PlayerSessionRow[]): EvolutionContext => ({
    player: toModelPlayerSummary(player),
    sessions: sessions.map(toModelSessionRow),
    comparable_sessions: sessions.filter((row) => !row.reduced_minutes).length,
    sessions_without_rpe: sessions.filter((row) => row.metrics.rpe === null).map((row) => row.session.date),
    alerts_summary: {
        ...summarizeAlerts(sessions.flatMap((row) => row.alerts)),
        sessions_affected: sessions.filter((row) => row.alerts.length > 0).length,
    },
    trends: computeTrends(sessions),
});
