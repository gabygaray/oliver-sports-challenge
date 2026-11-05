import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { ReportAudience, ReportLanguage } from '../../../models';
import {
  DASHBOARD_CONTENT,
  REPORT_AUDIENCE_LABELS,
  REPORT_LANGUAGE_LABELS,
} from '../content';
import { IReportOptionsProps, SELECT_LABEL_IDS } from '../utilities';

const { report: content } = DASHBOARD_CONTENT;

/** Language and audience selects shared by the session and evolution report forms. */
export const ReportOptions = ({
  language,
  audience,
  disabled,
  setLanguage,
  setAudience,
}: IReportOptionsProps) => {
  const handleLanguageChange = (event: SelectChangeEvent<ReportLanguage>) =>
    setLanguage(event.target.value as ReportLanguage);
  const handleAudienceChange = (event: SelectChangeEvent<ReportAudience>) =>
    setAudience(event.target.value as ReportAudience);

  return (
    <>
      <FormControl size="small" disabled={disabled}>
        <InputLabel id={SELECT_LABEL_IDS.reportLanguage}>
          {content.languageLabel}
        </InputLabel>
        <Select
          labelId={SELECT_LABEL_IDS.reportLanguage}
          label={content.languageLabel}
          value={language}
          onChange={handleLanguageChange}
        >
          {Object.values(ReportLanguage).map(value => (
            <MenuItem key={value} value={value}>
              {REPORT_LANGUAGE_LABELS[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" disabled={disabled}>
        <InputLabel id={SELECT_LABEL_IDS.reportAudience}>
          {content.audienceLabel}
        </InputLabel>
        <Select
          labelId={SELECT_LABEL_IDS.reportAudience}
          label={content.audienceLabel}
          value={audience}
          onChange={handleAudienceChange}
        >
          {Object.values(ReportAudience).map(value => (
            <MenuItem key={value} value={value}>
              {REPORT_AUDIENCE_LABELS[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
