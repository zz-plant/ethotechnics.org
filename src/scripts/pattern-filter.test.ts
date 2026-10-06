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
const BASE = "https://ethotechnics.org/mechanisms";
const origReplaceState = history.replaceState;

const fixture = () => `
  <div data-pattern-filter data-filters="all,privacy,accountability,bias" data-filter-labels='{"privacy":"Privacy","accountability":"Accountability","bias":"Bias"}'>
    <input data-search-input type="text" />
    <div class="pill-list">
      <span class="pill-list__item"><button data-filter="all" type="button">All</button></span>
      <span class="pill-list__item"><button data-filter="privacy" type="button">Privacy</button></span>
      <span class="pill-list__item"><button data-filter="accountability" type="button">Accountability</button></span>
      <span class="pill-list__item"><button data-filter="bias" type="button">Bias</button></span>
    </div>
    <div data-pattern-card id="privacy-by-design" data-filters="privacy,accountability" data-search="privacy by design framework"></div>
    <div data-pattern-card id="bias-audit" data-filters="bias,accountability" data-search="bias audit methodology"></div>
    <div data-pattern-card id="accountability-framework" data-filters="accountability" data-search="accountability framework"></div>
    <div data-empty></div>
    <span data-filter-status></span>
  </div>`;

async function init(url?: string) {
  history.replaceState = origReplaceState;
  window.location.href = url ?? BASE;
  const rs = mock(() => {});
  history.replaceState = rs;
  const io = (window as unknown as Record<string, unknown>)
    .IntersectionObserver;
  delete (window as unknown as Record<string, unknown>).IntersectionObserver;
  document.body.innerHTML = fixture();
  importId += 1;
  try {
    await import(`./pattern-filter.ts?v=${importId}`);
  } finally {
    if (io !== undefined)
      (window as unknown as Record<string, unknown>).IntersectionObserver = io;
  }
  return { rs };
}

function raf() {
  return new Promise<void>((r) => requestAnimationFrame(() => r()));
}

describe("pattern-filter", () => {
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
    it("reads filter param", async () => {
      await init(`${BASE}?filter=privacy`);
      await raf();
      expect(
        document
          .querySelector<HTMLButtonElement>('[data-filter="privacy"]')
          ?.getAttribute("aria-pressed"),
      ).toBe("true");
    });
    it("reads query param", async () => {
      await init(`${BASE}?q=privacy`);
      await raf();
      expect(
        document.querySelector<HTMLInputElement>("[data-search-input]")?.value,
      ).toBe("privacy");
    });
    it("syncs URL on click", async () => {
      const { rs } = await init();
      await raf();
      document
        .querySelector<HTMLButtonElement>('[data-filter="privacy"]')
        ?.click();
      await raf();
      const c = rs.mock.calls as unknown[][];
      expect(
        c.some(
          (x) =>
            typeof x[2] === "string" &&
            (x[2] as string).includes("filter=privacy"),
        ),
      ).toBe(true);
    });
    it("ignores unknown filter", async () => {
      await init(`${BASE}?filter=unknown_filter`);
      await raf();
      expect(
        document
          .querySelector<HTMLButtonElement>('[data-filter="all"]')
          ?.getAttribute("aria-pressed"),
      ).toBe("true");
    });
  });

  describe("filter matching", () => {
    it("shows all by default", async () => {
      await init();
      await raf();
      expect(
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
        ).filter((e) => e.hasAttribute("hidden")).length,
      ).toBe(0);
    });
    it("hides non-matching", async () => {
      await init();
      await raf();
      document
        .querySelector<HTMLButtonElement>('[data-filter="privacy"]')
        ?.click();
      await raf();
      expect(
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
        ).filter((e) => e.hasAttribute("hidden")).length,
      ).toBe(2);
    });
    it("text filter", async () => {
      await init();
      await raf();
      const inp = document.querySelector<HTMLInputElement>(
        "[data-search-input]",
      )!;
      inp.value = "bias audit";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
        ).filter((e) => !e.hasAttribute("hidden")).length,
      ).toBe(1);
    });
    it("combines filter and text", async () => {
      await init();
      await raf();
      document
        .querySelector<HTMLButtonElement>('[data-filter="accountability"]')
        ?.click();
      await raf();
      const inp = document.querySelector<HTMLInputElement>(
        "[data-search-input]",
      )!;
      inp.value = "privacy";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
        ).filter((e) => !e.hasAttribute("hidden")).length,
      ).toBe(1);
    });
    it("empty state", async () => {
      await init();
      await raf();
      const inp = document.querySelector<HTMLInputElement>(
        "[data-search-input]",
      )!;
      inp.value = "zzzzzznonexistent";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      expect(
        document
          .querySelector<HTMLElement>("[data-empty]")
          ?.hasAttribute("hidden"),
      ).toBe(false);
    });
  });

  describe("button state", () => {
    it('"all" active by default', async () => {
      await init();
      await raf();
      expect(
        document
          .querySelector<HTMLButtonElement>('[data-filter="all"]')
          ?.getAttribute("aria-pressed"),
      ).toBe("true");
    });
    it("toggles pill class", async () => {
      await init();
      await raf();
      const btn = document.querySelector<HTMLButtonElement>(
        '[data-filter="bias"]',
      )!;
      btn.click();
      await raf();
      expect(
        btn
          .closest(".pill-list__item")
          ?.classList.contains("pill-list__item--active"),
      ).toBe(true);
      btn.click();
      await raf();
      expect(
        btn
          .closest(".pill-list__item")
          ?.classList.contains("pill-list__item--active"),
      ).toBe(false);
    });
    it("deactivates on re-click", async () => {
      await init();
      await raf();
      const btn = document.querySelector<HTMLButtonElement>(
        '[data-filter="privacy"]',
      )!;
      btn.click();
      await raf();
      expect(btn.getAttribute("aria-pressed")).toBe("true");
      btn.click();
      await raf();
      expect(btn.getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("status messages", () => {
    it("default filter status", async () => {
      await init();
      await raf();
      expect(
        document.querySelector<HTMLElement>("[data-filter-status]")
          ?.textContent,
      ).toContain("All safeguards");
    });
    it("updates on filter", async () => {
      await init();
      await raf();
      document
        .querySelector<HTMLButtonElement>('[data-filter="privacy"]')
        ?.click();
      await raf();
      expect(
        document.querySelector<HTMLElement>("[data-filter-status]")
          ?.textContent,
      ).toContain("Privacy");
    });
  });

  describe("edge cases", () => {
    it("toggle on/off", async () => {
      await init();
      await raf();
      const btn = document.querySelector<HTMLButtonElement>(
        '[data-filter="bias"]',
      )!;
      btn.click();
      await raf();
      let vis = Array.from(
        document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
      ).filter((e) => !e.hasAttribute("hidden"));
      expect(vis.length).toBe(1);
      btn.click();
      await raf();
      vis = Array.from(
        document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
      ).filter((e) => !e.hasAttribute("hidden"));
      expect(vis.length).toBe(3);
    });
    it("switch filters", async () => {
      await init();
      await raf();
      const priv = document.querySelector<HTMLButtonElement>(
        '[data-filter="privacy"]',
      )!;
      const acct = document.querySelector<HTMLButtonElement>(
        '[data-filter="accountability"]',
      )!;
      priv.click();
      await raf();
      acct.click();
      await raf();
      expect(priv.getAttribute("aria-pressed")).toBe("false");
      expect(acct.getAttribute("aria-pressed")).toBe("true");
      expect(
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-pattern-card]"),
        ).filter((e) => !e.hasAttribute("hidden")).length,
      ).toBe(3);
    });
    it("syncs URL on search", async () => {
      const { rs } = await init();
      await raf();
      const inp = document.querySelector<HTMLInputElement>(
        "[data-search-input]",
      )!;
      inp.value = "framework";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      await raf();
      const c = rs.mock.calls as unknown[][];
      expect(
        c.some(
          (x) =>
            typeof x[2] === "string" &&
            (x[2] as string).includes("q=framework"),
        ),
      ).toBe(true);
    });
  });
});
