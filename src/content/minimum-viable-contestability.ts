import type { AnchorLink, PageWithPermalink, PanelCopy } from "./types";

type SummaryItem = {
  title: string;
  description: string;
};

type StandardSection = {
  id: string;
  title: string;
  summary: string;
  requirements: string[];
  evidence: string[];
};

type MinimumViableContestabilityContent = PageWithPermalink & {
  anchorLinks: AnchorLink[];
  panelCopy: PanelCopy & {
    link?: {
      label: string;
      href: string;
    };
  };
  summary: {
    title: string;
    description: string;
    items: SummaryItem[];
  };
  sections: StandardSection[];
  textOnly: {
    title: string;
    description: string;
  };
};

export const minimumViableContestabilityContent: MinimumViableContestabilityContent = {
  pageTitle: "Minimum viable contestability standard",
  pageDescription:
    "A short, non-jargony baseline for standing, reasons, records, timelines, remedies, and non-retaliation.",
  permalink: "/standards/minimum-viable-contestability",
  anchorLinks: [
    { href: "#summary", label: "One-screen summary" },
    { href: "#standard", label: "Baseline requirements" },
    { href: "#text", label: "Text-only version" },
  ],
  panelCopy: {
    eyebrow: "Contestability",
    title: "Minimum viable contestability",
    description:
      "Use this one-page standard to confirm that a system can be contested with real authority, timelines, and remedies.",
    link: {
      label: "Read STD-02",
      href: "/standards/std-02-contestability-recourse",
    },
  },
  summary: {
    title: "Minimum viable contestability standard",
    description:
      "Six baseline commitments that make contestability real and safe to use.",
    items: [
      {
        title: "Standing",
        description:
          "Anyone affected can trigger review without permission gates or retaliation.",
      },
      {
        title: "Reasons",
        description:
          "Decisions come with plain-language reasons and what could change the outcome.",
      },
      {
        title: "Records",
        description:
          "A decision record exists with timestamps, owners, and a shareable receipt.",
      },
      {
        title: "Timelines",
        description:
          "Published review clocks force a final response and escalation path.",
      },
      {
        title: "Remedies",
        description:
          "Reversal, correction, or compensation is reachable and trackable.",
      },
      {
        title: "Non-retaliation",
        description:
          "Contestants cannot be punished for using the review process.",
      },
    ],
  },
  sections: [
    {
      id: "standing",
      title: "Standing (who can contest)",
      summary: "People affected by a decision can open review without gatekeeping.",
      requirements: [
        "Allow the affected person to file a contest without extra approvals.",
        "Allow trusted representatives to file with consent.",
        "No paywalls, hidden prerequisites, or behavior tests before filing.",
      ],
      evidence: [
        "Visible contest entry point.",
        "Receipt confirming submission.",
        "Policy stating who can file and how.",
      ],
    },
    {
      id: "reasons",
      title: "Reasons (what happened and why)",
      summary: "People receive clear reasons they can act on and verify.",
      requirements: [
        "Provide a plain-language reason for the decision.",
        "Name the policy, data, or rule that drove the outcome.",
        "State what evidence or changes could reverse the decision.",
      ],
      evidence: [
        "Reason statement attached to the decision record.",
        "Accountable owner name and contact path.",
        "Versioned policy reference or rule ID.",
      ],
    },
    {
      id: "records",
      title: "Records (receipts and logs)",
      summary: "Every contestable decision leaves a traceable, shareable record.",
      requirements: [
        "Issue a decision record with a unique ID and timestamp.",
        "Keep the record accessible to the affected person.",
        "Log updates, evidence, and outcomes in a repair log.",
      ],
      evidence: [
        "Decision record or receipt with unique ID.",
        "Accessible record history for the affected person.",
        "Repair log or decision ledger entry.",
      ],
    },
    {
      id: "timelines",
      title: "Timelines (review clocks)",
      summary: "Review timelines are published and enforced with escalation rules.",
      requirements: [
        "Publish the review deadline and expected response time.",
        "Provide status updates and escalation triggers.",
        "If deadlines are missed, default to human review or pause.",
      ],
      evidence: [
        "Published SLA or review clock.",
        "Status tracker or timeline receipt.",
        "Escalation rule documentation.",
      ],
    },
    {
      id: "remedies",
      title: "Remedies (reversal and repair)",
      summary: "Reversal, correction, or compensation is real and reachable.",
      requirements: [
        "Offer a clear path to reversal or correction.",
        "List any compensation or remedy options.",
        "Show proof that remedy was delivered once complete.",
      ],
      evidence: [
        "Remedy options published with the decision record.",
        "Completion receipt for remedy actions.",
        "Audit trail showing reversal or correction.",
      ],
    },
    {
      id: "non-retaliation",
      title: "Non-retaliation (safe to contest)",
      summary: "People are protected from penalties for contesting decisions.",
      requirements: [
        "State a no-retaliation guarantee in the contest flow.",
        "Prohibit increased friction, fees, or access loss after filing.",
        "Track any adverse impacts and remediate immediately.",
      ],
      evidence: [
        "Non-retaliation policy statement.",
        "Monitoring note for adverse impacts.",
        "Contact path for reporting retaliation.",
      ],
    },
  ],
  textOnly: {
    title: "Text-only version",
    description:
      "Copy this version into briefs, audits, or escalation notes without formatting.",
  },
};
