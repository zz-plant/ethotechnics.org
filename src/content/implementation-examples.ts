import type { AnchorLink, PublicationMetadata } from "./types";

export const implementationExampleAnchorLinks: AnchorLink[] = [
  { href: "#overview", label: "Overview" },
  { href: "#standard", label: "Standard governance" },
  { href: "#ethotechnics", label: "Ethotechnics implementation" },
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
  published: "2026-01-25T00:00:00Z",
  updated: "2026-01-25T00:00:00Z",
  version: "v1.0.0",
  doi: "Pending Zenodo deposit",
  archiveUrl: `https://web.archive.org/web/*/https://ethotechnics.org${permalink}`,
  changelog: [
    {
      version: "v1.0.0",
      date: "2026-01-25",
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
