// Thin Resend wrapper. Reads RESEND_API_KEY from the environment; if it's not
// set yet, sendEmail() no-ops (returns { skipped: true }) so booking requests
// keep working before the key is provisioned.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
};

export type SendEmailResult = { ok: boolean; skipped?: boolean; id?: string; error?: string };

/** Default "from" — override with RESEND_FROM once the domain is verified in Resend. */
function fromAddress(): string {
  return import.meta.env.RESEND_FROM || 'Rhodes Things To Do <bookings@rhodesthingstodo.com>';
}

export function isEmailConfigured(): boolean {
  return Boolean(import.meta.env.RESEND_API_KEY);
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = import.meta.env.RESEND_API_KEY as string | undefined;
  if (!apiKey) return { ok: false, skipped: true };

  const to = (Array.isArray(input.to) ? input.to : [input.to]).filter(Boolean);
  if (to.length === 0) return { ok: false, error: 'no recipients' };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress(),
        to,
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Resend ${res.status}: ${(await res.text()).slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (e: any) {
    return { ok: false, error: String(e?.message ?? e) };
  }
}

/** Escape untrusted values before interpolating into HTML email bodies. */
export function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
