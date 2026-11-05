const formatters = new Map<string, Intl.DateTimeFormat>();

/** One formatter per locale and style, created on first use. */
const dateFormatter = (
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat => {
  const key = `${locale}:${JSON.stringify(options)}`;
  const cached = formatters.get(key);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat(locale, options);
  formatters.set(key, created);
  return created;
};

/** API dates come as YYYY-MM-DD; parsing the parts avoids the UTC shift of `new Date(string)`. */
const parseIsoDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (isoDate: string, locale: string): string =>
  dateFormatter(locale, { dateStyle: 'medium' }).format(parseIsoDate(isoDate));

/** "19 de septiembre de 2026" / "September 19, 2026" */
export const formatLongDate = (isoDate: string, locale: string): string =>
  dateFormatter(locale, { dateStyle: 'long' }).format(parseIsoDate(isoDate));

export const formatDateTime = (isoDateTime: string, locale: string): string =>
  dateFormatter(locale, { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(isoDateTime),
  );
