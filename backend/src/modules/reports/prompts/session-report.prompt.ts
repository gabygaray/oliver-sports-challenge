import { ReportParams } from '../reports.schemas';
import { LEADER_METRICS } from '../reports.constants';
import { ReportContext } from '../reports.types';
import { addressingRule, FIGURES_RULE, LANGUAGE_INSTRUCTIONS, metricNamesRule, NO_DERIVED_FIGURES_RULE, NO_PREAMBLE_RULE } from './shared.prompt';

/** Bump on any wording change and record it in the CHANGELOG.md beside this file; the snapshot test enforces it. */
export const SESSION_REPORT_PROMPT_VERSION = '1.5.0';

export const SESSION_REPORT_TEMPERATURE = 0.3;

/** Five sentences plus three one-line highlights fit comfortably; anything longer is the model ignoring the format. */
export const SESSION_REPORT_MAX_TOKENS = 800;

const AUDIENCE_INSTRUCTIONS: Record<ReportParams['audience'], string> = {
    coach: 'Audience: the coaching staff. Refer to players in the third person, be technical and concise, focus on load management and who needs attention.',
    player: 'Audience: the players themselves. Use plain language, address the group directly, be constructive: highlights are recognition, not a ranking.',
};

export const buildSystemPrompt = (params: ReportParams): string => {
    const { language, audience } = params;
    return `You write short post-session physical performance reports for a football team from wearable data.

Data fields:
- "session": date, title, type and duration in minutes.
- "team": aggregates over the whole squad (counts, averages, totals), already computed.
- "team.players_with_reduced_minutes" and "team.players_without_rpe": players the rules below treat specially.
- "alerts_summary": how many threshold alerts of each level ("warning" or "critical"), how many players are affected and which metrics. The only source for those counts.
- "critical_alerts": the breaches of a critical limit, with the player, the value and the "limit" exceeded. Warning-level alerts are not listed, only counted.
- "leaders": top players per metric among those with comparable minutes. The only source for highlights.
- "players": one row per player with the raw metrics and position; a null value was not recorded.

Rules:
1. ${FIGURES_RULE} ${NO_DERIVED_FIGURES_RULE}
2. Refer to players by their exact "player_name". ${metricNamesRule(language)}
3. The alerts reach the reader as a separate list, so do not enumerate them. In the summary describe the load picture with the counts and metrics given in "alerts_summary" (never count anything yourself) and name players only for "critical_alerts", with the value. Never attribute a warning to a player. If "alerts_summary" has no alerts, say so in one sentence. Do not add alerts of your own.
4. Players in "players_with_reduced_minutes" played less than the rest: never compare their totals with the others. Players in "players_without_rpe" did not report RPE, so their workload is unknown: say so instead of guessing.
5. Pick 2 or 3 highlights from "leaders" only. For each one copy the "player_id", the metric key and the exact "value" from that leader entry, and justify it in one sentence.
6. ${LANGUAGE_INSTRUCTIONS[language]} ${NO_PREAMBLE_RULE}
7. ${AUDIENCE_INSTRUCTIONS[audience]}${addressingRule(params)}

Respond with a single JSON object and nothing else:
{
  "summary": "3 to 5 sentences: overall team load for this session, notable patterns, and the alert picture.",
  "highlights": [{ "player_id": number, "metric": "one of: ${LEADER_METRICS.join(', ')}", "value": number, "reason": "one sentence with the figures that justify it" }]
}`;
};

export const buildUserPrompt = (context: ReportContext): string => `Session data (JSON):\n${JSON.stringify(context)}`;
