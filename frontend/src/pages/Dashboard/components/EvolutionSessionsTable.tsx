import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { MetricKey } from '../../../models';
import { formatDate, formatMetricValue } from '../../../utilities';
import { DASHBOARD_CONTENT, SESSION_TYPE_LABELS } from '../content';
import { StyledMetricValue, StyledTableContainer } from '../styled-components';
import {
  EVOLUTION_METRICS,
  findAlertLevel,
  IEvolutionSessionsTableProps,
} from '../utilities';
import { MetricColumnHeader } from './MetricColumnHeader';

const { evolution: content } = DASHBOARD_CONTENT;

export const EvolutionSessionsTable = ({ sessions }: IEvolutionSessionsTableProps) => (
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
              {formatDate(row.session.date)}, {SESSION_TYPE_LABELS[row.session.type]}
              {row.reducedMinutes && (
                <Typography component="span" variant="caption" color="text.secondary">
                  {' '}
                  ({content.reducedMinutes})
                </Typography>
              )}
            </TableCell>
            <TableCell align="right">
              {formatMetricValue(row.values.minutes_played)}
            </TableCell>
            {EVOLUTION_METRICS.map(metric => (
              <TableCell key={metric} align="right">
                <StyledMetricValue $level={findAlertLevel(row.alerts, metric)}>
                  {formatMetricValue(row.values[metric])}
                </StyledMetricValue>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </StyledTableContainer>
);
