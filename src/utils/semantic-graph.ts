import { governanceCrosswalks } from "../content/crosswalks";
import { diagnosticsContent } from "../content/diagnostics";
import { glossaryContent, glossaryTerms } from "../content/glossary";
import { incidentLessons } from "../content/incidents";
import { standardClauses, standardsContent } from "../content/standards";

export type EntityType =
  | "standard"
  | "clause"
  | "mechanism"
  | "failure_mode"
  | "metric"
  | "diagnostic"
  | "incident"
  | "regulatory_crosswalk";

export interface SemanticNode {
  id: string;
  slug: string;
  type: EntityType;
  title: string;
  description: string;
  href: string;
  category?: string;
  regulatoryAnchors?: { framework: string; section: string }[];
  failureModesPrevented?: string[];
  mechanismsEnforcing?: string[];
  diagnosticsTesting?: string[];
  precedentIncidents?: string[];
  operationalMetric?: {
    name: string;
    symbol: string;
    targetThreshold: string;
  };
}

export interface ResolvedSemanticContext {
  node: SemanticNode;
  standards: SemanticNode[];
  mechanisms: SemanticNode[];
  failureModes: SemanticNode[];
  diagnostics: SemanticNode[];
  regulatoryCrosswalks: SemanticNode[];
  incidents: SemanticNode[];
}

// Build index of all standards
const standardsMap = new Map<string, SemanticNode>();
for (const std of standardsContent.standards) {
  standardsMap.set(std.slug, {
    id: std.id,
    slug: std.slug,
    type: "standard",
    title: `${std.id}: ${std.title}`,
    description: std.description,
    href: `/standards/${std.slug}`,
    category: "Standards",
  });
}

// Build index of diagnostic tools
const diagnosticsMap = new Map<string, SemanticNode>();
for (const tool of diagnosticsContent.tools) {
  diagnosticsMap.set(tool.slug, {
    id: tool.slug,
    slug: tool.slug,
    type: "diagnostic",
    title: tool.title,
    description: tool.description,
    href: `/diagnostics/${tool.slug}`,
    category: "Diagnostics",
  });
}

// Build index of glossary / failure mode terms from all entries
const termsMap = new Map<string, SemanticNode>();
const allCategoryEntries = glossaryContent.categories.flatMap((c) => c.entries);

for (const entry of allCategoryEntries) {
  const isFailure =
    entry.domains?.includes("patterns") ||
    entry.classes?.some((c) => c.toLowerCase().includes("failure")) ||
    entry.id.includes("failure") ||
    entry.id === "unearned-closure" ||
    entry.id === "heroism-dependent-systems" ||
    entry.id === "affect-invariance";

  const plainText = entry.bodyHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  termsMap.set(entry.id.toLowerCase(), {
    id: entry.id,
    slug: entry.id,
    type: isFailure ? "failure_mode" : "metric",
    title: entry.title,
    description: plainText.slice(0, 200),
    href: `/glossary/${entry.id}`,
    category: entry.domains?.[0] || "Knowledge",
    operationalMetric: entry.minimumEvidence?.metric
      ? {
          name: entry.minimumEvidence.metric,
          symbol: entry.minimumEvidence.metric.match(/\(([^)]+)\)/)?.[1] || "M",
          targetThreshold: entry.minimumEvidence.threshold || "Target SLA <= 24h",
        }
      : undefined,
  });
}

// Fallback addition for simple terms
for (const term of glossaryTerms) {
  if (!termsMap.has(term.slug.toLowerCase())) {
    termsMap.set(term.slug.toLowerCase(), {
      id: term.slug,
      slug: term.slug,
      type: "metric",
      title: term.term,
      description: term.definition,
      href: `/glossary/${term.slug}`,
      category: "Knowledge",
    });
  }
}

// Build index of regulatory crosswalks
const crosswalksMap = new Map<string, SemanticNode>();
for (const cw of governanceCrosswalks) {
  crosswalksMap.set(cw.controlId.toLowerCase(), {
    id: cw.controlId,
    slug: cw.controlId.toLowerCase(),
    type: "regulatory_crosswalk",
    title: `${cw.controlId}: ${cw.obligation}`,
    description: `EU AI Act: ${cw.euAiAct} | NIST: ${cw.nistAiRmf} | ISO: ${cw.iso42001}`,
    href: `/standards#regulatory-crosswalks`,
    category: "Regulatory Crosswalks",
  });
}

// Build index of incident case studies
const incidentsMap = new Map<string, SemanticNode>();
if (incidentLessons) {
  for (const inc of incidentLessons) {
    incidentsMap.set(inc.slug, {
      id: inc.slug,
      slug: inc.slug,
      type: "incident",
      title: inc.title,
      description: inc.summary,
      href: `/incidents/${inc.slug}`,
      category: "Incidents",
    });
  }
}

const allClauses = Object.values(standardClauses).flat();

/**
 * Resolves the full relational context around any entity in the Ethotechnics knowledge matrix.
 */
export function resolveSemanticContext(
  slugOrId: string,
): ResolvedSemanticContext | null {
  const normalized = slugOrId.toLowerCase().trim();

  const node =
    standardsMap.get(normalized) ||
    diagnosticsMap.get(normalized) ||
    termsMap.get(normalized) ||
    crosswalksMap.get(normalized) ||
    incidentsMap.get(normalized);

  if (!node) return null;

  // Find linked clauses
  const relatedClauses = allClauses.filter(
    (c) =>
      c.standardId.toLowerCase() === normalized ||
      c.failureModes?.some((fm) => fm.toLowerCase() === normalized) ||
      c.relatedMechanisms?.some((rm) => rm.toLowerCase() === normalized) ||
      c.relatedValidators?.some((rv) => rv.toLowerCase() === normalized),
  );

  const linkedStandards: SemanticNode[] = [];
  const linkedMechanisms: SemanticNode[] = [];
  const linkedFailureModes: SemanticNode[] = [];
  const linkedDiagnostics: SemanticNode[] = [];
  const linkedCrosswalks: SemanticNode[] = [];
  const linkedIncidents: SemanticNode[] = [];

  for (const clause of relatedClauses) {
    const std = standardsMap.get(clause.standardId.toLowerCase());
    if (std && !linkedStandards.some((s) => s.id === std.id)) {
      linkedStandards.push(std);
    }

    if (clause.failureModes) {
      for (const fm of clause.failureModes) {
        const term = termsMap.get(fm.toLowerCase());
        if (term && !linkedFailureModes.some((f) => f.id === term.id)) {
          linkedFailureModes.push(term);
        }
      }
    }
  }

  // Cross-reference default diagnostics if standard or failure mode
  if (node.type === "standard" || node.type === "failure_mode") {
    const sysAuditor = diagnosticsMap.get("system-auditor");
    if (sysAuditor) linkedDiagnostics.push(sysAuditor);
    const burdenModeler = diagnosticsMap.get("burden-modeler");
    if (burdenModeler) linkedDiagnostics.push(burdenModeler);
  }

  return {
    node,
    standards: linkedStandards,
    mechanisms: linkedMechanisms,
    failureModes: linkedFailureModes,
    diagnostics: linkedDiagnostics,
    regulatoryCrosswalks: linkedCrosswalks,
    incidents: linkedIncidents,
  };
}

export type UserRole = "engineer" | "policy" | "auditor" | "executive";

export interface RoleCuratedPath {
  role: UserRole;
  title: string;
  tagline: string;
  prioritySteps: {
    number: number;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  }[];
  featuredDiagnostics: string[];
  featuredStandards: string[];
}

export const roleCuratedPaths: Record<UserRole, RoleCuratedPath> = {
  engineer: {
    role: "engineer",
    title: "AI Engineers & Technical Architects",
    tagline: "Build safe, verifiable, and contestable decision systems with executable guardrails.",
    prioritySteps: [
      {
        number: 1,
        title: "Audit System Spec & Generate Guardrails",
        description:
          "Run the interactive System Auditor to detect failure modes and synthesize TypeScript/Python middleware.",
        ctaLabel: "Open System Auditor",
        ctaHref: "/diagnostics/system-auditor",
      },
      {
        number: 2,
        title: "Enforce STD-01: Temporal Rights & Recourse",
        description:
          "Implement deterministic time-to-halt, reversal SLAs, and decision object receipt structures.",
        ctaLabel: "Inspect STD-01 Spec",
        ctaHref: "/standards/std-01-temporal-rights",
      },
      {
        number: 3,
        title: "Model User Burden & Human Substitution",
        description:
          "Calculate cognitive load and ensure review capacity does not exceed operational ceilings.",
        ctaLabel: "Run Burden Modeler",
        ctaHref: "/diagnostics/burden-modeler",
      },
    ],
    featuredDiagnostics: ["system-auditor", "burden-modeler", "capacity-forecaster"],
    featuredStandards: ["std-01-temporal-rights", "std-02-reversibility-slas"],
  },
  policy: {
    role: "policy",
    title: "Policy, Compliance & Governance Leads",
    tagline: "Map technical requirements directly to EU AI Act, NIST AI RMF, and ISO 42001.",
    prioritySteps: [
      {
        number: 1,
        title: "Review Regulatory Crosswalks",
        description:
          "Examine line-by-line mappings between international AI legislation and testable technical controls.",
        ctaLabel: "View Crosswalk Matrix",
        ctaHref: "/standards#regulatory-crosswalks",
      },
      {
        number: 2,
        title: "Establish Service-Level Indicators of Justice (SLJs)",
        description:
          "Define measurable organizational SLAs for appeal passage rates and non-retaliation guarantees.",
        ctaLabel: "Explore SLJ Metrics",
        ctaHref: "/glossary/service-level-indicators",
      },
      {
        number: 3,
        title: "Export Contract Clauses",
        description:
          "Generate enforceable vendor agreement terms for third-party AI procurements.",
        ctaLabel: "Generate SLA Clauses",
        ctaHref: "/diagnostics/system-auditor",
      },
    ],
    featuredDiagnostics: ["system-auditor", "evidence-pack-readiness"],
    featuredStandards: ["std-01-temporal-rights", "std-06-harm-visibility"],
  },
  auditor: {
    role: "auditor",
    title: "Auditors & Forensic Evaluators",
    tagline: "Verify compliance through machine-verifiable evidence packs, decision objects, and halt logs.",
    prioritySteps: [
      {
        number: 1,
        title: "Inspect Ethotechnic Failure Taxonomy",
        description:
          "Audit systems against 80+ observable failure signatures and counterfeit behaviors.",
        ctaLabel: "Explore Taxonomy",
        ctaHref: "/taxonomy",
      },
      {
        number: 2,
        title: "Verify Evidence Artifact Receipts",
        description:
          "Audit decision timestamps, binding clocks, and verified claimant confirmation records.",
        ctaLabel: "Inspect Evidence Packs",
        ctaHref: "/evidence-packs",
      },
      {
        number: 3,
        title: "Run Governability Evals",
        description:
          "Execute benchmark test cases evaluating refusal tolerance and fail-safe transitions.",
        ctaLabel: "Launch Eval Runner",
        ctaHref: "/evals/runner",
      },
    ],
    featuredDiagnostics: ["system-auditor", "maintenance-simulator"],
    featuredStandards: ["std-01-temporal-rights", "std-02-reversibility-slas"],
  },
  executive: {
    role: "executive",
    title: "Product Leaders & Executives",
    tagline: "Prevent catastrophic liability, brand erosion, and operational burnout with ethical circuit breakers.",
    prioritySteps: [
      {
        number: 1,
        title: "Understand Failure Load & Moral Debt",
        description:
          "Discover how hidden fragility subsidies and unearned closures compound into severe regulatory fines.",
        ctaLabel: "Read Institutional Principles",
        ctaHref: "/about",
      },
      {
        number: 2,
        title: "Forecast Organizational Maintenance Metabolism",
        description:
          "Model human capacity to ensure automation scales sustainably without frontline burnout.",
        ctaLabel: "Run Capacity Forecaster",
        ctaHref: "/diagnostics/capacity-forecaster",
      },
      {
        number: 3,
        title: "Adopt Ethotechnics Maturity Model",
        description:
          "Benchmark institutional governance maturity from baseline pause controls to continuous care retrospectives.",
        ctaLabel: "Explore Maturity Scale",
        ctaHref: "/glossary/ethotechnic-maturity",
      },
    ],
    featuredDiagnostics: ["capacity-forecaster", "burden-modeler"],
    featuredStandards: ["std-01-temporal-rights"],
  },
};
