'use client';

import { useEffect, useState, useCallback } from 'react';
import type { University } from '@/lib/types';

type FormState = {
  id?: string;
  name: string;
  shortName: string;
  recognition: string;
  logoUrl: string;
  website: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  shortName: '',
  recognition: '',
  logoUrl: '',
  website: '',
  description: '',
};

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/universities');
    const { universities } = await res.json();
    setUniversities((universities || []) as University[]);
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

  function openEdit(u: University) {
    setForm({
      id: u.id,
      name: u.name,
      shortName: u.shortName || '',
      recognition: u.recognition || '',
      logoUrl: u.logoUrl || '',
      website: u.website || '',
      description: u.description || '',
    });
    setError('');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      shortName: form.shortName.trim() || null,
      recognition: form.recognition.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      website: form.website.trim() || null,
      description: form.description.trim() || null,
    };

    const res = form.id
      ? await fetch(`/api/admin/universities/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/universities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not save this university.');
      return;
    }
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this university permanently? Courses linked to it will keep the old reference.')) return;
    await fetch(`/api/admin/universities/${id}`, { method: 'DELETE' });
    fetchAll();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Universities</h1>
        <button
          onClick={openNew}
          className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          + Add University
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-navy-900">{form.id ? 'Edit University' : 'New University'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Short Name</label>
              <input
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                placeholder="e.g. IGNOU"
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Recognition</label>
              <input
                value={form.recognition}
                onChange={(e) => setForm({ ...form, recognition: e.target.value })}
                placeholder="e.g. UGC-DEB Approved, NAAC A+"
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-navy-800">Logo URL (optional)</label>
              <input
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://... (upload to a free image host, e.g. Cloudinary)"
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy-800">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save University'}
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
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Recognition</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {loading && <tr><td colSpan={3} className="px-4 py-6 text-center text-navy-400">Loading...</td></tr>}
            {!loading && universities.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-navy-400">No universities yet.</td></tr>
            )}
            {universities.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-navy-900">
                  {u.name} {u.shortName && <span className="text-navy-400">({u.shortName})</span>}
                </td>
                <td className="px-4 py-3 text-navy-600">{u.recognition || '—'}</td>
                <td className="space-x-3 px-4 py-3">
                  <button onClick={() => openEdit(u)} className="text-xs font-semibold text-navy-700 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-xs font-semibold text-red-600 hover:underline">
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
