export type QuickStartLink = {
  label: string;
  href: string;
  note?: string;
};

export type QuickStartGuide = {
  slug: string;
  title: string;
  summary: string;
  focusAreas: string[];
  keyLinks: QuickStartLink[];
  firstMoves: string[];
};

export const quickStartIntro = {
  pageTitle: "Quick-start guides — Ethotechnics",
  pageDescription:
    "Role-specific starting points for policy, design, engineering, and research teams.",
  permalink: "/quick-start",
  eyebrow: "Quick-start",
  title: "Role-specific quick-start guides",
  description:
    "Pick the role that matches your responsibilities to jump to the most relevant standards, mechanisms, and research.",
};

export const quickStartGuides: QuickStartGuide[] = [
  {
    slug: "policy-makers",
    title: "Policy makers",
    summary:
      "Use standards and validators to align policy language with accountable delivery outcomes.",
    focusAreas: [
      "Define the governing standard and the rights it protects.",
      "Map enforcement pathways and escalation lanes.",
      "Prepare public-facing summaries grounded in glossary anchors.",
    ],
    keyLinks: [
      {
        label: "STD-01: The Temporal Bill of Rights",
        href: "/standards/std-01-temporal-rights",
        note: "Canonical rights framing to anchor policy language.",
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
        note: "Shared definitions for public guidance.",
      },
    ],
    firstMoves: [
      "Select the standard your policy should reference and cite its glossary anchors.",
      "Run a validator to gather baseline risk and burden scores.",
      "Publish policy updates with the same glossary language used in the standards.",
    ],
  },
  {
    slug: "designers",
    title: "Designers",
    summary:
      "Translate standards into consent-aware flows, escalation cues, and plain-language interfaces.",
    focusAreas: [
      "Audit UI flows for stoppability, consent, and reversibility signals.",
      "Pair mechanism specs with interaction patterns and copy.",
      "Validate workflows with diagnostics before shipping.",
    ],
    keyLinks: [
      {
        label: "Mechanisms catalog",
        href: "/mechanisms",
        note: "Design-ready specs with implementation guidance.",
      },
      {
        label: "Field notes",
        href: "/field-notes",
        note: "Applied examples and facilitation cues.",
      },
      {
        label: "Diagnostics",
        href: "/diagnostics",
        note: "Decision-ready labs for flow validation.",
      },
      {
        label: "Glossary",
        href: "/glossary",
        note: "Interaction language tied to standards.",
      },
    ],
    firstMoves: [
      "Select two mechanisms that map to your flow’s risk points.",
      "Run a diagnostic with the team to surface consent or burden gaps.",
      "Align UI copy with glossary anchors before release.",
    ],
  },
  {
    slug: "engineers",
    title: "Engineers",
    summary:
      "Operationalize standards into instrumentation, controls, and stewardship workflows.",
    focusAreas: [
      "Instrument systems to surface burden, latency, and escalation signals.",
      "Build policy controls that enforce standards in production.",
      "Coordinate with stewards on maintenance and rollback readiness.",
    ],
    keyLinks: [
      {
        label: "Standards",
        href: "/standards",
        note: "Doctrine and rights to codify in system guardrails.",
      },
      {
        label: "Mechanisms catalog",
        href: "/mechanisms",
        note: "Spec sheets for governance, friction, and policy controls.",
      },
      {
        label: "Validators",
        href: "/validators",
        note: "Diagnostics that surface operational risk.",
      },
      {
        label: "Research",
        href: "/research",
        note: "Evidence and methods to justify operational changes.",
      },
    ],
    firstMoves: [
      "Map existing telemetry to the burden and latency validators.",
      "Implement a mechanism spec as a feature flag or control rail.",
      "Partner with stewards to define rollback and escalation ownership.",
    ],
  },
  {
    slug: "researchers",
    title: "Researchers",
    summary:
      "Ground investigations in glossary anchors and publish evidence linked to standards.",
    focusAreas: [
      "Align research questions with glossary and standard definitions.",
      "Publish protocols and artifacts that feed validators and mechanisms.",
      "Coordinate with the Institute to share datasets and findings.",
    ],
    keyLinks: [
      {
        label: "Research agenda",
        href: "/research",
        note: "Current agendas, focus areas, and publications.",
      },
      {
        label: "Glossary",
        href: "/glossary",
        note: "Canonical definitions for research protocols.",
      },
      {
        label: "Participate",
        href: "/participate",
        note: "Submit findings and coordinate peer review.",
      },
      {
        label: "Field notes",
        href: "/field-notes",
        note: "Published case notes tied to standards.",
      },
    ],
    firstMoves: [
      "Select glossary anchors for your research framing and cite them consistently.",
      "Share protocol drafts through the participation intake.",
      "Publish bridge artifacts that translate findings into mechanisms.",
    ],
  },
];
