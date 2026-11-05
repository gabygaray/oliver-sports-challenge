/** Appended to the user prompt on retry so the model fixes the exact problems found by the validator. */
export const buildRetryFeedback = (violations: string[]): string =>
    `\n\nYour previous answer was rejected for these reasons:\n- ${violations.join('\n- ')}\nAnswer again following every rule.`;
