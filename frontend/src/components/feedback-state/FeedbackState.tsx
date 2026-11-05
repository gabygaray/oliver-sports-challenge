import { Button, CircularProgress, Typography } from '@mui/material';
import { ErrorOutlineRounded, InboxRounded } from '@mui/icons-material';

import { StyledFeedbackState } from '../../styled-components';
import { IFeedbackStateProps } from '../../utilities';

export const FeedbackState = ({
  variant,
  message,
  retryLabel,
  onRetry,
}: IFeedbackStateProps) => (
  <StyledFeedbackState role={variant === 'error' ? 'alert' : 'status'}>
    {variant === 'loading' && <CircularProgress size={32} />}
    {variant === 'error' && (
      <ErrorOutlineRounded className="feedback-icon" color="error" />
    )}
    {variant === 'empty' && <InboxRounded className="feedback-icon" />}

    <Typography variant="body2">{message}</Typography>

    {variant === 'error' && onRetry && retryLabel && (
      <Button variant="outlined" size="small" onClick={onRetry}>
        {retryLabel}
      </Button>
    )}
  </StyledFeedbackState>
);
