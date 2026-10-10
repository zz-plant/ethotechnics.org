import data from "../data/glossary-terms.json" with { type: "json" };
import type { PageWithPermalink, PublicationMetadata } from "./types";
import { glossaryContentData } from "./generated/glossary.generated";
import { z } from "zod";

import { stripHtml } from "../utils/glossary-helpers";

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  appliesTo: string[];
  /**
   * `false` keeps the term out of the in-page highlighter. Set it on words
   * that already carry an everyday, legal, or engineering sense, where a
   * tooltip would hand them the site's narrower one: "settlement" in the
   * DSA's "dispute settlement body", "rollback" in an explainer for
   * engineers. The entry page, search, and links are unaffected.
   */
  autoHighlight?: false;
};

/**
 * A term with a glossary entry takes its definition from that entry, so it
 * carries none here. Only a term with no entry defines itself.
 */
type GlossaryTermSeed = Omit<GlossaryTerm, "definition"> & {
  definition?: string;
};

export type GlossaryTerritory = {
  id: string;
  label: string;
  tooltip: string;
};

export type GlossaryResource = {
  label: string;
  href: string;
  type: string;
};

export type GlossaryDomain =
  | "temporal"
  | "visibility"
  | "agency"
  | "burden"
  | "patterns"
  | "measurable"
  | "structural"
  | "diagnostic";

export type GlossaryScale = "individual" | "organizational" | "systemic";

export type GlossaryPhase = "design" | "deployment" | "audit" | "repair";

export type GlossaryMeasurability =
  "qualitative" | "semi_quantitative" | "fully_measurable";

export type GlossaryMaturity =
  "core_concept" | "active_research" | "speculative";

export type GlossaryMinimumEvidence = {
  artifact?: string;
  behavior?: string;
  metric?: string;
  definition?: string;
  unit?: string;
  dataSource?: string;
  calculation?: string;
  threshold?: string;
};

export type GlossaryEntry = {
  id: string;
  title: string;
  status: string | null;
  classes?: string[];
  bodyHtml: string;
  domains?: GlossaryDomain[];
  scale?: GlossaryScale | null;
  phase?: GlossaryPhase[];
  measurability?: GlossaryMeasurability | null;
  maturity?: GlossaryMaturity | null;
  clusters?: string[];
  legacyTerritory?: string;
  termUpdated?: string;
  termVersion?: string;
  termChangelog?: string;
  scope?: string;
  adjacentTerms?: string[];
  presenceChecks?: string[];
  missingExpectations?: string[];
  operationalTests?: string[];
  commonCounterfeits?: string[];
  minimumEvidence?: GlossaryMinimumEvidence;
  genealogy?: string;
  references?: GlossaryResource[];
  examples?: string[];
  tags?: string[];
  resources?: GlossaryResource[];
  relatedPatterns?: string[];
};

export type GlossaryCategory = {
  id: string;
  heading: string;
  descriptionHtml: string;
  comingSoon: boolean;
  entries: GlossaryEntry[];
};

export type GlossaryContent = PageWithPermalink & {
  publication: PublicationMetadata;
  territoryMap: GlossaryTerritory[];
  categories: GlossaryCategory[];
  starterTerms: { id: string; label: string; description: string }[];
  categoryHighlights: { id: string; label: string; description: string }[];
};

export const glossaryContent: GlossaryContent =
  glossaryContentData as GlossaryContent;

const termSeedSchema = z.object({
  slug: z.string(),
  term: z.string(),
  // A seed with a glossary entry takes its definition from that entry, so it
  // carries none here. Only a term with no entry defines itself.
  definition: z.string().optional(),
  appliesTo: z.array(z.string()),
  // `false` keeps the term out of the in-page highlighter (see GlossaryTerm).
  autoHighlight: z.literal(false).optional(),
});

export const glossaryTermSeeds: GlossaryTermSeed[] = termSeedSchema
  .array()
  .parse(data);

/**
 * Tooltips used to carry their own definitions, written apart from the
 * entries, and about 150 of 367 had drifted from the entry they link to: the
 * Contestability tooltip defined it as forcing "a decision to become a
 * contestable object" while the entry said a person can challenge the
 * decision and win. A tooltip now shows its entry's opening sentence, so the
 * two cannot disagree, and a seed with an entry carries no definition of its
 * own to drift. Only the terms with no entry define themselves in the data
 * file.
 */
const LABEL_SENTENCE = /^(normative|informative) definition\.$/i;
// A sentence can end inside a closing quote or bracket: "mislabeled as
// “resilience.” Ethotechnic practice…". Without the closing marks the first
// sentence failed to match and the tooltip opened on a stray ” mid-entry.
const SENTENCE = /[^.!?]+[.!?]+["”’)\]]*(?=\s|$)/g;
const openingSentence = (html: string): string => {
  const sentences = (stripHtml(html).match(SENTENCE) ?? [])
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !LABEL_SENTENCE.test(sentence));
  let lead = "";
  for (const sentence of sentences) {
    lead = lead ? `${lead} ${sentence}` : sentence;
    if (lead.length >= 60) break;
  }
  return lead;
};
const entryLeadById = new Map(
  glossaryContent.categories
    .flatMap((category) => category.entries)
    .map((entry) => [entry.id, openingSentence(entry.bodyHtml)]),
);

export const glossaryTerms: GlossaryTerm[] = glossaryTermSeeds.map((term) => ({
  ...term,
  definition: entryLeadById.get(term.slug) || term.definition || "",
}));
