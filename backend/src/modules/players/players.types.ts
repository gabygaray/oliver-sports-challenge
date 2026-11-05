import { MetricKey, TrendDirection } from '../../shared/enums';
import { AlertsSummary, ReportMeta, ThresholdAlert } from '../reports/reports.types';
import { PlayerMetricsRow, SessionSummary } from '../sessions/sessions.types';

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

/** The player as the model sees it: the shirt number is left out so it cannot be confused with the id. */
export type ModelPlayerSummary = Omit<PlayerSummary, 'shirt_number'>;

/** One session of the player, with the flags the model needs to read it correctly. */
export interface PlayerSessionRow {
    session: SessionSummary;
    metrics: Omit<PlayerMetricsRow, 'player_id' | 'player_name' | 'position' | 'shirt_number'>;
    /** Under 75% of the session minutes: totals are not comparable with other sessions. */
    reduced_minutes: boolean;
    alerts: ThresholdAlert[];
}

/** The session as the model sees it: only the critical alerts. */
export type ModelSessionRow = Omit<PlayerSessionRow, 'alerts'> & { critical_alerts: ThresholdAlert[] };

export interface EvolutionAlertsSummary extends AlertsSummary {
    sessions_affected: number;
}

/** The two comparable sessions a trend compares, with their dates so the model never has to work out which they were. */
export interface MetricTrend {
    metric: MetricKey;
    first: number | null;
    first_session_date: string | null;
    last: number | null;
    last_session_date: string | null;
    /** Null when fewer than two comparable sessions have the metric. */
    change_pct: number | null;
    /** Spelled out so the model describes the trend without reading the sign of change_pct. */
    direction: TrendDirection | null;
}

/** Everything the model receives about the player; trends are precomputed so it never does arithmetic. */
export interface EvolutionContext {
    player: ModelPlayerSummary;
    sessions: ModelSessionRow[];
    comparable_sessions: number;
    /** Dates, not ids: the model quotes sessions by date. */
    sessions_without_rpe: string[];
    alerts_summary: EvolutionAlertsSummary;
    trends: MetricTrend[];
}

export interface PlayerEvolutionReport {
    player: PlayerSummary;
    sessions: PlayerSessionRow[];
    trends: MetricTrend[];
    summary: string;
    observations: string[];
    meta: ReportMeta;
}
