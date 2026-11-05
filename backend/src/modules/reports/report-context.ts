import { MetricKey } from '../../shared/enums';
import { PlayerMetricsRow, SessionSummary, ThresholdMap } from '../sessions/sessions.types';
import { exceedsLimit, LEADER_METRICS, LEADERS_PER_METRIC, REDUCED_MINUTES_RATIO } from './reports.constants';
import { AlertsSummary, MetricLeader, ModelPlayerRow, ReportContext, TeamAggregates, ThresholdAlert } from './reports.types';

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

/** How many alerts of each level and which metrics, so the model never has to count the list itself. */
export const summarizeAlerts = (alerts: ThresholdAlert[]): AlertsSummary => ({
    critical: alerts.filter((alert) => alert.level === 'critical').length,
    warning: alerts.filter((alert) => alert.level === 'warning').length,
    metrics: [...new Set(alerts.map((alert) => alert.metric))],
});

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
        avg_total_distance_m: round(avg(rows.map((row) => row.total_distance_m)), 0),
        total_sprints: rows.reduce((sum, row) => sum + row.sprints, 0),
        avg_rpe: withRpe.length ? round(avg(withRpe.map((row) => row.rpe as number))) : null,
        players_without_rpe: rows.filter((row) => row.rpe === null).map((row) => ({ player_id: row.player_id, player_name: row.player_name })),
        players_with_reduced_minutes: rows
            .filter((row) => row.minutes_played < durationMin * REDUCED_MINUTES_RATIO)
            .map((row) => ({ player_id: row.player_id, player_name: row.player_name, minutes_played: row.minutes_played })),
    };
};

/** Ids and shirt numbers differ in the dataset, so only the id travels to the model. */
export const toModelPlayerRow = ({ shirt_number: _shirtNumber, ...row }: PlayerMetricsRow): ModelPlayerRow => row;

export const onlyCritical = (alerts: ThresholdAlert[]): ThresholdAlert[] => alerts.filter((alert) => alert.level === 'critical');

/** Takes the alerts already detected; the model sees only the critical ones. */
export const buildReportContext = (session: SessionSummary, rows: PlayerMetricsRow[], alerts: ThresholdAlert[]): ReportContext => ({
    session,
    team: buildTeamAggregates(rows, session.duration_min),
    alerts_summary: { ...summarizeAlerts(alerts), players_affected: new Set(alerts.map((alert) => alert.player_id)).size },
    critical_alerts: onlyCritical(alerts),
    leaders: findMetricLeaders(rows, session.duration_min),
    players: rows.map(toModelPlayerRow),
});
