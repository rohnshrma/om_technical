'use client';

import { useEffect, useState, useCallback } from 'react';
import { COURSE_CATEGORIES, COURSE_MODES } from '@/lib/constants';
import type { Course, University } from '@/lib/types';

type FormState = {
  id?: string;
  name: string;
  category: string;
  mode: string;
  universityId: string;
  duration: string;
  eligibility: string;
  description: string;
  active: boolean;
};

const EMPTY_FORM: FormState = {
  name: '',
  category: COURSE_CATEGORIES[0],
  mode: COURSE_MODES[0],
  universityId: '',
  duration: '',
  eligibility: '',
  description: '',
  active: true,
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [coursesRes, universitiesRes] = await Promise.all([
      fetch('/api/admin/courses'),
      fetch('/api/admin/universities'),
    ]);
    const { courses } = await coursesRes.json();
    const { universities } = await universitiesRes.json();
    setCourses((courses || []) as Course[]);
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

  function openEdit(course: Course) {
    setForm({
      id: course.id,
      name: course.name,
      category: course.category,
      mode: course.mode,
      universityId: course.universityId || '',
      duration: course.duration,
      eligibility: course.eligibility,
      description: course.description,
      active: course.active,
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
      category: form.category,
      mode: form.mode,
      universityId: form.universityId || null,
      duration: form.duration.trim(),
      eligibility: form.eligibility.trim(),
      description: form.description.trim(),
      active: form.active,
    };

    const res = form.id
      ? await fetch(`/api/admin/courses/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not save this course.');
      return;
    }
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this course permanently?')) return;
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    fetchAll();
  }

  async function toggleActive(course: Course) {
    await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !course.active }),
    });
    fetchAll();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Courses</h1>
        <button
          onClick={openNew}
          className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          + Add Course
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-navy-900">{form.id ? 'Edit Course' : 'New Course'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Course Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">University</label>
              <select
                value={form.universityId}
                onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              >
                <option value="">— None —</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              >
                {COURSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Mode *</label>
              <select
                required
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              >
                {COURSE_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Duration *</label>
              <input
                required
                placeholder="e.g. 3 Years"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Eligibility *</label>
              <input
                required
                placeholder="e.g. 10+2 from a recognized board"
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy-800">Description *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active (visible on public site)
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Course'}
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
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Category / Mode</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">University</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-navy-400">Loading...</td></tr>}
            {!loading && courses.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-navy-400">No courses yet.</td></tr>
            )}
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{course.name}</td>
                <td className="px-4 py-3 text-navy-600">{course.category} / {course.mode}</td>
                <td className="px-4 py-3 text-navy-600">{course.universityName || '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(course)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      course.active ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-500'
                    }`}
                  >
                    {course.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="space-x-3 px-4 py-3">
                  <button onClick={() => openEdit(course)} className="text-xs font-semibold text-navy-700 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="text-xs font-semibold text-red-600 hover:underline">
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
