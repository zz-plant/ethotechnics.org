const detailBlocks = Array.from(
  document.querySelectorAll<HTMLDetailsElement>("details[data-implication]"),
);
const expandAllButton = document.querySelector("[data-expand-all]");
const collapseAllButton = document.querySelector("[data-collapse-all]");

const setAll = (open: boolean) => {
  detailBlocks.forEach((detail) => {
    detail.open = open;
  });
};

if (expandAllButton) {
  expandAllButton.addEventListener("click", () => setAll(true));
}

if (collapseAllButton) {
  collapseAllButton.addEventListener("click", () => setAll(false));
}

const openFromHash = (hash: string) => {
  if (!hash) {
    return;
  }

  const targetId = hash.replace("#", "");
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const parentDetails = target.closest("details");

  if (parentDetails && !parentDetails.open) {
    parentDetails.open = true;
  }
};

openFromHash(window.location.hash);
window.addEventListener("hashchange", () => openFromHash(window.location.hash));

const copyButtons = Array.from(document.querySelectorAll("[data-copy-link]"));

copyButtons.forEach((button) => {
  const status = button
    .closest(".implication__summary")
    ?.querySelector("[data-copy-status]");
  const value = button.getAttribute("data-copy-value");

  if (!status || !value) {
    return;
  }

  let resetTimer: number | undefined;

  const onCopy = async (event: Event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "Copied";
      status.classList.add("is-visible");
    } catch {
      status.textContent = "Copy failed";
      status.classList.add("is-visible");
    }

    clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      status.textContent = "";
      status.classList.remove("is-visible");
    }, 2000);
  };

  button.addEventListener("click", (event) => {
    void onCopy(event);
  });
});

const anchorLinks = Array.from(
  document.querySelectorAll("[data-implication-anchor]"),
);

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    history.pushState(null, "", href);
    openFromHash(href);
  });
});

export {};
