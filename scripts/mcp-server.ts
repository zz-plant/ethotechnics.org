#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

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
    const pkg = await Bun.file(join(getProjectRoot(), "package.json")).json();
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
      
      const files: string[] = [];
      async function walk(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const res = join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(res);
            } else if (entry.name.endsWith(".astro") || entry.name.endsWith(".tsx")) {
                files.push(res.replace(getProjectRoot(), "").replace(/^[\\\/]/, ""));
            }
        }
      }
      
      await walk(componentsDir);
      
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
