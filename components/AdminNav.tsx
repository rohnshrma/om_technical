'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Leads Inbox' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/universities', label: 'Universities' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/blog', label: 'Blog Posts' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-b border-navy-100 bg-navy-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-white">OM Technical — Admin</span>
          <nav className="flex flex-wrap gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href ? 'text-gold-400' : 'text-navy-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-xs text-navy-300 hover:text-white">
            View Live Site &rarr;
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-md border border-navy-600 px-3 py-1.5 text-xs font-semibold text-navy-100 hover:border-navy-400"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
