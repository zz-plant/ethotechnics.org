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
      "Benefits and debt automation where an upheld challenge has to reach the rule's owner.",
    tags: ["Rule owners", "Contestability", "Restoration"],
    cardDescription:
      "Benefit and debt rules with named owners, an outside halt, and restoration before restart.",
  },
  {
    slug: "loan-approval",
    title: "Loan approval systems",
    summary:
      "Credit scoring where an applicant gets reasons, and a pattern of upheld challenges changes the rule.",
    tags: ["Stoppability", "Contestability", "Time-to-halt"],
    cardDescription:
      "Credit decisions with reasons, named owners, and challenges that reach the scoring rule.",
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
      "Clinical risk tools where clinicians' overrides are counted against the model's rule.",
    tags: ["Overrides", "Contestability", "Reversibility"],
    cardDescription:
      "Diagnostic tools whose overrides reach the model's owner, with patient challenges answered by a date.",
  },
  {
    slug: "fhir-resources",
    title: "FHIR resources for healthcare interop",
    summary:
      "Denials, appeals, and repair status as FHIR resources that payers, providers, and regulators share.",
    tags: ["Interoperability", "Repair status", "Decision clocks"],
    cardDescription:
      "FHIR profiles that make refusals, appeals, and repair clocks exchangeable data.",
  },
  {
    slug: "customer-service-chatbots",
    title: "Customer service chatbots",
    summary:
      "Support bots where reaching a person is a right, and failed requests count against the design.",
    tags: ["Contestability", "Stoppability", "Care floors"],
    cardDescription:
      "Support automation with a route to a person and a named owner for each hand-off.",
  },
  {
    slug: "retail-personalization",
    title: "Retail personalization",
    summary:
      "A boundary case. Most recommendations decide nothing a person could contest. Prices, credit offers, and job ads do.",
    tags: ["Boundary case", "Reasons", "Rollback"],
    cardDescription:
      "Recommendations a person can turn off, with challenges where targeting sets a price or an offer.",
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
    "Credit the Ethotechnics Institute, include the page title and version, and link to the canonical permalink.",
});
