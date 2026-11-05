import { Skeleton, Stack, Typography } from '@mui/material';

import { SkeletonLines } from '../../../components';
import { DASHBOARD_CONTENT } from '../content';
import {
  StyledAlertGroupChips,
  StyledAlertsColumn,
  StyledReportLayout,
} from '../styled-components';
import { IReportSkeletonProps, SKELETON_ALERT_ROWS } from '../utilities';

const { report: content } = DASHBOARD_CONTENT;

/** Same layout as the result, so the card keeps its height while the model writes; a live summary replaces its lines. */
export const ReportSkeleton = ({ message, summary }: IReportSkeletonProps) => (
  <Stack spacing={2.5}>
    <Typography variant="body2" color="text.secondary" role="status">
      {message}
    </Typography>
    <StyledReportLayout>
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">{content.summaryTitle}</Typography>
          {summary ?? <SkeletonLines count={4} />}
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2">{content.highlightsTitle}</Typography>
          <SkeletonLines count={3} lastWidth="80%" />
        </Stack>
      </Stack>

      <StyledAlertsColumn>
        <Typography variant="subtitle2">{content.alertsTitle}</Typography>
        <StyledAlertGroupChips aria-hidden>
          {Array.from({ length: SKELETON_ALERT_ROWS }, (_, index) => (
            <Skeleton key={index} variant="rounded" width="85%" height={24} />
          ))}
        </StyledAlertGroupChips>
      </StyledAlertsColumn>
    </StyledReportLayout>
  </Stack>
);
