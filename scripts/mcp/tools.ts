import { z } from "zod";

import { join, relative, resolve, sep } from "node:path";
import { lstat, realpath } from "node:fs/promises";

import {
  getProjectRoot,
  getRequiredChecksForFiles,
  getStatusEmoji,
  projectRootRealPathPromise,
  textResponse,
  errorResponse,
  toPosixPath,
} from "./helpers";
import {
  findRoutePlaybook,
  getPrioritizedFeatures,
  getPrioritySourceAudit,
  normalizeRoute,
  parseJourneyPlaybooks,
} from "./priorities";
import {
  getAgentInterfaceContract,
  listSkillSummaries,
  parseMcpCapabilitiesFromSource,
} from "./skills";
import { registerTool } from "./server";

// Tool: List available scripts
registerTool(
  "list_available_scripts",
  "List all scripts defined in package.json",
  {},
  async () => {
    const pkg = (await Bun.file(
      join(getProjectRoot(), "package.json"),
    ).json()) as { scripts?: Record<string, string> };
    return textResponse(JSON.stringify(pkg.scripts || {}, null, 2));
  },
);

// Tool: Get component list
registerTool(
  "get_component_list",
  "List all Astro components in src/components",
  {},
  async () => {
    try {
      const componentsDir = join(getProjectRoot(), "src", "components");

      const glob = new Bun.Glob("**/*.{astro,tsx}");

      const files: string[] = [];
      for await (const file of glob.scan({ cwd: componentsDir })) {
        const fullPath = join(componentsDir, file);
        const stats = await lstat(fullPath);
        if (stats.isSymbolicLink()) continue;
        files.push(file);
      }

      return textResponse(files.sort().join("\n"));
    } catch (error) {
      return errorResponse(
        `Error listing components: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Get project tree
registerTool(
  "get_project_tree",
  "Get a simplified directory tree of the project",
  {},
  async () => {
    try {
      const root = getProjectRoot();
      const glob = new Bun.Glob("**/*");
      const files: string[] = [];
      // Exclude common ignores
      const excludes = [
        "node_modules",
        ".git",
        "dist",
        ".wrangler",
        "coverage",
      ];

      for await (const file of glob.scan({ cwd: root, onlyFiles: false })) {
        if (excludes.some((excluded) => file.startsWith(excluded))) continue;
        const fullPath = join(root, file);
        const stats = await lstat(fullPath);
        if (stats.isSymbolicLink()) continue;
        files.push(file);
      }

      return textResponse(files.sort().join("\n"));
    } catch (error) {
      return errorResponse(
        `Error getting project tree: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: List pages
registerTool(
  "list_pages",
  "List available application routes in src/pages",
  {},
  async () => {
    try {
      const pagesDir = join(getProjectRoot(), "src", "pages");
      const glob = new Bun.Glob("**/*.{astro,md,mdx,html,js,ts}");
      const files: string[] = [];

      for await (const file of glob.scan({ cwd: pagesDir })) {
        const fullPath = join(pagesDir, file);
        const stats = await lstat(fullPath);
        if (stats.isSymbolicLink()) continue;
        files.push(file);
      }

      return textResponse(files.sort().join("\n"));
    } catch (error) {
      return errorResponse(
        `Error listing pages: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Read docs
registerTool(
  "read_docs",
  "Read documentation files from the docs directory",
  {
    filename: z
      .string()
      .describe("The name of the doc file to read (relative to docs/)"),
  },
  async ({ filename }) => {
    try {
      const docsDir = resolve(getProjectRoot(), "docs");
      // Prevent directory traversal
      const safePath = resolve(docsDir, filename);
      if (!safePath.startsWith(`${docsDir}${sep}`)) {
        throw new Error("Invalid path: Access denied");
      }

      const content = await Bun.file(safePath).text();

      return textResponse(content);
    } catch (error) {
      return errorResponse(
        `Error reading doc: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Read Wrangler Config
registerTool(
  "read_wrangler_config",
  "Read the wrangler.toml configuration file",
  {},
  async () => {
    try {
      const configPath = join(getProjectRoot(), "wrangler.toml");
      const content = await Bun.file(configPath).text();
      return textResponse(content);
    } catch (error) {
      return errorResponse(
        `Error reading wrangler.toml: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Get repo map (folders only, depth 2)
registerTool(
  "get_repo_map",
  "Get a high-level map of the repository (folders only, depth 2)",
  {},
  async () => {
    try {
      const root = getProjectRoot();
      const glob = new Bun.Glob("**/");
      const dirs: string[] = [];
      const excludes = [
        "node_modules",
        ".git",
        "dist",
        ".wrangler",
        "coverage",
      ];

      for await (const dir of glob.scan({ cwd: root, onlyFiles: false })) {
        if (excludes.some((ex) => dir.startsWith(ex))) continue;
        const depth = dir.split(sep).filter(Boolean).length;
        if (depth > 2) continue;
        dirs.push(dir);
      }

      const map = dirs
        .sort()
        .map((d) => {
          const depth = d.split(sep).filter(Boolean).length;
          return `${"  ".repeat(depth)}📁 ${d}`;
        })
        .join("\n");

      return textResponse(`# Repository Map\n\n${map}`);
    } catch (error) {
      return errorResponse(
        `Error mapping repo: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Run project check
registerTool(
  "run_check",
  "Run the full project check (bun run check)",
  {},
  async () => {
    try {
      const proc = Bun.spawn(["bun", "run", "check"], {
        cwd: getProjectRoot(),
        stdout: "pipe",
        stderr: "pipe",
      });

      const [stdout, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);
      const exitCode = await proc.exited;

      return textResponse(
        `Exit code: ${exitCode}\n\nSTDOUT:\n${stdout || "(none)"}\n\nSTDERR:\n${stderr || "(none)"}`,
      );
    } catch (error) {
      return errorResponse(
        `Error running check: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Validate changed files
registerTool(
  "validate_changed_files",
  "Classify changed files and return required/optional checks",
  {
    files: z
      .array(z.string())
      .describe("Changed file paths relative to the project root"),
  },
  async ({ files }) => {
    try {
      const projectRoot = await projectRootRealPathPromise;
      const invalidFiles: string[] = [];
      const normalizedFiles: string[] = [];

      for (const file of files) {
        const filePath = file.trim();
        if (!filePath) continue;
        const candidatePath = resolve(projectRoot, filePath);
        const candidateRealPath = await realpath(candidatePath).catch(
          () => null,
        );
        const safePrefix = `${projectRoot}${sep}`;
        const candidatePathInRoot =
          candidatePath === projectRoot || candidatePath.startsWith(safePrefix);
        const candidateRealPathInRoot =
          candidateRealPath !== null &&
          (candidateRealPath === projectRoot ||
            candidateRealPath.startsWith(safePrefix));

        if (!candidatePathInRoot && !candidateRealPathInRoot) {
          invalidFiles.push(filePath);
          continue;
        }

        const normalizedPathSource = candidatePathInRoot
          ? candidatePath
          : (candidateRealPath as string);

        normalizedFiles.push(
          toPosixPath(relative(projectRoot, normalizedPathSource)),
        );
      }

      if (invalidFiles.length > 0) {
        return errorResponse(
          `Invalid file path(s): ${invalidFiles.join(", ")}`,
        );
      }

      const checks = getRequiredChecksForFiles(normalizedFiles);
      const lines = [
        "# Changed File Check Plan",
        "",
        normalizedFiles.length > 0
          ? `Files (${normalizedFiles.length}):
${normalizedFiles.map((f) => `- ${f}`).join("\n")}`
          : "Files: (none provided)",
        "",
        "## Required",
        ...checks.required.map((command) => `- ${command}`),
      ];

      if (checks.optional.length > 0) {
        lines.push(
          "",
          "## Optional",
          ...checks.optional.map((command) => `- ${command}`),
        );
      }

      if (checks.reasons.length > 0) {
        lines.push(
          "",
          "## Reasons",
          ...checks.reasons.map((reason) => `- ${reason}`),
        );
      }

      return textResponse(lines.join("\n"));
    } catch (error) {
      return errorResponse(
        `Error validating changed files: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Summarize checks for PR notes
registerTool(
  "summarize_checks",
  "Summarize command results as PR-ready markdown bullets",
  {
    checks: z
      .array(
        z.object({
          command: z.string().describe("Command that was run"),
          exitCode: z.number().int().describe("Process exit code"),
          note: z.string().optional().describe("Optional short note"),
        }),
      )
      .describe("List of check results"),
  },
  async ({
    checks,
  }: {
    checks: { command: string; exitCode: number; note?: string }[];
  }) => {
    try {
      if (checks.length === 0) {
        return textResponse("No checks provided.");
      }

      const summary = checks.map(({ command, exitCode, note }) => {
        const suffix = note ? ` (${note})` : "";
        return `${getStatusEmoji(exitCode)} \`${command}\`${suffix}`;
      });

      return textResponse(["# Check Summary", "", ...summary].join("\n"));
    } catch (error) {
      return errorResponse(
        `Error summarizing checks: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: List workflows
registerTool(
  "list_workflows",
  "List available agent skills from .agent/skills/",
  {},
  async () => {
    try {
      const workflows = await listSkillSummaries();

      return textResponse(
        workflows
          .map((w) => {
            const displayName = w.name !== w.id ? `${w.id} (${w.name})` : w.id;
            return `${displayName}: ${w.description}`;
          })
          .join("\n") || "No workflows found",
      );
    } catch (error) {
      return errorResponse(
        `Error listing workflows: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

registerTool(
  "get_agent_interface_contract",
  "Return machine-readable MCP and skill metadata for external agent clients",
  {},
  async () => {
    try {
      const contract = await getAgentInterfaceContract();
      return textResponse(JSON.stringify(contract, null, 2));
    } catch (error) {
      return errorResponse(
        `Error generating interface contract: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Read workflow
registerTool(
  "read_workflow",
  "Read a specific agent skill definition",
  {
    name: z
      .string()
      .describe("The skill name (folder name under .agent/skills)"),
  },
  async ({ name }) => {
    try {
      const normalizedName = name.trim();
      if (!/^[a-z0-9-]+$/i.test(normalizedName)) {
        throw new Error(
          "Invalid skill name. Use letters, numbers, and hyphens only.",
        );
      }

      const skillsDir = resolve(getProjectRoot(), ".agent", "skills");
      const workflowPath = resolve(skillsDir, normalizedName, "SKILL.md");
      if (!workflowPath.startsWith(`${skillsDir}${sep}`)) {
        throw new Error("Invalid path: Access denied");
      }

      const content = await Bun.file(workflowPath).text();
      return textResponse(content);
    } catch (error) {
      return errorResponse(
        `Error reading workflow: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Search docs
registerTool(
  "search_docs",
  "Search documentation files for a pattern",
  {
    query: z.string().describe("The search pattern to look for"),
  },
  async ({ query }) => {
    try {
      const docsDir = join(getProjectRoot(), "docs");
      const glob = new Bun.Glob("**/*.md");
      const results: { file: string; line: number; content: string }[] = [];

      for await (const file of glob.scan({ cwd: docsDir })) {
        const fullPath = join(docsDir, file);
        const content = await Bun.file(fullPath).text();
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              file,
              line: index + 1,
              content: line.trim().substring(0, 100),
            });
          }
        });
      }

      if (results.length === 0) {
        return textResponse(`No matches found for "${query}"`);
      }

      return textResponse(
        results
          .slice(0, 20) // Limit to 20 results
          .map((r) => `${r.file}:${r.line}: ${r.content}`)
          .join("\n"),
      );
    } catch (error) {
      return errorResponse(
        `Error searching docs: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

registerTool(
  "suggest_priority_features",
  "Suggest P0 and P1 feature priorities from roadmap and journey critique docs",
  {},
  async () => {
    try {
      const priorities = await getPrioritizedFeatures();
      const lines = priorities.map((item) => {
        const issueLine = item.issueLink
          ? `\n  - Issue: ${item.issueLink}`
          : "\n  - Issue: (not specified)";
        const specLine = item.specLink
          ? `\n  - Spec: ${item.specLink}`
          : "\n  - Spec: (not specified)";

        return `- [${item.priority}] ${item.title}\n  - Why: ${item.rationale}\n  - Source: ${item.source}${issueLine}${specLine}`;
      });

      return textResponse(
        lines.length > 0
          ? `# Suggested priority features\n\n${lines.join("\n")}`
          : "No priority recommendations found in docs.",
      );
    } catch (error) {
      return errorResponse(
        `Error suggesting priorities: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

registerTool(
  "suggest_route_next_actions",
  "Suggest next actions for a route using user journey playbooks",
  {
    route: z
      .string()
      .describe("A site route (for example: /validators/risk-radar/)")
      .default("/"),
  },
  async ({ route }) => {
    try {
      const playbooks = await parseJourneyPlaybooks();
      const matched = findRoutePlaybook(route, playbooks);

      if (!matched) {
        return textResponse(
          [
            `No journey playbook match found for \`${normalizeRoute(route)}\`.`,
            "Try one of these known routes:",
            ...playbooks
              .flatMap((playbook) => playbook.routes)
              .map((knownRoute) => `- ${knownRoute}`)
              .slice(0, 12),
          ].join("\n"),
        );
      }

      return textResponse(
        [
          `# Next actions for ${normalizeRoute(route)}`,
          "",
          `Matched journey: **${matched.journey}**`,
          "",
          "Recommended next steps:",
          ...matched.recommendations.map((item) => `- ${item}`),
          "",
          "Journey route sequence:",
          ...matched.routes.map((item) => `- ${item}`),
        ].join("\n"),
      );
    } catch (error) {
      return errorResponse(
        `Error suggesting route next actions: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

registerTool(
  "audit_priority_sources",
  "Audit priority parsing coverage for roadmap and journey sources",
  {},
  async () => {
    try {
      const audit = await getPrioritySourceAudit();

      return textResponse(
        [
          "# Priority source audit",
          "",
          `Roadmap eligible sections: ${audit.roadmap.totalEligibleSections}`,
          `Roadmap parsed items: ${audit.roadmap.parsedItems}`,
          `Roadmap sections missing **Problem**: ${audit.roadmap.missingProblem.length}`,
          ...audit.roadmap.missingProblem.map((item) => `- ${item}`),
          `Roadmap sections missing **Issue link**: ${audit.roadmap.missingIssueLink.length}`,
          ...audit.roadmap.missingIssueLink.map((item) => `- ${item}`),
          "",
          `Journey parsed items: ${audit.journey.parsedItems}`,
          `Journey source: ${audit.journey.source}`,
        ].join("\n"),
      );
    } catch (error) {
      return errorResponse(
        `Error auditing priority sources: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

registerTool(
  "list_mcp_capabilities",
  "List MCP tools and resources registered in this server",
  {},
  async () => {
    try {
      const capabilities = await parseMcpCapabilitiesFromSource();

      return textResponse(
        [
          "# MCP capabilities",
          "",
          "## Tools",
          ...capabilities.tools.map(
            (tool) => `- ${tool.name}: ${tool.description}`,
          ),
          "",
          "## Resources",
          ...capabilities.resources.map(
            (resource) => `- ${resource.name} (${resource.uri})`,
          ),
        ].join("\n"),
      );
    } catch (error) {
      return errorResponse(
        `Error listing MCP capabilities: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Get AGENTS guidance for a path
registerTool(
  "get_agents_guidance",
  "Get the applicable AGENTS.md guidance for a file path",
  {
    filepath: z
      .string()
      .describe("The file path to get guidance for (relative to project root)"),
  },
  async ({ filepath }) => {
    try {
      const projectRoot = getProjectRoot();
      const targetPath = resolve(projectRoot, filepath);

      // Walk up from the target path looking for AGENTS.md files
      const agentsFiles: string[] = [];
      let currentDir = targetPath;

      while (currentDir.startsWith(projectRoot)) {
        const stats = await lstat(currentDir).catch(() => null);
        if (stats?.isFile()) {
          currentDir = resolve(currentDir, "..");
        }
        const agentsPath = join(currentDir, "AGENTS.md");
        try {
          await lstat(agentsPath);
          agentsFiles.push(agentsPath);
        } catch {
          // No AGENTS.md at this level
        }
        const parent = resolve(currentDir, "..");
        if (parent === currentDir) break;
        currentDir = parent;
      }

      if (agentsFiles.length === 0) {
        return textResponse("No AGENTS.md files found in path hierarchy");
      }

      // Read all found AGENTS.md files (most specific first)
      const contents = await Promise.all(
        agentsFiles.map(async (path) => {
          const content = await Bun.file(path).text();
          return `--- ${relative(projectRoot, path)} ---\n${content}`;
        }),
      );

      return textResponse(contents.join("\n\n"));
    } catch (error) {
      return errorResponse(
        `Error getting AGENTS guidance: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);
