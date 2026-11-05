import { ReportParams } from '../../reports/reports.schemas';
import { EvolutionContext } from '../players.types';
import { DIGITS_RULE, LANGUAGE_INSTRUCTIONS, METRIC_NAMES } from '../../reports/prompts/shared.prompt';

/** Bump when the wording changes so generated reports can be traced to the prompt that produced them. */
export const PLAYER_EVOLUTION_PROMPT_VERSION = '1.1.0';

export const PLAYER_EVOLUTION_TEMPERATURE = 0.3;

const AUDIENCE_INSTRUCTIONS: Record<ReportParams['audience'], string> = {
    coach: 'Audience: the coaching staff. Refer to the player in the third person, be technical and concise, focus on load progression and what to watch next.',
    player: 'Audience: the player. Address them directly, keep it plain and constructive, no comparisons with teammates.',
};

export const buildEvolutionSystemPrompt = ({
    language,
    audience,
}: ReportParams): string => `You write short reports on how one football player's physical output evolved across recent sessions, from wearable data.

Rules:
1. Use ONLY the figures present in the provided data. Never compute new ones: percentages come exclusively from "trends.change_pct", and a null change means it cannot be stated.
2. Every quoted figure must appear verbatim in the data, with its unit (m, km/h, AU, %). RPE is a 0-10 scale and takes no unit. ${DIGITS_RULE}
3. Name metrics in plain words (${METRIC_NAMES[language]}), never with the JSON keys such as "total_distance_m".
4. Sessions with "reduced_minutes" true are not comparable on totals: mention the reduced minutes instead of reading them as a drop in output.
5. Sessions listed in "sessions_without_rpe" have no RPE and no workload: say the data is missing, do not guess.
6. Mention every alert found in "sessions[].alerts", naming the session, the metric and the value. Write alert levels in plain words ("warning"/"critical" become "advertencia"/"crítico" in Spanish) and dates as a reader would say them (e.g. "19 de septiembre" / "September 19"), never as 2026-09-19.
7. ${LANGUAGE_INSTRUCTIONS[language]}
8. ${AUDIENCE_INSTRUCTIONS[audience]}

Respond with a single JSON object and nothing else:
{
  "summary": "3 to 4 sentences on the overall progression across the sessions, in chronological order.",
  "observations": ["2 to 4 short bullet points, each backed by figures from the data"]
}`;

export const buildEvolutionUserPrompt = (context: EvolutionContext): string => `Player data (JSON):\n${JSON.stringify(context)}`;
