'use client';

import { useRef } from 'react';

export default function NewsletterViewer({
  title,
  dateLabel,
  embedUrl,
  docUrl,
}: {
  title: string;
  dateLabel: string;
  embedUrl: string;
  docUrl: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    // The Doc lives on another origin, so we can't set its scroll position
    // directly. What we can do cross-origin is location.replace(): it
    // re-navigates the frame to the top of the Doc (a quick reload from
    // cache) without adding a browser-history entry.
    frameRef.current?.contentWindow?.location.replace(`${embedUrl}#top`);
    viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <article className="mx-auto w-full max-w-[44rem]">
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

      <div ref={viewerRef} className="relative">
        {/* key: a fresh frame per issue, so switching issues doesn't stack up browser-history entries. */}
        <iframe
          key={embedUrl}
          ref={frameRef}
          src={embedUrl}
          title={title}
          className="block h-[calc(100dvh-12.5rem)] min-h-[320px] w-full rounded-md border border-line bg-white lg:h-[calc(100dvh-18.5rem)] lg:min-h-[480px]"
        />
        {/* Zero-height sticky rail: keeps the button floating near the bottom
            of the screen while this issue is in view, and parks it at the
            bottom of the issue once you've scrolled past. */}
        <div className="pointer-events-none sticky bottom-5 z-10 h-0">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll newsletter to top"
            className="pointer-events-auto absolute bottom-0 right-4 flex lg:right-8 h-11 w-11 items-center justify-center rounded-full bg-ink text-cream shadow-lg shadow-ink/25 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
