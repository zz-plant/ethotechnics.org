(() => {
  /* theme toggle & dynamic meta theme-color */
  const syncThemeColor = (isDark: boolean) => {
    const themeMeta = document.querySelectorAll('meta[name="theme-color"]');
    themeMeta.forEach((meta) => {
      if (meta.getAttribute("media")?.includes("dark")) {
        meta.setAttribute("content", "#171412");
      } else if (meta.getAttribute("media")?.includes("light")) {
        meta.setAttribute("content", "#f5f3ee");
      } else {
        meta.setAttribute("content", isDark ? "#171412" : "#f5f3ee");
      }
    });
  };

  const toggles = document.querySelectorAll("[data-theme-toggle]");

  // The label names what the button will do next, and the change is announced
  // once, politely: a toggle that only says "Toggle theme" gives a screen
  // reader user no way to know what happened.
  const announceTheme = (isDark: boolean) => {
    let status = document.querySelector<HTMLParagraphElement>("#theme-status");
    if (!status) {
      status = document.createElement("p");
      status.id = "theme-status";
      status.className = "sr-only";
      status.setAttribute("role", "status");
      document.body.appendChild(status);
    }
    status.textContent = isDark ? "Dark theme on." : "Light theme on.";
  };

  const syncToggleLabels = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
    toggles.forEach((btn) => {
      btn.setAttribute("aria-label", nextLabel);
      const labelEl = btn.querySelector<HTMLElement>(
        "[data-theme-toggle-text]",
      );
      if (labelEl) {
        labelEl.textContent = nextLabel;
      }
    });
    return isDark;
  };

  syncToggleLabels();

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
        syncThemeColor(false);
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        syncThemeColor(true);
      }
      const nowDark = syncToggleLabels();
      announceTheme(nowDark);
    });
  });

  /* back to top button */
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("back-to-top--visible");
      } else {
        backToTopBtn.classList.remove("back-to-top--visible");
      }
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener("click", () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    });
  }

  /* universal code block copy buttons */
  const attachCodeCopyButtons = () => {
    document
      .querySelectorAll<HTMLElement>("pre:not([data-copy-attached])")
      .forEach((pre) => {
        pre.setAttribute("data-copy-attached", "true");
        if (pre.querySelector(".code-copy-btn, .copy-button")) return;

        const codeEl = pre.querySelector<HTMLElement>("code") || pre;
        const btn = document.createElement("button");
        btn.className = "code-copy-btn";
        btn.type = "button";
        btn.setAttribute("aria-label", "Copy code snippet");
        btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy</span>
      `;

        const onCopy = async () => {
          try {
            const text = codeEl.innerText || codeEl.textContent || "";
            await navigator.clipboard.writeText(text.trim());
            btn.classList.add("code-copy-btn--copied");
            btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied</span>
          `;
            setTimeout(() => {
              btn.classList.remove("code-copy-btn--copied");
              btn.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            `;
            }, 2000);
          } catch (err) {
            console.error("Failed to copy code snippet", err);
          }
        };

        btn.addEventListener("click", () => {
          void onCopy();
        });

        pre.appendChild(btn);
      });
  };
  attachCodeCopyButtons();

  /* keyboard shortcut for site search: "/" and Cmd+K */
  document.addEventListener("keydown", (e) => {
    if (
      (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName || "",
      ) &&
      !(document.activeElement as HTMLElement | null)?.isContentEditable
    ) {
      e.preventDefault();
      const searchTrigger = document.querySelector("[data-search-trigger]");
      if (searchTrigger instanceof HTMLElement) {
        searchTrigger.click();
      }
    }
  });

  /* anchor scroll offset */
  document.addEventListener("click", (e) => {
    const link =
      e.target instanceof Element ? e.target.closest("a[href]") : null;
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || !href.includes("#") || href.startsWith("http") || href === "#")
      return;

    const parts = href.split("#");
    const hash = parts[1];
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    const linkPath = parts[0];
    const current = window.location.pathname.replace(/\/$/, "");
    if (linkPath && linkPath.replace(/\/$/, "") !== current) return;

    e.preventDefault();

    // The offset is the document's scroll-padding-top, so this handler and
    // native hash navigation land in the same place: below the sticky header
    // and, on pages that have one, below the section bar, which will be
    // showing by the time the scroll ends even if it is hidden now.
    const root = document.documentElement;
    const hasSectionNav = root.querySelector("[data-section-nav]") !== null;
    const hadClass = root.classList.contains("has-section-nav");
    if (hasSectionNav) root.classList.add("has-section-nav");
    const nav = document.querySelector<HTMLElement>(".nav");
    const fallback = (nav?.offsetHeight || 0) + 24;
    const offset =
      parseFloat(getComputedStyle(root).scrollPaddingTop) || fallback;
    if (hasSectionNav && !hadClass) root.classList.remove("has-section-nav");
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top,
      behavior: prefersReduced ? "auto" : "smooth",
    });
    if (history.replaceState) {
      history.replaceState(null, "", href);
    }
  });
})();

export {};
