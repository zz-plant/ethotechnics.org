import { join } from "node:path";

import { getProjectRoot } from "./helpers";
import {
  getPrioritizedFeatures,
  parseJourneyPlaybooks,
  type PriorityBucket,
  type PriorityItem,
} from "./priorities";
import { getAgentInterfaceContract, listSkillSummaries } from "./skills";
import { registerResource } from "./server";

// Resource: Project structure
registerResource("project://structure", "project://structure", async () => {
  const structure = `# Project Structure

## Key Directories
- src/pages/ — Astro route files
- src/components/ — Shared UI components
- src/layouts/ — Page layouts (BaseLayout)
- src/styles/ — Global CSS and tokens
- src/content/ — Content collections
- docs/ — Documentation
- scripts/ — Build and utility scripts
- .agent/workflows/ — Agent task workflows

## Configuration Files
- astro.config.mjs — Astro configuration
- wrangler.toml — Cloudflare Workers config
- package.json — Dependencies and scripts
- tsconfig.json — TypeScript configuration

## Agent Guidance
- AGENTS.md — Root agent instructions
- src/AGENTS.md — Source code conventions
- docs/AGENTS.md — Documentation conventions
`;
  return {
    contents: [
      {
        uri: "project://structure",
        text: structure,
        mimeType: "text/markdown",
      },
    ],
  };
});

// Resource: Package scripts
registerResource("project://scripts", "project://scripts", async () => {
  const pkg = (await Bun.file(
    join(getProjectRoot(), "package.json"),
  ).json()) as {
    scripts?: Record<string, string>;
  };
  const scripts = Object.entries(pkg.scripts || {})
    .map(([name, cmd]) => `- \`${name}\`: ${cmd}`)
    .join("\n");
  return {
    contents: [
      {
        uri: "project://scripts",
        text: `# Available Scripts\n\n${scripts}`,
        mimeType: "text/markdown",
      },
    ],
  };
});

// Resource: Aggregated AGENTS guidance
registerResource(
  "project://agents-guidance",
  "project://agents-guidance",
  async () => {
    const projectRoot = getProjectRoot();
    const agentsPaths = [
      "AGENTS.md",
      "src/AGENTS.md",
      "src/pages/AGENTS.md",
      "src/components/AGENTS.md",
      "docs/AGENTS.md",
    ];

    const contents: string[] = [];
    for (const relPath of agentsPaths) {
      try {
        const content = await Bun.file(join(projectRoot, relPath)).text();
        contents.push(`## ${relPath}\n\n${content}`);
      } catch {
        // File doesn't exist, skip
      }
    }

    return {
      contents: [
        {
          uri: "project://agents-guidance",
          text: `# Aggregated AGENTS Guidance\n\n${contents.join("\n\n---\n\n")}`,
          mimeType: "text/markdown",
        },
      ],
    };
  },
);

// Resource: Agent workflows and skills
registerResource("project://workflows", "project://workflows", async () => {
  try {
    const workflows = await listSkillSummaries();
    const sections = await Promise.all(
      workflows.map(async (workflow) => {
        const content = await Bun.file(
          join(getProjectRoot(), workflow.path),
        ).text();
        return `## ${workflow.id}\n\n- Name: ${workflow.name}\n- Description: ${workflow.description}\n- Path: \`${workflow.path}\`\n\n${content}`;
      }),
    );

    return {
      contents: [
        {
          uri: "project://workflows",
          text:
            sections.length > 0
              ? `# Agent Workflows\n\n${sections.join("\n\n---\n\n")}`
              : "# Agent Workflows\n\nNo workflows defined yet.",
          mimeType: "text/markdown",
        },
      ],
    };
  } catch {
    // Skills directory might not exist
    return {
      contents: [
        {
          uri: "project://workflows",
          text: "# Agent Workflows\n\nNo workflows defined yet.",
          mimeType: "text/markdown",
        },
      ],
    };
  }
});

registerResource("agent://contract", "agent://contract", async () => {
  try {
    const contract = await getAgentInterfaceContract();

    return {
      contents: [
        {
          uri: "agent://contract",
          text: JSON.stringify(contract, null, 2),
          mimeType: "application/json",
        },
      ],
    };
  } catch (error) {
    return {
      contents: [
        {
          uri: "agent://contract",
          text: `Error generating agent contract: ${error instanceof Error ? error.message : String(error)}`,
          mimeType: "text/plain",
        },
      ],
    };
  }
});

registerResource(
  "project://priority-features",
  "project://priority-features",
  async () => {
    try {
      const priorities = await getPrioritizedFeatures();
      const grouped: Record<PriorityBucket, PriorityItem[]> = {
        P0: [],
        P1: [],
      };

      for (const item of priorities) {
        grouped[item.priority].push(item);
      }

      const renderGroup = (priority: PriorityBucket) => {
        const items = grouped[priority];
        if (items.length === 0) return `## ${priority}\n\n- No items found.`;

        return `## ${priority}\n\n${items
          .map(
            (item) =>
              `- **${item.title}**\n  - Why: ${item.rationale}\n  - Source: \`${item.source}\`\n  - Issue: ${item.issueLink ?? "(not specified)"}\n  - Spec: ${item.specLink ?? "(not specified)"}`,
          )
          .join("\n")}`;
      };

      return {
        contents: [
          {
            uri: "project://priority-features",
            text: `# Priority features\n\n${renderGroup("P0")}\n\n${renderGroup("P1")}`,
            mimeType: "text/markdown",
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: "project://priority-features",
            text: `Error generating priority features: ${error instanceof Error ? error.message : String(error)}`,
            mimeType: "text/plain",
          },
        ],
      };
    }
  },
);

registerResource(
  "project://journey-playbooks",
  "project://journey-playbooks",
  async () => {
    try {
      const playbooks = await parseJourneyPlaybooks();

      return {
        contents: [
          {
            uri: "project://journey-playbooks",
            text:
              playbooks.length > 0
                ? `# Journey playbooks

${playbooks
  .map(
    (playbook) =>
      `## ${playbook.journey}

### Typical path
${playbook.routes.map((route) => `- ${route}`).join("\n")}

### Recommended next actions
${playbook.recommendations.map((item) => `- ${item}`).join("\n")}`,
  )
  .join("\n\n---\n\n")}`
                : "# Journey playbooks\n\nNo journey playbooks found.",
            mimeType: "text/markdown",
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: "project://journey-playbooks",
            text: `Error building journey playbooks: ${error instanceof Error ? error.message : String(error)}`,
            mimeType: "text/plain",
          },
        ],
      };
    }
  },
);

// Resource: Agent onboarding
registerResource("agent://onboarding", "agent://onboarding", async () => {
  const onboarding = `# Agent Onboarding & Quick Start

## 🎯 Mission
This repo powers ethotechnics.org: open standards, scored public failures, and diagnostics for keeping automated decision systems answerable: when one is wrong, evidence of the harm reaches someone who has to change it. See AGENTS.md for the public copy voice.

## 🚀 Getting Started
1. Run \`bun run agent:doctor\` to verify your environment.
2. Use \`project://structure\` to understand where things live.
3. Explore \`project://workflows\` for skill guidance, \`project://priority-features\` for planning, and \`project://journey-playbooks\` for route-level guidance.

## 🛠️ Key Tools
- \`run_check\`: Run full project validation.
- \`get_repo_map\`: Get a birds-eye view of the project.
- \`get_agents_guidance\`: Get scoped instructions for any file.
- \`audit_priority_sources\`: Audit roadmap and journey parser coverage.
- \`list_mcp_capabilities\`: List available MCP tools/resources.
- \`suggest_route_next_actions\`: Get journey-based next actions for a route.

## 📚 Essential Reading
- \`AGENTS.md\`: Core working agreement.
- \`docs/agents/repo-orientation.md\`: Deep dive into repo structure.
- \`docs/agent-developer-experience.md\`: This agent experience overview.
`;
  return {
    contents: [
      {
        uri: "agent://onboarding",
        text: onboarding,
        mimeType: "text/markdown",
      },
    ],
  };
});

// Resource: Documentation index
registerResource("project://docs-index", "project://docs-index", async () => {
  const docsDir = join(getProjectRoot(), "docs");
  const glob = new Bun.Glob("**/*.md");
  const entries: string[] = [];

  try {
    for await (const file of glob.scan({ cwd: docsDir })) {
      const content = await Bun.file(join(docsDir, file)).text();
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? ` — ${titleMatch[1].trim()}` : "";
      entries.push(`- ${file}${title}`);
    }
  } catch (error) {
    return {
      contents: [
        {
          uri: "project://docs-index",
          text: `Error building docs index: ${error instanceof Error ? error.message : String(error)}`,
          mimeType: "text/plain",
        },
      ],
    };
  }

  return {
    contents: [
      {
        uri: "project://docs-index",
        text: `# Documentation Index\n\n${entries.sort().join("\n") || "No docs found."}`,
        mimeType: "text/markdown",
      },
    ],
  };
});
