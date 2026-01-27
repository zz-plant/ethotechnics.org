# Python evaluation toolkit

Spec for the `ethotechnics-eval` package that provides baseline evaluators for governance,
research, and audit workflows.

## Goals

- Ship a pip-installable package with typed APIs and minimal dependencies.
- Provide reference implementations for evaluation math and standards mapping.
- Support notebook-friendly usage with small, composable modules.

## Non-goals

- Replace product SDKs or analytics pipelines.
- Offer a hosted evaluation service.
- Implement proprietary or closed-source benchmarks.

## Target users

- Researchers running offline evaluations.
- Auditors and risk teams validating evidence.
- Internal tooling teams needing baseline evaluators.

## Package layout

- `packages/ethotechnics-eval/`
  - `pyproject.toml` with Python 3.11+ metadata.
  - `src/ethotechnics_eval/` modules.
  - `README.md` with examples, CLI usage, and release notes.
  - `tests/` for unit coverage of math utilities.

## Core modules

- `schemas`: JSON Schema validators for core payloads.
- `time_in_harm`: calculators for time spent in harm states, plus normalization helpers.
- `burden_hours`: burden-hour scoring functions with summary helpers.
- `clause_mapping`: RMF / ISO clause mapping utilities for evaluation output.

## CLI

- `ethotechnics-eval validate <path>` validates a payload against schema definitions.
- `ethotechnics-eval evaluate <path>` returns a summary report for supported payloads.
- Output defaults to JSON; add `--format table` for human-readable summaries.

## Example flow

1. `pip install ethotechnics-eval`
2. `ethotechnics-eval validate examples/sample-payload.json`
3. `ethotechnics-eval evaluate examples/sample-payload.json`
4. Import `ethotechnics_eval` in a notebook to reuse the same evaluation helpers.

## Data contracts

- Align schemas with the JSON payloads used by diagnostics tools and planned SDKs.
- Version schemas explicitly; keep changelogs in the package README.
- Store reference schemas under `packages/ethotechnics-eval/schemas/`.

## Acceptance criteria

- `pip install` works for Python 3.11+.
- CLI validates sample payloads and produces evaluation summaries.
- Docs show a minimal end-to-end evaluation run with expected outputs.

## Dependencies and risks

- Blocked on final JSON schema set.
- Avoid duplicated logic with SDKs by sharing schema definitions.
- Keep dependencies minimal to support offline audit workflows.
