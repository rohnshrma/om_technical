'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on route change, and stop background scroll while open.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-800 text-lg font-bold text-gold-300">
            OM
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold text-navy-900 sm:text-base">
              <span className="lg:hidden">OM Technical</span>
              <span className="hidden lg:inline">{BUSINESS.name}</span>
            </span>
            <span className="block text-xs font-medium text-gold-600">
              Serving students since {BUSINESS.foundedYear}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 ${
                isActive(link.href)
                  ? 'text-navy-900'
                  : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-gold-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:+91${BUSINESS.phone}`}
            className="hidden whitespace-nowrap rounded-md border border-navy-200 px-3 py-2 text-sm font-semibold text-navy-800 hover:border-navy-400 xl:inline-block"
          >
            Call {BUSINESS.phone}
          </a>
          <Link
            href="/contact"
            className="hidden rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-400 sm:inline-block"
          >
            Free Guidance
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-200 text-navy-800 lg:hidden"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-navy-100 bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${
          menuOpen ? 'max-h-[28rem]' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col px-4 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-3 text-base font-medium ${
                isActive(link.href) ? 'bg-navy-50 text-navy-900' : 'text-navy-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-navy-50 px-4 py-4">
          <a
            href={`tel:+91${BUSINESS.phone}`}
            className="rounded-md border border-navy-200 px-4 py-2.5 text-center text-sm font-semibold text-navy-800"
          >
            Call {BUSINESS.phone}
          </a>
          <Link
            href="/contact"
            className="rounded-md bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-900"
          >
            Free Guidance
          </Link>
        </div>
      </div>
    </header>
  );
}
