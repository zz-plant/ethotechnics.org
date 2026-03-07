# Weakest features triage (2026-03)

Decision memo that converts current UX critiques into a remove-or-improve backlog.

## Scope and input sources

This triage synthesizes findings from:

- [`mobile-ux-critique-2026-02.md`](mobile-ux-critique-2026-02.md)
- [`user-journey-critique.md`](user-journey-critique.md)
- [`roadmap.md`](roadmap.md)

## Decision rule: remove vs improve

Use this rule when deciding action type:

- **Remove** when a feature is duplicate, low-signal, or adds decision friction.
- **Improve** when a feature is strategic and part of core product differentiation.
- **Defer** only when an item depends on unresolved cross-team alignment.

## Current weakest features and actions

### 1) Duplicate hero incident actions on mobile

- **Weakness:** two near-identical incident entry actions consume first-screen attention.
- **Decision:** **remove duplicate + improve guidance**.
- **Action:** keep one primary incident CTA and convert duplicate action into supportive helper copy.
- **Why this choice:** this removes noise without reducing capability.

### 2) Search triage and relevance signaling

- **Weakness:** high result density with weak grouping and low prominence of top relevance cues.
- **Decision:** **improve**.
- **Action:** add lightweight facets, tighten snippet hierarchy, and add "best match" treatment for
  common governance queries.
- **Why this choice:** search is a core returning-user pathway and should not be reduced.

### 3) Navigation semantics and breadcrumb readability

- **Weakness:** anchor-vs-page expectations are not always clear; some breadcrumb labels read like
  raw paths.
- **Decision:** **improve**.
- **Action:** align nav labels with actual destination behavior and normalize breadcrumb labels to
  readable route names.
- **Why this choice:** wayfinding clarity improves confidence without removing navigation surface.

### 4) Mobile long-scroll before confidence cues

- **Weakness:** users still traverse long linear sections before reaching confidence-building context.
- **Decision:** **improve**.
- **Action:** add compact jump anchors for incident triage, diagnostics, standards, and evidence.
- **Why this choice:** preserves rich content while reducing tap and scroll cost.

### 5) Enforceable governance reference implementation gap

- **Weakness:** roadmap identifies a gap between described governance concepts and an enforceable
  reference implementation.
- **Decision:** **improve (strategic priority)**.
- **Action:** prioritize crosswalks, evidence-pack discipline, and post-market monitoring workflows.
- **Why this choice:** this is central product differentiation and should be strengthened, not cut.

## Priority sequence

### Phase 1 (remove friction fast)

1. Remove duplicate hero incident CTA.
2. Remove redundant quick-action micro-labeling where still present.
3. Normalize failure-priority copy grammar.

### Phase 2 (improve wayfinding)

1. Clarify navigation semantics (anchor vs dedicated page patterns).
2. Normalize breadcrumb readability.
3. Add mobile jump anchors for core destinations.

### Phase 3 (improve depth and strategy)

1. Add search grouping/facets and top-result emphasis.
2. Ship enforceable governance reference implementation increments from roadmap priorities.

## Acceptance criteria

- Homepage first screen has one unambiguous primary incident action on 390px width.
- Search results support faster triage through grouping and stronger top-result cues.
- Breadcrumbs and nav labels are human-readable and destination-consistent.
- Mobile users can jump to core sections without full linear scroll.
- Governance implementation work has visible shipped increments tied to roadmap acceptance criteria.
