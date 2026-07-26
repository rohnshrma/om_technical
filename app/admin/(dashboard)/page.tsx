'use client';

import { useEffect, useState, useCallback } from 'react';
import { LEAD_STATUSES } from '@/lib/constants';
import type { Lead } from '@/lib/types';

function toCsv(leads: Lead[]) {
  const header = ['Name', 'Phone', 'Email', 'Course Interested', 'Message', 'Status', 'Date'];
  const rows = leads.map((l) => [
    l.name,
    l.phone,
    l.email || '',
    l.courseInterested || '',
    (l.message || '').replace(/\n/g, ' '),
    l.status,
    new Date(l.createdAt).toLocaleString('en-IN'),
  ]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [header, ...rows].map((row) => row.map(escape).join(',')).join('\n');
}

export default function LeadsInboxPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/leads');
    const { leads } = await res.json();
    setLeads((leads || []) as Lead[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function updateStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: status as Lead['status'] } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead permanently?')) return;
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  function handleExport() {
    const csv = toCsv(filteredLeads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredLeads = filter === 'All' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Leads Inbox</h1>
          <p className="text-sm text-navy-500">{leads.length} total enquiries received</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-navy-200 px-3 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="rounded-md bg-navy-800 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-navy-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-navy-100 text-sm">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Course Interested</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Message</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-navy-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {loading && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-navy-400">Loading leads...</td></tr>
            )}
            {!loading && filteredLeads.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-navy-400">No leads found.</td></tr>
            )}
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{lead.name}</td>
                <td className="px-4 py-3 text-navy-600">
                  <div>{lead.phone}</div>
                  {lead.email && <div className="text-xs text-navy-400">{lead.email}</div>}
                </td>
                <td className="px-4 py-3 text-navy-600">{lead.courseInterested || '—'}</td>
                <td className="max-w-xs truncate px-4 py-3 text-navy-600" title={lead.message || ''}>
                  {lead.message || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-navy-500">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="rounded-md border border-navy-200 px-2 py-1 text-xs"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
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
