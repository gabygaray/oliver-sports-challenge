import { describe, expect, it } from 'vitest';
import { MetricKey, SessionType } from '../../shared/enums';
import { ROWS_FIXTURE, THRESHOLDS_FIXTURE } from '../reports/report.fixtures';
import { buildEvolutionContext } from './evolution-context';
import { PlayerSessionInput } from './players.types';

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
    const context = buildEvolutionContext(player, inputs, THRESHOLDS_FIXTURE);

    it('flags reduced-minutes sessions and counts the comparable ones', () => {
        expect(context.sessions.map((row) => row.reduced_minutes)).toEqual([false, true, false]);
        expect(context.comparable_sessions).toBe(2);
    });

    it('computes the change between the first and last comparable sessions only', () => {
        const distance = context.trends.find((trend) => trend.metric === MetricKey.TotalDistanceM)!;
        expect(distance).toEqual({ metric: MetricKey.TotalDistanceM, first: 8000, last: 10488, change_pct: 31.1 });
    });

    it('leaves the change empty when the metric is missing in the last comparable session', () => {
        const rpe = context.trends.find((trend) => trend.metric === MetricKey.Rpe)!;
        expect(rpe).toEqual({ metric: MetricKey.Rpe, first: 7, last: null, change_pct: null });
        expect(context.sessions_without_rpe).toEqual([103]);
    });

    it('attaches the threshold alerts of each session', () => {
        expect(context.sessions[0].alerts.map((alert) => alert.metric)).toEqual([MetricKey.WorkloadAu]);
        expect(context.sessions[2].alerts.map((alert) => alert.metric)).toContain(MetricKey.TotalDistanceM);
    });
});
