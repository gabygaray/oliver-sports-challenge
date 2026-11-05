import { FeedbackState, PageContainer } from '../../components';
import {
  AnalysisTabs,
  MetricChart,
  MetricsTableSection,
  SessionHeader,
} from './components';
import { DASHBOARD_CONTENT } from './content';
import { useSessionMetrics, useSessionSelection } from './hooks';

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

      {/* Data of the selected session, then the two AI analyses in tabs */}
      {selectedSessionId !== null && (
        <>
          <MetricsTableSection metrics={metrics} />
          {hasPlayers && (
            <MetricChart players={metrics.players} thresholds={metrics.thresholds} />
          )}
          <AnalysisTabs sessionId={selectedSessionId} />
        </>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
