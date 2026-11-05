import { createContext, useEffect, useMemo, useState } from 'react';

import { ReportLanguage } from '../../models';
import { DEFAULT_LANGUAGE, TRANSLATIONS } from '../../translations';
import { LANGUAGE_STORAGE_KEY } from './language.constants';
import { ILanguageContext, ILanguageProps } from './language.types';

export const LanguageContext = createContext<ILanguageContext | null>(null);

const isLanguage = (value: unknown): value is ReportLanguage =>
  Object.values(ReportLanguage).includes(value as ReportLanguage);

/** Storage can be unavailable (private windows, blocked site data); the default language covers it. */
const readStoredLanguage = (): ReportLanguage => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

const storeLanguage = (language: ReportLanguage): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Remembering the choice is a convenience, not a requirement.
  }
};

/** Holds the language of the whole app; the reports are requested in the same one. */
export const Language = ({ children }: ILanguageProps) => {
  const [language, setLanguage] = useState<ReportLanguage>(readStoredLanguage);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    storeLanguage(language);
    document.documentElement.lang = language;
    document.title = t.appName;
  }, [language, t.appName]);

  const value = useMemo<ILanguageContext>(
    () => ({ language, setLanguage, t, locale: t.locale }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
