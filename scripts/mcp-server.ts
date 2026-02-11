#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { join, relative, resolve, sep } from "node:path";
import { lstat, readdir, realpath, stat } from "node:fs/promises";

// Initialize server
const server = new McpServer({
  name: "etorg-mcp-server",
  version: "1.0.0",
});

// Helper to get project info
const getProjectRoot = () => process.cwd();
const textResponse = (text: string) => ({
  content: [
    {
      type: "text" as const,
      text,
    },
  ],
});
const errorResponse = (message: string) => textResponse(message);

type CheckClassification = {
  required: string[];
  optional: string[];
  reasons: string[];
};

const projectRootRealPathPromise = realpath(getProjectRoot());

const checkCatalog = {
  formatCheck: "bun run format:check",
  validateJson: "bun run validate:json",
  validateGlossary: "bun run validate:glossary",
  fullCheck: "bun run check",
} as const;

const toPosixPath = (value: string) => value.replaceAll("\\", "/");

const getRequiredChecksForFiles = (files: string[]): CheckClassification => {
  const required = new Set<string>();
  const optional = new Set<string>();
  const reasons = new Set<string>();

  if (files.length === 0) {
    required.add(checkCatalog.formatCheck);
    optional.add(checkCatalog.fullCheck);
    reasons.add("No files provided; default to formatting guidance.");
    return {
      required: [...required],
      optional: [...optional],
      reasons: [...reasons],
    };
  }

  let docsOnly = true;

  for (const originalFile of files) {
    const file = toPosixPath(originalFile.trim());
    if (!file) continue;

    const isMarkdown = file.endsWith(".md");
    const isDocPath = file.startsWith("docs/") || isMarkdown;
    if (!isDocPath) docsOnly = false;

    if (file.startsWith("src/content/") && file.endsWith(".json")) {
      required.add(checkCatalog.validateJson);
      reasons.add("Content JSON changed; include schema/content validation.");
    }

    if (
      file.includes("glossary") &&
      (file.endsWith(".json") || file.endsWith(".ts"))
    ) {
      required.add(checkCatalog.validateGlossary);
      reasons.add(
        "Glossary data or helpers changed; include glossary validation.",
      );
    }

    if (
      /\.(ts|tsx|astro|js|mjs|cjs)$/.test(file) ||
      file.startsWith("scripts/")
    ) {
      required.add(checkCatalog.fullCheck);
      reasons.add("Code or script files changed; run full project checks.");
    }
  }

  if (docsOnly) {
    required.add(checkCatalog.formatCheck);
    optional.add(checkCatalog.fullCheck);
    reasons.add("Detected docs-only changes.");
  }

  if (required.size === 0) {
    required.add(checkCatalog.fullCheck);
    reasons.add(
      "Could not classify file set confidently; defaulting to full check.",
    );
  }

  return {
    required: [...required],
    optional: [...optional],
    reasons: [...reasons],
  };
};

const getStatusEmoji = (exitCode: number) => {
  if (exitCode === 0) return "✅";
  if (exitCode === 2) return "⚠️";
  return "❌";
};

// Tool: List available scripts
server.tool(
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
server.tool(
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
server.tool(
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
server.tool(
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
server.tool(
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

// Tool: Analyze dist directory
server.tool(
  "analyze_dist",
  "Analyze the dist directory after build to check file sizes and structure",
  {},
  async () => {
    try {
      const distDir = join(getProjectRoot(), "dist");
      const files: { path: string; size: number }[] = [];

      async function scan(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          const entryStats = await lstat(fullPath);
          if (entryStats.isSymbolicLink()) continue;
          if (entryStats.isDirectory()) {
            await scan(fullPath);
            continue;
          }
          files.push({
            path: relative(distDir, fullPath),
            size: entryStats.size,
          });
        }
      }

      await scan(distDir);
      files.sort((a, b) => b.size - a.size); // Sort by size descending

      const report = files
        .map((file) => `${file.path}: ${(file.size / 1024).toFixed(2)} KB`)
        .join("\n");
      const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

      return textResponse(
        `Total Dist Size: ${(totalSize / 1024).toFixed(2)} KB\n\nTop Large Files:\n${report}`,
      );
    } catch (error) {
      return errorResponse(
        `Error analyzing dist: ${error instanceof Error ? error.message : String(error)}. Make sure you have run 'bun run build' first.`,
      );
    }
  },
);

// Tool: Read Wrangler Config
server.tool(
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

// Tool: Get file tree with depth and path options
server.tool(
  "get_file_tree",
  "Get a directory tree starting from a specific path with optional depth limit",
  {
    path: z
      .string()
      .optional()
      .default(".")
      .describe("The path to start the tree from (relative to project root)"),
    depth: z
      .number()
      .optional()
      .default(2)
      .describe("Maximum depth of the tree"),
  },
  async ({ path, depth }) => {
    try {
      const projectRoot = await realpath(getProjectRoot());
      const requestedPath = resolve(projectRoot, path || ".");
      const safePrefix = `${projectRoot}${sep}`;
      if (
        requestedPath !== projectRoot &&
        !requestedPath.startsWith(safePrefix)
      ) {
        throw new Error("Invalid path: Access denied");
      }
      const requestedStats = await lstat(requestedPath);
      if (requestedStats.isSymbolicLink()) {
        throw new Error("Invalid path: Symlinks are not allowed");
      }
      const rootPath = await realpath(requestedPath);
      if (rootPath !== projectRoot && !rootPath.startsWith(safePrefix)) {
        throw new Error("Invalid path: Access denied");
      }
      const rootStats = await stat(rootPath);
      if (rootStats.isFile()) {
        return textResponse(`📄 ${relative(projectRoot, rootPath)}`);
      }

      const files: string[] = [];
      const excludes = [
        "node_modules",
        ".git",
        "dist",
        ".wrangler",
        "coverage",
      ];

      async function scan(dir: string, currentDepth: number) {
        if (depth !== undefined && currentDepth > depth) return;
        const entries = await readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (excludes.includes(entry.name)) continue;
          const fullPath = join(dir, entry.name);
          const entryStats = await lstat(fullPath);
          if (entryStats.isSymbolicLink()) continue;
          const relPath = relative(rootPath, fullPath);
          files.push(
            `${"  ".repeat(currentDepth)}${entryStats.isDirectory() ? "📁" : "📄"} ${relPath}`,
          );
          if (entryStats.isDirectory()) {
            await scan(fullPath, currentDepth + 1);
          }
        }
      }

      await scan(rootPath, 0);

      return textResponse(
        files.length > 0
          ? files.join("\n")
          : "No files found or depth exceeded.",
      );
    } catch (error) {
      return errorResponse(
        `Error getting file tree: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Get repo map (folders only, depth 2)
server.tool(
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
server.tool(
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
server.tool(
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
        if (
          candidatePath !== projectRoot &&
          !candidatePath.startsWith(safePrefix) &&
          !(
            candidateRealPath &&
            (candidateRealPath === projectRoot ||
              candidateRealPath.startsWith(safePrefix))
          )
        ) {
          invalidFiles.push(filePath);
          continue;
        }
        normalizedFiles.push(toPosixPath(relative(projectRoot, candidatePath)));
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
server.tool(
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
  async ({ checks }) => {
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
server.tool(
  "list_workflows",
  "List available agent skills from .agent/skills/",
  {},
  async () => {
    try {
      const skillsDir = join(getProjectRoot(), ".agent", "skills");
      const glob = new Bun.Glob("*/SKILL.md");
      const workflows: { id: string; name: string; description: string }[] = [];

      for await (const file of glob.scan({ cwd: skillsDir })) {
        const fullPath = join(skillsDir, file);
        const content = await Bun.file(fullPath).text();
        // Extract description from frontmatter
        const match = content.match(
          /^---\s*\n(?:.*\n)*?description:\s*(.+)\n(?:.*\n)*?---/m,
        );
        const description = match?.[1] || "No description";
        const nameMatch = content.match(
          /^---\s*\n(?:.*\n)*?name:\s*(.+)\n(?:.*\n)*?---/m,
        );
        const nameFromDir = file.split(sep)[0];
        workflows.push({
          id: nameFromDir,
          name: nameMatch?.[1] || nameFromDir,
          description,
        });
      }

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

// Tool: Read workflow
server.tool(
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
server.tool(
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

// Tool: Get AGENTS guidance for a path
server.tool(
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

// ============================================================================
// MCP RESOURCES
// ============================================================================

// Resource: Project structure
server.resource("project://structure", "project://structure", async () => {
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
server.resource("project://scripts", "project://scripts", async () => {
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
server.resource(
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

// Resource: Agent workflows
server.resource("project://workflows", "project://workflows", async () => {
  const workflowsDir = join(getProjectRoot(), ".agent", "workflows");
  const glob = new Bun.Glob("*.md");
  const workflows: string[] = [];

  try {
    for await (const file of glob.scan({ cwd: workflowsDir })) {
      const fullPath = join(workflowsDir, file);
      const content = await Bun.file(fullPath).text();
      workflows.push(`## ${file}\n\n${content}`);
    }
  } catch {
    // Workflows directory might not exist
  }

  return {
    contents: [
      {
        uri: "project://workflows",
        text:
          workflows.length > 0
            ? `# Agent Workflows\n\n${workflows.join("\n\n---\n\n")}`
            : "# Agent Workflows\n\nNo workflows defined yet.",
        mimeType: "text/markdown",
      },
    ],
  };
});

// Resource: Agent onboarding
server.resource("agent://onboarding", "agent://onboarding", async () => {
  const onboarding = `# Agent Onboarding & Quick Start

## 🎯 Mission
This repo powers ethotechnics.org. We prioritize ethical technology and human-centered design.

## 🚀 Getting Started
1. Run \`bun run agent:doctor\` to verify your environment.
2. Use \`project://structure\` to understand where things live.
3. Explore \`project://workflows\` for common task loops.

## 🛠️ Key Tools
- \`run_check\`: Run full project validation.
- \`get_repo_map\`: Get a birds-eye view of the project.
- \`get_agents_guidance\`: Get scoped instructions for any file.

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
server.resource("project://docs-index", "project://docs-index", async () => {
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

// ============================================================================
// MCP PROMPTS
// ============================================================================

// Prompt: Design engineer mode
server.prompt(
  "design-engineer",
  "Activate design-engineer mode for taste-focused development",
  async () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `SYSTEM PROMPT — Design-Engineer Mode

You are operating as a design engineer.
Your job is to encode taste as structure, not to ship one-off solutions.

Global Constraints (Always On)

1. Prefer composable systems
   - Decompose work into orthogonal primitives
   - Primitives must compose safely
   - Avoid bespoke or tightly coupled logic unless unavoidable

2. Expose perceptual controls
   - Public interfaces use human-meaningful parameters: duration, delay, easing, intensity, distance
   - Hide low-level mechanics unless explicitly required
   - Defaults must feel intentional

3. Accessibility is default
   - Automatically respect system accessibility settings
   - Reduced-motion behavior must minimize spatial movement while preserving non-spatial affordances
   - No opt-in accessibility

4. Performance is UX
   - Prefer GPU-friendly, predictable execution
   - Avoid layout-thrashing patterns
   - Assume mid-range mobile hardware

5. Exploration-first
   - Designs must be safe to experiment with
   - Use bounded ranges and sensible defaults
   - Easy to reset, tweak, or undo

6. Optimize for legibility
   - Code should communicate intent
   - Favor clarity over cleverness

7. Ship complete surfaces
   - Outputs must be usable and integrable
   - Avoid demo-only abstractions

Decision Heuristic: fewer primitives, clearer knobs, safer defaults, better composability.`,
        },
      },
    ],
  }),
);

// Prompt: Code review
server.prompt(
  "code-review",
  "Template for reviewing code changes",
  {
    files: z
      .string()
      .optional()
      .describe("Comma-separated list of files to review"),
  },
  async ({ files }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please review the following code changes${files ? ` in: ${files}` : ""}.

Check for:
1. **Correctness**: Does the code do what it's supposed to?
2. **TypeScript**: Are types explicit and avoiding \`any\`?
3. **Accessibility**: Are focus states, ARIA labels, and semantic HTML correct?
4. **Performance**: Are there unnecessary re-renders, large bundles, or layout thrashing?
5. **Consistency**: Does the code match existing patterns in the codebase?
6. **Testing**: Are there tests for new behavior?

Provide specific, actionable feedback with file locations and suggested fixes.`,
        },
      },
    ],
  }),
);

// Prompt: New component
server.prompt(
  "new-component",
  "Scaffold a new Astro component",
  {
    name: z.string().describe("Name of the component (PascalCase)"),
    description: z
      .string()
      .optional()
      .describe("Brief description of the component"),
  },
  async ({ name, description }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a new Astro component called \`${name}\`${description ? `: ${description}` : ""}.

Requirements:
1. Place in \`src/components/${name}.astro\`
2. Use TypeScript interface for props
3. Follow existing component patterns in the codebase
4. Prefer server-side rendering (no \`client:*\` unless interaction is required)
5. Use semantic HTML and existing CSS utility classes from \`src/styles/global.css\`
6. Include accessible focus states and ARIA attributes where appropriate
7. Document optional props with JSDoc comments

Provide the complete component code.`,
        },
      },
    ],
  }),
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
