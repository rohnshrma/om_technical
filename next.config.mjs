/** @type {import('next').NextConfig} */
const nextConfig = {
  // The mongodb driver's optional native dependencies (kerberos, snappy, etc.)
  // confuse webpack's dependency analysis and can hang the build. Keeping it
  // external means Node's own `require` loads it at runtime instead.
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
    // Small site (~18 pages) — a single build worker avoids spawning several
    // heavy parallel workers for negligible gain, and is kinder to
    // memory-constrained CI/build environments.
    cpus: 1,
  },
  webpack: (config) => {
    config.externals.push(
      'mongodb-client-encryption',
      'aws4',
      'snappy',
      'kerberos',
      '@mongodb-js/zstd',
      '@aws-sdk/credential-providers',
      'gcp-metadata',
      'socks',
      'bson-ext'
    );
    return config;
  },
  images: {
    // Add any domain you host university logos / testimonial photos on.
    // Cloudinary's free tier is the recommended zero-cost option — see README.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
