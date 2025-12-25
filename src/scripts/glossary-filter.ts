const initGlossaryFilter = () => {
  const filterInput = document.querySelector<HTMLInputElement>('#glossary-filter');
  const items = Array.from(document.querySelectorAll<HTMLElement>('.glossary-index__item'));
  const emptyState = document.querySelector<HTMLElement>('.glossary-index__empty');
  const count = document.querySelector<HTMLElement>('.glossary-filter__count');
  const clearButton = document.querySelector<HTMLButtonElement>('[data-clear-filter]');

  if (
    !(filterInput instanceof HTMLInputElement) ||
    items.length === 0 ||
    !emptyState ||
    !count ||
    !(clearButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const total = items.length;

  const updateFilter = () => {
    const query = filterInput.value.trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const title = item.dataset.title ?? item.textContent ?? '';
      const category = item.dataset.category ?? '';
      const matches = `${title} ${category}`.toLowerCase().includes(query);
      item.classList.toggle('is-hidden', !matches);

      if (matches) {
        visible += 1;
      }
    });

    emptyState.hidden = visible > 0;
    count.textContent = `Showing ${visible} of ${total} terms`;
    clearButton.disabled = query.length === 0;
  };

  filterInput.addEventListener('input', updateFilter);
  filterInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && filterInput.value) {
      event.preventDefault();
      filterInput.value = '';
      updateFilter();
    }
  });
  clearButton.addEventListener('click', () => {
    filterInput.value = '';
    filterInput.focus();
    updateFilter();
  });
  updateFilter();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlossaryFilter);
} else {
  initGlossaryFilter();
}
