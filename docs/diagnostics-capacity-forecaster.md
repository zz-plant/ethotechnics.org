# Diagnostics: Technical Capacity Forecaster

The forecaster projects engineering capacity over 24 months using simplified decay curves. Use these
notes to tune the model and interpret the charted trajectories.

## Inputs

- **Velocity index (0-100):** Captures pace and predictability. Higher scores increase decay.
- **Interruption rate (0-100):** Models operational drag from interrupts, escalations, and toil.
- **System stability:** One of `RESILIENT`, `DEGRADED`, or `UNSTABLE`, applying a stability
  multiplier.
- **Refusal window (weeks):** Number of weeks the team can decline work before remediation benefits
  start.

## Configuration

`src/features/capacity-forecaster/utils/modelConfig.ts` centralizes the tunable constants:

- `baseDecay`: Background decay applied every month (default `0.02`).
- `maxImpact`: Maximum contribution from velocity and interruptions after scaling (default `0.05`).
- `stabilityMultipliers`: Decay multipliers per stability state (`0.85`, `1`, `1.2`).
- `remediatedDecayMultiplier`: Percentage of decay applied after remediation starts (default `0.7`).
- `saturationThreshold`: Capacity level that triggers a saturation flag (default `0.35`).
- `monthsToProject`: Months generated in each forecast (default `24`).
- `metricScaleMax`: Cap for velocity/interrupt inputs before scaling to decay (default `100`).
- `refusalWeeksPerMonth` and `maxRefusalWeeks`: Convert refusal weeks to months and cap the input.

## Projection behavior

- Monthly decay combines the base rate with scaled velocity and interruption impacts, then applies
  the stability multiplier.
- Remediated capacity stays flat during the refusal window, then decays at the reduced multiplier.
- Saturation is marked on the first month where remediated capacity drops to or below the threshold,
  storing the index and the month label.

## Tests

Bun test coverage in `src/features/capacity-forecaster/utils/projectionEngine.test.ts` locks
expected decay curves and saturation detection for representative inputs.
