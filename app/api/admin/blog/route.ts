import { NextResponse } from 'next/server';
import { getBlogPostCollection, mapBlogPost } from '@/lib/models/blogPost';

export const dynamic = 'force-dynamic';

export async function GET() {
  const collection = await getBlogPostCollection();
  const docs = await collection.find().sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ posts: docs.map(mapBlogPost) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.title || !body.slug || !body.content) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const collection = await getBlogPostCollection();

  const existing = await collection.findOne({ slug: body.slug });
  if (existing) {
    return NextResponse.json({ error: 'A post with this slug already exists.' }, { status: 409 });
  }

  const status = body.status === 'published' ? 'published' : 'draft';
  const { insertedId } = await collection.insertOne({
    title: String(body.title).trim(),
    slug: String(body.slug).trim(),
    content: String(body.content),
    excerpt: body.excerpt ? String(body.excerpt).trim() : null,
    featuredImage: body.featuredImage ? String(body.featuredImage).trim() : null,
    metaTitle: body.metaTitle ? String(body.metaTitle).trim() : null,
    metaDescription: body.metaDescription ? String(body.metaDescription).trim() : null,
    status,
    category: body.category ? String(body.category).trim() : null,
    tags: Array.isArray(body.tags) ? body.tags : null,
    publishedAt: status === 'published' ? new Date() : null,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
}
