import { Chip, Typography } from '@mui/material';

import { ALERT_LEVEL_COLOR } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledAlertChips } from '../styled-components';
import { formatAlertChip, IReportAlertsProps } from '../utilities';

export const ReportAlerts = ({ alerts }: IReportAlertsProps) => {
  if (!alerts.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {DASHBOARD_CONTENT.report.noAlerts}
      </Typography>
    );
  }

  return (
    <StyledAlertChips>
      {alerts.map(alert => (
        <Chip
          key={`${alert.playerId}-${alert.metric}`}
          size="small"
          color={ALERT_LEVEL_COLOR[alert.level]}
          variant="outlined"
          label={formatAlertChip(alert)}
        />
      ))}
    </StyledAlertChips>
  );
};
