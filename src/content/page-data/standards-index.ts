import type {
  DoctrineEntry,
  StandardEntry,
  StandardsContent,
} from "../standards";
import type { ImplementationExample } from "../implementation-examples";

export type StandardsCardModel = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
};

export type StandardsGroupDefinition = {
  title: string;
  description: string;
  ids: string[];
};

export type StandardsGroupModel = StandardsGroupDefinition & {
  lane: "core" | "implementation" | "reference";
  items: StandardEntry[];
};

export type StandardsFilterOption = "all" | "core" | "implementation" | "reference";

export type StandardsGroupingModel = {
  activeStandards: StandardEntry[];
  mostCitedStandards: StandardEntry[];
  mostCitedStandardIds: string[];
  recentlyUpdatedStandards: StandardEntry[];
  standardsGrouping: StandardsGroupModel[];
  standardsFilterOptions: StandardsFilterOption[];
  standardsLaneById: Map<string, StandardsGroupModel["lane"]>;
  standardsLaneCounts: Record<StandardsFilterOption, number>;
};

const adoptedStandards: StandardsCardModel[] = [
  {
    eyebrow: "OECD",
    title: "OECD AI Principles",
    description:
      "Principles-based guidance that lacks binding stop authority and time-bounded remediation.",
    href: "/standards/oecd-ai-principles",
  },
  {
    eyebrow: "NIST",
    title: "NIST AI RMF 1.0",
    description:
      "Risk management maturity without mandatory rollback, halt, or restoration guarantees.",
    href: "/standards/nist-ai-rmf",
  },
  {
    eyebrow: "ISO",
    title: "ISO/IEC 42001",
    description:
      "Management-system certification that can miss runtime stoppability requirements.",
    href: "/standards/iso-iec-42001",
  },
  {
    eyebrow: "EU",
    title: "EU AI Act",
    description:
      "Regulatory compliance framework where enforcement is slower than machine-speed harm.",
    href: "/standards/eu-ai-act",
  },
  {
    eyebrow: "Corporate",
    title: "Responsible AI programs",
    description:
      "Internal principles and review boards that rarely grant stop rights to the affected.",
    href: "/standards/corporate-responsible-ai",
  },
  {
    eyebrow: "Meta-critique",
    title: "Governance by control",
    description:
      "The core Ethotechnics critique: representation without enforceable control planes.",
    href: "/standards/meta-critique",
  },
];

const groupingDefinitions: StandardsGroupDefinition[] = [
  {
    title: "Core",
    description: "Foundational rights and contestability requirements to start with.",
    ids: ["STD-01", "STD-02", "MVC-01"],
  },
  {
    title: "Implementation",
    description:
      "Operational controls and templates for day-to-day governance delivery.",
    ids: ["STD-03", "STD-06", "PM-01"],
  },
  {
    title: "Reference",
    description:
      "Interoperability and record-format specifications used across ecosystems.",
    ids: ["STD-04", "STD-05"],
  },
];

const mapStandardsByIds = (standards: StandardEntry[], ids: string[]) =>
  ids
    .map((id) => standards.find((standard) => standard.id === id))
    .filter((standard): standard is StandardEntry => Boolean(standard));

export const buildStandardsCardViewModels = (input: {
  standards: StandardEntry[];
  doctrine: DoctrineEntry[];
  implementationExamples: ImplementationExample[];
}) => {
  const featuredStandardIds = ["STD-01", "STD-02"];
  const featuredStandards = mapStandardsByIds(input.standards, featuredStandardIds);
  const coreDoctrine = input.doctrine.find((item) => item.title === "Core axioms");

  const starterCards: StandardsCardModel[] = [
    ...featuredStandards.map((standard) => ({
      eyebrow: standard.id,
      title: standard.title,
      description: standard.description,
      href: `/standards/${standard.slug}`,
      ctaLabel: `Read ${standard.id}`,
    })),
    ...(coreDoctrine
      ? [
          {
            eyebrow: coreDoctrine.eyebrow,
            title: coreDoctrine.title,
            description: coreDoctrine.description,
            href: coreDoctrine.href,
            ctaLabel: coreDoctrine.ctaLabel,
          },
        ]
      : []),
  ];

  const implementationExampleCards: StandardsCardModel[] = [
    {
      title: "Implementation examples overview",
      description:
        "Domain-by-domain comparisons showing how Ethotechnics changes system architecture.",
      href: "/standards/implementation-examples",
      ctaLabel: "Read guide",
    },
    ...input.implementationExamples.map((example) => ({
      title: example.title,
      description: example.cardDescription,
      href: `/standards/implementation-examples/${example.slug}`,
      ctaLabel: "Read example",
    })),
  ];

  return {
    adoptedStandards,
    starterCards,
    implementationExampleCards,
  };
};

export const buildStandardsGroupingAndFilters = (
  standards: StandardEntry[],
): StandardsGroupingModel => {
  const mostCitedStandardIds = ["STD-01", "STD-02", "MVC-01"];
  const activeStandards = standards.filter((standard) => standard.status !== "Deprecated");
  const mostCitedStandards = mapStandardsByIds(standards, mostCitedStandardIds);
  const recentlyUpdatedStandards = [...standards]
    .map((standard, index) => ({ standard, index }))
    .sort((left, right) => {
      const publishedDelta = Date.parse(right.standard.published) - Date.parse(left.standard.published);
      return publishedDelta === 0 ? left.index - right.index : publishedDelta;
    })
    .map((item) => item.standard)
    .slice(0, 3);

  const standardsGrouping: StandardsGroupModel[] = groupingDefinitions.map((group) => {
    const lane = group.title.toLowerCase() as StandardsGroupModel["lane"];

    return {
      ...group,
      lane,
      items: mapStandardsByIds(standards, group.ids),
    };
  });

  const standardsFilterOptions: StandardsFilterOption[] = [
    "all",
    "core",
    "implementation",
    "reference",
  ];
  const standardsLaneById = new Map(
    standardsGrouping.flatMap((group) => group.ids.map((id) => [id, group.lane] as const)),
  );

  const standardsLaneCounts: Record<StandardsFilterOption, number> = {
    all: activeStandards.length,
    core: activeStandards.filter((standard) => standardsLaneById.get(standard.id) === "core").length,
    implementation: activeStandards.filter(
      (standard) => standardsLaneById.get(standard.id) === "implementation",
    ).length,
    reference: activeStandards.filter((standard) => standardsLaneById.get(standard.id) === "reference").length,
  };

  return {
    activeStandards,
    mostCitedStandards,
    mostCitedStandardIds,
    recentlyUpdatedStandards,
    standardsGrouping,
    standardsFilterOptions,
    standardsLaneById,
    standardsLaneCounts,
  };
};

export const buildStandardsStructuredDataPayload = (input: {
  standardsContent: Pick<StandardsContent, "pageTitle" | "pageDescription" | "permalink" | "standards" | "doctrine">;
  adoptedStandards: StandardsCardModel[];
  siteUrl?: URL;
}) => {
  const pageUrl = input.siteUrl
    ? new URL(input.standardsContent.permalink, input.siteUrl).toString()
    : input.standardsContent.permalink;
  const standardsUrl = (slug: string) =>
    input.siteUrl
      ? new URL(`/standards/${slug}`, input.siteUrl).toString()
      : `/standards/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name: input.standardsContent.pageTitle,
    description: input.standardsContent.pageDescription,
    url: pageUrl,
    hasPart: [
      ...input.standardsContent.standards.map((standard) => ({
        "@type": "CreativeWork",
        name: `${standard.id} — ${standard.title}`,
        description: standard.description,
        url: standardsUrl(standard.slug),
        identifier: standard.id,
        version: standard.version,
        datePublished: standard.published,
      })),
      ...input.standardsContent.doctrine.map((item) => ({
        "@type": "CreativeWork",
        name: item.title,
        description: item.description,
        url: input.siteUrl ? new URL(item.href, input.siteUrl).toString() : item.href,
      })),
      ...input.adoptedStandards.map((item) => ({
        "@type": "CreativeWork",
        name: item.title,
        description: item.description,
        url: input.siteUrl ? new URL(item.href, input.siteUrl).toString() : item.href,
      })),
    ],
  };
};
