export interface InstituteArtifact {
  name: string;
  slug: string;
  description: string[];
  enforcesBullets: string[];
  howToSteps: string[];
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

export const failureFooterLine =
  "If a field in these templates is hard to fill in, that field is the gap this failure exposes.";

export const artifacts: InstituteArtifact[] = [
  {
    name: "Decision record template",
    slug: "decision-record-template",
    description: [
      "Assigns a named decision owner, reversal power, burden limit, and appeal path.",
      "No system output goes out without someone who answers for it.",
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
    finalLine:
      "If no one will sign as the owner, the decision has none, and nothing it decides should go out.",
  },
  {
    name: "Reversal SLA template",
    slug: "reversal-sla-template",
    description: [
      "Sets the longest a decision may stay wrong after someone has challenged it.",
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
    finalLine:
      "If you cannot set a clock for a decision class, nothing bounds how long a wrong decision in it can stand.",
  },
  {
    name: "Escalation ladder / freeze authority table",
    slug: "escalation-ladder-freeze-authority",
    description: [
      "Defines who can freeze what, under which conditions, and on what timeline.",
      "Stoppability becomes an authority a named role holds and can use.",
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
    finalLine:
      "If a freeze needs someone's permission first, name that person. They hold the freeze authority, whatever the table says.",
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
    finalLine:
      "If you cannot say what counts as an appeal, any appeal can be handled as a complaint and closed.",
  },
  {
    name: "Harm receipt format",
    slug: "harm-receipt-format",
    description: [
      "Specifies what the system owes a user when it is wrong: acknowledgment, explanation, remedy path, and time bounds.",
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
    finalLine:
      "If an error cannot be given a receipt, the person it harmed has nothing to cite when they ask for the remedy.",
  },
];

export const failureStates: FailureState[] = [
  {
    title: "A decision has been appealed",
    slug: "decision-appealed",
    shortLabel: "Decision appealed",
    descriptionLine1:
      "Someone has challenged a decision, and the system cannot explain, reverse, or resolve it within a set time.",
    descriptionLine2:
      "While the appeal waits, the person who appealed carries the cost of the delay.",
    artifactSlugs: [
      "decision-record-template",
      "contestability-appeals-playbook",
      "reversal-sla-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "The model made a harmful error",
    slug: "model-wrong",
    shortLabel: "Model wrong",
    descriptionLine1:
      "The model's output is wrong in a way that matters, and the organization cannot reliably find, correct, or reverse its effects within a set time.",
    descriptionLine2:
      "The main failure is finding and recovering from the error, not the model's accuracy.",
    artifactSlugs: [
      "reversal-sla-template",
      "escalation-ladder-freeze-authority",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Appeals or reviews are stuck",
    slug: "queue-stuck",
    shortLabel: "Queue stuck",
    descriptionLine1:
      'Work is piling up with no deadline for resolving it. "Pending" has become an outcome in its own right, and nobody has counted its cost.',
    descriptionLine2: "The delay itself is doing harm, and keeps doing it.",
    artifactSlugs: [
      "escalation-ladder-freeze-authority",
      "reversal-sla-template",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "A person was harmed",
    slug: "user-harmed",
    shortLabel: "User harmed",
    descriptionLine1:
      "A person was materially harmed, and the organization cannot say what happened, what the person is owed, or how it will be repaired.",
    descriptionLine2: "The person affected is paying for the failure.",
    artifactSlugs: [
      "harm-receipt-format",
      "decision-record-template",
      "reversal-sla-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Nobody owns the failure",
    slug: "no-owner",
    shortLabel: "No owner",
    descriptionLine1:
      "Something has failed, and nobody can be named who has the authority to reverse it, compensate for it, or close it out.",
    descriptionLine2:
      "Without an owner, nobody is responsible for resolving the harm.",
    artifactSlugs: [
      "decision-record-template",
      "escalation-ladder-freeze-authority",
      "reversal-sla-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "The decision cannot be explained",
    slug: "cant-explain",
    shortLabel: "Can’t explain",
    descriptionLine1:
      "The system cannot give an explanation specific enough for someone to challenge the decision, oversee it, or repair it.",
    descriptionLine2:
      "Without reasons specific to the case, the person cannot challenge it and nobody can tell whether the rule is wrong.",
    artifactSlugs: [
      "decision-record-template",
      "contestability-appeals-playbook",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "The system cannot be stopped",
    slug: "cant-stop",
    shortLabel: "Can’t stop",
    descriptionLine1:
      "A harmful process cannot be paused or rolled back quickly, even when operators can see it is wrong.",
    descriptionLine2:
      "The controls to stop it are missing or have never been tested.",
    artifactSlugs: [
      "escalation-ladder-freeze-authority",
      "reversal-sla-template",
      "decision-record-template",
    ],
    footerLine: failureFooterLine,
  },
];
