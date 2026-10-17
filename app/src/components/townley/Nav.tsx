import { useEffect, useRef, useState } from "react";

import { NAV_LINKS, START_HREF } from "../../site";
import { StatusSign } from "./StatusSign";

/**
 * Fixed 72px nav: transparent over the hero, brushed metal after 100px of
 * scroll. Under 900px it collapses to the Tc mark, a Start button and a menu
 * that opens a full-screen panel with the anchors as tube words.
 */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setSolid(window.scrollY > 100);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const openMenu = () => {
    menuRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className="tc-nav" data-solid={solid ? "" : undefined}>
      <a className="tc-nav__mark" href="/" aria-label="Townley Creative, home">
        Tc
      </a>

      <nav className="tc-nav__links" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <a key={link.href} className="tc-nav__link" href={link.href}>
            {link.label}
          </a>
        ))}
        <a className="tc-nav__start" href={START_HREF}>
          Start a project
        </a>
      </nav>

      <div className="tc-nav__mobile">
        <a className="tc-nav__start" href={START_HREF}>
          Start
        </a>
        <button
          type="button"
          className="tc-icon-btn"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="tc-menu"
          onClick={openMenu}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <dialog
        id="tc-menu"
        ref={menuRef}
        className="tc-menu"
        aria-label="Menu"
        onClose={() => setMenuOpen(false)}
      >
        <div className="tc-menu__top">
          <span className="tc-nav__mark" aria-hidden="true">
            Tc
          </span>
          <button type="button" className="tc-icon-btn" aria-label="Close menu" onClick={closeMenu}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu">
          <ul className="tc-menu__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a className="tc-menu__link" href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a className="tc-menu__link" href={START_HREF} onClick={closeMenu}>
                Start a project
              </a>
            </li>
          </ul>
        </nav>
        <div className="tc-menu__foot">
          <StatusSign pulse={false} onClick={closeMenu} />
        </div>
      </dialog>
    </header>
  );
}
