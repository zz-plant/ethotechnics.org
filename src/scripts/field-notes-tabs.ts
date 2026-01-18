const escapeHash = (value: string) => {
  if (typeof CSS === "undefined" || !CSS.escape) {
    return value;
  }

  return CSS.escape(value);
};

const TAB_PARAM = "tab";

const initializeFieldNotes = (container: HTMLElement) => {
  const tabs = Array.from(
    container.querySelectorAll<HTMLButtonElement>("[data-field-notes-tab]"),
  );
  const panels = Array.from(
    container.querySelectorAll<HTMLElement>("[data-field-notes-panel]"),
  );
  const entries = Array.from(
    container.querySelectorAll<HTMLElement>("[data-field-notes-entry]"),
  );
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>("[data-field-notes-heading]"),
  );
  const defaultFormat =
    container.dataset.defaultFormat ?? tabs[0]?.dataset.format ?? "";

  if (tabs.length === 0) {
    return;
  }

  const cleanupCallbacks: Array<() => void> = [];

  const scrollToHash = (hash: string) => {
    if (!hash) {
      return;
    }

    const target = container.querySelector("#" + escapeHash(hash));

    if (target) {
      const rect = target.getBoundingClientRect();
      const topVisible = rect.top >= 0 && rect.top <= 4;

      if (topVisible) {
        return;
      }

      const prefersReducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const setActiveFormat = (format: string) => {
    const resolvedFormat = tabs.some((tab) => tab.dataset.format === format)
      ? format
      : defaultFormat;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.format === resolvedFormat;

      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      tab.parentElement?.classList.toggle("pill-list__item--active", isActive);
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.format === resolvedFormat;

      panel.hidden = !isActive;
    });

    headings.forEach((heading) => {
      const isActive = heading.dataset.format === resolvedFormat;

      heading.hidden = !isActive;
    });
  };

  const getHash = () => window.location.hash.replace("#", "");

  const getTabParam = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get(TAB_PARAM) ?? "";

    return tabs.some((tabItem) => tabItem.dataset.format === tab) ? tab : "";
  };

  const syncFromUrl = () => {
    const hash = getHash();
    const tabParam = getTabParam();
    let resolvedFormat = tabParam;

    if (!resolvedFormat && hash) {
      const matchingTab = tabs.find((tab) => tab.dataset.format === hash);

      if (matchingTab) {
        resolvedFormat = hash;
      } else {
        const matchingEntry = entries.find((entry) => entry.id === hash);

        if (matchingEntry) {
          resolvedFormat = matchingEntry.dataset.format ?? defaultFormat;
        }
      }
    }

    if (!resolvedFormat) {
      resolvedFormat = defaultFormat;
    }

    setActiveFormat(resolvedFormat);

    if (hash) {
      scrollToHash(hash);
    }
  };

  let observer: IntersectionObserver | null = null;

  const maybeSyncFromUrl = () => {
    if (!("IntersectionObserver" in window)) {
      syncFromUrl();
      return;
    }

    observer = new IntersectionObserver((entriesList) => {
      entriesList.forEach((entry) => {
        if (entry.isIntersecting) {
          syncFromUrl();
          observer?.disconnect();
        }
      });
    });

    observer.observe(container);
  };

  const activateTab = (tab: HTMLButtonElement) => {
    const format = tab.dataset.format ?? defaultFormat;

    setActiveFormat(format);
    tab.focus();

    if (format) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set(TAB_PARAM, format);
      history.pushState(null, "", nextUrl);
    }
  };

  tabs.forEach((tab) => {
    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      activateTab(tab);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(event.key)
      ) {
        return;
      }

      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
      }

      const currentIndex = tabs.indexOf(
        event.currentTarget as HTMLButtonElement,
      );

      if (currentIndex === -1) {
        return;
      }

      let targetIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        targetIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        targetIndex = 0;
      } else if (event.key === "End") {
        targetIndex = tabs.length - 1;
      }

      const targetTab = tabs[targetIndex];

      if (targetTab) {
        activateTab(targetTab);
      }
    };

    tab.addEventListener("click", handleClick);
    tab.addEventListener("keydown", handleKeydown);

    cleanupCallbacks.push(() => {
      tab.removeEventListener("click", handleClick);
      tab.removeEventListener("keydown", handleKeydown);
    });
  });

  const handleUrlChange = () => syncFromUrl();

  window.addEventListener("hashchange", handleUrlChange);
  window.addEventListener("popstate", handleUrlChange);
  cleanupCallbacks.push(() => {
    window.removeEventListener("hashchange", handleUrlChange);
    window.removeEventListener("popstate", handleUrlChange);
  });

  setActiveFormat(defaultFormat);
  maybeSyncFromUrl();

  return () => {
    if (observer) {
      observer.disconnect();
    }

    panels.forEach((panel) => {
      panel.hidden = false;
    });

    headings.forEach((heading) => {
      heading.hidden = false;
    });

    cleanupCallbacks.forEach((cleanup) => cleanup());
  };
};

const initFieldNotesTabs = () => {
  const containers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-field-notes]"),
  );
  const cleanups = containers
    .map((container) => initializeFieldNotes(container))
    .filter((cleanup): cleanup is () => void => typeof cleanup === "function");

  if (cleanups.length === 0) {
    return;
  }

  const runCleanup = () => {
    cleanups.forEach((cleanup) => cleanup());
    window.removeEventListener("astro:before-swap", runCleanup);
    window.removeEventListener("pagehide", runCleanup);
  };

  window.addEventListener("astro:before-swap", runCleanup);
  window.addEventListener("pagehide", runCleanup);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFieldNotesTabs);
} else {
  initFieldNotesTabs();
}
