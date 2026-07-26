export type Course = {
  id: string;
  name: string;
  category: string;
  mode: string;
  universityId: string | null;
  universityName?: string | null;
  duration: string;
  eligibility: string;
  description: string;
  active: boolean;
  createdAt: string;
};

export type University = {
  id: string;
  name: string;
  shortName: string | null;
  recognition: string | null;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  studentName: string;
  course: string | null;
  quote: string;
  rating: number;
  photoUrl: string | null;
  featured: boolean;
  createdAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: 'draft' | 'published';
  category: string | null;
  tags: string[] | null;
  publishedAt: string | null;
  createdAt: string;
};

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Lost';

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  courseInterested: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
};
