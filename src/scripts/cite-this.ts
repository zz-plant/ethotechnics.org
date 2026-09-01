(() => {
  const status = document.getElementById("cite-copy-status");

  const handleCopy = async (targetId: string, typeName: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const text = el.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      if (status) {
        status.textContent = `${typeName} citation copied!`;
        status.style.display = "inline-block";
        setTimeout(() => {
          status.style.display = "none";
          status.textContent = "";
        }, 2500);
      }
    } catch {
      // clipboard write error fallback
    }
  };

  document
    .getElementById("cite-copy-apa-btn")
    ?.addEventListener("click", () => {
      void handleCopy("cite-apa", "APA");
    });

  document
    .getElementById("cite-copy-mla-btn")
    ?.addEventListener("click", () => {
      void handleCopy("cite-mla", "MLA");
    });
})();

export {};
