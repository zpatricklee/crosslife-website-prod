import PageHero from '@/components/PageHero';
import NewsletterNav from '@/components/NewsletterNav';
import { formatNewsletterDate, getNewsletters } from '@/lib/newsletters';

export default async function NewslettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newsletters = await getNewsletters();

  const items = newsletters.map((newsletter) => {
    // Titles like "07/14/26 Crosslife Connection" already carry the date.
    const monthDay = newsletter.date.slice(5).replace('-', '/');
    return {
      slug: newsletter.slug,
      year: newsletter.date.slice(0, 4),
      title: newsletter.title,
      dateLabel: newsletter.title.includes(monthDay)
        ? undefined
        : formatNewsletterDate(newsletter.date),
    };
  });

  return (
    <>
      {/* On phones the banner is dropped so the issue gets the whole screen. */}
      <div className={items.length > 0 ? 'hidden lg:block' : undefined}>
        <PageHero title="Newsletters" compact />
      </div>
      {items.length === 0 ? (
        <div className="mx-auto max-w-2xl px-6 py-20">{children}</div>
      ) : (
        // Large screens: list on the left, issue centered on the page (the
        // empty third column at xl is what keeps it centered).
        <div className="mx-auto max-w-7xl px-4 pb-3 pt-3 lg:px-6 lg:py-8 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[1fr_minmax(0,44rem)_1fr]">
          <NewsletterNav items={items} />
          <div className="min-w-0">{children}</div>
          <div className="hidden xl:block" aria-hidden />
        </div>
      )}
    </>
  );
}
