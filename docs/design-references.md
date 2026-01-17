# Design references

Use these external references to ground visual system discussions and spot high-quality patterns.
Each link includes a short note on what to look for.

## rams.ai

Lessons to apply:

- Emphasize accessibility checks first (alt text, labels, keyboard focus, and contrast coverage).
- Audit layout, spacing, typography, and component states as repeatable review categories.
- Provide clear issue output with line numbers, snippets, and concrete fixes for design feedback.

## ui-skills.com

Lessons to apply:

- Use opinionated UI constraints to keep work consistent (Tailwind defaults, shared primitives).
- Favor accessible primitives, avoid rebuilding focus/keyboard behaviors, and label icon-only buttons.
- Keep interaction and animation rules conservative (compositor-only animation, short durations).
- Reinforce typography and layout defaults (balanced headings, text-pretty body, fixed z-index scales).
- Avoid over-styling (no gradients, no glow-heavy affordances, limited accent colors per view).

## Vercel Design Guidelines

Lessons to apply:

- Ensure keyboard access works everywhere and focus states are always visible.
- Use action-oriented copy and clear labels to reduce ambiguity in UI language.
- Make error messages actionable by pairing the issue with the next step.
- Keep terminology and placeholders consistent across related interfaces.

## Source revisit commands

Use these commands if you need a quick, local snapshot of the references:

- `curl -L https://rams.ai`
- `curl -L https://ui-skills.com`
- `curl -L https://vercel.com/design/guidelines`
