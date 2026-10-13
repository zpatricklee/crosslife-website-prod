'use client';

import { useEffect, useRef, useState } from 'react';

export default function NewsletterViewer({
  title,
  dateLabel,
  srcDoc,
  embedUrl,
  docUrl,
}: {
  title: string;
  dateLabel: string;
  /** The issue converted to a standalone page (see lib/newsletterDoc.ts). */
  srcDoc: string | null;
  /** Google's own embed, used only if the conversion wasn't possible. */
  embedUrl: string;
  docUrl: string;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(800);
  const [showArrow, setShowArrow] = useState(false);

  // The converted issue is same-origin and script-free, so we can read how tall
  // it is and make the frame exactly that tall. The page then scrolls as one,
  // with no scroll box inside the page.
  useEffect(() => {
    const frame = frameRef.current;
    if (!srcDoc || !frame) return;

    let observer: ResizeObserver | undefined;
    const attach = () => {
      const win = frame.contentWindow as (Window & typeof globalThis) | null;
      const body = frame.contentDocument?.body;
      if (!win || !body) return;
      observer?.disconnect();
      const measure = () => setFrameHeight(Math.ceil(body.scrollHeight));
      measure();
      // Re-measure as pictures and fonts arrive, or the width changes.
      observer = new win.ResizeObserver(measure);
      observer.observe(body);
    };

    if (frame.contentDocument?.readyState === 'complete') attach();
    frame.addEventListener('load', attach);
    return () => {
      frame.removeEventListener('load', attach);
      observer?.disconnect();
    };
  }, [srcDoc]);

  // Only offer the arrow once you've scrolled down into the issue.
  useEffect(() => {
    const onScroll = () => {
      const top = articleRef.current?.getBoundingClientRect().top ?? 0;
      setShowArrow(top < -240);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    if (window.matchMedia('(min-width: 1024px)').matches) {
      articleRef.current?.scrollIntoView({ behavior, block: 'start' });
    } else {
      // On phones the issue picker sits above the issue, so go all the way up.
      window.scrollTo({ top: 0, behavior });
    }
    // Fallback embed only: it scrolls inside its own box, which we can only reset
    // by re-navigating it (location.replace adds no browser-history entry).
    if (!srcDoc) frameRef.current?.contentWindow?.location.replace(`${embedUrl}#top`);
  };

  return (
    <article ref={articleRef} className="mx-auto w-full max-w-[44rem] scroll-mt-24">
      <header className="mb-2 flex items-end justify-end gap-4 lg:mb-4 lg:justify-between">
        {/* On phones the issue picker above already names the issue. */}
        <div className="hidden lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
            {dateLabel}
          </p>
          <h2 className="mt-1 font-serif text-2xl italic leading-tight text-ink">
            {title}
          </h2>
        </div>
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm leading-6 text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent lg:pb-1"
        >
          Open in new tab
        </a>
      </header>

      <div className="relative">
        {srcDoc ? (
          // No allow-scripts: nothing inside can run code. allow-same-origin only
          // lets us measure it; popups let its links open in a new tab.
          <iframe
            ref={frameRef}
            srcDoc={srcDoc}
            title={title}
            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            scrolling="no"
            style={{ height: frameHeight }}
            className="block w-full rounded-md border border-line bg-white"
          />
        ) : (
          // key: a fresh frame per issue, so switching issues doesn't stack up history entries.
          <iframe
            key={embedUrl}
            ref={frameRef}
            src={embedUrl}
            title={title}
            className="block h-[calc(100dvh-12.5rem)] min-h-[320px] w-full rounded-md border border-line bg-white lg:h-[calc(100dvh-18.5rem)] lg:min-h-[480px]"
          />
        )}

        {/* Zero-height sticky rail: keeps the button floating near the bottom of
            the screen while this issue is in view, and parks it at the bottom of
            the issue once you've scrolled past. */}
        <div className="pointer-events-none sticky bottom-5 z-10 h-0">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll newsletter to top"
            aria-hidden={!showArrow}
            tabIndex={showArrow ? 0 : -1}
            className={`absolute bottom-0 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream shadow-lg shadow-ink/25 transition-[opacity,background-color] duration-200 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:right-8 ${
              showArrow ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
