import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase/types';

type DB = SupabaseClient<Database>;

export type BacklinkStatus = 'verified' | 'missing' | 'no_website' | 'error';
export type BacklinkResult = { status: BacklinkStatus; foundOn: string | null };

const OUR_DOMAIN = 'rhodesthingstodo.com';
const FETCH_TIMEOUT_MS = 6000;
const MAX_HTML_BYTES = 1_500_000; // read at most ~1.5 MB of HTML

/** Does this HTML contain a link (any href) pointing at our domain? */
export function htmlHasBacklink(html: string): boolean {
  // href="https://rhodesthingstodo.com/..."  |  href='//rhodesthingstodo.com'  etc.
  const re = new RegExp(`href\\s*=\\s*["'][^"']*(?:^|//|\\.)?${OUR_DOMAIN.replace('.', '\\.')}[^"']*["']`, 'i');
  return re.test(html);
}

/** Fetch the owner's website and look for a link back to us. */
export async function checkBacklink(website: string | null | undefined): Promise<BacklinkResult> {
  if (!website || !website.trim()) return { status: 'no_website', foundOn: null };
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RhodesThingsToDo-BacklinkCheck/1.0; +https://rhodesthingstodo.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return { status: 'error', foundOn: null };
    const reader = res.body?.getReader();
    let html = '';
    if (reader) {
      const decoder = new TextDecoder();
      let bytes = 0;
      while (bytes < MAX_HTML_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        html += decoder.decode(value, { stream: true });
        if (htmlHasBacklink(html)) break; // found early — stop downloading
      }
      try { await reader.cancel(); } catch { /* noop */ }
    } else {
      html = await res.text();
    }
    return htmlHasBacklink(html)
      ? { status: 'verified', foundOn: res.url || url }
      : { status: 'missing', foundOn: null };
  } catch {
    return { status: 'error', foundOn: null };
  } finally {
    clearTimeout(timer);
  }
}

/** Check one listing's backlink and persist the result. Returns the status. */
export async function runBacklinkCheck(db: DB, listingId: string): Promise<BacklinkStatus> {
  const { data: l } = await db.from('listings').select('id, website').eq('id', listingId).maybeSingle();
  if (!l) return 'error';
  const result = await checkBacklink((l as any).website);
  await db.from('listings').update({
    backlink_status: result.status,
    backlink_checked_at: new Date().toISOString(),
    backlink_found_on: result.foundOn,
  }).eq('id', listingId);
  return result.status;
}
