import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPostCollection, mapBlogPost } from '@/lib/models/blogPost';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { BUSINESS } from '@/lib/constants';
import type { BlogPost } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — Admission Guidance, UGC-DEB Approvals & Distance Education Insights',
  description:
    'Read our guides on distance vs regular degrees, UGC-DEB approved universities, and how to avoid admission fraud — from Gurugram\'s trusted education consultancy since 2006.',
  alternates: { canonical: '/blog' },
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const collection = await getBlogPostCollection();
    const docs = await collection.find({ status: 'published' }).sort({ publishedAt: -1 }).toArray();
    return docs.map(mapBlogPost);
  } catch (e) {
    console.error('Failed to load blog posts from MongoDB:', e);
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'Blog', url: `${BUSINESS.siteUrl}/blog` },
        ])}
      />

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
          Admission Guidance &amp; Distance Education Insights
        </h1>
        <p className="mt-3 text-navy-600">
          Honest, well-researched articles to help you make informed admission decisions.
        </p>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-navy-100 bg-white p-5 shadow-sm">
            {post.category && (
              <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-700">
                {post.category}
              </span>
            )}
            <h2 className="mt-2 text-lg font-bold text-navy-900">
              <Link href={`/blog/${post.slug}`} className="hover:text-gold-600">
                {post.title}
              </Link>
            </h2>
            {post.excerpt && <p className="mt-2 text-sm text-navy-600">{post.excerpt}</p>}
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block text-sm font-semibold text-navy-700 underline hover:text-gold-600"
            >
              Read More &rarr;
            </Link>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-navy-500">Blog posts are coming soon.</p>
        )}
      </div>
    </div>
  );
}
