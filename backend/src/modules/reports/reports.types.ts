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

export interface TeamAggregates {
    players_count: number;
    players_with_full_minutes: number;
    avg_total_distance_m: number;
    total_sprints: number;
    avg_rpe: number | null;
    players_without_rpe: number[];
    players_with_reduced_minutes: { player_id: number; minutes_played: number }[];
}

/** Everything the model receives. Built in code so every number it can quote already exists here. */
export interface ReportContext {
    session: SessionSummary;
    team: TeamAggregates;
    thresholds: Record<string, { warning: number; critical: number | null }>;
    alerts: ThresholdAlert[];
    leaders: Partial<Record<MetricKey, MetricLeader[]>>;
    players: PlayerMetricsRow[];
}

export interface ReportHighlight {
    player_id: number;
    player_name: string;
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
