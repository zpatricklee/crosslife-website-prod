'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import type { Sermon } from '@/lib/sermons';
import { loadMoreSermons } from '@/app/sermons/actions';

const PAGE_SIZE = 6;

export default function SermonGrid({
  sermons,
  initialNextPageToken,
}: {
  sermons: Sermon[];
  initialNextPageToken?: string;
}) {
  const [allSermons, setAllSermons] = useState(sermons);
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  const visibleSermons = allSermons.slice(0, visibleCount);
  const canShowMoreLocally = visibleCount < allSermons.length;
  const canFetchMore = Boolean(nextPageToken);

  const handleLoadMore = () => {
    if (canShowMoreLocally) {
      setVisibleCount((count) => count + PAGE_SIZE);
      return;
    }

    if (!nextPageToken) return;

    startTransition(async () => {
      const page = await loadMoreSermons(nextPageToken);
      setAllSermons((prev) => [...prev, ...page.sermons]);
      setNextPageToken(page.nextPageToken);
      setVisibleCount((count) => count + PAGE_SIZE);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSermons.map((sermon) => (
          <a
            key={sermon.id}
            href={`https://www.youtube.com/watch?v=${sermon.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-md bg-cream-dim">
              <Image
                src={sermon.thumbnailUrl}
                alt={sermon.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-4 font-serif text-lg italic text-ink transition-colors group-hover:text-accent">
              {sermon.title}
            </p>
          </a>
        ))}
      </div>

      {(canShowMoreLocally || canFetchMore) && (
        <button
          onClick={handleLoadMore}
          disabled={isPending}
          className="mt-16 rounded-full border border-ink px-7 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-wait disabled:opacity-50"
        >
          {isPending ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  );
}
