'use client';

import { useState } from 'react';

type Props = {
  courseOptions?: string[];
  defaultCourse?: string;
  compact?: boolean;
};

export default function LeadForm({ courseOptions = [], defaultCourse, compact }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''),
      phone: String(data.get('phone') || ''),
      email: String(data.get('email') || ''),
      course_interested: String(data.get('course_interested') || ''),
      message: String(data.get('message') || ''),
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">Thank you! Your enquiry has been received.</p>
        <p className="mt-1 text-sm text-green-700">
          Our counsellor will contact you shortly. For an immediate response, use the WhatsApp button.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-navy-800">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-navy-800">
            Phone Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            pattern="[0-9+\-\s]{7,15}"
            className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
            placeholder="10-digit mobile number"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-navy-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="course_interested" className="mb-1 block text-sm font-medium text-navy-800">
            Course Interested In
          </label>
          {courseOptions.length > 0 ? (
            <select
              id="course_interested"
              name="course_interested"
              defaultValue={defaultCourse || ''}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
            >
              <option value="">Select a course</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <input
              id="course_interested"
              name="course_interested"
              defaultValue={defaultCourse}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
              placeholder="e.g. MBA, BCA"
            />
          )}
        </div>
      </div>

      {!compact && (
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-navy-800">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none"
            placeholder="Tell us a bit about your admission query"
          />
        </div>
      )}

      {status === 'error' && (
        <p className="text-sm font-medium text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-md bg-navy-800 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting...' : 'Get Free Admission Guidance'}
      </button>
      <p className="text-center text-xs text-navy-400">
        We respect your privacy. No spam, no fee is charged for this enquiry.
      </p>
    </form>
  );
}
