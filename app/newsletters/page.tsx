import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getNewsletters } from '@/lib/newsletters';

export const metadata: Metadata = { title: 'Newsletters' };
export const revalidate = 3600;

// /newsletters opens the most recent issue; the list and viewer live in the layout.
export default async function NewslettersPage() {
  const [latest] = await getNewsletters();
  if (latest) redirect(`/newsletters/${latest.slug}`);

  return (
    <p className="text-center text-ink-muted">
      No newsletters have been posted yet — check back soon.
    </p>
  );
}
