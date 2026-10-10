import { initializeSelectScorePlanner } from "./select-score-planner";

initializeSelectScorePlanner({
  formSelector: "[data-evidence-form]",
  resultsSelector: "[data-evidence-results]",
  scoreSelector: "[data-evidence-score]",
  tierSelector: "[data-evidence-tier]",
  summarySelector: "[data-evidence-summary]",
  shareSelector: "[data-evidence-share]",
  copySelector: "[data-evidence-copy]",
  storageKey: "evidence-pack-readiness",
  fields: ["cadence", "completeness", "timing"],
  scoreMatrix: {
    cadence: {
      release: 35,
      quarterly: 22,
      "ad-hoc": 10,
    },
    completeness: {
      high: 40,
      medium: 25,
      low: 10,
    },
    timing: {
      fast: 25,
      steady: 15,
      slow: 5,
    },
  },
  tiers: [
    {
      label: "Strong",
      min: 80,
      status: "green",
      summary:
        "Readiness is strong. Keep cadence steady and confirm artifact coverage.",
    },
    {
      label: "Steady",
      min: 60,
      status: "yellow",
      summary:
        "Readiness is workable but incomplete. Prioritize missing artifacts.",
    },
    {
      label: "Exposed",
      min: 40,
      status: "red",
      summary:
        "Evidence gaps are material. Address cadence and coverage quickly.",
    },
    {
      label: "Critical",
      min: 0,
      status: "red",
      summary:
        "Readiness is missing. Pause for evidence collection before audits.",
    },
  ],
  restoreErrorMessage: "Unable to restore readiness draft",
});
