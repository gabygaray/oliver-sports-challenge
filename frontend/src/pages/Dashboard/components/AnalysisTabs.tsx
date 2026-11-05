import { Tab } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { StyledSection } from '../../../styled-components';
import { useAnalysisTabs } from '../hooks';
import { StyledAnalysisTabs } from '../styled-components';
import {
  analysisPanelId,
  analysisTabId,
  AnalysisTab,
  IAnalysisTabsProps,
} from '../utilities';
import { AnalysisTabPanel } from './AnalysisTabPanel';
import { EvolutionPanel } from './EvolutionPanel';
import { ReportPanel } from './ReportPanel';

/** The two AI analyses share one card: the session report and the player evolution. */
export const AnalysisTabs = ({ sessionId }: IAnalysisTabsProps) => {
  const { t } = useLanguage();
  const { tab, selectTab } = useAnalysisTabs();
  const tabs = [
    { tab: AnalysisTab.Report, label: t.dashboard.report.title },
    { tab: AnalysisTab.Evolution, label: t.dashboard.evolution.title },
  ];

  return (
    <StyledSection as="section" $emphasis>
      <StyledAnalysisTabs
        value={tab}
        onChange={(_event, value: AnalysisTab) => selectTab(value)}
        aria-label={t.dashboard.analysis.tabsLabel}
      >
        {tabs.map(({ tab: value, label }) => (
          <Tab
            key={value}
            value={value}
            label={label}
            id={analysisTabId(value)}
            aria-controls={analysisPanelId(value)}
          />
        ))}
      </StyledAnalysisTabs>
      <AnalysisTabPanel tab={AnalysisTab.Report} active={tab}>
        <ReportPanel sessionId={sessionId} />
      </AnalysisTabPanel>
      <AnalysisTabPanel tab={AnalysisTab.Evolution} active={tab}>
        <EvolutionPanel />
      </AnalysisTabPanel>
    </StyledSection>
  );
};
