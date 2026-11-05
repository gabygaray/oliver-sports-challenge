import { useCallback, useEffect, useRef, useState } from 'react';

import { ISessionReport, TReportStage } from '../../../models';
import { openReportStream } from '../../../services';
import { IUseSessionReportStream, TReportStatus } from '../utilities';
import { useReportOptions } from './useReportOptions';

/** Streams the session report over SSE: the summary grows live, the full report lands at the end. */
export const useSessionReport = (sessionId: number): IUseSessionReportStream => {
  const options = useReportOptions();
  const [status, setStatus] = useState<TReportStatus>('idle');
  const [stage, setStage] = useState<TReportStage | null>(null);
  const [partialSummary, setPartialSummary] = useState('');
  const [report, setReport] = useState<ISessionReport | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const closeStream = useRef<() => void>(() => undefined);

  const reset = useCallback(() => {
    closeStream.current();
    setStatus('idle');
    setStage(null);
    setPartialSummary('');
    setReport(null);
    setErrorMessage('');
  }, []);

  // A new session invalidates whatever was on screen; unmount closes any open channel.
  useEffect(() => reset, [sessionId, reset]);

  const generate = (force = false) => {
    reset();
    setStatus('loading');
    closeStream.current = openReportStream(
      { sessionId, language: options.language, audience: options.audience, force },
      {
        onStage: setStage,
        onSummary: setPartialSummary,
        onReport: result => {
          setReport(result);
          setStatus('success');
        },
        onError: error => {
          setErrorMessage(error.message);
          setStatus('error');
        },
      },
    );
  };

  return {
    ...options,
    status,
    stage,
    partialSummary,
    report,
    errorMessage,
    generate: () => generate(false),
    regenerate: () => generate(true),
  };
};
