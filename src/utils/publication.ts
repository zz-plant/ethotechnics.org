import type { PublicationMetadata } from "../content/types";

export function derivePublicationMetadata({
  permalink,
  published,
  updated,
  version = "Draft",
  authorName = "Ethotechnics Standards Working Group",
  changelogSummary = "Published.",
}: {
  permalink: string;
  published: string;
  updated?: string;
  version?: string;
  authorName?: string;
  changelogSummary?: string;
}): PublicationMetadata {
  const resolvedUpdated = updated ?? published;
  const changelogDate = resolvedUpdated.split("T")[0];

  return {
    authors: [
      {
        name: authorName,
        affiliation: "Ethotechnics Institute",
        email: "standards@ethotechnics.org",
      },
    ],
    contact: "standards@ethotechnics.org",
    published,
    updated: resolvedUpdated,
    version,
    doi: "Pending Zenodo deposit",
    archiveUrl: `https://web.archive.org/save/https://ethotechnics.org${permalink}`,
    changelog: [
      {
        version,
        date: changelogDate,
        summary: changelogSummary,
      },
    ],
    license: {
      label: "CC BY 4.0",
      href: "https://creativecommons.org/licenses/by/4.0/",
    },
    attribution: `Credit Ethotechnics Institute ${authorName}, include the page title + version, and link to the canonical permalink.`,
  };
}
