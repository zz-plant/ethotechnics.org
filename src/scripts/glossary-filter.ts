const initGlossaryFilter = () => {
  const filterInput =
    document.querySelector<HTMLInputElement>("#glossary-filter");
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(".glossary-index__item"),
  );
  const emptyState = document.querySelector<HTMLElement>(
    ".glossary-index__empty",
  );
  const count = document.querySelector<HTMLElement>(".glossary-filter__count");
  const clearButton = document.querySelector<HTMLButtonElement>(
    "[data-clear-filter]",
  );

  if (
    !(filterInput instanceof HTMLInputElement) ||
    items.length === 0 ||
    !emptyState ||
    !count ||
    !(clearButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const total = Number(count.dataset.total) || items.length;

  const syncQueryParam = (value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    const search = params.toString();
    const nextUrl = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;

    window.history.replaceState({}, "", nextUrl);
  };

  const updateFilter = () => {
    const rawQuery = filterInput.value.trim();
    const query = rawQuery.toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const searchText = item.dataset.search ?? item.textContent ?? "";
      const matches = searchText.toLowerCase().includes(query);
      item.classList.toggle("is-hidden", !matches);

      if (matches) {
        visible += 1;
      }
    });

    emptyState.hidden = visible > 0;
    const querySuffix = rawQuery ? ` for “${rawQuery}”` : "";
    count.textContent = `Showing ${visible} of ${total} terms${querySuffix}`;
    clearButton.disabled = rawQuery.length === 0;
    syncQueryParam(rawQuery);
  };

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("query")?.trim();

  if (initialQuery) {
    filterInput.value = initialQuery;
  }

  filterInput.addEventListener("input", updateFilter);
  filterInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && filterInput.value) {
      event.preventDefault();
      filterInput.value = "";
      updateFilter();
    }
  });
  clearButton.addEventListener("click", () => {
    filterInput.value = "";
    filterInput.focus();
    updateFilter();
  });
  updateFilter();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlossaryFilter);
} else {
  initGlossaryFilter();
}
