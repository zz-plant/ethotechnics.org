#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { join, relative } from "node:path";
import { stat, readdir } from "node:fs/promises";

// Initialize server
const server = new McpServer({
  name: "etorg-mcp-server",
  version: "1.0.0",
});

// Helper to get project info
const getProjectRoot = () => process.cwd();

// Tool: List available scripts
server.tool(
  "list_available_scripts",
  "List all scripts defined in package.json",
  {},
  async () => {
    const pkg = await Bun.file(join(getProjectRoot(), "package.json")).json() as { scripts?: Record<string, string> };
    return {
      content: [{
        type: "text",
        text: JSON.stringify(pkg.scripts || {}, null, 2)
      }]
    };
  }
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
        files.push(file);
      }
      
      return {
        content: [{
            type: "text",
            text: files.sort().join("\n")
        }]
      };
    } catch (error) {
         return {
            content: [{
                type: "text",
                text: `Error listing components: ${error instanceof Error ? error.message : String(error)}`
            }]
        };
    }
  }
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
      const excludes = ["node_modules", ".git", "dist", ".wrangler", "coverage"];
      
      for await (const file of glob.scan({ cwd: root, onlyFiles: false })) {
        if (!excludes.some(e => file.startsWith(e))) {
           files.push(file);
        }
      }

      return {
        content: [{
          type: "text",
          text: files.sort().join("\n")
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error getting project tree: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  }
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
        files.push(file);
      }
      
      return {
        content: [{
          type: "text",
          text: files.sort().join("\n")
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error listing pages: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  }
);

// Tool: Read docs
server.tool(
  "read_docs",
  "Read documentation files from the docs directory",
  {
    filename: z.string().describe("The name of the doc file to read (relative to docs/)"),
  },
  async ({ filename }) => {
    try {
      const docsDir = join(getProjectRoot(), "docs");
      // Prevent directory traversal
      const safePath = join(docsDir, filename);
      if (!safePath.startsWith(docsDir)) {
          throw new Error("Invalid path: Access denied");
      }
      
      const content = await Bun.file(safePath).text();
      
      return {
        content: [{
          type: "text",
          text: content
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error reading doc: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  }
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
          if (entry.isDirectory()) {
            await scan(fullPath);
          } else {
            const stats = await stat(fullPath);
            files.push({
              path: relative(distDir, fullPath),
              size: stats.size
            });
          }
        }
      }

      await scan(distDir);
      files.sort((a, b) => b.size - a.size); // Sort by size descending

      const report = files.map(f => `${f.path}: ${(f.size / 1024).toFixed(2)} KB`).join("\n");
      const totalSize = files.reduce((acc, curr) => acc + curr.size, 0);

      return {
        content: [{
          type: "text",
          text: `Total Dist Size: ${(totalSize / 1024).toFixed(2)} KB\n\nTop Large Files:\n${report}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error analyzing dist: ${error instanceof Error ? error.message : String(error)}. Make sure you have run 'bun run build' first.`
        }]
      };
    }
  }
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
      return {
        content: [{
          type: "text",
          text: content
        }]
      };
    } catch (error) {
       return {
        content: [{
          type: "text",
          text: `Error reading wrangler.toml: ${error instanceof Error ? error.message : String(error)}`
        }]
      };
    }
  }
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
