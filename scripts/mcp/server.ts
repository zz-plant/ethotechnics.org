import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Initialize server
export const server = new McpServer({
  name: "etorg-mcp-server",
  version: "1.0.0",
});

export const registerTool = (
  name: string,
  description: string,
  inputSchema: Record<string, z.ZodTypeAny>,
  cb: (...args: any[]) => any,
) => server.registerTool(name, { description, inputSchema }, cb);

export const registerResource = (
  name: string,
  uri: string,
  readCallback: (...args: any[]) => any,
) => server.registerResource(name, uri, {}, readCallback);

export function registerPrompt(
  name: string,
  description: string,
  cb: (...args: any[]) => any,
): void;
export function registerPrompt(
  name: string,
  description: string,
  argsSchema: Record<string, z.ZodTypeAny>,
  cb: (...args: any[]) => any,
): void;
export function registerPrompt(
  name: string,
  description: string,
  argsSchemaOrCb: Record<string, z.ZodTypeAny> | ((...args: any[]) => any),
  cb?: (...args: any[]) => any,
) {
  if (typeof argsSchemaOrCb === "function") {
    server.registerPrompt(name, { description }, argsSchemaOrCb);
    return;
  }

  if (!cb) {
    throw new Error("Prompt callback is required when args schema is provided");
  }

  server.registerPrompt(name, { description, argsSchema: argsSchemaOrCb }, cb);
}
