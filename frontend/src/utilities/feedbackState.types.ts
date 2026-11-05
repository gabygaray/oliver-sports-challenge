export type TFeedbackVariant = 'loading' | 'error' | 'empty';

export interface IFeedbackStateProps {
  variant: TFeedbackVariant;
  message: string;
  /** Shown as a button under the message; only meaningful for the error variant. */
  retryLabel?: string;
  onRetry?: () => void;
}
