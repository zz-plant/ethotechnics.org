import type { AnchorLink, PublicationMetadata } from "./types";

export type ImplementationExample = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  cardDescription: string;
};

export const implementationExamples: ImplementationExample[] = [
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
    slug: "financial-fraud-detection",
    title: "Financial fraud detection",
    summary:
      "Real-time account protection that must restore legitimate access quickly and audibly.",
    tags: ["Time-to-restore", "Receipt", "Repair log"],
    cardDescription:
      "Account protection systems that measure recovery time alongside detection.",
  },
  {
    slug: "retail-personalization",
    title: "Retail personalization",
    summary:
      "Recommendation engines where users need direct control over automation behavior.",
    tags: ["Safety valves", "Stoppability", "Transparency"],
    cardDescription:
      "Recommendation systems with user stoppability and real-time advocate control.",
  },
  {
    slug: "public-services",
    title: "Government public services",
    summary:
      "Benefits and civic service automation that require community authority in the runtime.",
    tags: ["Design authority", "Contestability", "Recovery"],
    cardDescription:
      "Public sector automation with community veto authority and rapid restoration.",
  },
];

export const implementationExampleAnchorLinks: AnchorLink[] = [
  { href: "#overview", label: "Overview" },
  { href: "#standard", label: "Standard governance" },
  { href: "#ethotechnics", label: "Ethotechnics implementation" },
  { href: "#checklist", label: "Implementation checklist" },
  { href: "#citations", label: "Cite this page" },
];

export const createImplementationPublication = (
  permalink: string,
  summary: string,
): PublicationMetadata => ({
  authors: [
    {
      name: "Ethotechnics Standards Office",
      affiliation: "Ethotechnics Institute",
      email: "standards@ethotechnics.org",
    },
  ],
  contact: "standards@ethotechnics.org",
  published: "2025-02-01T00:00:00Z",
  updated: "2025-02-01T00:00:00Z",
  version: "v1.0.0",
  doi: "Pending Zenodo deposit",
  archiveUrl: `https://web.archive.org/save/https://ethotechnics.org${permalink}`,
  changelog: [
    {
      version: "v1.0.0",
      date: "2025-02-01",
      summary,
    },
  ],
  license: {
    label: "CC BY 4.0",
    href: "https://creativecommons.org/licenses/by/4.0/",
  },
  attribution:
    "Credit Ethotechnics Institute Standards Office, include page title + version, and link to the canonical permalink.",
});
