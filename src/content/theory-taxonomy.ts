import type { Safeguard } from "./taxonomy";

export interface TheoryQuestionEntry {
  slug: string;
  title: string;
  href: string;
  question: string;
  safeguard: Safeguard;
  mechanism: string;
  domain:
    | "Governance"
    | "Assurance"
    | "Delivery"
    | "Dependence"
    | "Experience"
    | "Authority";
}

export const theoryTaxonomy: TheoryQuestionEntry[] = [
  {
    slug: "absorption-as-concealment",
    title: "Workarounds can make a failing system’s metrics look better",
    href: "/research/theory/absorption-as-concealment",
    question:
      "How do people who quietly work around a system's errors keep those errors out of its metrics?",
    safeguard: "Evidence",
    mechanism: "Epistemic erasure via unrecorded human error correction",
    domain: "Assurance",
  },
  {
    slug: "an-engineering-tradition",
    title: "Decision systems still lack an engineering safety tradition",
    href: "/research/theory/an-engineering-tradition",
    question:
      "What would a safety engineering tradition look like for systems that make decisions on an institution's behalf?",
    safeguard: "Capability",
    mechanism:
      "Translating structural tolerances and error budgets to autonomous agency",
    domain: "Assurance",
  },
  {
    slug: "automation-and-capture",
    title: "When an institution can no longer afford to question its system",
    href: "/research/theory/automation-and-capture",
    question:
      "At what point does relying on a system leave an institution unable to question, replace, or halt it?",
    safeguard: "Dependency",
    mechanism:
      "Asymmetric lock-in and deskilling driven by unconstrained efficiency",
    domain: "Dependence",
  },
  {
    slug: "challenge-density",
    title: "When challenges pile up, add the capacity to answer them",
    href: "/research/theory/challenge-density",
    question:
      "When challenges pile up, why should an institution add reviewers or narrow the system rather than limit who may challenge?",
    safeguard: "Standing",
    mechanism:
      "Congestion treated as a capacity failure rather than a standing threshold",
    domain: "Experience",
  },
  {
    slug: "deliberate-non-use",
    title: "Deciding not to use a capability, on the record",
    href: "/research/theory/deliberate-non-use",
    question:
      "Once a system can do something it could not do before, how can an institution decide, on the record, not to use it?",
    safeguard: "Capability",
    mechanism:
      "Affirmative institutional refusal replacing accidental technical incapacity",
    domain: "Authority",
  },
  {
    slug: "democratic-vs-coercive-governability",
    title: "The same logs and audits can protect people or control them",
    href: "/research/theory/democratic-vs-coercive-governability",
    question:
      "What decides whether logs, audits, and escalation paths give people a way to challenge a system or a way to be controlled by it?",
    safeguard: "Correction",
    mechanism:
      "Bifurcation between return-path governance and extraction tooling",
    domain: "Governance",
  },
  {
    slug: "dependence-runs-both-ways",
    title: "Dependence runs both ways",
    href: "/research/theory/dependence-runs-both-ways",
    question:
      "What does an institution owe the people who cannot leave its system?",
    safeguard: "Dependency",
    mechanism: "Exit cost as the direct metric of institutional obligation",
    domain: "Dependence",
  },
  {
    slug: "dependence-without-standing",
    title: "People who catch a system’s errors need a way to change it",
    href: "/research/theory/dependence-without-standing",
    question:
      "If an institution relies on people to catch its system's errors, why does it owe them a formal way to change the system?",
    safeguard: "Standing",
    mechanism:
      "Disconnection between corrective labor and the legal right to challenge",
    domain: "Experience",
  },
  {
    slug: "endogenous-authorization",
    title: "A system in use shapes the evidence for keeping it",
    href: "/research/theory/endogenous-authorization",
    question:
      "How does a system already in place shape the evidence used to decide whether to keep it?",
    safeguard: "Authority",
    mechanism:
      "Closed-circuit justification produced under conditions the system created",
    domain: "Governance",
  },
  {
    slug: "ethotechnical-design",
    title: "Let the institution adjust before the person has to",
    href: "/research/theory/ethotechnical-design",
    question:
      "When a design does not fit people, how can it be built so the institution adjusts before the people do?",
    safeguard: "Correction",
    mechanism:
      "Structural priority of institutional adaptation over human coping",
    domain: "Delivery",
  },
  {
    slug: "exception-learning",
    title: "Fixing bad decisions one at a time can leave the rule in place",
    href: "/research/theory/exception-learning",
    question:
      "Why can resolving challenges one at a time leave the rule that caused them in place?",
    safeguard: "Correction",
    mechanism:
      "Separation of case corrigibility from structural rule modification",
    domain: "Governance",
  },
  {
    slug: "friction-as-accidental-governance",
    title: "When agents remove friction, they remove how errors were noticed",
    href: "/research/theory/friction-as-accidental-governance",
    question:
      "When automation removes the handoffs and reviews that used to catch errors, what has to be built to catch them instead?",
    safeguard: "Evidence",
    mechanism: "Loss of informal error detection when streamlining workflows",
    domain: "Delivery",
  },
  {
    slug: "where-difficulty-lives",
    title: "Where difficulty lives",
    href: "/research/theory/where-difficulty-lives",
    question:
      "Which layer of a system should absorb a given disturbance, and why does it so often reach a person instead?",
    safeguard: "Correction",
    mechanism:
      "Allocation of coordination, memory, verification and error detection to people instead of the institution",
    domain: "Experience",
  },
  {
    slug: "insulation",
    title: "When the people harmed cope, the rule looks like it works",
    href: "/research/theory/insulation",
    question:
      "What keeps evidence that a decision was wrong from reaching the people who could change the rule?",
    safeguard: "Correction",
    mechanism:
      "Structural buffering between rule-makers and the consequences of error",
    domain: "Governance",
  },
  {
    slug: "model-of-a-person",
    title: "The model of a person is not the person",
    href: "/research/theory/model-of-a-person",
    question:
      "If a model predicts a person well, why should that person still be able to challenge its decisions about them?",
    safeguard: "Standing",
    mechanism:
      "Non-equivalence between statistical representations and living subjects",
    domain: "Experience",
  },
  {
    slug: "reproduction-of-corrective-power",
    title: "Ordinary operation can wear down the power to correct it",
    href: "/research/theory/reproduction-of-corrective-power",
    question:
      "What makes correction effective, and what does an institution's ordinary operation do to the capacity to correct it?",
    safeguard: "Correction",
    mechanism:
      "Effective corrective power and the reproduction of the capacities it depends on",
    domain: "Governance",
  },
  {
    slug: "the-antihuman-metric",
    title: "A green dashboard can hide the people wearing out behind it",
    href: "/research/theory/the-antihuman-metric",
    question:
      "How can a dashboard reward a system for hitting its targets while the system wears out the people who run it?",
    safeguard: "Evidence",
    mechanism:
      "Compensatory reward hacking and metric decoupling from human sustainability",
    domain: "Assurance",
  },
  {
    slug: "the-compulsion-problem",
    title: "A standard has to be enforceable by someone other than its authors",
    href: "/research/theory/the-compulsion-problem",
    question:
      "Since a standard cannot force anyone to adopt it, how can it be written so that contracts, courts, insurers, and regulators enforce it?",
    safeguard: "Authority",
    mechanism:
      "Relying on external vectors (courts, liability, procurement) for enforcement",
    domain: "Governance",
  },
  {
    slug: "the-consumption-of-adaptive-capacity",
    title: "People’s attention, evenings, and sleep are a limited budget",
    href: "/research/theory/the-consumption-of-adaptive-capacity",
    question:
      "When, if ever, may an institution ask people to spend their limited time and stamina making up for its own defects?",
    safeguard: "Dependency",
    mechanism:
      "Demarcation between genuine necessity and manufactured institutional subsidy",
    domain: "Dependence",
  },
  {
    slug: "the-human-subsidy",
    title: "Uncounted repair work keeps institutions looking capable",
    href: "/research/theory/the-human-subsidy",
    question:
      "What kinds of uncounted work keep an institution looking functional, and how does it come to call that work dedication?",
    safeguard: "Evidence",
    mechanism:
      "Eight compensatory labor inputs, distributed coercion, and manufactured virtue",
    domain: "Delivery",
  },
  {
    slug: "the-sovereign-override",
    title: "Each emergency override is evidence the rule failed",
    href: "/research/theory/the-sovereign-override",
    question:
      "When a hard rule fails staff in an emergency, how can the software stay strict while each emergency override is recorded as evidence against the rule, not as staff misconduct?",
    safeguard: "Correction",
    mechanism:
      "Asymmetric boundary with deterministic machine limits, sovereign human override, and mandatory root-cause audits",
    domain: "Authority",
  },
  {
    slug: "what-does-not-convert",
    title: "Capability and a clean record do not grant authority",
    href: "/research/theory/what-does-not-convert",
    question:
      "Why do a system's capability and track record never give it authority on their own?",
    safeguard: "Authority",
    mechanism: "Non-convertibility of empirical facts into normative authority",
    domain: "Authority",
  },
  {
    slug: "what-ethotechnics-is-not",
    title: "What Ethotechnics is not",
    href: "/research/theory/what-ethotechnics-is-not",
    question:
      "What does Ethotechnics leave out, and which familiar words does it stop relying on?",
    safeguard: "Correction",
    mechanism:
      "Scoping discipline to corrigibility mechanics rather than institutional benevolence",
    domain: "Governance",
  },
  {
    slug: "what-outcomes-hide",
    title: "What outcomes hide",
    href: "/research/theory/what-outcomes-hide",
    question:
      "Why does judging an institution by its outcomes hide who carried the burden of producing them?",
    safeguard: "Evidence",
    mechanism:
      "Invisibility of the production path and adaptation burden in terminal metrics",
    domain: "Assurance",
  },
];

export const theoryTaxonomyBySlug = new Map(
  theoryTaxonomy.map((entry) => [entry.slug, entry]),
);

export const getTheoryQuestionsBySafeguard = (safeguard: Safeguard) =>
  theoryTaxonomy.filter((entry) => entry.safeguard === safeguard);

export const safeguardsInTaxonomy: Safeguard[] = [
  "Capability",
  "Authority",
  "Evidence",
  "Dependency",
  "Standing",
  "Correction",
];
