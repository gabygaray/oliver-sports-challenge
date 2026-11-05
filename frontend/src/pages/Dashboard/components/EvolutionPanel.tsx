import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { TimelineRounded } from '@mui/icons-material';

import { FeedbackState } from '../../../components';
import { DASHBOARD_CONTENT } from '../content';
import { usePlayerEvolution } from '../hooks';
import { StyledReportForm } from '../styled-components';
import { SELECT_LABEL_IDS } from '../utilities';
import { EvolutionResult } from './EvolutionResult';
import { EvolutionSkeleton } from './EvolutionSkeleton';
import { ReportOptions } from './ReportOptions';

const { evolution: content } = DASHBOARD_CONTENT;

export const EvolutionPanel = () => {
  const {
    players,
    selectedPlayerId,
    selectPlayer,
    isLoadingPlayers,
    language,
    audience,
    setLanguage,
    setAudience,
    report,
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    generate,
    regenerate,
  } = usePlayerEvolution();

  const handlePlayerChange = (event: SelectChangeEvent<string>) =>
    selectPlayer(Number(event.target.value));

  return (
    <>
      <StyledReportForm>
        <FormControl size="small" disabled={isLoading || isLoadingPlayers}>
          <InputLabel id={SELECT_LABEL_IDS.player}>{content.playerLabel}</InputLabel>
          <Select
            labelId={SELECT_LABEL_IDS.player}
            label={content.playerLabel}
            value={selectedPlayerId === null ? '' : String(selectedPlayerId)}
            onChange={handlePlayerChange}
          >
            {players.map(player => (
              <MenuItem key={player.playerId} value={String(player.playerId)}>
                {player.shirtNumber}. {player.playerName} ({player.position})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ReportOptions
          language={language}
          audience={audience}
          disabled={isLoading}
          setLanguage={setLanguage}
          setAudience={setAudience}
        />
        <Button
          type="button"
          variant="contained"
          disabled={isLoading || selectedPlayerId === null}
          onClick={generate}
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <TimelineRounded />
            )
          }
        >
          {content.generate}
        </Button>
      </StyledReportForm>

      {/* Evolution report states */}
      {isLoadingPlayers && (
        <FeedbackState variant="loading" message={content.loadingPlayers} />
      )}
      {isLoading && <EvolutionSkeleton message={content.loading} />}
      {isError && (
        <FeedbackState
          variant="error"
          message={errorMessage}
          retryLabel={DASHBOARD_CONTENT.retry}
          onRetry={generate}
        />
      )}
      {!isLoadingPlayers && isEmpty && (
        <FeedbackState variant="empty" message={content.empty} />
      )}
      {report && !isLoading && (
        <EvolutionResult report={report} onRegenerate={regenerate} />
      )}
    </>
  );
};
