import { afterAll, afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

let importId = 0;
const BASE = "https://ethotechnics.org/research";
const origReplaceState = history.replaceState;

const fixture = () => `
  <div>
    <input id="research-filter" type="text" />
    <div class="research-filter__count" data-total="3">Showing 3 of 3 entries</div>
    <div class="research-filter__empty"></div>
    <button data-clear-research-filter type="button">Clear</button>
    <button data-research-expand type="button">Expand</button>
    <button data-research-collapse type="button">Collapse</button>
    <select data-research-filter="section"><option value="">All sections</option><option value="ethics">Ethics</option><option value="design">Design</option></select>
    <select data-research-filter="tag"><option value="">All tags</option><option value="accessibility">Accessibility</option><option value="bias">Bias</option></select>
    <select data-research-filter="type"><option value="">All types</option><option value="paper">Paper</option><option value="report">Report</option></select>
    <article data-research-item data-search="accessibility research findings" data-section="ethics" data-tags="accessibility" data-type="paper">Accessibility Research</article>
    <article data-research-item data-search="bias in machine learning" data-section="ethics" data-tags="bias ml" data-type="paper">Bias in ML</article>
    <article data-research-item data-search="design thinking methods" data-section="design" data-tags="methods" data-type="report">Design Methods</article>
    <details class="chunked-section" data-default-open="true"><summary>S1</summary></details>
    <details class="chunked-section"><summary>S2</summary></details>
  </div>`;

async function init(url?: string) {
  history.replaceState = origReplaceState;
  window.location.href = url ?? BASE;
  const rs = mock(() => {});
  history.replaceState = rs;
  document.body.innerHTML = fixture();
  importId += 1;
  await import(`./research-filter.ts?v=${importId}`);
  return { rs };
}

function raf() { return new Promise<void>((r) => requestAnimationFrame(() => r())); }

describe("research-filter", () => {
  afterAll(() => {
    history.replaceState = origReplaceState;
    window.location.href = "about:blank";
  });
  beforeEach(() => { document.body.innerHTML = ""; });
  afterEach(() => { document.body.innerHTML = ""; });

  describe("URL params", () => {
    it("reads query", async () => {
      await init(`${BASE}?query=machine+learning`);
      expect(document.querySelector<HTMLInputElement>("#research-filter")?.value).toBe("machine learning");
    });
    it("reads section", async () => {
      await init(`${BASE}?section=design`);
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')?.value).toBe("design");
    });
    it("reads tag", async () => {
      await init(`${BASE}?tag=accessibility`);
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="tag"]')?.value).toBe("accessibility");
    });
    it("reads type", async () => {
      await init(`${BASE}?type=report`);
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="type"]')?.value).toBe("report");
    });
    it("reads multiple", async () => {
      await init(`${BASE}?query=design&section=design&type=report`);
      expect(document.querySelector<HTMLInputElement>("#research-filter")?.value).toBe("design");
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')?.value).toBe("design");
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="type"]')?.value).toBe("report");
    });
    it("syncs URL on select", async () => {
      const { rs } = await init();
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')!;
      sel.value = "ethics";
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      await raf();
      const c = rs.mock.calls as unknown[][];
      expect(c.some((x) => typeof x[2] === "string" && (x[2] as string).includes("section=ethics"))).toBe(true);
    });
  });

  describe("filter matching", () => {
    it("text hides non-matching", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      inp.value = "machine learning"; inp.dispatchEvent(new Event("input", { bubbles: true })); await raf();
      const hidden = Array.from(document.querySelectorAll<HTMLElement>("[data-research-item]")).filter((e) => e.classList.contains("is-hidden"));
      expect(hidden.length).toBe(2);
    });
    it("by section", async () => {
      await init();
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')!;
      sel.value = "design"; sel.dispatchEvent(new Event("change", { bubbles: true })); await raf();
      const vis = Array.from(document.querySelectorAll<HTMLElement>("[data-research-item]")).filter((e) => !e.classList.contains("is-hidden"));
      expect(vis.length).toBe(1);
      expect(vis[0]?.textContent).toContain("Design Methods");
    });
    it("by tag", async () => {
      await init();
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="tag"]')!;
      sel.value = "accessibility"; sel.dispatchEvent(new Event("change", { bubbles: true })); await raf();
      expect(Array.from(document.querySelectorAll<HTMLElement>("[data-research-item]")).filter((e) => !e.classList.contains("is-hidden")).length).toBe(1);
    });
    it("by type", async () => {
      await init();
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="type"]')!;
      sel.value = "report"; sel.dispatchEvent(new Event("change", { bubbles: true })); await raf();
      expect(Array.from(document.querySelectorAll<HTMLElement>("[data-research-item]")).filter((e) => !e.classList.contains("is-hidden")).length).toBe(1);
    });
    it("combines text and facet", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')!;
      sel.value = "ethics"; sel.dispatchEvent(new Event("change", { bubbles: true })); await raf();
      let vis = Array.from(document.querySelectorAll<HTMLElement>("[data-research-item]")).filter((e) => !e.classList.contains("is-hidden"));
      expect(vis.length).toBe(2);
      inp.value = "research"; inp.dispatchEvent(new Event("input", { bubbles: true })); await raf();
      vis = Array.from(document.querySelectorAll<HTMLElement>("[data-research-item]")).filter((e) => !e.classList.contains("is-hidden"));
      expect(vis.length).toBe(1);
      expect(vis[0]?.textContent).toContain("Accessibility Research");
    });
    it("shows empty state", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      inp.value = "zzzznonexistent"; inp.dispatchEvent(new Event("input", { bubbles: true })); await raf();
      expect(document.querySelector<HTMLElement>(".research-filter__empty")?.hidden).toBe(false);
    });
    it("hides empty with matches", async () => {
      await init();
      expect(document.querySelector<HTMLElement>(".research-filter__empty")?.hidden).toBe(true);
    });
  });

  describe("count", () => {
    it("shows filtered", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      inp.value = "bias"; inp.dispatchEvent(new Event("input", { bubbles: true })); await raf();
      expect(document.querySelector<HTMLElement>(".research-filter__count")?.textContent).toContain("Showing 1 of 3 entries");
    });
    it("shows facet label", async () => {
      await init();
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')!;
      sel.value = "design"; sel.dispatchEvent(new Event("change", { bubbles: true })); await raf();
      expect(document.querySelector<HTMLElement>(".research-filter__count")?.textContent).toContain("Design");
    });
    it("respects data-total", async () => {
      history.replaceState = origReplaceState;
      window.location.href = BASE;
      document.body.innerHTML = fixture().replace('data-total="3"', 'data-total="42"');
      importId += 1;
      await import(`./research-filter.ts?v=dt-${importId}`);
      expect(document.querySelector<HTMLElement>(".research-filter__count")?.textContent).toContain("of 42");
    });
  });

  describe("clear", () => {
    it("clears input and selects", async () => {
      await init(`${BASE}?query=test&section=ethics&tag=bias`);
      expect(document.querySelector<HTMLInputElement>("#research-filter")?.value).toBe("test");
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')?.value).toBe("ethics");
      document.querySelector<HTMLButtonElement>("[data-clear-research-filter]")?.click(); await raf();
      expect(document.querySelector<HTMLInputElement>("#research-filter")?.value).toBe("");
      expect(document.querySelector<HTMLSelectElement>('[data-research-filter="section"]')?.value).toBe("");
    });
    it("disabled when idle", async () => {
      await init();
      expect(document.querySelector<HTMLButtonElement>("[data-clear-research-filter]")?.disabled).toBe(true);
    });
    it("enabled with value", async () => {
      await init();
      const sel = document.querySelector<HTMLSelectElement>('[data-research-filter="type"]')!;
      sel.value = "paper"; sel.dispatchEvent(new Event("change", { bubbles: true })); await raf();
      expect(document.querySelector<HTMLButtonElement>("[data-clear-research-filter]")?.disabled).toBe(false);
    });
  });

  describe("expand/collapse", () => {
    it("expands on filter", async () => {
      await init();
      document.querySelector<HTMLInputElement>("#research-filter")!.value = "test";
      document.querySelector<HTMLInputElement>("#research-filter")!.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      document.querySelectorAll<HTMLDetailsElement>(".chunked-section").forEach((s) => expect(s.open).toBe(true));
    });
    it("respects defaultOpen", async () => {
      await init();
      const s = document.querySelectorAll<HTMLDetailsElement>(".chunked-section");
      expect(s[0]?.open).toBe(true);
      expect(s[1]?.open).toBe(false);
    });
    it("expand all", async () => {
      await init();
      document.querySelector<HTMLButtonElement>("[data-research-expand]")?.click();
      document.querySelectorAll<HTMLDetailsElement>(".chunked-section").forEach((s) => expect(s.open).toBe(true));
    });
    it("collapse all", async () => {
      await init();
      document.querySelector<HTMLButtonElement>("[data-research-expand]")?.click();
      document.querySelector<HTMLButtonElement>("[data-research-collapse]")?.click();
      document.querySelectorAll<HTMLDetailsElement>(".chunked-section").forEach((s) => expect(s.open).toBe(false));
    });
  });

  describe("edge cases", () => {
    it("missing input", async () => {
      history.replaceState = origReplaceState;
      window.location.href = BASE;
      document.body.innerHTML = "<div></div>";
      importId += 1;
      await import(`./research-filter.ts?v=e1-${importId}`);
      expect(document.body.innerHTML).toBe("<div></div>");
    });
    it("empty items", async () => {
      history.replaceState = origReplaceState;
      window.location.href = BASE;
      document.body.innerHTML = `<div><input id="research-filter" type="text" /><div class="research-filter__empty"></div><div class="research-filter__count" data-total="0">0</div><button data-clear-research-filter type="button"></button></div>`;
      importId += 1;
      await import(`./research-filter.ts?v=e2-${importId}`);
      expect(document.body.innerHTML).toContain("research-filter");
    });
    it("esc clears", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      inp.value = "test"; inp.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await raf();
      expect(inp.value).toBe("");
    });
    it("esc ignored empty", async () => {
      await init();
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      inp.value = ""; inp.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      expect(inp.value).toBe("");
    });
    it("no data-search attr", async () => {
      history.replaceState = origReplaceState;
      const f = `<div><input id="research-filter" type="text" /><div class="research-filter__count" data-total="1">1</div><div class="research-filter__empty"></div><button data-clear-research-filter type="button">Clear</button><select data-research-filter="section"><option value="">All</option><option value="ethics">Ethics</option></select><select data-research-filter="tag"><option value="">All</option></select><select data-research-filter="type"><option value="">All</option></select><article data-research-item data-section="ethics" data-tags="" data-type="paper">No search</article></div>`;
      window.location.href = BASE;
      document.body.innerHTML = f;
      importId += 1;
      await import(`./research-filter.ts?v=e5-${importId}`);
      const inp = document.querySelector<HTMLInputElement>("#research-filter")!;
      inp.value = "zzz"; inp.dispatchEvent(new Event("input", { bubbles: true })); await raf();
      expect(document.querySelector<HTMLElement>("[data-research-item]")?.classList.contains("is-hidden")).toBe(true);
    });
  });
});
