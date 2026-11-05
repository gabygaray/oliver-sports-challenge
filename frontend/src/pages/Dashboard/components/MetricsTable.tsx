import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { METRIC_KEYS } from '../../../utilities';
import { StyledTableContainer, StyledTableProgress } from '../styled-components';
import { IMetricsTableProps } from '../utilities';
import { MetricCell } from './MetricCell';
import { MetricColumnHeader } from './MetricColumnHeader';

export const MetricsTable = ({
  players,
  thresholds,
  sort,
  isFetching,
  onSort,
}: IMetricsTableProps) => {
  const { t } = useLanguage();
  const content = t.dashboard.metrics;

  return (
    <StyledTableContainer>
      {isFetching && (
        <StyledTableProgress>
          <LinearProgress />
        </StyledTableProgress>
      )}

      <Table size="small" aria-label={content.title}>
        <TableHead>
          <TableRow>
            <TableCell align="center">{content.shirtColumn}</TableCell>
            <TableCell>{content.playerColumn}</TableCell>
            <TableCell>{content.positionColumn}</TableCell>
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
                  <MetricColumnHeader metric={metric} />
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {players.map(player => (
            <TableRow key={player.playerId} hover>
              <TableCell align="center">{player.shirtNumber}</TableCell>
              <TableCell>{player.playerName}</TableCell>
              <TableCell>{player.position}</TableCell>
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
};
