#!/usr/bin/env bun
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Registration order matters: tools, then resources, then prompts.
// Each module registers against the shared server instance on import.
import "./mcp/tools";
import "./mcp/resources";
import "./mcp/prompts";
import { server } from "./mcp/server";

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
