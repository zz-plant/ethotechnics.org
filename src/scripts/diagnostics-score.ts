const calculator = document.querySelector<HTMLElement>(
  "[data-diagnostics-calculator]",
);

if (calculator) {
  const inputs = Array.from(
    calculator.querySelectorAll<HTMLInputElement>("[data-score-input]"),
  );
  const scoreValue = calculator.querySelector<HTMLElement>(
    "[data-score-value]",
  );
  const scoreLabel = calculator.querySelector<HTMLElement>(
    "[data-score-label]",
  );
  const scoreRecommendation = calculator.querySelector<HTMLElement>(
    "[data-score-recommendation]",
  );
  const outputs = Array.from(
    calculator.querySelectorAll<HTMLOutputElement>("[data-score-output]"),
  );

  const recommendationBands = [
    {
      min: 0,
      max: 33,
      label: "Low burnout pressure",
      detail:
        "Keep routines steady and sanity-check with the Maintenance Simulator each quarter.",
    },
    {
      min: 34,
      max: 66,
      label: "Elevated load",
      detail:
        "Use the Burden Modeler to quantify hotspots before the next cycle lands.",
    },
    {
      min: 67,
      max: 100,
      label: "High strain",
      detail:
        "Escalate to the Burden Modeler or a Studio session to prevent burnout spikes.",
    },
  ];

  const getValues = () =>
    inputs.reduce<Record<string, number>>((accumulator, input) => {
      const value = Number(input.value);
      const key = input.dataset.scoreInput ?? input.id;
      accumulator[key] = Number.isNaN(value) ? 0 : value;
      return accumulator;
    }, {});

  const updateOutputs = (values: Record<string, number>) => {
    outputs.forEach((output) => {
      const key = output.dataset.scoreOutput;
      if (!key) {
        return;
      }
      const nextValue = values[key];
      if (typeof nextValue === "number") {
        output.textContent = `${nextValue}`;
      }
    });
  };

  const updateScore = () => {
    const values = getValues();
    const workload = values.workload ?? 0;
    const volatility = values.volatility ?? 0;
    const recovery = values.recovery ?? 0;
    const riskAverage = (workload + volatility + (10 - recovery)) / 3;
    const score = Math.round((riskAverage / 10) * 100);

    const band = recommendationBands.find(
      ({ min, max }) => score >= min && score <= max,
    );

    if (scoreValue) {
      scoreValue.textContent = `${score}`;
    }

    if (scoreLabel) {
      scoreLabel.textContent = band?.label ?? recommendationBands[1].label;
    }

    if (scoreRecommendation) {
      scoreRecommendation.textContent =
        band?.detail ?? recommendationBands[1].detail;
    }

    updateOutputs(values);
  };

  inputs.forEach((input) => {
    input.addEventListener("input", updateScore);
  });

  updateScore();
}
