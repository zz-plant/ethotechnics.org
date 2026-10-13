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
      "A challenge has a deadline for an answer and a stated procedure.",
    ],
    howToSteps: [
      "Fill this out before deployment for any decision that can cut off someone's benefit, care, housing, credit, or pay.",
      "Put the way to challenge the decision on the screen or letter that delivers it.",
      "Treat the reversal deadline as an operational commitment, not a target.",
    ],
    finalLine:
      "If no one will sign as the owner, the decision has none, and nothing it decides should go out.",
  },
  {
    name: "Reversal deadline template",
    slug: "reversal-deadline-template",
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
      "Set a reversal deadline for each decision class, and say what event starts its clock.",
      "Define escalation steps for when a deadline is missed.",
      "Publish internal dashboards for time to reverse and time in harm.",
    ],
    finalLine:
      "If you cannot set a deadline for a decision class, nothing bounds how long a wrong decision in it can stand.",
  },
  {
    name: "Halt authority table",
    slug: "halt-authority-table",
    description: [
      "Defines who can halt a system or one of its decision paths, who can pause a single case, under which conditions, and on what timeline.",
      "Includes the escalation ladder: who is reached next, and by when, if the first role does not act.",
      "Stoppability becomes an authority a named role holds and can use.",
    ],
    enforcesBullets: [
      "Halt authority is explicit and role-bound.",
      "Halt conditions are pre-declared.",
      "Escalation occurs by clock, not permission.",
    ],
    howToSteps: [
      "Assign halt roles and backup roles, and the escalation step above each.",
      "Define the halt criteria for each failure state, and the kill switch or other mechanism that carries out each halt.",
      "Run a tabletop where the first move is a halt.",
    ],
    finalLine:
      "If a halt needs someone's permission first, name that person. They hold the halt authority, whatever the table says.",
  },
  {
    name: "Challenge playbook",
    slug: "challenge-playbook",
    description: [
      "Defines what counts as a challenge, what evidence rules apply, and how resolution is time-bounded.",
      "What can be challenged, by whom, and how is defined in operational terms.",
    ],
    enforcesBullets: [
      "Challenges are recognized as system inputs.",
      "Evidence rules are explicit and consistent.",
      "Time bounds are binding.",
    ],
    howToSteps: [
      'Define "challenge" in operational terms.',
      "Set evidence rules that do not require perfect legibility.",
      "Bind the challenge queue to the reversal deadline and its clock.",
    ],
    finalLine:
      "If you cannot say what counts as a challenge, any challenge can be handled as a complaint and closed.",
  },
  {
    name: "Harm receipt format",
    slug: "harm-receipt-format",
    description: [
      "Specifies what you owe a person your system got wrong: an admission, the reasons, the remedy, and the date it arrives.",
      "An unanswered error counts as a missed deadline.",
    ],
    enforcesBullets: [
      "Repair obligations are explicit.",
      "The person gets a remedy by a stated date.",
      "The person does not have to prove the system wrong.",
    ],
    howToSteps: [
      "Issue a harm receipt whenever you find a decision that hurt someone was wrong.",
      "Include remedy path, time bounds, and escalation contact.",
      "Log harm receipts as governance events, not support tickets.",
    ],
    finalLine:
      "If an error cannot be given a receipt, the person it harmed has nothing to cite when they ask for the remedy.",
  },
];

export const failureStates: FailureState[] = [
  {
    title: "A decision has been challenged",
    slug: "decision-appealed",
    shortLabel: "Decision challenged",
    descriptionLine1:
      "Someone has challenged a decision, and the system cannot explain, reverse, or resolve it within a set time.",
    descriptionLine2:
      "While the challenge waits, the person who made it carries the cost of the delay.",
    artifactSlugs: [
      "decision-record-template",
      "challenge-playbook",
      "reversal-deadline-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "The model made a harmful error",
    slug: "model-wrong",
    shortLabel: "Model wrong",
    descriptionLine1:
      "The model is wrong about real people, and you cannot find those people, reverse the decisions, or restore them by a set date.",
    descriptionLine2:
      "The main failure is finding and recovering from the error, not the model's accuracy.",
    artifactSlugs: [
      "reversal-deadline-template",
      "halt-authority-table",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Challenges or reviews are stuck",
    slug: "queue-stuck",
    shortLabel: "Queue stuck",
    descriptionLine1:
      'Work is piling up with no deadline for resolving it. "Pending" has become an outcome in its own right, and nobody has counted its cost.',
    descriptionLine2:
      "Every day in the queue is a day someone goes without what they are owed.",
    artifactSlugs: [
      "halt-authority-table",
      "reversal-deadline-template",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Someone was wrongly denied, cut off, or billed",
    slug: "user-harmed",
    shortLabel: "Wrongly denied",
    descriptionLine1:
      "Your system took something from someone it should not have, and you cannot say what happened, what they are owed, or when they will get it back.",
    descriptionLine2: "They are paying for your error, in money and in time.",
    artifactSlugs: [
      "harm-receipt-format",
      "decision-record-template",
      "reversal-deadline-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "Nobody owns the failure",
    slug: "no-owner",
    shortLabel: "No owner",
    descriptionLine1:
      "A wrong decision is still in force, and nobody can be named who has the authority to reverse it, pay for it, or close it out.",
    descriptionLine2:
      "Until someone is named, the person it hurt has nobody to hold to a deadline.",
    artifactSlugs: [
      "decision-record-template",
      "halt-authority-table",
      "reversal-deadline-template",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "The decision cannot be explained",
    slug: "cant-explain",
    shortLabel: "Can’t explain",
    descriptionLine1:
      "The system cannot give an explanation specific enough for someone to challenge the decision, oversee it, or reverse it.",
    descriptionLine2:
      "Without reasons specific to the case, the person cannot challenge it and nobody can tell whether the rule is wrong.",
    artifactSlugs: [
      "decision-record-template",
      "challenge-playbook",
      "harm-receipt-format",
    ],
    footerLine: failureFooterLine,
  },
  {
    title: "The system cannot be halted",
    slug: "cant-stop",
    shortLabel: "Can’t halt",
    descriptionLine1:
      "A harmful process cannot be halted or rolled back in time, even when operators can see it is wrong.",
    descriptionLine2:
      "The controls to halt it are missing or have never been tested.",
    artifactSlugs: [
      "halt-authority-table",
      "reversal-deadline-template",
      "decision-record-template",
    ],
    footerLine: failureFooterLine,
  },
];
