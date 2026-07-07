// Branded HTML email templates. Everything is inline-styled (email clients
// ignore <style> blocks) and kept to a single 560px column so it renders the
// same in Gmail, Outlook and Apple Mail.

import { SITE, absUrl } from '../data/site';
import { esc } from './resend';

type Cta = { label: string; url: string };

/** Shared shell: logo header, white card, red CTA button, footer. */
export function emailShell(opts: {
  heading: string;
  intro?: string;
  bodyHtml?: string;
  cta?: Cta;
  footnote?: string;
}): string {
  const { heading, intro, bodyHtml, cta, footnote } = opts;
  return `
  <div style="background:#f6f7f9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto">
      <div style="text-align:center;padding:0 0 20px">
        <a href="${esc(SITE.url)}" style="font-size:22px;font-weight:bold;color:#1a1a1a;text-decoration:none">Rhodes<span style="color:#e11d48">Things</span>ToDo</a>
      </div>
      <div style="background:#ffffff;border-radius:16px;padding:32px 28px;color:#1a1a1a">
        <h2 style="margin:0 0 12px;font-size:20px;color:#1a1a1a">${esc(heading)}</h2>
        ${intro ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#444">${intro}</p>` : ''}
        ${bodyHtml ?? ''}
        ${cta ? `<div style="text-align:center;margin:24px 0 4px"><a href="${esc(cta.url)}" style="display:inline-block;background:#e11d48;color:#ffffff;font-weight:bold;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:999px">${esc(cta.label)}</a></div>` : ''}
      </div>
      <div style="text-align:center;padding:20px 8px;font-size:12px;color:#999;line-height:1.7">
        ${footnote ? `<p style="margin:0 0 8px">${footnote}</p>` : ''}
        <p style="margin:0">${esc(SITE.name)} · <a href="${esc(SITE.url)}" style="color:#999">rhodesthingstodo.com</a> · <a href="mailto:${esc(SITE.email)}" style="color:#999">${esc(SITE.email)}</a></p>
      </div>
    </div>
  </div>`;
}

/** Key/value rows. Values are raw HTML — callers esc() anything untrusted. */
export function detailsTable(rows: Array<[label: string, valueHtml: string]>): string {
  return `<table style="border-collapse:collapse;width:100%;font-size:14px;margin:8px 0">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#1a1a1a">${v}</td></tr>`
    )
    .join('')}</table>`;
}

export type EmailContent = { subject: string; html: string };

// --------------------------------------------------------------------------
// Booking request
// --------------------------------------------------------------------------

export type BookingEmailData = {
  listingTitle: string;
  listingUrl: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string | null;
  dates: string;
  guests: number;
  notes: string | null;
};

function bookingDetails(b: BookingEmailData): string {
  return detailsTable([
    ['Listing', `<a href="${esc(b.listingUrl)}" style="color:#e11d48">${esc(b.listingTitle)}</a>`],
    ['Name', esc(b.requesterName || '—')],
    ['Email', esc(b.requesterEmail || '—')],
    ['Phone', esc(b.requesterPhone || '—')],
    ['Dates', esc(b.dates)],
    ['Guests', esc(b.guests)],
    ['Notes', esc(b.notes || '—')],
  ]);
}

/** To the listing owner: a guest wants to book. */
export function bookingOwnerEmail(b: BookingEmailData): EmailContent {
  return {
    subject: `New booking request — ${b.listingTitle}`,
    html: emailShell({
      heading: 'You have a new booking request',
      intro: `<strong>${esc(b.requesterName || 'A visitor')}</strong> wants to book <strong>${esc(b.listingTitle)}</strong>. Simply reply to this email to reach them directly.`,
      bodyHtml: bookingDetails(b),
      cta: { label: 'View your listing', url: b.listingUrl },
      footnote: `You're receiving this because you own this listing on ${esc(SITE.name)}.`,
    }),
  };
}

/** To the guest: confirmation that the request reached the host. */
export function bookingGuestEmail(b: BookingEmailData): EmailContent {
  const first = b.requesterName.trim().split(/\s+/)[0] || '';
  return {
    subject: `We received your booking request — ${b.listingTitle}`,
    html: emailShell({
      heading: 'Your request has been sent',
      intro: `Thanks${first ? `, ${esc(first)}` : ''}! We've passed your request for <strong>${esc(b.listingTitle)}</strong> to the host — they will contact you directly to confirm your booking. Here's a copy of what you sent:`,
      bodyHtml: bookingDetails(b),
      cta: { label: 'View the listing', url: b.listingUrl },
      footnote: `You're receiving this because a booking request was sent from your address on ${esc(SITE.name)}.`,
    }),
  };
}

// --------------------------------------------------------------------------
// Welcome
// --------------------------------------------------------------------------

/** Sent once, right after an account is created. */
export function welcomeEmail(fullName?: string | null): EmailContent {
  const first = String(fullName ?? '').trim().split(/\s+/)[0] || '';
  return {
    subject: 'Welcome to Rhodes Things To Do!',
    html: emailShell({
      heading: `Welcome${first ? `, ${esc(first)}` : ''}!`,
      intro: `Your account is ready. ${esc(SITE.name)} is your local guide to the best restaurants, hotels, tours, beaches and activities across Rhodes — with real reviews from real visitors.`,
      bodyHtml: `
        <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.9;color:#444">
          <li>Browse top-rated places and save your favourites.</li>
          <li>Send free booking requests straight to the owners.</li>
          <li>Been somewhere great? Leave a review and help other travellers.</li>
          <li>Own a business in Rhodes? Add your listing in minutes.</li>
        </ul>`,
      cta: { label: 'Start exploring Rhodes', url: absUrl('/listings/') },
      footnote: `You're receiving this because an account was created with this address on ${esc(SITE.name)}. If it wasn't you, reply to this email.`,
    }),
  };
}

// --------------------------------------------------------------------------
// New review
// --------------------------------------------------------------------------

export type ReviewEmailData = {
  listingTitle: string;
  listingUrl: string;
  reviewerName: string;
  rating: number; // 1..5
  body: string;
  isUpdate: boolean;
};

/** To the listing owner: someone reviewed their listing. */
export function reviewOwnerEmail(r: ReviewEmailData): EmailContent {
  const stars = '★'.repeat(r.rating) + '☆'.repeat(Math.max(0, 5 - r.rating));
  return {
    subject: `${r.isUpdate ? 'Updated' : 'New'} ${r.rating}-star review — ${r.listingTitle}`,
    html: emailShell({
      heading: r.isUpdate ? 'A review was updated' : 'You have a new review',
      intro: `<strong>${esc(r.reviewerName || 'A visitor')}</strong> ${r.isUpdate ? 'updated their review of' : 'just reviewed'} <strong>${esc(r.listingTitle)}</strong>:`,
      bodyHtml: `
        <div style="margin:8px 0 4px;font-size:18px;color:#f5a623;letter-spacing:2px">${stars}</div>
        <blockquote style="margin:8px 0 0;padding:12px 16px;background:#f6f7f9;border-left:3px solid #e11d48;border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;color:#444">${esc(r.body)}</blockquote>`,
      cta: { label: 'Read it on your listing', url: `${r.listingUrl}#reviews` },
      footnote: `You're receiving this because you own this listing on ${esc(SITE.name)}.`,
    }),
  };
}
