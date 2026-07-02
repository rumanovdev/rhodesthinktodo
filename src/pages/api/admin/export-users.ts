import type { APIRoute } from 'astro';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getServiceClient } from '../../../lib/supabase/admin';
import { getAdminUsers } from '../../../lib/admin/users';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.isAdmin) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });
  const admin = getServiceClient();
  if (!admin) return new Response('Service client not configured', { status: 500 });

  const category = url.searchParams.get('category') ?? undefined;
  const q = url.searchParams.get('q') ?? undefined;
  const format = (url.searchParams.get('format') ?? 'pdf').toLowerCase();

  const users = await getAdminUsers(admin, { category, q });
  const stamp = new Date().toISOString().slice(0, 10);
  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString('en-GB') : '');

  if (format === 'csv') {
    const escCsv = (s: string) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const head = ['Name', 'Email', 'Phone', 'Location', 'Listings', 'Categories', 'Admin', 'Joined'];
    const lines = [head.join(',')];
    for (const u of users) {
      lines.push([u.name, u.email, u.phone, u.location, String(u.listings), u.categories.join('; '), u.isAdmin ? 'yes' : 'no', fmtDate(u.joined)].map(escCsv).join(','));
    }
    return new Response('﻿' + lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="rhodesthingstodo-users-${stamp}.csv"`,
      },
    });
  }

  // PDF (landscape A4 table)
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFontSize(16);
  doc.text('Rhodes Things To Do — Registered Users', 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(120);
  const filterBits = [category ? `category: ${category}` : null, q ? `search: "${q}"` : null].filter(Boolean).join(' · ');
  doc.text(`Exported ${stamp} · ${users.length} user${users.length === 1 ? '' : 's'}${filterBits ? ' · ' + filterBits : ''}`, 40, 58);

  autoTable(doc, {
    startY: 74,
    head: [['Name', 'Email', 'Phone', 'Location', 'Listings', 'Categories', 'Admin', 'Joined']],
    body: users.map((u) => [u.name, u.email, u.phone, u.location, String(u.listings), u.categories.join(', '), u.isAdmin ? 'yes' : '', fmtDate(u.joined)]),
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [225, 29, 72] },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: { 4: { halign: 'center' }, 6: { halign: 'center' } },
  });

  const buf = Buffer.from(doc.output('arraybuffer'));
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="rhodesthingstodo-users-${stamp}.pdf"`,
    },
  });
};
