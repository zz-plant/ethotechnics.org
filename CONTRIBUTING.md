# Contributing to ethotechnics.org

Thanks for your interest in improving ethotechnics.org.

## Before you start

- Read the repository-wide guidance in [`AGENTS.md`](AGENTS.md).
- Follow local setup in [`docs/local-development.md`](docs/local-development.md).
- Review contribution workflow expectations in [`docs/contributor-workflow.md`](docs/contributor-workflow.md).

## Development workflow

1. Align toolchains: `nvm use` (Node.js 20.x baseline).
2. Install dependencies: `bun install`.
3. Create a branch for your change.
4. Make focused changes with clear commit messages.
5. Run required checks:
   - `bun run check` for code or mixed changes.
   - Docs-only updates can skip `bun run check`, but mention the skip in your PR.
6. Open a pull request using the PR template and summarize:
   - what changed
   - why it changed
   - what checks you ran

## Pull request expectations

- Keep PR scope small and reviewable.
- Prefer linked docs over duplicated guidance.
- Include screenshots for perceptible UI changes.
- Confirm CI passes (`.github/workflows/site-checks.yml`).

## Reporting issues

- Use issue templates for bug reports and content requests.
- For sensitive reports, contact the team via
  [hello@ethotechnics.org](mailto:hello@ethotechnics.org).
- For security vulnerabilities, follow [`SECURITY.md`](SECURITY.md) and use private reporting.

## Community standards

By participating, you agree to uphold our
[Code of Conduct](CODE_OF_CONDUCT.md).
