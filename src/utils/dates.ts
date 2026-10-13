/**
 * How the site shows a date to a reader.
 *
 * - "prose": running text, full month, American order: "August 17, 2020".
 * - "compact": metadata, tables, lists, changelog lines, and badges:
 *   abbreviated month without a period: "Aug 17, 2020".
 *
 * ISO dates (2020-08-17) stay where they are data rather than text: code
 * samples, JSON, schema examples, URLs, `datetime` attributes, exports, and
 * filenames. Dates are read and written in UTC, so a page renders the same
 * day on a runner in any time zone.
 */
export type DateStyle = "prose" | "compact";

const ISO_DATE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ][\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const ISO_MONTH = /^(\d{4})-(\d{2})$/;

const formatters = {
  prose: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  compact: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
};

const monthFormatters = {
  prose: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
  }),
  compact: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
  }),
};

const toDate = (value: string | Date): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmed = value.trim();
  if (!ISO_DATE.test(trimmed)) {
    return null;
  }

  // A bare YYYY-MM-DD parses as UTC midnight; a timestamp keeps its offset.
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * "Aug 17, 2020" (compact, the default) or "August 17, 2020" (prose).
 * A value that is not an ISO date or a Date, such as "TBD", is returned as
 * passed.
 */
export const formatDate = (
  value: string | Date,
  style: DateStyle = "compact",
): string => {
  const date = toDate(value);
  return date ? formatters[style].format(date) : String(value);
};

/**
 * "Oct 2026" (compact, the default) or "October 2026" (prose), from a
 * YYYY-MM value, an ISO date, or a Date.
 */
export const formatMonth = (
  value: string | Date,
  style: DateStyle = "compact",
): string => {
  const month = typeof value === "string" ? ISO_MONTH.exec(value.trim()) : null;
  const date = month
    ? new Date(Date.UTC(Number(month[1]), Number(month[2]) - 1, 1))
    : toDate(value);
  return date ? monthFormatters[style].format(date) : String(value);
};

/**
 * Text with each ISO date in it written for a reader: "Withdrawn
 * 2026-02-15" becomes "Withdrawn Feb 15, 2026". An ID built on a date, such
 * as DEC-2026-10-01, is left alone.
 */
export const formatDatesInText = (
  text: string,
  style: DateStyle = "compact",
): string =>
  text.replace(/(?<![\w-])\d{4}-\d{2}-\d{2}(?![\w-])/g, (match) =>
    formatDate(match, style),
  );
