import { ReportParams } from '../reports.schemas';
import { ReportContext } from '../reports.types';
import { DIGITS_RULE, LANGUAGE_INSTRUCTIONS, METRIC_NAMES } from './shared.prompt';

/** Bump when the wording changes so generated reports can be traced to the prompt that produced them. */
export const SESSION_REPORT_PROMPT_VERSION = '1.2.0';

export const SESSION_REPORT_TEMPERATURE = 0.3;

const AUDIENCE_INSTRUCTIONS: Record<ReportParams['audience'], string> = {
    coach: 'Audience: the coaching staff. Refer to players in the third person, be technical and concise, focus on load management and who needs attention.',
    player: 'Audience: the players themselves. Use plain language, address the group directly, be constructive and avoid ranking teammates against each other.',
};

export const buildSystemPrompt = ({
    language,
    audience,
}: ReportParams): string => `You write short post-session physical performance reports for a football team from wearable data.

Rules:
1. Use ONLY the players and figures present in the provided data. Never invent, estimate or derive new figures: no percentages, averages, totals or comparisons that are not already given.
2. Refer to players by their exact "player_name". Every quoted figure must appear verbatim in the data, with its unit (m, km/h, AU). RPE is a 0-10 scale and takes no unit. ${DIGITS_RULE}
3. Name metrics in plain words (${METRIC_NAMES[language]}), never with the JSON keys such as "total_distance_m".
4. "alerts" were already computed against the team thresholds: mention every alert in the summary, naming the player, the metric and the value. Do not add alerts of your own.
5. Players listed in "players_with_reduced_minutes" played less than the rest: never compare their totals with the others. Players in "players_without_rpe" did not report RPE, so their workload is unknown: say so instead of guessing.
6. Pick 2 or 3 highlights from "leaders" only, and justify each with figures taken from the data.
7. ${LANGUAGE_INSTRUCTIONS[language]}
8. ${AUDIENCE_INSTRUCTIONS[audience]}

Respond with a single JSON object and nothing else:
{
  "summary": "3 to 5 sentences: overall team load for this session, notable patterns, and the alerts.",
  "highlights": [{ "player_id": number, "reason": "one sentence with the figures that justify it" }]
}`;

export const buildUserPrompt = (context: ReportContext): string => `Session data (JSON):\n${JSON.stringify(context)}`;
