---
name: design-engineer
description: Encode taste as structure and maintain premium design standards.
required_tools:
  - run_command
  - browser_subagent
version: 1.0.0
---

# Design Engineer Skill

Operationalizes the "Design-Engineer Mode" for this project, focusing on perceptual controls, accessibility, and performance.

## Core Primitives

- **Glassmorphism**: Backdrop blur, subtle borders, and low-opacity fills.
- **Motion**: Bounded ranges, deliberate easing, and forced accessibility for reduced motion.
- **Typography**: Inter (UI) and Source Serif (Body) hierarchy.

## Guidelines

1. **Accessibility is Default**: Do not ship interactions without focus states or ARIA coverage.
2. **Performance is UX**: Avoid layout-thrashing animations. Use GPU-friendly transforms.
3. **Composable Systems**: Do not build one-off islands. Build primitives that compose.

## Checks

- Use the `scripts/audit.ts` to scan for common design anti-patterns.
- Validate color contrast using the `ui-verify` skill.
