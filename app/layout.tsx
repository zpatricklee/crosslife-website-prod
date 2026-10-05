import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.crosslifegpc.com'),
  title: {
    default: 'Crosslife Christian Fellowship',
    template: '%s | Crosslife Christian Fellowship',
  },
  description:
    "Crosslife Christian Fellowship is the adult, English-speaking congregation of Gardena Presbyterian Church (PCA), reaching the South Bay with the gospel of Jesus Christ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* data-domains limits tracking to the real site, so localhost and
            preview deployments don't pollute the stats. The website ID is a
            public identifier, not a secret. */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="115c238c-fe6b-49e6-9876-668af84c452d"
          data-domains="crosslifegpc.com,www.crosslifegpc.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
