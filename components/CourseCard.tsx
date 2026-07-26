import Link from 'next/link';
import type { Course } from '@/lib/types';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-navy-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-700">
          {course.category}
        </span>
        <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
          {course.mode}
        </span>
      </div>
      <h3 className="text-lg font-bold text-navy-900">{course.name}</h3>
      {course.universityName && (
        <p className="mt-1 text-sm font-medium text-navy-600">
          Affiliated University: <span className="font-semibold">{course.universityName}</span>
        </p>
      )}
      <dl className="mt-3 space-y-1 text-sm text-navy-600">
        <div className="flex gap-2">
          <dt className="font-medium text-navy-800">Duration:</dt>
          <dd>{course.duration}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-navy-800">Eligibility:</dt>
          <dd>{course.eligibility}</dd>
        </div>
      </dl>
      <p className="mt-3 flex-1 text-sm text-navy-600">{course.description}</p>
      <Link
        href={`/contact?course=${encodeURIComponent(course.name)}`}
        className="mt-4 inline-block rounded-md bg-navy-800 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-navy-700"
      >
        Enquire About This Course
      </Link>
    </article>
  );
}
