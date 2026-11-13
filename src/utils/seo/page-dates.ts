/**
 * When each static page last changed, by route, from the build's git history
 * (scripts/lib/page-dates.ts). Empty outside Vite, as under `bun test`, and
 * when the build had no history to read.
 */

type PageDates = Record<string, string>;

let pageDates: Promise<PageDates> | undefined;

export const loadPageDates = (): Promise<PageDates> => {
  pageDates ??= import("virtual:page-dates")
    .then((mod) => mod.default)
    .catch(() => ({}));
  return pageDates;
};

/** The key a route has in the map: no trailing slash, except for "/". */
export const pageDateKey = (pathname: string) =>
  pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
