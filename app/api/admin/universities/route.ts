import { NextResponse } from 'next/server';
import { getUniversityCollection, mapUniversity } from '@/lib/models/university';

export async function GET() {
  const collection = await getUniversityCollection();
  const docs = await collection.find().sort({ name: 1 }).toArray();
  return NextResponse.json({ universities: docs.map(mapUniversity) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.name) {
    return NextResponse.json({ error: 'University name is required.' }, { status: 400 });
  }

  const collection = await getUniversityCollection();
  const { insertedId } = await collection.insertOne({
    name: String(body.name).trim(),
    shortName: body.shortName ? String(body.shortName).trim() : null,
    recognition: body.recognition ? String(body.recognition).trim() : null,
    logoUrl: body.logoUrl ? String(body.logoUrl).trim() : null,
    website: body.website ? String(body.website).trim() : null,
    description: body.description ? String(body.description).trim() : null,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
}
