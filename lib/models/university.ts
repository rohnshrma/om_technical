import type { WithId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { University } from '@/lib/types';

export type UniversityDoc = {
  name: string;
  shortName: string | null;
  recognition: string | null;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  createdAt: Date;
};

export async function getUniversityCollection() {
  const db = await getDb();
  return db.collection<UniversityDoc>('universities');
}

export function mapUniversity(doc: WithId<UniversityDoc>): University {
  return {
    id: doc._id.toString(),
    name: doc.name,
    shortName: doc.shortName,
    recognition: doc.recognition,
    logoUrl: doc.logoUrl,
    website: doc.website,
    description: doc.description,
    createdAt: doc.createdAt.toISOString(),
  };
}
