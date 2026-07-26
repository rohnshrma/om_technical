import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCourseCollection } from '@/lib/models/course';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  for (const field of ['name', 'category', 'mode', 'duration', 'eligibility', 'description'] as const) {
    if (typeof body[field] === 'string') update[field] = body[field].trim();
  }
  if (typeof body.active === 'boolean') update.active = body.active;
  if ('universityId' in body) {
    update.universityId = body.universityId ? new ObjectId(String(body.universityId)) : null;
  }

  const collection = await getCourseCollection();
  const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: update });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const collection = await getCourseCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
