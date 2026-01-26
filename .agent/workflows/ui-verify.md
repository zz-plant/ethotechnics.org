---
description: Verify UI changes using browser-based testing
---

# UI Verification Workflow

Browser-based verification for visual and interaction changes.

## Steps

// turbo

1. Start the development server:

   ```powershell
   bun dev
   ```

2. Open the affected pages in the browser at http://localhost:4321

3. Visual verification checklist:
   - Layout displays correctly at desktop (1920px), tablet (768px), and mobile (375px)
   - Colors and typography match design system
   - Interactive elements have hover/focus states
   - Animations play smoothly (no janky motion)

4. Accessibility verification:
   - Tab through all interactive elements
   - Verify focus indicators are visible
   - Check color contrast meets WCAG AA (4.5:1 for text)
   - Screen reader announces content correctly

// turbo 5. Run Playwright E2E tests for the affected routes:

```powershell
bun run test:e2e
```

// turbo 6. Run visual regression tests (Chromium only):

```powershell
bun run test:visual
```

## Responsive breakpoints

| Breakpoint | Width  | Target           |
| ---------- | ------ | ---------------- |
| Mobile     | 375px  | iPhone SE        |
| Tablet     | 768px  | iPad Mini        |
| Desktop    | 1280px | Laptop           |
| Wide       | 1920px | External monitor |

## When to use

- After modifying CSS or layout
- After changing component structure
- Before merging UI-related PRs

## Screenshot capture

To capture screenshots for comparison:

```powershell
# Capture specific page
bunx playwright screenshot http://localhost:4321/page-name --full-page
```
