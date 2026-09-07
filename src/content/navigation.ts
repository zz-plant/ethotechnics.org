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
      "The seven-stage chain, the six state variables, and the twelve laws",
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
    description: "Operational blueprints, circuit breakers, and controls",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    description: "Interactive system auditor, burden modeler, and evaluators",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/glossary",
    label: "Knowledge",
    description: "Taxonomy, failure modes, metrics, and case studies",
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
      "What must be true of a delegation: the chain, the laws, and the specifications that bind them.",
    links: [
      {
        href: "/method",
        label: "The method",
        description:
          "The seven-stage chain, the six state variables, and the twelve laws",
      },
      {
        href: "/standards/laws",
        label: "The twelve laws",
        description: "Each law with the invariant a clause has to bind",
      },
      {
        href: "/standards",
        label: "Standards",
        description: "Citable clauses, stated so a system can fail them",
      },
      {
        href: "/standards#regulatory-crosswalks",
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
        description: "Governability suites and the cases inside them",
      },
      {
        href: "/evals/coverage",
        label: "What we can check",
        description:
          "Every check mapped to the claim it establishes, and the claims nothing checks",
      },
      {
        href: "/validators",
        label: "Validators",
        description: "Runtime assertions and middleware specifications",
      },
      {
        href: "/measurement-tiers",
        label: "Measurement tiers",
        description: "Tiered evidence, gaming patterns, and detection logic",
      },
    ],
  },
  {
    // Ordered by what you have to bring, not by tool name. "Which one do I
    // want" is answerable from the input; it is not answerable from a list of
    // product names.
    heading: "Instruments",
    description:
      "Ordered by what you bring to them: a workflow, a record stream, or a set of numbers.",
    links: [
      {
        href: "/diagnostics/delegation-audit",
        label: "Delegation audit",
        description: "Bring a workflow: is the delegation still justified?",
      },
      {
        href: "/diagnostics/system-auditor",
        label: "System auditor",
        description:
          "Bring a prompt or architecture: where are the guardrails?",
      },
      {
        href: "/diagnostics/burden-modeler",
        label: "Burden modeler",
        description:
          "Bring a workflow: who absorbs the friction, and how much?",
      },
      {
        href: "/diagnostics/record-conformance",
        label: "Record conformance",
        description:
          "Bring a record stream: does it earn the level it declares?",
      },
      {
        href: "/diagnostics",
        label: "All instruments",
        description:
          "Including the forecasters and simulators, which take numbers",
      },
    ],
  },
  {
    heading: "Knowledge",
    description:
      "Terms, failure modes, real incidents, and the theory that motivates the laws without being cited by them.",
    links: [
      {
        href: "/glossary",
        label: "Glossary",
        description: "Definitive terms for accountable systems",
      },
      {
        href: "/taxonomy",
        label: "Capability taxonomy",
        description:
          "Domains, capabilities, and practices with owners and readiness",
      },
      {
        href: "/incidents",
        label: "Incident precedents",
        description: "Real-world failure dossiers and post-mortems",
      },
      {
        href: "/field-notes",
        label: "Field notes",
        description: "Working papers and empirical governance studies",
      },
      {
        href: "/research/theory",
        label: "Theory",
        description: "Why the laws hold, kept apart from the requirements",
      },
    ],
  },
];

export const startHereCta: NavLink = {
  href: "/start",
  label: "Start here",
  description: "Find the right resource fast",
  primary: true,
  mobileFeatured: true,
};

export const navUtilityDesktopLinks: NavUtilityLink[] = [
  {
    href: "https://github.com/zz-plant/ethotechnics.org",
    label: "GitHub",
    class: "nav__utility-link nav__utility-link--icon",
    rel: "noopener noreferrer",
    target: "_blank",
    icon: "lucide:github",
  },
];

export const navUtilityMobilePrimaryLinks: NavUtilityLink[] = [
  {
    href: "/start",
    label: "Start here",
    class: "nav__utility-link nav__utility-link--primary",
    icon: "lucide:arrow-right",
  },
];

export const navActions: NavAction[] = [];
