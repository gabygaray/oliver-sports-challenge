import {
  AlertLevel,
  MetricKey,
  ReportAudience,
  ReportLanguage,
  SessionType,
} from '../models';
import { ITranslation } from './translation.types';

export const ES_TRANSLATION: ITranslation = {
  locale: 'es-AR',
  appName: 'Reporte de sesión',
  languageNames: { [ReportLanguage.Es]: 'Español', [ReportLanguage.En]: 'English' },
  languageLabels: { [ReportLanguage.Es]: 'español', [ReportLanguage.En]: 'inglés' },
  languageToggleLabel: 'Idioma de la aplicación y de los reportes',
  sessionTypes: {
    [SessionType.Training]: 'Entrenamiento',
    [SessionType.Match]: 'Partido',
  },
  audiences: {
    [ReportAudience.Coach]: 'Cuerpo técnico',
    [ReportAudience.Player]: 'Jugadores',
  },
  alertLevels: {
    [AlertLevel.Warning]: 'Advertencia',
    [AlertLevel.Critical]: 'Crítico',
  },
  metricLabels: {
    [MetricKey.MinutesPlayed]: 'Minutos',
    [MetricKey.TotalDistanceM]: 'Distancia total',
    [MetricKey.HighSpeedRunningM]: 'Alta velocidad',
    [MetricKey.Sprints]: 'Sprints',
    [MetricKey.MaxSpeedKmh]: 'Vel. máxima',
    [MetricKey.Accelerations]: 'Aceleraciones',
    [MetricKey.Rpe]: 'RPE',
    [MetricKey.WorkloadAu]: 'Carga',
  },
  metricDescriptions: {
    [MetricKey.Rpe]:
      'RPE (Rating of Perceived Exertion): esfuerzo percibido que reporta el jugador, en una escala de 1 a 10. Puede faltar si no lo reportó.',
    [MetricKey.WorkloadAu]:
      'Carga de trabajo = RPE × minutos jugados, en unidades arbitrarias (AU). Falta cuando falta el RPE.',
  },
  apiErrors: {
    FETCH_ERROR: 'No se pudo conectar con el servidor. Revisá que la API esté corriendo.',
    NOT_FOUND: 'No encontramos la sesión seleccionada.',
    VALIDATION_ERROR: 'La consulta enviada no es válida.',
    SESSION_WITHOUT_METRICS:
      'La sesión no tiene métricas cargadas para generar un reporte.',
    PLAYER_WITHOUT_SESSIONS: 'El jugador no tiene sesiones registradas.',
    STREAM_ERROR:
      'Se perdió la conexión con el servidor mientras se generaba el reporte.',
    AI_NOT_CONFIGURED: 'El servicio de IA no está configurado en el servidor.',
    AI_TIMEOUT: 'El modelo tardó demasiado en responder. Probá de nuevo.',
    AI_RATE_LIMITED:
      'Se alcanzó el límite de uso del modelo. Esperá unos segundos y reintentá.',
    AI_INVALID_RESPONSE:
      'El modelo no pudo generar un reporte consistente con los datos. Reintentá.',
    AI_PROVIDER_ERROR: 'El proveedor de IA no está disponible en este momento.',
    UNKNOWN: 'Ocurrió un error inesperado. Probá de nuevo.',
  },
  dashboard: {
    sessionSelectorLabel: 'Sesión',
    loadingSessions: 'Cargando sesiones…',
    emptySessions: 'Todavía no hay sesiones cargadas.',
    retry: 'Reintentar',
    hero: {
      subtitle: (sessionType, date, minutes) =>
        `${sessionType} del ${date}, ${minutes} minutos`,
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
      lineLabels: {
        [AlertLevel.Warning]: 'Advertencia',
        [AlertLevel.Critical]: 'Crítico',
      },
    },
    analysis: {
      tabsLabel: 'Análisis con IA',
    },
    report: {
      title: 'Reporte con IA',
      audienceLabel: 'Audiencia',
      generate: 'Generar reporte',
      regenerate: 'Regenerar',
      regenerateIn: languageLabel => `Regenerar en ${languageLabel}`,
      loading: 'Generando el reporte… puede tardar unos segundos.',
      empty: 'Elegí la audiencia y generá el reporte de la sesión.',
      summaryTitle: 'Resumen',
      highlightsTitle: 'Jugadores destacados',
      highlightsEmpty: 'Sin jugadores comparables para destacar en esta sesión.',
      alertsTitle: 'Alertas por umbral',
      alertGroups: {
        [AlertLevel.Critical]: 'Críticas',
        [AlertLevel.Warning]: 'Advertencias',
      },
      noAlerts: 'Ningún jugador superó los umbrales del equipo.',
      metaTemplate: (model, promptVersion, generatedAt) =>
        `Generado por ${model} con el prompt v${promptVersion}, ${generatedAt}`,
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
      per90: 'por 90 min',
      sessionsTitle: 'Sesiones',
      sessionColumn: 'Sesión',
      reducedMinutes: 'minutos reducidos',
      noTrend: 'sin dato',
    },
  },
};
