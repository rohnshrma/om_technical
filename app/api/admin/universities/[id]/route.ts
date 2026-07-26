import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUniversityCollection } from '@/lib/models/university';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  for (const field of ['name', 'shortName', 'recognition', 'logoUrl', 'website', 'description'] as const) {
    if (field in body) update[field] = body[field] ? String(body[field]).trim() : null;
  }

  const collection = await getUniversityCollection();
  const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: update });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'University not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const collection = await getUniversityCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'University not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
