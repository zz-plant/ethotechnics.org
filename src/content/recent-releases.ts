import { diagnosticsContent } from "./diagnostics";
import { evalsContent } from "./evals";
import { glossaryContent } from "./glossary";
import { libraryContent } from "./library";
import { researchContent } from "./research";

/**
 * The homepage used to list three releases as literal strings. They were six
 * months old by the time anyone looked, and the newest of them announced a
 * diagnostic that had since been retired, so the first thing the homepage said
 * about the site was wrong in two ways at once.
 *
 * Each of these five areas already publishes a dated changelog that its own
 * page renders. The homepage reads the same entries, so a release appears here
 * because it happened, and nothing has to be remembered to keep it current.
 */
export type RecentRelease = {
  area: string;
  href: string;
  version: string;
  date: string;
  summary: string;
};

const AREAS = [
  { area: "Glossary", content: glossaryContent },
  { area: "Mechanisms", content: libraryContent },
  { area: "Diagnostics", content: diagnosticsContent },
  { area: "Evals", content: evalsContent },
  { area: "Research", content: researchContent },
];

export const recentReleases: RecentRelease[] = AREAS.flatMap(
  ({ area, content }) =>
    content.publication.changelog.map((entry) => ({
      area,
      href: content.permalink,
      // Some changelogs write "v1.2.0" and some "1.2.0"; side by side on one
      // list that reads as a mistake.
      version: entry.version.startsWith("v")
        ? entry.version
        : `v${entry.version}`,
      date: entry.date,
      summary: entry.summary,
    })),
)
  .sort((a, b) => b.date.localeCompare(a.date))
  // One per area: two releases of the same thing on the same day crowd out
  // everything else that shipped, and the panel is meant to show breadth.
  .filter(
    (release, index, all) =>
      all.findIndex((other) => other.area === release.area) === index,
  )
  .slice(0, 3);
