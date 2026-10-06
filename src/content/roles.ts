/**
 * One vocabulary for "who is reading this".
 *
 * Three answers to that question used to coexist. /start offered engineer,
 * policy, auditor and executive. /quick-start offered policy-makers,
 * designers, engineers and researchers. /adopt offered build, ops and policy,
 * and nothing linked to it at all. A reader who chose "engineer" on one and
 * "engineers" on another had no way to know whether those were the same
 * audience, and choosing "build" was not reachable by choosing anything.
 *
 * This registry is the union of the three, deduplicated by who the person
 * actually is rather than by what the page called them. Seven audiences, each
 * addressed at exactly one URL.
 *
 * The material is deliberately uneven and the type says so. Three kinds of
 * thing were written for these audiences over time — orientation steps, a
 * longer guide, an adoption checklist — and no audience ever got all three
 * except by accident. Making each optional records which audiences are
 * actually served instead of implying they all are; a test asserts every role
 * carries at least one, which is the floor, not the goal.
 */

export type RoleId =
  | "engineering"
  | "policy"
  | "audit"
  | "operations"
  | "design"
  | "research"
  | "executive";

/** A first move with somewhere to go, shown on /start and atop the role page. */
export type OrientationStep = {
  number: number;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

/** The longer read: what to attend to, what to open, what to do first. */
export type RoleGuide = {
  focusAreas: string[];
  keyLinks: { label: string; href: string; note?: string }[];
  firstMoves: string[];
};

export type Role = {
  id: RoleId;
  /** How the role is named in prose and in navigation. */
  label: string;
  /** Who this is, in the reader's terms rather than the org chart's. */
  who: string;
  tagline: string;
  orientation?: OrientationStep[];
  guide?: RoleGuide;
  /** What to have in place, for a team that has decided to adopt. */
  adoptionChecklist?: string[];
  featuredDiagnostics?: string[];
  featuredStandards?: string[];
  /**
   * Paths that used to address this audience. Every one of these has a 301 in
   * src/middleware.ts; listing them here is what lets a test prove that.
   */
  formerPaths: string[];
};

export const roles: Role[] = [
  {
    id: "engineering",
    label: "Engineering",
    who: "You build or operate the system that makes the decision.",
    tagline:
      "Build decision systems whose errors reach someone who can change the rule: a log entry for every decision, permissions that expire, and challenges the system has to answer, written as code, not policy.",
    orientation: [
      {
        number: 1,
        title: "Check what a workflow is allowed to decide",
        description:
          "Take one workflow through six questions. Get back the permissions nobody can justify, and whether its decisions can be undone.",
        ctaLabel: "Open Delegation Audit",
        ctaHref: "/diagnostics/delegation-audit",
      },
      {
        number: 2,
        title: "Set deadlines for halts and reversals",
        description:
          "Build in a fixed time to halt, deadlines for reversing a decision, and the receipt each decision has to produce.",
        ctaLabel: "Read the standard on halts and deadlines",
        ctaHref: "/standards/std-01-temporal-rights",
      },
      {
        number: 3,
        title: "Log every decision, and check the log",
        description:
          "Log each decision in the format the decision-record standard (STD-07) sets out, including the permission it ran under. Then check an exported log against the schema and the conformance level you claim.",
        ctaLabel: "Check an exported log",
        ctaHref: "/diagnostics/record-conformance",
      },
    ],
    guide: {
      focusAreas: [
        "Log the work the system pushes onto people, how long decisions take, and when cases escalate.",
        "Build runtime checks that enforce the standards in production.",
        "Agree with the system's owners who maintains it and who can roll it back.",
      ],
      keyLinks: [
        {
          label: "Standards",
          href: "/standards",
          note: "The rules and rights to write into system guardrails.",
        },
        {
          label: "Mechanisms catalog",
          href: "/mechanisms",
          note: "Specifications for controls that pause, slow, route, or reverse a decision.",
        },
        {
          label: "What outcomes hide",
          href: "/research/theory/what-outcomes-hide",
          note: "Why judging a system by outcomes is not enough: also count what people had to adapt to, and whether they could get errors corrected.",
        },
        {
          label: "Validators",
          href: "/validators",
          note: "Checks that show operational risk.",
        },
        {
          label: "What we can check",
          href: "/evals/coverage",
          note: "Which governance properties an automated test can confirm, and which it cannot.",
        },
      ],
      firstMoves: [
        "Match the logs you already collect to the validators that measure the work a system pushes onto people and how long people wait on its decisions.",
        "Build one control from the mechanisms catalog as a feature flag or a runtime check.",
        "Agree with the system's owners who owns rollback and who owns escalation.",
      ],
    },
    adoptionChecklist: [
      "Set explicit action boundaries for high-risk automations.",
      "Require approvals before sensitive sends, deploys, or data writes.",
      "Test rollback paths and confirm they work under real load.",
      "Log all override actions with named owners and timestamps.",
    ],
    featuredDiagnostics: [
      "delegation-audit",
      "burden-modeler",
      "record-conformance",
    ],
    featuredStandards: [
      "std-07-revisable-delegation-record",
      "std-08-delegation",
      "std-01-temporal-rights",
    ],
    formerPaths: ["/quick-start/engineers", "/adopt/build"],
  },
  {
    id: "policy",
    label: "Policy and compliance",
    who: "You write the rules the system has to satisfy, or prove to a regulator that it does.",
    tagline:
      "Turn the standards into obligations a regulator or a contract can enforce: mappings to the law, numeric targets for appeals, and clauses a vendor has to sign.",
    orientation: [
      {
        number: 1,
        title: "Review the regulatory crosswalks",
        description:
          "Line-by-line mappings from the EU AI Act, the NIST AI RMF, and ISO/IEC 42001 to controls a system can be tested against.",
        ctaLabel: "View crosswalk matrix",
        ctaHref: "/standards/enforceable-governance-crosswalks",
      },
      {
        number: 2,
        title: "Set measurable targets for appeals",
        description:
          "Commit to numbers: how many appeals get through, how fast, and a promise that appealing carries no penalty.",
        ctaLabel: "Read the standard for appeal targets",
        ctaHref: "/standards/std-03-justice-slos",
      },
      {
        number: 3,
        title: "Draft contract clauses",
        description:
          "Before the system makes its first decision, the vendor agreement has to state what it may decide, on what evidence, and how its errors get fixed. Cite clause numbers, and require the vendor to deliver the records those clauses name at each release.",
        ctaLabel: "Cite the standards in a contract",
        ctaHref: "/standards/where-this-binds",
      },
    ],
    guide: {
      focusAreas: [
        "Choose the standard your policy rests on, and the rights it protects.",
        "Set out how each rule is enforced and where escalations go.",
        "Write public summaries in the words people use to challenge a decision. Keep the glossary's defined terms in the policy text.",
      ],
      keyLinks: [
        {
          label: "STD-01: The Temporal Bill of Rights",
          href: "/standards/std-01-temporal-rights",
          note: "The rights to cite in policy language.",
        },
        {
          label: "Mechanisms catalog",
          href: "/mechanisms",
          note: "Policy and governance controls ready to cite.",
        },
        {
          label: "Validators",
          href: "/validators",
          note: "Audit tools to assess compliance and burden.",
        },
        {
          label: "Glossary",
          href: "/glossary",
          note: "Defined terms to cite in policy text.",
        },
        {
          label: "Language people can use",
          href: "/explainers/language-people-can-use",
          note: "The questions people send about a decision. A public summary should answer them.",
        },
      ],
      firstMoves: [
        "Pick the standard your policy should reference and cite its defined terms.",
        "Run a validator to gather baseline risk and burden scores.",
        "Check each public summary against language people can use: it should say who can change a decision, why it was made, and by what date a challenge gets an answer.",
      ],
    },
    adoptionChecklist: [
      "Give every right to appeal a named owner and a response deadline.",
      "Define restitution pathways for harms that cannot be fully reversed.",
      "Set incident disclosure expectations for high-impact failures.",
      "Name who must sign off before a halted system restarts.",
    ],
    featuredDiagnostics: ["delegation-audit", "burden-modeler"],
    featuredStandards: [
      "std-01-temporal-rights",
      "std-06-human-impact-safety-case",
    ],
    formerPaths: ["/quick-start/policy-makers", "/adopt/policy"],
  },
  {
    id: "audit",
    label: "Audit and assurance",
    who: "You verify someone else's claims from the evidence their system emits.",
    tagline:
      "Check a system from its records, decisions, and halt logs, not from what its operator says.",
    orientation: [
      {
        number: 1,
        title: "Grade a system's decision records",
        description:
          "Check the records a system exports against the conformance level it claims. This is the one tool here that reads evidence rather than answers.",
        ctaLabel: "Check exported records",
        ctaHref: "/diagnostics/record-conformance",
      },
      {
        number: 2,
        title: "Know what each clause asks you to see",
        description:
          "Each evidence pack lists the records a clause needs: decision timestamps, deadlines, and what people received. Check the operator's records against it.",
        ctaLabel: "Inspect evidence packs",
        ctaHref: "/evidence-packs",
      },
      {
        number: 3,
        title: "Read five public failures as worked audits",
        description:
          "Each case was established by a court, an inquiry, or a regulator. Each is scored on six safeguards, such as whether the system's permission had an end date and whether anyone had to answer a challenge. Each score cites the clause that names the missing record.",
        ctaLabel: "Open the casebook",
        ctaHref: "/casebook",
      },
    ],
    featuredDiagnostics: [
      "record-conformance",
      "delegation-audit",
      "burden-modeler",
    ],
    featuredStandards: [
      "std-01-temporal-rights",
      "std-02-contestability-recourse",
    ],
    formerPaths: [],
  },
  {
    id: "operations",
    label: "Operations",
    who: "You run the appeals, the incident response, or the queues where the system's errors land.",
    tagline:
      "Keep the queues where errors land answerable: count the work they make, give each stalled case a deadline, and treat a backlog as a reason to change the system.",
    orientation: [
      {
        number: 1,
        title: "Model the load the system pushes onto people",
        description:
          "Count, in hours, who picks up the extra work a workflow creates, before a growing queue starts hiding its errors.",
        ctaLabel: "Run the Workload Modeler",
        ctaHref: "/diagnostics/burden-modeler",
      },
      {
        number: 2,
        title: "Put escalation on a deadline",
        description:
          "Give every stalled case a named owner and a deadline that escalates itself, rather than an inbox that ages quietly.",
        ctaLabel: "Inspect escalation SLAs",
        ctaHref: "/mechanisms/patterns/escalation-slas",
      },
      {
        number: 3,
        title: "Read the queue as a capacity signal",
        description:
          "Compare the number of appeals with the staff assigned to answer them. When the queue backs up, add staff or narrow the system, on the record. Never narrow who may appeal.",
        ctaLabel: "See the appeal load ledger",
        ctaHref: "/mechanisms/patterns/challenge-load-ledger",
      },
    ],
    adoptionChecklist: [
      "Set up a way to report harm, with named triage categories.",
      "Set escalation SLAs by severity and route to named responders.",
      "Track queue age and auto-escalate stalled cases.",
      "Publish a repair log showing what has been fixed, what has not, and who owns each item.",
    ],
    featuredDiagnostics: ["burden-modeler", "corrective-debt-calculator"],
    formerPaths: ["/adopt/ops"],
  },
  {
    id: "design",
    label: "Design",
    who: "You shape the interface where a person meets the decision.",
    tagline:
      "Turn standards into flows that ask for consent, show people how to escalate, and use words they can act on.",
    orientation: [
      {
        number: 1,
        title: "See who the design asks to adapt",
        description:
          "The design stance behind this work: what a system demands of people, who carries those demands, and whether they can make it change.",
        ctaLabel: "Read the design stance",
        ctaHref: "/research/theory/ethotechnical-design",
      },
      {
        number: 2,
        title: "Model the burden of one flow",
        description:
          "Score a real user journey for time spent, number of steps, and whether there is a way out. Use the result as a design brief.",
        ctaLabel: "Score one user journey",
        ctaHref: "/validators/burden-modeler",
      },
      {
        number: 3,
        title: "Put a checkpoint where the harm happens",
        description:
          "Design the checkpoints that stop, slow, or escalate a flow when the system is wrong, and put them where people can reach them.",
        ctaLabel: "Read about checkpoints that pause a flow",
        ctaHref: "/explainers/ethical-interrupts",
      },
      {
        number: 4,
        title: "Write copy people can act on",
        description:
          "Use phrases a person can send, file, or read out to challenge a decision, without needing to know this framework.",
        ctaLabel: "Open language people can use",
        ctaHref: "/explainers/language-people-can-use",
      },
    ],
    guide: {
      focusAreas: [
        "Check each flow: can a person challenge the decision, get an answer by a date, and leave without losing their place?",
        "Put the challenge route on the screen where the decision appears, not in a help page.",
        "Count what the flow asks of people, in minutes and steps, before it ships.",
      ],
      keyLinks: [
        {
          label: "Ethotechnical design",
          href: "/research/theory/ethotechnical-design",
          note: "The design stance: the institution should adapt before it asks people to.",
        },
        {
          label: "Mechanisms catalog",
          href: "/mechanisms",
          note: "Specifications for controls that pause, slow, route, or reverse a decision, with implementation notes.",
        },
        {
          label: "Field notes",
          href: "/field-notes",
          note: "Dated notes on outside changes that bear on the standards.",
        },
        {
          label: "Diagnostics",
          href: "/diagnostics",
          note: "Interactive tools for testing a flow before release.",
        },
        {
          label: "Language people can use",
          href: "/explainers/language-people-can-use",
          note: "The questions people send about a decision. The screen should answer them.",
        },
        {
          label: "Glossary",
          href: "/glossary",
          note: "Defined terms for internal specs, not for the screen.",
        },
      ],
      firstMoves: [
        "Pick the step in your flow where a decision lands on a person, and find the control in the mechanisms catalog that fits it.",
        "Score one real journey with the burden modeler and share the result as the design brief.",
        "Before release, check that the screen answers the questions in language people can use: who can change this decision, why it was made, and by what date a challenge gets an answer.",
      ],
    },
    featuredDiagnostics: ["burden-modeler"],
    formerPaths: ["/quick-start/designers"],
  },
  {
    id: "research",
    label: "Research",
    who: "You study these systems and publish about them.",
    tagline:
      "Use the same defined terms the standards use, so your findings can be cited in them.",
    orientation: [
      {
        number: 1,
        title: "Tie your question to one of the twelve laws",
        description:
          "Each law states a condition an automated decision system must keep, and names the standard clauses that check it. Frame your question against one law, so a finding bears on a specific clause.",
        ctaLabel: "Read the laws",
        ctaHref: "/standards/laws",
      },
      {
        number: 2,
        title: "Read why the laws hold",
        description:
          "The theory essays make the argument: who depends on whom, who can object, and why being able to do something is not permission to do it.",
        ctaLabel: "Open theory",
        ctaHref: "/research/theory",
      },
      {
        number: 3,
        title: "Bring a case or a dataset",
        description:
          "Send field studies, incident analyses, and protocols through the Participate page.",
        ctaLabel: "Open Participate",
        ctaHref: "/participate",
      },
    ],
    guide: {
      focusAreas: [
        "Align research questions with glossary and standard definitions.",
        "Publish protocols and data that the validators and mechanisms can use.",
        "Send datasets and findings to the Institute through the Participate page.",
      ],
      keyLinks: [
        {
          label: "Research agenda",
          href: "/research",
          note: "Current agendas, focus areas, and publications.",
        },
        {
          label: "Theory essays",
          href: "/research/theory",
          note: "The argument behind the laws, including the design and evaluation essays.",
        },
        {
          label: "Glossary",
          href: "/glossary",
          note: "Defined terms to use in research protocols.",
        },
        {
          label: "Participate",
          href: "/participate",
          note: "Send findings, cases, and corrections.",
        },
        {
          label: "Field notes",
          href: "/field-notes",
          note: "Dated notes on outside changes that bear on the standards.",
        },
      ],
      firstMoves: [
        "Pick the glossary terms your research uses and cite them consistently.",
        "Send protocol drafts through the Participate page.",
        "Write up how a finding would change a mechanism, and publish it.",
      ],
    },
    formerPaths: ["/quick-start/researchers"],
  },
  {
    id: "executive",
    label: "Executive",
    who: "You decide whether to deploy, and you carry the liability when it goes wrong.",
    tagline:
      "See what failures a deployment will cost the organization before you commit to it.",
    orientation: [
      {
        number: 1,
        title: "See the cost of failures nobody budgeted for",
        description:
          "Five public failures at their real scale: about A$1.8 billion in Robodebt repayments, wiped debts, and interest; more than 900 Horizon prosecutions; a Dutch cabinet that resigned.",
        ctaLabel: "Open the casebook",
        ctaHref: "/casebook",
      },
      {
        number: 2,
        title: "Check how your organization fixes its errors",
        description:
          "Five questions: how fast the system's reach grew, and whether challenges are received, reversed, fed back into the rules, and tracked when staff work around it.",
        ctaLabel: "Run the five-question self-assessment",
        ctaHref: "/diagnostics/corrective-debt-calculator",
      },
      {
        number: 3,
        title: "Benchmark governance maturity",
        description:
          "Place the organization on a scale that runs from a basic pause control to published appeal targets and funded maintenance.",
        ctaLabel: "Explore maturity scale",
        ctaHref: "/glossary/ethotechnic-maturity",
      },
    ],
    featuredDiagnostics: ["corrective-debt-calculator", "delegation-audit"],
    featuredStandards: ["std-06-human-impact-safety-case", "std-08-delegation"],
    formerPaths: [],
  },
];

export const rolePermalink = (id: RoleId) => `/roles/${id}`;

export const getRole = (id: string): Role | undefined =>
  roles.find((role) => role.id === id);

/** Which of the three kinds of material a role actually has written for it. */
export const roleMaterial = (role: Role) => ({
  orientation: Boolean(role.orientation?.length),
  guide: Boolean(role.guide),
  adoption: Boolean(role.adoptionChecklist?.length),
});
