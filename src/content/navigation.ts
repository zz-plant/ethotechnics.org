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
  {
    href: "/about",
    label: "About",
    description: "Mission, governance, and who maintains this work",
    primary: true,
  },
];

export const navSections: NavSection[] = [
  {
    heading: "Standards & Specifications",
    description:
      "Normative requirements, contract clauses, and regulatory crosswalks.",
    links: [
      {
        href: "/standards",
        label: "Standards Spec",
        description: "Normative specifications and safety requirements",
      },
      {
        href: "/standards#regulatory-crosswalks",
        label: "Regulatory Crosswalks",
        description: "EU AI Act, NIST AI RMF, and ISO 42001 alignment",
      },
      {
        href: "/evidence-packs",
        label: "Evidence Packs",
        description: "Machine-verifiable proof and compliance artifacts",
      },
    ],
  },
  {
    heading: "Architecture & Mechanisms",
    description:
      "Concrete engineering patterns, circuit breakers, and test suites.",
    links: [
      {
        href: "/mechanisms",
        label: "Mechanisms Catalog",
        description: "Kill switches, appeals queues, and safe state controls",
      },
      {
        href: "/evals",
        label: "Evals & Benchmarks",
        description: "Governability evaluation suites and test cases",
      },
      {
        href: "/validators",
        label: "Technical Validators",
        description: "Runtime assertions and middleware specifications",
      },
    ],
  },
  {
    heading: "Diagnostics & Workbench",
    description:
      "Interactive tools to audit, forecast, and stress-test systems.",
    links: [
      {
        href: "/diagnostics/system-auditor",
        label: "System Auditor & Guardrails",
        description: "AI prompt and architecture governance analyzer",
      },
      {
        href: "/diagnostics/burden-modeler",
        label: "Burden Modeler",
        description: "Quantify cognitive friction and task loads",
      },
      {
        href: "/diagnostics/capacity-forecaster",
        label: "Capacity Forecaster",
        description: "Model human-in-the-loop saturation limits",
      },
      {
        href: "/diagnostics",
        label: "All Diagnostics",
        description: "Browse the complete interactive diagnostics gallery",
      },
    ],
  },
  {
    heading: "Knowledge & Evidence",
    description:
      "80+ failure modes, mathematical formulas, and empirical research.",
    links: [
      {
        href: "/glossary",
        label: "Glossary & Ontology",
        description: "Definitive terms for accountable systems",
      },
      {
        href: "/taxonomy",
        label: "Capability Taxonomy",
        description:
          "Domains, capabilities, and practices with owners and readiness",
      },
      {
        href: "/incidents",
        label: "Incident Precedents",
        description: "Real-world failure dossiers and post-mortems",
      },
      {
        href: "/field-notes",
        label: "Field Notes & Research",
        description: "Working papers and empirical governance studies",
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
    href: "/start-here",
    label: "Start here",
    class: "nav__utility-link nav__utility-link--primary",
    icon: "lucide:arrow-right",
  },
];

export const navActions: NavAction[] = [];
