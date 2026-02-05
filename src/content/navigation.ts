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
    heading: "Start",
    description: "Orient to the mission, learning path, and fastest way to act.",
    links: [
      {
        href: "/start-here",
        label: "Start here",
        description: "Quick orientation to rights, standards, and tooling.",
        primary: true,
      },
      {
        href: "/fast-path",
        label: "Fast-path adoption",
        description: "One-sprint on-ramp for shipping safeguards quickly.",
      },
      {
        href: "/syllabus",
        label: "Syllabus",
        description: "Structured learning path through standards and tools.",
      },
      {
        href: "/library",
        label: "Library",
        description: "Themes, patterns, primers, and foundational explainers.",
      },
      {
        href: "/research",
        label: "Research agenda",
        description: "Field-building agenda, publications, and studies.",
      },
    ],
  },
  {
    heading: "Standards & rights",
    description:
      "Published doctrine, immutable rights, and canonical glossary anchors.",
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
        href: "/standards/std-06-human-impact-safety-case",
        label: "Human Impact Safety Case (STD-06)",
        description:
          "Standard tests, thresholds, and evidence artifacts that block unsafe deployment.",
      },
      {
        href: "/standards/minimum-viable-contestability",
        label: "Minimum viable contestability standard",
        description:
          "One-page baseline for standing, reasons, records, timelines, remedies, and non-retaliation.",
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
    heading: "Implementation",
    description:
      "Playbooks, clauses, and mechanisms that turn standards into delivery.",
    links: [
      {
        href: "/examples",
        label: "Worked examples",
        description:
          "End-to-end scenarios with receipts, clocks, and remedies.",
        primary: true,
      },
      {
        href: "/mechanisms",
        label: "Mechanisms",
        description: "Governance, friction, and policy control specs.",
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
        href: "/diy-packs",
        label: "DIY implementation pack",
        description: "Templates, sample tickets, and minimal telemetry specs.",
      },
      {
        href: "/tools/burden-budget-worksheet",
        label: "Burden budget worksheet",
        description: "One-page worksheet for burden ceilings and repair paths.",
      },
    ],
  },
  {
    heading: "Diagnostics & validators",
    description: "Run assessments, simulations, and audits with shareable outputs.",
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
      {
        href: "/validators",
        label: "Validators",
        description: "Run audits, simulations, and report cards.",
      },
      {
        href: "/validators/burden-modeler",
        label: "Burden Modeler (validator)",
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
    heading: "Library & explainers",
    description:
      "Patterns, primers, and glossary anchors that keep delivery aligned.",
    links: [
      {
        href: "/library",
        label: "Library",
        description: "Browse themes, patterns, primers, and the syllabus.",
        primary: true,
      },
      {
        href: "/mechanisms#patterns",
        label: "Pattern language",
        description: "Mechanism patterns with execution-ready details.",
      },
      {
        href: "/mechanisms#primer",
        label: "Primer",
        description: "Short orientation for accountable delivery practices.",
      },
      {
        href: "/mechanisms#glossary",
        label: "Glossary anchors",
        description: "Stable terms for diagnostics and reporting.",
      },
      {
        href: "/explainers/contestability-checklist",
        label: "Contestability checklist",
        description: "Printable checklist for real contestability and recourse.",
      },
      {
        href: "/explainers/language-people-can-use",
        label: "Language people can use",
        description:
          "Copy-ready phrases for demanding contestability and accountable remedy.",
      },
      {
        href: "/explainers/public-memory",
        label: "Public memory for contestability terms",
        description:
          "Track language drift and cite stable definitions for accountability work.",
      },
      {
        href: "/explainers/governance-capability",
        label: "Governance as operational capability",
        description: "Define governance by stop, reverse, restore, and contest.",
      },
    ],
  },
  {
    heading: "Research & institute",
    description:
      "Orientation, agenda, and stewardship behind the standards.",
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
        href: "/agent-toolkit",
        label: "Agent toolkit",
        description: "Operational playbooks and agent enablement tools.",
      },
      {
        href: "/institute",
        label: "Institute",
        description:
          "Why the Institute exists and how standards are stewarded.",
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
    href: "/diagnostics",
    label: "Run a diagnostic",
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
