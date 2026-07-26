import type { Metadata } from 'next';
import { getCourseCollection, mapCourse } from '@/lib/models/course';
import { getUniversityCollection } from '@/lib/models/university';
import { COURSE_CATEGORIES } from '@/lib/constants';
import CourseCard from '@/components/CourseCard';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, courseSchema } from '@/lib/schema';
import { BUSINESS } from '@/lib/constants';
import type { Course } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Courses — Distance & Regular Degree Programs (Technical & Management)',
  description:
    'Browse distance and regular degree courses in Gurugram across Technical and Management streams — BBA, MBA, BCA, MCA, B.Tech and more, with affiliated university details. No fees listed.',
  alternates: { canonical: '/courses' },
};

async function getCourses(): Promise<Course[]> {
  try {
    const [courseCollection, universityCollection] = await Promise.all([
      getCourseCollection(),
      getUniversityCollection(),
    ]);
    const [courseDocs, universityDocs] = await Promise.all([
      courseCollection.find({ active: true }).sort({ category: 1 }).toArray(),
      universityCollection.find().toArray(),
    ]);
    const universityNameById = new Map(universityDocs.map((u) => [u._id.toString(), u.name]));
    return courseDocs.map((c) =>
      mapCourse(c, c.universityId ? universityNameById.get(c.universityId.toString()) : null)
    );
  } catch (e) {
    console.error('Failed to load courses from MongoDB:', e);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const grouped = COURSE_CATEGORIES.map((cat) => ({
    category: cat,
    items: courses.filter((c) => c.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'Courses', url: `${BUSINESS.siteUrl}/courses` },
        ])}
      />
      {courses.map((c) => (
        <JsonLd key={c.id} data={courseSchema(c)} />
      ))}

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
          Distance &amp; Regular Degree Courses in Gurugram
        </h1>
        <p className="mt-3 text-navy-600">
          Every course below is offered through a recognized, affiliated university.
          We provide guidance on eligibility, duration and process &mdash; not fee
          negotiation. Contact us for full details on any program.
        </p>
      </header>

      <div className="mt-10 space-y-14">
        {grouped.map((group) => (
          <section key={group.category} id={group.category}>
            <h2 className="text-2xl font-bold text-navy-900">{group.category}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        ))}
        {grouped.length === 0 && (
          <p className="text-navy-500">
            Course listings are being updated. Please contact us directly for current offerings.
          </p>
        )}
      </div>
    </div>
  );
}
