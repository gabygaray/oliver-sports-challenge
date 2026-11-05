import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';

import { METRIC_KEYS, METRIC_LABELS, METRIC_UNITS } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledTableContainer, StyledTableProgress } from '../styled-components';
import { IMetricsTableProps } from '../utilities';
import { MetricCell } from './MetricCell';

export const MetricsTable = ({
  players,
  thresholds,
  sort,
  isFetching,
  onSort,
}: IMetricsTableProps) => (
  <StyledTableContainer>
    {isFetching && (
      <StyledTableProgress>
        <LinearProgress />
      </StyledTableProgress>
    )}

    <Table size="small" aria-label={DASHBOARD_CONTENT.metrics.title}>
      <TableHead>
        <TableRow>
          <TableCell align="center">{DASHBOARD_CONTENT.metrics.shirtColumn}</TableCell>
          <TableCell>{DASHBOARD_CONTENT.metrics.playerColumn}</TableCell>
          {METRIC_KEYS.map(metric => (
            <TableCell
              key={metric}
              align="right"
              sortDirection={sort.orderBy === metric ? sort.order : false}
            >
              <TableSortLabel
                active={sort.orderBy === metric}
                direction={sort.orderBy === metric ? sort.order : 'desc'}
                onClick={() => onSort(metric)}
              >
                <span>
                  {METRIC_LABELS[metric]}
                  {METRIC_UNITS[metric] && (
                    <Typography component="span" variant="caption" color="text.secondary">
                      &nbsp;({METRIC_UNITS[metric]})
                    </Typography>
                  )}
                </span>
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {players.map(player => (
          <TableRow key={player.playerId} hover>
            <TableCell align="center">{player.shirtNumber}</TableCell>
            <TableCell>
              {player.playerName}
              <Typography component="span" variant="caption" color="text.secondary">
                &nbsp;{player.position}
              </Typography>
            </TableCell>
            {METRIC_KEYS.map(metric => (
              <TableCell key={metric} align="right">
                <MetricCell
                  metric={metric}
                  value={player.values[metric]}
                  limits={thresholds[metric]}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </StyledTableContainer>
);
