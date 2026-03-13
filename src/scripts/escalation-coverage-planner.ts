import { initializeSelectScorePlanner } from "./select-score-planner";

initializeSelectScorePlanner({
  formSelector: "[data-coverage-form]",
  resultsSelector: "[data-coverage-results]",
  scoreSelector: "[data-coverage-score]",
  tierSelector: "[data-coverage-tier]",
  summarySelector: "[data-coverage-summary]",
  shareSelector: "[data-coverage-share]",
  copySelector: "[data-coverage-copy]",
  storageKey: "escalation-coverage-planner",
  fields: ["owner", "coverage", "drills"],
  scoreMatrix: {
    owner: {
      dedicated: 40,
      shared: 25,
      none: 10,
    },
    coverage: {
      "24-7": 40,
      business: 25,
      "ad-hoc": 10,
    },
    drills: {
      quarterly: 20,
      annual: 12,
      never: 5,
    },
  },
  tiers: [
    {
      label: "Strong",
      min: 80,
      status: "green",
      summary:
        "Coverage is resilient. Keep drills on cadence and confirm owners quarterly.",
    },
    {
      label: "Steady",
      min: 60,
      status: "yellow",
      summary:
        "Coverage is workable but uneven. Confirm coverage windows and drill cadence.",
    },
    {
      label: "Exposed",
      min: 40,
      status: "red",
      summary:
        "Coverage gaps are material. Assign owners and formalize response windows.",
    },
    {
      label: "Critical",
      min: 0,
      status: "red",
      summary:
        "Coverage is missing. Pause launch plans until escalation coverage is defined.",
    },
  ],
  restoreErrorMessage: "Unable to restore coverage draft",
});
