# Full Live UI/UX Scan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit every user-facing surface of https://rhodesthingstodo.com on desktop and mobile and produce a severity-ranked report of every UI/UX defect found.

**Architecture:** One reusable in-page audit script (plain JS, injected via Playwright `browser_evaluate`) runs identical checks on every page at two viewports. Findings accumulate into a single JSON file on disk; a final task compiles the human-readable report. Read-only — no site code is modified by this plan.

**Tech Stack:** Playwright MCP (isolated browser), zsh + curl for link checking, the existing production QA account for authenticated pages.

## Global Constraints

- Target site: `https://rhodesthingstodo.com` (production).
- Viewports: desktop **1440×900**, mobile **390×844** (browser_resize between passes).
- Authenticated pages use the QA account `demo-qa-claude@rhodesthingstodo.com` / `DemoQA-0nwdi8jn-2026` — never a real user.
- Read-only: no form submissions except login; no listing/profile mutations.
- Do not publish the draft QA listings.
- All scan artifacts go to the session scratchpad; the final report is the chat message (optionally saved to `docs/uiux-scan-2026-07-07.md`).

---

### Task 1: Audit script + page inventory

**Files:**
- Create: `<scratchpad>/uiux-audit.js` (the in-page audit function, pasted into browser_evaluate)
- Create: `<scratchpad>/uiux-pages.txt` (URL list)

**Interfaces:**
- Produces: `runAudit()` — an IIFE returning `{url, viewport, consoleNote, overflowPx, brokenImages[], missingAlt[], smallTapTargets[], tinyText[], h1Count, dupIds[], unnamedButtons[], deadAnchors, imgNoDims, hasViewportMeta}` — consumed verbatim by Tasks 2–4.

- [ ] **Step 1: Write the audit function**

```js
() => {
  const vw = innerWidth;
  const issues = {};
  // 1. Horizontal overflow (mobile killer)
  issues.overflowPx = Math.max(0, document.documentElement.scrollWidth - vw);
  // 2. Broken images + missing alt
  const imgs = Array.from(document.querySelectorAll('img'));
  issues.brokenImages = imgs.filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.loading?.includes('lazy')).map(i => i.src).slice(0, 10);
  issues.missingAlt = imgs.filter(i => !i.alt && !i.closest('[aria-hidden="true"]')).map(i => (i.src || '').split('/').pop()).slice(0, 10);
  issues.imgNoDims = imgs.filter(i => !i.width && !i.getAttribute('width') && !i.style.width).length;
  // 3. Tap targets < 40px (mobile pass only matters)
  const interactive = Array.from(document.querySelectorAll('a, button, input, select, [role="button"]')).filter(el => el.offsetParent);
  issues.smallTapTargets = interactive.filter(el => { const r = el.getBoundingClientRect(); return (r.width > 0 && r.height > 0) && (r.height < 32 || r.width < 32); }).map(el => (el.textContent || el.className || '').trim().slice(0, 40)).slice(0, 12);
  // 4. Tiny text
  issues.tinyText = Array.from(document.querySelectorAll('p, span, a, li, td')).filter(el => el.offsetParent && el.textContent.trim().length > 8 && parseFloat(getComputedStyle(el).fontSize) < 11).map(el => el.textContent.trim().slice(0, 40)).slice(0, 8);
  // 5. Headings + ids + a11y names
  issues.h1Count = document.querySelectorAll('h1').length;
  const ids = Array.from(document.querySelectorAll('[id]')).map(e => e.id);
  issues.dupIds = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))].slice(0, 8);
  issues.unnamedButtons = Array.from(document.querySelectorAll('button, a')).filter(el => el.offsetParent && !el.textContent.trim() && !el.getAttribute('aria-label') && !el.getAttribute('title') && !el.querySelector('img[alt]')).length;
  issues.deadAnchors = Array.from(document.querySelectorAll('a[href="#"], a[href^="JavaScript"], a[href="javascript:void(0);"]')).filter(a => a.offsetParent).length;
  issues.hasViewportMeta = !!document.querySelector('meta[name="viewport"]');
  return issues;
}
```

- [ ] **Step 2: Build the page inventory** — public pages from `curl -s https://rhodesthingstodo.com/sitemap.xml` (all `<loc>`), plus `/login/`, `/register/`, `/forgot-password/`, `/booking-page/?slug=<first listing>`, `/nonexistent-xyz/` (404 page), and authenticated: `/dashboard-user/`, `/dashboard-my-listings/`, `/dashboard-add-listing/`, `/dashboard-my-profile/`, `/dashboard-bookmarks/`, `/dashboard-my-bookings/`.
- [ ] **Step 3: Record the deduped list** to `<scratchpad>/uiux-pages.txt`. Expected: ~45 URLs.

### Task 2: Desktop pass (1440×900)

**Interfaces:**
- Consumes: `runAudit()` from Task 1.
- Produces: `<scratchpad>/uiux-findings.jsonl` — one line per page: `{"url", "viewport":"desktop", ...auditResult, "consoleErrors": n}`.

- [ ] **Step 1:** `browser_resize` to 1440×900; log in with the QA account once.
- [ ] **Step 2:** For each URL: `browser_navigate` → `browser_evaluate(runAudit)` → append result + the console-error count from the navigate response to `uiux-findings.jsonl`.
- [ ] **Step 3:** Screenshot (viewport) any page whose audit reports overflow > 0 or brokenImages > 0 for evidence.

### Task 3: Mobile pass (390×844)

**Interfaces:** same as Task 2 with `"viewport":"mobile"`.

- [ ] **Step 1:** `browser_resize` to 390×844.
- [ ] **Step 2:** Repeat Task 2 Step 2 for all URLs (tap-target and tiny-text findings are authoritative in this pass; desktop pass ignores them).
- [ ] **Step 3:** Screenshot the mobile home, listing detail, listings page, and any page with overflow > 0.

### Task 4: Cross-page checks

- [ ] **Step 1: Internal link integrity** — from the home, listings and one listing-detail page, collect all same-origin `<a href>` values (browser_evaluate), dedupe, `curl -s -o /dev/null -w '%{http_code}'` each; report non-200/301/302.
- [ ] **Step 2: Form UX** — on `/contact-us/`, `/login/`, `/register/`, booking page: every visible input has an associated `<label>`/aria-label; submit buttons are reachable; report gaps.
- [ ] **Step 3: Performance snapshot** — on home + one listing (both viewports): `performance.getEntriesByType('navigation')[0]` → domContentLoaded, load, transferSize; `performance.getEntriesByType('largest-contentful-paint')` if available. Flag pages > 3s load or > 3 MB transferred.

### Task 5: Compile the report

- [ ] **Step 1:** Read `uiux-findings.jsonl`; group findings by check type; drop noise (e.g. `deadAnchors` on template menus counted once, not per page).
- [ ] **Step 2:** Rank: **Critical** (broken function/content) → **Major** (visible breakage: overflow, broken images, unreadable text) → **Minor** (a11y/polish: alt text, tap targets, duplicate ids, dead anchors).
- [ ] **Step 3:** Deliver the ranked report in chat with per-issue page lists and evidence screenshots; save a copy to `docs/uiux-scan-2026-07-07.md`.

## Self-Review

- Spec coverage: pages (public + auth + 404) ✅ both viewports ✅ errors of function (console, links, images) ✅ readability/usability (text size, tap targets, overflow) ✅ a11y basics ✅ perf snapshot ✅ report ✅.
- Placeholder scan: audit code is complete and inline; commands exact. ✅
- Type consistency: `runAudit()` fields consumed by Tasks 2–5 match Task 1's return shape. ✅
