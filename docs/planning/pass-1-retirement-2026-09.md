# Pass 1: retire peripheral applications

Scope confirmed September 26, 2026: complete and validate Pass 1 only.
This supersedes the earlier reconstruction plan's retention of these instruments.
The remaining standards, evaluation, taxonomy, and infrastructure consolidation is deferred.

## Retired surfaces

- System Auditor and Governance Gap Score redirect to the Delegation Audit.
- Capacity Forecaster, Maintenance Simulator, and Maintenance Debt Calculator redirect to Diagnostics.
- Agent Toolkit and its legacy aliases redirect to the retired-tools archive.
- Versioned prompt-pack downloads redirect to byte-identical archived files.

All redirects are permanent and preserve query strings. Historical source, tests,
original catalogue entries, glossary and mechanism snapshots, and the capacity guide
are preserved in `public/archive/retired-tools/source.tar.gz`. The adjacent manifest
records the source commit, paths, and SHA-256 checksum. `/archive/retired-tools` explains
the retirement and links to the downloads. Archived material is not maintained.

Active navigation, catalogue exports, routing cards, machine-reading guides, and
contributor docs no longer promote these products. The Delegation Audit remains a
self-report diagnostic; record conformance remains a mechanical check of a record stream.

## Validation

Run `bun run check`, `bun run build`, and served redirect/download checks.
Verify Diagnostics and the archive in a browser, including narrow-screen rendering.
