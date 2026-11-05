import { Skeleton, Stack, Typography } from '@mui/material';

import { SkeletonLines } from '../../../components';
import { DASHBOARD_CONTENT } from '../content';
import { StyledTrendChips } from '../styled-components';
import {
  IEvolutionSkeletonProps,
  SKELETON_SESSION_ROWS,
  SKELETON_TREND_CHIPS,
} from '../utilities';

const { evolution: content } = DASHBOARD_CONTENT;

/** Same blocks as the result (summary, observations, trends, sessions), so the card keeps its height while loading. */
export const EvolutionSkeleton = ({ message }: IEvolutionSkeletonProps) => (
  <Stack spacing={2.5}>
    <Typography variant="body2" color="text.secondary" role="status">
      {message}
    </Typography>
    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.summaryTitle}</Typography>
      <SkeletonLines count={4} />
    </Stack>
    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.observationsTitle}</Typography>
      <SkeletonLines count={3} lastWidth="80%" />
    </Stack>
    <Stack spacing={1}>
      <Typography variant="subtitle2">{content.trendsTitle}</Typography>
      <StyledTrendChips aria-hidden>
        {Array.from({ length: SKELETON_TREND_CHIPS }, (_, index) => (
          <Skeleton key={index} variant="rounded" width={160} height={24} />
        ))}
      </StyledTrendChips>
    </Stack>
    <Stack spacing={1} aria-hidden>
      <Typography variant="subtitle2">{content.sessionsTitle}</Typography>
      {Array.from({ length: SKELETON_SESSION_ROWS }, (_, index) => (
        <Skeleton key={index} variant="rectangular" height={36} />
      ))}
    </Stack>
  </Stack>
);
