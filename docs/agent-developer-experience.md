# Agent developer experience

Primary onboarding document for AI contributors.

## Canonical startup sequence

1. Read repository-wide instructions in [`../AGENTS.md`](../AGENTS.md).
2. Discover scoped overrides with `rg --files -g 'AGENTS.md'`.
3. Use [`README.md`](README.md) to route to the right docs area.
4. Follow [`agents/README.md`](agents/README.md) for execution playbooks.
5. Use [`contributor-workflow.md`](contributor-workflow.md) for the shared delivery loop.

## Operational defaults

- Runtime: Node.js 20 via `nvm use`.
- Package manager and scripts: Bun only.
- Required validation for code or mixed changes: `bun run check`.
- Docs-only changes may skip `bun run check`, but must include that skip in PR notes.

## Source-of-truth map

### Workflow and checks

- [`contributor-workflow.md`](contributor-workflow.md)
- [`agents/workflow-and-checks.md`](agents/workflow-and-checks.md)
- [`agents/review-checklist.md`](agents/review-checklist.md)

### Code and repository conventions

- [`agents/repo-orientation.md`](agents/repo-orientation.md)
- [`agents/coding-practices.md`](agents/coding-practices.md)
- [`agents/version-control.md`](agents/version-control.md)
- [`agents/formatting-and-tooling.md`](agents/formatting-and-tooling.md)

### Environment and tooling references

- [`local-development.md`](local-development.md)
- [`../README.md`](../README.md)
- MCP server command: `bun run mcp`

### MCP planning and discovery helpers

- `suggest_priority_features`: summarize P0/P1 roadmap and journey priorities.
- `audit_priority_sources`: audit parser coverage and missing planning metadata.
- `suggest_route_next_actions`: map route context to journey-based next actions.
- `list_mcp_capabilities`: inventory all registered MCP tools/resources.
- Resource references: `project://priority-features` and `project://journey-playbooks`.

## MCP tool smoke test

Use this Bun one-liner to spawn the repository MCP server and call real tools:

```bash
bun -e 'import { Client } from "@modelcontextprotocol/sdk/client/index.js"; import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"; const transport = new StdioClientTransport({ command: "bun", args: ["run", "scripts/mcp-server.ts"], cwd: process.cwd(), stderr: "pipe"}); const client = new Client({name:"tool-smoke", version:"1.0.0"}, {capabilities:{}}); await client.connect(transport); console.log((await client.callTool({name:"list_mcp_capabilities", arguments:{}})).content?.[0]?.type); console.log((await client.callTool({name:"validate_changed_files", arguments:{files:["docs/agent-developer-experience.md","scripts/mcp-server.ts"]}})).content?.[0]?.type); console.log((await client.callTool({name:"summarize_checks", arguments:{checks:[{command:"bun run check", exitCode:0},{command:"bun run format:check", exitCode:2, note:"repo baseline formatting drift"}]}})).content?.[0]?.type); await transport.close();'
```

Expected behavior:

- MCP server prints `MCP Server running on stdio`.
- Calls to `list_mcp_capabilities`, `validate_changed_files`, and `summarize_checks` return
  text content.
- `summarize_checks` formats statuses with `✅`, `⚠️`, and `❌` based on exit code rules.

If your client returns no resources or templates for generic MCP discovery calls, confirm that the
repository MCP server is registered and connected before troubleshooting repository scripts.

## Handoff expectations

- Keep diffs focused and scoped to one intent when practical.
- Record exactly which checks were run.
- Call out skipped checks with reason.
- Update docs indices when contributor-facing docs move.
