import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { useLanguage } from '../../../contexts/language-context';
import { formatDate } from '../../../utilities';
import { StyledHeroSelect } from '../styled-components';
import { ISessionSelectorProps, SELECT_LABEL_IDS } from '../utilities';

export const SessionSelector = ({
  sessions,
  selectedSessionId,
  isLoading,
  onChange,
}: ISessionSelectorProps) => {
  const { t, locale } = useLanguage();
  const handleChange = (event: SelectChangeEvent<string>) =>
    onChange(Number(event.target.value));

  return (
    <StyledHeroSelect size="small" disabled={isLoading || !sessions.length}>
      <InputLabel id={SELECT_LABEL_IDS.session}>
        {t.dashboard.sessionSelectorLabel}
      </InputLabel>
      <Select
        labelId={SELECT_LABEL_IDS.session}
        label={t.dashboard.sessionSelectorLabel}
        value={selectedSessionId === null ? '' : String(selectedSessionId)}
        onChange={handleChange}
      >
        {sessions.map(session => (
          <MenuItem key={session.id} value={String(session.id)}>
            {formatDate(session.date, locale)}: {session.title}
          </MenuItem>
        ))}
      </Select>
    </StyledHeroSelect>
  );
};
