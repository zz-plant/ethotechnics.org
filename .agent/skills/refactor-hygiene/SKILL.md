---
name: refactor-hygiene
description: Perform safe cleanup and refactors that reduce duplication, dead code, and maintenance burden.
required_tools:
  - run_command
version: 1.0.0
---

# Refactor Hygiene Skill

Use when the task is to simplify code, remove stale assets, or improve maintainability with minimal behavior change.

## Workflow

1. **Scope and safety**
   - Identify a narrow target (module, route group, or utility cluster).
   - Preserve public interfaces unless task explicitly allows breaking changes.

2. **Change strategy**
   - Remove dead code and redundant wrappers first.
   - Extract duplicated logic only when shared behavior is truly equivalent.
   - Prefer small, reviewable commits with clear intent.

3. **Risk controls**
   - Keep semantic behavior unchanged for user-facing flows.
   - Add or update tests when behavior could regress.

4. **Repository hygiene**
   - Delete obsolete files only after verifying no imports/references remain.
   - Update docs/comments that would otherwise become misleading.

5. **Validation**
   - Run `bun run check`.
   - Run focused tests for touched areas when available.

## Done criteria

- Diff removes complexity without changing expected behavior.
- No dangling imports, scripts, or docs references remain.
- Checks pass and rationale is clear in commit/PR notes.
