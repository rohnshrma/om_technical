import type { Metadata } from 'next';
import { getTestimonialCollection, mapTestimonial } from '@/lib/models/testimonial';
import TestimonialCard from '@/components/TestimonialCard';
import JsonLd from '@/components/JsonLd';
import { aggregateRatingSchema, breadcrumbSchema } from '@/lib/schema';
import { BUSINESS } from '@/lib/constants';
import type { Testimonial } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Student Testimonials & Success Stories',
  description:
    'Read genuine testimonials from students who received honest distance and regular degree admission guidance from OM Technical, Gurugram, since 2006.',
  alternates: { canonical: '/testimonials' },
};

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const collection = await getTestimonialCollection();
    const docs = await collection.find({ featured: true }).sort({ createdAt: -1 }).toArray();
    return docs.map(mapTestimonial);
  } catch (e) {
    console.error('Failed to load testimonials from MongoDB:', e);
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'Testimonials', url: `${BUSINESS.siteUrl}/testimonials` },
        ])}
      />
      {testimonials.length > 0 && (
        <JsonLd data={aggregateRatingSchema(testimonials) as Record<string, unknown>} />
      )}

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
          Student Testimonials &amp; Success Stories
        </h1>
        <p className="mt-3 text-navy-600">
          Real feedback from students we have guided since {BUSINESS.foundedYear}.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
        {testimonials.length === 0 && (
          <p className="text-navy-500">Testimonials are being updated. Please check back soon.</p>
        )}
      </div>
    </div>
  );
}
