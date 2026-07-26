import { NextResponse } from 'next/server';
import { getTestimonialCollection, mapTestimonial } from '@/lib/models/testimonial';

export const dynamic = 'force-dynamic';

export async function GET() {
  const collection = await getTestimonialCollection();
  const docs = await collection.find().sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ testimonials: docs.map(mapTestimonial) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.studentName || !body.quote || !body.rating) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const collection = await getTestimonialCollection();
  const { insertedId } = await collection.insertOne({
    studentName: String(body.studentName).trim(),
    course: body.course ? String(body.course).trim() : null,
    quote: String(body.quote).trim(),
    rating: Math.min(5, Math.max(1, Number(body.rating))),
    photoUrl: body.photoUrl ? String(body.photoUrl).trim() : null,
    featured: body.featured !== false,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
}
