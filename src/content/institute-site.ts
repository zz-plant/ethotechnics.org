export interface InstituteArtifact {
  name: string;
  slug: string;
  description: string[];
  enforcesBullets: string[];
  howToSteps: string[];
  downloadUrl: string;
  finalLine: string;
}

export interface FailureState {
  title: string;
  slug: string;
  shortLabel: string;
  descriptionLine1: string;
  descriptionLine2: string;
  artifactSlugs: string[];
  footerLine: string;
}

export const artifactFinalLine =
  "If a field is hard to fill, that is the governance gap this artifact exposes.";

export const failureFooterLine =
  "If a field is hard to fill, that is the governance question this artifact is designed to surface.";

export const artifacts: InstituteArtifact[] = [
  {
    name: "Decision record template",
    slug: "decision-record-template",
    description: [
      "Assigns a named decision owner, reversal power, burden limit, and appeal path.",
      "Prevents anonymous system outputs from escaping accountability.",
    ],
    enforcesBullets: [
      "Every decision has a named owner.",
      "Who can reverse a decision is explicit.",
      "Contestability is bounded in time and procedure.",
    ],
    howToSteps: [
      "Fill this out before deployment for any decision that can harm a user.",
      "Publish the contestability path in the user-facing flow.",
      "Treat the reversal clock as an operational commitment, not a target.",
    ],
    downloadUrl: "#",
    finalLine: artifactFinalLine,
  },
  {
    name: "Reversal SLA template",
    slug: "reversal-sla-template",
    description: [
      "Defines the maximum time a system is allowed to remain wrong once a contestation signal exists.",
      "Reversal is treated as an operating requirement.",
    ],
    enforcesBullets: [
      "Error states must be recoverable within bounded time.",
      "Escalation is clock-driven, not discretionary.",
      '"Pending" cannot be unbounded.',
    ],
    howToSteps: [
      "Set a reversal clock for each decision class.",
      "Define escalation steps when clocks are missed.",
      "Publish internal dashboards for reversal latency and time-in-harm.",
    ],
    downloadUrl: "#",
    finalLine: artifactFinalLine,
  },
  {
    name: "Escalation ladder / freeze authority table",
    slug: "escalation-ladder-freeze-authority",
    description: [
      "Defines who can freeze what, under which conditions, and on what timeline.",
      "Stoppability is operationalized as an enforceable authority.",
    ],
    enforcesBullets: [
      "Freeze authority is explicit and role-bound.",
      "Stop conditions are pre-declared.",
      "Escalation occurs by clock, not permission.",
    ],
    howToSteps: [
      "Assign freeze roles and backup roles.",
      "Define kill-switch criteria for each failure state.",
      "Run a tabletop where the first move is a freeze.",
    ],
    downloadUrl: "#",
    finalLine: artifactFinalLine,
  },
  {
    name: "Contestability & appeals playbook",
    slug: "contestability-appeals-playbook",
    description: [
      "Defines what counts as an appeal, what evidence rules apply, and how resolution is time-bounded.",
      "Contestability is defined in operational terms.",
    ],
    enforcesBullets: [
      "Appeals are recognized as system inputs.",
      "Evidence rules are explicit and consistent.",
      "Time bounds are binding.",
    ],
    howToSteps: [
      'Define "appeal" in operational terms.',
      "Set evidence rules that do not require perfect legibility.",
      "Bind the appeals queue to the reversal SLA clock.",
    ],
    downloadUrl: "#",
    finalLine: artifactFinalLine,
  },
  {
    name: "Harm receipt format",
    slug: "harm-receipt-format",
    description: [
      "Specifies what the system owes a user when it is wrong: acknowledgement, explanation, remedy path, and time bounds.",
      "Silence is not an acceptable resolution state.",
    ],
    enforcesBullets: [
      "Repair obligations are explicit.",
      "Users receive a bounded remedy path.",
      "The burden of proof is limited.",
    ],
    howToSteps: [
      "Issue a harm receipt whenever a material error is discovered.",
      "Include remedy path, time bounds, and escalation contact.",
      "Log harm receipts as governance events, not support tickets.",
    ],
    downloadUrl: "#",
    finalLine: artifactFinalLine,
  },
];

export const failureStates: FailureState[] = [
  {
    title: "Failure state: Decision appealed",
    slug: "decision-appealed",
    shortLabel: "Decision appealed",
    descriptionLine1:
      "A decision has been contested and the system cannot clearly explain, reverse, or resolve it within bounded time.",
    descriptionLine2:
      "The time burden of unresolved contestation falls on the claimant.",
    artifactSlugs: [
      "decision-record-template",
      "contestability-appeals-playbook",
      "reversal-sla-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Failure state: Model wrong",
    slug: "model-wrong",
    shortLabel: "Model wrong",
    descriptionLine1:
      "The model output is wrong in a way that matters, and the organization cannot reliably detect, correct, or reverse the downstream effects within bounded time.",
    descriptionLine2:
      "The primary failure is detection and recovery, not accuracy.",
    artifactSlugs: [
      "reversal-sla-template",
      "escalation-ladder-freeze-authority",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Failure state: Queue stuck",
    slug: "queue-stuck",
    shortLabel: "Queue stuck",
    descriptionLine1:
      'Work is accumulating without bounded resolution. "Pending" has become an unpriced outcome.',
    descriptionLine2: "Delay in processing becomes a form of ongoing harm.",
    artifactSlugs: [
      "escalation-ladder-freeze-authority",
      "reversal-sla-template",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Failure state: User harmed",
    slug: "user-harmed",
    shortLabel: "User harmed",
    descriptionLine1:
      "A user experienced material harm and the system cannot clearly acknowledge what happened, what is owed, or how repair will occur.",
    descriptionLine2:
      "The cost of the failure is externalized to the affected user.",
    artifactSlugs: [
      "harm-receipt-format",
      "decision-record-template",
      "reversal-sla-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Failure state: No owner",
    slug: "no-owner",
    shortLabel: "No owner",
    descriptionLine1:
      "A failure has occurred and nobody can be named with authority to reverse, compensate, or close the loop.",
    descriptionLine2:
      "Without assigned ownership, harm has no designated resolution path.",
    artifactSlugs: [
      "decision-record-template",
      "escalation-ladder-freeze-authority",
      "reversal-sla-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Failure state: Can’t explain",
    slug: "cant-explain",
    shortLabel: "Can’t explain",
    descriptionLine1:
      "The system cannot provide a bounded explanation that enables contestability, oversight, or repair.",
    descriptionLine2:
      "Unexplainable decisions create an ungovernable system state.",
    artifactSlugs: [
      "decision-record-template",
      "contestability-appeals-playbook",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Failure state: Can’t stop",
    slug: "cant-stop",
    shortLabel: "Can’t stop",
    descriptionLine1:
      "A harmful process cannot be frozen, paused, or rolled back quickly, even when operators recognize it is wrong.",
    descriptionLine2:
      "Built-in stoppability mechanisms are absent or untested.",
    artifactSlugs: [
      "escalation-ladder-freeze-authority",
      "reversal-sla-template",
      "decision-record-template",
    ],
    footerLine: failureFooterLine,
  },
];
