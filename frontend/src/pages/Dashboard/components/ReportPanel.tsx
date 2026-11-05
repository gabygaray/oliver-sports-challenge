import { Button, CircularProgress } from '@mui/material';
import { AutoAwesomeRounded } from '@mui/icons-material';

import { FeedbackState } from '../../../components';
import { useLanguage } from '../../../contexts/language-context';
import { useSessionReport } from '../hooks';
import { StyledReportForm, StyledStreamingSummary } from '../styled-components';
import { IReportPanelProps } from '../utilities';
import { ReportOptions } from './ReportOptions';
import { ReportResult } from './ReportResult';
import { ReportSkeleton } from './ReportSkeleton';

export const ReportPanel = ({ sessionId }: IReportPanelProps) => {
  const { t, language } = useLanguage();
  const content = t.dashboard.report;
  const {
    audience,
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
  // A report in the other language can be asked again in the app's; the cache answers when it exists.
  const otherLanguage = report !== null && report.meta.language !== language;

  return (
    <>
      <StyledReportForm>
        <ReportOptions
          audience={audience}
          disabled={isLoading}
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
        {otherLanguage && (
          <Button
            type="button"
            variant="outlined"
            disabled={isLoading}
            onClick={generate}
          >
            {content.regenerateIn(t.languageLabels[language])}
          </Button>
        )}
      </StyledReportForm>

      {/* Streaming: the summary types itself out in the skeleton while the rest is still being written */}
      {isLoading && (
        <ReportSkeleton
          message={stage ? content.stages[stage] : content.loading}
          summary={
            partialSummary ? (
              <StyledStreamingSummary>{partialSummary}</StyledStreamingSummary>
            ) : undefined
          }
        />
      )}

      {status === 'error' && (
        <FeedbackState
          variant="error"
          message={errorMessage}
          retryLabel={t.dashboard.retry}
          onRetry={generate}
        />
      )}
      {status === 'idle' && <FeedbackState variant="empty" message={content.empty} />}
      {status === 'success' && report && (
        <ReportResult report={report} onRegenerate={regenerate} />
      )}
    </>
  );
};
