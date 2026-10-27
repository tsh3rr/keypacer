import { feedbackMail, parseFeedback } from '../feedback';

/**
 * The Cloudflare Worker in front of the static site (wrangler.jsonc). Only
 * /api/* reaches this code; every other address is served straight from
 * `dist` by the assets binding.
 *
 * POST /api/feedback takes a message from the feedback form and mails it to
 * feedback@keypacer.com through Resend, with the learner's address as
 * Reply-To when they asked for an answer. Nothing is stored. The Resend key
 * lives only here, as a secret, never in the browser.
 *
 * Secrets (Cloudflare → Workers & Pages → keypacer → Settings → Variables and Secrets):
 *   RESEND_API_KEY        required; without it the form answers "unavailable"
 *   TURNSTILE_SECRET_KEY  optional; when set, the Turnstile token is checked
 */

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  /** Cloudflare rate limiting binding, per IP address. */
  FEEDBACK_LIMIT?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const FROM = 'Keypacer Feedback <feedback@keypacer.com>';
const TO = 'feedback@keypacer.com';
/** Far more than a 2000-character message with its details needs. */
const MAX_BODY = 16_384;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/feedback') return feedback(request, env, url);
    if (url.pathname.startsWith('/api/')) return json(404, { error: 'notFound' });
    return env.ASSETS.fetch(request);
  },
};

async function feedback(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'method' });
  // Only the site's own pages may post here.
  if (request.headers.get('Origin') !== url.origin) return json(403, { error: 'origin' });
  if (!env.RESEND_API_KEY) return json(503, { error: 'unavailable' });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { error: 'tooLong' });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: 'badRequest' });
  }
  // A field people never see; bots fill it. Pretend it worked.
  if (body && typeof body === 'object' && body.website) return json(200, { ok: true });

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  if (env.FEEDBACK_LIMIT && !(await env.FEEDBACK_LIMIT.limit({ key: ip })).success) return json(429, { error: 'tooMany' });

  const parsed = parseFeedback(body);
  if (!parsed.ok) return json(400, { error: parsed.problem });

  if (env.TURNSTILE_SECRET_KEY) {
    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET_KEY);
    form.append('response', typeof body.token === 'string' ? body.token : '');
    if (ip) form.append('remoteip', ip);
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const result = (await check.json().catch(() => ({}))) as { success?: boolean };
    if (!result.success) return json(403, { error: 'captcha' });
  }

  const mail = feedbackMail(parsed.value);
  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: mail.subject,
      text: mail.text,
      ...(parsed.value.email ? { reply_to: parsed.value.email } : {}),
    }),
  });
  if (!sent.ok) {
    console.error('Resend refused feedback', sent.status, await sent.text().catch(() => ''));
    return json(502, { error: 'failed' });
  }
  return json(200, { ok: true });
}
