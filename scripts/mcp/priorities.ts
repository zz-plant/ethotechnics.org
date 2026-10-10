import { join } from "node:path";

import { getProjectRoot } from "./helpers";

export type PriorityBucket = "P0" | "P1";

export type PriorityItem = {
  priority: PriorityBucket;
  title: string;
  rationale: string;
  source: string;
  issueLink?: string;
  specLink?: string;
};

export type PriorityParseAudit = {
  totalEligibleSections: number;
  parsedItems: number;
  missingProblem: string[];
  missingIssueLink: string[];
};

export type JourneyPlaybook = {
  journey: string;
  routes: string[];
  recommendations: string[];
};

const parseRoadmapPriorityItems = async (): Promise<PriorityItem[]> => {
  const { items } = await parseRoadmapPriorityItemsWithAudit();
  return items;
};

const parseRoadmapPriorityItemsWithAudit = async (): Promise<{
  items: PriorityItem[];
  audit: PriorityParseAudit;
}> => {
  const roadmapPath = join(getProjectRoot(), "docs", "planning", "roadmap.md");
  const roadmap = await Bun.file(roadmapPath).text();
  const lines = roadmap.split(/\r?\n/);

  const acceptedTitles = new Set([
    "Python evaluation toolkit",
    "Capacity forecaster v2 (scenario compare)",
    "Maintenance simulator v2 (risk thresholds)",
    "Burden modeler v2 (equity snapshots)",
    "TypeScript SDK",
  ]);

  const sections = new Map<
    string,
    { problem?: string; issueLink?: string; specLink?: string }
  >();
  let currentHeading = "";

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      currentHeading = headingMatch[1].trim();
      if (acceptedTitles.has(currentHeading) && !sections.has(currentHeading)) {
        sections.set(currentHeading, {});
      }
      continue;
    }

    if (!acceptedTitles.has(currentHeading)) continue;

    const section = sections.get(currentHeading);
    if (!section) continue;

    const problemMatch = line.match(/^- \*\*Problem:\*\*\s*(.+)$/);
    if (problemMatch) {
      section.problem = problemMatch[1].trim();
      continue;
    }

    const issueMatch = line.match(
      /^- \*\*Issue link:\*\*\s*Issue:\s*(.+?)\s*\/\s*Spec:\s*(.+)$/,
    );
    if (issueMatch) {
      section.issueLink = issueMatch[1].trim();
      section.specLink = issueMatch[2].trim();
    }
  }

  const items: PriorityItem[] = [];
  const missingProblem: string[] = [];
  const missingIssueLink: string[] = [];

  for (const title of acceptedTitles) {
    const section = sections.get(title);
    if (!section) continue;

    if (!section.problem) {
      missingProblem.push(title);
      continue;
    }

    if (!section.issueLink) {
      missingIssueLink.push(title);
    }

    const priority: PriorityBucket =
      title === "Python evaluation toolkit" ? "P0" : "P1";

    items.push({
      priority,
      title,
      rationale: section.problem,
      source: "docs/planning/roadmap.md",
      issueLink: section.issueLink,
      specLink: section.specLink,
    });
  }

  return {
    items,
    audit: {
      totalEligibleSections: acceptedTitles.size,
      parsedItems: items.length,
      missingProblem,
      missingIssueLink,
    },
  };
};

const parseJourneyPriorities = async (): Promise<PriorityItem[]> => {
  const critiquePath = join(
    getProjectRoot(),
    "docs",
    "planning",
    "user-journey-critique.md",
  );
  const critique = await Bun.file(critiquePath).text();
  const lines = critique.split(/\r?\n/);
  const priorities: PriorityItem[] = [];
  let inPrioritySection = false;

  for (const line of lines) {
    if (line.startsWith("## Priority improvements (near-term)")) {
      inPrioritySection = true;
      continue;
    }

    if (inPrioritySection && line.startsWith("## ")) {
      break;
    }

    if (!inPrioritySection) {
      continue;
    }

    const priorityMatch = line.match(/^\d+\.\s+(.+)$/);
    if (priorityMatch) {
      priorities.push({
        priority: "P0",
        title: priorityMatch[1].trim(),
        rationale: "Near-term UX recommendation from journey critique.",
        source: "docs/planning/user-journey-critique.md",
      });
    }
  }

  return priorities;
};

export const getPrioritizedFeatures = async () => {
  const [roadmapPriorities, journeyPriorities] = await Promise.all([
    parseRoadmapPriorityItems(),
    parseJourneyPriorities(),
  ]);

  const seen = new Set<string>();
  const merged = [...journeyPriorities, ...roadmapPriorities].filter((item) => {
    const key = `${item.priority}:${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return merged.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === "P0" ? -1 : 1;
    }
    return a.title.localeCompare(b.title);
  });
};

export const getPrioritySourceAudit = async () => {
  const [roadmap, journey] = await Promise.all([
    parseRoadmapPriorityItemsWithAudit(),
    parseJourneyPriorities(),
  ]);

  return {
    roadmap: roadmap.audit,
    journey: {
      parsedItems: journey.length,
      source: "docs/planning/user-journey-critique.md",
    },
  };
};

export const parseJourneyPlaybooks = async (): Promise<JourneyPlaybook[]> => {
  const critiquePath = join(
    getProjectRoot(),
    "docs",
    "planning",
    "user-journey-critique.md",
  );
  const critique = await Bun.file(critiquePath).text();
  const lines = critique.split(/\r?\n/);

  const playbooks: JourneyPlaybook[] = [];
  let currentJourney = "";
  let inTypicalPath = false;
  let inRecommendations = false;
  let routes: string[] = [];
  let recommendations: string[] = [];

  const flushJourney = () => {
    if (!currentJourney) return;
    if (routes.length === 0 && recommendations.length === 0) return;

    playbooks.push({
      journey: currentJourney,
      routes: [...routes],
      recommendations: [...recommendations],
    });
  };

  for (const line of lines) {
    const journeyMatch = line.match(/^##\s+(Journey\s+\d+:\s+.+)$/);
    if (journeyMatch) {
      flushJourney();
      currentJourney = journeyMatch[1].trim();
      routes = [];
      recommendations = [];
      inTypicalPath = false;
      inRecommendations = false;
      continue;
    }

    if (line.startsWith("### Typical path")) {
      inTypicalPath = true;
      inRecommendations = false;
      continue;
    }

    if (line.startsWith("### Constructive recommendations")) {
      inTypicalPath = false;
      inRecommendations = true;
      continue;
    }

    if (line.startsWith("### ")) {
      inTypicalPath = false;
      inRecommendations = false;
      continue;
    }

    if (inTypicalPath) {
      const routeMatch = line.match(/\(`([^`]+)`\)/);
      if (routeMatch) {
        routes.push(routeMatch[1].trim());
      }
    }

    if (inRecommendations) {
      const recommendationMatch = line.match(/^-\s+(.+)$/);
      if (recommendationMatch) {
        recommendations.push(recommendationMatch[1].trim());
      }
    }
  }

  flushJourney();
  return playbooks;
};

export const normalizeRoute = (route: string) => {
  const trimmed = route.trim();
  if (!trimmed.startsWith("/")) return `/${trimmed}`;
  return trimmed;
};

export const findRoutePlaybook = (
  route: string,
  playbooks: JourneyPlaybook[],
): JourneyPlaybook | null => {
  const normalizedRoute = normalizeRoute(route).replace(/\/$/, "") || "/";

  for (const playbook of playbooks) {
    for (const routePattern of playbook.routes) {
      const normalizedPattern = routePattern.replace(/\/$/, "") || "/";
      if (
        normalizedRoute === normalizedPattern ||
        normalizedRoute.startsWith(`${normalizedPattern}/`)
      ) {
        return playbook;
      }
    }
  }

  return null;
};
