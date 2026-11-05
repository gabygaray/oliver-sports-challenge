import { ReactNode } from 'react';

export interface ISectionProps {
  title: string;
  /** One line under the title that explains how to use the section. */
  description?: string;
  /** Controls aligned with the title, for example a metric selector. */
  actions?: ReactNode;
  /** Tinted surface for the one block that should stand out on the page. */
  emphasis?: boolean;
  children: ReactNode;
}
