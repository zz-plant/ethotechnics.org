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
      "Published doctrine, immutable rights, and the canonical glossary anchors.",
    links: [
      {
        href: "/standards",
        label: "Standards",
        description: "Browse published standards and in-flight drafts.",
        primary: true,
      },
      {
        href: "/standards/std-01-temporal-rights",
        label: "The Temporal Bill of Rights (STD-01)",
        description: "Draft standard defining the seven temporal rights.",
      },
      {
        href: "/standards/std-02-contestability-recourse",
        label: "The Contestability & Recourse Standard (STD-02)",
        description:
          "Draft standard defining contestability, review, and remedy obligations.",
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
    heading: "Adoption",
    description:
      "Worked examples, evidence packs, and binding vectors that turn standards into enforceable practice.",
    links: [
      {
        href: "/examples",
        label: "Worked examples",
        description:
          "End-to-end scenarios with receipts, clocks, and remedies.",
        primary: true,
      },
      {
        href: "/bindings",
        label: "Binding vectors",
        description: "Copy-paste clauses, release gates, and runbook snippets.",
      },
      {
        href: "/evidence-packs",
        label: "Evidence packs",
        description: "Tiered proof bundles for STD-01 and STD-02.",
      },
      {
        href: "/exceptions",
        label: "Exceptions framework",
        description: "Bounded exceptions that preserve receipts and clocks.",
      },
      {
        href: "/measurement-tiers",
        label: "Measurement tiers",
        description: "MPI measurement guidance with anti-gaming controls.",
      },
      {
        href: "/anti-weaponization",
        label: "Anti-weaponization constraints",
        description: "Clause-like constraints that prevent denial-by-design.",
      },
      {
        href: "/agents/spec",
        label: "Agent Safety Object Model",
        description: "Machine-readable agent governance profile for tooling.",
      },
      {
        href: "/fast-path",
        label: "Fast-path adoption",
        description: "One-sprint adoption guide for quick safeguards.",
      },
      {
        href: "/diy-packs",
        label: "DIY implementation pack",
        description: "Templates, sample tickets, and minimal telemetry specs.",
      },
    ],
  },
  {
    heading: "Library",
    description:
      "Patterns, primers, and glossary anchors that keep diagnostics and delivery aligned.",
    links: [
      {
        href: "/library",
        label: "Library",
        description: "Browse themes, patterns, primers, and the syllabus.",
        primary: true,
      },
      {
        href: "/library#patterns",
        label: "Pattern language",
        description: "Mechanism patterns with execution-ready details.",
      },
      {
        href: "/library#primer",
        label: "Primer",
        description: "Short orientation for accountable delivery practices.",
      },
      {
        href: "/library#glossary",
        label: "Glossary anchors",
        description: "Stable terms for diagnostics and reporting.",
      },
    ],
  },
  {
    heading: "Mechanisms",
    description:
      "Spec sheets that turn standards into governance, friction, and policy controls.",
    links: [
      {
        href: "/mechanisms",
        label: "Mechanisms",
        description: "Reference mechanisms and their implementation sheets.",
        primary: true,
      },
      {
        href: "/mechanisms#governance",
        label: "Governance",
        description:
          "Decision rights, escalation paths, and accountability ledgers.",
      },
      {
        href: "/mechanisms#friction",
        label: "Friction",
        description:
          "Consent prompts, exit ramps, and humane default safeguards.",
      },
      {
        href: "/mechanisms#policy",
        label: "Policy",
        description: "Contracts, charters, and enforceable commitments.",
      },
    ],
  },
  {
    heading: "Diagnostics",
    description:
      "Run decision-ready diagnostics with action-oriented outputs and examples.",
    links: [
      {
        href: "/diagnostics",
        label: "Diagnostics",
        description: "Choose a diagnostic and leave with a shareable readout.",
        primary: true,
      },
      {
        href: "/diagnostics/burden-modeler",
        label: "Burden Modeler",
        description: "Quantify toil, friction, and overload signals.",
      },
      {
        href: "/diagnostics/maintenance-simulator",
        label: "Maintenance Simulator",
        description: "Stress-test coverage with tabletop scenarios.",
      },
      {
        href: "/diagnostics/capacity-forecaster",
        label: "Capacity Forecaster",
        description: "Model long-term delivery saturation risks.",
      },
    ],
  },
  {
    heading: "Validators",
    description: "Diagnostics that score systems against published standards.",
    links: [
      {
        href: "/validators",
        label: "Validators",
        description: "Run audits, simulations, and report cards.",
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
      {
        href: "/diagnostics",
        label: "Diagnostics",
        description: "Run simulations and maintenance diagnostics.",
      },
    ],
  },
  {
    heading: "Research",
    description:
      "Orientation, agenda, and publications that ground the standards.",
    links: [
      {
        href: "/research",
        label: "Research",
        description: "Scan the research agenda, artifacts, and publications.",
        primary: true,
      },
      {
        href: "/research/temporal-governance-studies",
        label: "Temporal Governance Studies (CH-01)",
        description:
          "Field-definition charter for the temporal governance research program.",
      },
      {
        href: "/field-notes",
        label: "Field notes",
        description: "Applied case studies and implementation learnings.",
      },
      {
        href: "/syllabus",
        label: "Syllabus",
        description: "Structured learning path through standards and tools.",
      },
      {
        href: "/agent-toolkit",
        label: "Agent toolkit",
        description: "Operational playbooks and agent enablement tools.",
      },
    ],
  },
  {
    heading: "Institute",
    description:
      "Mission, team, and programs stewarded by the Institute of Ethotechnics.",
    links: [
      {
        href: "/institute",
        label: "Institute",
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
        href: "/participate",
        label: "Participate",
        description: "Submit proposals, join reviews, or share feedback.",
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
    href: "/start-here",
    label: "Start here",
    variant: "primary",
  },
  {
    href: "/search",
    label: "Search",
    variant: "ghost-compact",
    icon: "lucide:search",
  },
  {
    href: "/validators",
    label: "Run a validator",
    variant: "ghost",
  },
  {
    href: "/standards/std-02-contestability-recourse",
    label: "Read STD-02",
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
