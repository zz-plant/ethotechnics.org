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
      "Build decision systems that can be stopped, explained, and reversed, with the guardrails written as code rather than as policy.",
    orientation: [
      {
        number: 1,
        title: "Audit a system spec and generate guardrails",
        description:
          "Run the System Auditor against a spec to surface failure modes and synthesize TypeScript or Python middleware.",
        ctaLabel: "Open System Auditor",
        ctaHref: "/diagnostics/system-auditor",
      },
      {
        number: 2,
        title: "Enforce STD-01: temporal rights and recourse",
        description:
          "Implement deterministic time-to-halt, reversal SLAs, and the receipt structure a decision has to emit.",
        ctaLabel: "Inspect STD-01",
        ctaHref: "/standards/std-01-temporal-rights",
      },
      {
        number: 3,
        title: "Model burden and human substitution",
        description:
          "Calculate the load the system pushes onto people, and check review capacity against the ceiling it assumes.",
        ctaLabel: "Run Burden Modeler",
        ctaHref: "/diagnostics/burden-modeler",
      },
    ],
    guide: {
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
          label: "What we can check",
          href: "/evals/coverage",
          note: "Which governance properties a probe can actually establish.",
        },
      ],
      firstMoves: [
        "Map existing telemetry to the burden and latency validators.",
        "Implement a mechanism spec as a feature flag or control rail.",
        "Partner with stewards to define rollback and escalation ownership.",
      ],
    },
    adoptionChecklist: [
      "Set explicit action boundaries for high-risk automations.",
      "Require approvals before sensitive sends, deploys, or data writes.",
      "Instrument rollback paths and verify they are runnable under pressure.",
      "Log all override actions with named owners and timestamps.",
    ],
    featuredDiagnostics: [
      "system-auditor",
      "burden-modeler",
      "capacity-forecaster",
    ],
    featuredStandards: ["std-01-temporal-rights", "std-02-reversibility-slas"],
    formerPaths: ["/quick-start/engineers", "/adopt/build"],
  },
  {
    id: "policy",
    label: "Policy and compliance",
    who: "You write the rules the system has to satisfy, or prove to a regulator that it does.",
    tagline:
      "Map technical requirements directly onto the EU AI Act, NIST AI RMF, and ISO 42001, in terms a control can be tested against.",
    orientation: [
      {
        number: 1,
        title: "Review the regulatory crosswalks",
        description:
          "Line-by-line mappings between international AI legislation and controls a system can be tested against.",
        ctaLabel: "View crosswalk matrix",
        ctaHref: "/standards#regulatory-crosswalks",
      },
      {
        number: 2,
        title: "Set service-level indicators of justice",
        description:
          "Define measurable commitments for appeal passage rates and non-retaliation, rather than intentions.",
        ctaLabel: "Explore SLJ metrics",
        ctaHref: "/glossary/service-level-indicators",
      },
      {
        number: 3,
        title: "Export contract clauses",
        description:
          "Generate vendor agreement terms for third-party AI procurement that a counterparty can be held to.",
        ctaLabel: "Generate SLA clauses",
        ctaHref: "/diagnostics/system-auditor",
      },
    ],
    guide: {
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
    adoptionChecklist: [
      "Bind contestability rights to explicit owner roles and response clocks.",
      "Define restitution pathways for harms that cannot be fully reversed.",
      "Set incident disclosure expectations for high-impact failures.",
      "Require sign-off authority for resume decisions after a halt.",
    ],
    featuredDiagnostics: ["system-auditor", "evidence-pack-readiness"],
    featuredStandards: ["std-01-temporal-rights", "std-06-harm-visibility"],
    formerPaths: ["/quick-start/policy-makers", "/adopt/policy"],
  },
  {
    id: "audit",
    label: "Audit and assurance",
    who: "You verify someone else's claims from the evidence their system emits.",
    tagline:
      "Check conformance from records, decision objects, and halt logs rather than from assurances.",
    orientation: [
      {
        number: 1,
        title: "Inspect the failure taxonomy",
        description:
          "Audit systems against observable failure signatures and the behaviours that counterfeit compliance.",
        ctaLabel: "Explore taxonomy",
        ctaHref: "/taxonomy",
      },
      {
        number: 2,
        title: "Verify evidence receipts",
        description:
          "Audit decision timestamps, binding clocks, and claimant confirmation records against what was claimed.",
        ctaLabel: "Inspect evidence packs",
        ctaHref: "/evidence-packs",
      },
      {
        number: 3,
        title: "Grade a record stream",
        description:
          "Read an emitted stream against the conformance level its own manifest declares, and see whether it earns it.",
        ctaLabel: "Open Record Conformance",
        ctaHref: "/diagnostics/record-conformance",
      },
    ],
    featuredDiagnostics: [
      "system-auditor",
      "record-conformance",
      "maintenance-simulator",
    ],
    featuredStandards: ["std-01-temporal-rights", "std-02-reversibility-slas"],
    formerPaths: [],
  },
  {
    id: "operations",
    label: "Operations",
    who: "You run the appeals, the incident response, or the queues where the system's errors land.",
    tagline:
      "Give escalation a bound and a named owner, so a stalled case surfaces instead of ageing.",
    adoptionChecklist: [
      "Define harm intake paths with explicit triage categories.",
      "Set escalation SLAs by severity and route to named responders.",
      "Track queue age and auto-escalate stalled cases.",
      "Publish a repair log with remediation status and owner handoffs.",
    ],
    featuredDiagnostics: ["burden-modeler", "capacity-forecaster"],
    formerPaths: ["/adopt/ops"],
  },
  {
    id: "design",
    label: "Design",
    who: "You shape the interface where a person meets the decision.",
    tagline:
      "Turn standards into consent-aware flows, escalation cues, and language a person can act on.",
    guide: {
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
    featuredDiagnostics: ["burden-modeler"],
    formerPaths: ["/quick-start/designers"],
  },
  {
    id: "research",
    label: "Research",
    who: "You study these systems and publish about them.",
    tagline:
      "Ground investigations in the glossary anchors the standards use, so findings can be cited back into them.",
    guide: {
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
    formerPaths: ["/quick-start/researchers"],
  },
  {
    id: "executive",
    label: "Executive",
    who: "You decide whether to deploy, and you carry the liability when it goes wrong.",
    tagline:
      "See the failure load a deployment commits the organisation to before it is committed.",
    orientation: [
      {
        number: 1,
        title: "Understand failure load and moral debt",
        description:
          "How hidden fragility subsidies and unearned closures compound into liability nobody budgeted for.",
        ctaLabel: "Read institutional principles",
        ctaHref: "/about",
      },
      {
        number: 2,
        title: "Forecast maintenance metabolism",
        description:
          "Model whether human capacity grows with the automated volume it is expected to absorb.",
        ctaLabel: "Run Capacity Forecaster",
        ctaHref: "/diagnostics/capacity-forecaster",
      },
      {
        number: 3,
        title: "Benchmark governance maturity",
        description:
          "Place the organisation on the scale from baseline pause controls to continuous care retrospectives.",
        ctaLabel: "Explore maturity scale",
        ctaHref: "/glossary/ethotechnic-maturity",
      },
    ],
    featuredDiagnostics: ["capacity-forecaster", "burden-modeler"],
    featuredStandards: ["std-01-temporal-rights"],
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
