export {};

type RouteMetricEvent = {
  route: string;
  page: string;
  action: string;
  href: string;
  elapsedMs: number;
  timestamp: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const root = document.querySelector<HTMLElement>("[data-route-metrics]");

if (root) {
  const routeName = root.dataset.routeMetrics ?? "unknown-route";
  const start = performance.now();
  let firstActionCaptured = false;

  const publishMetric = (event: RouteMetricEvent) => {
    const existing = (() => {
      const raw = localStorage.getItem("ethotechnics.routeMetrics");
      if (!raw) return [] as RouteMetricEvent[];

      try {
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [] as RouteMetricEvent[];

        return parsed.filter((item): item is RouteMetricEvent => {
          if (!item || typeof item !== "object") return false;
          const candidate = item as Record<string, unknown>;

          return (
            typeof candidate.route === "string" &&
            typeof candidate.page === "string" &&
            typeof candidate.action === "string" &&
            typeof candidate.href === "string" &&
            typeof candidate.elapsedMs === "number" &&
            typeof candidate.timestamp === "string"
          );
        });
      } catch {
        return [] as RouteMetricEvent[];
      }
    })();

    const next = [...existing.slice(-49), event];
    localStorage.setItem("ethotechnics.routeMetrics", JSON.stringify(next));

    window.dispatchEvent(
      new CustomEvent<RouteMetricEvent>("ethotechnics:route-metric", {
        detail: event,
      }),
    );

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "route_metric",
      route: event.route,
      page: event.page,
      action: event.action,
      href: event.href,
      elapsedMs: event.elapsedMs,
      timestamp: event.timestamp,
    });
  };

  const actions = document.querySelectorAll<HTMLAnchorElement>(
    "[data-route-action]",
  );
  const capture = (link: HTMLAnchorElement) => {
    if (firstActionCaptured) return;
    firstActionCaptured = true;

    const elapsedMs = Math.round(performance.now() - start);
    publishMetric({
      route: routeName,
      page: window.location.pathname,
      action: link.dataset.routeAction ?? "unknown-action",
      href: link.getAttribute("href") ?? "",
      elapsedMs,
      timestamp: new Date().toISOString(),
    });
  };

  actions.forEach((link) => {
    link.addEventListener("pointerdown", () => capture(link));
    link.addEventListener("click", () => capture(link));
    link.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") capture(link);
    });
  });
}
