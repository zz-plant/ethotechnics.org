export type GlossaryFilterOption = {
  id: string;
  label: string;
};

export const glossaryDomainLabels: Record<string, string> = {
  temporal: "Temporal",
  visibility: "Visibility",
  agency: "Agency",
  burden: "Burden",
  patterns: "Patterns",
  measurable: "Measurable",
  structural: "Structural",
  diagnostic: "Diagnostic",
};

export const glossaryPhaseLabels: Record<string, string> = {
  design: "Design",
  deployment: "Deployment",
  audit: "Audit",
  repair: "Repair",
};

export const glossaryMeasurabilityLabels: Record<string, string> = {
  qualitative: "Qualitative",
  semi_quantitative: "Semi-quantitative",
  fully_measurable: "Fully measurable",
};

export const glossaryMaturityLabels: Record<string, string> = {
  core_concept: "Core concept",
  active_research: "Active research",
  speculative: "Speculative",
};

export const glossaryScaleLabels: Record<string, string> = {
  individual: "Individual",
  organizational: "Organizational",
  systemic: "Systemic",
};

export const glossaryDomainFilters: GlossaryFilterOption[] = [
  { id: "temporal", label: glossaryDomainLabels.temporal },
  { id: "visibility", label: glossaryDomainLabels.visibility },
  { id: "agency", label: glossaryDomainLabels.agency },
  { id: "burden", label: glossaryDomainLabels.burden },
  { id: "patterns", label: glossaryDomainLabels.patterns },
  { id: "measurable", label: glossaryDomainLabels.measurable },
  { id: "structural", label: glossaryDomainLabels.structural },
  { id: "diagnostic", label: glossaryDomainLabels.diagnostic },
];

export const glossaryPhaseFilters: GlossaryFilterOption[] = [
  { id: "design", label: glossaryPhaseLabels.design },
  { id: "deployment", label: glossaryPhaseLabels.deployment },
  { id: "audit", label: glossaryPhaseLabels.audit },
  { id: "repair", label: glossaryPhaseLabels.repair },
];

export const glossaryMeasurabilityFilters: GlossaryFilterOption[] = [
  { id: "qualitative", label: glossaryMeasurabilityLabels.qualitative },
  { id: "semi_quantitative", label: glossaryMeasurabilityLabels.semi_quantitative },
  { id: "fully_measurable", label: glossaryMeasurabilityLabels.fully_measurable },
];
