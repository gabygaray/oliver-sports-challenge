import { ReactNode } from 'react';

export interface IPageContainerProps {
  /** Full-width band rendered above the content column. */
  hero: ReactNode;
  children: ReactNode;
}
