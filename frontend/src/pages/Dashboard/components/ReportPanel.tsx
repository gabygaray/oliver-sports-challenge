import { Button, CircularProgress } from '@mui/material';
import { AutoAwesomeRounded } from '@mui/icons-material';

import { FeedbackState, Section } from '../../../components';
import { DASHBOARD_CONTENT } from '../content';
import { useSessionReport } from '../hooks';
import { StyledReportForm, StyledStreamingSummary } from '../styled-components';
import { IReportPanelProps } from '../utilities';
import { ReportOptions } from './ReportOptions';
import { ReportResult } from './ReportResult';

const { report: content } = DASHBOARD_CONTENT;

export const ReportPanel = ({ sessionId }: IReportPanelProps) => {
  const {
    language,
    audience,
    setLanguage,
    setAudience,
    status,
    stage,
    partialSummary,
    report,
    errorMessage,
    generate,
    regenerate,
  } = useSessionReport(sessionId);

  const isLoading = status === 'loading';

  return (
    <Section title={content.title} emphasis>
      <StyledReportForm>
        <ReportOptions
          language={language}
          audience={audience}
          disabled={isLoading}
          setLanguage={setLanguage}
          setAudience={setAudience}
        />
        <Button
          type="button"
          variant="contained"
          disabled={isLoading}
          onClick={generate}
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AutoAwesomeRounded />
            )
          }
        >
          {content.generate}
        </Button>
      </StyledReportForm>

      {/* Streaming: the summary types itself out while the rest of the report is still being written */}
      {isLoading && !partialSummary && (
        <FeedbackState
          variant="loading"
          message={stage ? content.stages[stage] : content.loading}
        />
      )}
      {isLoading && partialSummary && (
        <StyledStreamingSummary>{partialSummary}</StyledStreamingSummary>
      )}

      {status === 'error' && (
        <FeedbackState
          variant="error"
          message={errorMessage}
          retryLabel={DASHBOARD_CONTENT.retry}
          onRetry={generate}
        />
      )}
      {status === 'idle' && <FeedbackState variant="empty" message={content.empty} />}
      {status === 'success' && report && (
        <ReportResult report={report} onRegenerate={regenerate} />
      )}
    </Section>
  );
};
