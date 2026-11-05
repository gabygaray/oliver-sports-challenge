import { useState } from 'react';

import { AnalysisTab, IUseAnalysisTabs } from '../utilities';

/** Which analysis is on screen; both panels stay mounted so a report in progress survives a switch. */
export const useAnalysisTabs = (): IUseAnalysisTabs => {
  const [tab, setTab] = useState<AnalysisTab>(AnalysisTab.Report);
  return { tab, selectTab: setTab };
};
