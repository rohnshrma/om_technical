import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-lg font-bold text-white">{BUSINESS.name}</h2>
          <p className="mt-2 text-sm text-navy-300">
            Trusted admission guidance for distance and regular degree courses —
            serving students since {BUSINESS.foundedYear}. {BUSINESS.yearsOfExperience}+ years
            of honest, on-ground counselling in Gurugram.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link href="/universities" className="hover:text-white">University Affiliations</Link></li>
            <li><Link href="/testimonials" className="hover:text-white">Student Testimonials</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog & Guidance</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact / Enquiry</Link></li>
            <li><Link href="/admin/login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Visit Our Office</h3>
          <address className="mt-3 space-y-1 text-sm not-italic text-navy-300">
            <p>{BUSINESS.address.line1}</p>
            <p>{BUSINESS.address.line2}</p>
            <p>{BUSINESS.address.landmark}</p>
            <p className="pt-2">
              <a href={`tel:+91${BUSINESS.phone}`} className="hover:text-white">
                +91 {BUSINESS.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">
                {BUSINESS.email}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-navy-800 px-4 py-4 text-center text-xs text-navy-400">
        &copy; {new Date().getFullYear()} {BUSINESS.name}. Established {BUSINESS.foundedYear}. All rights reserved.
        Guidance-only admission facilitation — we make no fee promises and no guaranteed-seat claims.
      </div>
    </footer>
  );
}
