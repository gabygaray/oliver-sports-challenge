import { ReactNode } from 'react';

import { ReportLanguage } from '../../models';
import { ITranslation } from '../../translations';

export interface ILanguageContext {
  language: ReportLanguage;
  setLanguage: (language: ReportLanguage) => void;
  /** Every text of the UI in the active language. */
  t: ITranslation;
  /** Locale for number and date formatting, from the active translation. */
  locale: string;
}

export interface ILanguageProps {
  children: ReactNode;
}
