import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { formatDate } from '../../../utilities';
import { DASHBOARD_CONTENT } from '../content';
import { StyledHeroSelect } from '../styled-components';
import { ISessionSelectorProps, SELECT_LABEL_IDS } from '../utilities';

export const SessionSelector = ({
  sessions,
  selectedSessionId,
  isLoading,
  onChange,
}: ISessionSelectorProps) => {
  const handleChange = (event: SelectChangeEvent<string>) =>
    onChange(Number(event.target.value));

  return (
    <StyledHeroSelect size="small" disabled={isLoading || !sessions.length}>
      <InputLabel id={SELECT_LABEL_IDS.session}>
        {DASHBOARD_CONTENT.sessionSelectorLabel}
      </InputLabel>
      <Select
        labelId={SELECT_LABEL_IDS.session}
        label={DASHBOARD_CONTENT.sessionSelectorLabel}
        value={selectedSessionId === null ? '' : String(selectedSessionId)}
        onChange={handleChange}
      >
        {sessions.map(session => (
          <MenuItem key={session.id} value={String(session.id)}>
            {formatDate(session.date)}: {session.title}
          </MenuItem>
        ))}
      </Select>
    </StyledHeroSelect>
  );
};
