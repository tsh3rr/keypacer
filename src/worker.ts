/**
 * The Cloudflare Worker in front of the static site (wrangler.jsonc).
 *
 * Pages and files are served straight from `dist` without running this code;
 * only requests for addresses that don't exist reach `fetch`, which hands
 * them back to the assets so the 404 page still shows.
 *
 * Every morning the cron trigger calls the Workers Builds deploy hook, which
 * builds and deploys `main` again. That is how an article with a `publish`
 * date goes live on its day without anyone merging (see publishedPosts in
 * src/blog/posts.ts). The hook's URL is the secret DEPLOY_HOOK_URL, set in the
 * Cloudflare dashboard; without it the cron does nothing.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DEPLOY_HOOK_URL?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },

  scheduled(_controller: unknown, env: Env, ctx: ExecutionContext): void {
    if (!env.DEPLOY_HOOK_URL) {
      console.warn('DEPLOY_HOOK_URL is not set, so the daily rebuild is skipped');
      return;
    }
    ctx.waitUntil(
      fetch(env.DEPLOY_HOOK_URL, { method: 'POST' }).then(async (res) => {
        if (!res.ok) console.error(`Deploy hook answered ${res.status}: ${await res.text()}`);
      }),
    );
  },
};
