export type JsonAlternateInput = {
  href: string;
  title?: string;
};

export type SeoAlternateLink = {
  rel: "alternate";
  type: "application/json";
  href: string;
  title?: string;
};

const normalizeDateTime = (value?: string): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const buildJsonAlternateLinks = (
  jsonAlternates?: JsonAlternateInput[],
): SeoAlternateLink[] =>
  jsonAlternates?.map((link) => ({
    rel: "alternate",
    type: "application/json",
    href: link.href,
    title: link.title,
  })) ?? [];

const buildLanguageAlternates = (
  canonical: string,
): Array<{ hrefLang: "en"; href: string }> => [
  { hrefLang: "en", href: canonical },
];

const stringifyJsonLd = (
  graph: ReadonlyArray<Record<string, unknown>>,
): string => JSON.stringify(graph);

export {
  buildJsonAlternateLinks,
  buildLanguageAlternates,
  normalizeDateTime,
  stringifyJsonLd,
};
