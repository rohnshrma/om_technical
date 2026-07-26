import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/universities', label: 'Universities' },
  { href: '/about', label: 'About Us' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-800 text-lg font-bold text-gold-300">
            OM
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-navy-900 sm:text-base">
              {BUSINESS.name}
            </span>
            <span className="block text-xs font-medium text-gold-600">
              Serving students since {BUSINESS.foundedYear}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-700 hover:text-gold-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:+91${BUSINESS.phone}`}
            className="hidden rounded-md border border-navy-200 px-3 py-2 text-sm font-semibold text-navy-800 hover:border-navy-400 sm:inline-block"
          >
            Call {BUSINESS.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-400"
          >
            Free Guidance
          </Link>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto border-t border-navy-50 px-4 py-2 text-xs font-medium text-navy-600 lg:hidden">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
