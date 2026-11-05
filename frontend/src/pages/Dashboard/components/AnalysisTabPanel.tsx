import { StyledTabPanel } from '../styled-components';
import { analysisPanelId, analysisTabId, IAnalysisTabPanelProps } from '../utilities';

/** Hidden instead of unmounted, so the panel keeps its state while the other tab is open. */
export const AnalysisTabPanel = ({ tab, active, children }: IAnalysisTabPanelProps) => (
  <StyledTabPanel
    role="tabpanel"
    id={analysisPanelId(tab)}
    aria-labelledby={analysisTabId(tab)}
    hidden={tab !== active}
  >
    {children}
  </StyledTabPanel>
);
