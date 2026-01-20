# Manual QA checklist

Use this checklist for UI or UX-facing changes that warrant hands-on verification beyond automated
coverage. Keep notes short and include the exact environment (browser, device, viewport) when you
record results.

## When to run manual QA

- Any change to page layout, navigation, or content presentation.
- Updates to interactive components, forms, or keyboard flows.
- Visual system changes (typography, spacing, color, or imagery).

## Checklist

### Interaction and performance

- Interaction feedback renders immediately (hover/active state or loading indicator within 100ms).
- Animations only use `transform` or `opacity`, and they feel smooth on mid-tier hardware.
- No animations on layout-affecting properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
- No layout thrashing: layout reads and style writes are not mixed in the same sync block.
- Layout is handled in CSS instead of JavaScript where possible.
- No layout shifts when content loads; images reserve their final size.

### Accessibility and keyboard flow

- Full keyboard navigation works with a logical focus order.
- Focus is visible with a contrast ratio of at least 3:1 on every interactive element.
- Modals (if present) trap focus and return focus to the trigger on close.
- Touch targets meet the 44x44px minimum, including on mobile.
- Any custom focus styling replaces the default outline (no `outline: none` without a replacement).

### Forms and data safety

- Submit actions always respond; invalid submissions move focus to the first error.
- Submit buttons are not disabled solely due to invalid state; errors surface on submit.
- In-flight submissions show a loading state and prevent double submission.
- Failed submissions keep user input intact (no data loss on error or back navigation).
- State persistence (local/session storage) keeps form inputs after failures or navigation.
- Validation errors fire on blur, not on every change event.

### Mobile behavior

- Input fields keep a 16px computed font size to prevent zoom-on-focus.
- Scrollable overlays contain overscroll so the page does not scroll beneath them.
- Interactive elements use `touch-action: manipulation` to reduce tap delay.

### URLs and state

- URL parameters reflect filters, tabs, or modal state where applicable.
- The URL is the source of truth for UI state (filters, search, tabs, modals).
- Back/forward navigation reverses the most recent UI state change.

## Recording results

- Capture pass/fail notes in the PR summary with the exact steps taken.
- If a checklist item is skipped, note the reason and any follow-up work needed.
