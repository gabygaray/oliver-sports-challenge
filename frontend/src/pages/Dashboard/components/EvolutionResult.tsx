import { Divider, Stack, Typography } from '@mui/material';

import { DASHBOARD_CONTENT } from '../content';
import { StyledHighlightList, StyledReportSummary } from '../styled-components';
import { IEvolutionResultProps } from '../utilities';
import { EvolutionSessionsTable } from './EvolutionSessionsTable';
import { EvolutionTrends } from './EvolutionTrends';
import { ReportMetaLine } from './ReportMetaLine';

const { evolution: content } = DASHBOARD_CONTENT;

export const EvolutionResult = ({ report, onRegenerate }: IEvolutionResultProps) => (
  <Stack spacing={2.5} divider={<Divider flexItem />}>
    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.summaryTitle}</Typography>
      <StyledReportSummary>{report.summary}</StyledReportSummary>
    </Stack>

    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.observationsTitle}</Typography>
      <StyledHighlightList>
        {report.observations.map(observation => (
          <li key={observation}>
            <Typography variant="body2">{observation}</Typography>
          </li>
        ))}
      </StyledHighlightList>
    </Stack>

    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.trendsTitle}</Typography>
      <EvolutionTrends trends={report.trends} />
    </Stack>

    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.sessionsTitle}</Typography>
      <EvolutionSessionsTable sessions={report.sessions} />
    </Stack>

    <ReportMetaLine meta={report.meta} onRegenerate={onRegenerate} />
  </Stack>
);
