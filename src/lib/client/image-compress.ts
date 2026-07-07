// Browser-side photo compression for upload forms.
//
// Vercel serverless functions reject any request body over ~4.2 MB
// (413 FUNCTION_PAYLOAD_TOO_LARGE) before our code runs, so multipart photo
// uploads must be shrunk in the browser. A phone photo re-encoded at
// 1600 px / q0.82 lands around 300–500 KB, so even five photos fit easily.

export type CompressOptions = {
  /** Longest edge of the output image, px. */
  maxEdge?: number;
  /** JPEG quality 0–1. */
  quality?: number;
};

/** Total multipart budget we allow client-side — safe margin under Vercel's ~4.2 MB cap. */
export const MAX_TOTAL_UPLOAD_BYTES = 3.5 * 1024 * 1024;

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> decoding (e.g. unsupported bitmap source) */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Re-encode an image as a downscaled JPEG. Returns the original file when it
 * is not an image, is already smaller than the compressed result, or when
 * anything goes wrong (the server still validates size/type).
 */
export async function compressImageFile(file: File, opts: CompressOptions = {}): Promise<File> {
  const { maxEdge = 1600, quality = 0.82 } = opts;
  if (!file.type.startsWith('image/')) return file;
  try {
    const src = await decode(file);
    const w = 'naturalWidth' in src ? src.naturalWidth : src.width;
    const h = 'naturalHeight' in src ? src.naturalHeight : src.height;
    if (!w || !h) return file;

    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    // JPEG has no alpha — flatten transparent PNGs onto white.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    if ('close' in src) src.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[a-z0-9]+$/i, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    return file;
  }
}

export type WireOptions = CompressOptions & {
  maxFiles?: number;
  maxTotalBytes?: number;
};

/**
 * Make a plain `<input type="file">` compress its images on selection and
 * refuse selections that would still exceed the request-size budget.
 * Feedback is written to an inserted message element under the input.
 */
export function wireCompressingInput(input: HTMLInputElement, opts: WireOptions = {}): void {
  const { maxFiles = 5, maxTotalBytes = MAX_TOTAL_UPLOAD_BYTES, ...compress } = opts;

  let msg = input.parentElement?.querySelector<HTMLElement>('.upload-size-msg') ?? null;
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'upload-size-msg text-sm mt-1 d-none';
    input.insertAdjacentElement('afterend', msg);
  }
  const say = (text: string, isError: boolean) => {
    msg!.textContent = text;
    msg!.classList.toggle('d-none', !text);
    msg!.classList.toggle('text-danger', isError);
    msg!.classList.toggle('text-muted', !isError);
  };

  input.addEventListener('change', async () => {
    const picked = Array.from(input.files ?? []);
    if (picked.length === 0) { say('', false); return; }
    say('Optimising photos…', false);
    input.dataset.busy = '1';
    try {
      const notes: string[] = [];
      const kept: File[] = [];
      let total = 0;
      for (const f of picked) {
        if (kept.length >= maxFiles) { notes.push(`Only the first ${maxFiles} photos were kept.`); break; }
        const c = await compressImageFile(f, compress);
        if (total + c.size > maxTotalBytes) { notes.push(`"${f.name}" was skipped — the upload would be too large.`); continue; }
        total += c.size;
        kept.push(c);
      }
      const dt = new DataTransfer();
      kept.forEach((f) => dt.items.add(f));
      input.files = dt.files;
      say(notes.join(' '), notes.length > 0);
    } finally {
      delete input.dataset.busy;
    }
  });

  // Block submits while compression is still running so the original
  // multi-megabyte files can never be sent.
  input.form?.addEventListener('submit', (e) => {
    if (input.dataset.busy) {
      e.preventDefault();
      say('Still optimising photos — try again in a second.', true);
    }
  });
}

/**
 * Disable the submit button with a spinner while an upload form is submitting,
 * and restore it when the page is shown again (browser Back / bfcache) so the
 * form never comes back with a dead button.
 */
export function wireUploadForm(form: HTMLFormElement): void {
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!btn) return;
  const original = btn.innerHTML;
  form.addEventListener('submit', (e) => {
    if (e.defaultPrevented) return;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving…';
  });
  window.addEventListener('pageshow', () => {
    btn.disabled = false;
    btn.innerHTML = original;
  });
}
