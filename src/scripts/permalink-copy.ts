const copyButtons = Array.from(
  document.querySelectorAll("[data-permalink-copy]"),
);

copyButtons.forEach((button) => {
  const status = button
    .closest(".page-intro__permalink")
    ?.querySelector("[data-permalink-status]");
  const value = button.getAttribute("data-copy-value");

  if (!status || !value) {
    return;
  }

  let resetTimer: number | undefined;

  const onCopy = async () => {
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

  button.addEventListener("click", () => {
    void onCopy();
  });
});

export {};
