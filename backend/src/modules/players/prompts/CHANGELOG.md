# Player evolution prompt

Versions of `PLAYER_EVOLUTION_PROMPT_VERSION` in `player-evolution.prompt.ts`. Every evolution report carries the version that produced it in `meta.prompt_version`, and the version is part of the cache key. Versions earlier than the first entry predate the repository history.

## 1.4.0 - 2026-11-05
- Context sent to the model: each session carries `critical_alerts` instead of `alerts`, and `thresholds` leaves the context. Warnings reach the model only as counts in `alerts_summary`.
- Rule 1 states the `change_pct` exception before the ban on derived figures, instead of after a sentence that forbade percentages.
- Rule 6 covers the player without alerts: say so in one sentence.
- "Vos" forms apply only to the player audience in Spanish.
- Snapshot test of the rendered prompt per language and audience.

## 1.3.0 - 2026-11-05
- Each trend carries `first_session_date` and `last_session_date`; rule 2 asks to date a trend only with them, since the comparable sessions are not always the first and the last.
- `sessions_without_rpe` carries dates instead of session ids.
- Context sent to the model: new `alerts_summary` (alerts per level, sessions affected, metrics). Rule 6 asks to summarise the warnings from those counts and forbids counting the alerts.
- RPE described as a 1-10 scale; retry feedback asks to keep what was correct.

## 1.2.0 - 2026-11-05
- Each trend carries a `direction` (`up`, `down`, `flat`) and the prompt asks to describe trends with that word, never from the sign of a number.
- Only critical alerts are mentioned, with session date and value; warnings are summarised instead of enumerated.
- Glossary of the context fields, shared `FIGURES_RULE` and `NO_PREAMBLE_RULE`.
- Context sent to the model: the player travels without `shirt_number`.
- `max_tokens` 800.

## 1.1.0 - 2026-11-05
- Baseline at the first commit. Eight numbered rules: only provided figures with percentages taken exclusively from `trends.change_pct`, verbatim figures with units and every number as digits, metric names in plain words, reduced-minutes sessions not read as a drop, missing RPE stated, every alert mentioned with date and level in plain words, language block, audience block. Output `{ summary, observations[2..4] }`. Temperature 0.3.
