import Image from 'next/image';
import type { Testimonial } from '@/lib/types';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? 'fill-gold-500' : 'fill-navy-100'}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.74.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="flex h-full flex-col rounded-lg border border-navy-100 bg-white p-6 shadow-sm"
      itemScope
      itemType="https://schema.org/Review"
    >
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-3 flex-1 text-sm italic text-navy-700" itemProp="reviewBody">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <footer className="mt-4 flex items-center gap-3 border-t border-navy-50 pt-3">
        {testimonial.photoUrl && (
          <Image
            src={testimonial.photoUrl}
            alt={`${testimonial.studentName}, student who completed ${testimonial.course || 'a course'} with guidance from OM Technical`}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-navy-900" itemProp="author">
            {testimonial.studentName}
          </p>
          {testimonial.course && (
            <p className="text-xs text-navy-500">{testimonial.course}</p>
          )}
        </div>
      </footer>
    </article>
  );
}
