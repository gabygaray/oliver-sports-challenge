import { ReportParams } from '../reports.schemas';

/** Blocks every report prompt shares; audience wording stays per prompt because each report addresses it differently. */
export const LANGUAGE_INSTRUCTIONS: Record<ReportParams['language'], string> = {
    es: 'Write in Spanish (Argentina), using "vos" forms when addressing someone.',
    en: 'Write in English.',
};

/** The validator only sees digits, so a figure spelled out in words would slip past it. */
export const DIGITS_RULE = 'Write every number as digits (168, 6.5, 29), never in words.';

/** Plain-language metric names per language, so the prose never leaks the JSON keys. */
export const METRIC_NAMES: Record<ReportParams['language'], string> = {
    es: 'distancia total, carrera a alta velocidad, sprints, velocidad máxima, aceleraciones, RPE, carga (workload)',
    en: 'total distance, high-speed running, sprints, max speed, accelerations, RPE, workload',
};
