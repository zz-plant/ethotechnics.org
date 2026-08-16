import {
  bindGlobalSearchListeners,
  bindSearchInstance,
} from "./search-modal/controls";
import { createPagefindAdapter } from "./search-modal/pagefind";
import {
  createSearchStorage,
  createUrlStateSync,
  searchStateParams,
} from "./search-modal/query-state";
import type {
  HapticOptions,
  HapticPattern,
  SearchInstance,
} from "./search-modal/types";

const HAPTIC_VIBRATION_PATTERNS: Record<HapticPattern, number | number[]> = {
  nudge: 12,
  success: [12, 20, 16],
  error: [24, 14, 24],
};

const createHapticsController = () => {
  const canVibrate =
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

  if (!canVibrate) {
    return null;
  }

  return {
    trigger: (pattern: HapticPattern, options?: HapticOptions) => {
      const configuredPattern = HAPTIC_VIBRATION_PATTERNS[pattern];
      const intensity = Math.min(Math.max(options?.intensity ?? 1, 0), 1);
      const scaledPattern =
        typeof configuredPattern === "number"
          ? Math.round(configuredPattern * intensity)
          : configuredPattern.map((duration) =>
              Math.round(duration * intensity),
            );

      navigator.vibrate(scaledPattern);
      return Promise.resolve();
    },
  };
};

const initSearch = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const haptics = prefersReducedMotion ? null : createHapticsController();
  const triggerHaptic = (pattern: HapticPattern, options?: HapticOptions) => {
    if (!haptics) return;
    haptics.trigger(pattern, options).catch((error) => {
      console.warn("Haptic feedback failed.", error);
    });
  };

  const dependencies = {
    pagefind: createPagefindAdapter(),
    urlState: createUrlStateSync(window),
    storage: createSearchStorage({
      localStorage: window.localStorage,
      sessionStorage: window.sessionStorage,
    }),
    triggerHaptic,
  };

  const searchContainers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-search-container]"),
  );
  const searchInstances: SearchInstance[] = [];
  const mediaQuery = window.matchMedia("(min-width: 992px)");
  const getActiveScope = () => (mediaQuery.matches ? "desktop" : "mobile");

  searchContainers.forEach((container) => {
    const trigger = container.querySelector<HTMLButtonElement>(
      "[data-search-trigger]",
    );
    const dialog = container.querySelector<HTMLDialogElement>(
      "[data-search-dialog]",
    );
    if (!trigger || !dialog) return;

    const scope = container.dataset.searchScope;
    const instance = bindSearchInstance(
      { container, trigger, dialog, scope },
      dependencies,
    );
    if (!instance) return;

    const scopedInstance: SearchInstance = {
      ...instance,
      isActive: () =>
        scope === undefined || scope === null || scope === getActiveScope(),
    };

    searchInstances.push(scopedInstance);
  });

  if (!searchInstances.length) return;

  const getActiveInstance = () =>
    searchInstances.find((instance) => instance.isActive()) ??
    searchInstances[0];

  bindGlobalSearchListeners({
    searchInstances,
    getActiveInstance,
    mediaQuery,
    triggerHaptic,
  });

  const initialInstance = getActiveInstance();
  if (
    initialInstance &&
    dependencies.urlState.getParam(searchStateParams.modal)
  ) {
    initialInstance.openDialog();
  }

  const storedQuery = dependencies.storage.getQuery();
  if (!storedQuery) return;

  searchInstances.forEach((instance) => {
    if (!instance.isDialogOpen()) return;

    const input = instance.dialog.querySelector<HTMLInputElement>(
      "[data-search-input]",
    );
    if (!input) return;

    input.value = storedQuery;
    input.dispatchEvent(new Event("input"));
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  initSearch();
}
