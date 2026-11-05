import { MetricKey, SessionType } from '../../shared/enums';
import { PlayerMetricsRow, SessionSummary, ThresholdMap } from '../../modules/sessions/sessions.types';
import { buildReportContext, detectThresholdAlerts } from '../../modules/reports/report-context';
import { ReportContext } from '../../modules/reports/reports.types';

/** Small roster that covers the dataset's edge cases: a missing RPE, a reduced-minutes player and limit values. */
export const SESSION_FIXTURE: SessionSummary = { id: 103, date: '2026-09-19', title: 'Partido amistoso', type: SessionType.Match, duration_min: 90 };

export const THRESHOLDS_FIXTURE: ThresholdMap = {
    [MetricKey.TotalDistanceM]: { warning: 9500, critical: null },
    [MetricKey.Sprints]: { warning: 28, critical: null },
    [MetricKey.Rpe]: { warning: 8, critical: null },
    [MetricKey.WorkloadAu]: { warning: 600, critical: 750 },
};

const row = (overrides: Partial<PlayerMetricsRow> & Pick<PlayerMetricsRow, 'player_id' | 'player_name'>): PlayerMetricsRow => ({
    position: 'MF',
    shirt_number: overrides.player_id,
    minutes_played: 90,
    total_distance_m: 6000,
    high_speed_running_m: 500,
    sprints: 10,
    max_speed_kmh: 29.5,
    accelerations: 30,
    rpe: 6,
    workload_au: 540,
    ...overrides,
});

/** Model context for the fixture, alerts included. */
export const buildFixtureContext = (rows: PlayerMetricsRow[] = ROWS_FIXTURE, thresholds: ThresholdMap = THRESHOLDS_FIXTURE): ReportContext =>
    buildReportContext(SESSION_FIXTURE, rows, detectThresholdAlerts(rows, thresholds));

export const ROWS_FIXTURE: PlayerMetricsRow[] = [
    row({ player_id: 1, player_name: 'Nicolás Herrera', position: 'GK', total_distance_m: 3900, sprints: 1, rpe: 4, workload_au: 360 }),
    row({ player_id: 3, player_name: 'Mateo Suárez', rpe: null, workload_au: null }),
    row({ player_id: 6, player_name: 'Santiago Molina', total_distance_m: 10488, sprints: 21, accelerations: 58, rpe: 9, workload_au: 810 }),
    row({ player_id: 11, player_name: 'Bruno Acosta', total_distance_m: 8840, sprints: 29, max_speed_kmh: 31.6, rpe: 9, workload_au: 810 }),
    row({ player_id: 10, player_name: 'Martín Álvarez', total_distance_m: 7344, sprints: 24, max_speed_kmh: 32.4, rpe: 7, workload_au: 630 }),
    // Exactly on the warning limits: "superar" is strict, so this must not raise alerts.
    row({ player_id: 9, player_name: 'Facundo Ríos', sprints: 28, rpe: 8, workload_au: 600 }),
    // Reduced minutes: excluded from leaders, never compared on totals.
    row({
        player_id: 16,
        player_name: 'Franco Medina',
        minutes_played: 28,
        total_distance_m: 2128,
        sprints: 4,
        max_speed_kmh: 33.1,
        rpe: 5,
        workload_au: 140,
    }),
];
