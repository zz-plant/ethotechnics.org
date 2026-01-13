import { glossaryContent } from "../content/glossary";
import { libraryContent } from "../content/library";
import { standardClauses, standardsContent } from "../content/standards";
import { validatorsContent } from "../content/validators";

import { glossaryEntryPermalink } from "./glossary";

export const releaseInfo = {
  id: "2026.01",
  label: "2026.01",
  date: "2026-01-09",
  permalink: "/api/v/2026.01",
};

const standardSlugMap = new Map(
  standardsContent.standards.map((standard) => [standard.id, standard.slug]),
);

const extractMechanismId = (title: string, slug: string) => {
  const match = title.match(/MEC-\d+/);
  return match?.[0] ?? slug.toUpperCase();
};

export const buildClauseObject = (
  clause: (typeof standardClauses)[string][number],
) => {
  const standardSlug = standardSlugMap.get(clause.standardId);
  const href = standardSlug
    ? `/standards/${standardSlug}`
    : standardsContent.permalink;
  const refs = [
    clause.standardId,
    ...clause.relatedMechanisms,
    ...clause.relatedValidators,
  ];

  return {
    id: clause.id,
    type: "clause",
    clause_id: clause.id,
    standard_id: clause.standardId,
    display_id: clause.displayId,
    clause_type: clause.type,
    level: clause.requirementLevel,
    condition: clause.condition,
    obligation: clause.obligation,
    time_bound: clause.timeBound || null,
    evidence_required: clause.evidenceRequired,
    failure_modes: clause.failureModes ?? [],
    related_mechanisms: clause.relatedMechanisms,
    related_validators: clause.relatedValidators,
    href,
    refs,
    deprecated_by: null,
    supersedes: [],
  };
};

export const getClausesForApi = () =>
  standardsContent.standards.flatMap((standard) =>
    (standardClauses[standard.id] ?? []).map((clause) =>
      buildClauseObject(clause),
    ),
  );

export const getStandardsForApi = () =>
  standardsContent.standards.map((standard) => {
    const clauses = (standardClauses[standard.id] ?? []).map((clause) =>
      buildClauseObject(clause),
    );
    const clauseIds = clauses.map((clause) => clause.id);

    return {
      id: standard.id,
      type: "standard",
      title: standard.title,
      description: standard.description,
      status: standard.status,
      version: standard.version,
      effectiveDate: standard.effectiveDate,
      published: standard.published,
      href: `/standards/${standard.slug}`,
      clauses,
      clause_ids: clauseIds,
      refs: clauseIds,
      deprecated_by: null,
      supersedes: [],
    };
  });

export const getMechanismsForApi = () =>
  libraryContent.patterns.entries.map((pattern) => {
    const id = extractMechanismId(pattern.title, pattern.slug);

    return {
      id,
      type: "mechanism",
      slug: pattern.slug,
      title: pattern.title,
      summary: pattern.summary,
      filters: pattern.filters,
      glossary_refs: pattern.glossaryRefs,
      href: `/mechanisms/patterns/${pattern.slug}`,
      refs: pattern.glossaryRefs,
      deprecated_by: null,
      supersedes: [],
    };
  });

export const getValidatorsForApi = () =>
  validatorsContent.validators.map((validator) => ({
    id: validator.id,
    type: "validator",
    title: validator.title,
    description: validator.description,
    standardRef: validator.standardRef,
    href: `${validatorsContent.permalink}/${validator.slug}`,
    inputs: validator.inputs,
    thresholds: validator.thresholds,
    clauseRefs: validator.clauseRefs,
    mechanismRefs: validator.mechanismRefs,
    outputSchema: validator.outputSchema,
    refs: [
      validator.standardRef,
      ...validator.clauseRefs,
      ...validator.mechanismRefs,
    ],
    deprecated_by: null,
    supersedes: [],
  }));

export const getGlossaryEntriesForApi = () =>
  glossaryContent.categories.flatMap((category) =>
    category.entries.map((entry) => {
      const refs = [
        ...(entry.adjacentTerms ?? []),
        ...(entry.relatedPatterns ?? []),
        ...(entry.references?.map((reference) => reference.href) ?? []),
      ];

      return {
        id: entry.id,
        type: "glossary",
        title: entry.title,
        status: entry.status,
        category: {
          id: category.id,
          heading: category.heading,
        },
        tags: entry.tags ?? [],
        href: glossaryEntryPermalink(entry.id),
        refs,
        deprecated_by: null,
        supersedes: [],
      };
    }),
  );

export const getAntiPatternsForApi = () =>
  libraryContent.patterns.entries.flatMap((pattern) => {
    const mechanismId = extractMechanismId(pattern.title, pattern.slug);
    const mechanismHref = `/mechanisms/patterns/${pattern.slug}`;

    return (pattern.antiPatterns ?? []).map((antiPattern, index) => ({
      id: `${mechanismId}-AP-${index + 1}`,
      type: "anti-pattern",
      title: antiPattern.title,
      failure: antiPattern.failure,
      counterfactual: antiPattern.counterfactual,
      warning: antiPattern.warning,
      mechanism_id: mechanismId,
      mechanism_href: mechanismHref,
      related_mechanisms: [mechanismId],
      refs: [mechanismId],
      deprecated_by: null,
      supersedes: [],
    }));
  });

export const getEvidencePacksForApi = () =>
  getClausesForApi().map((clause) => ({
    id: `EP-${clause.clause_id}`,
    type: "evidence-pack",
    clause_id: clause.clause_id,
    standard_id: clause.standard_id,
    evidence_required: clause.evidence_required,
    minimum_bundle: clause.evidence_required,
    href: clause.href,
    refs: [clause.clause_id, clause.standard_id],
    deprecated_by: null,
    supersedes: [],
  }));

export const findingsCatalog = [
  {
    id: "FND-2026-001",
    type: "finding",
    summary: "Exit flow introduces retention script before allowing cancellation.",
    violated_clauses: ["STD-01.2.3"],
    impact: "Users cannot exit without additional friction or persuasion.",
    closure: "Remove retention gate and ensure one-step cancellation path.",
    severity: "high",
    confidence: 0.82,
    recommended_mechanisms: ["MEC-02"],
    refs: ["STD-01.2.3", "MEC-02"],
    deprecated_by: null,
    supersedes: [],
  },
  {
    id: "FND-2026-002",
    type: "finding",
    summary: "Queue wait times are hidden during high-volume spikes.",
    violated_clauses: ["STD-01.5.1"],
    impact: "Users lack legible expectations and cannot plan alternatives.",
    closure: "Expose queue position and wait estimates with a fallback SLA notice.",
    severity: "medium",
    confidence: 0.7,
    recommended_mechanisms: ["MEC-04"],
    refs: ["STD-01.5.1", "MEC-04"],
    deprecated_by: null,
    supersedes: [],
  },
];

export const diagnosticResultsCatalog = [
  {
    result_id: "DR-2026-01-001",
    generated_at: "2026-01-15T12:00:00Z",
    inputs: {
      validator_id: "VAL-01",
      duration: 22,
      steps: 6,
      exit: "no",
    },
    findings: ["FND-2026-001"],
    violated_clauses: ["STD-01.2.3"],
    recommended_mechanisms: ["MEC-02"],
    confidence: 0.82,
    severity: "high",
  },
];

export const getRagCorpusLines = (options?: { limit?: number }) => {
  const lines: string[] = [];
  const standards = getStandardsForApi();
  const clauses = getClausesForApi();
  const mechanisms = getMechanismsForApi();
  const validators = getValidatorsForApi();
  const glossary = getGlossaryEntriesForApi();

  standards.forEach((standard) => {
    lines.push(
      JSON.stringify({
        id: standard.id,
        type: "standard",
        version: releaseInfo.id,
        text: `${standard.title} — ${standard.description}`,
        object_refs: [standard.id, ...standard.clause_ids],
        href: standard.href,
      }),
    );
  });

  clauses.forEach((clause) => {
    lines.push(
      JSON.stringify({
        id: clause.clause_id,
        type: "clause",
        version: releaseInfo.id,
        text: `${clause.clause_id} (${clause.level}) when ${clause.condition}, ${clause.obligation}. Evidence: ${clause.evidence_required.join(", ")}.`,
        object_refs: [
          clause.clause_id,
          clause.standard_id,
          ...clause.related_mechanisms,
          ...clause.related_validators,
        ],
        href: clause.href,
      }),
    );
  });

  mechanisms.forEach((mechanism) => {
    lines.push(
      JSON.stringify({
        id: mechanism.id,
        type: "mechanism",
        version: releaseInfo.id,
        text: `${mechanism.title} — ${mechanism.summary}`,
        object_refs: [mechanism.id, ...mechanism.refs],
        href: mechanism.href,
      }),
    );
  });

  validators.forEach((validator) => {
    lines.push(
      JSON.stringify({
        id: validator.id,
        type: "validator",
        version: releaseInfo.id,
        text: `${validator.title} — ${validator.description}`,
        object_refs: validator.refs,
        href: validator.href,
      }),
    );
  });

  glossary.forEach((term) => {
    lines.push(
      JSON.stringify({
        id: term.id,
        type: "glossary",
        version: releaseInfo.id,
        text: `${term.title}`,
        object_refs: [term.id, ...term.refs],
        href: term.href,
      }),
    );
  });

  findingsCatalog.forEach((finding) => {
    lines.push(
      JSON.stringify({
        id: finding.id,
        type: "finding",
        version: releaseInfo.id,
        text: `${finding.summary} Impact: ${finding.impact} Closure: ${finding.closure}.`,
        object_refs: finding.refs,
      }),
    );
  });

  if (options?.limit && options.limit > 0) {
    return lines.slice(0, options.limit).join("\n");
  }

  return lines.join("\n");
};
