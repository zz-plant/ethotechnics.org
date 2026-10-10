import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
} from "bun:test";

let importId = 0;
const BASE = "https://ethotechnics.org/glossary";
const origReplaceState = history.replaceState;

const fixture = () => `
  <div>
    <input id="glossary-filter" type="text" />
    <div data-glossary-active hidden><div class="glossary-filter__active-chips"></div></div>
    <div class="glossary-filter__count" data-total="3">Showing 3 of 3 terms</div>
    <button data-clear-filter type="button">Clear</button>
    <button data-glossary-expand type="button">Expand</button>
    <button data-glossary-collapse type="button">Collapse</button>
    <button data-glossary-letter="all" type="button">All</button>
    <button data-glossary-letter="A" type="button">A</button>
    <button data-glossary-letter="B" type="button">B</button>
    <button data-glossary-tab="all" type="button" data-glossary-tab="all">All</button>
    <button data-glossary-tab="domains" type="button" data-glossary-tab="domains">Domains</button>
    <div data-glossary-panel="all"></div>
    <div data-glossary-panel="domains" hidden></div>
    <div class="glossary-index__item" data-search="accessibility heuristic" data-letter="A" data-domains="" data-phases="" data-measurability="" data-status=""><a href="/glossary/accessibility" data-glossary-entry-link>Accessibility</a></div>
    <div class="glossary-index__item" data-search="bias audit" data-letter="B" data-domains="" data-phases="" data-measurability="" data-status=""><a href="/glossary/bias" data-glossary-entry-link>Bias Audit</a></div>
    <div class="glossary-index__item" data-search="ethical framework" data-letter="A" data-domains="" data-phases="" data-measurability="" data-status=""><a href="/glossary/ethics" data-glossary-entry-link>Ethical Framework</a></div>
    <div class="glossary-index__empty"></div>
    <label class="glossary-filter__chip"><input type="checkbox" data-glossary-filter="domains" value="design" data-glossary-label="Design" /><span data-glossary-count></span></label>
    <label class="glossary-filter__chip"><input type="checkbox" data-glossary-filter="domains" value="engineering" data-glossary-label="Engineering" /><span data-glossary-count></span></label>
    <label class="glossary-filter__chip"><input type="checkbox" data-glossary-filter="phases" value="research" data-glossary-label="Research" /><span data-glossary-count></span></label>
  </div>`;

async function init(url?: string) {
  history.replaceState = origReplaceState;
  window.location.href = url ?? BASE;
  const rs = mock(() => {});
  history.replaceState = rs;
  document.body.innerHTML = fixture();
  importId += 1;
  await import(`./glossary-filter.ts?v=${importId}`);
  return { rs };
}

function raf() {
  return new Promise<void>((r) => requestAnimationFrame(() => r()));
}

describe("glossary-filter", () => {
  afterAll(() => {
    history.replaceState = origReplaceState;
    window.location.href = "about:blank";
  });
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("URL params", () => {
    it("reads query param", async () => {
      await init(`${BASE}?query=ethics`);
      expect(
        document.querySelector<HTMLInputElement>("#glossary-filter")?.value,
      ).toBe("ethics");
    });
    it("reads facet selections", async () => {
      await init(`${BASE}?domains=design`);
      expect(
        document.querySelector<HTMLInputElement>(
          '[data-glossary-filter="domains"][value="design"]',
        )?.checked,
      ).toBe(true);
    });
    it("reads comma-separated values", async () => {
      await init(`${BASE}?domains=design,engineering`);
      expect(
        document.querySelector<HTMLInputElement>(
          '[data-glossary-filter="domains"][value="design"]',
        )?.checked,
      ).toBe(true);
      expect(
        document.querySelector<HTMLInputElement>(
          '[data-glossary-filter="domains"][value="engineering"]',
        )?.checked,
      ).toBe(true);
    });
    it("calls replaceState with query on input", async () => {
      const { rs } = await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "test query";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      const c = rs.mock.calls as unknown[][];
      expect(
        c.some(
          (x) =>
            typeof x[2] === "string" &&
            (x[2] as string).includes("query=test+query"),
        ),
      ).toBe(true);
    });
    it("removes param when cleared", async () => {
      const { rs } = await init(`${BASE}?query=old`);
      document.querySelector<HTMLButtonElement>("[data-clear-filter]")?.click();
      await raf();
      const c = rs.mock.calls as unknown[][];
      expect(
        c.some(
          (x) =>
            typeof x[2] === "string" && !(x[2] as string).includes("query=old"),
        ),
      ).toBe(true);
    });
  });

  describe("filter matching", () => {
    it("hides non-matching items", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "bias";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      const hidden = Array.from(
        document.querySelectorAll<HTMLElement>(".glossary-index__item"),
      ).filter((e) => e.classList.contains("is-hidden"));
      expect(hidden.length).toBe(2);
    });
    it("shows empty state when nothing matches", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "zzzznonexistent";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        document.querySelector<HTMLElement>(".glossary-index__empty")?.hidden,
      ).toBe(false);
    });
    it("hides empty state with matches", async () => {
      await init();
      expect(
        document.querySelector<HTMLElement>(".glossary-index__empty")?.hidden,
      ).toBe(true);
    });
    it("filters by letter", async () => {
      await init();
      document
        .querySelector<HTMLButtonElement>('[data-glossary-letter="B"]')
        ?.click();
      await raf();
      const vis = Array.from(
        document.querySelectorAll<HTMLElement>(".glossary-index__item"),
      ).filter((e) => !e.classList.contains("is-hidden"));
      expect(vis.length).toBe(1);
      expect(vis[0]?.textContent).toContain("Bias Audit");
    });
  });

  describe("count", () => {
    it("shows filtered count", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "ethical";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        document.querySelector<HTMLElement>(".glossary-filter__count")
          ?.textContent,
      ).toContain("Showing 1 of 3 terms");
    });
    it("shows total by default", async () => {
      await init();
      expect(
        document.querySelector<HTMLElement>(".glossary-filter__count")
          ?.textContent,
      ).toContain("Showing 3 of 3 terms");
    });
    it("includes query suffix", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "bias";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        document.querySelector<HTMLElement>(".glossary-filter__count")
          ?.textContent,
      ).toContain("bias");
    });
    it("updates per-chip counts", async () => {
      await init();
      const chip = document.querySelector<HTMLInputElement>(
        '[data-glossary-filter="domains"][value="design"]',
      )!;
      chip.checked = true;
      chip.dispatchEvent(new Event("change", { bubbles: true }));
      await raf();
      expect(
        chip
          .closest(".glossary-filter__chip")
          ?.querySelector<HTMLElement>("[data-glossary-count]")?.textContent,
      ).toBeDefined();
    });
  });

  describe("active chips", () => {
    it("renders chip for checked facet", async () => {
      await init();
      const chip = document.querySelector<HTMLInputElement>(
        '[data-glossary-filter="domains"][value="design"]',
      )!;
      chip.checked = true;
      chip.dispatchEvent(new Event("change", { bubbles: true }));
      await raf();
      const ac = document.querySelector<HTMLElement>("[data-glossary-active]");
      expect(ac?.hidden).toBe(false);
      expect(
        ac?.querySelectorAll(".glossary-filter__active-chip")?.length ?? 0,
      ).toBeGreaterThanOrEqual(1);
    });
    it("hides when no facets", async () => {
      await init();
      expect(
        document.querySelector<HTMLElement>("[data-glossary-active]")?.hidden,
      ).toBe(true);
    });
    it("renders letter chip", async () => {
      await init();
      document
        .querySelector<HTMLButtonElement>('[data-glossary-letter="B"]')
        ?.click();
      await raf();
      expect(
        document
          .querySelector<HTMLElement>("[data-glossary-active]")
          ?.querySelector<HTMLButtonElement>("[data-glossary-letter-clear]"),
      ).toBeTruthy();
    });
  });

  describe("clear", () => {
    it("clears input and facets", async () => {
      await init(`${BASE}?query=test&domains=design`);
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      const chip = document.querySelector<HTMLInputElement>(
        '[data-glossary-filter="domains"][value="design"]',
      )!;
      expect(inp.value).toBe("test");
      expect(chip.checked).toBe(true);
      document.querySelector<HTMLButtonElement>("[data-clear-filter]")?.click();
      await raf();
      expect(inp.value).toBe("");
      expect(chip.checked).toBe(false);
    });
    it("resets letter to all", async () => {
      await init();
      document
        .querySelector<HTMLButtonElement>('[data-glossary-letter="B"]')
        ?.click();
      await raf();
      document.querySelector<HTMLButtonElement>("[data-clear-filter]")?.click();
      await raf();
      expect(
        document
          .querySelector<HTMLButtonElement>('[data-glossary-letter="all"]')
          ?.classList.contains("is-active"),
      ).toBe(true);
    });
    it("disabled when idle", async () => {
      await init();
      expect(
        document.querySelector<HTMLButtonElement>("[data-clear-filter]")
          ?.disabled,
      ).toBe(true);
    });
    it("enabled when filtering", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "test";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        document.querySelector<HTMLButtonElement>("[data-clear-filter]")
          ?.disabled,
      ).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("empty items list", async () => {
      history.replaceState = origReplaceState;
      window.location.href = BASE;
      document.body.innerHTML = `<div><input id="glossary-filter" type="text" /><div class="glossary-index__empty"></div><div class="glossary-filter__count" data-total="0">0</div><button data-clear-filter type="button"></button></div>`;
      importId += 1;
      await import(`./glossary-filter.ts?v=e-${importId}`);
      expect(document.body.innerHTML).toContain("glossary-filter");
    });
    it("Escape clears input", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#glossary-filter")!;
      inp.value = "test";
      inp.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      await raf();
      expect(inp.value).toBe("");
    });
    it("toggles letters", async () => {
      await init();
      const a = document.querySelector<HTMLButtonElement>(
        '[data-glossary-letter="A"]',
      )!;
      const b = document.querySelector<HTMLButtonElement>(
        '[data-glossary-letter="B"]',
      )!;
      a.click();
      await raf();
      expect(a.classList.contains("is-active")).toBe(true);
      b.click();
      await raf();
      expect(a.classList.contains("is-active")).toBe(false);
      expect(b.classList.contains("is-active")).toBe(true);
    });
    it("aria-pressed on letters", async () => {
      await init();
      const a = document.querySelector<HTMLButtonElement>(
        '[data-glossary-letter="A"]',
      )!;
      a.click();
      await raf();
      expect(a.getAttribute("aria-pressed")).toBe("true");
    });
    it("base href on links", async () => {
      await init();
      expect(
        document.querySelector<HTMLAnchorElement>("[data-glossary-entry-link]")
          ?.dataset.baseHref,
      ).toBeTruthy();
    });
    it("data-total respected", async () => {
      await init();
      expect(
        document.querySelector<HTMLElement>(".glossary-filter__count")
          ?.textContent,
      ).toContain("3");
    });
  });
});
