import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SprinkleField } from '@/components/layout/SprinkleField';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { company, contact } from '@/content/site';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  // 600 was downloaded but never rendered; every Sora usage is 400, 700 or 800.
  weight: ['400', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} - BPO & Digital Solutions`,
    template: `%s - ${company.name}`,
  },
  description: company.description,
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    type: 'website',
    siteName: company.name,
    title: `${company.name} - BPO & Digital Solutions`,
    description: company.description,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} - BPO & Digital Solutions`,
    description: company.description,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

/** Helps Google associate the brand with the real Sheridan address. */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  url: company.url,
  logo: `${company.url}/logo@2x.png`,
  description: company.description,
  email: contact.email,
  telephone: contact.whatsappDisplay,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address.street,
    addressLocality: contact.address.city,
    addressRegion: contact.address.region,
    postalCode: contact.address.postalCode,
    addressCountry: contact.address.country,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled JSON - no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#1a1305]"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <SprinkleField />
        <Header />
        {/* Above the dust layer. Sections are transparent so it shows through;
            the mascot stage is opaque so it does not. */}
        <main id="main" className="relative z-10">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
