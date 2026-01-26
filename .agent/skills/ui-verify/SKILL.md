---
name: ui-verify
description: Verify UI changes using browser-based testing and visual checks.
required_tools:
  - run_command
  - browser_subagent
version: 1.0.0
---

# UI Verification Skill

Ensures visual and interactive changes match design system expectations and accessibility standards.

## Workflow

1. **Environment Setup**: Ensure the dev server is running.

   ```powershell
   bun dev
   ```

2. **Visual Audit**:
   - Check responsive layouts: Mobile (375px), Tablet (768px), Desktop (1280px).
   - Validate typography and color consistency.
   - Verify hover, active, and focus states.

3. **Accessibility**:
   - Keyboard navigation: All interactive elements reachable and focused.
   - Focus indicators: Clearly visible.
   - Contrast: Ensure AA compliance (4.5:1).

4. **Automated Verification**:
   - Run E2E routes:

     ```powershell
     bun run test:e2e
     ```

   - Run visual regression:

     ```powershell
     bun run test:visual
     ```

## Tools

Use the `browser_subagent` for automated visual checks and screenshots when manual verification is not preferred.
