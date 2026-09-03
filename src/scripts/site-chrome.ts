(() => {
  /* theme toggle & dynamic meta theme-color */
  const syncThemeColor = (isDark: boolean) => {
    const themeMeta = document.querySelectorAll('meta[name="theme-color"]');
    themeMeta.forEach((meta) => {
      if (meta.getAttribute("media")?.includes("dark")) {
        meta.setAttribute("content", "#18181b");
      } else if (meta.getAttribute("media")?.includes("light")) {
        meta.setAttribute("content", "#faf8f5");
      } else {
        meta.setAttribute("content", isDark ? "#18181b" : "#faf8f5");
      }
    });
  };

  const toggles = document.querySelectorAll("[data-theme-toggle]");
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
    });
  });

  /* mobile nav focus trap + inert + body scroll lock */
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (mobileNav instanceof HTMLDetailsElement) {
    const pageRegions = () => {
      const main = document.getElementById("main-content");
      const footer = document.querySelector<HTMLElement>(".footer");
      return [main, footer].filter((el): el is HTMLElement => el !== null);
    };

    let releaseFocusTrap: (() => void) | null = null;

    const trapFocus = (container: HTMLElement) => {
      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      container.addEventListener("keydown", onKeyDown);
      return () => container.removeEventListener("keydown", onKeyDown);
    };

    mobileNav.addEventListener("toggle", () => {
      const isMobile = window.matchMedia("(max-width: 1099px)").matches;
      if (mobileNav.open && isMobile) {
        document.body.style.overflow = "hidden";
        pageRegions().forEach((el) => (el.inert = true));
        const firstLink = mobileNav.querySelector<HTMLElement>("a[href]");
        if (firstLink) firstLink.focus();
        if (releaseFocusTrap) releaseFocusTrap();
        releaseFocusTrap = trapFocus(mobileNav) ?? null;
      } else {
        document.body.style.overflow = "";
        pageRegions().forEach((el) => (el.inert = false));
        if (releaseFocusTrap) {
          releaseFocusTrap();
          releaseFocusTrap = null;
        }
      }
    });
  }

  /* progressive scroll progress fallback */
  if (!CSS.supports || !CSS.supports("animation-timeline", "scroll()")) {
    const progressBar = document.getElementById("reading-progress");
    if (progressBar) {
      window.addEventListener(
        "scroll",
        () => {
          const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;
          if (scrollable > 0) {
            const scrolled = window.scrollY;
            const progressPercentage = Math.min(
              1,
              Math.max(0, scrolled / scrollable),
            );
            progressBar.style.transform = `scaleX(${progressPercentage})`;
          }
        },
        { passive: true },
      );
    }
  }

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
            <span>Copied!</span>
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

    const nav = document.querySelector<HTMLElement>(".nav");
    const navHeight = nav?.offsetHeight || 0;
    const top =
      target.getBoundingClientRect().top + window.scrollY - navHeight - 24;

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
