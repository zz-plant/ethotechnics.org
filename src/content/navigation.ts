export interface NavLink {
  href: string;
  label: string;
  description?: string;
  primary?: boolean;
  mobileFeatured?: boolean;
}

export interface NavSection {
  heading: string;
  description: string;
  links: NavLink[];
}

export interface NavAction {
  href: string;
  label: string;
  variant: "primary" | "ghost" | "ghost-compact";
  icon?: string;
  rel?: string;
  target?: string;
}

export interface NavUtilityLink {
  href: string;
  label: string;
  class: string;
  rel?: string;
  target?: string;
  icon?: string;
}

export const navPrimaryLinks: NavLink[] = [
  {
    href: "/method",
    label: "Method",
    description:
      "The seven-stage chain, the six safeguards, and the twelve laws",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/standards",
    label: "Standards",
    description: "Citable normative specifications, clauses, and crosswalks",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/mechanisms",
    label: "Mechanisms",
    description: "Specifications for kill switches, circuit breakers, and appeal controls",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    description: "Tools that test a workflow, a decision log, or a set of numbers",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/casebook",
    label: "Casebook",
    description: "Scored public failures established by courts and regulators",
    primary: true,
    mobileFeatured: true,
  },
];

/**
 * The mega menu, named for the three layers the content model already has.
 *
 * Theory says why the laws hold, method says what must be true, instruments
 * check whether it is. The old headings ("Standards & Specifications",
 * "Diagnostics & Workbench") described file types rather than layers, which is
 * why every new page had to argue for a slot instead of falling into one.
 *
 * The five-link ceiling stays. It is not a display constraint — it is the only
 * thing forcing a decision about what a section is for.
 */
export const navSections: NavSection[] = [
  {
    heading: "Method",
    description:
      "What must be true when a system decides for an institution: the chain, the laws, and the specifications that enforce them.",
    links: [
      {
        href: "/method",
        label: "The method",
        description:
          "The seven-stage chain, the six safeguards, and the twelve laws",
      },
      {
        href: "/standards/laws",
        label: "The twelve laws",
        description: "Each law and the condition a clause must enforce",
      },
      {
        href: "/standards",
        label: "Standards",
        description: "Citable clauses, stated so a system can fail them",
      },
      {
        href: "/standards/enforceable-governance-crosswalks",
        label: "Regulatory crosswalks",
        description: "EU AI Act, NIST AI RMF, and ISO 42001 alignment",
      },
      {
        href: "/evidence-packs",
        label: "Evidence packs",
        description: "What a clause needs you to be able to show",
      },
    ],
  },
  {
    heading: "Mechanisms and evals",
    description:
      "How the requirements are built, and how a built system is scored against them.",
    links: [
      {
        href: "/mechanisms",
        label: "Mechanisms catalog",
        description: "Kill switches, appeals queues, and safe state controls",
      },
      {
        href: "/evals",
        label: "Eval suites",
        description: "Test suites that check whether a system can be stopped, explained, and appealed",
      },
      {
        href: "/evals/coverage",
        label: "What we can check",
        description:
          "Each check and the claim it tests, plus the claims no check covers yet",
      },
      {
        href: "/validators",
        label: "Validators",
        description: "Specifications, each with a working form, for scoring a user journey's time, friction, and delay",
      },
      {
        href: "/measurement-tiers",
        label: "Measurement tiers",
        description: "Levels of evidence, how each is gamed, and how to detect it",
      },
    ],
  },
  {
    // Ordered by what you have to bring, not by tool name. "Which one do I
    // want" is answerable from the input; it is not answerable from a list of
    // product names.
    heading: "Tools",
    description:
      "Ordered by what you bring: a workflow, a decision log, or a set of numbers.",
    links: [
      {
        href: "/diagnostics/delegation-audit",
        label: "Delegation audit",
        description: "Bring a workflow: should this decision still be automated?",
      },
      {
        href: "/diagnostics/burden-modeler",
        label: "Burden modeler",
        description:
          "Bring a workflow: who bears the cost of each step, and how much?",
      },
      {
        href: "/diagnostics/record-conformance",
        label: "Record conformance",
        description:
          "Bring a decision log: does it meet the level it claims?",
      },
      {
        href: "/diagnostics",
        label: "All tools",
        description:
          "Also the forecasters and simulators, which take numbers",
      },
    ],
  },
  {
    heading: "Knowledge",
    description:
      "Terms, failure modes, real incidents, and the theory behind the laws.",
    links: [
      {
        href: "/glossary",
        label: "Glossary",
        description: "Defined terms, each at a stable URL you can cite",
      },
      {
        href: "/taxonomy",
        label: "Capability taxonomy",
        description:
          "Governance practices by domain, each with an owner and a readiness level",
      },
      {
        href: "/casebook",
        label: "Casebook",
        description:
          "Five public failures scored on six safeguards",
      },
      {
        href: "/field-notes",
        label: "Field notes",
        description: "Working papers and studies of how governance works in practice",
      },
      {
        href: "/research/theory",
        label: "Theory",
        description: "Essays on why the laws hold, kept separate from the requirements",
      },
    ],
  },
];

export const startHereCta: NavLink = {
  href: "/start",
  label: "Start here",
  description: "Find the right resource",
  primary: true,
  mobileFeatured: true,
};

export const navUtilityMobilePrimaryLinks: NavUtilityLink[] = [
  {
    href: "/start",
    label: "Start here",
    class: "nav__utility-link nav__utility-link--primary",
    icon: "lucide:arrow-right",
  },
];

export const navActions: NavAction[] = [];
