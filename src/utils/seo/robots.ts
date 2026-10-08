export type SeoRobotsProps = {
  noindex: boolean;
  nofollow: boolean;
  robotsExtras?: string;
};

const INDEXING_TOKENS = new Set(["index", "noindex", "follow", "nofollow"]);

/**
 * astro-seo always writes its own robots meta tag, "index, follow" unless told
 * otherwise. A page that passed its directives as a second tag shipped both:
 * /search said "index, follow" and "noindex, nofollow" at once. Translating
 * the directive string into astro-seo's props leaves one tag per page.
 */
export const toSeoRobotsProps = (robots: string): SeoRobotsProps => {
  const tokens = robots
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const extras = tokens.filter((token) => !INDEXING_TOKENS.has(token));

  return {
    noindex: tokens.includes("noindex"),
    nofollow: tokens.includes("nofollow"),
    ...(extras.length > 0 ? { robotsExtras: extras.join(", ") } : {}),
  };
};
