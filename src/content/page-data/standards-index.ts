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

export type StandardsFilterOption =
  "all" | "core" | "implementation" | "reference";

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
      "Non-binding principles: they ask for accountability and set no duty anyone can enforce.",
    href: "/standards/oecd-ai-principles",
  },
  {
    eyebrow: "NIST",
    title: "NIST AI RMF 1.0",
    description:
      "Voluntary risk management that asks for feedback and impact mapping, and lets the operator decide what counts as done.",
    href: "/standards/nist-ai-rmf",
  },
  {
    eyebrow: "ISO",
    title: "ISO/IEC 42001",
    description:
      "Certifies the management system. Nothing makes one system's authority to act expire.",
    href: "/standards/iso-iec-42001",
  },
  {
    eyebrow: "EU",
    title: "EU AI Act",
    description:
      "Most high-risk systems are self-assessed before release, and their authority does not lapse. A challenge need not reach the system.",
    href: "/standards/eu-ai-act",
  },
  {
    eyebrow: "Corporate",
    title: "Responsible AI programs",
    description:
      "Internal boards and review gates that answer to the company, not to the people a system decides about.",
    href: "/standards/corporate-responsible-ai",
  },
  {
    eyebrow: "Meta-critique",
    title: "Governance by control",
    description:
      "The general critique: frameworks that govern through documents, roles, and reviews, not through records a running system has to keep.",
    href: "/standards#governance-by-control",
  },
];

const groupingDefinitions: StandardsGroupDefinition[] = [
  {
    title: "Core",
    description:
      "The rights a person holds against an automated system, how they challenge it, and what a delegation must keep showing.",
    ids: ["STD-01", "STD-02", "STD-08", "MVC-01"],
  },
  {
    title: "Implementation",
    description:
      "Templates and targets a team uses while the system runs: justice SLOs, the safety case, and the postmortem.",
    ids: ["STD-03", "STD-06", "PM-01"],
  },
  {
    title: "Reference",
    description:
      "Record formats that let one institution read another's records, and the terms for chains of delegations that cross institutions.",
    ids: ["STD-04", "STD-05", "STD-07", "STD-09"],
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
  const featuredStandards = mapStandardsByIds(
    input.standards,
    featuredStandardIds,
  );
  const coreDoctrine = input.doctrine.find(
    (item) => item.title === "Core axioms",
  );

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
        "How the same system is built differently in each domain once it has to be stoppable and reversible.",
      href: "/examples#domains",
      ctaLabel: "Read guide",
    },
    ...input.implementationExamples.map((example) => ({
      title: example.title,
      description: example.cardDescription,
      href: `/examples/${example.slug}`,
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
  const listedStandards = standards.filter(
    (standard) => standard.listedOnSite !== false,
  );
  const mostCitedStandardIds = ["STD-01", "STD-02", "MVC-01"];
  const activeStandards = listedStandards.filter(
    (standard) => standard.status !== "Deprecated",
  );
  const mostCitedStandards = mapStandardsByIds(
    listedStandards,
    mostCitedStandardIds,
  );
  const recentlyUpdatedStandards = [...listedStandards]
    .map((standard, index) => ({ standard, index }))
    .sort((left, right) => {
      const publishedDelta =
        Date.parse(right.standard.published) -
        Date.parse(left.standard.published);
      return publishedDelta === 0 ? left.index - right.index : publishedDelta;
    })
    .map((item) => item.standard)
    .slice(0, 3);

  const standardsGrouping: StandardsGroupModel[] = groupingDefinitions.map(
    (group) => {
      const lane = group.title.toLowerCase() as StandardsGroupModel["lane"];

      return {
        ...group,
        lane,
        items: mapStandardsByIds(listedStandards, group.ids),
      };
    },
  );

  const standardsFilterOptions: StandardsFilterOption[] = [
    "all",
    "core",
    "implementation",
    "reference",
  ];
  const standardsLaneById = new Map(
    standardsGrouping.flatMap((group) =>
      group.ids.map((id) => [id, group.lane] as const),
    ),
  );

  const standardsLaneCounts: Record<StandardsFilterOption, number> = {
    all: activeStandards.length,
    core: activeStandards.filter(
      (standard) => standardsLaneById.get(standard.id) === "core",
    ).length,
    implementation: activeStandards.filter(
      (standard) => standardsLaneById.get(standard.id) === "implementation",
    ).length,
    reference: activeStandards.filter(
      (standard) => standardsLaneById.get(standard.id) === "reference",
    ).length,
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
  standardsContent: Pick<
    StandardsContent,
    "pageTitle" | "pageDescription" | "permalink" | "standards" | "doctrine"
  >;
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
      ...input.standardsContent.standards
        .filter((standard) => standard.listedOnSite !== false)
        .map((standard) => ({
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
        url: input.siteUrl
          ? new URL(item.href, input.siteUrl).toString()
          : item.href,
      })),
      ...input.adoptedStandards.map((item) => ({
        "@type": "CreativeWork",
        name: item.title,
        description: item.description,
        url: input.siteUrl
          ? new URL(item.href, input.siteUrl).toString()
          : item.href,
      })),
    ],
  };
};
