import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";

import CapacityChart from "./CapacityChart";
import type { CapacityPoint } from "./types";

const sampleData: CapacityPoint[] = [
  { monthIndex: 0, dateLabel: "Jan", baseline: 0.9, remediated: 0.95, isSaturated: false },
  { monthIndex: 1, dateLabel: "Feb", baseline: 0.82, remediated: 0.9, isSaturated: false },
  { monthIndex: 2, dateLabel: "Mar", baseline: 0.78, remediated: 0.86, isSaturated: true },
];

const extractGradientId = (element: Element | null) => {
  const fill = element?.getAttribute("fill");
  const match = fill?.match(/url\(#(.+)\)/);
  return match?.[1] ?? null;
};

afterEach(cleanup);

describe("CapacityChart gradients", () => {
  it("generates unique gradient IDs and wires fills to matching defs", () => {
    const { container } = render(
      <>
        <CapacityChart
          data={sampleData}
          saturationIndex={1}
          saturationDate={sampleData[1]?.dateLabel ?? null}
        />
        <CapacityChart
          data={sampleData}
          saturationIndex={2}
          saturationDate={sampleData[2]?.dateLabel ?? null}
        />
      </>,
    );

    const charts = Array.from(container.querySelectorAll(".forecaster__chart"));
    expect(charts).toHaveLength(2);

    const gradientIds = charts.flatMap((chart) =>
      Array.from(chart.querySelectorAll("linearGradient")).map((gradient) => gradient.id),
    );

    expect(new Set(gradientIds).size).toBe(gradientIds.length);

    charts.forEach((chart) => {
      const chartGradients = Array.from(chart.querySelectorAll("linearGradient"));
      expect(chartGradients).toHaveLength(2);

      const chartGradientIds = chartGradients.map((gradient) => gradient.id);
      const baselineFillId = extractGradientId(
        chart.querySelector(".forecaster__chart-area--baseline"),
      );
      const remediatedFillId = extractGradientId(
        chart.querySelector(".forecaster__chart-area--remediated"),
      );

      expect(baselineFillId).toBeTruthy();
      expect(remediatedFillId).toBeTruthy();
      expect(chartGradientIds).toContain(baselineFillId);
      expect(chartGradientIds).toContain(remediatedFillId);
    });
  });
});
