import { ObjectId, type WithId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { Course } from '@/lib/types';

export type CourseDoc = {
  name: string;
  category: string;
  mode: string;
  universityId: ObjectId | null;
  duration: string;
  eligibility: string;
  description: string;
  active: boolean;
  createdAt: Date;
};

export async function getCourseCollection() {
  const db = await getDb();
  return db.collection<CourseDoc>('courses');
}

export function mapCourse(doc: WithId<CourseDoc>, universityName?: string | null): Course {
  return {
    id: doc._id.toString(),
    name: doc.name,
    category: doc.category,
    mode: doc.mode,
    universityId: doc.universityId ? doc.universityId.toString() : null,
    universityName: universityName ?? null,
    duration: doc.duration,
    eligibility: doc.eligibility,
    description: doc.description,
    active: doc.active,
    createdAt: doc.createdAt.toISOString(),
  };
}
