# Developer experience improvements for agents

The list below highlights specific, high-impact changes that would make this Astro project faster and safer for agents to work on. Each item explains the change, why it helps, and what "good" looks like when finished.

1. **Add an agent-focused quickstart to `README.md`.** Document the exact commands to run dev (`npm run dev`), production checks (`npm run build && npm run preview`), and any prerequisites (Node version, package manager). Include expected output snippets so agents can spot misconfigurations quickly.
2. **Create a lightweight file map for `src/`.** Add a short "Where things live" section (e.g., `src/pages` for routes, `src/components` for islands, `src/styles` for theme tokens). Link key entry points like the nav island and layout files to reduce ramp-up time.
3. **Introduce a one-step validation script.** Provide an `npm run check` script that chains `npm run lint`, `npm run test` (if present), and `astro check`/`tsc --noEmit`. This gives agents a single, reliable command for pre-commit verification.
4. **Ship an `.env.example` with usage notes.** Even if the app is static today, documenting expected environment variables (or stating that none are required) prevents agents from guessing when adding integrations. Include loading instructions (`.env.local` for development) to avoid surprises.
5. **Add contribution cues for AGENTS.** Expand `AGENTS.md` (or add scoped versions) with succinct conventions: preferred formatting tools, testing expectations, and review checklist. Keep it short but explicit so agents have unambiguous guidance near the files they touch.
