import { Skeleton, Stack } from '@mui/material';

import { ISkeletonLinesProps } from '../../utilities';

/** Text placeholder: full-width lines with a shorter last one, like a paragraph. */
export const SkeletonLines = ({ count, lastWidth = '60%' }: ISkeletonLinesProps) => (
  <Stack spacing={0.75} aria-hidden>
    {Array.from({ length: count }, (_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === count - 1 ? lastWidth : '100%'}
      />
    ))}
  </Stack>
);
