import { Chip, Stack, Typography } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { ALERT_LEVEL_COLOR } from '../../../utilities';
import { StyledAlertGroupChips } from '../styled-components';
import { formatAlertChip, IReportAlertGroupProps } from '../utilities';

export const ReportAlertGroup = ({ level, alerts }: IReportAlertGroupProps) => {
  const { t, locale } = useLanguage();

  return (
    <Stack spacing={1}>
      <Typography
        variant="caption"
        color={`${ALERT_LEVEL_COLOR[level]}.dark`}
        fontWeight={600}
      >
        {t.dashboard.report.alertGroups[level]} ({alerts.length})
      </Typography>
      <StyledAlertGroupChips>
        {alerts.map(alert => (
          <Chip
            key={`${alert.playerId}-${alert.metric}`}
            size="small"
            color={ALERT_LEVEL_COLOR[level]}
            variant="outlined"
            label={formatAlertChip(alert, t.metricLabels, locale)}
          />
        ))}
      </StyledAlertGroupChips>
    </Stack>
  );
};
