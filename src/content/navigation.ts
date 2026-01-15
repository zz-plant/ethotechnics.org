export interface NavLink {
  href: string;
  label: string;
  description?: string;
  primary?: boolean;
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

export const navSections: NavSection[] = [
  {
    heading: "Frameworks",
    description: "Core concepts, standards, and glossary anchors.",
    links: [
      {
        href: "/standards",
        label: "Frameworks",
        description: "Open standards and foundational doctrine.",
        primary: true,
      },
      {
        href: "/standards/core-axioms",
        label: "Core axioms",
        description: "First principles for care-centered technology.",
      },
      {
        href: "/glossary",
        label: "Glossary",
        description: "Stable terms with citation-ready definitions.",
      },
    ],
  },
  {
    heading: "Patterns",
    description: "Pattern library for diagnostics, interventions, and upkeep.",
    links: [
      {
        href: "/mechanisms",
        label: "Pattern library",
        description: "Reusable patterns with implementation guidance.",
        primary: true,
      },
      {
        href: "/diagnostics",
        label: "Diagnostics",
        description: "Assess burden, readiness, and risk signals.",
      },
      {
        href: "/validators",
        label: "Validators",
        description: "Run audits and report cards against the standards.",
      },
    ],
  },
  {
    heading: "Research",
    description: "Case studies, working papers, and field notes.",
    links: [
      {
        href: "/research",
        label: "Research",
        description: "Agenda, publications, and bridge artifacts.",
        primary: true,
      },
      {
        href: "/field-notes",
        label: "Field notes",
        description: "Applied case studies and implementation learnings.",
      },
      {
        href: "/syllabus",
        label: "Syllabus",
        description: "Structured learning path through core materials.",
      },
    ],
  },
  {
    heading: "About",
    description: "Institute mission, boundaries, and Studio relationship.",
    links: [
      {
        href: "/institute",
        label: "About the Institute",
        description: "Why the Institute exists and how it is stewarded.",
        primary: true,
      },
      {
        href: "/start-here",
        label: "Start here",
        description: "Decision tree for researchers and practitioners.",
      },
      {
        href: "/institute/how-studio-fits",
        label: "How Studio fits",
        description: "When to bring in implementation support.",
      },
    ],
  },
];

export const navActions: NavAction[] = [
  {
    href: "/start-here",
    label: "Start here",
    variant: "primary",
  },
  {
    href: "/mechanisms",
    label: "Browse patterns",
    variant: "ghost",
  },
  {
    href: "/research",
    label: "Read research",
    variant: "ghost-compact",
  },
  {
    href: "https://ethotechnics.com/studio",
    label: "Implementation support",
    variant: "ghost-compact",
    icon: "lucide:arrow-up-right",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

const selectPrimaryLink = (section: NavSection) =>
  section.links.find((link) => link.primary) ?? section.links[0];

export const navPrimaryLinks: NavLink[] = navSections
  .map(selectPrimaryLink)
  .filter((link): link is NavLink => Boolean(link));
