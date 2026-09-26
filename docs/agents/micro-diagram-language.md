# Micro-Diagram Language Specification

Scope: internal reference for authors and developers creating diagrams across Ethotechnics.

## Purpose

Diagrams on ethotechnics.org illustrate automated decision systems, state transitions, authority boundaries, and contestability clocks. This document defines the canonical shapes, line semantics, and coordinate axes.

## 1. Canonical Shapes

Each shape keeps one meaning across diagrams:

- **State (Rounded Rectangle):** A discrete system state, lifecycle stage, or queue position.
- **Agent (Circle):** A human, team, or automated process holding agency or executing actions.
- **Boundary (Dashed Frame):** A boundary marking jurisdiction, policy perimeter, or architectural failure domain.
- **Authority (Shield):** An authority entity capable of binding policy, executing overrides, or enforcing remedies.

## 2. Line Semantics

- **Causal / Direct (Solid Arrow):** Direct execution, irreversible state transition, or enforcement.
- **Authority / Binding (Double Stroke):** Decisions that bind policy, establish rights, or require sign-off.
- **Contingent / Reversible (Dashed Arrow):** Reversible flows, conditional branches, or appeal submissions.

## 3. Coordinate Axes

When illustrating systems with spatial axes:
- **Time (Horizontal, left-to-right):** Start $\to$ completion, with explicit acknowledgment and remedy clock markers.
- **Authority (Vertical, bottom-to-top):** Affected individual $\to$ automated system $\to$ human steward $\to$ binding authority.
- **Burden (Weight / Shading):** Line thickness or shaded intervals represent accumulated time tax or user friction.

## 4. State Variable Glyphs

Ethotechnics evaluates six state variables across delegations:
1. `reach` (scale and jurisdiction)
2. `authority` (binding override capacity)
3. `reversibility` (ability to rollback state)
4. `velocity` (decision and execution speed)
5. `transparency` (reasons and verifiable records)
6. `recourse` (appeal and redress paths)

In UI components, render glyphs via `StateVariableGlyph.astro` rather than custom SVGs.
