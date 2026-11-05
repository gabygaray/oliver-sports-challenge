import { FeedbackState, Section } from '../../../components';
import { DASHBOARD_CONTENT } from '../content';
import { IMetricsTableSectionProps } from '../utilities';
import { MetricsTable } from './MetricsTable';
import { ThresholdLegend } from './ThresholdLegend';

const { metrics: content } = DASHBOARD_CONTENT;

export const MetricsTableSection = ({ metrics }: IMetricsTableSectionProps) => {
  const {
    players,
    thresholds,
    sort,
    toggleSort,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    refetch,
  } = metrics;

  return (
    <Section title={content.title} description={content.description}>
      {isLoading && <FeedbackState variant="loading" message={content.loading} />}
      {isError && (
        <FeedbackState
          variant="error"
          message={errorMessage}
          retryLabel={DASHBOARD_CONTENT.retry}
          onRetry={refetch}
        />
      )}
      {!isLoading && !isError && !players.length && (
        <FeedbackState variant="empty" message={content.empty} />
      )}
      {players.length > 0 && (
        <>
          <ThresholdLegend thresholds={thresholds} />
          <MetricsTable
            players={players}
            thresholds={thresholds}
            sort={sort}
            isFetching={isFetching}
            onSort={toggleSort}
          />
        </>
      )}
    </Section>
  );
};
