import type { Pattern } from "../content/library";
import { getGlossaryLabel } from "./glossary";

/**
 * Text the mechanism browser matches search queries against. It is stamped
 * on each card as `data-search`, so the e2e suite derives its expected
 * counts from the same function rather than hard-coding them.
 */
export const buildPatternSearchText = (pattern: Pattern): string =>
  [
    pattern.title,
    pattern.summary,
    pattern.cues.join(" "),
    pattern.steps.join(" "),
    pattern.artifacts
      .map((artifact) => `${artifact.name} ${artifact.purpose}`)
      .join(" "),
    pattern.glossaryRefs.map((slug) => getGlossaryLabel(slug)).join(" "),
    pattern.example.description,
  ]
    .join(" ")
    .toLowerCase();
