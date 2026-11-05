import { Divider, Stack, Typography } from '@mui/material';

import { DASHBOARD_CONTENT } from '../content';
import { StyledReportSummary } from '../styled-components';
import { IReportResultProps } from '../utilities';
import { ReportAlerts } from './ReportAlerts';
import { ReportHighlights } from './ReportHighlights';
import { ReportMetaLine } from './ReportMetaLine';

const { report: content } = DASHBOARD_CONTENT;

export const ReportResult = ({ report, onRegenerate }: IReportResultProps) => (
  <Stack spacing={2.5} divider={<Divider flexItem />}>
    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.summaryTitle}</Typography>
      <StyledReportSummary>{report.summary}</StyledReportSummary>
    </Stack>

    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.highlightsTitle}</Typography>
      <ReportHighlights highlights={report.highlights} />
    </Stack>

    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.alertsTitle}</Typography>
      <ReportAlerts alerts={report.alerts} />
    </Stack>

    <ReportMetaLine meta={report.meta} onRegenerate={onRegenerate} />
  </Stack>
);
