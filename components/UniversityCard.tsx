import Image from 'next/image';
import type { University, Course } from '@/lib/types';

export default function UniversityCard({
  university,
  courses,
}: {
  university: University;
  courses: Course[];
}) {
  return (
    <article
      id={university.id}
      className="rounded-lg border border-navy-100 bg-white p-6 shadow-sm"
      itemScope
      itemType="https://schema.org/CollegeOrUniversity"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {university.logoUrl && (
            <Image
              src={university.logoUrl}
              alt={`${university.name} logo — ${university.recognition || 'university affiliation'} partner of OM Technical`}
              width={56}
              height={56}
              className="rounded-md border border-navy-100 object-contain"
            />
          )}
          <div>
            <h3 className="text-xl font-bold text-navy-900" itemProp="name">
              {university.name}
            </h3>
            {university.shortName && (
              <p className="text-sm font-medium text-navy-500">({university.shortName})</p>
            )}
          </div>
        </div>
        {university.recognition && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {university.recognition}
          </span>
        )}
      </div>

      {university.description && (
        <p className="mt-3 text-sm text-navy-600" itemProp="description">
          {university.description}
        </p>
      )}

      {courses.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-navy-800">Courses Offered Through This Affiliation</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {courses.map((c) => (
              <li
                key={c.id}
                className="rounded-md bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700"
              >
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {university.website && (
        <a
          href={university.website}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 inline-block text-sm font-semibold text-navy-700 underline hover:text-gold-600"
        >
          Visit Official University Website
        </a>
      )}
    </article>
  );
}
