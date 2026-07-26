import type { WithId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { BlogPost } from '@/lib/types';

export type BlogPostDoc = {
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
  publishedAt: Date | null;
  createdAt: Date;
};

export async function getBlogPostCollection() {
  const db = await getDb();
  return db.collection<BlogPostDoc>('blogPosts');
}

export function mapBlogPost(doc: WithId<BlogPostDoc>): BlogPost {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    excerpt: doc.excerpt,
    featuredImage: doc.featuredImage,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    status: doc.status,
    category: doc.category,
    tags: doc.tags,
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    createdAt: doc.createdAt.toISOString(),
  };
}
