# Documentation guide

Use this map before adding or editing docs so guidance stays easy to find and maintain.

## Start here by audience

### Contributors (human and AI)

- [`contributor-workflow.md`](contributor-workflow.md): canonical change loop for everyday work.
- [`local-development.md`](local-development.md): setup, scripts, and troubleshooting.
- [`manual-qa.md`](manual-qa.md): manual browser checks for visual and interaction changes.
- [`deployment.md`](deployment.md): deploy flow and post-deploy verification.

### Agent contributors

- [`agent-developer-experience.md`](agent-developer-experience.md): agent onboarding and routing.
- [`mcp-and-skill-adoption-guide.md`](mcp-and-skill-adoption-guide.md): practical MCP and
  skill implementation options for contributors and web-browsing agents.
- [`agents/README.md`](agents/README.md): agent playbook index.
- [`agents/workflow-and-checks.md`](agents/workflow-and-checks.md): required validation rules.
- [`agents/repo-orientation.md`](agents/repo-orientation.md): where different change types belong.

### Architecture and implementation references

- [`architecture.md`](architecture.md), [`specifications.md`](specifications.md), and
  [`page-specifications.md`](page-specifications.md): routing and implementation expectations.
- [`content-data.md`](content-data.md), [`bundles.md`](bundles.md),
  [`content-components.md`](content-components.md): data and content systems.
- [`agent-metadata.md`](agent-metadata.md): public JSON-LD and machine-readable APIs.

### QA, diagnostics, and performance

- [`testing-todos.md`](testing-todos.md): coverage status and follow-up work.
- [`performance-guardrails.md`](performance-guardrails.md): CWV budgets and Playwright checks.
- [`cloudflare-playwright.md`](cloudflare-playwright.md): Playwright in Cloudflare builds.
- [`diagnostics-outputs.md`](diagnostics-outputs.md) and
  [`diagnostics-capacity-forecaster.md`](diagnostics-capacity-forecaster.md): diagnostics tooling.

### Planning and roadmap docs

- [`planning/planning-and-audits.md`](planning/planning-and-audits.md): consolidated hub for roadmap, PRDs, UX
  audits, and long-range strategy tracks.

## Documentation standards

- Prefer one canonical guide per topic; link rather than duplicate.
- Keep instructions imperative, short, and present tense.
- Use repository scripts and Bun-based commands in examples.
- Wrap lines near 100 characters for diff readability.
- Keep links relative where possible.

## Update checklist for doc changes

- Confirm a nearby guide does not already cover the same instruction.
- Update cross-links when files are renamed or moved.
- Refresh this index when adding, retiring, or relocating contributor-facing docs.
- Run formatting checks before commit.
