import type { AnchorLink, PublicationMetadata } from "./types";

export type ImplementationExample = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  cardDescription: string;
};

// Strongest fit first, by /use-cases: benefits, credit, health, agents, and
// the one boundary case last.
export const implementationExamples: ImplementationExample[] = [
  {
    slug: "public-services",
    title: "Government public services",
    summary:
      "Benefits and civic service automation that require community authority in the runtime.",
    tags: ["Design authority", "Contestability", "Recovery"],
    cardDescription:
      "Public sector automation with community veto authority and rapid restoration.",
  },
  {
    slug: "loan-approval",
    title: "Loan approval systems",
    summary:
      "Credit scoring and eligibility flows where stoppability and contestability must survive automation.",
    tags: ["Stoppability", "Contestability", "Time-to-halt"],
    cardDescription:
      "Credit scoring and eligibility workflows with enforceable stop authority.",
  },
  {
    slug: "financial-fraud-detection",
    title: "Financial fraud detection",
    summary:
      "Real-time account protection that must restore legitimate access on a deadline and on the record.",
    tags: ["Time-to-restore", "Receipt", "Repair log"],
    cardDescription:
      "Account protection systems that measure recovery time alongside detection.",
  },
  {
    slug: "healthcare-diagnostics",
    title: "Healthcare diagnostic AI",
    summary:
      "Clinical risk and diagnostic tools that require plural oversight and fast reversibility.",
    tags: ["Reversibility", "Safety valves", "Ethical interrupts"],
    cardDescription:
      "Clinical risk tools built around reversibility, stoppability, and plural oversight.",
  },
  {
    slug: "fhir-resources",
    title: "FHIR resources for healthcare interop",
    summary:
      "FHIR-native refusal, appeal, and repair signals that regulators, payers, and providers must share.",
    tags: ["Interoperability", "Repair status", "Decision clocks"],
    cardDescription:
      "FHIR profiles that make refusals, appeals, and repair clocks exchangeable data.",
  },
  {
    slug: "customer-service-chatbots",
    title: "Customer service chatbots",
    summary:
      "High-volume support systems where intervention speed matters more than automation confidence.",
    tags: ["Contestability", "Stoppability", "Care floors"],
    cardDescription:
      "High-volume support automation with guaranteed exit and recovery paths.",
  },
  {
    slug: "retail-personalization",
    title: "Retail personalization",
    summary:
      "Recommendation engines where users need direct control over automation behavior.",
    tags: ["Safety valves", "Stoppability", "Transparency"],
    cardDescription:
      "Recommendation systems that users can halt, with a direct halt path for advocates.",
  },
];

export const implementationExampleAnchorLinks: AnchorLink[] = [
  { href: "#overview", label: "Overview" },
  { href: "#standard", label: "Standard governance" },
  { href: "#ethotechnics", label: "Ethotechnics implementation" },
  { href: "#checklist", label: "Implementation checklist" },
  { href: "#fit", label: "Where this fits" },
  { href: "#citations", label: "Cite this page" },
];

export const createImplementationPublication = (
  permalink: string,
  summary: string,
): PublicationMetadata => ({
  authors: [
    {
      name: "Ethotechnics Institute",
      affiliation: "Ethotechnics Institute",
      email: "hello@ethotechnics.org",
    },
  ],
  contact: "hello@ethotechnics.org",
  published: "2025-02-01T00:00:00Z",
  updated: "2025-02-01T00:00:00Z",
  version: "v1.0.0",
  doi: "Pending Zenodo deposit",
  archiveUrl: `https://web.archive.org/web/*/https://ethotechnics.org${permalink}`,
  changelog: [
    {
      version: "v1.0.0",
      date: "2025-02-01",
      summary,
    },
  ],
  license: {
    label: "CC BY-SA 4.0",
    href: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  attribution:
    "Credit the Ethotechnics Institute, include page title + version, and link to the canonical permalink.",
});
