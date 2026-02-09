# Docs structure and ownership

Use this file to keep developer-facing and agent-facing docs easy to navigate.

## Structure principles

- Keep one obvious entry point per audience.
- Keep process docs close to the workflows they govern.
- Prefer links to canonical guides over duplicated instructions.
- Update `docs/README.md` whenever docs are added, moved, or retired.

## Current navigation model

```text
docs/
├── README.md                        # Top-level map for all contributors
├── contributor-workflow.md          # Shared human + agent delivery loop
├── local-development.md             # Toolchain, setup, troubleshooting
├── agent-developer-experience.md    # Agent onboarding index and routing
├── agents/
│   ├── README.md                    # Agent playbook index
│   ├── workflow-and-checks.md
│   ├── formatting-and-tooling.md
│   ├── repo-orientation.md
│   ├── coding-practices.md
│   ├── version-control.md
│   └── review-checklist.md
└── ...domain/topic docs             # Architecture, content, testing, design, diagnostics
```

## Ownership boundaries

- `docs/README.md` owns discovery and high-level routing.
- `docs/contributor-workflow.md` owns the canonical change loop for all contributors.
- `docs/agent-developer-experience.md` owns agent onboarding and points to canonical playbooks.
- `docs/agents/*.md` own execution details for agent behavior.
- Domain docs own technical specifics (architecture, SEO, QA, diagnostics, etc.).

## When restructuring docs

1. Preserve permalinks when possible; otherwise update all incoming references.
2. Keep a single canonical file for each workflow topic.
3. Replace duplicated prose with short pointers to the canonical location.
4. Update `docs/README.md` and any affected scoped `AGENTS.md` guidance.
