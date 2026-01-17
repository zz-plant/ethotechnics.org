const initSiteSearch = () => {
  const root = document.querySelector<HTMLElement>("[data-site-search]");
  const input = root?.querySelector<HTMLInputElement>(
    "[data-site-search-input]",
  );
  const status = root?.querySelector<HTMLElement>("[data-site-search-status]");
  const emptyState = root?.querySelector<HTMLElement>(
    "[data-site-search-empty]",
  );
  const items = Array.from(
    root?.querySelectorAll<HTMLElement>("[data-site-search-item]") ?? [],
  );

  if (!root || !input || items.length === 0) {
    return;
  }

  const indexedItems = items.map((item) => ({
    element: item,
    searchText:
      item.dataset.search?.toLowerCase() ??
      item.textContent?.toLowerCase() ??
      "",
  }));

  let frame = 0;

  const getQueryFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") ?? "";
  };

  const updateUrl = (value: string) => {
    const url = new URL(window.location.href);
    if (value.trim()) {
      url.searchParams.set("q", value.trim());
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", url.toString());
  };

  const applyFilter = () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    indexedItems.forEach((item) => {
      const matches = !query || item.searchText.includes(query);
      item.element.toggleAttribute("hidden", !matches);
      if (matches) {
        visibleCount += 1;
      }
    });

    if (status) {
      const plural = visibleCount === 1 ? "result" : "results";
      status.textContent = `Showing ${visibleCount} ${plural}.`;
    }

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount !== 0);
    }

    updateUrl(query);
  };

  const scheduleFilter = () => {
    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      frame = 0;
      applyFilter();
    });
  };

  const syncFromUrl = () => {
    const query = getQueryFromUrl();
    input.value = query;
    applyFilter();
  };

  input.addEventListener("input", scheduleFilter);
  window.addEventListener("popstate", syncFromUrl);

  syncFromUrl();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSiteSearch);
} else {
  initSiteSearch();
}
