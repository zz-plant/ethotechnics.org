# Docs structure and ownership

Use this guide when adding or reorganizing contributor-facing documentation.

## Principles

- Keep one canonical page per workflow topic.
- Route readers from indexes to detailed guides.
- Prefer links over duplicated prose.
- Update indexes when files move.

## Current structure

```text
docs/
├── README.md                        # Top-level discovery map
├── contributor-workflow.md          # Shared human + agent delivery loop
├── local-development.md             # Setup, scripts, troubleshooting
├── agent-developer-experience.md    # Agent onboarding entry point
├── agents/
│   ├── README.md                    # Agent playbook index
│   ├── workflow-and-checks.md       # Validation expectations
│   ├── repo-orientation.md          # Where changes belong
│   ├── coding-practices.md          # Coding conventions
│   ├── formatting-and-tooling.md    # Commands and formatting rules
│   ├── version-control.md           # Git hygiene and PR guidance
│   └── review-checklist.md          # Final handoff checklist
└── ...domain/topic docs             # Architecture, content, QA, diagnostics
```

## Ownership boundaries

- `docs/README.md` owns top-level navigation.
- `docs/contributor-workflow.md` owns the shared contributor workflow.
- `docs/agent-developer-experience.md` owns agent onboarding.
- `docs/agents/*.md` own detailed agent execution practices.
- Domain docs own technical depth for specific systems.

## Restructure checklist

1. Update incoming links when files move.
2. Retire duplicate text and replace it with canonical pointers.
3. Refresh `docs/README.md` and affected `AGENTS.md` files.
4. Verify command examples still match `package.json` scripts.
