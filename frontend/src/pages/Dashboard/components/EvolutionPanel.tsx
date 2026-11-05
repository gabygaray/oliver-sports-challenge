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
import { useLanguage } from '../../../contexts/language-context';
import { usePlayerEvolution } from '../hooks';
import { StyledReportForm } from '../styled-components';
import { SELECT_LABEL_IDS } from '../utilities';
import { EvolutionResult } from './EvolutionResult';
import { EvolutionSkeleton } from './EvolutionSkeleton';
import { ReportOptions } from './ReportOptions';

export const EvolutionPanel = () => {
  const { t, language } = useLanguage();
  const content = t.dashboard.evolution;
  const {
    players,
    selectedPlayerId,
    selectPlayer,
    isLoadingPlayers,
    audience,
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
  const otherLanguage = report !== null && report.meta.language !== language;

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
          audience={audience}
          disabled={isLoading}
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
        {otherLanguage && (
          <Button
            type="button"
            variant="outlined"
            disabled={isLoading}
            onClick={generate}
          >
            {t.dashboard.report.regenerateIn(t.languageLabels[language])}
          </Button>
        )}
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
          retryLabel={t.dashboard.retry}
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
