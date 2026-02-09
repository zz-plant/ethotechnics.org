# Contributor workflow

Practical guidance for keeping changes small, verifiable, and easy to review.

## Quick start

1. Use Node.js 20: `nvm use`.
2. Install dependencies with Bun: `bun install`.
3. Read `AGENTS.md` files in scope before editing.
4. Run focused checks during development.
5. Run the full required checks before commit.

## Standard change loop

1. Implement changes in the relevant source folder (`src/pages`, `src/components`, `src/layouts`,
   or `src/data`).
2. Run targeted checks while iterating.
   - `bun run lint`.
   - `bun run typecheck`.
   - `bun run test:unit`.
   - `bun run validate:json` for JSON schema/content changes.
   - `bun run validate:glossary` for glossary updates.
3. Run `bun run check` before commit for code or mixed changes.
4. For docs-only changes, run formatting checks and explicitly note skipped code checks.
5. Summarize checks and outcomes in your commit/PR notes.

## Docs-only update flow

- Keep docs concise and avoid duplicating guidance already captured elsewhere.
- Update `docs/README.md` when docs are added, moved, or retired.
- Prefer linking to canonical docs instead of copying full instructions.
- If scripts or workflows changed, update both contributor and agent docs in the same change.

## Pre-commit checklist

- `git status` contains only intended files.
- Required checks were run (or intentionally skipped with reason).
- Commands in docs match scripts in `package.json`.
- Cross-links resolve after renames/moves.
