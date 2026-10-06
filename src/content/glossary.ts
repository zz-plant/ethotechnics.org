import type { PageWithPermalink, PublicationMetadata } from "./types";
import { glossaryContentData } from "./generated/glossary.generated";

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  appliesTo: string[];
  /**
   * `false` keeps the term out of the in-page highlighter. Set it on words
   * that already carry an everyday, legal, or engineering sense, where a
   * tooltip would hand them the site's narrower one: "settlement" in the
   * DSA's "dispute settlement body", "rollback" in an explainer for
   * engineers. The entry page, search, and links are unaffected.
   */
  autoHighlight?: false;
};

/**
 * A term with a glossary entry takes its definition from that entry, so it
 * carries none here. Only a term with no entry defines itself.
 */
type GlossaryTermSeed = Omit<GlossaryTerm, "definition"> & {
  definition?: string;
};

export type GlossaryTerritory = {
  id: string;
  label: string;
  tooltip: string;
};

export type GlossaryResource = {
  label: string;
  href: string;
  type: string;
};

export type GlossaryDomain =
  | "temporal"
  | "visibility"
  | "agency"
  | "burden"
  | "patterns"
  | "measurable"
  | "structural"
  | "diagnostic";

export type GlossaryScale = "individual" | "organizational" | "systemic";

export type GlossaryPhase = "design" | "deployment" | "audit" | "repair";

export type GlossaryMeasurability =
  "qualitative" | "semi_quantitative" | "fully_measurable";

export type GlossaryMaturity =
  "core_concept" | "active_research" | "speculative";

export type GlossaryMinimumEvidence = {
  artifact?: string;
  behavior?: string;
  metric?: string;
  definition?: string;
  unit?: string;
  dataSource?: string;
  calculation?: string;
  threshold?: string;
};

export type GlossaryEntry = {
  id: string;
  title: string;
  status: string | null;
  classes?: string[];
  bodyHtml: string;
  domains?: GlossaryDomain[];
  scale?: GlossaryScale | null;
  phase?: GlossaryPhase[];
  measurability?: GlossaryMeasurability | null;
  maturity?: GlossaryMaturity | null;
  clusters?: string[];
  legacyTerritory?: string;
  termUpdated?: string;
  termVersion?: string;
  termChangelog?: string;
  scope?: string;
  adjacentTerms?: string[];
  presenceChecks?: string[];
  missingExpectations?: string[];
  operationalTests?: string[];
  commonCounterfeits?: string[];
  minimumEvidence?: GlossaryMinimumEvidence;
  genealogy?: string;
  references?: GlossaryResource[];
  examples?: string[];
  tags?: string[];
  resources?: GlossaryResource[];
  relatedPatterns?: string[];
};

export type GlossaryCategory = {
  id: string;
  heading: string;
  descriptionHtml: string;
  comingSoon: boolean;
  entries: GlossaryEntry[];
};

export type GlossaryContent = PageWithPermalink & {
  publication: PublicationMetadata;
  territoryMap: GlossaryTerritory[];
  categories: GlossaryCategory[];
  starterTerms: { id: string; label: string; description: string }[];
  categoryHighlights: { id: string; label: string; description: string }[];
};

export const glossaryContent: GlossaryContent =
  glossaryContentData as GlossaryContent;

export const glossaryTermSeeds: GlossaryTermSeed[] = [
  {
    slug: "principle-of-non-expropriation-of-resilience",
    term: "Principle of non-expropriation of resilience",
    appliesTo: ["principles", "governance", "labor"],
  },
  {
    slug: "compensated-performance",
    term: "Compensated performance",
    appliesTo: ["monitoring", "operations", "failure-modes"],
  },
  {
    slug: "intrinsic-performance",
    term: "Intrinsic performance",
    appliesTo: ["measures", "evaluations", "benchmarking"],
  },
  {
    slug: "reciprocal-accommodation",
    term: "Reciprocal accommodation",
    appliesTo: ["institutions", "workplace", "governance"],
  },
  {
    slug: "extractive-cannibalism",
    term: "Extractive cannibalism",
    appliesTo: ["workplace", "hospitals", "platforms"],
  },
  {
    slug: "green-dashboard-trap",
    term: "Green dashboard trap",
    appliesTo: ["monitoring", "operations", "governance"],
  },
  {
    slug: "dual-ledger-evaluation",
    term: "Dual-ledger evaluation",
    appliesTo: ["auditing", "evaluations", "benchmarking"],
  },
  {
    slug: "systemic-refusal",
    term: "Systemic refusal",
    appliesTo: ["labor", "standing", "correction"],
  },
  {
    slug: "ethotechnics",
    term: "Ethotechnics",
    appliesTo: ["hospitals", "platforms", "governance"],
  },
  {
    slug: "moral-behavior",
    term: "Moral behavior (of systems)",
    appliesTo: ["platforms", "finance", "safety"],
  },
  {
    slug: "ethical-load-path",
    term: "Ethical load path",
    appliesTo: ["transit", "ops-teams", "oversight"],
  },
  {
    slug: "ethotechnic-audit",
    term: "Ethotechnic audit",
    appliesTo: ["platforms", "audits", "sre"],
  },
  {
    slug: "conviviality",
    term: "Conviviality",
    appliesTo: ["community", "platforms", "mutual-aid"],
  },
  {
    slug: "ethotechnic-maturity",
    term: "Ethotechnic maturity",
    appliesTo: ["rail", "sre", "maturity"],
  },
  {
    slug: "mechanism-first-analysis",
    term: "Mechanism-first analysis",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "architecture-over-values",
    term: "Architecture over values",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "state-plus-clocks-model",
    term: "State + clocks model",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "contestability-architecture",
    term: "Contestability architecture",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "control-loops-constraints-framing",
    term: "Control loops (constraints framing)",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "moral-latency",
    term: "Moral latency",
    appliesTo: ["hospitals", "automation", "latency"],
  },
  {
    slug: "accountability-diffusion",
    term: "Accountability diffusion",
    appliesTo: ["platforms", "governance", "hospitals"],
  },
  {
    slug: "extraction",
    term: "Extraction",
    autoHighlight: false,
    appliesTo: ["labor", "platforms", "ai"],
  },
  {
    slug: "extraction-by-endurance",
    term: "Extraction by endurance",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "drift",
    term: "Drift (system drift)",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "externalization",
    term: "Externalization",
    autoHighlight: false,
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "brittleness",
    term: "Brittleness",
    autoHighlight: false,
    appliesTo: ["aviation", "automation", "support"],
  },
  {
    slug: "optimization-myopia",
    term: "Optimization myopia",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "precision-laundering",
    term: "Precision laundering",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "compliance-collapse",
    term: "Compliance collapse",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "unseen-harm",
    term: "Unseen harm",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "ethics-debt",
    term: "Ethics debt",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "capability-overhang",
    term: "Capability overhang",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "stoppability",
    term: "Stoppability",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "reversibility",
    term: "Reversibility",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "fair-burden-distribution",
    term: "Fair burden distribution",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "contestability",
    term: "Contestability",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "refusability",
    term: "Refusability",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "explainability-for-accountability",
    term: "Explainability for accountability",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "human-refusal-tolerance",
    term: "Refusal-tolerant systems",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "graceful-degradation",
    term: "Graceful degradation",
    autoHighlight: false,
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "soft-edges",
    term: "Soft edges",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "fail-safe",
    term: "Fail-safe mode",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-open",
    term: "Fail-open mode",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "fail-silent",
    term: "Fail-silent mode",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "crumple-zone",
    term: "Crumple zone / human-as-crumple-zone",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "harm-visibility",
    term: "Harm visibility",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "dead-zones",
    term: "Dead zones / moral dead zones",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "escalation-horizon",
    term: "Escalation horizon",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "interaction-surface",
    term: "Interaction surface",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "bifurcation-by-contestability",
    term: "Bifurcation by contestability",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "maintenance-window",
    term: "Maintenance window",
    autoHighlight: false,
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "care-retrospective",
    term: "Care retrospective",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "repair-log",
    term: "Repair log",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "finitude",
    term: "Finitude",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "cognitive-saturation",
    term: "Cognitive saturation point",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "compassion-bandwidth",
    term: "Compassion bandwidth",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "administrative-shame",
    term: "Administrative shame",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "dread-work",
    term: "Dread work",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "executive-function-class-axis",
    term: "Executive function (as a class axis)",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "human-factors",
    term: "Human factors",
    autoHighlight: false,
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "operator-centered",
    term: "Operator-centered",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "refusal-budget",
    term: "Refusal budget",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "burden-distribution",
    term: "Burden distribution",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-gradient",
    term: "Burden gradient",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "failure-load",
    term: "Failure load",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-transfer-event",
    term: "Burden transfer event",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "cost-assignment",
    term: "Cost assignment / burden shifting",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "attention-tax",
    term: "Attention tax",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-metabolism",
    term: "Maintenance metabolism",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-debt",
    term: "Maintenance debt",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-overhead",
    term: "Moral overhead",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "temporal-exaction",
    term: "Temporal exaction",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-index",
    term: "Burden index",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "burden-ceiling",
    term: "Burden ceiling",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "asymmetric-sustaining",
    term: "Asymmetric sustaining",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "fragility-subsidy",
    term: "Fragility subsidy",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "moral-performance-indicators",
    term: "Moral performance indicators (MPIs)",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "service-level-indicators",
    term: "Service-level indicators of justice (SLJs)",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "recourse-performance",
    term: "Recourse performance",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "institutional-metabolism-mapping",
    term: "Institutional metabolism mapping",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-halt",
    term: "Time-to-halt (TTH)",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "time-to-restore",
    term: "Time-to-restore (TTR)",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "appeal-passage-rate",
    term: "Appeal passage rate",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "irreversibility-index",
    term: "Irreversibility index",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "irreversibility-budget",
    term: "Irreversibility budget",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "user-burden-ratio",
    term: "User burden ratio",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "human-substitution-index",
    term: "Human substitution index",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "signal-credibility",
    term: "Signal credibility",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "reversal-cost",
    term: "Reversal cost",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "durability-of-error",
    term: "Durability of error",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "moral-debt",
    term: "Moral debt",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "design-authority",
    term: "Design authority",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "oversight-horizon",
    term: "Oversight horizon",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contestability-legitimacy-hinge",
    term: "Contestability as the legitimacy hinge",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "maintenance-budgets-legitimacy-budgets",
    term: "Maintenance budgets are legitimacy budgets",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "receipts-by-default",
    term: "Receipts-by-default as a legitimacy interface",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "sovereignty-constraint-imposition",
    term: "Sovereignty as constraint-imposition capacity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standards-wars-recourse-wars",
    term: "Standards wars as recourse wars",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "democratic-vs-coercive-governability",
    term: "Democratic vs coercive governability",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "permission-surface",
    term: "Permission surface",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "earned-autonomy",
    term: "Earned autonomy",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "right-of-exit",
    term: "Right of exit",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "externalized-harm-channels",
    term: "Externalized harm channels",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "stewardship-window",
    term: "Stewardship window",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "governance-by-suspension",
    term: "Governance by suspension",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "endurance-asymmetry",
    term: "Endurance asymmetry",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-privilege",
    term: "Continuity privilege",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "proxy-privilege",
    term: "Proxy privilege",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "latency-as-action",
    term: "Latency-as-action",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bounded-duration",
    term: "Bounded duration",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "continuity-of-state",
    term: "Continuity of state",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "safe-pause",
    term: "Safe pause / status quo during pendency",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "traceable-ownership",
    term: "Traceable ownership",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "time-transparency",
    term: "Time transparency",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bindingness",
    term: "Bindingness",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "non-bindingness",
    term: "Non-bindingness / nonbindingness",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standing-vs-belief",
    term: "Standing (vs belief)",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "binding-authority",
    term: "Binding authority",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "evidence-parity",
    term: "Evidence parity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-chain",
    term: "Authority chain",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-mutation",
    term: "Authority mutation",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "defaults-as-governance",
    term: "Defaults (as governance)",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-caste",
    term: "Procedural caste",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "escalation-without-authority",
    term: "Escalation (without authority)",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "redress",
    term: "Redress",
    autoHighlight: false,
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "override-path",
    term: "Override path",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "structured-exit",
    term: "Structured exit",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "paywalled-rights",
    term: "Paywalled rights",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "logs-as-power",
    term: "Logs-as-power",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "audit-trail",
    term: "Audit trail",
    autoHighlight: false,
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "administrative-reality",
    term: "Administrative reality",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "contract-of-adhesion",
    term: "Contract of adhesion",
    autoHighlight: false,
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "nda-retaliation-narrative-erasure",
    term: "NDA retaliation / narrative erasure",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "protective-friction",
    term: "Protective friction",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "punitive-friction",
    term: "Punitive friction",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "dignity-friction",
    term: "Dignity friction",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "velocity-friction",
    term: "Velocity friction",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "safety-valve",
    term: "Safety valve",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "consent-journey",
    term: "Consent journey",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "coercive-consent",
    term: "Coercive consent",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "humane-friction",
    term: "Humane friction",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "appropriate-friction",
    term: "Appropriate friction",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "frictionless-harm",
    term: "Frictionless harm",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "decision-edge",
    term: "Decision edge",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-surface",
    term: "Decision surface",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-artifact",
    term: "Decision artifact",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "decision-object",
    term: "Decision object",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "object-formation",
    term: "Object formation",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-decision",
    term: "Non-decision",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "pendingness",
    term: "Pending / pendingness",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "settlement",
    term: "Settlement",
    autoHighlight: false,
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-settlement",
    term: "Non-settlement / nonsettlement",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "stable-clock",
    term: "Stable clock",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "clock-start-clock-mismatch",
    term: "Clock-start / clock mismatch",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "slow-redress-fast-execution",
    term: "Slow redress / fast execution",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-window",
    term: "Utility window",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "utility-expiry",
    term: "Utility expiry",
    definition:
      "The point after which relief arrives too late to help. Reaching it should count as a refusal, or trigger repair.",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "futility-threshold",
    term: "Futility threshold",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "constructive-denial",
    term: "Constructive denial",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "critical-action",
    term: "Critical action",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "irreversibility",
    term: "Irreversibility",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "irreversible-boundary",
    term: "Irreversible boundary",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "backstop",
    term: "Backstop",
    autoHighlight: false,
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "rollback",
    term: "Rollback",
    autoHighlight: false,
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "auto-close-auto-renew-auto-share",
    term: "Auto-close / auto-renew / auto-share",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "ethical-interrupts",
    term: "Ethical interrupts",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "heroism-dependent-systems",
    term: "Heroism-dependent systems",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "empathy-surrogacy",
    term: "Empathy surrogacy",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "error-cascades",
    term: "Error cascades",
    autoHighlight: false,
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "invisible-fallbacks",
    term: "Invisible fallbacks",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "dead-user-zones",
    term: "Dead-user zones",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "moral-lock-in",
    term: "Moral lock-in",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "legitimacy-laundering",
    term: "Legitimacy laundering",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "polite-coercion",
    term: "Polite coercion",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "documentation-loop",
    term: "Documentation loop / resubmission loop",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "precision-demands",
    term: "Precision demands",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "procedural-alibi",
    term: "Procedural alibi",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "tone-policing",
    term: "Tone policing (as governance technology)",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "dropout-as-legitimation",
    term: "Dropout-as-legitimation",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "churn-as-closure",
    term: "Churn (as closure mechanism)",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "paper-compliance",
    term: "Paper compliance / checkbox governance",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "transparency-theater",
    term: "Transparency theater",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "explainability-decoy",
    term: "Explainability decoy",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "human-in-the-loop-legitimacy",
    term: "Human-in-the-loop (as legitimacy artifact)",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "moral-drift-control",
    term: "Moral drift control",
    definition:
      "Monitoring that detects when a system drifts from what it was authorized to do, from its halt, reversal, and appeal measures or from reports by affected people, and triggers a halt or a design change.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "structural-gentleness-coefficients",
    term: "Structural gentleness coefficients",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "burden-elasticity",
    term: "Burden elasticity",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "care-redundancy",
    term: "Care redundancy",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "meta-contestability",
    term: "Meta-contestability",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "user-state-modeling",
    term: "User-state modeling for harm prevention",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethical-latency",
    term: "Design for ethical latency",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "distributed-accountability-protocols",
    term: "Distributed accountability protocols",
    definition:
      "Coordination methods that keep a named owner attached to work as it moves across teams and automation: shared playbooks, auditable handoffs, and repair logs. They keep responsibility from dissolving at handoffs.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethotechnic-failure-taxonomy",
    term: "Ethotechnic failure taxonomy",
    definition:
      "A shared classification of the ways systems fail people, such as chasing one metric, breaking under ordinary variation, and taking value without return, so incidents can be compared, learned from, and prevented.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "adaptive-refusal-pathways",
    term: "Adaptive refusal pathways",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "aftercare-automation",
    term: "Aftercare automation",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "alignment-dividend",
    term: "Alignment dividend",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ambiguity-budgets",
    term: "Ambiguity budgets",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "anticipatory-consent",
    term: "Anticipatory consent",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "boundary-of-acceptable-harm",
    term: "Boundary of acceptable harm",
    definition:
      "Thresholds, revised as conditions change, that mark where harm exceeds the system\u2019s mandate and operations must halt or escalate. Each is tied to a fairness or safety measure and enforced by an automatic stop.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "care-floor-guarantees",
    term: "Care floor guarantees",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "compassion-telemetry",
    term: "Compassion telemetry",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "conflict-observability",
    term: "Conflict observability",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "counter-abuse-guardrails",
    term: "Counter-abuse guardrails",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "crisis-rehearsal-loops",
    term: "Crisis rehearsal loops",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "data-dignity-budgets",
    term: "Data dignity budgets",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "decision-debt-ledger",
    term: "Decision debt ledger",
    definition:
      "A register of deferred decisions and the harm each one accrues while it waits, reviewed before that harm compounds. It sets the work for scheduled maintenance and informs halt, reversal, and appeal measures.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "downstream-equity-buffers",
    term: "Downstream equity buffers",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethical-circuit-breakers",
    term: "Ethical circuit breakers",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "ethical-load-testing",
    term: "Ethical load testing",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "exhaustion-triggers",
    term: "Exhaustion triggers",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "friction-budgets",
    term: "Friction budgets",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "graceful-rollback-lanes",
    term: "Graceful rollback lanes",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "harm-amnesty-windows",
    term: "Harm amnesty windows",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "heat-maps-of-refusal",
    term: "Heat maps of refusal",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "human-override-lanes",
    term: "Human override lanes",
    definition:
      "Guaranteed routes for a person to overrule automation when stakes are high or context is missing. They sit beside automatic halts and need a clear record of who can stop, reverse, or repair harm.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "incident-memory-chains",
    term: "Incident memory chains",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "moral-dry-runs",
    term: "Moral dry runs",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "moral-feature-gating",
    term: "Moral feature gating",
    definition:
      "Controls that block a feature launch until it is ready: an oversight plan, a way for people to challenge its decisions, and baseline commitments it keeps during outages.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "pathways-to-restitution",
    term: "Pathways to restitution",
    definition:
      "Documented steps a system must take to repair harm: acknowledgment, remedy, verification, and follow-up. They pay down harm not yet repaired, and they belong in the repair log.",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "refusal-aware-routing",
    term: "Refusal-aware routing",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "relief-invariants",
    term: "Relief invariants",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "repair-quorums",
    term: "Repair quorums",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "rest-cycle-enforcement",
    term: "Rest cycle enforcement",
    appliesTo: ["L. Open research areas"],
  },
  {
    slug: "conservancy-principle",
    term: "The conservancy principle",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "burden-inversion-rule",
    term: "The burden inversion rule",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "stop-before-explain-rule",
    term: "The stop-before-explain rule",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "maintenance-doctrine",
    term: "The maintenance doctrine",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "low-failure-load-principle",
    term: "The principle of low-failure-load design",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "reversibility-mandate",
    term: "The reversibility mandate",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "contestability-guarantee",
    term: "The contestability guarantee",
    definition:
      "A commitment that people affected by a system's decisions can challenge them and change the outcome. It shows in appeals that often succeed and in a visible owner of the system's rules.",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "complexity-displacement",
    term: "Complexity displacement",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "closure-without-remainder",
    term: "Closure without remainder",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "residual-complexity",
    term: "Residual complexity",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "falsified-denominator",
    term: "Falsified denominator",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "constitutional-governance",
    term: "Constitutional governance",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "post-optimization-rigor",
    term: "Post-optimization rigor",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "legibility",
    term: "Legibility",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "sociotechnical-alignment",
    term: "Sociotechnical alignment",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "delegated-agency",
    term: "Delegated agency",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "consequential-decision",
    term: "Consequential decision",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "decision-system",
    term: "Decision system",
    autoHighlight: false,
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "justified-delegation",
    term: "Justified delegation",
    appliesTo: ["A. Core concepts"],
  },
  {
    slug: "unowned-harm",
    term: "Unowned harm",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "ethics-theater",
    term: "Ethics theater",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "authority-drift",
    term: "Authority drift",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "automation-ratchet",
    term: "Automation ratchet",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "institutional-capture",
    term: "Institutional capture",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "rubber-stamp-review",
    term: "Rubber-stamp review",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "normalized-dependence",
    term: "Normalized dependence",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "capacity-depreciation",
    term: "Capacity depreciation",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "jurisdictional-path-dependence",
    term: "Jurisdictional path dependence",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "exception-absorption",
    term: "Exception absorption",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "workaround-presumption",
    term: "Workaround presumption",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "preserved-dependence",
    term: "Preserved dependence",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "externalization-capacity",
    term: "Externalization Capacity",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "authored-boundary",
    term: "Authored Boundary",
    appliesTo: ["B. Failure modes (why Ethotechnics exists)"],
  },
  {
    slug: "discretion-migration",
    term: "Discretion migration",
    appliesTo: ["B. Failure modes"],
  },
  {
    slug: "governability",
    term: "Governability",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "incident-literacy",
    term: "Incident literacy",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "capability-discovery",
    term: "Capability discovery",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "correction-capacity",
    term: "Correction capacity",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "technical-reversibility",
    term: "Technical reversibility",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "operational-reversibility",
    term: "Operational reversibility",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "institutional-reversibility",
    term: "Institutional reversibility",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "intervention-specification",
    term: "Intervention specification",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "prospective-auditability",
    term: "Prospective auditability",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "evaluation-independence",
    term: "Evaluation independence",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "exception-learning",
    term: "Exception learning",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "case-corrigibility",
    term: "Case corrigibility",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "structural-corrigibility",
    term: "Structural corrigibility",
    definition:
      "The capacity to modify the machinery that keeps producing failures: repeated exceptions change the rule, category, workflow, or authority generating them.",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "institutional-learning",
    term: "Institutional learning",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "corrective-debt",
    term: "Corrective debt",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "abstention",
    term: "Abstention",
    autoHighlight: false,
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "constitutional-debt",
    term: "Constitutional debt",
    appliesTo: ["C. What a system must be able to do"],
  },
  {
    slug: "restoration-completeness",
    term: "Restoration completeness",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "downstream-harm-trace",
    term: "Downstream harm trace",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "shadow-queue",
    term: "Shadow queue",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "grant-state",
    term: "Grant state",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "capability-catalog",
    term: "Capability catalog",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "dependency-state",
    term: "Dependency state",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "substrate-profile",
    term: "Substrate profile",
    appliesTo: ["D. System states & architectures"],
  },
  {
    slug: "virtue-as-access-control",
    term: "Virtue as access control",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "affect-invariance",
    term: "Affect-invariance",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "behavioral-shaping",
    term: "Behavioral shaping",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "error-bearing-party",
    term: "Error-bearing party",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "adaptive-capacity",
    term: "Adaptive capacity",
    appliesTo: ["E. Human limits & experience"],
  },
  {
    slug: "degradation-restoration-asymmetry",
    term: "Degradation/restoration asymmetry",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "endurance-as-allocation",
    term: "Endurance-as-allocation",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "stamina-pricing",
    term: "Stamina pricing",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "harm-internalization",
    term: "Harm internalization",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "maintenance-ethics",
    term: "Maintenance ethics",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "channel-switching-penalty",
    term: "Channel switching penalty",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "evidence-burden-ceiling",
    term: "Evidence burden ceiling",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "evidence-recycling",
    term: "Evidence recycling",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "verification-harm",
    term: "Verification harm",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "compensatory-adaptation",
    term: "Compensatory adaptation",
    appliesTo: ["F. Burden & load"],
  },
  {
    slug: "composed-latency",
    term: "Composed latency",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "silent-harm-discovery",
    term: "Silent-harm discovery",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "identity-fragility-index",
    term: "Identity fragility index",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "consent-revocation-latency",
    term: "Consent revocation latency",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "repair-debt-interest-rate",
    term: "Repair debt interest rate",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "exposure-score",
    term: "Exposure score",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "substitution-cost",
    term: "Substitution cost",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "evaluation-layer",
    term: "Evaluation layer",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "exit-cost",
    term: "Exit cost",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "challenge-density",
    term: "Challenge density",
    appliesTo: ["G. Measures & indicators"],
  },
  {
    slug: "attestation",
    term: "Attestation",
    autoHighlight: false,
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "liability-record",
    term: "Liability record",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "carve-out",
    term: "Carve-out",
    autoHighlight: false,
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "delegation-chain",
    term: "Delegation chain",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bounded-autonomy",
    term: "Bounded autonomy",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "scope-discipline",
    term: "Scope discipline",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "stewardship",
    term: "Stewardship",
    autoHighlight: false,
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "obligation-continuity",
    term: "Obligation continuity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "delay-as-power",
    term: "Delay as power",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "performance-gated-remedy",
    term: "Performance-gated remedy",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "bindingness-after-contact",
    term: "Bindingness after contact",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "recognition-as-solvent",
    term: "Recognition as solvent",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "unowned-obligation",
    term: "Unowned obligation",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "closure-code-regime",
    term: "Closure-code regime",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "attrition-as-resolution",
    term: "Attrition-as-resolution",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "legitimacy-engineering",
    term: "Legitimacy engineering",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "exit-coercion",
    term: "Exit coercion",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "retaliation-surface",
    term: "Retaliation surface",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "non-retaliation-guarantee",
    term: "Non-retaliation guarantee",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "appeal-integrity",
    term: "Appeal integrity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "escalation-reliability",
    term: "Escalation reliability",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "decision-reversal-authority",
    term: "Decision reversal authority",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "restitution-ladder",
    term: "Restitution ladder",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "remedy-equivalence",
    term: "Remedy equivalence",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "case-ownership-continuity",
    term: "Case ownership continuity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "revisable-delegation",
    term: "Revisable delegation",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-grant",
    term: "Authority grant",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "authority-lease",
    term: "Authority lease",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "policy-record",
    term: "Policy record",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "review-trigger",
    term: "Review trigger",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "correction-obligation",
    term: "Correction obligation",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "preserved-capacity",
    term: "Preserved capacity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "corrective-standing",
    term: "Corrective standing",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "standing-mechanism",
    term: "Standing mechanism",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-force",
    term: "Procedural force",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "consent-depth",
    term: "Consent depth",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "corrigibility-rent",
    term: "Corrigibility rent",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "insulation",
    term: "Insulation",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "consequential-contradiction",
    term: "Consequential contradiction",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "halt-stratification",
    term: "Halt stratification",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "admission-gate",
    term: "Admission gate",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "dependence-reciprocity",
    term: "Dependence reciprocity",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "corrective-power",
    term: "Corrective power",
    appliesTo: ["H. Governance & power"],
  },
  {
    slug: "procedural-burden-as-price",
    term: "Procedural burden as price",
    appliesTo: ["I. Friction & flow"],
  },
  {
    slug: "binding-clock",
    term: "Binding clock",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "reversal-sla",
    term: "Reversal SLA",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "unearned-closure",
    term: "Unearned closure",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "actionability-threshold",
    term: "Actionability threshold",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "normative-uncertainty",
    term: "Normative uncertainty",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "harm-receipt",
    term: "Harm receipt",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "access-cliff",
    term: "Access cliff",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "expansion-decision",
    term: "Expansion decision",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "non-finality",
    term: "Non-finality",
    appliesTo: ["J. Decision states & edges"],
  },
  {
    slug: "withdrawal-rehearsal",
    term: "Withdrawal rehearsal",
    appliesTo: ["K. Patterns & anti-patterns"],
  },
  {
    slug: "policy-as-state",
    term: "Policy as state",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "meaningful-control",
    term: "Meaningful control",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "non-conversion-principle",
    term: "The non-conversion principle",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "human-non-substitutability",
    term: "Human non-substitutability",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "safe-incompleteness",
    term: "Safe incompleteness",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "anti-conversion-rights",
    term: "Anti-conversion rights",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "excluded-case",
    term: "The excluded case",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "feedback-proximity",
    term: "Feedback proximity",
    appliesTo: ["M. Foundational principles"],
  },
  {
    slug: "asymmetric-capacity-restraint",
    term: "Asymmetric-capacity restraint",
    appliesTo: ["M. Foundational principles"],
  },
];

/**
 * Tooltips used to carry their own definitions, written apart from the
 * entries, and about 150 of 367 had drifted from the entry they link to: the
 * Contestability tooltip defined it as forcing "a decision to become a
 * contestable object" while the entry said a person can challenge the
 * decision and win. A tooltip now shows its entry's opening sentence, so the
 * two cannot disagree, and a seed with an entry carries no definition of its
 * own to drift. Only the terms with no entry define themselves above.
 */
const LABEL_SENTENCE = /^(normative|informative) definition\.$/i;
const plainText = (html: string): string =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
// A sentence can end inside a closing quote or bracket: "mislabeled as
// “resilience.” Ethotechnic practice…". Without the closing marks the first
// sentence failed to match and the tooltip opened on a stray ” mid-entry.
const SENTENCE = /[^.!?]+[.!?]+["”’)\]]*(?=\s|$)/g;
const openingSentence = (html: string): string => {
  const sentences = (plainText(html).match(SENTENCE) ?? [])
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !LABEL_SENTENCE.test(sentence));
  let lead = "";
  for (const sentence of sentences) {
    lead = lead ? `${lead} ${sentence}` : sentence;
    if (lead.length >= 60) break;
  }
  return lead;
};
const entryLeadById = new Map(
  glossaryContent.categories
    .flatMap((category) => category.entries)
    .map((entry) => [entry.id, openingSentence(entry.bodyHtml)]),
);

export const glossaryTerms: GlossaryTerm[] = glossaryTermSeeds.map((term) => ({
  ...term,
  definition: entryLeadById.get(term.slug) || term.definition || "",
}));
