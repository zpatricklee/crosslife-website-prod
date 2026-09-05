import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = { title: 'Our Beliefs' };

const weAre = [
  {
    term: 'Evangelical',
    body: 'We affirm the historic Apostles’ and Nicene Creeds and gladly embrace all who hold this biblical gospel, whatever their tradition or denomination.',
  },
  {
    term: 'Reformed',
    body: 'We hold to the Westminster Confession of Faith and the Larger and Shorter Catechisms as a faithful, comprehensive summary of what the Bible teaches, under Scripture’s final authority.',
  },
  {
    term: 'Covenantal',
    body: 'We believe God relates to his people through a covenant of grace, calling believers and their children into relationship with him, and that Christ is freely offered by Word and Sacrament in the worship of the church.',
  },
  {
    term: 'Missional',
    body: 'We believe Christ sends his church to proclaim the gospel and make disciples in our city and to the nations, and we participate in this mission through evangelism, mercy, and support of global and local ministry.',
  },
  {
    term: 'Presbyterian',
    body: 'We are a Presbyterian church in the PCA (Presbyterian Church in America). Our church government and practices follow the PCA’s Book of Church Order, which, together with the Westminster Confession of Faith and Catechisms, forms part of our constitution under the authority of Scripture.',
  },
];

const weBelieve = [
  {
    term: 'The Bible',
    body: 'We believe the Scriptures of the Old and New Testaments are God’s written Word, inspired by the Holy Spirit, without error in the original manuscripts, and our only infallible rule of faith and life.',
  },
  {
    term: 'The Triune God',
    body: 'We believe in one God who exists eternally in three persons: Father, Son, and Holy Spirit—equal in power and glory. We believe Jesus Christ is the eternal Son of God, who became man, lived a sinless life, died for our sins, rose bodily from the dead, and reigns as Lord.',
  },
  {
    term: 'Humanity and Salvation',
    body: 'We believe all people are created in God’s image yet are sinners by nature and choice, unable to save themselves. We believe sinners are rescued only by God’s grace, through faith in Jesus Christ alone, not by works, and are forgiven, declared righteous, and adopted into God’s family.',
  },
  {
    term: 'The Church and Sacraments',
    body: 'We believe Jesus gathers his people into the church, his body, to worship, grow, and serve together until he returns. We believe he has given two sacraments—baptism and the Lord’s Supper—as signs and seals of his covenant promises and means of grace to his people.',
  },
];

function BeliefList({
  items,
}: {
  items: { term: string; body: string }[];
}) {
  return (
    <div className="space-y-7">
      {items.map((item) => (
        <div key={item.term}>
          <p className="mb-1.5 font-serif text-lg italic text-ink">
            {item.term}
          </p>
          <p className="leading-relaxed text-ink-muted">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function OurBeliefsPage() {
  return (
    <>
      <PageHero title="Our Beliefs" />
      <div className="mx-auto max-w-2xl space-y-16 px-6 py-20">
        <section className="space-y-7">
          <h2 className="font-serif text-2xl italic text-ink">We are...</h2>
          <BeliefList items={weAre} />
        </section>

        <section className="space-y-7">
          <h2 className="font-serif text-2xl italic text-ink">
            We believe...
          </h2>
          <BeliefList items={weBelieve} />
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl italic text-ink">Our Hope</h2>
          <p className="leading-relaxed text-ink-muted">
            We believe Jesus Christ will come again to judge the living and
            the dead, renew all things, and bring his people into the
            fullness of God&apos;s kingdom forever.
          </p>
        </section>
      </div>
    </>
  );
}
