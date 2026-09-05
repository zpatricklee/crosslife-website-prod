import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
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
      </body>
    </html>
  );
}
