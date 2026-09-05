import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import SermonGrid from '@/components/SermonGrid';
import { getSermons } from '@/lib/sermons';

export const metadata: Metadata = { title: 'Sermons' };
export const revalidate = 3600;

export default async function SermonsPage() {
  const { sermons, nextPageToken } = await getSermons();

  return (
    <>
      <PageHero title="Sermons" />
      <div className="mx-auto max-w-5xl px-6 py-20">
        {sermons.length === 0 ? (
          <p className="text-center text-ink-muted">
            No sermons available right now — check back soon, or visit our{' '}
            <a
              href="https://www.youtube.com/@crosslifeGPC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-line underline-offset-4 hover:text-accent-dark"
            >
              YouTube channel
            </a>
            .
          </p>
        ) : (
          <SermonGrid sermons={sermons} initialNextPageToken={nextPageToken} />
        )}
      </div>
    </>
  );
}
