import Image from 'next/image';
import churchStreetView from '@/public/church-street-view.jpg';

export default function PageHero({
  title,
  compact = false,
}: {
  title: string;
  /** A short banner, for pages where the content needs the room. */
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        compact ? 'h-28' : 'h-[38vh] min-h-[260px]'
      }`}
    >
      <Image
        src={churchStreetView}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/55" />
      <h1 className="relative px-6 text-center font-serif text-4xl italic tracking-tight text-cream sm:text-5xl">
        {title}
      </h1>
    </div>
  );
}
