'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export type NewsletterNavItem = {
  slug: string;
  year: string;
  title: string;
  /** Omitted when the title already shows the date. */
  dateLabel?: string;
};

export default function NewsletterNav({ items }: { items: NewsletterNavItem[] }) {
  const { slug: activeSlug } = useParams<{ slug?: string }>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const listRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const pickerActiveRef = useRef<HTMLAnchorElement>(null);

  const years = [...new Set(items.map((item) => item.year))];
  const activeItem = items.find((item) => item.slug === activeSlug);

  // Keep the selected issue visible in the (scrollable) sidebar without moving
  // the rest of the page.
  useEffect(() => {
    const list = listRef.current;
    const active = activeRef.current;
    if (!list || !active) return;
    const top = active.offsetTop;
    const bottom = top + active.offsetHeight;
    if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = top - list.clientHeight / 2;
    }
  }, [activeSlug]);

  // While the full-screen picker is open: lock page scroll, close on Escape or
  // if the screen grows to a size that shows the sidebar instead, and start
  // with the current issue in view.
  useEffect(() => {
    if (!pickerOpen) return;

    document.body.style.overflow = 'hidden';
    pickerActiveRef.current?.scrollIntoView({ block: 'center' });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPickerOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => desktop.matches && setPickerOpen(false);
    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onResize);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [pickerOpen]);

  return (
    <>
      {/* Small screens: a big button that opens a full-screen list, like the site menu. */}
      <div className="mb-2 lg:hidden">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          className="flex h-14 w-full items-center justify-between gap-3 rounded-md border border-ink/30 bg-cream px-4 text-left text-ink"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
              Choose an issue
            </span>
            <span className="block truncate text-base">
              {activeItem?.title ?? 'Newsletters'}
            </span>
          </span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {pickerOpen && (
        // Starts below the site header (like the site menu) and sits under
        // the site menu if that gets opened too.
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose an issue"
          className="fixed inset-x-0 bottom-0 top-20 z-30 overflow-y-auto bg-cream lg:hidden"
        >
          <div className="mx-auto flex max-w-md flex-col items-center px-6 pb-16 pt-5">
            <div className="flex w-full items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                Choose an issue
              </p>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close"
                className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {years.map((year) => (
              <section key={year} className="mt-6 w-full text-center">
                <h2 className="font-serif text-2xl italic text-ink-muted">
                  {year}
                </h2>
                <ul className="mt-2">
                  {items
                    .filter((item) => item.year === year)
                    .map((item) => {
                      const active = item.slug === activeSlug;
                      return (
                        <li key={item.slug}>
                          <Link
                            ref={active ? pickerActiveRef : undefined}
                            href={`/newsletters/${item.slug}`}
                            scroll={false}
                            onClick={() => setPickerOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            data-umami-event="newsletter-click"
                            className={`block py-3.5 text-lg font-medium tracking-wide transition-colors ${
                              active ? 'text-accent' : 'text-ink hover:text-accent'
                            }`}
                          >
                            {item.dateLabel && (
                              <span className="block text-xs uppercase tracking-[0.12em] text-ink-muted">
                                {item.dateLabel}
                              </span>
                            )}
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Large screens: a sticky list down the left side. */}
      <nav
        ref={listRef}
        aria-label="Newsletter issues"
        className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto pr-2 lg:block"
      >
        {years.map((year) => (
          <section key={year} className="mb-8 last:mb-0">
            <h2 className="mb-2 font-serif text-xl italic text-ink">{year}</h2>
            <ul className="border-l border-line">
              {items
                .filter((item) => item.year === year)
                .map((item) => {
                  const active = item.slug === activeSlug;
                  return (
                    <li key={item.slug}>
                      <Link
                        ref={active ? activeRef : undefined}
                        href={`/newsletters/${item.slug}`}
                        scroll={false}
                        aria-current={active ? 'page' : undefined}
                        data-umami-event="newsletter-click"
                        className={`-ml-px block border-l-2 py-2 pl-4 pr-2 text-sm transition-colors ${
                          active
                            ? 'border-accent text-accent'
                            : 'border-transparent text-ink hover:text-accent'
                        }`}
                      >
                        {item.dateLabel && (
                          <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                            {item.dateLabel}
                          </span>
                        )}
                        <span className="block leading-snug">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </nav>
    </>
  );
}
