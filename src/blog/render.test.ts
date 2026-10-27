import { describe, expect, it } from 'vitest';
import { renderLanding, sitemapXml } from '../landing/render';
import { parsePost, type PostSource } from './posts';
import { blogFeed, blogSitemapUrls, renderBlogIndex, renderPost } from './render';

const SITE = 'https://example.test';

const post = (lang: PostSource['lang'], slug: string, extra = ''): ReturnType<typeof parsePost> => parsePost({
  lang,
  slug,
  files: {},
  markdown: `---
title: Title ${lang}
description: A realistic plan with 15 minutes a day, and why accuracy before speed works.
updated: 2026-10-27
topic: start
translation: thirty-days
${extra}---

## Section

Text with <kbd>F</kbd>.
`,
});

const de = post('de', 'zehnfinger');
const en = post('en', 'thirty-days', 'translatedFrom: de\n');
const posts = [de, en];

describe('blog pages', () => {
  it('an article links its translations, notes a machine translation and has no redirect to the trainer', () => {
    const html = renderPost(en, posts, SITE);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain(`<link rel="canonical" href="${SITE}/blog/thirty-days/" />`);
    expect(html).toContain(`hreflang="de" href="${SITE}/de/blog/zehnfinger/"`);
    expect(html).toContain(`hreflang="x-default" href="${SITE}/blog/thirty-days/"`);
    expect(html).toContain('Automatically translated from German.');
    expect(html).toContain('href="/de/blog/zehnfinger/" hreflang="de">Read the original');
    expect(html).not.toContain('to-app.js');
    expect(html).toContain('<kbd>F</kbd>');
  });

  it('the German original has no translation note, and its language menu leads to the translation', () => {
    const html = renderPost(de, posts, SITE);
    expect(html).not.toContain('Automatisch aus dem Deutschen');
    expect(html).toContain('<a href="/blog/thirty-days/" hreflang="en" lang="en">English</a>');
    // Spanish has no articles: its menu entry goes to the Spanish landing page.
    expect(html).toContain('<a href="/es/" hreflang="es" lang="es">Español</a>');
  });

  it('carries the article data for search engines', () => {
    const html = renderPost(en, posts, SITE);
    const ld = JSON.parse(/<script type="application\/ld\+json">([^<]*)<\/script>/.exec(html)![1].replace(/\\u003c/g, '<'));
    expect(ld[0]).toMatchObject({ '@type': 'BlogPosting', headline: 'Title en', dateModified: '2026-10-27', inLanguage: 'en' });
    expect(ld[0].translationOfWork.url).toBe(`${SITE}/de/blog/zehnfinger/`);
    expect(ld[1].itemListElement).toHaveLength(3);
  });

  it('the overview lists the articles of its language only', () => {
    const html = renderBlogIndex('de', posts, SITE);
    expect(html).toContain('href="/de/blog/zehnfinger/"');
    expect(html).not.toContain('href="/blog/thirty-days/"');
    expect(html).toContain('href="/de/blog/feed.xml"');
  });

  it('the feed, the sitemap and the landing page know the articles', () => {
    expect(blogFeed('de', posts, SITE)).toContain(`<link>${SITE}/de/blog/zehnfinger/</link>`);
    const sitemap = sitemapXml(SITE, blogSitemapUrls(posts, SITE));
    expect(sitemap).toContain(`<loc>${SITE}/de/blog/zehnfinger/</loc>`);
    expect(sitemap).toContain('<lastmod>2026-10-27</lastmod>');
    const landing = renderLanding('de', SITE, '', [de]);
    expect(landing).toContain('<a href="/de/blog/">Blog</a>');
    expect(landing).toContain('id="lp-blog"');
    expect(renderLanding('es', SITE)).not.toContain('/es/blog/');
  });
});
