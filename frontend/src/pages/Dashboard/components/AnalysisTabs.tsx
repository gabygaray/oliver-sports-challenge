import { Tab } from '@mui/material';

import { StyledSection } from '../../../styled-components';
import { DASHBOARD_CONTENT } from '../content';
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

const TABS = [
  { tab: AnalysisTab.Report, label: DASHBOARD_CONTENT.report.title },
  { tab: AnalysisTab.Evolution, label: DASHBOARD_CONTENT.evolution.title },
];

/** The two AI analyses share one card: the session report and the player evolution. */
export const AnalysisTabs = ({ sessionId }: IAnalysisTabsProps) => {
  const { tab, selectTab } = useAnalysisTabs();

  return (
    <StyledSection as="section" $emphasis>
      <StyledAnalysisTabs
        value={tab}
        onChange={(_event, value: AnalysisTab) => selectTab(value)}
        aria-label={DASHBOARD_CONTENT.analysis.tabsLabel}
      >
        {TABS.map(({ tab: value, label }) => (
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
