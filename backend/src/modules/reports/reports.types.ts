import { ZodSchema } from 'zod';
import { MetricKey, ReportKind } from '../../shared/enums';
import { PlayerMetricsRow, SessionSummary } from '../sessions/sessions.types';
import { ReportParams } from './reports.schemas';

export type AlertLevel = 'warning' | 'critical';

export interface ThresholdAlert {
    player_id: number;
    player_name: string;
    metric: MetricKey;
    value: number;
    limit: number;
    level: AlertLevel;
}

export interface MetricLeader {
    player_id: number;
    player_name: string;
    value: number;
}

export interface PlayerRef {
    player_id: number;
    player_name: string;
}

export interface ReducedMinutesPlayer extends PlayerRef {
    minutes_played: number;
}

/** Counts over the alerts, precomputed so the model describes the picture without counting anything. */
export interface AlertsSummary {
    critical: number;
    warning: number;
    metrics: MetricKey[];
}

export interface SessionAlertsSummary extends AlertsSummary {
    players_affected: number;
}

export interface TeamAggregates {
    players_count: number;
    players_with_full_minutes: number;
    avg_total_distance_m: number;
    total_sprints: number;
    avg_rpe: number | null;
    players_without_rpe: PlayerRef[];
    players_with_reduced_minutes: ReducedMinutesPlayer[];
}

/** A player row as the model sees it: the shirt number is left out so it cannot be confused with the id. */
export type ModelPlayerRow = Omit<PlayerMetricsRow, 'shirt_number'>;

/** Everything the model receives. Warnings and thresholds stay out: the prompt forbids attributing them. */
export interface ReportContext {
    session: SessionSummary;
    team: TeamAggregates;
    alerts_summary: SessionAlertsSummary;
    critical_alerts: ThresholdAlert[];
    leaders: Partial<Record<MetricKey, MetricLeader[]>>;
    players: ModelPlayerRow[];
}

/** The figure behind a highlight is structured so the validator can check it against the player's own row. */
export interface ReportHighlight {
    player_id: number;
    player_name: string;
    metric: MetricKey;
    value: number;
    reason: string;
}

export interface ReportMeta {
    language: ReportParams['language'];
    audience: ReportParams['audience'];
    model: string;
    prompt_version: string;
    generated_at: string;
    /** True when served from the database instead of a fresh model call. */
    cached: boolean;
}

export type ReportStage = 'cached' | 'generating' | 'retrying';

/** Identifies a stored report; every field changes the model output, so a hit is always equivalent. */
export interface ReportCacheKey {
    kind: ReportKind;
    subjectId: number;
    language: string;
    audience: string;
    promptVersion: string;
    model: string;
    /** Fingerprint of the data the report describes (see hashContext). */
    contextHash: string;
}

/** What a report service hands to the model layer: prompts, expected shape and the data check. */
export interface ModelRequest<T> {
    system: string;
    user: string;
    temperature: number;
    maxTokens: number;
    schema: ZodSchema<T>;
    /** Returns the reasons the parsed answer contradicts the data; empty means it is safe to deliver. */
    validate: (parsed: T) => string[];
    logContext: Record<string, unknown>;
}

/** Optional hooks so the SSE endpoint can narrate progress; the plain JSON endpoint passes none. */
export interface ReportProgress {
    onStage?: (stage: ReportStage) => void;
    onSummary?: (partialSummary: string) => void;
    signal?: AbortSignal;
}

export interface SessionReport {
    session: SessionSummary;
    summary: string;
    highlights: ReportHighlight[];
    alerts: ThresholdAlert[];
    meta: ReportMeta;
}
