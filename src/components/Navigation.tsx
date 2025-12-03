import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/library', label: 'Library' },
  { href: '/research', label: 'Research' },
  { href: '/diagnostics', label: 'Diagnostics' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/institute', label: 'Institute' },
];

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 20 20"
      width="18"
      height="18"
      role="img"
    >
      <path
        fill="currentColor"
        d="M11.75 3.25a.75.75 0 0 1 .75-.75h4.25a.75.75 0 0 1 .75.75V7.5a.75.75 0 0 1-1.5 0V5.06l-6.72 6.72a.75.75 0 1 1-1.06-1.06l6.72-6.72H12.5a.75.75 0 0 1-.75-.75Zm-9 1.5A1.75 1.75 0 0 1 4.5 3h4.25a.75.75 0 0 1 0 1.5H4.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V11.25a.75.75 0 0 1 1.5 0V15.5A1.75 1.75 0 0 1 15 17.25H4.5A1.75 1.75 0 0 1 2.75 15.5Z"
      />
    </svg>
  );
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const utilityLinks = (
    <>
      <a className="button ghost button--compact" href="/donate" onClick={() => setIsOpen(false)}>
        Donate
      </a>
      <a
        className="nav__utility-link"
        href="https://studio.com"
        rel="noreferrer"
        target="_blank"
        onClick={() => setIsOpen(false)}
      >
        <span>Studio.com</span>
        <ExternalLinkIcon />
      </a>
    </>
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="nav" aria-label="Primary" data-astro-transition-persist>
      <div className="nav__inner container">
        <div className="nav__bar">
          <a href="#top" className="nav__brand" aria-label="Return to top">
            Ethotechnics
          </a>

          <div className="nav__utility nav__utility--desktop">{utilityLinks}</div>

          <button
            className="nav__toggle"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        <div className={`nav__content ${isOpen ? 'is-open' : ''}`}>
          <ul className="nav__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__utility nav__utility--menu">{utilityLinks}</div>
          <div className="nav__actions">
            <a className="button ghost" href="/field-notes" onClick={() => setIsOpen(false)}>
              Field notes
            </a>
            <a className="button primary" href="/institute" onClick={() => setIsOpen(false)}>
              Join the institute
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
