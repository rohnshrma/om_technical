import type { Metadata } from 'next';
import './globals.css';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: `${BUSINESS.name} | Distance & Regular Degree Admission Guidance, Gurugram`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    'Genuine distance and regular degree admission guidance in Gurugram since 2006. UGC-approved university tie-ups across technical and management courses. No fees displayed — visit our Sector 14 office.',
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.owner }],
  keywords: [
    'distance education admission Gurugram',
    'degree admission consultancy Sector 14 Gurugram',
    'regular degree courses Gurugram',
    'distance MBA admission Gurugram',
    'UGC approved distance university admission Gurugram',
    'genuine distance education consultant Gurugram',
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-navy-900 antialiased">{children}</body>
    </html>
  );
}
