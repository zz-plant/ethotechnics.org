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
    heading: "Standards",
    description:
      "Ratified doctrine, immutable rights, and canonical glossary anchors.",
    links: [
      {
        href: "/standards",
        label: "Standards",
        description: "Browse published standards and draft doctrines.",
        primary: true,
      },
      {
        href: "/standards/std-01-temporal-rights",
        label: "The Temporal Bill of Rights (STD-01)",
        description: "Draft standard defining the seven temporal rights.",
      },
      {
        href: "/standards/core-axioms",
        label: "Core axioms",
        description: "First principles for accountable system design.",
      },
      {
        href: "/glossary",
        label: "Glossary",
        description: "Immutable terminology and canonical definitions.",
      },
    ],
  },
  {
    heading: "Mechanisms",
    description:
      "Specification sheets that operationalize standards into governance, friction, and policy controls.",
    links: [
      {
        href: "/library",
        label: "Mechanisms",
        description: "Reference mechanisms and specification sheets.",
        primary: true,
      },
      {
        href: "/library#governance",
        label: "Governance",
        description:
          "Decision rights, escalation paths, and accountability ledgers.",
      },
      {
        href: "/library#friction",
        label: "Friction",
        description:
          "Consent prompts, exit ramps, and humane default safeguards.",
      },
      {
        href: "/library#policy",
        label: "Policy",
        description: "Contracts, charters, and enforceable commitments.",
      },
    ],
  },
  {
    heading: "Validators",
    description:
      "Interactive diagnostics that score systems against the standards.",
    links: [
      {
        href: "/validators",
        label: "Validators",
        description: "Run audits and generate report cards.",
        primary: true,
      },
      {
        href: "/validators/burden-modeler",
        label: "Burden Modeler",
        description: "Model time tax and constructive denial risk.",
      },
      {
        href: "/validators/risk-radar",
        label: "Risk Radar",
        description: "Surface exposure across high-burden touchpoints.",
      },
      {
        href: "/validators/latency-audit",
        label: "Latency Audit",
        description: "Check if timeouts honor STD-01 bounded duration.",
      },
    ],
  },
  {
    heading: "Institute",
    description:
      "Mission, team, and field case law from the Institute of Ethotechnics.",
    links: [
      {
        href: "/institute",
        label: "Mission",
        description:
          "Why the Institute exists and how standards are stewarded.",
        primary: true,
      },
      {
        href: "/institute/team",
        label: "Team",
        description: "Stewards, editors, and reviewers behind the standards.",
      },
      {
        href: "/field-notes",
        label: "Case law",
        description: "Field notes and applied findings from deployments.",
      },
      {
        href: "https://ethotechnics.com",
        label: "Studio (.com)",
        description: "Implementation partner for standard adoption.",
      },
    ],
  },
];

export const navActions: NavAction[] = [
  {
    href: "/standards/std-01-temporal-rights",
    label: "Read STD-01",
    variant: "primary",
  },
  {
    href: "/validators",
    label: "Run a validator",
    variant: "ghost",
  },
  {
    href: "https://ethotechnics.com/studio",
    label: "Implementation support",
    variant: "ghost-compact",
    icon: "lucide:arrow-up-right",
    rel: "noreferrer",
    target: "_blank",
  },
];

const selectPrimaryLink = (section: NavSection) =>
  section.links.find((link) => link.primary) ?? section.links[0];

export const navPrimaryLinks: NavLink[] = navSections
  .map(selectPrimaryLink)
  .filter((link): link is NavLink => Boolean(link));
