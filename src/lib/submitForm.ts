import { asset, IS_PREVIEW } from '@/lib/asset';

/**
 * The single submission path for both forms.
 *
 * Everything goes to `public/send.php`, which ships with the static export and
 * runs on the cPanel host. Using our own endpoint rather than a third-party
 * form service means no API key to configure, no per-month submission cap, CVs
 * never pass through anyone else's servers, and the recipient and CC live in
 * one place.
 *
 * `next dev` has no PHP runtime, so in development the request is skipped and
 * the payload is logged. In production a failure is reported as a failure -
 * never as a silent success, which would lose enquiries without anyone
 * noticing at either end.
 */

const ENDPOINT = asset('/send.php');

/**
 * Shown on the GitHub Pages preview, which is static hosting with no PHP. Said
 * plainly rather than faking a success, so nobody reviewing the preview thinks
 * a real enquiry went through.
 */
const PREVIEW_NOTICE =
  'This is a preview of the website, so forms are switched off here. They will send once the site is live at zealoussolutions.us.';

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

const GENERIC_ERROR =
  'We could not send this right now. Please try again, or email us at Info@zealoussolutions.us.';

export async function submitForm(data: FormData): Promise<SubmitResult> {
  if (process.env.NODE_ENV === 'development') {
    const preview: Record<string, unknown> = {};
    data.forEach((value, key) => {
      preview[key] = value instanceof File ? `${value.name} (${value.size} bytes)` : value;
    });
    console.warn(
      '[submitForm] Development mode - nothing was sent. ' +
        'send.php only runs on the deployed site.',
      preview,
    );
    return { ok: true, reference: 'DEV-PREVIEW' };
  }

  if (IS_PREVIEW) return { ok: false, error: PREVIEW_NOTICE };

  try {
    const response = await fetch(ENDPOINT, { method: 'POST', body: data });

    // A misconfigured host can return an HTML error page with a 200 status, so
    // the body is parsed before the status is trusted.
    let payload: { ok?: boolean; error?: string; reference?: string } | null = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!payload || !response.ok || !payload.ok) {
      return { ok: false, error: payload?.error || GENERIC_ERROR };
    }

    return { ok: true, reference: payload.reference ?? '-' };
  } catch {
    return {
      ok: false,
      error: 'We could not reach the server. Check your connection and try again.',
    };
  }
}
