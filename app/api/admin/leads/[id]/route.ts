import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getLeadCollection } from '@/lib/models/lead';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['New', 'Contacted', 'Converted', 'Lost'];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const collection = await getLeadCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: body.status } }
  );
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const collection = await getLeadCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
