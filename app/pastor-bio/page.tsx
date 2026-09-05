import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import pastorPhoto from '@/public/pastor-isaac-mun.jpg';

export const metadata: Metadata = { title: 'Pastor Bio' };

export default function PastorBioPage() {
  return (
    <>
      <PageHero title="Pastor Bio" />
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="mb-12 flex justify-center">
          <Image
            src={pastorPhoto}
            alt="Rev. Isaac Mun"
            width={280}
            height={352}
            className="rounded-md object-cover shadow-lg shadow-ink/10"
            priority
          />
        </div>
        <div className="space-y-5">
          <p className="leading-relaxed text-ink-muted">
            Rev. Isaac Mun serves as the Lead Pastor of Crosslife Christian
            Fellowship. His passion is to preach God&apos;s Word, proclaim
            the gospel of Jesus Christ, and lead people into deeper faith,
            genuine community, and lives shaped by obedience to Christ.
          </p>
          <p className="leading-relaxed text-ink-muted">
            He believes the church must be rooted in Scripture, centered on
            Jesus, and empowered by the Holy Spirit. His preaching focuses on
            the grace of God, the transforming power of the gospel, and what
            it means to live out our faith together as the body of Christ.
          </p>
          <p className="leading-relaxed text-ink-muted">
            Isaac earned his undergraduate degree from Biola University and
            his Master of Divinity from Talbot School of Theology. He is
            ordained in the PCA (Presbyterian Church in America).
          </p>
          <p className="leading-relaxed text-ink-muted">
            He and his wife, Tina, have three dogs and enjoy daily walks
            together. They are thankful to be part of the Crosslife family
            and excited to see how God continues to work in and through the
            church.
          </p>
        </div>
      </div>
    </>
  );
}
