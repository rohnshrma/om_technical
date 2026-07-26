import type { WithId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { Lead, LeadStatus } from '@/lib/types';

export type LeadDoc = {
  name: string;
  phone: string;
  email: string | null;
  courseInterested: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: Date;
};

export async function getLeadCollection() {
  const db = await getDb();
  return db.collection<LeadDoc>('leads');
}

export function mapLead(doc: WithId<LeadDoc>): Lead {
  return {
    id: doc._id.toString(),
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    courseInterested: doc.courseInterested,
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  };
}
