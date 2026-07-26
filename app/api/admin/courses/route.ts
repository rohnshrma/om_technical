import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCourseCollection, mapCourse } from '@/lib/models/course';
import { getUniversityCollection } from '@/lib/models/university';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [courses, universities] = await Promise.all([
    (await getCourseCollection()).find().sort({ createdAt: -1 }).toArray(),
    (await getUniversityCollection()).find().toArray(),
  ]);

  const universityNameById = new Map(universities.map((u) => [u._id.toString(), u.name]));

  const result = courses.map((c) =>
    mapCourse(c, c.universityId ? universityNameById.get(c.universityId.toString()) : null)
  );

  return NextResponse.json({ courses: result });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.name || !body.category || !body.mode || !body.duration || !body.eligibility || !body.description) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const collection = await getCourseCollection();
  const { insertedId } = await collection.insertOne({
    name: String(body.name).trim(),
    category: String(body.category),
    mode: String(body.mode),
    universityId: body.universityId ? new ObjectId(String(body.universityId)) : null,
    duration: String(body.duration).trim(),
    eligibility: String(body.eligibility).trim(),
    description: String(body.description).trim(),
    active: body.active !== false,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
}
