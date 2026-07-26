import type { WithId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { Testimonial } from '@/lib/types';

export type TestimonialDoc = {
  studentName: string;
  course: string | null;
  quote: string;
  rating: number;
  photoUrl: string | null;
  featured: boolean;
  createdAt: Date;
};

export async function getTestimonialCollection() {
  const db = await getDb();
  return db.collection<TestimonialDoc>('testimonials');
}

export function mapTestimonial(doc: WithId<TestimonialDoc>): Testimonial {
  return {
    id: doc._id.toString(),
    studentName: doc.studentName,
    course: doc.course,
    quote: doc.quote,
    rating: doc.rating,
    photoUrl: doc.photoUrl,
    featured: doc.featured,
    createdAt: doc.createdAt.toISOString(),
  };
}
