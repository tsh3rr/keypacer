import { BRAND_MARK } from '../landing/brand.ts';
import { COPY, LANDING_LANGUAGES, landingPath, type LandingLanguage } from '../landing/content.ts';
import { appPath, esc, headLinks, jsonBlock, siteFooter, siteHeader, type Chrome } from '../landing/render.ts';
import { BLOG_COPY } from './copy.ts';
import { postsIn, translationsOf, type Post } from './posts.ts';

/**
 * Builds the blog's pages at build time (the blog plugin in vite.config.ts):
 * an overview per language, one page per article, an RSS feed per language,
 * and the blog's part of the sitemap. Like the landing pages they are plain
 * HTML with no script of their own; to-app.js is left out on purpose, so
 * people who already use the trainer can read the articles.
 */

/** Address of a language's overview: /blog/, /de/blog/, … */
export const blogPath = (lang: LandingLanguage): string => `${landingPath(lang)}blog/`;
export const postPath = (p: Post): string => `${blogPath(p.lang)}${p.slug}/`;
/** A picture of the article, by the address it has next to the page. */
const fileUrl = (p: Post, file: string): string => `${postPath(p)}${file}`;

const ARROW = '<span aria-hidden="true">→</span>';

const minutes = (p: Post): string => BLOG_COPY[p.lang].minutes.replace('{n}', String(p.minutes));
const monthYear = (lang: LandingLanguage, date: string): string =>
  new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));

/** The cover, or a plain area in the card's colour with the logo when the article has none. */
function thumb(p: Post, n: number, eager = false): string {
  const tag = `<span class="bl-tag">${esc(BLOG_COPY[p.lang].topics[p.topic])}</span>`;
  const picture = p.cover
    ? `<img src="${fileUrl(p, p.cover.file)}" width="${p.cover.width}" height="${p.cover.height}" alt=""${eager ? '' : ' loading="lazy"'} decoding="async" />`
    // Each copy of the logo needs its own gradient ids.
    : `<span class="bl-thumb-mark">${BRAND_MARK.replace(/ks-/g, `ksb${n}-`).replace('class="brand-mark"', 'class="bl-mark"')}</span>`;
  return `<div class="bl-thumb bl-${p.color}">${picture}${tag}</div>`;
}

function card(p: Post, n: number): string {
  return `<li class="bl-card"><a href="${postPath(p)}">${thumb(p, n)}<div class="bl-card-body"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="bl-meta-line">${esc(minutes(p))}</span></div></a></li>`;
}

const cards = (posts: Post[], from = 0): string =>
  `<ul class="bl-cards">\n          ${posts.map((p, i) => card(p, from + i)).join('\n          ')}\n        </ul>`;

/** The landing page's section with three articles (featuredPosts). */
export function blogTeaser(lang: LandingLanguage, featured: Post[]): string {
  const b = BLOG_COPY[lang];
  return `<section id="blog" class="lp-section" aria-labelledby="lp-blog">
        <p class="lp-kicker">${esc(b.teaser.eyebrow)}</p>
        <h2 id="lp-blog">${esc(b.teaser.title)}</h2>
        <p class="lp-intro">${esc(b.teaser.intro)}</p>
        ${cards(featured)}
        <p class="bl-all"><a href="${blogPath(lang)}">${esc(b.teaser.all)} ${ARROW}</a></p>
      </section>

      `;
}

interface Head {
  lang: LandingLanguage;
  title: string;
  description: string;
  url: string;
  alternates: { lang: LandingLanguage; url: string }[];
  image?: { url: string; width: number; height: number };
  type: 'website' | 'article';
  extra?: string;
  noindex?: boolean;
  structured: unknown[];
}

function page(h: Head, chrome: Chrome, main: string, umami: string): string {
  const c = COPY[h.lang];
  const image = h.image ?? { url: `${new URL(h.url).origin}/og.png`, width: 1200, height: 630 };
  const en = h.alternates.find((a) => a.lang === 'en');
  return `<!doctype html>
<html lang="${h.lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(h.title)}</title>
    <meta name="description" content="${esc(h.description)}" />${h.noindex ? `
    <meta name="robots" content="noindex" />` : ''}
    <link rel="canonical" href="${h.url}" />
    ${h.alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${a.url}" />`).join('\n    ')}${en ? `
    <link rel="alternate" hreflang="x-default" href="${en.url}" />` : ''}
    <link rel="alternate" type="application/rss+xml" title="${esc(`Keypacer ${BLOG_COPY[h.lang].name}`)}" href="${blogPath(h.lang)}feed.xml" />
    <meta property="og:type" content="${h.type}" />
    <meta property="og:site_name" content="Keypacer" />
    <meta property="og:title" content="${esc(h.title)}" />
    <meta property="og:description" content="${esc(h.description)}" />
    <meta property="og:url" content="${h.url}" />
    <meta property="og:image" content="${image.url}" />
    <meta property="og:image:width" content="${image.width}" />
    <meta property="og:image:height" content="${image.height}" />
    <meta property="og:locale" content="${c.ogLocale}" />${h.extra ?? ''}
    <meta name="twitter:card" content="summary_large_image" />
    ${headLinks(umami, ['/src/landing/landing.css', '/src/blog/blog.css'])}
    <script type="application/ld+json">${jsonBlock(h.structured)}</script>
  </head>
  <body class="lp">
    <a class="lp-skip" href="#inhalt">${esc(c.nav.skip)}</a>
    ${siteHeader(h.lang, chrome)}

    <main id="inhalt" class="lp-main">${main}
    </main>

    ${siteFooter(h.lang, chrome)}
  </body>
</html>
`;
}

/** Languages that have articles, for the language menu and the alternates of the overviews. */
const languagesWith = (posts: Post[]): LandingLanguage[] => LANDING_LANGUAGES.filter((l) => postsIn(posts, l).length > 0);

const publisher = (site: string) => ({ '@type': 'Organization', name: 'Keypacer', url: `${site}/`, logo: `${site}/icon-512.png` });

/** The overview of one language: the first article large, the others as cards. */
export function renderBlogIndex(lang: LandingLanguage, posts: Post[], site: string, umami = ''): string {
  const b = BLOG_COPY[lang];
  const own = postsIn(posts, lang);
  const [first, ...rest] = own;
  const withPosts = languagesWith(posts);
  const url = site + blogPath(lang);
  const chrome: Chrome = {
    languageHref: (l) => (withPosts.includes(l) ? blogPath(l) : landingPath(l)),
    blog: true,
    onBlog: true,
  };
  const main = `
      <header class="bl-head">
        <p class="lp-kicker">Keypacer ${esc(b.name)}</p>
        <h1>${esc(b.heading)}</h1>
        <p>${esc(b.intro)}</p>
      </header>
      <section class="bl-index">${first ? `
        <article class="bl-feature">
          <a class="bl-feature-pic" href="${postPath(first)}" tabindex="-1" aria-hidden="true">${thumb(first, 0, true)}</a>
          <div class="bl-feature-body">
            <p class="lp-kicker">${esc(b.topics[first.topic])}</p>
            <h2><a href="${postPath(first)}">${esc(first.title)}</a></h2>
            <p>${esc(first.description)}</p>
            <span class="bl-meta-line">${esc(minutes(first))}</span>
            <a class="lp-btn lp-btn-small" href="${postPath(first)}">${esc(b.readMore)} ${ARROW}</a>
          </div>
        </article>` : ''}${rest.length ? `
        ${cards(rest, 1)}` : ''}
      </section>`;
  return page({
    lang,
    title: b.title,
    description: b.description,
    url,
    alternates: withPosts.map((l) => ({ lang: l, url: site + blogPath(l) })),
    type: 'website',
    structured: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `Keypacer ${b.name}`,
        url,
        inLanguage: lang,
        publisher: publisher(site),
        blogPost: own.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: site + postPath(p) })),
      },
      breadcrumbs(lang, site, [[b.name, url]]),
    ],
  }, chrome, main, umami);
}

function breadcrumbs(lang: LandingLanguage, site: string, trail: [string, string][]): unknown {
  const items: [string, string][] = [[BLOG_COPY[lang].home, site + landingPath(lang)], ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  };
}

/** One article, with its translations as alternates and two more articles of its language below it. */
export function renderPost(post: Post, posts: Post[], site: string, umami = ''): string {
  const lang = post.lang;
  const b = BLOG_COPY[lang];
  const url = site + postPath(post);
  const translations = translationsOf(post, posts);
  const original = post.translatedFrom ? translations.find((t) => t.lang === post.translatedFrom) : undefined;
  const withPosts = languagesWith(posts);
  const chrome: Chrome = {
    languageHref: (l) => {
      if (l === lang) return postPath(post);
      const t = translations.find((x) => x.lang === l);
      return t ? postPath(t) : withPosts.includes(l) ? blogPath(l) : landingPath(l);
    },
    blog: true,
    onBlog: true,
  };
  const updated = b.updated.replace('{date}', monthYear(lang, post.updated));
  const related = postsIn(posts, lang).filter((p) => p !== post)
    .sort((a, z) => Number(z.topic === post.topic) - Number(a.topic === post.topic)).slice(0, 2);
  const image = post.cover ? { url: site + fileUrl(post, post.cover.file), width: post.cover.width, height: post.cover.height } : undefined;

  const main = `
      <article class="bl-article">
        <nav class="bl-crumbs" aria-label="${esc(b.trail)}"><a href="${landingPath(lang)}">${esc(b.home)}</a><span aria-hidden="true">›</span><a href="${blogPath(lang)}">${esc(b.name)}</a><span aria-hidden="true">›</span><span aria-current="page">${esc(post.title)}</span></nav>
        <p class="lp-kicker">${esc(b.topics[post.topic])}</p>
        <h1>${esc(post.title)}</h1>
        <p class="bl-lead">${esc(post.description)}</p>
        <div class="bl-meta"><span>${esc(minutes(post))}</span><span>${esc(updated)}</span>${translations.length ? `
          <details class="lp-lang bl-langs">
            <summary>${esc(b.alsoIn)}: <b>${esc(COPY[lang].name)}</b><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
            <nav class="menu lp-lang-menu" aria-label="${esc(b.alsoIn)}">${[post, ...translations].sort((a, z) => LANDING_LANGUAGES.indexOf(a.lang) - LANDING_LANGUAGES.indexOf(z.lang)).map((t) =>
              `<a href="${postPath(t)}" hreflang="${t.lang}" lang="${t.lang}"${t === post ? ' aria-current="page"' : ''}>${esc(COPY[t.lang].name)}</a>`).join('')}</nav>
          </details>` : ''}</div>${original ? `
        <p class="bl-note">${esc(b.translated)} <a href="${postPath(original)}" hreflang="${original.lang}">${esc(b.original)} ${ARROW}</a></p>` : ''}${post.cover ? `
        <figure class="bl-cover"><img src="${post.cover.file}" width="${post.cover.width}" height="${post.cover.height}" alt="${esc(post.cover.alt)}" decoding="async" fetchpriority="high" /></figure>` : ''}
        <div class="bl-prose">
${post.html}
        </div>
        <aside class="bl-cta">
          <h2>${esc(b.cta.title)}</h2>
          <p>${esc(b.cta.text)}</p>
          <a class="lp-btn" href="${appPath(lang)}" data-umami-event="start-blog">${esc(b.cta.button)} ${ARROW}</a>
        </aside>
      </article>${related.length ? `
      <section class="bl-related" aria-labelledby="bl-related">
        <h2 id="bl-related">${esc(b.related)}</h2>
        ${cards(related)}
      </section>` : ''}`;

  return page({
    lang,
    title: `${post.title} · Keypacer`,
    description: post.description,
    url,
    alternates: [post, ...translations].map((p) => ({ lang: p.lang, url: site + postPath(p) })),
    image,
    type: 'article',
    noindex: post.draft,
    extra: `
    <meta property="article:modified_time" content="${post.updated}" />
    <meta property="article:section" content="${esc(b.topics[post.topic])}" />`,
    structured: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
        dateModified: post.updated,
        articleSection: b.topics[post.topic],
        ...(image ? { image: image.url } : {}),
        author: publisher(site),
        publisher: publisher(site),
        ...(original ? { translationOfWork: { '@type': 'BlogPosting', url: site + postPath(original) } } : {}),
      },
      breadcrumbs(lang, site, [[b.name, site + blogPath(lang)], [post.title, url]]),
    ],
  }, chrome, main, umami);
}

const xml = (s: string): string => esc(s).replace(/'/g, '&apos;');

/** RSS 2.0 feed of one language, most recently updated first. */
export function blogFeed(lang: LandingLanguage, posts: Post[], site: string): string {
  const b = BLOG_COPY[lang];
  const own = [...postsIn(posts, lang)].sort((a, z) => z.updated.localeCompare(a.updated));
  const date = (d: string) => new Date(`${d}T00:00:00Z`).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`Keypacer ${b.name}`)}</title>
    <link>${site}${blogPath(lang)}</link>
    <atom:link href="${site}${blogPath(lang)}feed.xml" rel="self" type="application/rss+xml"/>
    <description>${xml(b.description)}</description>
    <language>${lang}</language>${own.length ? `
    <lastBuildDate>${date(own[0].updated)}</lastBuildDate>` : ''}
${own.map((p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${site}${postPath(p)}</link>
      <guid isPermaLink="true">${site}${postPath(p)}</guid>
      <description>${xml(p.description)}</description>
      <category>${xml(b.topics[p.topic])}</category>
      <pubDate>${date(p.updated)}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;
}

/** The overviews and articles for sitemap.xml, each with its language versions. */
export function blogSitemapUrls(posts: Post[], site: string): string {
  const withPosts = languagesWith(posts);
  const entry = (loc: string, alternates: { lang: LandingLanguage; url: string }[], lastmod?: string) => `  <url>
    <loc>${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
${alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`).join('\n')}
  </url>`;
  const indexes = withPosts.map((l) => entry(site + blogPath(l), withPosts.map((x) => ({ lang: x, url: site + blogPath(x) }))));
  const articles = posts.filter((p) => !p.draft).map((p) =>
    entry(site + postPath(p), [p, ...translationsOf(p, posts)].map((t) => ({ lang: t.lang, url: site + postPath(t) })), p.updated));
  return [...indexes, ...articles].join('\n');
}
