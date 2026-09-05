'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const aboutLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/our-beliefs', label: 'Our Beliefs' },
  { href: '/vision-and-values', label: 'Vision & Values' },
  { href: '/pastor-bio', label: 'Pastor Bio' },
];

const GIVE_URL =
  'https://give.tithe.ly/?formId=7960d13b-6864-11ee-90fc-1260ab546d11';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-serif text-lg tracking-[0.15em] text-ink"
          >
            CROSSLIFE
          </Link>

          <nav className="hidden items-center gap-9 text-[13px] font-medium tracking-[0.08em] text-ink md:flex">
            <Link href="/" className="transition-colors hover:text-accent">
              HOME
            </Link>

            <div className="group relative">
              <button className="flex items-center gap-1 transition-colors hover:text-accent">
                ABOUT
              </button>
              <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="flex flex-col overflow-hidden rounded-md border border-line bg-cream shadow-lg shadow-ink/5">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-5 py-3 text-left text-ink transition-colors hover:bg-cream-dim hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/sermons"
              className="transition-colors hover:text-accent"
            >
              SERMONS
            </Link>
            <Link
              href="/#newcomers"
              className="transition-colors hover:text-accent"
            >
              CONTACT
            </Link>
            <a
              href={GIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink px-5 py-2 text-ink transition-colors hover:border-accent hover:text-accent"
            >
              GIVE
            </a>
          </nav>

          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 md:hidden"
          >
            <span className="relative block h-5 w-7">
              <span
                className={`absolute left-0 top-0 h-[2px] w-7 rounded-full bg-ink transition-all duration-200 ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[2px] w-7 -translate-y-1/2 rounded-full bg-ink transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-[2px] w-7 rounded-full bg-ink transition-all duration-200 ${
                  menuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Rendered as a sibling of <header>, not a child — the header's
          backdrop-blur creates a containing block for fixed descendants,
          which would otherwise trap this overlay inside the header's own
          80px-tall box instead of covering the viewport. */}
      <div
        className={`fixed inset-0 top-20 z-40 flex flex-col items-center justify-center gap-7 bg-cream text-lg font-medium tracking-wide text-ink shadow-xl transition-all duration-200 md:hidden ${
          menuOpen
            ? 'visible opacity-100'
            : 'invisible pointer-events-none opacity-0'
        }`}
      >
        <Link href="/" className="hover:text-accent" onClick={closeMenu}>
          Home
        </Link>
        {aboutLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-accent"
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/sermons"
          className="hover:text-accent"
          onClick={closeMenu}
        >
          Sermons
        </Link>
        <Link
          href="/#newcomers"
          className="hover:text-accent"
          onClick={closeMenu}
        >
          Contact
        </Link>
        <a
          href={GIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink px-6 py-2.5 hover:border-accent hover:text-accent"
          onClick={closeMenu}
        >
          Give
        </a>
      </div>
    </>
  );
}
