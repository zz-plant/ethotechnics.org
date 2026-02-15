# Full refactor plan

This plan defines a staged, low-risk refactor of the ethotechnics.org codebase.
It prioritizes clarity, maintainability, and delivery continuity.

## Objectives

- Improve code readability and architecture consistency.
- Reduce regression risk in content rendering, routing, and SEO-critical paths.
- Strengthen test coverage and delivery confidence.
- Preserve production behavior unless a change is explicitly approved.

## Non-goals

- Redesign visual identity in this effort.
- Replace the framework/runtime unless benchmark data supports it.
- Rewrite stable modules that already meet quality and performance targets.

## Guiding principles

- Ship in small, reviewable increments.
- Preserve user-facing behavior by default.
- Prefer extraction and modularization over broad rewrites.
- Add tests before changing fragile behavior.
- Use objective metrics (build time, test pass rate, CWV) to gate progress.

## Phase 0: discovery and baseline (Week 1)

### Deliverables

- Current-state architecture map (routing, data flow, shared utilities).
- Inventory of high-churn and high-defect modules.
- Baseline metrics dashboard for:
  - Build duration.
  - Type-check and lint diagnostics.
  - Test coverage and flaky test rate.
  - Core Web Vitals and key Lighthouse signals.

### Tasks

- Document module boundaries and dependency hotspots.
- Tag technical debt by risk and effort (critical/high/medium/low).
- Define acceptance criteria for each refactor workstream.

## Phase 1: safety net expansion (Weeks 1-2)

### Deliverables

- Test plan covering unit, integration, and page-level smoke scenarios.
- Snapshot/visual checks for critical templates and components.
- CI quality gates aligned with `bun run check` and targeted test commands.

### Tasks

- Add missing tests around content rendering and metadata generation.
- Stabilize flaky tests and remove non-deterministic setup.
- Add fixture-based tests for representative content bundles.

## Phase 2: architecture alignment (Weeks 2-4)

### Deliverables

- Clear layered structure for content, domain logic, and UI composition.
- Reduced cross-layer imports and circular dependencies.
- Standardized shared utilities with documented ownership.

### Tasks

- Extract domain services from page-level orchestration code.
- Introduce consistent folder conventions and module entry points.
- Replace duplicated helpers with typed shared abstractions.

## Phase 3: component and page refactor (Weeks 3-6)

### Deliverables

- Simplified, composable page templates and content components.
- Unified prop contracts and stricter TypeScript boundaries.
- Reduced component complexity (target lower branching and file size).

### Tasks

- Break large components into focused subcomponents.
- Normalize naming, prop structures, and state derivation patterns.
- Remove dead styles, legacy variants, and unused exports.

## Phase 4: data/content pipeline hardening (Weeks 4-7)

### Deliverables

- Deterministic content transforms with explicit schemas.
- Validation at content ingestion boundaries.
- Improved diagnostics for malformed or incomplete content.

### Tasks

- Add schema validation for content collections and frontmatter.
- Centralize content transformation and fallback rules.
- Add structured logging around content processing failures.

## Phase 5: performance and DX optimization (Weeks 6-8)

### Deliverables

- Measured improvements to build time and runtime performance.
- Better local feedback loop for contributors and agents.
- Updated docs for architecture decisions and contributor workflows.

### Tasks

- Profile bundle composition and eliminate expensive hot paths.
- Optimize route-level loading and static generation bottlenecks.
- Refresh docs under `docs/agents/` and contributor guides to match changes.

## Workstream ownership model

- Architecture lead: defines boundaries, reviews cross-cutting decisions.
- Content/data lead: owns schema, transforms, and validation behavior.
- UI lead: ensures composability and accessibility parity.
- QA lead: governs regression suites and release-readiness checks.

## Governance and cadence

- Weekly planning review with risk updates and phase checkpoints.
- Twice-weekly refactor standup focused on blockers and scope control.
- ADR required for high-impact architecture decisions.
- Every merged refactor PR includes before/after notes and rollback path.

## Success metrics

- 0 critical regressions in content rendering and routing during rollout.
- 20-30% reduction in average module complexity for targeted files.
- Lower CI failure/flakiness rate over baseline.
- Measurable reduction in build time and stable CWV at or above baseline.

## Risk register

- Scope creep -> enforce phase gates and explicit non-goals.
- Hidden coupling -> prioritize dependency mapping before module moves.
- Regression risk -> expand smoke tests before touching critical paths.
- Team throughput impact -> cap parallel refactor streams and preserve feature bandwidth.

## Execution checklist

- Approve baselines and success metrics.
- Sequence work into milestone PR batches.
- Run quality checks on each batch.
- Publish weekly status against objectives and risks.
- Run final hardening cycle before declaring refactor complete.
