import { Divider, Stack, Typography } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import {
  StyledAlertsColumn,
  StyledReportLayout,
  StyledReportSummary,
} from '../styled-components';
import { IReportResultProps } from '../utilities';
import { ReportAlerts } from './ReportAlerts';
import { ReportHighlights } from './ReportHighlights';
import { ReportMetaLine } from './ReportMetaLine';

/** Prose on the left, the alert column on the right; on narrow screens the column drops below. */
export const ReportResult = ({ report, onRegenerate }: IReportResultProps) => {
  const { t } = useLanguage();
  const content = t.dashboard.report;

  return (
    <Stack spacing={2.5} divider={<Divider flexItem />}>
      <StyledReportLayout>
        <Stack spacing={2.5} divider={<Divider flexItem />}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{content.summaryTitle}</Typography>
            <StyledReportSummary>{report.summary}</StyledReportSummary>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{content.highlightsTitle}</Typography>
            <ReportHighlights highlights={report.highlights} />
          </Stack>
        </Stack>

        <StyledAlertsColumn>
          <Typography variant="subtitle2">{content.alertsTitle}</Typography>
          <ReportAlerts alerts={report.alerts} />
        </StyledAlertsColumn>
      </StyledReportLayout>

      <ReportMetaLine meta={report.meta} onRegenerate={onRegenerate} />
    </Stack>
  );
};
