import { formatMetricValue, getAlertLevel } from '../../../utilities';
import { StyledMetricValue } from '../styled-components';
import { IMetricCellProps } from '../utilities';

export const MetricCell = ({ metric, value, limits }: IMetricCellProps) => (
  <StyledMetricValue $level={getAlertLevel(value, limits)} data-metric={metric}>
    {formatMetricValue(value)}
  </StyledMetricValue>
);
