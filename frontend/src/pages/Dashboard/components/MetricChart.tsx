import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

import { Section } from '../../../components';
import { MetricKey } from '../../../models';
import {
  formatMetricLabelWithUnit,
  formatMetricValue,
  formatMetricWithUnit,
  METRIC_KEYS,
  METRIC_LABELS,
} from '../../../utilities';
import { ALERT_LINE_LABELS, DASHBOARD_CONTENT } from '../content';
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
  const { metric, setMetric, bars, barColors, referenceLines } = useMetricChart(
    players,
    thresholds,
  );

  const handleMetricChange = (event: SelectChangeEvent<MetricKey>) =>
    setMetric(event.target.value as MetricKey);

  return (
    <Section
      title={DASHBOARD_CONTENT.chart.title}
      actions={
        <FormControl size="small">
          <InputLabel id={SELECT_LABEL_IDS.chartMetric}>
            {DASHBOARD_CONTENT.chart.metricSelectorLabel}
          </InputLabel>
          <Select
            labelId={SELECT_LABEL_IDS.chartMetric}
            label={DASHBOARD_CONTENT.chart.metricSelectorLabel}
            value={metric}
            onChange={handleMetricChange}
          >
            {METRIC_KEYS.map(key => (
              <MenuItem key={key} value={key}>
                {METRIC_LABELS[key]}
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
            label: DASHBOARD_CONTENT.chart.playerAxis,
            tickLabelStyle: CHART_AXIS_LABEL_STYLE,
            colorMap: {
              type: 'ordinal',
              values: bars.map(({ label }) => label),
              colors: barColors,
            },
          },
        ]}
        yAxis={[
          { label: formatMetricLabelWithUnit(metric), valueFormatter: formatMetricValue },
        ]}
        series={[
          {
            dataKey: CHART_VALUE_KEY,
            label: METRIC_LABELS[metric],
            valueFormatter: value => formatMetricWithUnit(metric, value),
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        margin={CHART_MARGIN}
      >
        {referenceLines.map(({ level, value, color, labelColor }) => (
          <ChartsReferenceLine
            key={level}
            y={value}
            label={ALERT_LINE_LABELS[level]}
            labelAlign="end"
            lineStyle={{ stroke: color, strokeDasharray: '6 4' }}
            labelStyle={{ fill: labelColor, fontSize: 12 }}
          />
        ))}
      </StyledBarChart>
    </Section>
  );
};
