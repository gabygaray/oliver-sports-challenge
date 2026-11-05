import { MetricKey, SessionType } from '../../shared/enums';

export interface SessionSummary {
    id: number;
    date: string;
    title: string;
    type: SessionType;
    duration_min: number;
}

export interface PlayerMetricsRow {
    player_id: number;
    player_name: string;
    position: string;
    shirt_number: number;
    minutes_played: number;
    total_distance_m: number;
    high_speed_running_m: number;
    sprints: number;
    max_speed_kmh: number;
    accelerations: number;
    rpe: number | null;
    workload_au: number | null;
}

export interface ThresholdLimits {
    warning: number;
    critical: number | null;
}

export type ThresholdMap = Partial<Record<MetricKey, ThresholdLimits>>;

export interface SessionMetricsResponse {
    session: SessionSummary;
    thresholds: ThresholdMap;
    metrics: PlayerMetricsRow[];
}
