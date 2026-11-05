# Changelog

Frontend releases, by the `version` in `package.json`.

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
