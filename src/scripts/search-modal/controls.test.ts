import { beforeEach, describe, expect, it, mock } from "bun:test";
import { bindSearchInstance, type SearchDependencies } from "./controls";

const setupMarkup = () => {
  document.body.innerHTML = `
    <div data-search-container>
      <button data-search-trigger type="button">Search</button>
      <dialog data-search-dialog>
        <button data-search-close type="button">Close</button>
        <input data-search-input />
        <div data-search-recent hidden>
          <div data-search-recent-list></div>
        </div>
        <div data-search-results></div>
      </dialog>
    </div>
  `;

  const dialog = document.querySelector("[data-search-dialog]") as HTMLDialogElement;
  dialog.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  dialog.close = function close() {
    this.removeAttribute("open");
  };

  const trigger = document.querySelector("[data-search-trigger]") as HTMLButtonElement;
  const container = document.querySelector("[data-search-container]") as HTMLElement;
  const input = document.querySelector("[data-search-input]") as HTMLInputElement;
  const results = document.querySelector("[data-search-results]") as HTMLElement;

  return { container, dialog, trigger, input, results };
};

const createDependencies = (): SearchDependencies => ({
  pagefind: {
    init: () =>
      Promise.resolve({
        options: () => Promise.resolve(),
        search: () => Promise.resolve({ results: [] }),
      }),
  },
  urlState: {
    getParam: () => null,
    setModalOpen: mock(() => undefined),
    setQuery: mock(() => undefined),
    clearModalAndQuery: mock(() => undefined),
  },
  storage: {
    setQuery: mock(() => undefined),
    getQuery: () => "",
    setRecentSearch: mock(() => undefined),
    getRecentSearches: () => [],
  },
  triggerHaptic: mock(() => undefined),
});

describe("search modal controls", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("opens and closes while preserving state reset behavior", () => {
    const { container, dialog, trigger, results, input } = setupMarkup();
    const dependencies = createDependencies();

    const instance = bindSearchInstance({ container, dialog, trigger }, dependencies);
    expect(instance).not.toBeNull();

    trigger.click();
    expect(dialog.open).toBe(true);
    expect(dependencies.urlState.setModalOpen).toHaveBeenCalled();

    input.value = "hello";
    results.textContent = "filled";
    instance?.closeDialog();

    expect(dialog.open).toBe(false);
    expect(input.value).toBe("");
    expect(results.textContent).toContain("Start typing to search");
    expect(dependencies.urlState.clearModalAndQuery).toHaveBeenCalled();
  });

  it("handles keyboard navigation wrapping from first to last result", () => {
    const { container, dialog, trigger, input, results } = setupMarkup();
    const dependencies = createDependencies();
    const instance = bindSearchInstance({ container, dialog, trigger }, dependencies);
    instance?.openDialog();

    results.innerHTML = `
      <article class="search-result"><a href="/one">One</a></article>
      <article class="search-result"><a href="/two">Two</a></article>
    `;

    const links = Array.from(results.querySelectorAll<HTMLAnchorElement>("a"));

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(document.activeElement).toBe(links[0]);

    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(document.activeElement).toBe(links[1]);

    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(document.activeElement).toBe(links[0]);
  });
});
