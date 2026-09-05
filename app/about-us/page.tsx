import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = { title: 'About Us' };

export default function AboutUsPage() {
  return (
    <>
      <PageHero title="About Us" />
      <div className="mx-auto max-w-2xl space-y-16 px-6 py-20">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl italic text-ink">
            Our Sundays
          </h2>
          <p className="leading-relaxed text-ink-muted">
            Every Sunday, we gather for worship at{' '}
            <b className="font-semibold text-ink">11:30am</b> in the chapel
            at Gardena Presbyterian Church, located at{' '}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=1340+W+Gardena+Blvd,+Gardena,+CA+90247"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-line underline-offset-4 hover:text-accent-dark"
            >
              1340 W Gardena Blvd, Gardena, CA 90247
            </a>
            .{' '}
            <b className="font-semibold text-ink">
              Parking is available on-site.
            </b>
          </p>
          <p className="leading-relaxed text-ink-muted">
            Our chapel is the first building on the right as soon as you
            enter the church parking lot.
          </p>
          <p className="leading-relaxed text-ink-muted">
            Our services are about 90-minutes long and consist of singing
            songs of praise, confessing our sins and faith, hearing teachings
            from the Bible, and praying together. Whether you are looking for
            a community to grow in your faith or just curious about who
            Jesus is, we would love for you to join us!
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl italic text-ink">
            Our Mission and Vision
          </h2>
          <p className="leading-relaxed text-ink-muted">
            Our <b className="font-semibold text-ink">mission</b> is to
            glorify God, grow in the gospel, and go into the world.
          </p>
          <p className="leading-relaxed text-ink-muted">
            Our <b className="font-semibold text-ink">vision</b> is to see
            people come into relationship with God and to grow deep in the
            grace and truth of Jesus Christ through the power of the Holy
            Spirit for the glory of God. We desire to see God work in us and
            through us to bring the gospel to the South Bay and the world.
          </p>
        </section>
      </div>
    </>
  );
}
