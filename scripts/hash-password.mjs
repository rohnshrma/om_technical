// Generates a bcrypt hash for the admin password.
// Usage: npm run hash-password -- "YourStrongPassword123"

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "YourStrongPassword123"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const escapedForDotenv = hash.replace(/\$/g, '\\$');

console.log(`
For Vercel (Project -> Settings -> Environment Variables) — paste as-is:
  ADMIN_PASSWORD_HASH=${hash}

For a local .env.local file — escape the $ signs, or Next.js's env loader
will try to interpolate them as variables and silently truncate the hash:
  ADMIN_PASSWORD_HASH=${escapedForDotenv}
`);
