import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getBlogPostCollection } from '@/lib/models/blogPost';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });

  const collection = await getBlogPostCollection();

  if (typeof body.slug === 'string') {
    const existing = await collection.findOne({ slug: body.slug, _id: { $ne: new ObjectId(params.id) } });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists.' }, { status: 409 });
    }
  }

  const update: Record<string, unknown> = {};
  for (const field of ['title', 'slug', 'content', 'excerpt', 'featuredImage', 'metaTitle', 'metaDescription', 'category'] as const) {
    if (field in body) update[field] = body[field] ? String(body[field]) : null;
  }
  if (Array.isArray(body.tags)) update.tags = body.tags;
  if (body.status === 'published' || body.status === 'draft') {
    update.status = body.status;
    update.publishedAt = body.status === 'published' ? new Date() : null;
  }

  const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: update });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const collection = await getBlogPostCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(params.id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
