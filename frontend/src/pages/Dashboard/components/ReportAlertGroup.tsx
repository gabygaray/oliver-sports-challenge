import { Chip, Stack, Typography } from '@mui/material';

import { ALERT_LEVEL_COLOR } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledAlertGroupChips } from '../styled-components';
import { formatAlertChip, IReportAlertGroupProps } from '../utilities';

export const ReportAlertGroup = ({ level, alerts }: IReportAlertGroupProps) => (
  <Stack spacing={1}>
    <Typography
      variant="caption"
      color={`${ALERT_LEVEL_COLOR[level]}.dark`}
      fontWeight={600}
    >
      {DASHBOARD_CONTENT.report.alertGroups[level]} ({alerts.length})
    </Typography>
    <StyledAlertGroupChips>
      {alerts.map(alert => (
        <Chip
          key={`${alert.playerId}-${alert.metric}`}
          size="small"
          color={ALERT_LEVEL_COLOR[level]}
          variant="outlined"
          label={formatAlertChip(alert)}
        />
      ))}
    </StyledAlertGroupChips>
  </Stack>
);
