import type { Metadata } from 'next';
import { getCourseCollection } from '@/lib/models/course';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { BUSINESS, whatsappLink } from '@/lib/constants';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Contact Us — Free Admission Enquiry, Gurugram Sector 14',
  description:
    'Contact OM Technical and Management Education for genuine distance and regular degree admission guidance. Visit our Sector 14, Gurugram office, call, WhatsApp, or send an enquiry.',
  alternates: { canonical: '/contact' },
};

async function getCourseNames(): Promise<string[]> {
  try {
    const collection = await getCourseCollection();
    const docs = await collection.find({ active: true }).sort({ name: 1 }).project({ name: 1 }).toArray();
    return docs.map((c) => c.name as string);
  } catch (e) {
    console.error('Failed to load course names from MongoDB:', e);
    return [];
  }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { course?: string };
}) {
  const courseOptions = await getCourseNames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'Contact', url: `${BUSINESS.siteUrl}/contact` },
        ])}
      />

      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
          Contact Us for Free Admission Guidance
        </h1>
        <p className="mt-3 text-navy-600">
          Reach out by phone, WhatsApp, email, or the form below — or visit our Sector 14
          office in person.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-900">Send an Enquiry</h2>
            <div className="mt-4">
              <LeadForm courseOptions={courseOptions} defaultCourse={searchParams.course} />
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-navy-100 bg-navy-50 p-6">
            <h2 className="text-lg font-bold text-navy-900">Reach Us Directly</h2>
            <ul className="mt-4 space-y-3 text-sm text-navy-700">
              <li>
                <span className="block font-medium text-navy-500">Phone</span>
                <a href={`tel:+91${BUSINESS.phone}`} className="font-semibold hover:text-gold-600">
                  +91 {BUSINESS.phone}
                </a>
              </li>
              <li>
                <span className="block font-medium text-navy-500">WhatsApp</span>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-gold-600">
                  Chat Instantly on WhatsApp
                </a>
              </li>
              <li>
                <span className="block font-medium text-navy-500">Email</span>
                <a href={`mailto:${BUSINESS.email}`} className="font-semibold hover:text-gold-600">
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <span className="block font-medium text-navy-500">Office Address</span>
                <address className="not-italic font-semibold">
                  {BUSINESS.address.line1}, {BUSINESS.address.line2}
                  <br />
                  {BUSINESS.address.landmark}
                </address>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-navy-100">
            <iframe
              src={BUSINESS.mapEmbedSrc}
              title={`Map to ${BUSINESS.name} office`}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
