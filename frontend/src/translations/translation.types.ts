import {
  AlertLevel,
  MetricKey,
  ReportAudience,
  ReportLanguage,
  SessionType,
} from '../models';

/** A singular and a plural form, picked by `formatCount`. */
export type TCountLabels = [string, string];

export interface ITranslation {
  /** BCP 47 tag for number and date formatting. */
  locale: string;
  appName: string;
  languageNames: Record<ReportLanguage, string>;
  /** Language names as written inside a sentence of this language ("inglés", "Spanish"). */
  languageLabels: Record<ReportLanguage, string>;
  languageToggleLabel: string;
  sessionTypes: Record<SessionType, string>;
  audiences: Record<ReportAudience, string>;
  alertLevels: Record<AlertLevel, string>;
  metricLabels: Record<MetricKey, string>;
  metricDescriptions: Partial<Record<MetricKey, string>>;
  apiErrors: Record<string, string>;
  dashboard: {
    sessionSelectorLabel: string;
    loadingSessions: string;
    emptySessions: string;
    retry: string;
    hero: {
      subtitle: (sessionType: string, date: string, minutes: number) => string;
      facts: {
        critical: TCountLabels;
        warning: TCountLabels;
        reducedMinutes: TCountLabels;
        withoutRpe: TCountLabels;
      };
      noFacts: string;
    };
    metrics: {
      title: string;
      description: string;
      loading: string;
      empty: string;
      playerColumn: string;
      positionColumn: string;
      shirtColumn: string;
      legendTitle: string;
    };
    chart: {
      title: string;
      metricSelectorLabel: string;
      playerAxis: string;
      lineLabels: Record<AlertLevel, string>;
    };
    analysis: {
      tabsLabel: string;
    };
    report: {
      title: string;
      audienceLabel: string;
      generate: string;
      regenerate: string;
      /** Offered when a report on screen was written in another language than the app. */
      regenerateIn: (languageLabel: string) => string;
      loading: string;
      empty: string;
      summaryTitle: string;
      highlightsTitle: string;
      highlightsEmpty: string;
      alertsTitle: string;
      alertGroups: Record<AlertLevel, string>;
      noAlerts: string;
      metaTemplate: (model: string, promptVersion: string, generatedAt: string) => string;
      cachedChip: string;
      stages: {
        cached: string;
        generating: string;
        retrying: string;
      };
    };
    evolution: {
      title: string;
      playerLabel: string;
      generate: string;
      loading: string;
      empty: string;
      loadingPlayers: string;
      summaryTitle: string;
      observationsTitle: string;
      trendsTitle: string;
      per90: string;
      sessionsTitle: string;
      sessionColumn: string;
      reducedMinutes: string;
      noTrend: string;
    };
  };
}
