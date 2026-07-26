import { BUSINESS } from '@/lib/constants';
import type { Course, Testimonial } from '@/lib/types';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: BUSINESS.name,
    alternateName: BUSINESS.shortName,
    foundingDate: `${BUSINESS.foundedYear}`,
    description:
      'Education consultancy and admission facilitation center for distance and regular degree courses across technical and management streams, serving students since ' +
      BUSINESS.foundedYear + '.',
    url: BUSINESS.siteUrl,
    telephone: BUSINESS.phoneIntl,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${BUSINESS.address.line1}, ${BUSINESS.address.landmark}`,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    founder: {
      '@type': 'Person',
      name: BUSINESS.owner,
    },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    image: `${BUSINESS.siteUrl}/logo.png`,
    telephone: BUSINESS.phoneIntl,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${BUSINESS.address.line1}, ${BUSINESS.address.landmark}`,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    url: BUSINESS.siteUrl,
    priceRange: '$$',
  };
}

export function courseSchema(course: Course) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: BUSINESS.name,
      sameAs: BUSINESS.siteUrl,
    },
    ...(course.universityName && {
      about: course.universityName,
    }),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: course.mode,
      courseWorkload: course.duration,
    },
  };
}

export function aggregateRatingSchema(testimonials: Testimonial[]) {
  if (testimonials.length === 0) return null;
  const avg =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: BUSINESS.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: testimonials.length,
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.studentName },
      reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.quote,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogPostingSchema(post: {
  title: string;
  metaDescription: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt || post.title,
    datePublished: post.publishedAt || undefined,
    author: { '@type': 'Person', name: BUSINESS.owner },
    publisher: { '@type': 'Organization', name: BUSINESS.name },
    mainEntityOfPage: `${BUSINESS.siteUrl}/blog/${post.slug}`,
  };
}
