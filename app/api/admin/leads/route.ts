import { NextResponse } from 'next/server';
import { getLeadCollection, mapLead } from '@/lib/models/lead';

export const dynamic = 'force-dynamic';

export async function GET() {
  const collection = await getLeadCollection();
  const docs = await collection.find().sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ leads: docs.map(mapLead) });
}
