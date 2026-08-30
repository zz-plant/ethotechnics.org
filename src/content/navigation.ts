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
    description: "Citable normative specifications and requirements",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/diagnostics",
    label: "Tools",
    description: "Interactive diagnostics, capacity forecasters & checklists",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/mechanisms",
    label: "Mechanisms",
    description: "Operational patterns, kill switches, and controls",
    primary: true,
    mobileFeatured: true,
  },
  {
    href: "/evals",
    label: "Evals",
    description: "Governability benchmarks & rubrics",
    primary: true,
  },
  {
    href: "/library",
    label: "Library",
    description: "Glossary, ontology, and curated literature",
    primary: true,
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
    heading: "Standards & Tools",
    description:
      "Normative specifications, diagnostics, and operational controls.",
    links: [
      {
        href: "/standards",
        label: "Standards",
        description: "Normative specifications and safety requirements",
      },
      {
        href: "/diagnostics",
        label: "Diagnostics & Tools",
        description: "Readiness checks, burden modeling, and validators",
      },
      {
        href: "/mechanisms",
        label: "Mechanisms & Patterns",
        description: "Kill switches, appeals queues, and safe state controls",
      },
      {
        href: "/evals",
        label: "Evals & Benchmarks",
        description: "Evaluation test cases and governability benchmarks",
      },
    ],
  },
  {
    heading: "Knowledge & Reference",
    description: "Ontology, taxonomy, field notes, and research publications.",
    links: [
      {
        href: "/library",
        label: "Library Index",
        description: "Curated reference index and crosswalks",
      },
      {
        href: "/glossary",
        label: "Glossary & Ontology",
        description: "Definitive terms for accountable systems",
      },
      {
        href: "/field-notes",
        label: "Field Notes",
        description: "Operational observations and implementation memos",
      },
      {
        href: "/research",
        label: "Research",
        description: "Working papers and empirical governance studies",
      },
    ],
  },
  {
    heading: "Institute & Community",
    description: "Orientation, governance, participation, and ecosystem.",
    links: [
      {
        href: "/start-here",
        label: "Start Here",
        description: "Quick-start triage for operators, authors, and auditors",
      },
      {
        href: "/about",
        label: "About the Institute",
        description: "Mission, governance principles, and contributors",
      },
      {
        href: "/participate",
        label: "Participate & Feedback",
        description: "Contribute proposals, report issues, and join reviews",
      },
      {
        href: "/security/vulnerability-disclosure",
        label: "Security Policy",
        description: "Responsible disclosure and security guidelines",
      },
    ],
  },
];

export const startHereCta: NavLink = {
  href: "/start-here",
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
