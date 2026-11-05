import { useState } from 'react';

import { ReportAudience, ReportLanguage } from '../../../models';
import { IUseReportOptions } from '../utilities';

/** Language and audience shared by every AI report form. */
export const useReportOptions = (): IUseReportOptions => {
  const [language, setLanguage] = useState<ReportLanguage>(ReportLanguage.Es);
  const [audience, setAudience] = useState<ReportAudience>(ReportAudience.Coach);
  return { language, audience, setLanguage, setAudience };
};
