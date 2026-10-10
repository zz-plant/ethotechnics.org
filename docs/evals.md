# The three eval surfaces

Three components in this repo answer to the name "evals." They share the benchmark data and the
research program but serve different readers. Do not merge them; know which one you are in.

## 1. Eval case data + coverage pages

- Data: `src/data/eval-test-cases.json` (benchmark cases; see
  `planning/content-layer-rationale-2026-10.md`), shapes and suites in `src/content/evals.ts`.
- Rendered at `/evals` for readers: what each case tests and what coverage exists.

## 2. Tier 1 governance harness

- Code: `src/harness/` — `checks.ts` (the twelve Tier 1 checks), `run.ts`, `reference.ts`
  (an out-of-the-box reference system), `cli.ts`.
- Entry point: `bun run eval:harness`. Runs checks against a system through a
  `GovernanceAdapter`; writes JSON and Markdown reports to `eval-reports/`.
- Consumer of the case data: `src/content/checkable-properties.ts` maps which case properties a
  harness check can actually answer.

## 3. Green-dashboard simulation

- Site feature: `src/features/eval-runner/` — `EvalRunner.tsx` (island UI),
  `simulationEngine.ts` (deterministic institution simulator), `batchRunner.ts`, `calibration.ts`.
- Renders the interactive benchmark on the research page; shares the benchmark's scoring
  anchors with the LLM benchmark below.

## 4. Local LLM benchmark runner

- Script: `scripts/run-local-llm-evals.ts` (Ollama-based; `bun run eval:local-llm`).
- Puts a real model in the executive seat of the same simulated institution and grades what it
  does. Writes to `eval-reports/`. Benchmark fixtures: `src/data/green-dashboard-benchmark.json`.

## Adding a new eval case

1. Add the case to `src/data/eval-test-cases.json` (keep the `_canary` field intact).
2. If a Tier 1 check covers it, extend `src/harness/checks.ts` and list it in `tier1Checks`.
3. If it belongs in the interactive simulation or the LLM benchmark, extend
   `src/features/eval-runner/` or the corresponding runner section — the simulator and the LLM
   runner must stay behaviorally comparable; a change to one is a change the other must mirror.
