# Changelog

Backend releases, by the `version` in `package.json`. Prompt wording is versioned on its own: the detail of each prompt version lives in `src/modules/reports/prompts/CHANGELOG.md` (session report) and `src/modules/players/prompts/CHANGELOG.md` (player evolution).

## 0.3.0 - 2026-11-05

### Added
- `stream_options.include_usage` on streamed completions, so the usage (reasoning tokens included) is logged on the SSE path too.
- Rejected model answers are logged in full at debug level, next to the warn line with the violations.
- Tests: every context field is named in its prompt; prompt snapshots cover temperature and `max_tokens`.

### Changed
- Context sent to the model: `team.players_with_full_minutes` (session) and `comparable_sessions` (evolution) leave the context.
- `trends` in `POST /players/:id/evolution-report` covers the five output metrics; RPE and workload are no longer trended. Each trend carries `basis` (`per_90_min` for totals, `absolute` for max speed), with `first`/`last` projected to 90 minutes where it applies, plus `reference_minutes`, `first_session_type`, `last_session_type`, `first_minutes` and `last_minutes`.
- `TrendBasis` enum.
- `highlights` in the session report may hold fewer than two items when fewer than two players are comparable, down to an empty list.
- Session report prompt 1.6.0 and player evolution prompt 1.5.0: see the prompt changelogs.

### Fixed
- A stream the provider cuts with an error body (Gemini answers 200, streams part of the text and ends with a 503 body instead of `[DONE]`) is now an `AiProviderError` retried with backoff, instead of being parsed as the model's broken JSON and fed back as a violation. The transient retry covers the whole stream read, and the stream consumer receives the text so far, so a retried stream starts the partial summary over.
- A malformed JSON body answers 400 `VALIDATION_ERROR` instead of 500.
- A non-numeric id or `player_id` reads "must be a number" instead of "received nan".

## 0.2.0 - 2026-11-05

### Added
- `metric` and `value` on each item of `highlights` in `POST /sessions/:id/report` and its SSE variant.
- `direction` (`up`, `down`, `flat`, or null) on each item of `trends` in `POST /players/:id/evolution-report`.
- `TrendDirection` enum.
- Retry turn in the AI client: a rejected answer is replayed as an assistant message and the validator's findings as the next user message.
- `max_tokens` on every model call and token usage logged per call.
- `first_session_date` and `last_session_date` on each item of `trends` in `POST /players/:id/evolution-report`: the two comparable sessions the change spans.
- `alerts_summary` in the context sent to the model (alerts per level, players or sessions affected, metrics), so the model never counts alerts.
- JSON-keys check in the validator: a metric key such as `workload_au` or any snake_case key of the context such as `change_pct` written in the prose is rejected like a foreign figure (seen in an English summary, "across workload_au, total_distance_m", and in a Spanish observation, "(change_pct: 0)").
- Names-in-context check in the validator: a run of capitalised words that matches no name in the data is rejected like a foreign figure.
- Truncated completions (`finish_reason: length`) are detected in both the JSON and the streaming paths and fed back to the model as "too long" instead of "invalid JSON".
- Tests: highlight attribution, highlights outside the leaders, trend direction, retry turns of the client, player and rows sent without shirt number, foreign names, alert summaries, truncated output, metric restricted by the schema, rendered prompts (snapshot per language and audience), critical-only alerts in both model contexts.

### Changed
- Report validator: a highlight must name a leader of its metric and quote that player's own value; the figures-in-context check keeps covering the prose.
- Context sent to the model: `players_without_rpe` and `players_with_reduced_minutes` carry `player_name`; player rows and the evolution player travel without `shirt_number`.
- Retry feedback for a malformed completion says the answer was not valid JSON instead of echoing the schema error.
- Zod schemas bound `summary` to 1200 characters and each highlight reason or observation to 300; `highlights[].metric` accepts only the five metrics that can justify a highlight.
- `sessions_without_rpe` in the evolution context carries session dates instead of ids.
- Server-side `HttpError`s (5xx) are logged with code and details in the error mapper, so a model failure on the SSE channel, which answers 200, leaves a trace.
- `usage.reasoning_tokens` read from `completion_tokens_details` and logged per call.
- `AI_REASONING_TOKENS_ALLOWANCE` (default 1500): with reasoning on (`AI_REASONING_EFFORT` set and not `none`) the client adds it to `max_tokens`, since Gemini counts reasoning tokens against it and thinking could cut the JSON short.
- A truncated answer with under 50 characters of text is fed back as an exhausted limit (reply with the JSON directly) instead of as a too-long answer.
- Tests live in `src/test/`, mirroring the rest of `src/`, with the fixtures in `src/test/fixtures/`; prompt snapshots sit next to their test as `.snap` files.
- Tests: `requestValidatedJson` (exhausted vs too-long feedback, 502 after the retry), reasoning allowance and reasoning tokens in the client.
- Context sent to the model, both reports: only the critical alerts travel by name (`critical_alerts`); warnings are counted in `alerts_summary` and the thresholds no longer travel. The API responses keep the full alert list, recomputed in code on every request, cached reports included.
- Session report prompt 1.5.0 and player evolution prompt 1.4.0: see the prompt changelogs.
- Request logging: one line per request (`GET /sessions 200 12 ms`); the request and response details are logged only for 4xx (warn) and 5xx (error) answers.

## 0.1.0 - 2026-11-05

### Added
- Express 5 API with TypeORM and PostgreSQL 16: `GET /sessions`, `GET /sessions/:id/metrics` (filter by player, order by metric with nulls last), `POST /sessions/:id/report`, `GET /sessions/:id/report/stream` (SSE), `GET /players`, `POST /players/:id/evolution-report`.
- Relational schema (`teams`, `players`, `sessions`, `player_sessions`, `metric_thresholds`, `ai_reports`) as hand-written SQL migrations and an idempotent seed of `session_data.json`.
- AI layer for any OpenAI-compatible chat completions API (Gemini by default): JSON mode, streaming, one deadline per exchange, cancellation, typed provider errors, backoff on 5xx, no retry on 429.
- Report pipeline: context computed in code (alerts, leaders, aggregates, trends), versioned prompts, Zod schema, figures-in-context validator, one corrective retry, cache in `ai_reports` keyed by kind, subject, language, audience, prompt version, model and context hash.
- Session report prompt 1.2.0 and player evolution prompt 1.1.0.
- Vitest suites for alerts, leaders, aggregates, validator, context hash, partial summary and the provider client.
