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
    depth: z.number().optional().default(2).describe("Maximum depth of the tree"),
  },
  async ({ path, depth }) => {
    try {
      const projectRoot = await realpath(getProjectRoot());
      const requestedPath = resolve(projectRoot, path || ".");
      const safePrefix = `${projectRoot}${sep}`;
      if (requestedPath !== projectRoot && !requestedPath.startsWith(safePrefix)) {
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
        files.length > 0 ? files.join("\n") : "No files found or depth exceeded.",
      );
    } catch (error) {
      return errorResponse(
        `Error getting file tree: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: Run project check
server.tool(
  "run_check",
  "Run the full project check (lint, tests, types, etc.)",
  {},
  async () => {
    try {
      const proc = Bun.spawn(["bun", "run", "check"], {
        stdout: "pipe",
        stderr: "pipe",
      });
      const stdout = await Bun.readableStreamToText(proc.stdout);
      const stderr = await Bun.readableStreamToText(proc.stderr);
      await proc.exited;

      const status = proc.exitCode === 0 ? "✅ PASS" : "❌ FAIL";
      return textResponse(`Status: ${status}\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`);
    } catch (error) {
      return errorResponse(
        `Error running check: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
);

// Tool: List workflows
server.tool(
  "list_workflows",
  "List available agent workflows from .agent/workflows/",
  {},
  async () => {
    try {
      const workflowsDir = join(getProjectRoot(), ".agent", "workflows");
      const glob = new Bun.Glob("*.md");
      const workflows: { name: string; description: string }[] = [];

      for await (const file of glob.scan({ cwd: workflowsDir })) {
        const fullPath = join(workflowsDir, file);
        const content = await Bun.file(fullPath).text();
        // Extract description from frontmatter
        const match = content.match(/^---\s*\n(?:.*\n)*?description:\s*(.+)\n(?:.*\n)*?---/m);
        const description = match?.[1] || "No description";
        workflows.push({ name: file.replace(".md", ""), description });
      }

      return textResponse(
        workflows.map((w) => `${w.name}: ${w.description}`).join("\n") || "No workflows found",
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
  "Read a specific agent workflow definition",
  {
    name: z.string().describe("The workflow name (without .md extension)"),
  },
  async ({ name }) => {
    try {
      const workflowPath = join(getProjectRoot(), ".agent", "workflows", `${name}.md`);
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
    filepath: z.string().describe("The file path to get guidance for (relative to project root)"),
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
server.resource(
  "project://structure",
  "project://structure",
  async () => {
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
    return { contents: [{ uri: "project://structure", text: structure, mimeType: "text/markdown" }] };
  },
);

// Resource: Package scripts
server.resource(
  "project://scripts",
  "project://scripts",
  async () => {
    const pkg = (await Bun.file(join(getProjectRoot(), "package.json")).json()) as {
      scripts?: Record<string, string>;
    };
    const scripts = Object.entries(pkg.scripts || {})
      .map(([name, cmd]) => `- \`${name}\`: ${cmd}`)
      .join("\n");
    return {
      contents: [
        { uri: "project://scripts", text: `# Available Scripts\n\n${scripts}`, mimeType: "text/markdown" },
      ],
    };
  },
);

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
server.resource(
  "project://workflows",
  "project://workflows",
  async () => {
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
  },
);

// Resource: Documentation index
server.resource(
  "docs://index",
  "docs://index",
  async () => {
    const docsDir = join(getProjectRoot(), "docs");
    const glob = new Bun.Glob("**/*.md");
    const files: string[] = [];

    for await (const file of glob.scan({ cwd: docsDir })) {
      files.push(`- [${file}](docs/${file})`);
    }

    return {
      contents: [
        {
          uri: "docs://index",
          text: `# Documentation Index\n\n${files.sort().join("\n")}`,
          mimeType: "text/markdown",
        },
      ],
    };
  },
);

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
    files: z.string().optional().describe("Comma-separated list of files to review"),
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
    description: z.string().optional().describe("Brief description of the component"),
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
