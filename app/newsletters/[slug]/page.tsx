import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsletterViewer from '@/components/NewsletterViewer';
import { formatNewsletterDate, getNewsletters } from '@/lib/newsletters';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const newsletters = await getNewsletters();
  return newsletters.map((newsletter) => ({ slug: newsletter.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const newsletter = (await getNewsletters()).find((n) => n.slug === slug);
  return { title: newsletter?.title ?? 'Newsletter' };
}

export default async function NewsletterPage({ params }: Props) {
  const { slug } = await params;
  const newsletter = (await getNewsletters()).find((n) => n.slug === slug);
  if (!newsletter) notFound();

  return (
    <NewsletterViewer
      title={newsletter.title}
      dateLabel={formatNewsletterDate(newsletter.date)}
      embedUrl={newsletter.embedUrl}
      docUrl={newsletter.docUrl}
    />
  );
}
