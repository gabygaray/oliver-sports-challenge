import { describe, expect, it } from 'vitest';
import { MetricKey, SessionType, TrendBasis, TrendDirection } from '../../../shared/enums';
import { ROWS_FIXTURE, THRESHOLDS_FIXTURE } from '../../fixtures/report.fixtures';
import { buildEvolutionContext, buildPlayerSessionRows } from '../../../modules/players/evolution-context';
import { PlayerSessionInput } from '../../../modules/players/players.types';

const player = { player_id: 6, player_name: 'Santiago Molina', position: 'MF', shirt_number: 6 };
const molina = ROWS_FIXTURE.find((row) => row.player_id === 6)!;

const session = (id: number, date: string, durationMin = 90) => ({
    id,
    date,
    title: `Sesión ${id}`,
    type: SessionType.Training,
    duration_min: durationMin,
});

const inputs: PlayerSessionInput[] = [
    { session: session(101, '2026-09-10'), row: { ...molina, total_distance_m: 8000, sprints: 20, rpe: 7, workload_au: 630 } },
    // Reduced minutes: must not take part in trends.
    { session: session(102, '2026-09-15'), row: { ...molina, minutes_played: 30, total_distance_m: 2500, sprints: 5, rpe: 4, workload_au: 120 } },
    { session: session(103, '2026-09-19'), row: { ...molina, rpe: null, workload_au: null } },
];

describe('buildEvolutionContext', () => {
    const rows = buildPlayerSessionRows(inputs, THRESHOLDS_FIXTURE);
    const context = buildEvolutionContext(player, rows);

    it('flags reduced-minutes sessions', () => {
        expect(context.sessions.map((row) => row.reduced_minutes)).toEqual([false, true, false]);
    });

    it('computes the change between the first and last comparable sessions only', () => {
        const distance = context.trends.find((trend) => trend.metric === MetricKey.TotalDistanceM)!;
        expect(distance).toEqual({
            metric: MetricKey.TotalDistanceM,
            basis: TrendBasis.Per90Min,
            reference_minutes: 90,
            first: 8000,
            first_session_date: '2026-09-10',
            first_session_type: SessionType.Training,
            first_minutes: 90,
            last: 10488,
            last_session_date: '2026-09-19',
            last_session_type: SessionType.Training,
            last_minutes: 90,
            change_pct: 31.1,
            direction: TrendDirection.Up,
        });
    });

    it('projects totals to 90 minutes so a longer session does not read as progress, and leaves peaks absolute', () => {
        // Player 1 of the dataset: 5383 m in 75 minutes, then 7344 m in 90. Raw change +36.4%; per 90 minutes +13.7%.
        const uneven = buildEvolutionContext(
            player,
            buildPlayerSessionRows(
                [
                    { session: session(101, '2026-09-15', 75), row: { ...molina, minutes_played: 75, total_distance_m: 5383, max_speed_kmh: 30.4 } },
                    {
                        session: { ...session(103, '2026-09-19'), type: SessionType.Match },
                        row: { ...molina, total_distance_m: 7344, max_speed_kmh: 32.4 },
                    },
                ],
                THRESHOLDS_FIXTURE,
            ),
        );
        expect(uneven.trends.find((trend) => trend.metric === MetricKey.TotalDistanceM)).toMatchObject({
            basis: TrendBasis.Per90Min,
            first: 6460,
            first_minutes: 75,
            first_session_type: SessionType.Training,
            last: 7344,
            last_minutes: 90,
            last_session_type: SessionType.Match,
            change_pct: 13.7,
        });
        expect(uneven.trends.find((trend) => trend.metric === MetricKey.MaxSpeedKmh)).toMatchObject({
            basis: TrendBasis.Absolute,
            reference_minutes: null,
            first: 30.4,
            last: 32.4,
        });
    });

    it('leaves the change empty with a single comparable session', () => {
        const single = buildEvolutionContext(player, buildPlayerSessionRows([inputs[0], inputs[1]], THRESHOLDS_FIXTURE));
        expect(single.trends.find((trend) => trend.metric === MetricKey.TotalDistanceM)).toMatchObject({
            first: 8000,
            first_session_date: '2026-09-10',
            last: null,
            last_session_date: null,
            last_minutes: null,
            change_pct: null,
            direction: null,
        });
    });

    it('lists the sessions without RPE by date and keeps RPE and workload out of the trends', () => {
        expect(context.sessions_without_rpe).toEqual(['2026-09-19']);
        expect(context.trends.map((trend) => trend.metric)).not.toContain(MetricKey.Rpe);
        expect(context.trends.map((trend) => trend.metric)).not.toContain(MetricKey.WorkloadAu);
    });

    it('spells out the direction of a drop so the model never reads the sign', () => {
        const dropping = buildEvolutionContext(
            player,
            buildPlayerSessionRows([inputs[0], { ...inputs[2], row: { ...inputs[2].row, sprints: 15 } }], THRESHOLDS_FIXTURE),
        );
        const sprints = dropping.trends.find((trend) => trend.metric === MetricKey.Sprints)!;
        expect(sprints).toMatchObject({ first: 20, last: 15, change_pct: -25, direction: TrendDirection.Down });
    });

    it('sends the player without the shirt number', () => {
        expect(context.player).toEqual({ player_id: 6, player_name: 'Santiago Molina', position: 'MF' });
    });

    it('attaches every threshold alert to the rows the API returns', () => {
        expect(rows[0].alerts.map((alert) => alert.metric)).toEqual([MetricKey.WorkloadAu]);
        expect(rows[2].alerts.map((alert) => alert.metric)).toContain(MetricKey.TotalDistanceM);
    });

    it('sends the model only the critical alerts of each session and no thresholds', () => {
        // Every alert in the fixture is a warning.
        expect(context.sessions.map((row) => row.critical_alerts)).toEqual([[], [], []]);
        expect(context.sessions[0]).not.toHaveProperty('alerts');
        expect(context).not.toHaveProperty('thresholds');

        const overloaded = buildEvolutionContext(
            player,
            buildPlayerSessionRows([{ ...inputs[0], row: { ...inputs[0].row, rpe: 9, workload_au: 810 } }], THRESHOLDS_FIXTURE),
        );
        expect(overloaded.sessions[0].critical_alerts).toEqual([
            expect.objectContaining({ metric: MetricKey.WorkloadAu, value: 810, level: 'critical' }),
        ]);
        expect(overloaded.alerts_summary).toMatchObject({ critical: 1, warning: 1 });
    });

    it('summarises the alerts across sessions so the model never counts them', () => {
        // Session 1: workload 630 is a warning. Session 2 has reduced minutes but its alerts still count. Session 3: distance 10488 is a warning.
        expect(context.alerts_summary).toMatchObject({ critical: 0, sessions_affected: 2 });
        expect(context.alerts_summary.metrics).toEqual(expect.arrayContaining([MetricKey.WorkloadAu, MetricKey.TotalDistanceM]));
    });
});
