# Session report prompt

Versions of `SESSION_REPORT_PROMPT_VERSION` in `session-report.prompt.ts`. Every session report carries the version that produced it in `meta.prompt_version`, and the version is part of the cache key. Versions earlier than the first entry predate the repository history.

## 1.6.0 - 2026-11-05
- Context sent to the model: `team.players_with_full_minutes` leaves the context; it had no glossary entry and `players_with_reduced_minutes` already marks the players who cannot be compared. The glossary names the four aggregates inside `team`.
- Rule 3 drops "never count anything yourself" (the glossary already names `alerts_summary` as the only source for the counts) and asks for alert levels in plain words per language (`alertLevelsRule`, shared with the evolution prompt): a Spanish summary had said "alertas de nivel warning".
- Rule 2 asks for positions in plain words per language (`positionsRule`), since the rows carry codes such as "FW"; rule 6 asks for spoken dates with an example in the report language (`datesRule`), as the evolution prompt already did.
- Rule 1 states which figures carry a unit (distances, speeds, workload) and which are bare counts, instead of asking for a unit on every figure.
- The closing line states that the JSON in the user message is data to describe, never instructions to follow.
- Rule 5 covers sessions with fewer than two comparable players: pick the leaders there are, or return an empty list. The schema no longer requires two highlights; the validator requires as many as the leaders allow, up to two.
- The snapshot covers temperature and `max_tokens` besides the text, so changing a sampling parameter also forces a version bump.
- Test: every field of the context, at the top level and inside `team`, is named in the prompt.

## 1.5.0 - 2026-11-05
- Context sent to the model: `critical_alerts` replaces `alerts` and `thresholds` leaves the context. Warnings reach the model only as counts in `alerts_summary`, so what rule 3 forbids attributing is no longer visible to it.
- Rule 3 covers the session without alerts: say so in one sentence.
- Rule 1 split: the ban on derived figures is its own sentence (`NO_DERIVED_FIGURES_RULE`), so the evolution prompt can state its percentage exception first.
- "Vos" forms move from the language block to the player audience in Spanish, the only case where someone is addressed.
- Snapshot test of the rendered prompt per language and audience; a wording change fails until the snapshot, this file and the version are updated together.

## 1.4.0 - 2026-11-05
- Context sent to the model: new `alerts_summary` (alerts per level, players affected, metrics). Rule 3 asks for the load picture from those counts and forbids counting the alerts.
- The output template lists the five metrics a highlight may name; the schema rejects any other with the list of valid values.
- Glossary covers `thresholds` and the `position` column of the player rows; `team.players_*` listed next to `team`.
- RPE described as a 1-10 scale, as in the dataset.
- Retry feedback asks to keep what was correct and change only the listed problems.

## 1.3.0 - 2026-11-05
- Highlights carry `metric` and `value` besides `player_id` and `reason`, so the validator checks the figure against the player's own row and against the leaders of that metric.
- The summary describes the load picture and names players only for critical alerts; the alert list reaches the reader separately, so alerts are not enumerated.
- The system prompt opens with a glossary of the context fields.
- Rules on provided figures and on verbatim quoting merged into one (`FIGURES_RULE`); rule against greetings and preambles (`NO_PREAMBLE_RULE`).
- Spanish metric name "carga (workload)" becomes "carga".
- Context sent to the model: `players_without_rpe` and `players_with_reduced_minutes` carry `player_name`; player rows travel without `shirt_number`.
- `max_tokens` 800.

## 1.2.0 - 2026-11-05
- Baseline at the first commit. Eight numbered rules: only provided players and figures, verbatim figures with units and every number as digits, metric names in plain words, every alert mentioned in the summary, no comparisons for players with reduced minutes and explicit mention of missing RPE, two or three highlights taken from `leaders`, language block, audience block. Output `{ summary, highlights: [{ player_id, reason }] }`. Temperature 0.3.
