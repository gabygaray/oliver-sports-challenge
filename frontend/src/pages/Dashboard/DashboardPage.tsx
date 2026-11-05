import { FeedbackState, PageContainer } from '../../components';
import {
  EvolutionPanel,
  MetricChart,
  MetricsTableSection,
  ReportPanel,
  SessionHeader,
} from './components';
import { DASHBOARD_CONTENT } from './content';
import { useSessionMetrics, useSessionSelection } from './hooks';
import { StyledAnalysisGrid } from './styled-components';

const DashboardPage = () => {
  const selection = useSessionSelection();
  const metrics = useSessionMetrics(selection.selectedSessionId);
  const { sessions, selectedSessionId, isLoading, isError, errorMessage, refetch } =
    selection;
  const hasPlayers = metrics.players.length > 0;

  return (
    <PageContainer hero={<SessionHeader selection={selection} metrics={metrics} />}>
      {/* Session list states */}
      {isLoading && (
        <FeedbackState variant="loading" message={DASHBOARD_CONTENT.loadingSessions} />
      )}
      {isError && (
        <FeedbackState
          variant="error"
          message={errorMessage}
          retryLabel={DASHBOARD_CONTENT.retry}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && !sessions.length && (
        <FeedbackState variant="empty" message={DASHBOARD_CONTENT.emptySessions} />
      )}

      {/* Data of the selected session, then the AI report beside the chart */}
      {selectedSessionId !== null && (
        <>
          <MetricsTableSection metrics={metrics} />
          <StyledAnalysisGrid>
            {hasPlayers && (
              <MetricChart players={metrics.players} thresholds={metrics.thresholds} />
            )}
            <ReportPanel sessionId={selectedSessionId} />
          </StyledAnalysisGrid>
        </>
      )}

      {/* Player evolution across sessions; independent of the selected session */}
      {!isLoading && !isError && sessions.length > 0 && <EvolutionPanel />}
    </PageContainer>
  );
};

export default DashboardPage;
