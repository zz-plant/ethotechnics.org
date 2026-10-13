import type { GlossaryTerm } from "./glossary";
import { glossaryContent, glossaryTerms } from "./glossary";
import { libraryContentData } from "./generated/library.generated";
import type {
  PageWithPermalink,
  PublicationMetadata,
  PublishedContent,
} from "./types";

export type PatternFilter = {
  slug:
    | "capability"
    | "authority"
    | "evidence"
    | "dependency"
    | "standing"
    | "correction";
  label: string;
  description: string;
};

/** A stage of the method's seven-stage chain; see `methodContent.chain`. */
export type ChainStageId =
  | "evidence"
  | "authority"
  | "decision"
  | "consequence"
  | "challenge"
  | "reconsideration"
  | "correction";

export type Pattern = {
  slug: string;
  /** Catalog id, "MEC-05": cited in prose, shown beside the title. */
  code: string;
  /** Catalog name without the id, "Kill switch for runaway automation". */
  title: string;
  /**
   * The page's <title> and heading when search uses other words than the
   * catalog name.
   */
  searchTitle?: string;
  /** Page meta description, where the summary runs past 160 characters. */
  metaDescription?: string;
  summary: string;
  filters: PatternFilter["slug"][];
  /** The chain stage or stages the mechanism acts on. */
  chainStages: ChainStageId[];
  /** One sentence on why it acts there, shown under the chain figure. */
  chainNote: string;
  glossaryRefs: string[];
  cues: string[];
  diagnostics: string[];
  steps: string[];
  policyRequirement: string;
  productRequirement: string;
  auditEvidenceChecklist: string;
  postmortemTrigger: string;
  artifacts: { name: string; purpose: string }[];
  example: { title: string; description: string };
  antiPatterns?: {
    title: string;
    failure: string;
    counterfactual: string;
    warning: string;
  }[];
};

export type LibraryContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    glossary: { terms: GlossaryTerm[]; permalink: string };
    patterns: { filters: PatternFilter[]; entries: Pattern[] };
    quickStart: string[];
    recommended: {
      title: string;
      description: string;
      items: {
        code?: string;
        title: string;
        description: string;
        href: string;
      }[];
    };
  };

type LibraryContentWithoutGlossary = Omit<LibraryContent, "glossary">;

const baseLibraryContent = libraryContentData as LibraryContentWithoutGlossary;

export const libraryContent: LibraryContent = {
  ...baseLibraryContent,
  glossary: {
    terms: glossaryTerms,
    permalink: glossaryContent.permalink,
  },
};
