import data from "../data/casebook.json" with { type: "json" };
import { standardClauses, standardsContent } from "./standards";
import type { PageWithPermalink, PublishedContent } from "./types";
import { z } from "zod";

/**
 * The casebook: public failures of delegated decision systems, each scored
 * against the six state variables the Laws track and pinned to the clauses
 * that would have caught it.
 *
 * Every case here was established by a court, a statutory inquiry, or a
 * regulator, and the findings quoted are theirs. The scores are ours: they
 * say which variable drifted, not who was at fault. A case where most
 * variables held is as useful as one where none did, because a standard
 * that finds every deployment guilty discriminates nothing.
 */

export type StateVariableId =
  | "capability"
  | "authority"
  | "evidence"
  | "dependency"
  | "standing"
  | "correction";

export type LawId =
  | "I"
  | "II"
  | "III"
  | "IV"
  | "V"
  | "VI"
  | "VII"
  | "VIII"
  | "IX"
  | "X"
  | "XI"
  | "XII";

/**
 * held: the variable was explicit and stayed coupled to the others.
 * drifted: it existed but detached from the variable it should track.
 * failed: it was absent, or its absence is what the inquiry found.
 */
export type Verdict = "held" | "drifted" | "failed";

export type StateVariable = {
  id: StateVariableId;
  label: string;
  question: string;
};

export type ClauseRef = {
  /** Standard id as the clause register spells it, e.g. "STD-02". */
  standard: string;
  /** Clause display id, e.g. "§1.2". */
  clause: string;
};

export type Finding = {
  variable: StateVariableId;
  verdict: Verdict;
  /** What the record shows about this variable, in one paragraph. */
  finding: string;
  /** The clauses whose obligation the finding falls under. */
  clauses: ClauseRef[];
  laws: LawId[];
};

export type Source = {
  label: string;
  /** Omitted where no stable public URL exists; the citation stands alone. */
  href?: string;
  /** Who produced it. Primary records first; an NGO report only where it
   * documents what the primary record established. */
  kind: "court" | "inquiry" | "regulator" | "parliament" | "operator" | "ngo";
  date: string;
};

export type TimelineEvent = {
  when: string;
  what: string;
  turn?: boolean;
  /**
   * The event is part of the record against the scheme: a warning, a finding,
   * or a ruling. The home page's two-ledger panel counts these as the reader
   * passes them.
   */
  evidence?: boolean;
  /** The event at which the system was actually halted. */
  halt?: boolean;
  /** A party speaking in the record. Drawn only from `what` and the narrative. */
  voice?: TimelineVoice;
};

/**
 * Someone speaking in a timeline event: an adviser, regulator, tribunal, or
 * court on the record's side, or the operator on the institution's side. The
 * home page draws these as speech, so each is restated from the event text,
 * never invented. `said` is paraphrase unless `verbatim` is set.
 */
export type TimelineVoice = {
  /** Who spoke, as the case's narrative names them. */
  speaker: string;
  side: "record" | "institution";
  said: string;
  /** True only when `said` is the speaker's own words. */
  verbatim?: boolean;
  /**
   * Whether the operator answered it by changing the scheme. Omitted where
   * the question does not arise: the operator's own words, or a finding made
   * after the halt.
   */
  answered?: boolean;
  /** The rest of the event, after the speech. Drawn from `what`. */
  after?: string;
};

/**
 * The dated ends of `timeToHalt`, at the precision the case's own record
 * gives: "YYYY", "YYYY-MM", or "YYYY-MM-DD". A year-only date is read as
 * 1 July and a month-only date as the 15th, the middle of the period named.
 */
export type HaltSpan = {
  /** First harm. */
  from: string;
  /** The halt, or the change the prose names. */
  to: string;
};

export type Case = PublishedContent & {
  slug: string;
  title: string;
  /** The system, in one line: what it decided and for whom. */
  system: string;
  jurisdiction: string;
  /** The years the system ran with the defect, as people would say them. */
  period: string;
  /** How many people the record says were affected. */
  scale: string;
  /** From first harm to the delegation being halted or reversed. */
  timeToHalt: string;
  /** The dates `timeToHalt` is measured between. */
  haltSpan: HaltSpan;
  /**
   * `timeToHalt` in days, for drawing to scale: `haltSpanDays(haltSpan)`,
   * stored so the figure needs no date arithmetic. The prose label stays the
   * displayed text; this number only sets a bar's length.
   */
  timeToHaltDays: number;
  /** Who made the halt happen. Almost never the operator. */
  haltedBy: string;
  /**
   * Who absorbed the system's errors while it ran, and how: the error-bearing
   * parties, named from the narrative, scale, and findings, never added to
   * them. Also never the operator. Where the record says who kept the
   * benefit, that goes here too, because the two sit on different ledgers.
   */
  errorsCarriedBy: string;
  summary: string;
  /** Page meta description: the institution, the date, the number, in ~160 characters. */
  metaDescription?: string;
  /** What happened, from the primary record, in a few paragraphs. */
  narrative: string[];
  /**
   * The case as dated events, drawn only from the narrative, findings,
   * period, halt, and sources above. `turn` marks the one event the narrative
   * treats as the turning point, at most one per case.
   */
  timeline?: TimelineEvent[];
  findings: Finding[];
  /**
   * Where the failure trajectory ended: in case resolution (each exception
   * handled, the delegation unchanged) or in institutional revision (the
   * rule, category, workflow, or authority that produced the errors changed).
   * The distinction is exception absorption versus exception learning.
   */
  learningOutcome: {
    verdict: LearningVerdict;
    finding: string;
  };
  /** The one thing the standards would have required that was absent. */
  theMissingRecord: string;
  diagnosticStudy?: DiagnosticStudy;
  remediation?: CaseRemediation;
  sources: Source[];
};

export type CaseRemediation = {
  diagnostic: {
    name: string;
    href: string;
    purpose: string;
  };
  standard: {
    id: string;
    name: string;
    href: string;
    requirement: string;
  };
  theory: {
    title: string;
    href: string;
    question: string;
  };
};

export type DiagnosticStudy = {
  title: string;
  url: string;
  source: string;
  summary: string;
};

export type LearningVerdict = "learned" | "partial" | "absorbed";

/**
 * How the learning verdict reads on the page. The ids stay as they are for the
 * data and the API; a reader sees whether the institution changed the process
 * that produced the errors, or corrected the errors and left the process as was.
 */
export const learningVerdictLabels: Record<LearningVerdict, string> = {
  learned: "Changed the rules",
  partial: "Partly changed",
  absorbed: "Process unchanged",
};

export type CasebookContent = PageWithPermalink & {
  eyebrow: string;
  title: string;
  description: string;
};

const stateVariableSchema = z.object({
  id: z.enum([
    "capability",
    "authority",
    "evidence",
    "dependency",
    "standing",
    "correction",
  ]),
  label: z.string(),
  question: z.string(),
});

const clauseRefSchema = z.object({
  standard: z.string(),
  clause: z.string(),
});

const findingSchema = z.object({
  variable: z.enum([
    "capability",
    "authority",
    "evidence",
    "dependency",
    "standing",
    "correction",
  ]),
  verdict: z.enum(["held", "drifted", "failed"]),
  finding: z.string(),
  clauses: z.array(clauseRefSchema),
  laws: z.array(
    z.enum([
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ]),
  ),
});

const sourceSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  kind: z.enum([
    "court",
    "inquiry",
    "regulator",
    "parliament",
    "operator",
    "ngo",
  ]),
  date: z.string(),
});

const timelineVoiceSchema = z.object({
  speaker: z.string(),
  side: z.enum(["record", "institution"]),
  said: z.string(),
  verbatim: z.boolean().optional(),
  answered: z.boolean().optional(),
  after: z.string().optional(),
});

const timelineEventSchema = z.object({
  when: z.string(),
  what: z.string(),
  turn: z.boolean().optional(),
  evidence: z.boolean().optional(),
  halt: z.boolean().optional(),
  voice: timelineVoiceSchema.optional(),
});

const caseSchema = z.object({
  published: z.string(),
  updated: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  system: z.string(),
  jurisdiction: z.string(),
  period: z.string(),
  scale: z.string(),
  timeToHalt: z.string(),
  haltSpan: z.object({ from: z.string(), to: z.string() }),
  timeToHaltDays: z.number(),
  haltedBy: z.string(),
  errorsCarriedBy: z.string(),
  summary: z.string(),
  metaDescription: z.string().optional(),
  narrative: z.array(z.string()),
  timeline: z.array(timelineEventSchema).optional(),
  findings: z.array(findingSchema),
  learningOutcome: z.object({
    verdict: z.enum(["learned", "partial", "absorbed"]),
    finding: z.string(),
  }),
  theMissingRecord: z.string(),
  diagnosticStudy: z
    .object({
      title: z.string(),
      url: z.string(),
      source: z.string(),
      summary: z.string(),
    })
    .optional(),
  remediation: z
    .object({
      diagnostic: z.object({
        name: z.string(),
        href: z.string(),
        purpose: z.string(),
      }),
      standard: z.object({
        id: z.string(),
        name: z.string(),
        href: z.string(),
        requirement: z.string(),
      }),
      theory: z.object({
        title: z.string(),
        href: z.string(),
        question: z.string(),
      }),
    })
    .optional(),
  sources: z.array(sourceSchema),
});

const casebookContentSchema = z.object({
  pageTitle: z.string(),
  pageDescription: z.string(),
  permalink: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
});

const dataSchema = z.object({
  stateVariables: z.array(stateVariableSchema),
  learningVerdictLabels: z.record(
    z.enum(["learned", "partial", "absorbed"]),
    z.string(),
  ),
  casebookContent: casebookContentSchema,
  cases: z.array(caseSchema),
});

// haltSpan notes carried from the hand-written literal:
// - robodebt: launch month (Jul 2016, timeline) to the Federal Court consent
//   orders (27 Nov 2019, sources). The launch day is not in the record.
// - toeslagenaffaire: approximate — the period says "roughly 2012", so the
//   start is a year only. The end is the Council of State's reversal
//   (23 Oct 2019, sources), the first halt `haltedBy` names.
// - post-office-horizon: approximate — the rollout is dated to 1999 only. The
//   end is the Horizon Issues judgment in Bates (16 Dec 2019, sources), the
//   first step in `haltedBy`; the Court of Appeal and the 2024 Act came later.
// - ofqual-2020-grades: results issued 13 Aug 2020; teachers' grades restored
//   17 Aug 2020.
// - apple-card: approximate, and a lower bound — the first reports are dated
//   Nov 2019 only, and the policy change is dated 2021 only. The end used is
//   the regulator's report (23 Mar 2021, sources), which the change followed,
//   so the bar runs about sixteen months against the prose's seventeen.
const parsed = dataSchema.parse(data);

export const stateVariables: StateVariable[] = parsed.stateVariables;

export const casebookContent: CasebookContent = parsed.casebookContent;

export const cases: Case[] = parsed.cases;

/** Days between a halt span's two dates, reading partial dates at their midpoint. */
export function haltSpanDays(span: HaltSpan): number {
  return Math.round(
    (partialDateToUtc(span.to) - partialDateToUtc(span.from)) / 86_400_000,
  );
}

function partialDateToUtc(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  if (year === undefined || Number.isNaN(year)) {
    throw new Error(`Not a date: ${value}`);
  }
  if (month === undefined) return Date.UTC(year, 6, 1);
  return Date.UTC(year, month - 1, day ?? 15);
}

export const casesBySlug = new Map(cases.map((entry) => [entry.slug, entry]));

/** Verdict counts per variable across the casebook, for the matrix footer. */
export function verdictTally(
  entries: Case[] = cases,
): Record<StateVariableId, Record<Verdict, number>> {
  const tally = Object.fromEntries(
    stateVariables.map((variable) => [
      variable.id,
      { held: 0, drifted: 0, failed: 0 },
    ]),
  ) as Record<StateVariableId, Record<Verdict, number>>;
  for (const entry of entries) {
    for (const finding of entry.findings) {
      tally[finding.variable][finding.verdict] += 1;
    }
  }
  return tally;
}

/** STD-02 publishes articles; the other cited standards expose a clause register. */
export function clauseHref(ref: ClauseRef): string {
  const standard = standardsContent.standards.find(
    (entry) => entry.id === ref.standard,
  );
  return standard
    ? `/standards/${standard.slug}#${ref.standard === "STD-02" ? "articles" : "clause-register"}`
    : "/standards";
}

/** The clause's obligation text from the register, for a title attribute. */
export function clauseObligation(ref: ClauseRef): string | undefined {
  return standardClauses[ref.standard]?.find(
    (clause) => clause.displayId === ref.clause,
  )?.obligation;
}
