import { Button, Chip, Typography } from '@mui/material';
import { CachedRounded } from '@mui/icons-material';

import { useLanguage } from '../../../contexts/language-context';
import { formatDateTime } from '../../../utilities';
import { StyledMetaLine } from '../styled-components';
import { IReportMetaLineProps } from '../utilities';

/** Model, prompt version and timestamp; a cached report also offers to be regenerated. */
export const ReportMetaLine = ({ meta, onRegenerate }: IReportMetaLineProps) => {
  const { t, locale } = useLanguage();
  const content = t.dashboard.report;

  return (
    <StyledMetaLine>
      <Typography variant="caption">
        {content.metaTemplate(
          meta.model,
          meta.promptVersion,
          formatDateTime(meta.generatedAt, locale),
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
};
