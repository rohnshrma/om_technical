import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourseCollection, mapCourse } from '@/lib/models/course';
import { getUniversityCollection, mapUniversity } from '@/lib/models/university';
import { getTestimonialCollection, mapTestimonial } from '@/lib/models/testimonial';
import { BUSINESS } from '@/lib/constants';
import CourseCard from '@/components/CourseCard';
import TestimonialCard from '@/components/TestimonialCard';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { localBusinessSchema, aggregateRatingSchema } from '@/lib/schema';
import type { Course, Testimonial, University } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Distance & Regular Degree Admission Guidance in Gurugram Since 2006',
  description:
    'OM Technical and Management Education — genuine admission guidance for distance & regular degree courses in Gurugram. UGC-approved university tie-ups, no fake promises, 18+ years of trust.',
  alternates: { canonical: '/' },
};

async function getData(): Promise<{ courses: Course[]; universities: University[]; testimonials: Testimonial[] }> {
  try {
    const [courseCollection, universityCollection, testimonialCollection] = await Promise.all([
      getCourseCollection(),
      getUniversityCollection(),
      getTestimonialCollection(),
    ]);

    const [courseDocs, universityDocs, testimonialDocs] = await Promise.all([
      courseCollection.find({ active: true }).sort({ createdAt: -1 }).limit(6).toArray(),
      universityCollection.find().sort({ name: 1 }).toArray(),
      testimonialCollection.find({ featured: true }).sort({ createdAt: -1 }).limit(3).toArray(),
    ]);

    const universityNameById = new Map(universityDocs.map((u) => [u._id.toString(), u.name]));
    const courses = courseDocs.map((c) =>
      mapCourse(c, c.universityId ? universityNameById.get(c.universityId.toString()) : null)
    );

    return {
      courses,
      universities: universityDocs.map(mapUniversity),
      testimonials: testimonialDocs.map(mapTestimonial),
    };
  } catch (e) {
    console.error('Failed to load homepage data from MongoDB:', e);
    return { courses: [], universities: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const { courses, universities, testimonials } = await getData();
  const categories = Array.from(new Set(courses.map((c) => c.category)));

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      {testimonials.length > 0 && <JsonLd data={aggregateRatingSchema(testimonials) as Record<string, unknown>} />}

      {/* HERO */}
      <section className="border-b border-navy-100 bg-gradient-to-b from-navy-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="inline-block rounded-full bg-gold-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-700">
              Serving students since {BUSINESS.foundedYear} &middot; {BUSINESS.yearsOfExperience}+ years of trust
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
              Genuine Admission Guidance for Distance &amp; Regular Degree Courses in Gurugram
            </h1>
            <p className="mt-4 text-lg text-navy-600">
              {BUSINESS.name} has helped students across Gurugram make informed, fraud-free
              admission decisions since {BUSINESS.foundedYear}. We work only with recognized,
              UGC-approved university tie-ups &mdash; from our physical office in Sector 14, not
              over the phone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-md bg-navy-800 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700"
              >
                Get Free Admission Guidance
              </Link>
              <Link
                href="/universities"
                className="rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-navy-800 hover:border-navy-500"
              >
                View University Tie-Ups
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold text-navy-900">Request a Callback</h2>
            <p className="mt-1 text-sm text-navy-500">
              Share your details — our counsellor will guide you honestly, with no hidden agenda.
            </p>
            <div className="mt-4">
              <LeadForm courseOptions={courses.map((c) => c.name)} compact />
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERSITY STRIP */}
      {universities.length > 0 && (
        <section className="border-b border-navy-100 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-sm font-bold uppercase tracking-wide text-navy-500">
              Our University Affiliations &amp; Recognitions
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {universities.map((u) => (
                <Link
                  key={u.id}
                  href={`/universities#${u.id}`}
                  className="text-center text-sm font-semibold text-navy-700 hover:text-gold-600"
                  title={`${u.name}${u.recognition ? ' — ' + u.recognition : ''}`}
                >
                  {u.shortName || u.name}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-navy-500">
              <Link href="/universities" className="underline hover:text-gold-600">
                See full recognition status and course mapping for every university &rarr;
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* COURSE CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
          Courses We Guide Admissions For
        </h2>
        <p className="mt-2 max-w-2xl text-navy-600">
          Distance and regular degree programs across technical and management streams,
          all through recognized university affiliations.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/courses#${encodeURIComponent(cat)}`}
              className="rounded-full border border-navy-200 px-4 py-1.5 text-sm font-medium text-navy-700 hover:border-navy-500"
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/courses"
            className="inline-block rounded-md bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-400"
          >
            View All Courses
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="border-y border-navy-100 bg-navy-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">Why Students Trust Us</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: `${BUSINESS.yearsOfExperience}+ Years of Experience`,
                desc: `Operating in Gurugram continuously since ${BUSINESS.foundedYear} — not a fly-by-night agent.`,
              },
              {
                title: 'Real, Visitable Office',
                desc: 'Our Sector 14 office is open to every student and parent — verify us in person before enrolling.',
              },
              {
                title: 'UGC-Approved Tie-Ups Only',
                desc: 'We guide students only towards recognized universities — never unverified or fraudulent institutions.',
              },
              {
                title: 'Guidance, Not Guarantees',
                desc: 'We give honest counselling on eligibility and process — no false promises about guaranteed seats.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm text-navy-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS PREVIEW */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">What Our Students Say</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/testimonials" className="text-sm font-semibold text-navy-700 underline hover:text-gold-600">
              Read More Student Testimonials &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-navy-800 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Speak to a Genuine Admission Counsellor Today
          </h2>
          <p className="mt-3 text-navy-200">
            Visit our Sector 14, Gurugram office or reach out for honest, no-pressure guidance.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-md bg-gold-500 px-8 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-400"
          >
            Get Free Admission Guidance
          </Link>
        </div>
      </section>
    </>
  );
}
