# Developer experience checklist for agents

This file tracks open gaps for agents working in the repo. Existing references are summarized
here to keep onboarding short.

## Current agent references

- Quickstart commands and expected output live in
  [README.md#quickstart-for-agents](../README.md#quickstart-for-agents).
- The file map for `src/` lives in
  [README.md#where-things-live](../README.md#where-things-live).
- Scoped conventions live alongside the code in
  [`src/AGENTS.md`](../src/AGENTS.md),
  [`src/pages/AGENTS.md`](../src/pages/AGENTS.md), and
  [`src/components/AGENTS.md`](../src/components/AGENTS.md).
- Validation uses [README.md#checks-before-committing](../README.md#checks-before-committing) and
  the one-step [`npm run check`](../README.md#checks-before-committing) script.
- Environment setup and `.env` loading are covered in
  [README.md#environment-configuration](../README.md#environment-configuration).

## Improvements still needed

- Add a troubleshooting snippet for Playwright browser downloads that fail even after
  `npx playwright install --with-deps` (e.g., network or proxy issues) near the e2e instructions so
  new agents can recover quickly.
