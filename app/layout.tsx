import type { Metadata } from 'next';
import './globals.css';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: `${BUSINESS.name} | UG & PG Distance and Regular Degree Admission Guidance, Gurugram & Delhi NCR`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    'Genuine UG & PG admission guidance for distance and regular degree courses in Gurugram, Delhi & NCR since 2006. UGC-approved university tie-ups across technical and management courses. No fees displayed — visit our Sector 14 office.',
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.owner }],
  keywords: [
    'distance education admission Gurugram',
    'distance education admission Delhi NCR',
    'UG PG admission consultancy Gurugram',
    'degree admission consultancy Sector 14 Gurugram',
    'regular degree courses Gurugram Delhi',
    'distance MBA admission Gurugram',
    'distance BBA BCA admission Delhi NCR',
    'UGC approved distance university admission Gurugram',
    'genuine distance education consultant Gurugram',
    'undergraduate postgraduate admission guidance Gurugram',
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | UG & PG Admission Guidance, Gurugram & Delhi NCR`,
    description:
      'Genuine UG & PG admission guidance for distance and regular degree courses in Gurugram, Delhi & NCR since 2006. UGC-approved university tie-ups, no fake promises.',
    url: BUSINESS.siteUrl,
  },
  twitter: {
    card: 'summary',
    title: `${BUSINESS.name} | UG & PG Admission Guidance, Gurugram & Delhi NCR`,
    description:
      'Genuine UG & PG admission guidance for distance and regular degree courses in Gurugram, Delhi & NCR since 2006.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-navy-900 antialiased">{children}</body>
    </html>
  );
}
