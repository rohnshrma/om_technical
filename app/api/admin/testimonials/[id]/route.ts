import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getTestimonialCollection } from '@/lib/models/testimonial';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.studentName === 'string') update.studentName = body.studentName.trim();
  if ('course' in body) update.course = body.course ? String(body.course).trim() : null;
  if (typeof body.quote === 'string') update.quote = body.quote.trim();
  if (body.rating) update.rating = Math.min(5, Math.max(1, Number(body.rating)));
  if ('photoUrl' in body) update.photoUrl = body.photoUrl ? String(body.photoUrl).trim() : null;
  if (typeof body.featured === 'boolean') update.featured = body.featured;

  const collection = await getTestimonialCollection();
  const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: update });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const collection = await getTestimonialCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
