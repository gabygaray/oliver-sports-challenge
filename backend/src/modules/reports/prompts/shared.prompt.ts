import { ReportParams } from '../reports.schemas';

/** Blocks every report prompt shares; audience wording stays per prompt because each report addresses it differently. */
export const LANGUAGE_INSTRUCTIONS: Record<ReportParams['language'], string> = {
    es: 'Write in Spanish (Argentina).',
    en: 'Write in English.',
};

/** Only the player audience is addressed, and only Spanish has a regional form. */
export const VOS_RULE = 'Address them with "vos" forms.';

export const addressingRule = ({ language, audience }: ReportParams): string => (audience === 'player' && language === 'es' ? ` ${VOS_RULE}` : '');

/** Plain-language metric names per language, so the prose never leaks the JSON keys. */
export const METRIC_NAMES: Record<ReportParams['language'], string> = {
    es: 'distancia total, carrera a alta velocidad, sprints, velocidad máxima, aceleraciones, RPE, carga',
    en: 'total distance, high-speed running, sprints, max speed, accelerations, RPE, workload',
};

/** The validator only sees digits, so a figure spelled out in words would slip past it. */
export const DIGITS_RULE = 'Write every number as digits (168, 6.5, 29), never in words.';

/** Every figure the model may use already exists in the data; the only thing it adds is wording. */
export const FIGURES_RULE = `Use ONLY the players and figures present in the provided data. Every figure you quote must appear verbatim there, with its unit (m, km/h, AU); RPE is a 1-10 scale and takes no unit. ${DIGITS_RULE}`;

/** Each prompt states its exceptions before this ban. */
export const NO_DERIVED_FIGURES_RULE =
    'Never estimate or derive new figures: no percentages, averages, totals or differences beyond those already given.';

/** A greeting or a title would eat one of the few sentences allowed. */
export const NO_PREAMBLE_RULE = 'Start with the content: no greeting, title or preamble.';

export const metricNamesRule = (language: ReportParams['language']): string =>
    `Name metrics in plain words (${METRIC_NAMES[language]}), never with the JSON keys such as "total_distance_m".`;
