import { ReportParams } from '../../reports/reports.schemas';
import { EvolutionContext } from '../players.types';
import { addressingRule, FIGURES_RULE, LANGUAGE_INSTRUCTIONS, metricNamesRule, NO_PREAMBLE_RULE } from '../../reports/prompts/shared.prompt';

/** Bump on any wording change and record it in the CHANGELOG.md beside this file; the snapshot test enforces it. */
export const PLAYER_EVOLUTION_PROMPT_VERSION = '1.4.0';

export const PLAYER_EVOLUTION_TEMPERATURE = 0.3;

/** Four sentences plus four short observations; the same bound as the session report. */
export const PLAYER_EVOLUTION_MAX_TOKENS = 800;

const AUDIENCE_INSTRUCTIONS: Record<ReportParams['audience'], string> = {
    coach: 'Audience: the coaching staff. Refer to the player in the third person, be technical and concise, focus on load progression and what to watch next.',
    player: 'Audience: the player. Address them directly, keep it plain and constructive, no comparisons with teammates.',
};

export const buildEvolutionSystemPrompt = (params: ReportParams): string => {
    const { language, audience } = params;
    return `You write short reports on how one football player's physical output evolved across recent sessions, from wearable data.

Data fields:
- "player": name and position.
- "sessions": one entry per session in chronological order, with the raw metrics, a "reduced_minutes" flag and its "critical_alerts" (already computed; warnings are not listed, only counted).
- "trends": per metric, the value and date of the first and last comparable sessions ("first" / "first_session_date", "last" / "last_session_date"), "change_pct" and "direction" ("up", "down" or "flat"), already computed.
- "sessions_without_rpe": dates of the sessions where RPE and workload were not recorded.
- "alerts_summary": how many threshold alerts of each level ("warning" or "critical") across all sessions, how many sessions had alerts and which metrics. The only source for those counts.

Rules:
1. ${FIGURES_RULE} The only percentages you may quote are the "change_pct" values in "trends" (a null change cannot be stated); never derive any other figure, such as averages, totals or differences.
2. Describe each trend with the "direction" given, never by reading the sign of a number, and date it only with its "first_session_date" and "last_session_date".
3. ${metricNamesRule(language)}
4. Sessions with "reduced_minutes" true are not comparable on totals: mention the reduced minutes instead of reading them as a drop in output.
5. Sessions in "sessions_without_rpe" have no RPE and no workload: say the data is missing, do not guess.
6. The alerts reach the reader in a table, so do not enumerate them. Mention only the "critical_alerts", with session date and value; describe the warnings with the counts and metrics given in "alerts_summary" (never count anything yourself) without attributing them to a session. If "alerts_summary" has no alerts, say so in one sentence. Do not add alerts of your own. Write alert levels in plain words ("warning"/"critical" become "advertencia"/"crítico" in Spanish) and dates as a reader would say them (e.g. "19 de septiembre" / "September 19"), never as 2026-09-19.
7. ${LANGUAGE_INSTRUCTIONS[language]} ${NO_PREAMBLE_RULE}
8. ${AUDIENCE_INSTRUCTIONS[audience]}${addressingRule(params)}

Respond with a single JSON object and nothing else:
{
  "summary": "3 to 4 sentences on the overall progression across the sessions, in chronological order.",
  "observations": ["2 to 4 short bullet points, each backed by figures from the data"]
}`;
};

export const buildEvolutionUserPrompt = (context: EvolutionContext): string => `Player data (JSON):\n${JSON.stringify(context)}`;
