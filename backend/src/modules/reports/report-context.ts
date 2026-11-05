import { MetricKey } from '../../shared/enums';
import { PlayerMetricsRow, SessionSummary, ThresholdMap } from '../sessions/sessions.types';
import { exceedsLimit, LEADER_METRICS, LEADERS_PER_METRIC, REDUCED_MINUTES_RATIO } from './reports.constants';
import { MetricLeader, ReportContext, TeamAggregates, ThresholdAlert } from './reports.types';

const round = (value: number, decimals = 1): number => Number(value.toFixed(decimals));

const metricValue = (row: PlayerMetricsRow, metric: MetricKey): number | null => row[metric];

/** Strictly above the limit (see exceedsLimit); critical wins over warning when both are exceeded. */
export const detectThresholdAlerts = (rows: PlayerMetricsRow[], thresholds: ThresholdMap): ThresholdAlert[] => {
    const alerts: ThresholdAlert[] = [];

    for (const row of rows) {
        for (const [metric, limits] of Object.entries(thresholds) as [MetricKey, ThresholdMap[MetricKey]][]) {
            const value = metricValue(row, metric);
            if (value === null || !limits) continue;

            if (limits.critical !== null && exceedsLimit(value, limits.critical)) {
                alerts.push({ player_id: row.player_id, player_name: row.player_name, metric, value, limit: limits.critical, level: 'critical' });
            } else if (exceedsLimit(value, limits.warning)) {
                alerts.push({ player_id: row.player_id, player_name: row.player_name, metric, value, limit: limits.warning, level: 'warning' });
            }
        }
    }

    return alerts.sort((a, b) => (a.level === b.level ? b.value - a.value : a.level === 'critical' ? -1 : 1));
};

/** Top players per metric, skipping null values and players with reduced minutes (their totals are not comparable). */
export const findMetricLeaders = (rows: PlayerMetricsRow[], durationMin: number): Partial<Record<MetricKey, MetricLeader[]>> => {
    const comparable = rows.filter((row) => row.minutes_played >= durationMin * REDUCED_MINUTES_RATIO);
    const leaders: Partial<Record<MetricKey, MetricLeader[]>> = {};

    for (const metric of LEADER_METRICS) {
        leaders[metric] = comparable
            .flatMap((row) => {
                const value = metricValue(row, metric);
                return value === null ? [] : [{ player_id: row.player_id, player_name: row.player_name, value }];
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, LEADERS_PER_METRIC);
    }

    return leaders;
};

export const buildTeamAggregates = (rows: PlayerMetricsRow[], durationMin: number): TeamAggregates => {
    const withRpe = rows.filter((row) => row.rpe !== null);
    const avg = (values: number[]): number => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

    return {
        players_count: rows.length,
        players_with_full_minutes: rows.filter((row) => row.minutes_played >= durationMin).length,
        avg_total_distance_m: round(avg(rows.map((row) => row.total_distance_m)), 0),
        total_sprints: rows.reduce((sum, row) => sum + row.sprints, 0),
        avg_rpe: withRpe.length ? round(avg(withRpe.map((row) => row.rpe as number))) : null,
        players_without_rpe: rows.filter((row) => row.rpe === null).map((row) => row.player_id),
        players_with_reduced_minutes: rows
            .filter((row) => row.minutes_played < durationMin * REDUCED_MINUTES_RATIO)
            .map((row) => ({ player_id: row.player_id, minutes_played: row.minutes_played })),
    };
};

export const buildReportContext = (session: SessionSummary, rows: PlayerMetricsRow[], thresholds: ThresholdMap): ReportContext => ({
    session,
    team: buildTeamAggregates(rows, session.duration_min),
    thresholds,
    alerts: detectThresholdAlerts(rows, thresholds),
    leaders: findMetricLeaders(rows, session.duration_min),
    players: rows,
});
