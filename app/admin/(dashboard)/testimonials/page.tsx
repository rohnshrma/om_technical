'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Testimonial } from '@/lib/types';

type FormState = {
  id?: string;
  studentName: string;
  course: string;
  quote: string;
  rating: number;
  photoUrl: string;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  studentName: '',
  course: '',
  quote: '',
  rating: 5,
  photoUrl: '',
  featured: true,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/testimonials');
    const { testimonials } = await res.json();
    setTestimonials((testimonials || []) as Testimonial[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function openNew() {
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setForm({
      id: t.id,
      studentName: t.studentName,
      course: t.course || '',
      quote: t.quote,
      rating: t.rating,
      photoUrl: t.photoUrl || '',
      featured: t.featured,
    });
    setError('');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      studentName: form.studentName.trim(),
      course: form.course.trim() || null,
      quote: form.quote.trim(),
      rating: form.rating,
      photoUrl: form.photoUrl.trim() || null,
      featured: form.featured,
    };

    const res = form.id
      ? await fetch(`/api/admin/testimonials/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not save this testimonial.');
      return;
    }
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial permanently?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchAll();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Testimonials</h1>
        <button
          onClick={openNew}
          className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          + Add Testimonial
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-navy-900">{form.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Student Name *</label>
              <input
                required
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Course</label>
              <input
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                placeholder="e.g. MBA (Distance)"
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Rating (1–5) *</label>
              <input
                required
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Photo URL (optional)</label>
              <input
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy-800">Quote *</label>
            <textarea
              required
              rows={3}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured (visible on public site)
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-navy-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-navy-100 text-sm">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Student</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Course</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Rating</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Featured</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-navy-400">Loading...</td></tr>}
            {!loading && testimonials.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-navy-400">No testimonials yet.</td></tr>
            )}
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{t.studentName}</td>
                <td className="px-4 py-3 text-navy-600">{t.course || '—'}</td>
                <td className="px-4 py-3 text-navy-600">{t.rating} / 5</td>
                <td className="px-4 py-3 text-navy-600">{t.featured ? 'Yes' : 'No'}</td>
                <td className="space-x-3 px-4 py-3">
                  <button onClick={() => openEdit(t)} className="text-xs font-semibold text-navy-700 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
