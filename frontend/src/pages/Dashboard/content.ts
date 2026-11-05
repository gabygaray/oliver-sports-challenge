import { AlertLevel, ReportAudience, ReportLanguage, SessionType } from '../../models';

export const DASHBOARD_CONTENT = {
  appName: 'Reporte de sesión',
  sessionSelectorLabel: 'Sesión',
  loadingSessions: 'Cargando sesiones…',
  emptySessions: 'Todavía no hay sesiones cargadas.',
  retry: 'Reintentar',
  hero: {
    durationSuffix: 'minutos',
    facts: {
      critical: ['alerta crítica', 'alertas críticas'],
      warning: ['advertencia', 'advertencias'],
      reducedMinutes: [
        'jugador con minutos reducidos',
        'jugadores con minutos reducidos',
      ],
      withoutRpe: ['jugador sin RPE', 'jugadores sin RPE'],
    },
    noFacts: 'Sin alertas ni datos faltantes en esta sesión.',
  },
  metrics: {
    title: 'Métricas por jugador',
    description:
      'Hacé click en una métrica para ordenar por ella. Los valores pintados superan un umbral del equipo.',
    loading: 'Cargando métricas…',
    empty: 'La sesión no tiene métricas cargadas.',
    playerColumn: 'Jugador',
    positionColumn: 'Posición',
    shirtColumn: '#',
    legendTitle: 'Umbrales del equipo',
  },
  chart: {
    title: 'Comparativa por jugador',
    metricSelectorLabel: 'Métrica',
    playerAxis: 'Jugador',
    warningLine: 'Advertencia',
    criticalLine: 'Crítico',
  },
  report: {
    title: 'Reporte con IA',
    languageLabel: 'Idioma',
    audienceLabel: 'Audiencia',
    generate: 'Generar reporte',
    regenerate: 'Regenerar',
    loading: 'Generando el reporte… puede tardar unos segundos.',
    empty: 'Elegí idioma y audiencia, y generá el reporte de la sesión.',
    summaryTitle: 'Resumen',
    highlightsTitle: 'Jugadores destacados',
    alertsTitle: 'Alertas por umbral',
    noAlerts: 'Ningún jugador superó los umbrales del equipo.',
    metaTemplate: (model: string, promptVersion: string, generatedAt: string) =>
      `Generado por ${model} con el prompt v${promptVersion}, ${generatedAt}.`,
    cachedChip: 'Desde caché',
    stages: {
      cached: 'Recuperando el reporte guardado…',
      generating: 'El modelo está escribiendo el reporte…',
      retrying: 'La primera respuesta no pasó la validación, pidiendo una corrección…',
    },
  },
  evolution: {
    title: 'Evolución del jugador',
    playerLabel: 'Jugador',
    generate: 'Generar evolución',
    loading: 'Analizando las sesiones del jugador…',
    empty:
      'Elegí un jugador y generá su reporte de evolución a lo largo de las sesiones.',
    loadingPlayers: 'Cargando jugadores…',
    summaryTitle: 'Resumen',
    observationsTitle: 'Observaciones',
    trendsTitle: 'Variación entre la primera y la última sesión comparable',
    sessionsTitle: 'Sesiones',
    sessionColumn: 'Sesión',
    reducedMinutes: 'minutos reducidos',
    noTrend: 'sin dato',
  },
} as const;

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  [SessionType.Training]: 'Entrenamiento',
  [SessionType.Match]: 'Partido',
};

export const REPORT_LANGUAGE_LABELS: Record<ReportLanguage, string> = {
  [ReportLanguage.Es]: 'Español',
  [ReportLanguage.En]: 'Inglés',
};

export const REPORT_AUDIENCE_LABELS: Record<ReportAudience, string> = {
  [ReportAudience.Coach]: 'Cuerpo técnico',
  [ReportAudience.Player]: 'Jugadores',
};

export const ALERT_LINE_LABELS: Record<AlertLevel, string> = {
  [AlertLevel.Warning]: DASHBOARD_CONTENT.chart.warningLine,
  [AlertLevel.Critical]: DASHBOARD_CONTENT.chart.criticalLine,
};
