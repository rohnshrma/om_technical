'use client';

import { useEffect, useState, useCallback } from 'react';
import type { BlogPost } from '@/lib/types';

type FormState = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  tags: string;
  status: 'draft' | 'published';
};

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  metaTitle: '',
  metaDescription: '',
  category: '',
  tags: '',
  status: 'draft',
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/blog');
    const { posts } = await res.json();
    setPosts((posts || []) as BlogPost[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function openNew() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError('');
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      category: post.category || '',
      tags: (post.tags || []).join(', '),
      status: post.status,
    });
    setSlugTouched(true);
    setError('');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      content: form.content,
      excerpt: form.excerpt.trim() || null,
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
      category: form.category.trim() || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
      status: form.status,
    };

    const res = form.id
      ? await fetch(`/api/admin/blog/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Could not save this post.');
      return;
    }
    setShowForm(false);
    fetchAll();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this blog post permanently?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    fetchAll();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Blog Posts</h1>
        <button
          onClick={openNew}
          className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
        >
          + New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-lg border border-navy-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-navy-900">{form.id ? 'Edit Post' : 'New Post'}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: slugTouched ? f.slug : slugify(title),
                  }));
                }}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Slug (URL) *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Guidance"
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy-800">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="distance education, UGC DEB"
                className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-navy-800">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-navy-800">Content (Markdown) *</label>
            <textarea
              required
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-md border border-navy-200 px-3 py-2 font-mono text-sm"
            />
          </div>

          <div className="rounded-md border border-navy-100 bg-navy-50 p-4">
            <h3 className="text-sm font-bold text-navy-800">SEO Fields</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-800">Meta Title</label>
                <input
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  maxLength={70}
                  className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-800">Meta Description</label>
                <input
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  maxLength={160}
                  className="w-full rounded-md border border-navy-200 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-navy-400">{form.metaDescription.length}/160 characters</p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-navy-800">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              className="rounded-md border border-navy-200 px-3 py-2 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Post'}
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
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Slug</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {loading && <tr><td colSpan={4} className="px-4 py-6 text-center text-navy-400">Loading...</td></tr>}
            {!loading && posts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-navy-400">No posts yet.</td></tr>
            )}
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{post.title}</td>
                <td className="px-4 py-3 text-navy-500">/{post.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-500'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="space-x-3 px-4 py-3">
                  <button onClick={() => openEdit(post)} className="text-xs font-semibold text-navy-700 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="text-xs font-semibold text-red-600 hover:underline">
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
