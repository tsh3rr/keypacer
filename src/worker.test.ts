import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './worker';

const assets = { fetch: async () => new Response('404 page', { status: 404 }) };

describe('the worker', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('starts a rebuild through the deploy hook every morning', async () => {
    const fetch = vi.fn(async () => new Response('{}'));
    vi.stubGlobal('fetch', fetch);
    const waits: Promise<unknown>[] = [];
    worker.scheduled({}, { ASSETS: assets, DEPLOY_HOOK_URL: 'https://hook.test/abc' }, { waitUntil: (p) => waits.push(p) });
    await Promise.all(waits);
    expect(fetch).toHaveBeenCalledWith('https://hook.test/abc', { method: 'POST' });
  });

  it('does nothing without the hook', () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    worker.scheduled({}, { ASSETS: assets }, { waitUntil: () => {} });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('hands missing addresses to the 404 page', async () => {
    const res = await worker.fetch(new Request('https://keypacer.com/nope'), { ASSETS: assets });
    expect(res.status).toBe(404);
  });
});
