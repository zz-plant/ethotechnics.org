# Developer experience checklist for agents

This file tracks open gaps for agents working in the repo. Existing references are summarized
here to keep onboarding short.

## Current agent references

- Quickstart commands and expected output live in
  [README.md#quickstart-for-agents](../README.md#quickstart-for-agents).
- The file map for `src/` lives in
  [README.md#where-things-live](../README.md#where-things-live).
- Validation uses [README.md#checks-before-committing](../README.md#checks-before-committing) and
  the one-step [`npm run check`](../README.md#checks-before-committing) script.
- Environment setup and `.env` loading are covered in
  [README.md#environment-configuration](../README.md#environment-configuration).

## Improvements still needed

- Add scoped `AGENTS.md` files under `src/pages` and `src/components` to capture layout, styling,
  and navigation conventions near the code.
- Document a short troubleshooting note for Playwright install hiccups (system dependencies,
  `npx playwright install --with-deps`) alongside the e2e instructions to reduce setup churn.
