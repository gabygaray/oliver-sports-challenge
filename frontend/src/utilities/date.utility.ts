import { LOCALE } from './constants';

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' });
const longDateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long' });

const parseIsoDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** API dates come as YYYY-MM-DD; parsing the parts avoids the UTC shift of `new Date(string)`. */
export const formatDate = (isoDate: string): string =>
  dateFormatter.format(parseIsoDate(isoDate));

/** "19 de septiembre de 2026" */
export const formatLongDate = (isoDate: string): string =>
  longDateFormatter.format(parseIsoDate(isoDate));

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const formatDateTime = (isoDateTime: string): string =>
  dateTimeFormatter.format(new Date(isoDateTime));
