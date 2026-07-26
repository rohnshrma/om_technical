import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getBlogPostCollection, mapBlogPost } from '@/lib/models/blogPost';
import JsonLd from '@/components/JsonLd';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema';
import { BUSINESS } from '@/lib/constants';
import type { BlogPost } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const collection = await getBlogPostCollection();
    const docs = await collection.find({ status: 'published' }).project({ slug: 1 }).toArray();
    return docs.map((post) => ({ slug: post.slug }));
  } catch {
    // Database unreachable at build time — pages will render on-demand instead.
    return [];
  }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const collection = await getBlogPostCollection();
    const doc = await collection.findOne({ slug, status: 'published' });
    return doc ? mapBlogPost(doc) : null;
  } catch (e) {
    console.error('Failed to load blog post from MongoDB:', e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.siteUrl },
          { name: 'Blog', url: `${BUSINESS.siteUrl}/blog` },
          { name: post.title, url: `${BUSINESS.siteUrl}/blog/${post.slug}` },
        ])}
      />

      <nav className="text-sm text-navy-500">
        <Link href="/blog" className="hover:text-gold-600">&larr; Back to Blog</Link>
      </nav>

      <header className="mt-4">
        {post.category && (
          <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-700">
            {post.category}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-extrabold text-navy-900 sm:text-4xl">{post.title}</h1>
        {post.publishedAt && (
          <p className="mt-2 text-sm text-navy-500">
            Published {new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </header>

      <div className="prose-blog mt-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-navy-100 pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-gold-200 bg-gold-50 p-6 text-center">
        <p className="font-semibold text-navy-900">Have questions about your admission options?</p>
        <Link
          href="/contact"
          className="mt-3 inline-block rounded-md bg-navy-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
        >
          Get Free Guidance
        </Link>
      </div>
    </article>
  );
}
