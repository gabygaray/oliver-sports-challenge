import { useContext } from 'react';

import { LanguageContext } from './Language';
import { ILanguageContext } from './language.types';

export const useLanguage = (): ILanguageContext => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside <Language>');
  return context;
};
