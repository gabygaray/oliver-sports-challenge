import { MetricKey } from '../../shared/enums';
import { ReportMeta, ThresholdAlert } from '../reports/reports.types';
import { PlayerMetricsRow, SessionSummary, ThresholdMap } from '../sessions/sessions.types';

/** A session row paired with its session, as the repository returns them. */
export interface PlayerSessionInput {
    session: SessionSummary;
    row: PlayerMetricsRow;
}

export interface PlayerSummary {
    player_id: number;
    player_name: string;
    position: string;
    shirt_number: number;
}

/** One session of the player, with the flags the model needs to read it correctly. */
export interface PlayerSessionRow {
    session: SessionSummary;
    metrics: Omit<PlayerMetricsRow, 'player_id' | 'player_name' | 'position' | 'shirt_number'>;
    /** Under 75% of the session minutes: totals are not comparable with other sessions. */
    reduced_minutes: boolean;
    alerts: ThresholdAlert[];
}

export interface MetricTrend {
    metric: MetricKey;
    first: number | null;
    last: number | null;
    /** Null when fewer than two comparable sessions have the metric. */
    change_pct: number | null;
}

/** Everything the model receives about the player; trends are precomputed so it never does arithmetic. */
export interface EvolutionContext {
    player: PlayerSummary;
    sessions: PlayerSessionRow[];
    comparable_sessions: number;
    sessions_without_rpe: number[];
    trends: MetricTrend[];
    thresholds: ThresholdMap;
}

export interface PlayerEvolutionReport {
    player: PlayerSummary;
    sessions: PlayerSessionRow[];
    trends: MetricTrend[];
    summary: string;
    observations: string[];
    meta: ReportMeta;
}
