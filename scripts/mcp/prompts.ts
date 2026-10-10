import { z } from "zod";

import { registerPrompt } from "./server";

// Prompt: Design engineer mode
registerPrompt(
  "design-engineer",
  "Activate design-engineer mode for taste-focused development",
  async () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `SYSTEM PROMPT — Design-Engineer Mode

You are operating as a design engineer.
Your job is to encode taste as structure, not to ship one-off solutions.

Global Constraints (Always On)

1. Prefer composable systems
   - Decompose work into orthogonal primitives
   - Primitives must compose safely
   - Avoid bespoke or tightly coupled logic unless unavoidable

2. Expose perceptual controls
   - Public interfaces use human-meaningful parameters: duration, delay, easing, intensity, distance
   - Hide low-level mechanics unless explicitly required
   - Defaults must feel intentional

3. Accessibility is default
   - Automatically respect system accessibility settings
   - Reduced-motion behavior must minimize spatial movement while preserving non-spatial affordances
   - No opt-in accessibility

4. Performance is UX
   - Prefer GPU-friendly, predictable execution
   - Avoid layout-thrashing patterns
   - Assume mid-range mobile hardware

5. Exploration-first
   - Designs must be safe to experiment with
   - Use bounded ranges and sensible defaults
   - Easy to reset, tweak, or undo

6. Optimize for legibility
   - Code should communicate intent
   - Favor clarity over cleverness

7. Ship complete surfaces
   - Outputs must be usable and integrable
   - Avoid demo-only abstractions

Decision Heuristic: fewer primitives, clearer knobs, safer defaults, better composability.`,
        },
      },
    ],
  }),
);

// Prompt: Code review
registerPrompt(
  "code-review",
  "Template for reviewing code changes",
  {
    files: z
      .string()
      .optional()
      .describe("Comma-separated list of files to review"),
  },
  async ({ files }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please review the following code changes${files ? ` in: ${files}` : ""}.

Check for:
1. **Correctness**: Does the code do what it's supposed to?
2. **TypeScript**: Are types explicit and avoiding \`any\`?
3. **Accessibility**: Are focus states, ARIA labels, and semantic HTML correct?
4. **Performance**: Are there unnecessary re-renders, large bundles, or layout thrashing?
5. **Consistency**: Does the code match existing patterns in the codebase?
6. **Testing**: Are there tests for new behavior?

Provide specific, actionable feedback with file locations and suggested fixes.`,
        },
      },
    ],
  }),
);

// Prompt: New component
registerPrompt(
  "new-component",
  "Scaffold a new Astro component",
  {
    name: z.string().describe("Name of the component (PascalCase)"),
    description: z
      .string()
      .optional()
      .describe("Brief description of the component"),
  },
  async ({ name, description }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a new Astro component called \`${name}\`${description ? `: ${description}` : ""}.

Requirements:
1. Place in \`src/components/${name}.astro\`
2. Use TypeScript interface for props
3. Follow existing component patterns in the codebase
4. Prefer server-side rendering (no \`client:*\` unless interaction is required)
5. Use semantic HTML and existing CSS utility classes from \`src/styles/global.css\`
6. Include accessible focus states and ARIA attributes where appropriate
7. Document optional props with JSDoc comments

Provide the complete component code.`,
        },
      },
    ],
  }),
);
