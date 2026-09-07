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
          targetThreshold:
            entry.minimumEvidence.threshold || "Target SLA <= 24h",
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
