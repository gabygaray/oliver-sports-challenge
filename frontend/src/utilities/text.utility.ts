/** "1 alerta crítica" / "3 alertas críticas". */
export const formatCount = (count: number, singular: string, plural: string): string =>
  `${count} ${count === 1 ? singular : plural}`;
