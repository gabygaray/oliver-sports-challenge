/** Sent as the user turn after the rejected answer, so the model fixes the exact problems found by the validator. */
export const buildRetryFeedback = (violations: string[]): string =>
    `Your previous answer was rejected for these reasons:\n- ${violations.join('\n- ')}\nKeep what was correct and change only what is listed. Answer again with a single JSON object that follows every rule.`;
