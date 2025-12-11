export const initNavigation = () => {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const toggle = nav?.querySelector<HTMLButtonElement>('.nav__toggle');
  const content = nav?.querySelector<HTMLElement>('.nav__content');
  const actionLinks = nav?.querySelectorAll<HTMLAnchorElement>(
    '.nav__links a, .nav__utility a, .nav__actions a, .nav__quick-links a',
  );

  if (!nav || !toggle || !content || !actionLinks || actionLinks.length === 0) {
    return;
  }

  if (nav.dataset.initialized === 'true') {
    return;
  }

  const breakpoint = 992; // Match the desktop media query in global.css
  let isOpen = false;

  const updateState = (open: boolean) => {
    isOpen = open;
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    const icon = toggle.querySelector('span');
    if (icon) {
      icon.textContent = isOpen ? '✕' : '☰';
    }
    content.classList.toggle('is-open', isOpen);
    const shouldHideContent = !isOpen && window.innerWidth < breakpoint;
    if (shouldHideContent) {
      content.setAttribute('hidden', '');
      content.setAttribute('aria-hidden', 'true');
      content.setAttribute('inert', '');
    } else {
      content.removeAttribute('hidden');
      content.setAttribute('aria-hidden', 'false');
      content.removeAttribute('inert');
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
    if (window.innerWidth >= breakpoint) {
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

  updateState(false);
};

if (typeof document !== 'undefined' && document.currentScript) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation, { once: true });
  } else {
    initNavigation();
  }
}
