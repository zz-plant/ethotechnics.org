import { beforeEach, describe, expect, it } from "bun:test";
import { createUrlStateSync } from "./query-state";

describe("search query URL sync", () => {
  beforeEach(() => {
    history.replaceState({}, "", "/start");
  });

  it("updates query with replace and clears when empty", () => {
    const sync = createUrlStateSync(window);

    sync.setQuery("hello world");
    expect(window.location.search).toBe("?q=hello+world");

    sync.setQuery("   ");
    expect(window.location.search).toBe("");
  });

  it("pushes modal transitions and clears modal/query together", () => {
    const sync = createUrlStateSync(window);
    const initialLength = window.history.length;

    sync.setModalOpen(true, "push");
    expect(window.location.search).toBe("?modal=1");

    sync.setQuery("alpha", "push");
    expect(window.location.search).toBe("?modal=1&q=alpha");

    sync.clearModalAndQuery("push");
    expect(window.location.search).toBe("");
    expect(window.history.length).toBe(initialLength + 3);
  });
});
