import type { MetadataRoute } from 'next';
import { getBlogPostCollection } from '@/lib/models/blogPost';
import { BUSINESS } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BUSINESS.siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BUSINESS.siteUrl}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BUSINESS.siteUrl}/universities`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BUSINESS.siteUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BUSINESS.siteUrl}/testimonials`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BUSINESS.siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BUSINESS.siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
  ];

  try {
    const collection = await getBlogPostCollection();
    const posts = await collection
      .find({ status: 'published' })
      .project({ slug: 1, publishedAt: 1 })
      .toArray();

    const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${BUSINESS.siteUrl}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (e) {
    console.error('Failed to load blog posts for sitemap:', e);
    return staticRoutes;
  }
}
