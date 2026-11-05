import { Stack, Typography } from '@mui/material';

import { AlertLevel } from '../../../models';
import { DASHBOARD_CONTENT } from '../content';
import { groupAlertsByLevel, IReportAlertsProps } from '../utilities';
import { ReportAlertGroup } from './ReportAlertGroup';

/** Critical alerts first, then warnings, each group stacked so the column scans top to bottom. */
export const ReportAlerts = ({ alerts }: IReportAlertsProps) => {
  if (!alerts.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {DASHBOARD_CONTENT.report.noAlerts}
      </Typography>
    );
  }

  const groups = groupAlertsByLevel(alerts);
  return (
    <Stack spacing={2}>
      {[AlertLevel.Critical, AlertLevel.Warning].map(
        level =>
          groups[level].length > 0 && (
            <ReportAlertGroup key={level} level={level} alerts={groups[level]} />
          ),
      )}
    </Stack>
  );
};
