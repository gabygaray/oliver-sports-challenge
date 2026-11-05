import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

import { Section } from '../../../components';
import { useLanguage } from '../../../contexts/language-context';
import { MetricKey } from '../../../models';
import {
  formatMetricLabelWithUnit,
  formatMetricValue,
  formatMetricWithUnit,
  METRIC_KEYS,
} from '../../../utilities';
import { useMetricChart } from '../hooks';
import { StyledBarChart } from '../styled-components';
import {
  CHART_AXIS_LABEL_STYLE,
  CHART_HEIGHT,
  CHART_LABEL_KEY,
  CHART_MARGIN,
  CHART_VALUE_KEY,
  IMetricChartProps,
  SELECT_LABEL_IDS,
} from '../utilities';

export const MetricChart = ({ players, thresholds }: IMetricChartProps) => {
  const { t, locale } = useLanguage();
  const content = t.dashboard.chart;
  const { metric, setMetric, bars, barColors, referenceLines, yMax } = useMetricChart(
    players,
    thresholds,
  );

  const handleMetricChange = (event: SelectChangeEvent<MetricKey>) =>
    setMetric(event.target.value as MetricKey);

  return (
    <Section
      title={content.title}
      actions={
        <FormControl size="small">
          <InputLabel id={SELECT_LABEL_IDS.chartMetric}>
            {content.metricSelectorLabel}
          </InputLabel>
          <Select
            labelId={SELECT_LABEL_IDS.chartMetric}
            label={content.metricSelectorLabel}
            value={metric}
            onChange={handleMetricChange}
          >
            {METRIC_KEYS.map(key => (
              <MenuItem key={key} value={key}>
                {t.metricLabels[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      <StyledBarChart
        height={CHART_HEIGHT}
        dataset={bars.map(({ label, value }) => ({
          [CHART_LABEL_KEY]: label,
          [CHART_VALUE_KEY]: value,
        }))}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: CHART_LABEL_KEY,
            label: content.playerAxis,
            tickLabelStyle: CHART_AXIS_LABEL_STYLE,
            colorMap: {
              type: 'ordinal',
              values: bars.map(({ label }) => label),
              colors: barColors,
            },
          },
        ]}
        yAxis={[
          {
            label: formatMetricLabelWithUnit(metric, t.metricLabels[metric]),
            valueFormatter: (value: number | null) => formatMetricValue(value, locale),
            max: yMax,
          },
        ]}
        series={[
          {
            dataKey: CHART_VALUE_KEY,
            label: t.metricLabels[metric],
            valueFormatter: value => formatMetricWithUnit(metric, value, locale),
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        margin={CHART_MARGIN}
      >
        {referenceLines.map(({ level, value, color, labelColor }) => (
          <ChartsReferenceLine
            key={level}
            y={value}
            label={content.lineLabels[level]}
            labelAlign="end"
            lineStyle={{ stroke: color, strokeDasharray: '6 4' }}
            labelStyle={{ fill: labelColor, fontSize: 12 }}
          />
        ))}
      </StyledBarChart>
    </Section>
  );
};
