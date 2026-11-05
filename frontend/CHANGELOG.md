# Changelog

Frontend releases, by the `version` in `package.json`.

## 1.1.0 - 2026-11-05

### Added
- The whole UI is available in Spanish and English: an ES / EN switch in the header changes every text, the number and date formats and MUI's own strings, and the reports are requested in that same language, so the language select left the report forms. The choice is remembered in the browser. A report already on screen keeps its language and offers, next to the generate button, a "Regenerar en inglés" / "Regenerate in Spanish" action that asks for it in the app language (served from the cache when it exists).
- Trend chips name the basis: totals read "(por 90 min)", max speed stays absolute, following `basis` in the evolution API.
- Empty state for highlights when the API returns none (sessions with fewer than two comparable players).

### Changed
- Report result: alerts move to a column on the right, split into critical and warning groups and stacked vertically; below the md breakpoint the column drops under the prose and the chips wrap.
- Loading states of the report and the evolution are skeletons with the layout of the result, and the summary streams inside its own block; the analysis card keeps a minimum height so empty, loading and error states do not resize it.
- Layout: the chart spans the full width and the two AI analyses (session report, player evolution) share one tinted card as tabs below it. Both panels stay mounted, so a report in progress or already generated survives switching tabs.

### Fixed
- Chart Y axis grows to include the threshold lines, so a limit above every bar is drawn inside the chart instead of clipped at the top.
- Alert chips keep "RPE" in capitals instead of lowercasing it like the other metric names.
- Report meta line no longer ends with a double period after the time.

## 1.0.0 - 2026-11-05

### Added
- Single-page dashboard in React 18, Vite, MUI 6 over styled-components and Redux Toolkit Query.
- Header band with session selector and facts computed client-side (critical alerts, warnings, players with reduced minutes, players without RPE).
- Metrics table sortable by column through the API, with a position column and warning and critical values highlighted using the same strict `>` rule as the backend.
- Info icon with the definition of RPE and workload in the metric headers of both tables.
- Threshold legend painting each limit with the color of its level, the same one the table cells use.
- Bar chart per player with metric selector, threshold reference lines, axis titles (player, metric with its unit), full player names tilted on the axis and values with their unit in the tooltip.
- AI session report panel over Server-Sent Events: language and audience options, loading, streaming, error and empty states, cache indicator and regenerate action.
- Player evolution panel: summary, observations, trend chips and a sessions table with highlighted alerts.
- Each section rendered as a card (white surface, border, padding) on the grey page background; the AI report keeps its tinted surface.
- Services, adapters and models layering: adapters are the only place that knows the snake_case API contract.
