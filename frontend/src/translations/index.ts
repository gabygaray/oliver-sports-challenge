import { ReportLanguage } from '../models';
import { EN_TRANSLATION } from './en';
import { ES_TRANSLATION } from './es';
import { ITranslation } from './translation.types';

export * from './translation.types';

export const TRANSLATIONS: Record<ReportLanguage, ITranslation> = {
  [ReportLanguage.Es]: ES_TRANSLATION,
  [ReportLanguage.En]: EN_TRANSLATION,
};

export const DEFAULT_LANGUAGE = ReportLanguage.Es;
