import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { LANDING_LANGUAGES, type LandingLanguage } from './src/landing/content.ts';
import { renderLanding, robotsTxt, sitemapXml, umamiTag } from './src/landing/render.ts';

/**
 * The public address, for canonical links, the sitemap and link previews.
 * SITE_URL overrides it, e.g. once the app has its own domain.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://keypacer.com').replace(/\/$/, '');

/**
 * Landing pages: each /<lang>/index.html is a one-line placeholder that this
 * plugin replaces with the page built from src/landing/content.ts, in
 * development and in the build. It also writes sitemap.xml and robots.txt,
 * and adds the Umami tag to the trainer's page when statistics are on.
 */
function landing(production: boolean, umami: string): Plugin {
  return {
    name: 'keypacer-landing',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const lang = /keypacer-landing:(\w+)/.exec(html)?.[1] as LandingLanguage | undefined;
        if (lang && LANDING_LANGUAGES.includes(lang)) return renderLanding(lang, SITE_URL, umami);
        // The trainer counts only that its page was opened, never what happens in it.
        if (umami && ctx.path === '/app/index.html') return html.replace('</head>', `  ${umamiTag(umami)}\n  </head>`);
        return html;
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(SITE_URL) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(SITE_URL, production) });
    },
  };
}

/**
 * Supabase projects for accounts and sync. Both values are public by design
 * (they ship in the browser bundle); row-level security in the database is
 * what protects the data.
 */
const SUPABASE = {
  production: { url: 'https://ubjwlxcawxwrgolszlkz.supabase.co', key: 'sb_publishable_QnvlL5E5MkUhOZENBSrkdg_rUaim9ep' },
  staging: { url: 'https://dghypouxfnfcdvpylznt.supabase.co', key: 'sb_publishable_pSD1knxbPjl5ih5bqi0zog_bcDsSb_o' },
};

/**
 * Cloudflare Turnstile site keys (public, like the Supabase keys). Empty
 * means off: no captcha in the sign-in forms and no Turnstile paragraph in
 * the privacy policy. Turn it on in Supabase (Authentication → Attack
 * Protection) only after the key is here and deployed, or e-mail sign-ins
 * fail. VITE_TURNSTILE_SITE_KEY in .env.local overrides both.
 */
const TURNSTILE = { production: '', staging: '' };

/**
 * Sign-in by e-mail code, password reset and the address check at sign-up,
 * per Supabase project. All of them send e-mail, so each is on only where
 * that project sends through Resend (docs/email-setup.md). Also switches the
 * paragraph about the mail service in the privacy policy.
 * VITE_EMAIL_LINKS=true|false in .env.local overrides both.
 */
const EMAIL_LINKS = { production: true, staging: true };

/**
 * Umami Cloud website ID for visitor statistics on the landing pages and
 * the trainer's page (only that it was opened; not the legal pages). Empty means off: no script, the
 * landing pages keep their "no tracking" claim and the privacy policy has no
 * analytics section. Staging stays empty so previews are not counted.
 * VITE_UMAMI_WEBSITE_ID in .env.local overrides both.
 */
const UMAMI = { production: 'eac528e1-2114-4fe9-b754-0a6b9d3acff0', staging: '' };

export default defineConfig(({ mode }) => {
  // Cloudflare Workers Builds sets WORKERS_CI_BRANCH: main is production,
  // every other branch, local development and tests use staging.
  // VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env.local override both.
  const env = loadEnv(mode, process.cwd(), ['VITE_SUPABASE_', 'VITE_TURNSTILE_', 'VITE_EMAIL_LINKS', 'VITE_UMAMI_']);
  const target = process.env.WORKERS_CI_BRANCH === 'main' ? 'production' : 'staging';
  const supabase = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY
    ? { url: env.VITE_SUPABASE_URL, key: env.VITE_SUPABASE_PUBLISHABLE_KEY }
    : SUPABASE[target];
  const umami = env.VITE_UMAMI_WEBSITE_ID ?? UMAMI[target];

  return {
    plugins: [landing(target === 'production', umami)],
    define: {
      __SUPABASE_URL__: JSON.stringify(supabase.url),
      __SUPABASE_KEY__: JSON.stringify(supabase.key),
      __TURNSTILE_SITE_KEY__: JSON.stringify(env.VITE_TURNSTILE_SITE_KEY ?? TURNSTILE[target]),
      __UMAMI_WEBSITE_ID__: JSON.stringify(umami),
      __EMAIL_LINKS__: JSON.stringify(env.VITE_EMAIL_LINKS ? env.VITE_EMAIL_LINKS === 'true' : EMAIL_LINKS[target]),
    },
    // The landing pages (/ in English, /de/, /es/, …), the trainer at /app/, and the
    // Impressum, privacy policy and terms of use, which must be reachable by their
    // own address (/impressum, /datenschutz, /nutzungsbedingungen). Any other
    // address gets 404.html (wrangler.jsonc).
    build: {
      rolldownOptions: {
        input: {
          ...Object.fromEntries(LANDING_LANGUAGES.map((l) =>
            [`landing-${l}`, resolve(import.meta.dirname, l === 'en' ? 'index.html' : `${l}/index.html`)])),
          main: resolve(import.meta.dirname, 'app/index.html'),
          notFound: resolve(import.meta.dirname, '404.html'),
          impressum: resolve(import.meta.dirname, 'impressum.html'),
          datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
          nutzungsbedingungen: resolve(import.meta.dirname, 'nutzungsbedingungen.html'),
        },
      },
    },
  };
});
