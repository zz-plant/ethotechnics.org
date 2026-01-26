# Interop release plan

Short-term release plan for cross-stack interoperability deliverables.

## Python package: `ethotechnics-eval`

Scope: ship evaluation utilities that can run in offline analysis pipelines and backend services.

Target: researchers, auditors, risk teams, and internal governance tooling.

Why:

- Python dominates compliance analytics, risk modeling, and governance research.
- It embeds easily in notebooks, audits, and prototype pipelines.

What to ship:

- Reference validators for schemas.
- Time-in-harm calculators.
- Burden-hour scoring functions.
- RMF / ISO clause-mapping evaluators.
- A pip-installable package (`ethotechnics-eval`) with typed APIs and docs.

Initial modules:

- Schema validators for inputs/outputs used by burden and harm tracking.
- Time-in-harm calculators and normalization helpers.
- Burden-hours scoring utilities with summary output helpers.
- Clause mapping helpers that map evaluations to standards clauses.

In-repo artifacts (planned location):

- `packages/ethotechnics-eval/` with `pyproject.toml` and `src/ethotechnics_eval/` modules.
- `packages/ethotechnics-eval/README.md` for API shape, examples, and release notes.

## TypeScript SDK

Scope: provide embeddable client primitives for web apps and services that emit governance events.

Initial modules:

- Event emitter with batching, retries, and opt-in transport adapters.
- Decision-log middleware for Node and edge runtimes.
- Frontend-safe shared types for decisions, harms, and burden summaries.

In-repo artifacts (planned location):

- `packages/ethotechnics-sdk/` with `package.json` and `src/` modules.
- `packages/ethotechnics-sdk/README.md` for integration snippets and versioned changelog.

## FHIR profile + W3C VC schema deliverables

Scope: publish interoperable data artifacts so health and credential ecosystems can reuse
ethotechnics evaluations.

Deliverables:

- FHIR profile package with `StructureDefinition`, `ValueSet`, and example resources.
- W3C Verifiable Credential JSON-LD context plus JSON Schema for issuance/verification.

In-repo artifacts (planned location):

- `interop/fhir/` for profile JSON, IG source, and example bundles.
- `interop/vc/` for JSON-LD contexts, JSON Schemas, and sample credentials.
