export const initNavigation = () => {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const toggle = nav?.querySelector<HTMLButtonElement>('.nav__toggle');
  const content = nav?.querySelector<HTMLElement>('.nav__content');
  const scrim = nav?.querySelector<HTMLElement>('.nav__scrim');
  const actionLinks = nav?.querySelectorAll<HTMLAnchorElement>(
    '.nav__content a, .nav__content button',
  );

  if (!nav || !toggle || !content || !actionLinks || actionLinks.length === 0) {
    return;
  }

  if (nav.dataset.initialized === 'true') {
    return;
  }

  const desktopQuery = window.matchMedia?.('(min-width: 992px)') ?? {
    get matches() {
      return window.innerWidth >= 992;
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  let isOpen = false;

  const updateState = (open: boolean) => {
    isOpen = open;
    const isDesktop = desktopQuery.matches;

    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');

    nav.classList.toggle('nav--open', isOpen && !isDesktop);
    content.classList.toggle('is-open', isOpen || isDesktop);

    const shouldHideContent = !isDesktop && !isOpen;

    if (shouldHideContent) {
      content.setAttribute('hidden', '');
      content.setAttribute('aria-hidden', 'true');
      content.setAttribute('inert', '');
    } else {
      content.removeAttribute('hidden');
      content.setAttribute('aria-hidden', 'false');
      content.removeAttribute('inert');
    }

    if (scrim) {
      if (isDesktop || !isOpen) {
        scrim.setAttribute('hidden', '');
      } else {
        scrim.removeAttribute('hidden');
      }
    }

    actionLinks.forEach((link) => {
      if (shouldHideContent) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  };

  const handleToggle = () => updateState(!isOpen);
  const handleLinkClick = () => updateState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      updateState(false);
      toggle.focus();
    }
  };

  const handleResize = () => {
    if (desktopQuery.matches) {
      updateState(false);
      return;
    }

    updateState(isOpen);
  };

  nav.dataset.initialized = 'true';

  toggle.addEventListener('click', handleToggle);
  nav.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', handleResize);
  actionLinks.forEach((link) => link.addEventListener('click', handleLinkClick));
  scrim?.addEventListener('click', () => updateState(false));

  updateState(false);
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation, { once: true });
  } else {
    initNavigation();
  }
}
