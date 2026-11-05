import { Tooltip, Typography } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { METRIC_UNITS } from '../../../utilities';
import { StyledColumnHeader, StyledInfoIcon } from '../styled-components';
import { IMetricColumnHeaderProps, stopEventPropagation } from '../utilities';

export const MetricColumnHeader = ({ metric }: IMetricColumnHeaderProps) => {
  const { t } = useLanguage();
  const description = t.metricDescriptions[metric];

  return (
    <StyledColumnHeader>
      {t.metricLabels[metric]}
      {METRIC_UNITS[metric] && (
        <Typography component="span" variant="caption" color="text.secondary">
          &nbsp;({METRIC_UNITS[metric]})
        </Typography>
      )}
      {description && (
        <Tooltip title={description} arrow>
          <StyledInfoIcon onClick={stopEventPropagation} />
        </Tooltip>
      )}
    </StyledColumnHeader>
  );
};
