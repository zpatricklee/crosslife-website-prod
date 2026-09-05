import Image from 'next/image';
import Link from 'next/link';
import churchStreetView from '@/public/church-street-view.jpg';

const MAPS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=1340+W+Gardena+Blvd,+Gardena,+CA+90247';
const NEWCOMERS_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfxWr-R2k8G9mmtLOCPxznV2o6tQ4AoMgLV9Khu4de6JWC8CQ/viewform?usp=header';

export default function Home() {
  return (
    <>
      <section className="relative flex h-[88vh] min-h-[560px] items-center justify-center overflow-hidden">
        <Image
          src={churchStreetView}
          alt="Gardena Presbyterian Church"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/70" />
        <div className="relative flex flex-col items-center px-6 text-center">
          <p className="mb-5 text-xs font-medium tracking-[0.35em] text-cream/80">
            GARDENA, CALIFORNIA
          </p>
          <h1 className="max-w-3xl font-serif text-5xl italic leading-[1.05] text-cream sm:text-6xl md:text-7xl">
            Welcome to Crosslife
          </h1>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#gatherings"
              className="rounded-full bg-accent px-7 py-3 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-accent-dark"
            >
              Join Us Sunday
            </Link>
            <Link
              href="/sermons"
              className="rounded-full border border-cream/60 px-7 py-3 text-sm font-medium tracking-wide text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              Watch a Sermon
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-lg leading-relaxed text-ink-muted sm:text-xl">
          Crosslife Christian Fellowship is the adult, English-speaking
          congregation of Gardena Presbyterian Church (PCA). As a diverse
          community of believers, Crosslife&apos;s purpose is to reflect the
          differences that become united in Christ, by reaching out with the
          gospel to the South Bay.
        </p>
      </section>

      <section
        id="gatherings"
        className="border-y border-line bg-cream-dim"
      >
        <div className="mx-auto grid max-w-5xl divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col items-center gap-3 px-8 py-20 text-center">
            <h2 className="font-serif text-2xl italic text-ink">
              Sunday Gatherings
            </h2>
            <p className="text-2xl font-light text-ink">11:30am</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-xs text-sm text-ink-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
            >
              1340 W Gardena Blvd, Gardena, CA 90247
            </a>
            <p className="text-sm text-ink-muted">
              Parking available on-site.
            </p>
          </div>

          <div
            id="newcomers"
            className="flex flex-col items-center gap-4 px-8 py-20 text-center"
          >
            <h2 className="font-serif text-2xl italic text-ink">
              New to Crosslife?
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              If you&apos;re new to Crosslife and looking for ways to get
              plugged in, we&apos;d love to hear from you! Fill out our
              Newcomer&apos;s Form and we will get in touch with you and
              share some ways you can get involved.
            </p>
            <a
              href={NEWCOMERS_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full border border-ink px-6 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Newcomer&apos;s Form
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
