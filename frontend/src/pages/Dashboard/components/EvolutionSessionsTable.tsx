import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { MetricKey } from '../../../models';
import { formatDate, formatMetricValue } from '../../../utilities';
import { StyledMetricValue, StyledTableContainer } from '../styled-components';
import {
  EVOLUTION_METRICS,
  findAlertLevel,
  IEvolutionSessionsTableProps,
} from '../utilities';
import { MetricColumnHeader } from './MetricColumnHeader';

export const EvolutionSessionsTable = ({ sessions }: IEvolutionSessionsTableProps) => {
  const { t, locale } = useLanguage();
  const content = t.dashboard.evolution;

  return (
    <StyledTableContainer>
      <Table size="small" aria-label={content.sessionsTitle}>
        <TableHead>
          <TableRow>
            <TableCell>{content.sessionColumn}</TableCell>
            <TableCell align="right">
              <MetricColumnHeader metric={MetricKey.MinutesPlayed} />
            </TableCell>
            {EVOLUTION_METRICS.map(metric => (
              <TableCell key={metric} align="right">
                <MetricColumnHeader metric={metric} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map(row => (
            <TableRow key={row.session.id} hover>
              <TableCell>
                {formatDate(row.session.date, locale)}, {t.sessionTypes[row.session.type]}
                {row.reducedMinutes && (
                  <Typography component="span" variant="caption" color="text.secondary">
                    {' '}
                    ({content.reducedMinutes})
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                {formatMetricValue(row.values.minutes_played, locale)}
              </TableCell>
              {EVOLUTION_METRICS.map(metric => (
                <TableCell key={metric} align="right">
                  <StyledMetricValue $level={findAlertLevel(row.alerts, metric)}>
                    {formatMetricValue(row.values[metric], locale)}
                  </StyledMetricValue>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};
