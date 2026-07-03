// Generates the "How to register & add your business" PDF guide.
// Run from the project root: node <this file>
import { jsPDF } from 'jspdf';
import { writeFileSync } from 'node:fs';

const ROSE = [225, 29, 72];
const DARK = [26, 26, 26];
const GRAY = [105, 110, 120];
const LIGHT = [248, 249, 250];

const doc = new jsPDF({ unit: 'pt', format: 'a4' }); // 595 x 842
const W = 595, M = 52, CW = W - M * 2;
let y = 0;
let pageNo = 1;

function footer() {
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text('rhodesthingstodo.com', M, 812);
  doc.text(`Owner's Guide · Page ${pageNo}`, W - M, 812, { align: 'right' });
}

function newPage() {
  footer();
  doc.addPage();
  pageNo += 1;
  y = 64;
}

function ensure(needed) {
  if (y + needed > 780) newPage();
}

function heading(txt) {
  ensure(60);
  y += 18;
  doc.setFillColor(...ROSE);
  doc.rect(M, y - 12, 4, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...DARK);
  doc.text(txt, M + 12, y);
  y += 16;
}

function para(txt, opts = {}) {
  const size = opts.size ?? 10.5;
  const color = opts.color ?? DARK;
  const indent = opts.indent ?? 0;
  doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(txt, CW - indent);
  ensure(lines.length * (size + 3) + 6);
  doc.text(lines, M + indent, y);
  y += lines.length * (size + 3) + 6;
}

function step(n, title, body) {
  ensure(70);
  // number circle
  doc.setFillColor(...ROSE);
  doc.circle(M + 9, y - 3, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(String(n), M + 9, y, { align: 'center' });
  // title
  doc.setFontSize(11.5);
  doc.setTextColor(...DARK);
  doc.text(title, M + 26, y);
  y += 15;
  // body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 64, 70);
  const lines = doc.splitTextToSize(body, CW - 26);
  ensure(lines.length * 13 + 8);
  doc.text(lines, M + 26, y);
  y += lines.length * 13 + 10;
}

function tipBox(title, txt) {
  const lines = doc.splitTextToSize(txt, CW - 40);
  const h = 34 + lines.length * 13;
  ensure(h + 10);
  doc.setFillColor(255, 240, 244);
  doc.setDrawColor(...ROSE);
  doc.roundedRect(M, y - 8, CW, h, 8, 8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...ROSE);
  doc.text(title, M + 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 64, 70);
  doc.text(lines, M + 20, y + 26);
  y += h + 8;
}

// ============================ COVER HEADER ============================
doc.setFillColor(...ROSE);
doc.rect(0, 0, W, 148, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(26);
doc.setTextColor(255, 255, 255);
doc.text('Rhodes Things To Do', M, 62);
doc.setFontSize(15);
doc.text('How to register & add your business', M, 90);
doc.setFont('helvetica', 'normal');
doc.setFontSize(10.5);
doc.text('A step-by-step guide for business owners  ·  takes about 5 minutes', M, 112);
doc.setFontSize(9);
doc.text('rhodesthingstodo.com', M, 132);

y = 180;

para('Rhodes Things To Do is the island’s directory of restaurants, hotels, tours, beaches, bars and services. Listing your business is free: it appears on the interactive map, in search, and on pages like “Best Greek Taverns in Lindos” that visitors find on Google. This guide walks you through creating an account and publishing your first listing.', { size: 10.5 });

y += 4;
para('Before you start, have ready:', { bold: true });
para('•  An email address and a password for your account', { indent: 12 });
para('•  Your business details — name, phone, website, a short description', { indent: 12 });
para('•  Up to 5 good photos (JPEG/PNG/WebP, max 5 MB each)', { indent: 12 });
para('•  Where your business is on the map — you will simply click your spot', { indent: 12 });

// ============================ PART 1 ============================
heading('Part 1 — Create your account (1 minute)');
step(1, 'Open the registration page',
  'Go to rhodesthingstodo.com/register/ — or click the red “Add Listing” button in the top-right corner of any page.');
step(2, 'Fill in your details',
  'Enter your full name, email address and a password (at least 8 characters), then press “Create Account”.');
step(3, 'You are in',
  'No email confirmation is needed — you are signed in immediately and land on your personal dashboard. Next time, sign in at rhodesthingstodo.com/login/.');

// ============================ PART 2 ============================
heading('Part 2 — Add your listing (4 quick steps)');
para('From your dashboard, click “Add Listing” in the left menu (or the red button in the header). A guided wizard opens — four short steps with a progress bar. You can always go back a step, and nothing is saved until you press Submit.', {});

step(1, 'Basics — who you are',
  'Type your business name, tap the category that fits (Restaurant, Accommodation, Things to Do, Tours, Bars & Nightlife, Beaches, Shopping, Transfer, Services), and write a short description — two or three sentences about what makes your place special. Press Next.');
step(2, 'Location — where you are',
  'Choose your area (Lindos, Faliraki, Rhodes Town…) — the map jumps there automatically. Then simply CLICK the map on your exact spot: a pin drops and the coordinates fill in by themselves. You can drag the pin to adjust it. Add your street address, and optionally tick extra areas you serve. Press Next.');
step(3, 'Details — what visitors care about',
  'Everything here is optional but recommended: tick the specific types that fit (e.g. Greek Tavern, Fine Dining — you only see types for YOUR category), add tags like Sea View or Family-friendly, tick amenities (Wi-Fi, parking…), choose your price range (€ to €€€€), and add your Greek phone number and website. Press Next.');
step(4, 'Photos & publish',
  'Click the upload box and pick up to 5 photos — the first one becomes your cover image (you can remove and re-order before submitting). Then choose “Publish now” to go live immediately, or “Save as draft” to finish later, and press Submit listing.');

tipBox('Tip — the pin matters',
  'The map pin is required and places your business on the Rhodes map and on every category map. Zoom in and put it exactly on your entrance — visitors navigate to it.');

// ============================ PART 3 ============================
heading('Part 3 — After you publish');
para('Where your listing appears:', { bold: true });
para('•  Its own page — rhodesthingstodo.com/listing/your-business/', { indent: 12 });
para('•  Category & area pages — e.g. “Best Restaurants in Lindos” — with your pin on the map', { indent: 12 });
para('•  The island map (Map in the menu) and the site search', { indent: 12 });

y += 2;
para('Managing your listing:', { bold: true });
para('•  My Listings — view, publish/unpublish or delete your listings any time', { indent: 12 });
para('•  Booking requests — when a visitor requests a booking you get a red notification on your profile icon and a “Requests” page in your dashboard menu. Open it to see the guest’s name, phone, email, dates and message, and press Confirm or Decline — the guest sees your answer instantly.', { indent: 12 });
para('•  Reviews — visitor reviews appear on your listing page and improve your ranking', { indent: 12 });

tipBox('Tip — complete listings rank higher',
  'Listings with photos, a description, subcategories and tags appear more often across the site’s “Best … in …” pages — and convert far more visitors.');

// ============================ HELP ============================
heading('Need help?');
para('Email us at info@rhodesthingstodo.com or call +30 690 791 7676 — we are happy to add your listing for you or help with photos and text.');

footer();

const out = doc.output('arraybuffer');
writeFileSync('public/how-to-add-your-listing.pdf', Buffer.from(out));
console.log('written public/how-to-add-your-listing.pdf,', out.byteLength, 'bytes,', doc.getNumberOfPages(), 'pages');
