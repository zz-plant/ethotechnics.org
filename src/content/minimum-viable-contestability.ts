import type { AnchorLink, PageWithPermalink } from "./types";

type StandardSection = {
  id: string;
  title: string;
  summary: string;
  requirements: string[];
  evidence: string[];
};

type MinimumViableContestabilityContent = PageWithPermalink & {
  anchorLinks: AnchorLink[];
  sections: StandardSection[];
};

export const minimumViableContestabilityContent: MinimumViableContestabilityContent =
  {
    pageTitle: "Minimum viable contestability standard",
    pageDescription:
      "Eight commitments for challenging an automated decision: standing, reasons, records, timelines, a named responder, defined effects, remedies, no retaliation.",
    permalink: "/standards/minimum-viable-contestability",
    anchorLinks: [
      { href: "#standing", label: "Standing" },
      { href: "#reasons", label: "Reasons" },
      { href: "#records", label: "Records" },
      { href: "#timelines", label: "Timelines" },
      { href: "#responder", label: "Responder and standard" },
      { href: "#effect", label: "Effect" },
      { href: "#remedies", label: "Remedies" },
      { href: "#non-retaliation", label: "Non-retaliation" },
    ],
    sections: [
      {
        id: "standing",
        title: "Standing (who can challenge)",
        summary:
          "People affected by a decision can open review without gatekeeping.",
        requirements: [
          "Allow the person the decision is about to file a challenge without extra approvals.",
          "Allow trusted representatives to file with consent.",
          "Impose no paywalls, hidden prerequisites, or behavior tests before filing.",
        ],
        evidence: [
          "Visible challenge entry point.",
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
        summary:
          "Every decision that can be challenged leaves a traceable, shareable record.",
        requirements: [
          "Issue a decision record with a unique ID and timestamp.",
          "Keep the record accessible to the person the decision is about.",
          "Log updates, evidence, and outcomes in a repair log.",
        ],
        evidence: [
          "Decision record or receipt with unique ID.",
          "Accessible record history for the person the decision is about.",
          "Repair log or decision log entry.",
        ],
      },
      {
        id: "timelines",
        title: "Timelines (review clocks)",
        summary:
          "Review timelines are published and enforced with escalation rules.",
        requirements: [
          "Publish the review deadline and expected response time.",
          "Provide status updates and escalation triggers.",
          "If deadlines are missed, default to human review or pause.",
        ],
        evidence: [
          "Published review deadline, with the event that starts its clock.",
          "Status tracker or timeline receipt.",
          "Escalation rule documentation.",
        ],
      },
      {
        id: "responder",
        title: "Responder and standard (who must answer, and against what)",
        summary:
          "A named party is obliged to answer, and the standard they decide against is published in advance.",
        requirements: [
          "Name the responder for each decision class, by role and contact, not by inbox.",
          "Publish the standard of review: policy conformance, policy correctness, evidentiary support, or reasonableness of outcome.",
          "State what evidence the responder must accept from the person challenging.",
          "Record the answer against the published standard, including reasoned refusals.",
        ],
        evidence: [
          "Standing register entry with responder and standard of review.",
          "Answered cases showing the standard applied.",
          "Admissible evidence list published with the challenge path.",
        ],
      },
      {
        id: "effect",
        title: "Effect (what can change)",
        summary:
          "The state transitions a successful challenge can produce are enumerated before anyone files.",
        requirements: [
          "List the possible outcomes: the decision stands, is narrowed, suspended, reversed, or corrected.",
          "Say which outcomes reach the delegation behind the decision, not only the decision itself.",
          "Show at least one closed case for each transition the list claims is available.",
        ],
        evidence: [
          "Enumerated state transitions in the standing register entry.",
          "Outcome log mapping closed challenges to transitions.",
          "Reconsideration records for challenges that changed a grant.",
        ],
      },
      {
        id: "remedies",
        title: "Remedies (reversal and repair)",
        summary:
          "A person can reach a remedy, whether reversal, restoration, or compensation, and can see when it was delivered.",
        requirements: [
          "Offer a clear path to reversal and restoration.",
          "List any compensation or remedy options.",
          "Show proof that remedy was delivered once complete.",
        ],
        evidence: [
          "Remedy options published with the decision record.",
          "Completion receipt for remedy actions.",
          "Decision log entry recording the reversal and the restoration.",
        ],
      },
      {
        id: "non-retaliation",
        title: "Non-retaliation (safe to challenge)",
        summary:
          "People are protected from penalties for challenging decisions.",
        requirements: [
          "State a no-retaliation guarantee in the challenge flow.",
          "Prohibit increased friction, fees, or access loss after filing.",
          "Track any adverse treatment of people who filed, and reverse it as soon as it is found.",
        ],
        evidence: [
          "Non-retaliation policy statement.",
          "Monitoring note for adverse impacts.",
          "Contact path for reporting retaliation.",
        ],
      },
    ],
  };
