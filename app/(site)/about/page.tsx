import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us — Balram Singh & Our Story Since 2006',
  description:
    `Founded in 2006 by Balram Singh, ${BUSINESS.name} has guided students in Gurugram towards genuine, UGC-approved degree admissions for over 18 years — from our physical office in Sector 14.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'About Us', url: `${BUSINESS.siteUrl}/about` },
        ])}
      />

      <header>
        <span className="inline-block rounded-full bg-gold-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-700">
          Established {BUSINESS.foundedYear}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-navy-900 sm:text-4xl">
          About {BUSINESS.name}
        </h1>
      </header>

      <section className="mt-8 space-y-4 text-navy-700">
        <h2 className="text-xl font-bold text-navy-900">Our Founding Story</h2>
        <p>
          {BUSINESS.name} was founded in {BUSINESS.foundedYear} by <strong>{BUSINESS.owner}</strong>,
          with a simple goal: give students and working professionals in Gurugram honest,
          accurate guidance on distance and regular degree admissions — at a time when
          misinformation and fraudulent admission agents were common in the education
          consultancy space.
        </p>
        <p>
          For over {BUSINESS.yearsOfExperience} years, we have operated from the same
          physical office in Old DLF Colony, Sector 14, Gurugram — a deliberate choice.
          Unlike phone-only agents, we believe every student and parent should be able to
          walk in, ask questions, and verify our credentials in person before making any
          admission decision.
        </p>

        <h2 className="pt-4 text-xl font-bold text-navy-900">Our Mission</h2>
        <p>
          To help students make informed choices about distance and regular degree
          programs by connecting them only with recognized, UGC-approved universities —
          and by being transparent about what we can and cannot guarantee. We do not
          make false promises about guaranteed admissions, and we encourage every
          student to independently verify university recognition status.
        </p>

        <h2 className="pt-4 text-xl font-bold text-navy-900">Why {BUSINESS.yearsOfExperience}+ Years Matters</h2>
        <p>
          Admission fraud is a real risk in this industry. Longevity is one of the
          clearest signals of legitimacy: a consultancy operating from the same address
          since {BUSINESS.foundedYear}, with a verifiable phone number and email, is
          fundamentally different from a short-lived agent operation. We invite every
          prospective student to factor this into their decision.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-navy-100 bg-navy-50 p-6">
        <h2 className="text-lg font-bold text-navy-900">Visit Our Office</h2>
        <address className="mt-2 space-y-1 text-sm not-italic text-navy-700">
          <p>{BUSINESS.address.line1}</p>
          <p>{BUSINESS.address.line2}</p>
          <p>{BUSINESS.address.landmark}</p>
        </address>
        <div className="mt-4 overflow-hidden rounded-md border border-navy-100">
          <iframe
            src={BUSINESS.mapEmbedSrc}
            title={`Map to ${BUSINESS.name} office in Sector 14, Gurugram`}
            className="h-72 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={BUSINESS.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-navy-700 underline hover:text-gold-600"
        >
          Get Directions on Google Maps
        </a>
      </section>
    </div>
  );
}
