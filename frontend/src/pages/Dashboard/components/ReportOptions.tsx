import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { ReportAudience } from '../../../models';
import { IReportOptionsProps, SELECT_LABEL_IDS } from '../utilities';

/** Audience select shared by the session and evolution report forms; the language is the app's. */
export const ReportOptions = ({
  audience,
  disabled,
  setAudience,
}: IReportOptionsProps) => {
  const { t } = useLanguage();
  const handleAudienceChange = (event: SelectChangeEvent<ReportAudience>) =>
    setAudience(event.target.value as ReportAudience);

  return (
    <FormControl size="small" disabled={disabled}>
      <InputLabel id={SELECT_LABEL_IDS.reportAudience}>
        {t.dashboard.report.audienceLabel}
      </InputLabel>
      <Select
        labelId={SELECT_LABEL_IDS.reportAudience}
        label={t.dashboard.report.audienceLabel}
        value={audience}
        onChange={handleAudienceChange}
      >
        {Object.values(ReportAudience).map(value => (
          <MenuItem key={value} value={value}>
            {t.audiences[value]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
