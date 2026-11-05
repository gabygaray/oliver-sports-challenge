import { useState } from 'react';

import { useLanguage } from '../../../contexts/language-context';
import { ReportAudience } from '../../../models';
import { IUseReportOptions } from '../utilities';

/** Audience per form; the language is the app's, so the report reads like the screen around it. */
export const useReportOptions = (): IUseReportOptions => {
  const { language } = useLanguage();
  const [audience, setAudience] = useState<ReportAudience>(ReportAudience.Coach);
  return { language, audience, setAudience };
};
