import { Button, Chip, Typography } from '@mui/material';
import { CachedRounded } from '@mui/icons-material';

import { formatDateTime } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledMetaLine } from '../styled-components';
import { IReportMetaLineProps } from '../utilities';

const { report: content } = DASHBOARD_CONTENT;

/** Model, prompt version and timestamp; a cached report also offers to be regenerated. */
export const ReportMetaLine = ({ meta, onRegenerate }: IReportMetaLineProps) => (
  <StyledMetaLine>
    <Typography variant="caption">
      {content.metaTemplate(
        meta.model,
        meta.promptVersion,
        formatDateTime(meta.generatedAt),
      )}
    </Typography>
    {meta.cached && (
      <>
        <Chip
          size="small"
          variant="outlined"
          icon={<CachedRounded />}
          label={content.cachedChip}
        />
        <Button size="small" onClick={onRegenerate}>
          {content.regenerate}
        </Button>
      </>
    )}
  </StyledMetaLine>
);
