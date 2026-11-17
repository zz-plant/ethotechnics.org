import type { AnchorLink, PageWithPermalink, PublishedContent } from "./types";

/**
 * How a change to the framework is actually made. Each entry states one
 * fact a reader can check against the repository or the site.
 */
export type ChangeRule = {
  title: string;
  detail: string;
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
    howChangesAreMade: ChangeRule[];
    failureLog: FrameworkFailure[];
  };

// Until 2026-11-17 this file held an RFC lifecycle, RFC entries, a decision
// log with release labels and quarterly updates. The page was added on
// 2026-02-22 in one commit (624167ec) that already carried records dated
// from July 2025 to February 2026, and no RFC process, council or review
// window ever existed. FE-2026-06 below is the record of that. Do not add a
// process here that nobody runs.
export const governanceContent: GovernanceContent = {
  pageTitle: "Governance — Ethotechnics",
  pageDescription:
    "Who decides what Ethotechnics publishes, how a change is made, and the record of where the framework's own instruments failed.",
  permalink: "/institute/governance",
  published: "2026-02-22T00:00:00Z",
  updated: "2026-11-17T00:00:00Z",
  anchorLinks: [
    { href: "#how-changes-are-made", label: "How a change is made" },
    { href: "#failure-archive", label: "Failure archive" },
  ],
  howChangesAreMade: [
    {
      title: "One person decides",
      detail:
        "Kanav Jain writes the framework and decides every change, with AI coding agents working under the rules in the repository. “Ethotechnics Institute” is the name it publishes under. It has no council, no reviewers and no staff.",
    },
    {
      title: "A change is a commit",
      detail:
        "Every change to a page, a clause or a score is a commit in the public repository, with its date and what changed. Each standard lists its own versions on its page.",
    },
    {
      title: "An objection gets an answer",
      detail:
        "Every clause links to an objection form. Each objection gets a public answer within 30 days. An upheld objection ends in a revised clause or a published reason for keeping it.",
    },
  ],
  failureLog: [
    {
      id: "FE-2026-06",
      title: "This page described a governance process that did not exist",
      detected: "2026-11-17",
      detail:
        "This page was added on February 22, 2026, in one commit. It arrived with three RFCs, three decisions and three quarterly updates dated between July 2025 and February 2026, all before the day it was written. It described a four-stage RFC process with review windows and linked releases, and its records named a steward council, reviewer roles and community office hours. None of these existed. Cleanups on September 18, October 1 and November 10, 2026 recorded the lapsed review windows (FE-2026-01), the missed quarterly cadence (FE-2026-02), the invented reviewers, and the records dated before the repository's first commit (FE-2026-05), and removed some of them. The RFC process, two RFCs, a decision log with release labels and a Q4 2025 update stayed on the page.",
      revision:
        "The RFC lifecycle, the RFCs, the decision log and the governance updates are removed, along with the three earlier entries about them, which this one replaces. The page now says how a change is actually made. Every earlier version of this page is in the repository's history.",
    },
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
      title: "The casebook scored safeguards but not learning",
      detected: "2026-09-18",
      detail:
        "The casebook scored five public failures against the six safeguards, which are present-tense properties of a deployment, and left unstated whether each failure trajectory ended in case resolution or in institutional revision. A framework about correction was missing its own historical category, and its central case — Robodebt — is one where the exceptions were all handled and nothing changed.",
      revision:
        "Every case now carries a learning-outcome verdict, and the exception absorption versus exception learning distinction is formalized in the glossary, a theory essay, and the Corrective Learning eval suite.",
    },
  ],
};
