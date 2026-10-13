/**
 * Document titles (`<title>`, og:title, twitter:title) follow one pattern:
 * "<page name> — Ethotechnics". The page name carries no other em dash; a
 * page type the name does not convey follows a colon ("Engineering: role
 * path", "OECD AI Principles: critique").
 *
 * Two kinds of page keep the title they pass: the home page, whose title
 * leads with the brand, and glossary entries, whose "— Ethotechnics glossary"
 * names the reference work the term is defined in. They opt out with
 * `titleSuffix={false}` on BaseLayout.
 */
export const DOCUMENT_TITLE_SUFFIX = " — Ethotechnics";

// Titles written before the convention end in either brand form.
const BRAND_SUFFIX_PATTERN = /\s+[—-]\s+Ethotechnics(?: Institute)?$/;

/** The title without a trailing " — Ethotechnics" or " — Ethotechnics Institute". */
export const stripBrandSuffix = (title: string): string =>
  title.replace(BRAND_SUFFIX_PATTERN, "").trim();

/**
 * The title as it appears in the browser tab and in shares. With `suffix`
 * off, the title is returned as passed.
 */
export const formatDocumentTitle = (
  title: string,
  { suffix = true }: { suffix?: boolean } = {},
): string => {
  if (!suffix) {
    return title;
  }

  // "STD-01 — The Temporal Bill of Rights" names the standard with a dash of
  // its own; the document title keeps one dash, before the brand.
  const pageName = stripBrandSuffix(title).replaceAll(" — ", ": ");
  return `${pageName}${DOCUMENT_TITLE_SUFFIX}`;
};
