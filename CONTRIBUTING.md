# Contributing to ethotechnics.org

Most of what this project needs is not code.

## Ways to take part

- **Object to a clause.** Every clause links to the
  [objection form](https://github.com/zz-plant/ethotechnics.org/issues/new?template=objection.yml).
  Each objection gets a public answer within 30 days.
- **Challenge a score or propose a case.** A case needs a finding from a court, a statutory
  inquiry, or a regulator. Use the
  [content request form](https://github.com/zz-plant/ethotechnics.org/issues/new?template=content-request.yml).
- **Check a crosswalk.** Compare one row of the
  [crosswalks](https://ethotechnics.org/standards/enforceable-governance-crosswalks) against the
  text of the regulation, and open an issue where they differ.
- **Run the checker or the harness on a real system.** Say what broke or what the format cannot
  express, in [Discussions](https://github.com/zz-plant/ethotechnics.org/discussions).

The rest of this page is for changes to the site or the code.

## Before you start

- Read the repository-wide guidance in [`AGENTS.md`](AGENTS.md).
- Follow local setup in [`docs/local-development.md`](docs/local-development.md).
- Review contribution workflow expectations in [`docs/contributor-workflow.md`](docs/contributor-workflow.md).

## Development workflow

1. Align toolchains: `nvm use` (Node.js 22.x baseline).
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

- Use issue templates for bug reports, content requests, and objections.
- For sensitive reports, contact the team via
  [hello@ethotechnics.org](mailto:hello@ethotechnics.org).
- For security vulnerabilities, follow [`SECURITY.md`](SECURITY.md) and use private reporting.

## License

Contributions carry the license of the files they change. The [README](README.md#license) says
which is which.

## Community standards

By participating, you agree to uphold our
[Code of Conduct](CODE_OF_CONDUCT.md).
