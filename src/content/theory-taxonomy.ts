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
    title: "Absorption as concealment",
    href: "/research/theory/absorption-as-concealment",
    question:
      "How does human absorption of operational errors conceal system defects from performance metrics?",
    safeguard: "Evidence",
    mechanism: "Epistemic erasure via unrecorded human error correction",
    domain: "Assurance",
  },
  {
    slug: "an-engineering-tradition",
    title: "An engineering tradition",
    href: "/research/theory/an-engineering-tradition",
    question:
      "What would a safety engineering discipline look like for delegated automated authority?",
    safeguard: "Capability",
    mechanism:
      "Translating structural tolerances and error budgets to autonomous agency",
    domain: "Assurance",
  },
  {
    slug: "automation-and-capture",
    title: "Automation and capture",
    href: "/research/theory/automation-and-capture",
    question:
      "At what point does operational reliance extinguish an institution's ability to question, replace, or halt a system?",
    safeguard: "Dependency",
    mechanism:
      "Asymmetric lock-in and deskilling driven by unconstrained efficiency",
    domain: "Dependence",
  },
  {
    slug: "challenge-density",
    title: "Challenge density",
    href: "/research/theory/challenge-density",
    question:
      "Why must an institution scale its correction capacity or narrow its scope, rather than restrict standing, when appeal volume spikes?",
    safeguard: "Standing",
    mechanism:
      "Congestion treated as a capacity failure rather than a standing threshold",
    domain: "Experience",
  },
  {
    slug: "deliberate-non-use",
    title: "Deliberate non-use",
    href: "/research/theory/deliberate-non-use",
    question:
      "How can an institution preserve intentional non-deployment as an affirmative control once technical limits are removed?",
    safeguard: "Capability",
    mechanism:
      "Affirmative institutional refusal replacing accidental technical incapacity",
    domain: "Authority",
  },
  {
    slug: "democratic-vs-coercive-governability",
    title: "Democratic vs. coercive governability",
    href: "/research/theory/democratic-vs-coercive-governability",
    question:
      "What structural controls determine whether governance tools expand contestability or enforce behavioral compliance?",
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
      "What specific duties of reversibility and standing does an institution incur when subjects cannot exit its systems?",
    safeguard: "Dependency",
    mechanism: "Exit cost as the direct metric of institutional obligation",
    domain: "Dependence",
  },
  {
    slug: "dependence-without-standing",
    title: "Dependence without standing",
    href: "/research/theory/dependence-without-standing",
    question:
      "Why does an institution's reliance on informal human correction generate an enforceable obligation for procedural standing?",
    safeguard: "Standing",
    mechanism:
      "Disconnection between corrective labor and the legal right to challenge",
    domain: "Experience",
  },
  {
    slug: "endogenous-authorization",
    title: "Endogenous authorization",
    href: "/research/theory/endogenous-authorization",
    question:
      "How do incumbent systems shape the metrics, categories, and evidence used to justify their continuation?",
    safeguard: "Authority",
    mechanism:
      "Closed-circuit justification produced under conditions the system created",
    domain: "Governance",
  },
  {
    slug: "ethotechnical-design",
    title: "Ethotechnical design",
    href: "/research/theory/ethotechnical-design",
    question:
      "How must institutional systems be built to exhaust organizational capacity before consuming the adaptive capacity of human beings?",
    safeguard: "Correction",
    mechanism:
      "Structural priority of institutional adaptation over human coping",
    domain: "Delivery",
  },
  {
    slug: "exception-learning",
    title: "Exception learning",
    href: "/research/theory/exception-learning",
    question:
      "Why does resolving individual appeals leave the flawed rule that generated the errors completely untouched?",
    safeguard: "Correction",
    mechanism:
      "Separation of case corrigibility from structural rule modification",
    domain: "Governance",
  },
  {
    slug: "friction-as-accidental-governance",
    title: "Friction as accidental governance",
    href: "/research/theory/friction-as-accidental-governance",
    question:
      "When automated workflows eliminate manual friction, what deliberate sensing mechanisms must replace the accidental safeguards that were lost?",
    safeguard: "Evidence",
    mechanism: "Loss of informal error detection when streamlining workflows",
    domain: "Delivery",
  },
  {
    slug: "insulation",
    title: "Insulation",
    href: "/research/theory/insulation",
    question:
      "Through what institutional buffers do decision-makers isolate themselves from the corrective feedback generated by system error?",
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
      "Why does even the most predictive model of a person fail to extinguish that person's independent right to challenge a decision?",
    safeguard: "Standing",
    mechanism:
      "Non-equivalence between statistical representations and living subjects",
    domain: "Experience",
  },
  {
    slug: "the-antihuman-metric",
    title: "The antihuman metric",
    href: "/research/theory/the-antihuman-metric",
    question:
      "How do evaluation dashboards reward systems for meeting targets by exhausting the unpriced, off-ledger capacities of their operators?",
    safeguard: "Evidence",
    mechanism:
      "Compensatory reward hacking and metric decoupling from human sustainability",
    domain: "Assurance",
  },
  {
    slug: "the-compulsion-problem",
    title: "The compulsion problem",
    href: "/research/theory/the-compulsion-problem",
    question:
      "How can technical standards be constructed so that external legal, financial, and regulatory forces compel their adoption?",
    safeguard: "Authority",
    mechanism:
      "Relying on external vectors (courts, liability, procurement) for enforcement",
    domain: "Governance",
  },
  {
    slug: "the-consumption-of-adaptive-capacity",
    title: "The consumption of adaptive capacity",
    href: "/research/theory/the-consumption-of-adaptive-capacity",
    question:
      "Under what criteria, if any, can an institution legitimately demand that human beings consume their finite adaptive capacity to compensate for systemic defects?",
    safeguard: "Dependency",
    mechanism:
      "Demarcation between genuine necessity and manufactured institutional subsidy",
    domain: "Dependence",
  },
  {
    slug: "the-human-subsidy",
    title: "The human subsidy to institutional continuity",
    href: "/research/theory/the-human-subsidy",
    question:
      "What distinct varieties of uncounted compensatory labor produce apparent institutional functionality, and how do organizations reclassify structural defects as employee virtue?",
    safeguard: "Evidence",
    mechanism:
      "Eight compensatory labor inputs, distributed coercion, and manufactured virtue",
    domain: "Delivery",
  },
  {
    slug: "the-sovereign-override",
    title: "The sovereign override",
    href: "/research/theory/the-sovereign-override",
    question:
      "When operators route around rigid gates under load, how does the machine's boundary stay deterministic while the operator's override becomes evidence about the gate rather than a breach by the operator?",
    safeguard: "Correction",
    mechanism:
      "Asymmetric boundary with deterministic machine limits, sovereign human override, and mandatory root-cause audits",
    domain: "Authority",
  },
  {
    slug: "what-does-not-convert",
    title: "What does not convert",
    href: "/research/theory/what-does-not-convert",
    question:
      "Why are technical capability, past performance, and internal consistency incapable of converting into legitimate authority without an explicit grant?",
    safeguard: "Authority",
    mechanism: "Non-convertibility of empirical facts into normative authority",
    domain: "Authority",
  },
  {
    slug: "what-ethotechnics-is-not",
    title: "What Ethotechnics is not",
    href: "/research/theory/what-ethotechnics-is-not",
    question:
      "What vocabulary and moral assumptions must be retired to keep institutional critique focused on structural corrigibility and burden redistribution?",
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
      "Why does measuring only terminal outcomes hide the distribution of human adaptation and burden required to produce them?",
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
