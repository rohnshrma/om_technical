import type { Metadata } from 'next';
import { getUniversityCollection, mapUniversity } from '@/lib/models/university';
import { getCourseCollection, mapCourse } from '@/lib/models/course';
import UniversityCard from '@/components/UniversityCard';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { BUSINESS } from '@/lib/constants';
import type { Course, University } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'University Affiliations & UGC-Approved Tie-Ups — Gurugram & Delhi NCR',
  description:
    'Full list of university affiliations at OM Technical, serving Gurugram, Delhi & NCR — UGC-DEB approved distance education partners and regular degree universities, with recognition status and mapped UG/PG courses.',
  alternates: { canonical: '/universities' },
};

async function getData(): Promise<{ universities: University[]; courses: Course[] }> {
  try {
    const [universityCollection, courseCollection] = await Promise.all([
      getUniversityCollection(),
      getCourseCollection(),
    ]);
    const [universityDocs, courseDocs] = await Promise.all([
      universityCollection.find().sort({ name: 1 }).toArray(),
      courseCollection.find({ active: true }).toArray(),
    ]);
    return {
      universities: universityDocs.map(mapUniversity),
      courses: courseDocs.map((c) => mapCourse(c)),
    };
  } catch (e) {
    console.error('Failed to load universities from MongoDB:', e);
    return { universities: [], courses: [] };
  }
}

export default async function UniversitiesPage() {
  const { universities, courses } = await getData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'Universities', url: `${BUSINESS.siteUrl}/universities` },
        ])}
      />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
          Our University Affiliations &amp; Recognitions
        </h1>
        <p className="mt-3 text-navy-600">
          Since {BUSINESS.foundedYear}, {BUSINESS.name} has worked exclusively with
          recognized universities. Before enrolling anywhere, verify the recognition
          status below, or ask us for the current UGC-DEB approval documentation in writing.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {universities.map((u) => (
          <UniversityCard
            key={u.id}
            university={u}
            courses={courses.filter((c) => c.universityId === u.id)}
          />
        ))}
        {universities.length === 0 && (
          <p className="text-navy-500">University affiliation details are being updated. Please contact us directly.</p>
        )}
      </div>

      <section className="mt-14 rounded-lg border border-gold-200 bg-gold-50 p-6">
        <h2 className="text-lg font-bold text-navy-900">A Note on Verifying Recognition</h2>
        <p className="mt-2 text-sm text-navy-700">
          UGC-DEB approval status can change year to year and program to program. We
          encourage every student to independently verify approval status on the official
          UGC-DEB website in addition to the information we provide. This is part of our
          commitment to honest, fraud-free admission guidance.
        </p>
      </section>
    </div>
  );
}
