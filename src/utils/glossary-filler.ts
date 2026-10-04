/**
 * Text that was generated from the term rather than written about it.
 *
 * The glossary carried three families of it: an "operational test" that read
 * "Teams can point to a concrete example that demonstrates X in practice", a
 * "genealogy" that said the term extends its own category's vocabulary, and a
 * minimum-evidence triple built by slotting the title into three fixed
 * sentences. Each one passed for content while saying the same thing about
 * every term, and the operational tests published 324 pages of it.
 *
 * They were removed. These patterns exist so a generator cannot quietly put
 * them back: the glossary validator fails the build on a match, which is the
 * check the site's own standards would ask for.
 */
export const GLOSSARY_FILLER_PATTERNS: { label: string; pattern: RegExp }[] = [
  {
    label: "operational test generated from the term",
    pattern:
      /^Evidence appears in documentation, interface cues, or governance artifacts that reflect .+\.$/,
  },
  {
    label: "operational test generated from the term",
    pattern:
      /^Teams can point to a concrete example that demonstrates .+ in practice\.$/,
  },
  {
    label: "genealogy generated from the category",
    pattern:
      /^Ethotechnics uses .+ to extend the .+ vocabulary and connect governance, design, and policy teams\.$/,
  },
  {
    label: "minimum-evidence artifact generated from the term",
    pattern:
      /^Artifact documenting how .+ is expected, enforced, or governed\.$/,
  },
  {
    label: "minimum-evidence behavior generated from the term",
    pattern:
      /^Observed behavior showing .+ in practice during real use or drills\.$/,
  },
  {
    label: "minimum-evidence metric generated from the term",
    pattern: /^Metric tracked to monitor .+ performance over time\.$/,
  },
];

export type GlossaryFillerCandidate = {
  operationalTests?: string[];
  genealogy?: string;
  minimumEvidence?: {
    artifact?: string;
    behavior?: string;
    metric?: string;
  };
};

/** The generated strings this entry carries, as "field: reason" lines. */
export const findGlossaryFiller = (
  entry: GlossaryFillerCandidate,
): string[] => {
  const candidates: { field: string; value: string | undefined }[] = [
    ...(entry.operationalTests ?? []).map((value, index) => ({
      field: `operationalTests[${index}]`,
      value,
    })),
    { field: "genealogy", value: entry.genealogy },
    {
      field: "minimumEvidence.artifact",
      value: entry.minimumEvidence?.artifact,
    },
    {
      field: "minimumEvidence.behavior",
      value: entry.minimumEvidence?.behavior,
    },
    { field: "minimumEvidence.metric", value: entry.minimumEvidence?.metric },
  ];

  return candidates.flatMap(({ field, value }) => {
    if (!value) return [];
    const match = GLOSSARY_FILLER_PATTERNS.find((filler) =>
      filler.pattern.test(value),
    );
    return match ? [`${field}: ${match.label}`] : [];
  });
};
