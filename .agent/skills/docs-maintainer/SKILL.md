---
name: docs-maintainer
description: Maintain documentation changes with correct placement, check policy, and PR-ready outcomes.
required_tools:
  - run_command
version: 1.0.0
---

# Docs Maintainer Skill

Use this skill for docs-only and docs-heavy updates in this repository.

## When to use

- Adding or editing guides under `docs/`.
- Updating contributor/agent workflow documentation.
- Indexing new docs pages in `docs/README.md`.

## Workflow

1. **Route content first**
   - Open `docs/README.md` and place updates in the correct audience section.
   - Avoid duplicating guidance that already exists in canonical docs.

2. **Apply scoped instructions**
   - Read root `AGENTS.md` and `docs/AGENTS.md`.
   - Keep tone concise, imperative, and contributor-focused.

3. **Run docs checks**
   - Run formatting checks for touched docs files.

   ```bash
   bunx prettier --check <changed-docs>
   ```

   - For docs-only changes, `bun run check` may be skipped.
   - For mixed code + docs changes, run full checks:

   ```bash
   bun run check
   ```

4. **Record outcomes for PR notes**
   - Include exact commands and pass/fail result.
   - If skipping `bun run check`, include a one-line reason.

## Done criteria

- New/updated docs are indexed when needed (`docs/README.md`).
- Commands in docs match scripts in `package.json`.
- Check results are recorded in PR notes with explicit skip reasons when applicable.
