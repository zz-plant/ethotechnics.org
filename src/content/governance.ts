import type { AnchorLink, PageWithPermalink, PanelCopy, PublishedContent } from "./types";

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

export type GovernanceContent = PageWithPermalink &
  PublishedContent & {
    pageTitle: string;
    pageDescription: string;
    anchorLinks: AnchorLink[];
    panelCopy: PanelCopy;
    lifecycle: RFCLifecycleStage[];
    rfcs: RFCEntry[];
    decisions: DecisionRecord[];
    quarterlyUpdates: QuarterlyUpdate[];
  };

export const governanceContent: GovernanceContent = {
  pageTitle: "Governance process — Ethotechnics",
  pageDescription:
    "Public governance receipts for RFCs, decision records, releases, and quarterly accountability updates.",
  permalink: "/governance",
  published: "2026-02-01T00:00:00Z",
  updated: "2026-02-15T00:00:00Z",
  anchorLinks: [
    { href: "#lifecycle", label: "RFC lifecycle" },
    { href: "#open-rfcs", label: "Current RFCs" },
    { href: "#decision-log", label: "Decision log" },
    { href: "#quarterly-updates", label: "Quarterly updates" },
  ],
  panelCopy: {
    eyebrow: "Governance receipts",
    title: "Every governance claim links to an artifact.",
    description:
      "This page exposes active RFCs, decision owners, and release links so contributors can audit process, not just summaries.",
  },
  lifecycle: [
    {
      stage: "Proposal",
      detail: "An owner opens an RFC with scope, affected users, and draft safeguards.",
    },
    {
      stage: "Review window",
      detail:
        "Reviewer roles assess harms, rollback plans, and implementation fit during a dated comment window.",
    },
    {
      stage: "Decision",
      detail:
        "A named owner records outcome and rationale in the decision log with clear follow-up responsibilities.",
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
      status: "review",
      openedOn: "2026-02-03",
      reviewWindow: "2026-02-03 → 2026-02-24",
      owner: "Institute steward council",
      reviewerRoles: ["Studio facilitator", "Operations lead", "Documentation steward"],
      summary:
        "Defines a minimum compatibility contract for evidence packs so diagnostics and standards pages can share structured receipts.",
    },
    {
      id: "RFC-2026-01",
      title: "Recourse escalation SLA for diagnostics",
      status: "proposal",
      openedOn: "2026-01-28",
      reviewWindow: "2026-01-28 → 2026-02-20",
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
      id: "DEC-2026-02-01",
      title: "Adopt decision-owner field for all governance records",
      outcome: "Accepted",
      rationale:
        "Ownership was inconsistent across forum outputs. Mandatory owner attribution reduces ambiguity in follow-up.",
      date: "2026-02-14",
      owner: "Institute steward council",
      releaseVersion: "governance-v1.4.0",
      releaseHref: "/library",
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
      releaseHref: "/governance",
    },
  ],
  quarterlyUpdates: [
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
