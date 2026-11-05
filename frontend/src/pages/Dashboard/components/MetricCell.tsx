import { useLanguage } from '../../../contexts/language-context';
import { formatMetricValue, getAlertLevel } from '../../../utilities';
import { StyledMetricValue } from '../styled-components';
import { IMetricCellProps } from '../utilities';

export const MetricCell = ({ metric, value, limits }: IMetricCellProps) => {
  const { locale } = useLanguage();

  return (
    <StyledMetricValue $level={getAlertLevel(value, limits)} data-metric={metric}>
      {formatMetricValue(value, locale)}
    </StyledMetricValue>
  );
};
