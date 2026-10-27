import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { checkPosts, featuredPosts, parsePost, postsIn, publishedPosts, type Post } from './src/blog/posts.ts';
import { blogFeed, blogPath, blogSitemapUrls, postPath, renderBlogIndex, renderPost } from './src/blog/render.ts';
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
function landing(production: boolean, umami: string, blog: Blog): Plugin {
  return {
    name: 'keypacer-landing',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const lang = /keypacer-landing:([\w-]+)/.exec(html)?.[1] as LandingLanguage | undefined;
        if (lang && LANDING_LANGUAGES.includes(lang)) return renderLanding(lang, SITE_URL, umami, featuredPosts(postsIn(blog.posts(), lang)));
        // The trainer counts only that its page was opened, never what happens in it.
        if (umami && ctx.path === '/app/index.html') return html.replace('</head>', `  ${umamiTag(umami)}\n  </head>`);
        return html;
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(SITE_URL, blogSitemapUrls(blog.posts(), SITE_URL)) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(SITE_URL, production) });
    },
  };
}

/** Where the articles live: content/blog/<lang>/<slug>/index.md, pictures next to it. */
const BLOG_DIR = resolve(import.meta.dirname, 'content/blog');

/**
 * The blog's generated folders (/blog/, /de/blog/, …). The blog plugin fills
 * them with one-line placeholder pages and copies of the pictures, so Vite
 * builds and serves the articles like any other page; they are in .gitignore
 * and rewritten on every start, so never put anything there by hand.
 */
const blogOut = (lang: LandingLanguage): string => resolve(import.meta.dirname, `.${blogPath(lang)}`);

interface Blog {
  /** The published articles, read again in development so edits show on reload. */
  posts: () => Post[];
  /** Build entries for the placeholder pages. */
  inputs: Record<string, string>;
}

/** Reads and checks every article; a mistake stops the build with a message naming the file. */
function readPosts(production: boolean): Post[] {
  const posts: Post[] = [];
  for (const lang of LANDING_LANGUAGES) {
    const dir = join(BLOG_DIR, lang);
    if (!existsSync(dir)) continue;
    for (const slug of readdirSync(dir).sort()) {
      const folder = join(dir, slug);
      if (!statSync(folder).isDirectory() || !existsSync(join(folder, 'index.md'))) continue;
      const files: Record<string, Uint8Array> = {};
      for (const f of readdirSync(folder)) if (f !== 'index.md' && statSync(join(folder, f)).isFile()) files[f] = readFileSync(join(folder, f));
      posts.push(parsePost({ lang, slug, markdown: readFileSync(join(folder, 'index.md'), 'utf8'), files }));
    }
  }
  checkPosts(posts);
  return publishedPosts(posts, production);
}

/** Writes the placeholder pages and picture copies; returns them as build entries. */
function writeBlogPages(posts: Post[]): Record<string, string> {
  const inputs: Record<string, string> = {};
  for (const lang of LANDING_LANGUAGES) {
    rmSync(blogOut(lang), { recursive: true, force: true });
    if (!postsIn(posts, lang).length) continue;
    mkdirSync(blogOut(lang), { recursive: true });
    writeFileSync(join(blogOut(lang), 'index.html'), `<!-- keypacer-blog:${lang} (built from content/blog by the blog plugin in vite.config.ts) -->\n`);
    inputs[`blog-${lang}`] = join(blogOut(lang), 'index.html');
  }
  for (const p of posts) {
    const dir = join(blogOut(p.lang), p.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), `<!-- keypacer-blog:${p.lang}:${p.slug} (built from content/blog/${p.lang}/${p.slug}/index.md) -->\n`);
    for (const pic of p.pictures) copyFileSync(join(BLOG_DIR, p.lang, p.slug, pic.file), join(dir, pic.file));
    inputs[`blog-${p.lang}-${p.slug}`] = join(dir, 'index.html');
  }
  return inputs;
}

function prepareBlog(production: boolean, dev: boolean): Blog {
  const posts = readPosts(production);
  return { posts: dev ? () => readPosts(production) : () => posts, inputs: writeBlogPages(posts) };
}

/**
 * Blog pages: each placeholder written by writeBlogPages becomes its overview
 * or article (src/blog/render.ts). The build also writes an RSS feed per
 * language and a copy of each cover under a fixed address for link previews.
 */
function blog(production: boolean, umami: string, b: Blog): Plugin {
  const page = (html: string): string | undefined => {
    const m = /keypacer-blog:([\w-]+?)(?::([\w-]+))?\s/.exec(html);
    if (!m) return undefined;
    const posts = b.posts();
    const lang = m[1] as LandingLanguage;
    if (!m[2]) return renderBlogIndex(lang, posts, SITE_URL, umami);
    const post = posts.find((p) => p.lang === lang && p.slug === m[2]);
    return post ? renderPost(post, posts, SITE_URL, umami) : undefined;
  };
  return {
    name: 'keypacer-blog',
    transformIndexHtml: { order: 'pre', handler: (html) => page(html) ?? html },
    configureServer(server) {
      // A new, renamed or deleted article needs new placeholders; every change reloads the page.
      server.watcher.add(BLOG_DIR);
      const refresh = (file: string) => {
        if (!file.startsWith(BLOG_DIR)) return;
        try {
          writeBlogPages(readPosts(production));
        } catch (e) {
          server.config.logger.error((e as Error).message);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
      server.middlewares.use((req, res, next) => {
        const lang = LANDING_LANGUAGES.find((l) => req.url === `${blogPath(l)}feed.xml`);
        if (!lang) return next();
        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.end(blogFeed(lang, b.posts(), SITE_URL));
      });
    },
    generateBundle() {
      const posts = b.posts();
      for (const lang of LANDING_LANGUAGES) {
        if (postsIn(posts, lang).length) this.emitFile({ type: 'asset', fileName: `${blogPath(lang).slice(1)}feed.xml`, source: blogFeed(lang, posts, SITE_URL) });
      }
      for (const p of posts) {
        if (p.cover) this.emitFile({ type: 'asset', fileName: `${postPath(p).slice(1)}${p.cover.file}`, source: readFileSync(join(BLOG_DIR, p.lang, p.slug, p.cover.file)) });
      }
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
const TURNSTILE = { production: '0x4AAAAAAFoFvDLSp3FUL7N2', staging: '0x4AAAAAAFoFvDLSp3FUL7N2' };

/**
 * Sign-in by e-mail code, password reset and the address check at sign-up,
 * per Supabase project. All of them send e-mail, so each is on only where
 * that project sends through Resend (docs/email-setup.md). Also switches the
 * paragraph about the mail service in the privacy policy.
 * VITE_EMAIL_LINKS=true|false in .env.local overrides both.
 */
const EMAIL_LINKS = { production: true, staging: true };

/**
 * Umami Cloud website ID for visitor statistics on the landing pages, the
 * blog and the trainer's page (only that it was opened; not the legal pages). Empty means off: no script, the
 * landing pages keep their "no tracking" claim and the privacy policy has no
 * analytics section. Staging stays empty so previews are not counted.
 * VITE_UMAMI_WEBSITE_ID in .env.local overrides both.
 */
/**
 * The feedback form and the occasional "How do you like Keypacer?" card,
 * per branch. It needs the worker secret RESEND_API_KEY and Cloudflare Email
 * Routing for feedback@keypacer.com (docs/feedback-setup.md); turn production
 * on only once both are set. Also switches the feedback paragraph in the
 * privacy policy. VITE_FEEDBACK=true|false in .env.local overrides both.
 */
const FEEDBACK = { production: false, staging: true };

const UMAMI = { production: 'eac528e1-2114-4fe9-b754-0a6b9d3acff0', staging: '' };

export default defineConfig(({ mode }) => {
  // Cloudflare Workers Builds sets WORKERS_CI_BRANCH: main is production,
  // every other branch, local development and tests use staging.
  // VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env.local override both.
  const env = loadEnv(mode, process.cwd(), ['VITE_SUPABASE_', 'VITE_TURNSTILE_', 'VITE_EMAIL_LINKS', 'VITE_UMAMI_', 'VITE_FEEDBACK']);
  const target = process.env.WORKERS_CI_BRANCH === 'main' ? 'production' : 'staging';
  const supabase = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY
    ? { url: env.VITE_SUPABASE_URL, key: env.VITE_SUPABASE_PUBLISHABLE_KEY }
    : SUPABASE[target];
  const umami = env.VITE_UMAMI_WEBSITE_ID ?? UMAMI[target];
  // Vitest reads this file too; it has no use for the blog's generated folders.
  const blogContent = process.env.VITEST ? { posts: () => [], inputs: {} } : prepareBlog(target === 'production', mode === 'development');

  return {
    plugins: [landing(target === 'production', umami, blogContent), blog(target === 'production', umami, blogContent)],
    define: {
      __SUPABASE_URL__: JSON.stringify(supabase.url),
      __SUPABASE_KEY__: JSON.stringify(supabase.key),
      __TURNSTILE_SITE_KEY__: JSON.stringify(env.VITE_TURNSTILE_SITE_KEY ?? TURNSTILE[target]),
      __UMAMI_WEBSITE_ID__: JSON.stringify(umami),
      __EMAIL_LINKS__: JSON.stringify(env.VITE_EMAIL_LINKS ? env.VITE_EMAIL_LINKS === 'true' : EMAIL_LINKS[target]),
      __FEEDBACK__: JSON.stringify(env.VITE_FEEDBACK ? env.VITE_FEEDBACK === 'true' : FEEDBACK[target]),
      // Sent along with feedback when the learner allows it; Workers Builds sets the commit.
      __APP_VERSION__: JSON.stringify(process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7) ?? 'dev'),
    },
    // The landing pages (/ in English, /de/, /es/, …), the trainer at /app/, and the
    // Impressum, privacy policy and terms of use, which must be reachable by their
    // own address (/impressum, /datenschutz, /nutzungsbedingungen), and the blog
    // (/blog/, /de/blog/, …, from content/blog). Any other
    // address gets 404.html (wrangler.jsonc).
    build: {
      // The colours are written in oklch, which Chrome before 111 and Firefox
      // before 113 ignore: on Windows 7 (Chrome 109 at most) the caret, typed
      // text and errors were invisible. Building for these browsers adds rgb
      // fallbacks.
      cssTarget: ['chrome109', 'firefox102', 'safari15', 'edge109'],
      rolldownOptions: {
        input: {
          ...Object.fromEntries(LANDING_LANGUAGES.map((l) =>
            [`landing-${l}`, resolve(import.meta.dirname, l === 'en' ? 'index.html' : `${l.toLowerCase()}/index.html`)])),
          main: resolve(import.meta.dirname, 'app/index.html'),
          notFound: resolve(import.meta.dirname, '404.html'),
          impressum: resolve(import.meta.dirname, 'impressum.html'),
          datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
          nutzungsbedingungen: resolve(import.meta.dirname, 'nutzungsbedingungen.html'),
          ...blogContent.inputs,
        },
      },
    },
  };
});
