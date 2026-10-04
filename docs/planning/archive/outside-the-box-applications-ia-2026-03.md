# Outside-the-box applications IA recommendations (2026-03)

This memo translates the proposed "ethics you can operate" use cases into concrete
information architecture updates for ethotechnics.org.

## Current IA snapshot (what exists now)

- Top navigation emphasizes About, Specs, Examples, Adoption, Contact, and Security.
- `/start-here` routes users to diagnostics, mechanisms, field notes, and Institute participation.
- `/how-it-works` explains the core operating model but does not map it to sector-specific
  deployment patterns.
- `/adopt/*` has role-based entry pages (build, operations, policy) with short orientation copy.
- `/diagnostics`, `/examples`, `/standards`, and `/mechanisms` already contain reusable primitives
  that can support broader non-AI-governance use.

## What to add

### 1) Add an "Applications" hub for deployable patterns

Create a new route (for example, `/applications`) with cards for each applied operating pattern:

- Moral circuit breakers (halt / slow / escalate controls)
- Consent control systems (receipts, progressive permissions, undo)
- Complaints-to-repair pipelines (intake through remediation)
- Internal agent training wheels (scope, approvals, reversibility)
- Ethical procurement due diligence
- Measurable values to enforceable SLOs
- Multi-agent constitutions and liability boundaries
- Community governance and restorative pathways
- Ethical chaos engineering drills
- Post-incident repair and restitution paths

Each card should include:

- Trigger conditions (when to use)
- Required roles (who owns each step)
- Interface controls (what users/operators can do)
- Fail-safe behavior (what happens on breach)
- Links to matching standards, mechanisms, diagnostics, and examples

### 2) Add an "Ethics API" reference page

Create a technical reference route (for example, `/applications/ethics-api`) that frames
ethotechnics as internal platform services:

- Escalation routing service
- Consent receipt service
- Harm-case management service
- Rollback and restitution workflow service
- Audit log / evidence export service

Structure it like API/platform docs:

- Service boundary
- Inputs/outputs
- Integration checklist
- Failure modes and fallback behavior
- Evidence artifacts generated per integration

### 3) Add crosswalk pages by operating context

Create context pages under `/applications` that map use cases to existing site assets:

- Healthcare triage and diagnostics tools
- Financial fraud and lending decisions
- Workplace monitoring and HR automation
- Platform moderation and marketplace disputes
- Government procurement and public service eligibility

Each page should cross-link to:

- `/standards/*` for normative controls
- `/diagnostics/*` for readiness and rehearsal
- `/examples/*` for implementation walkthroughs
- `/evidence-packs/*` for audit artifacts

## What to adjust in existing IA

### 1) Make "Applications" a first-class navigation concept

- Add Applications to primary navigation (or utility navigation if space is constrained).
- Add an Applications entry card in `/start-here` route selection.
- Add one CTA from `/how-it-works` to the Applications hub for practical deployment paths.

### 2) Expand adoption pages from orientation to operating checklists

Current `/adopt/build`, `/adopt/ops`, and `/adopt/policy` pages are concise orientation pages.
Extend each with a short operational checklist:

- Build: guardrails, approvals, reversibility, observability defaults
- Ops: incident intake, SLAs, escalation ladders, repair logging
- Policy: binding commitments, recourse obligations, incident disclosure requirements

### 3) Add a dedicated "Repair and Recourse" cluster

Ethotechnics already references contestability and remedy concepts, but discoverability can
improve by grouping them as a clear cluster:

- Repair log design
- Restitution workflow templates
- Time-to-remedy expectations
- Decision reversal playbooks

This can be a standalone route or a clearly labeled subsection under existing explainers.

### 4) Add drill-oriented discoverability

Promote rehearsal workflows as a visible journey:

- Add "Run a moral failure drill" entry from `/diagnostics`
- Link drill templates to incident examples and post-incident memo templates
- Add suggested metrics (time-to-detect, time-to-remedy, quality-of-repair)

## Suggested rollout order

1. Ship `/applications` hub and one pilot page: `/applications/moral-circuit-breakers`.
2. Add nav + start-here + how-it-works links.
3. Expand `/adopt/*` pages with checklist blocks.
4. Add Ethics API reference and context crosswalk pages.
5. Add drill discoverability + repair cluster.

## Success criteria

- Users can reach an applied pattern in one click from a top-level entry.
- Every application page links to standards, diagnostics, examples, and evidence packs.
- Teams can identify owners, controls, and fail-safes without leaving a single page.
- Repair/remedy paths are as discoverable as prevention guidance.
