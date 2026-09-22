import type { AnchorLink, PageWithPermalink, PublishedContent } from "./types";

export type RFCLifecycleStage = {
  stage: string;
  detail: string;
};

export type RFCEntry = {
  id: string;
  title: string;
  status: "proposal" | "review" | "decision" | "released";
  openedOn: string;
  reviewWindow: string;
  closedOn?: string;
  owner: string;
  reviewerRoles: string[];
  summary: string;
};

export type DecisionRecord = {
  id: string;
  title: string;
  outcome: string;
  rationale: string;
  date: string;
  owner: string;
  releaseVersion: string;
  releaseHref: string;
};

export type QuarterlyUpdate = {
  date: string;
  title: string;
  summary: string;
};

/**
 * The framework's own failure archive. Every entry records where this
 * framework's instruments failed, in the form it asks of the institutions it
 * audits: what failed, when it was detected, and what changed because of it.
 * A discipline that asks institutions to be changed by evidence of their own
 * inadequacy keeps the same record of itself.
 */
export type FrameworkFailure = {
  id: string;
  title: string;
  detected: string;
  detail: string;
  revision: string;
};

export type GovernanceContent = PageWithPermalink &
  PublishedContent & {
    pageTitle: string;
    pageDescription: string;
    anchorLinks: AnchorLink[];
    lifecycle: RFCLifecycleStage[];
    rfcs: RFCEntry[];
    decisions: DecisionRecord[];
    failureLog: FrameworkFailure[];
    quarterlyUpdates: QuarterlyUpdate[];
  };

export const governanceContent: GovernanceContent = {
  pageTitle: "Governance process — Ethotechnics",
  pageDescription:
    "Public governance receipts for RFCs, decision records, releases, the framework's own failure archive, and dated accountability updates.",
  permalink: "/institute/governance",
  published: "2026-02-01T00:00:00Z",
  updated: "2026-09-18T00:00:00Z",
  anchorLinks: [
    { href: "#lifecycle", label: "RFC lifecycle" },
    { href: "#open-rfcs", label: "Current RFCs" },
    { href: "#decision-log", label: "Decision log" },
    { href: "#failure-archive", label: "Failure archive" },
    { href: "#governance-updates", label: "Governance updates" },
  ],
  lifecycle: [
    {
      stage: "Proposal",
      detail:
        "An owner opens an RFC with scope, affected users, and draft safeguards.",
    },
    {
      stage: "Review window",
      detail:
        "Reviewer roles assess harms, rollback plans, and implementation fit during a dated comment window.",
    },
    {
      stage: "Decision",
      detail:
        "A named owner records the outcome and rationale in the decision log and assigns an owner to each follow-up.",
    },
    {
      stage: "Release",
      detail:
        "Accepted changes ship with a linked release/version so downstream teams can verify what changed and when.",
    },
  ],
  rfcs: [
    {
      id: "RFC-2026-02",
      title: "Evidence-pack compatibility baseline",
      status: "released",
      openedOn: "2026-02-03",
      reviewWindow: "2026-02-03 → 2026-02-24",
      closedOn: "2026-09-18",
      owner: "Institute steward council",
      reviewerRoles: [
        "Studio facilitator",
        "Operations lead",
        "Documentation steward",
      ],
      summary:
        "Defines a minimum compatibility contract for evidence packs so diagnostics and standards pages can share structured receipts.",
    },
    {
      id: "RFC-2026-01",
      title: "Recourse escalation SLA for diagnostics",
      status: "released",
      openedOn: "2026-01-28",
      reviewWindow: "2026-01-28 → 2026-02-20",
      closedOn: "2026-09-18",
      owner: "Program operations",
      reviewerRoles: ["Risk steward", "Community reviewer"],
      summary:
        "Sets response-time targets and ownership for contested diagnostic outcomes.",
    },
    {
      id: "RFC-2025-11",
      title: "Quarterly governance digest format",
      status: "released",
      openedOn: "2025-11-04",
      reviewWindow: "2025-11-04 → 2025-11-18",
      closedOn: "2025-11-20",
      owner: "Publishing pipeline",
      reviewerRoles: ["Documentation steward", "Institute lead"],
      summary:
        "Standardized the public digest structure so each quarter ships dated deltas, decisions, and release references.",
    },
  ],
  decisions: [
    {
      id: "DEC-2026-09-02",
      title: "Resolve lapsed RFC-2026-01 (Recourse escalation SLA for diagnostics)",
      outcome: "Superseded",
      rationale:
        "The review window lapsed without a logged decision. The substance was carried by the diagnostics anti-weaponization constraints (AW-01 to AW-04), which set response-time and ownership targets for contested outcomes. Closed so the open-RFC list stops carrying a decision nobody logged.",
      date: "2026-09-18",
      owner: "Program operations",
      releaseVersion: "diagnostics-v2.0.0",
      releaseHref: "/anti-weaponization",
    },
    {
      id: "DEC-2026-09-01",
      title: "Adopt RFC-2026-02 (Evidence-pack compatibility baseline)",
      outcome: "Accepted",
      rationale:
        "The review window lapsed without a logged decision. The baseline is adopted as released because the evidence packs that shipped after the proposal (STD-01, STD-02, STD-06, STD-08, STD-09) and the evidence-pack readiness checker already embody it. The lapse is recorded rather than hidden.",
      date: "2026-09-18",
      owner: "Institute steward council",
      releaseVersion: "evidence-packs-v1.0.0",
      releaseHref: "/evidence-packs",
    },
    {
      id: "DEC-2026-02-01",
      title: "Adopt decision-owner field for all governance records",
      outcome: "Accepted",
      rationale:
        "Ownership was inconsistent across forum outputs. Mandatory owner attribution reduces ambiguity in follow-up.",
      date: "2026-02-14",
      owner: "Institute steward council",
      releaseVersion: "governance-v1.4.0",
      releaseHref: "/mechanisms",
    },
    {
      id: "DEC-2026-01-03",
      title: "Extend review windows to include community office hours",
      outcome: "Accepted with amendment",
      rationale:
        "Asynchronous review missed context from implementation teams; office-hours notes now count as formal review input.",
      date: "2026-01-22",
      owner: "Program operations",
      releaseVersion: "governance-v1.3.2",
      releaseHref: "/participate",
    },
    {
      id: "DEC-2025-12-02",
      title: "Archive inactive RFC threads after release",
      outcome: "Accepted",
      rationale:
        "Open threads without closure dates made audits hard. Archiving after release keeps status visible and history navigable.",
      date: "2025-12-19",
      owner: "Documentation steward",
      releaseVersion: "governance-v1.2.0",
      releaseHref: "/institute/governance",
    },
  ],
  failureLog: [
    {
      id: "FE-2026-04",
      title: "Evidence guidance privileged formal documentation",
      detected: "2026-09-18",
      detail:
        "The framework's evidence artifacts — evidence packs, model cards, safety cases — described the intended process and gave no standing to the artifacts that record the second process growing around it: workaround logs, override records, grievance files, exception codes, and shadow spreadsheets. An audit built this way grades an institution on its own description.",
      revision:
        "Institutional debris is now defined as an evidence class in the method's Evidence stage, with an explainer, the workaround presumption, and a Corrective Learning eval that reads it.",
    },
    {
      id: "FE-2026-03",
      title: "The casebook scored variables but not learning",
      detected: "2026-09-18",
      detail:
        "The casebook scored five public failures against the six state variables, which are present-tense properties of a deployment, and left unstated whether each failure trajectory ended in case resolution or in institutional revision. A framework about correction was missing its own historical category, and its central case — Robodebt — is one where the exceptions were all handled and nothing changed.",
      revision:
        "Every case now carries a learning-outcome verdict, and the exception absorption versus exception learning distinction is formalized in the glossary, a theory essay, and the Corrective Learning eval suite.",
    },
    {
      id: "FE-2026-02",
      title: "A stated cadence was not kept, and the silence was unrecorded",
      detected: "2026-09-18",
      detail:
        "No governance update was published between January and September 2026 while the page carried quarterly entries. The gap was visible in the data and readable by nobody, which is the same failure Law II names in a grant: silence is not renewal, but here it was also not recorded.",
      revision:
        "The Q3 2026 update records the pause, and the page now reports the date of the most recent update so the gap is the reader's to judge rather than the page's to imply away.",
    },
    {
      id: "FE-2026-01",
      title: "Review windows lapsed without logged decisions",
      detected: "2026-09-18",
      detail:
        "RFC-2026-01 and RFC-2026-02 sat listed under active review for seven months after their stated windows closed. The lapse was in the data; nothing on the page computed it, so the reader had to trust a status field the process had stopped honoring.",
      revision:
        "The page now reads the review-window clock and reports a lapse as a governance failure. Both RFCs were closed with decisions on the evidence available, and the lapse is recorded in the decision log rather than hidden.",
    },
  ],
  quarterlyUpdates: [
    {
      date: "2026-09-18",
      title: "Q3 2026 governance update",
      summary:
        "Publishing paused between January and September. This update records the pause, closes RFC-2026-01 and RFC-2026-02 with decisions on the evidence available, and re-binds the cadence: a stated review window that passes without a decision is now reported as a governance failure rather than left to the reader.",
    },
    {
      date: "2026-01-15",
      title: "Q4 2025 governance update",
      summary:
        "Published 3 decision records, closed 2 RFCs, and linked all accepted decisions to release versions.",
    },
    {
      date: "2025-10-10",
      title: "Q3 2025 governance update",
      summary:
        "Introduced reviewer-role tracking in RFC metadata and expanded open forum participation hours.",
    },
    {
      date: "2025-07-12",
      title: "Q2 2025 governance update",
      summary:
        "Established the baseline RFC lifecycle and started publishing dated decision records publicly.",
    },
  ],
};
