import { cases, clauseHref, type ClauseRef } from "./casebook";
import { diagnosticsContent } from "./diagnostics";
import { standardsContent } from "./standards";
import { validatorsContent } from "./validators";
import type { PageWithPermalink } from "./types";

/**
 * Which systems the framework is for, sorted by what the system decides.
 *
 * The standards are domain-neutral by construction: nothing in STD-07 or
 * STD-08 depends on the sector. That left no page saying where they earn their
 * cost and where they do not. /start sorts readers by role and /examples by
 * scenario, and neither tells a reader whether their system is the kind the
 * casebook is about. The seven sector comparisons under /examples linked only
 * to glossary entries, so a reader who found their sector there met no
 * standard and no tool.
 *
 * This registry names six contexts and five boundaries. Every worked example
 * belongs to exactly one of them, and each example page reads its entry back,
 * so the page names the standards to bind and the check to run first.
 * Standards, tools, and cases are referenced by id and resolved from their own
 * registries, so a title or a slug cannot drift here.
 */

export type FitLink = { label: string; href: string };

/** A scored case and the clause its missing-record finding names. */
export type FitCase = { slug: string; clause: ClauseRef };

export type UseCase = {
  /** Anchor on /use-cases. */
  id: string;
  title: string;
  /** What the system decides about a person. */
  decides: string;
  /** Kinds of system that make this decision. */
  systems: string;
  /** Why the framework applies in this context in particular. */
  why: string;
  /**
   * The defense an institution in this context usually offers for its
   * system, and why the standards do not accept it as a justification.
   */
  defense: { said: string; answer: string };
  /** Scored public failures from this context. */
  cases: FitCase[];
  /** Said instead when no case from this context has been scored. */
  noCaseNote?: string;
  /** Standard ids, as the standards registry spells them. */
  bind: string[];
  /**
   * The tool to run first, and what it tells you here. A slug names a
   * diagnostic; with `validator`, it names one of the /validators forms. The
   * diagnostic named Workload Modeler (at /diagnostics/burden-modeler) rates
   * staff workload; VAL-01, the Burden Modeler, scores the affected person's
   * time.
   */
  runFirst: { slug: string; validator?: boolean; note: string };
  /** Worked examples and sector comparisons under /examples. */
  examples: FitLink[];
  incidents: FitLink[];
  /** Law already in force that asks for the same evidence. Not legal advice. */
  alreadyRequired: string;
  /**
   * What a person this kind of system decided about can already ask for
   * under that law, in their terms, with where it applies. Shown on the
   * self-defense page, where the reader is that person. Omitted where no law
   * gives the person a specific request to make.
   */
  personCanAsk?: string;
  /** True where Ethotechnics Studio takes commissioned work (src/content/studio.ts). */
  studio?: boolean;
};

export type Boundary = {
  id: string;
  title: string;
  why: string;
  link?: FitLink;
  /** Worked examples that sit on this boundary rather than inside a context. */
  examples: FitLink[];
};

export type UseCasesContent = PageWithPermalink & {
  eyebrow: string;
  title: string;
  description: string;
  shortAnswer: { title: string; description: string; link: FitLink }[];
  test: { lead: string; conditions: string[]; after: string };
  tooling: { title: string; description: string; links: FitLink[] }[];
};

export const useCasesContent: UseCasesContent = {
  pageTitle: "Which systems this is for — Ethotechnics",
  pageDescription:
    "Six kinds of automated decision the standards, cases, and tools are built for, what to bind and run first in each, and five where the framework does less.",
  permalink: "/use-cases",
  eyebrow: "Fit",
  title: "Which systems this is for",
  description:
    "The standards bind a decision, not a model, so they apply in any sector. They do the most in six, and less in five.",
  shortAnswer: [
    {
      title: "Best fit",
      description:
        "An institution deciding about many people at once, where appeals exist but do not change the rule. Public benefits is the pattern behind two of the five scored cases.",
      link: {
        label: "Public benefits and debt recovery",
        href: "#public-benefits",
      },
    },
    {
      title: "Furthest along",
      description:
        "A team shipping an agent or an automated decision whose code it controls. The record format is specified, and an exported record stream can be graded today.",
      link: { label: "AI agents that take actions", href: "#agents" },
    },
    {
      title: "For a buyer",
      description:
        "An agency or a health plan buying one of these systems from a vendor. It can cite clause numbers in the contract and require an evidence pack at each release.",
      link: {
        label: "Citing the standards in contracts",
        href: "/standards/where-this-binds",
      },
    },
  ],
  test: {
    lead: "The framework earns its cost where four things are true.",
    conditions: [
      "The decision changes one person's status, access, money, or risk.",
      "It runs at a volume nobody reviews case by case before it takes effect.",
      "The person can object, or should be able to, and the objections arrive somewhere the operator could read them.",
      "A named institution operates it and can be held to a clause by a contract, a regulator, or a court.",
    ],
    after:
      "When all four hold, the casebook pattern can recur: appeals are won one at a time while the rule that produced them keeps running. When one is missing, the framework does less. The boundaries below say what.",
  },
  tooling: [
    {
      title: "Checks evidence",
      description:
        "The Record Conformance Checker reads an exported stream of STD-07 records, checks it against the schema, recomputes the hashes, and reports the conformance level the stream earns. The receipt and record formats are published as JSON Schemas that any validator can run in CI.",
      links: [
        {
          label: "Record Conformance Checker",
          href: "/diagnostics/record-conformance",
        },
        {
          label: "Receipt schema",
          href: "/standards/agent-receipt-schema.json",
        },
      ],
    },
    {
      title: "Organizes a self-report",
      description:
        "The Delegation Audit, the corrective capacity self-assessment, the Workload Modeler, the three validators, and the 60-second self-test score what a team enters about its system. None of them verifies it.",
      links: [
        { label: "Delegation Audit", href: "/diagnostics/delegation-audit" },
        { label: "All diagnostics", href: "/diagnostics" },
      ],
    },
    {
      title: "Proposes",
      description:
        "Every standard here is a draft, apart from STD-04, which is deprecated. None has force until an organization adopts it or a contract cites it. The case scores are this project's reading of what courts, inquiries, and regulators found.",
      links: [
        { label: "Standards and their status", href: "/standards" },
        { label: "How the cases are scored", href: "/casebook" },
      ],
    },
  ],
};

export const useCases: UseCase[] = [
  {
    id: "public-benefits",
    title: "Public benefits and debt recovery",
    decides:
      "Whether a person gets a benefit, how much, and whether they owe it back.",
    systems:
      "Eligibility checks, overpayment and debt raising, fraud risk scores on claims, data matching across agencies.",
    why: "Two of the five scored cases are here. In both, people contested their decisions for years while the rule that produced the errors kept running. The burden of disproof often falls on the claimant, and a wrong debt stands while they contest it.",
    defense: {
      said: "Each wrong decision was corrected on appeal.",
      answer:
        "A corrected case is not a corrected rule. A claimant who cannot opt out is owed more correction, not less.",
    },
    cases: [
      { slug: "robodebt", clause: { standard: "STD-08", clause: "§2.3" } },
      {
        slug: "toeslagenaffaire",
        clause: { standard: "STD-02", clause: "§8.2" },
      },
    ],
    bind: ["STD-02", "STD-08", "STD-06"],
    runFirst: {
      slug: "burden-modeler",
      validator: true,
      note: "Score how long the claim or appeal journey takes the claimant, and whether it is hard enough to amount to a denial.",
    },
    examples: [
      {
        label: "Automated eligibility denial",
        href: "/examples/automated-eligibility-denial",
      },
      {
        label: "Government public services",
        href: "/examples/public-services",
      },
    ],
    incidents: [
      {
        label: "Overrides with no audit trace",
        href: "/incidents/model-override-visibility",
      },
    ],
    alreadyRequired:
      "EU AI Act Annex III, point 5(a), makes high-risk the systems public authorities use to grant, reduce, revoke, or reclaim public assistance benefits, with obligations from 2 December 2027. GDPR Article 22 gives a right to contest a decision based solely on automated processing.",
    personCanAsk:
      "In the EU, if a decision about you was made solely by automated processing, GDPR Article 22 lets you ask for a person to review it, give your view, and contest it. Article 15 lets you ask for meaningful information about the logic involved.",
  },
  {
    id: "credit-and-accounts",
    title: "Credit, payments, and account holds",
    decides:
      "Whether a person gets credit, at what limit, and whether they can use the money or the account they already have.",
    systems:
      "Credit scoring and limit setting, fraud holds, account locks, payment blocks, refund and chargeback decisions.",
    why: "These decisions run in real time, and many take effect before anyone could review them. The framework does not ask them to wait. It asks that each hold issue a receipt, run review clocks, and restore access when no fraud is confirmed.",
    defense: {
      said: "The fraud model is accurate.",
      answer:
        "Accuracy is evidence for a hold. It is not permission to keep one open without a receipt or a clock.",
    },
    cases: [
      { slug: "apple-card", clause: { standard: "STD-02", clause: "§8.1" } },
    ],
    bind: ["STD-01", "STD-02"],
    runFirst: {
      slug: "delegation-audit",
      note: "Take one hold or limit workflow through six questions. See which actions nobody can ground in a grant, and whether each can be undone.",
    },
    examples: [
      {
        label: "Automated account lock",
        href: "/examples/automated-account-lock",
      },
      {
        label: "Fraud hold with delayed notice",
        href: "/examples/fraud-hold-delayed-notice",
      },
      {
        label: "Irreversible payment with compensation",
        href: "/examples/irreversible-payment-compensation",
      },
      { label: "Loan approval systems", href: "/examples/loan-approval" },
      {
        label: "Financial fraud detection",
        href: "/examples/financial-fraud-detection",
      },
    ],
    incidents: [
      {
        label: "Appeals backlog trigger",
        href: "/incidents/appeals-backlog-trigger",
      },
    ],
    alreadyRequired:
      "In the US, ECOA and Regulation B require the specific principal reasons for an adverse credit action, and CFPB Circular 2022-03 says a complex model does not excuse a creditor from giving them. EU AI Act Annex III, point 5(b), makes creditworthiness assessment high-risk and excludes fraud detection.",
    personCanAsk:
      "In the US, if you are refused credit or offered worse terms than you asked for, ECOA and Regulation B entitle you to the specific principal reasons. If the notice does not give them, you can ask within 60 days.",
  },
  {
    id: "agents",
    title: "AI agents that take actions",
    decides:
      "Whether to send, refund, write, deploy, or approve, under authority someone delegated to it.",
    systems:
      "Support and refund agents, agents with write access to accounts or records, chains of agents handing work to each other, typed decision models used as gates.",
    why: "The tooling is furthest along here. Agent decisions are cheap and numerous, and a logging layer may not record them as decisions at all. STD-07 specifies the record each action leaves. STD-08 treats the agent's authority as a lease that expires. STD-09 treats a chain of agents as one delegation.",
    defense: {
      said: "The agent passed its evals.",
      answer:
        "Passing evals shows what the agent can do. It still needs a grant that names its scope and expires.",
    },
    cases: [],
    noCaseNote:
      "No public failure from this context has been scored yet. The refund example applies each clause to one agent.",
    bind: ["STD-07", "STD-08", "STD-09"],
    runFirst: {
      slug: "record-conformance",
      note: "Grade an exported stream of the agent's STD-07 records. If it emits none yet, start with the Delegation Audit.",
    },
    examples: [
      {
        label: "Decision-model gate on refunds",
        href: "/examples/decision-model-gate",
      },
      {
        label: "Customer service chatbots",
        href: "/examples/customer-service-chatbots",
      },
    ],
    incidents: [],
    alreadyRequired:
      "No statute treats agent actions as a category. An agent takes on the obligations of the decision it makes: a refund agent answers to consumer law, and an agent that decides benefit eligibility is high-risk under Annex III.",
  },
  {
    id: "health-coverage",
    title: "Health coverage and care decisions",
    studio: true,
    decides:
      "Whether a treatment is authorized or a claim is paid, and how a patient is triaged.",
    systems:
      "Prior authorization and utilization review, claim denials, clinical risk scores that set a care pathway, triage.",
    why: "Coverage decisions are frequent and each one is consequential, and a delay is itself a harm. Patients and clinicians already appeal them, so the casebook's question applies directly: does a won appeal change the rule?",
    defense: {
      said: "Patients can appeal.",
      answer:
        "Appeals that win one case at a time, while the rule stays, show the rule is wrong. They do not show the system works.",
    },
    cases: [],
    noCaseNote:
      "No case from health care has been scored yet. One composite scenario, an appeal accepted without a remedy, is drawn from this setting.",
    bind: ["STD-01", "STD-02", "STD-06"],
    runFirst: {
      slug: "latency-audit",
      validator: true,
      note: "Check observed decision times against the declared deadline, such as 72 hours for an urgent request, and whether a person can be reached to escalate.",
    },
    examples: [
      {
        label: "Healthcare diagnostic AI",
        href: "/examples/healthcare-diagnostics",
      },
      {
        label: "FHIR resources for healthcare interop",
        href: "/examples/fhir-resources",
      },
    ],
    incidents: [
      {
        label: "Appeal accepted without remedy",
        href: "/incidents/appeal-remedy-mismatch",
      },
    ],
    alreadyRequired:
      "From January 2026, CMS-0057-F requires Medicare Advantage plans and Medicaid and CHIP programs to decide urgent prior authorization requests within 72 hours and standard ones within seven calendar days, and to give a specific reason for each denial. EU AI Act Annex III, point 5(c), covers risk assessment and pricing in life and health insurance.",
    personCanAsk:
      "In the US, if a Medicare Advantage plan or a Medicaid or CHIP program denies a prior authorization, it must give you a specific reason. It must decide within 72 hours for an urgent request and seven calendar days for a standard one.",
  },
  {
    id: "platform-enforcement",
    title: "Platform enforcement",
    decides:
      "Whether a person's post stays up, their account stays open, or their listing stays visible.",
    systems:
      "Content takedowns, account suspensions, seller and creator delisting, spam and abuse filters.",
    why: "Enforcement runs at a volume no team could review case by case, and a wrong suspension can cut off a person's income or audience. Removal often has to be fast. The framework asks that it issue a receipt, bound its exceptions, and restore the content if the takedown is overturned.",
    defense: {
      said: "Users can appeal a takedown.",
      answer:
        "An appeal is a remedy only if an overturned takedown restores the content, on a clock.",
    },
    cases: [],
    noCaseNote: "No platform case has been scored yet.",
    bind: ["MVC-01", "STD-02"],
    runFirst: {
      slug: "corrective-debt-calculator",
      note: "Ask whether a successful appeal changes the filter or only restores one post.",
    },
    examples: [
      {
        label: "Content moderation takedown",
        href: "/examples/content-moderation-takedown",
      },
    ],
    incidents: [],
    alreadyRequired:
      "The EU Digital Services Act requires a statement of reasons for each restriction (Article 17), an internal complaint-handling system (Article 20), and access to out-of-court dispute settlement (Article 21).",
    personCanAsk:
      "In the EU, a platform that removes your content or suspends your account must tell you why (DSA Article 17), take your complaint through its own system for at least six months after the decision (Article 20), and point you to an out-of-court dispute settlement body (Article 21).",
  },
  {
    id: "grading-and-work",
    title: "Grading people and judging their work",
    decides:
      "What grade a student receives, or whether a worker is accused, disciplined, or let go on the system's figures.",
    systems:
      "Exam standardization and automated marking, productivity and shift scoring, accounting systems whose figures are used against the people who work in them.",
    why: "Two scored cases are here, and neither system was a machine-learning model. Ofqual's 2020 model was a statistical standardization. Horizon was branch accounting software. The standards apply anyway, because they bind the decision, not the component that made it.",
    defense: {
      said: "The system is robust.",
      answer:
        "The Post Office told each defendant that of Horizon, while subpostmasters were held liable for the shortfalls it reported.",
    },
    cases: [
      {
        slug: "ofqual-2020-grades",
        clause: { standard: "STD-06", clause: "§2.2" },
      },
      {
        slug: "post-office-horizon",
        clause: { standard: "STD-06", clause: "§5.5" },
      },
    ],
    bind: ["STD-06", "STD-02"],
    runFirst: {
      slug: "corrective-debt-calculator",
      note: "Ask whether handled exceptions ever changed the rule, or only the one grade or the one shortfall.",
    },
    examples: [],
    incidents: [],
    alreadyRequired:
      "EU AI Act Annex III makes high-risk the systems that evaluate learning outcomes (point 3(b)) and those that inform promotion, termination, or task allocation, or that monitor and evaluate workers' performance (point 4(b)).",
  },
];

export const boundaries: Boundary[] = [
  {
    id: "personalization",
    title: "Recommendations and personalization",
    why: "No single recommendation changes a person's status, access, money, or risk, so there is no decision to contest. The framework applies where personalization sets a price, a credit offer, or who is shown a job.",
    examples: [
      {
        label: "Retail personalization",
        href: "/examples/retail-personalization",
      },
    ],
  },
  {
    id: "model-testing",
    title: "Testing a model before anyone deploys it",
    why: "The standards evaluate a delegation, not a model. A model can pass every benchmark and still be deployed under a grant nobody renews or can revoke. A model release has no one the standards can bind until someone deploys it.",
    link: { label: "What the evals can check", href: "/evals/coverage" },
    examples: [],
  },
  {
    id: "person-decides",
    title: "Tools that inform a person who decides",
    why: "When a named person decides each case, has the time and the information to disagree, and their disagreements are recorded, most of the framework's work is done. What remains is checking that those three stay true as volume grows.",
    link: { label: "Meaningful control", href: "/glossary/meaningful-control" },
    examples: [],
  },
  {
    id: "low-volume",
    title: "Decisions a committee makes a few times a year",
    why: "A board that approves ten grants a year reads each one. Receipts, clocks, and conformance levels add cost there without catching what ordinary review would miss.",
    examples: [],
  },
  {
    id: "internal",
    title: "Automation that touches no one outside the team",
    why: "A build pipeline or an internal dashboard changes no one's status. The exception is an agent with write access to customer accounts or production records. That is a delegation, and the agents context applies.",
    link: { label: "AI agents that take actions", href: "#agents" },
    examples: [],
  },
];

/** A standard as a link, with its status, from the standards registry. */
export const standardLink = (id: string) => {
  const standard = standardsContent.standards.find((entry) => entry.id === id);
  if (!standard) throw new Error(`use-cases: unknown standard ${id}`);
  return {
    label: `${standard.id} ${standard.title}`,
    href: `/standards/${standard.slug}`,
    status: [standard.status, standard.version].filter(Boolean).join(" "),
  };
};

/** The first tool as a link, from the diagnostics or validators registry. */
export const toolLink = (ref: UseCase["runFirst"]): FitLink => {
  if (ref.validator) {
    const form = validatorsContent.validators.find(
      (entry) => entry.slug === ref.slug,
    );
    if (!form) throw new Error(`use-cases: unknown validator ${ref.slug}`);
    return {
      label: `${form.id} ${form.title}`,
      href: `/validators/${form.slug}`,
    };
  }
  const tool = diagnosticsContent.tools.find(
    (entry) => entry.slug === ref.slug,
  );
  if (!tool) throw new Error(`use-cases: unknown diagnostic ${ref.slug}`);
  return { label: tool.title, href: tool.ctaHref };
};

/** A scored case as a link, with the clause that would have caught it. */
export const caseLink = (ref: FitCase) => {
  const entry = cases.find((item) => item.slug === ref.slug);
  if (!entry) throw new Error(`use-cases: unknown case ${ref.slug}`);
  return {
    label: entry.title,
    href: `/casebook/${entry.slug}`,
    clause: {
      label: `${ref.clause.standard} ${ref.clause.clause}`,
      href: clauseHref(ref.clause),
    },
  };
};

/** The context or boundary a worked example belongs to. */
export const fitForExample = (
  slug: string,
):
  | { kind: "context"; entry: UseCase }
  | { kind: "boundary"; entry: Boundary }
  | undefined => {
  const href = `/examples/${slug}`;
  const context = useCases.find((entry) =>
    entry.examples.some((example) => example.href === href),
  );
  if (context) return { kind: "context", entry: context };
  const boundary = boundaries.find((entry) =>
    entry.examples.some((example) => example.href === href),
  );
  return boundary ? { kind: "boundary", entry: boundary } : undefined;
};
