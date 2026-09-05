import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = { title: 'Vision & Values' };

export default function VisionAndValuesPage() {
  return (
    <>
      <PageHero title="Vision & Values" />
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="leading-relaxed text-ink-muted">
          At Crosslife Christian Fellowship, our vision is to be a community
          of believers who reflect the diversity and unity found in Christ.
          We are committed to reaching out with the gospel to the South Bay,
          sharing the love of Jesus and making disciples. Our values include
          faith, love, community, and service, as we seek to glorify God in
          all that we do.
        </p>
      </div>
    </>
  );
}
