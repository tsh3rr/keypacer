import { afterEach, describe, expect, it, vi } from 'vitest';
import worker, { type Env } from './index';

const ORIGIN = 'https://keypacer.com';

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(`${ORIGIN}/api/feedback`, {
    method: 'POST',
    headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function env(extra: Partial<Env> = {}): Env {
  return { ASSETS: { fetch: async () => new Response('page') }, RESEND_API_KEY: 're_test', ...extra };
}

afterEach(() => vi.unstubAllGlobals());

describe('worker', () => {
  it('serves everything outside /api from the assets', async () => {
    const res = await worker.fetch(new Request(`${ORIGIN}/app/`), env());
    expect(await res.text()).toBe('page');
    expect((await worker.fetch(new Request(`${ORIGIN}/api/nothing`), env())).status).toBe(404);
  });

  it('mails feedback through Resend with the reply address', async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response('{"id":"1"}'));
    vi.stubGlobal('fetch', fetchMock);
    const res = await worker.fetch(post({ kind: 'idea', message: 'Numbers mode', email: 'a@b.at' }), env());
    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer re_test');
    const sent = JSON.parse(init!.body as string);
    expect(sent).toMatchObject({ from: 'Keypacer Feedback <feedback@keypacer.com>', to: ['feedback@keypacer.com'], reply_to: 'a@b.at' });
    expect(sent.subject).toBe('[Keypacer Feedback · Idee] Numbers mode');
  });

  it('refuses other sites, wrong methods, bad messages and a missing key', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const ok = { kind: 'idea', message: 'Hi' };
    expect((await worker.fetch(post(ok, { Origin: 'https://evil.example' }), env())).status).toBe(403);
    expect((await worker.fetch(new Request(`${ORIGIN}/api/feedback`), env())).status).toBe(405);
    expect((await worker.fetch(post({ kind: 'idea', message: ' ' }), env())).status).toBe(400);
    expect((await worker.fetch(post('{not json'), env())).status).toBe(400);
    expect((await worker.fetch(post(ok), env({ RESEND_API_KEY: undefined }))).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('quietly drops what fills the hidden field', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const res = await worker.fetch(post({ kind: 'idea', message: 'Buy now', website: 'spam.example' }), env());
    expect(res.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('applies the rate limit per IP address', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const limit = vi.fn(async () => ({ success: false }));
    const res = await worker.fetch(post({ kind: 'idea', message: 'Hi' }), env({ FEEDBACK_LIMIT: { limit } }));
    expect(res.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: '203.0.113.7' });
  });

  it('checks the Turnstile token when a secret is set', async () => {
    const fetchMock = vi.fn(async (url: string) =>
      new Response(url.includes('turnstile') ? '{"success":false}' : '{}'));
    vi.stubGlobal('fetch', fetchMock);
    const res = await worker.fetch(post({ kind: 'idea', message: 'Hi', token: 'bad' }), env({ TURNSTILE_SECRET_KEY: 's' }));
    expect(res.status).toBe(403);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports when Resend refuses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 422 })));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await worker.fetch(post({ kind: 'idea', message: 'Hi' }), env())).status).toBe(502);
  });
});
