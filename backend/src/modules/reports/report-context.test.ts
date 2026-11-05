import { describe, expect, it } from 'vitest';
import { MetricKey } from '../../shared/enums';
import { buildReportContext, buildTeamAggregates, detectThresholdAlerts, findMetricLeaders } from './report-context';
import { ROWS_FIXTURE, SESSION_FIXTURE, THRESHOLDS_FIXTURE } from './report.fixtures';

const alertsOf = (playerId: number) => detectThresholdAlerts(ROWS_FIXTURE, THRESHOLDS_FIXTURE).filter((alert) => alert.player_id === playerId);

describe('detectThresholdAlerts', () => {
    it('raises a critical alert (and not a warning) when the critical limit is exceeded', () => {
        const molina = alertsOf(6);
        const workload = molina.filter((alert) => alert.metric === MetricKey.WorkloadAu);

        expect(workload).toHaveLength(1);
        expect(workload[0]).toMatchObject({ level: 'critical', value: 810, limit: 750 });
    });

    it('does not raise an alert for a value exactly on the limit', () => {
        expect(alertsOf(9)).toEqual([]);
    });

    it('skips null metrics instead of comparing them', () => {
        expect(alertsOf(3)).toEqual([]);
    });

    it('never raises alerts for metrics without thresholds or for values below the limits', () => {
        expect(alertsOf(1)).toEqual([]);
        expect(detectThresholdAlerts(ROWS_FIXTURE, {})).toEqual([]);
    });

    it('sorts critical alerts first and higher values first within a level', () => {
        const levels = detectThresholdAlerts(ROWS_FIXTURE, THRESHOLDS_FIXTURE).map((alert) => alert.level);
        const firstWarning = levels.indexOf('warning');

        expect(levels.slice(0, firstWarning).every((level) => level === 'critical')).toBe(true);
        expect(levels.slice(firstWarning).every((level) => level === 'warning')).toBe(true);
    });
});

describe('findMetricLeaders', () => {
    const leaders = findMetricLeaders(ROWS_FIXTURE, SESSION_FIXTURE.duration_min);

    it('ranks players by value, three per metric', () => {
        expect(leaders[MetricKey.TotalDistanceM]?.map((leader) => leader.player_id)).toEqual([6, 11, 10]);
    });

    it('excludes players with reduced minutes even when they top a metric', () => {
        // Medina has the highest max speed (33.1) but played 28 of 90 minutes.
        const ids = leaders[MetricKey.MaxSpeedKmh]?.map((leader) => leader.player_id) ?? [];
        expect(ids).not.toContain(16);
        expect(ids.slice(0, 2)).toEqual([10, 11]);
    });

    it('only covers the metrics meant for highlights', () => {
        expect(leaders[MetricKey.Rpe]).toBeUndefined();
        expect(leaders[MetricKey.WorkloadAu]).toBeUndefined();
    });
});

describe('buildTeamAggregates', () => {
    const team = buildTeamAggregates(ROWS_FIXTURE, SESSION_FIXTURE.duration_min);

    it('lists players without RPE and averages RPE over the rest', () => {
        expect(team.players_without_rpe).toEqual([3]);
        // (4 + 9 + 9 + 7 + 8 + 5) / 6
        expect(team.avg_rpe).toBe(7);
    });

    it('flags players below 75% of the session minutes', () => {
        expect(team.players_with_reduced_minutes).toEqual([{ player_id: 16, minutes_played: 28 }]);
        expect(team.players_with_full_minutes).toBe(6);
    });

    it('rounds the team averages', () => {
        expect(Number.isInteger(team.avg_total_distance_m)).toBe(true);
        expect(team.total_sprints).toBe(117);
    });

    it('reports a null average RPE when nobody reported it', () => {
        const rows = ROWS_FIXTURE.map((row) => ({ ...row, rpe: null, workload_au: null }));
        expect(buildTeamAggregates(rows, 90).avg_rpe).toBeNull();
    });
});

describe('buildReportContext', () => {
    it('bundles session, aggregates, alerts, leaders and the full roster', () => {
        const context = buildReportContext(SESSION_FIXTURE, ROWS_FIXTURE, THRESHOLDS_FIXTURE);

        expect(context.session).toBe(SESSION_FIXTURE);
        expect(context.players).toHaveLength(ROWS_FIXTURE.length);
        expect(context.alerts.length).toBeGreaterThan(0);
        expect(context.thresholds).toBe(THRESHOLDS_FIXTURE);
    });
});
