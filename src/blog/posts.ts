import { Marked, type Tokens } from 'marked';
import { parse as parseYaml } from 'yaml';
import { LANDING_LANGUAGES, type LandingLanguage } from '../landing/content.ts';
import { BLOG_COPY, TOPICS, type Topic } from './copy.ts';
import { imageSize } from './imageSize.ts';

/**
 * Blog articles: one folder per article in content/blog/<lang>/<slug>/, with
 * the text in index.md and its pictures next to it. The folder name is the
 * address (/de/blog/<slug>/). The build reads the folders (vite.config.ts),
 * and everything here checks and turns them into HTML; a mistake stops the
 * build with a message that names the file.
 */

export const COLORS = ['ember', 'magenta', 'cobalt', 'neutral'] as const;
export type Color = (typeof COLORS)[number];

/** The card colour when the article does not set one. */
const TOPIC_COLOR: Record<Topic, Color> = {
  start: 'ember', method: 'ember', tips: 'magenta', keyboard: 'cobalt', knowledge: 'magenta', health: 'cobalt',
};

export interface Picture { file: string; width: number; height: number }

export interface Post {
  lang: LandingLanguage;
  slug: string;
  title: string;
  description: string;
  /** Last real change to the content, YYYY-MM-DD. */
  updated: string;
  topic: Topic;
  /** The same key in every language version of the article. */
  translation: string;
  /** Set on machine translations of the German original. */
  translatedFrom?: 'de';
  cover?: Picture & { alt: string };
  color: Color;
  /** Position on the overview, lowest first. */
  order: number;
  /** Shown on the landing page (at most three, see featuredPosts). */
  featured: boolean;
  draft: boolean;
  html: string;
  minutes: number;
  /** Every picture the article uses, the cover included. */
  pictures: Picture[];
  /** Whether the article embeds a video, so its page loads src/blog/video.ts. */
  video: boolean;
}

export interface PostSource {
  lang: LandingLanguage;
  slug: string;
  /** The text of index.md. */
  markdown: string;
  /** The other files in the article's folder, by name. */
  files: Record<string, Uint8Array>;
}

export class PostError extends Error {}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FIELDS = ['title', 'description', 'updated', 'topic', 'translation', 'translatedFrom', 'cover', 'coverAlt', 'color', 'order', 'featured', 'draft'];

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Address-safe id for a heading, so sections can be linked to. */
const anchor = (text: string): string =>
  text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/ł/g, 'l')
    .replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Links may go to web pages, e-mail addresses, this site or a place in the article; nothing that runs code. */
const safeLink = (href: string): boolean => !/^[a-z][a-z0-9+.-]*:/i.test(href) || /^(https?|mailto):/i.test(href);

function picture(src: PostSource, file: string, where: string): Picture {
  const fail = (why: string) => new PostError(`${where}: ${why}`);
  if (!/^[\w.-]+$/.test(file) || file === 'index.md') throw fail(`"${file}" must be a file in the article's own folder`);
  const data = src.files[file];
  if (!data) throw fail(`the picture "${file}" is not in the folder`);
  const size = imageSize(data);
  if (!size) throw fail(`"${file}" is not a PNG, JPEG or WebP picture`);
  return { file, ...size };
}

const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * A YouTube video, written as a code block:
 *
 *     ```youtube
 *     1ArVtCQqQRE
 *     Title of the video · Channel
 *     poster.jpg
 *     ```
 *
 * The third line is optional: a picture in the article's folder shown in the
 * box, so it looks like the video before it plays. It is served from this
 * site like any other picture of the article.
 *
 * The page shows only a box with our own text; nothing is loaded from YouTube
 * until the reader clicks it (src/blog/video.ts swaps in the player from
 * youtube-nocookie.com). Without the script the box is a plain link to the video.
 */
function youtube(src: PostSource, text: string, where: string): { html: string; poster?: Picture } {
  const [id = '', caption = '', file = ''] = text.split('\n').map((l) => l.trim());
  if (!YOUTUBE_ID.test(id)) throw new PostError(`${where}: a youtube block starts with the video's id (the 11 characters after watch?v=), not "${id}"`);
  if (!caption) throw new PostError(`${where}: the youtube block ${id} needs a second line with the video's title`);
  const poster = file ? picture(src, file, where) : undefined;
  const lang = src.lang;
  const v = BLOG_COPY[lang].video;
  const watch = `https://www.youtube.com/watch?v=${id}`;
  const img = poster
    ? `<img class="bl-video-poster" src="${esc(poster.file)}" width="${poster.width}" height="${poster.height}" alt="" loading="lazy" decoding="async" />`
    : '';
  const html = `<figure class="bl-video" data-youtube="${id}" data-title="${esc(caption)}">
<a class="bl-video-box${poster ? ' bl-video-has-poster' : ''}" href="${watch}" rel="noopener">${img}<span class="bl-video-play" aria-hidden="true"></span><span class="bl-video-label">${esc(v.play)}</span><span class="bl-video-title">${esc(caption)}</span></a>
<figcaption>${esc(v.note)} <a href="/datenschutz?lang=${lang}">${esc(v.privacy)}</a> · <a href="${watch}" rel="noopener">${esc(v.watch)}</a></figcaption>
</figure>
`;
  return { html, poster };
}

function renderMarkdown(src: PostSource, where: string): { html: string; pictures: Picture[]; video: boolean } {
  const pictures: Picture[] = [];
  let video = false;
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      // No raw HTML except <kbd> for keys: what an article can contain stays within what the page's styles and CSP expect.
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return /^<\/?kbd>$/i.test(text.trim()) ? text.trim().toLowerCase() : esc(text);
      },
      heading({ tokens, depth }: Tokens.Heading) {
        if (depth === 1) throw new PostError(`${where}: use ## for headings; the title is the only top heading`);
        const inner = this.parser.parseInline(tokens);
        return `<h${depth} id="${anchor(inner)}">${inner}</h${depth}>\n`;
      },
      image({ href, text, title }: Tokens.Image) {
        if (!text.trim()) throw new PostError(`${where}: the picture "${href}" needs a description: ![What it shows](${href})`);
        const p = picture(src, href, where);
        pictures.push(p);
        return `<img src="${esc(p.file)}" width="${p.width}" height="${p.height}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async" />`;
      },
      code({ text, lang }: Tokens.Code) {
        if (lang?.trim() !== 'youtube') return false;
        video = true;
        const { html, poster } = youtube(src, text, where);
        if (poster) pictures.push(poster);
        return html;
      },
      link({ href, title, tokens }: Tokens.Link) {
        if (!safeLink(href)) throw new PostError(`${where}: the link "${href}" is not allowed`);
        const external = /^https?:\/\//i.test(href);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${external ? ' rel="noopener"' : ''}>${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  const html = marked.parse(src.markdown, { async: false });
  return { html, pictures, video };
}

/** Splits index.md into its front matter (between --- lines) and the text. */
function splitFrontMatter(markdown: string, where: string): { data: Record<string, unknown>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(markdown);
  if (!m) throw new PostError(`${where}: the file must start with the fields between two --- lines`);
  let data: unknown;
  try {
    data = parseYaml(m[1]);
  } catch (e) {
    throw new PostError(`${where}: the fields at the top cannot be read (${(e as Error).message.split('\n')[0]})`);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new PostError(`${where}: the fields at the top cannot be read`);
  return { data: data as Record<string, unknown>, body: m[2] };
}

/** Reads and checks one article. */
export function parsePost(src: PostSource): Post {
  const where = `content/blog/${src.lang}/${src.slug}/index.md`;
  const fail = (why: string) => new PostError(`${where}: ${why}`);
  if (!SLUG.test(src.slug)) throw fail('the folder name may only contain a–z, 0–9 and single hyphens (write ä as ae, ß as ss)');

  const { data, body } = splitFrontMatter(src.markdown, where);
  for (const key of Object.keys(data)) if (!FIELDS.includes(key)) throw fail(`unknown field "${key}" (known: ${FIELDS.join(', ')})`);
  const text = (key: string, required = true): string | undefined => {
    const v = data[key];
    if (v === undefined || v === null || v === '') {
      if (required) throw fail(`the field "${key}" is missing`);
      return undefined;
    }
    if (typeof v !== 'string') throw fail(`"${key}" must be text`);
    return v.trim();
  };
  const flag = (key: string): boolean => {
    const v = data[key] ?? false;
    if (typeof v !== 'boolean') throw fail(`"${key}" must be true or false`);
    return v;
  };

  const title = text('title')!;
  const description = text('description')!;
  if (description.length < 50 || description.length > 160) throw fail(`"description" should be 50 to 160 characters for search results (it has ${description.length})`);
  const rawDate = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : text('updated')!;
  if (!DATE.test(rawDate) || Number.isNaN(Date.parse(rawDate))) throw fail('"updated" must be a date like 2026-11-03');
  const topic = text('topic')! as Topic;
  if (!TOPICS.includes(topic)) throw fail(`"topic" must be one of ${TOPICS.join(', ')}`);
  const translation = text('translation')!;
  if (!SLUG.test(translation)) throw fail('"translation" may only contain a–z, 0–9 and single hyphens');
  const translatedFrom = text('translatedFrom', false);
  if (translatedFrom !== undefined && translatedFrom !== 'de') throw fail('"translatedFrom" can only be de: German is the original');
  if (translatedFrom && src.lang === 'de') throw fail('the German article is the original; remove "translatedFrom"');
  const color = (text('color', false) ?? TOPIC_COLOR[topic]) as Color;
  if (!COLORS.includes(color)) throw fail(`"color" must be one of ${COLORS.join(', ')}`);
  const order = data.order ?? 100;
  if (typeof order !== 'number' || !Number.isFinite(order)) throw fail('"order" must be a number');

  const coverFile = text('cover', false);
  const coverAlt = text('coverAlt', false);
  if (coverFile && !coverAlt) throw fail('"coverAlt" must describe the cover picture');
  const cover = coverFile ? { ...picture(src, coverFile, where), alt: coverAlt! } : undefined;

  const { html, pictures, video } = renderMarkdown({ ...src, markdown: body }, where);
  const words = body.replace(/[#*_`>|[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;

  return {
    lang: src.lang,
    slug: src.slug,
    title,
    description,
    updated: rawDate,
    topic,
    translation,
    translatedFrom: translatedFrom as 'de' | undefined,
    cover,
    color,
    order,
    featured: flag('featured'),
    draft: flag('draft'),
    html,
    minutes: Math.max(1, Math.round(words / 200)),
    pictures: cover ? [cover, ...pictures.filter((p) => p.file !== cover.file)] : pictures,
    video,
  };
}

/** Checks what only shows across articles: addresses and translations. */
export function checkPosts(posts: Post[]): void {
  const seen = new Set<string>();
  for (const p of posts) {
    const key = `${p.lang}:${p.translation}`;
    if (seen.has(key)) throw new PostError(`two ${p.lang} articles share translation: ${p.translation}`);
    seen.add(key);
  }
  for (const p of posts) {
    if (p.translatedFrom && !seen.has(`${p.translatedFrom}:${p.translation}`)) {
      throw new PostError(`content/blog/${p.lang}/${p.slug}/index.md: translatedFrom: de, but no German article has translation: ${p.translation}`);
    }
  }
}

/** What a build publishes: everything in previews, no drafts in production. Sorted for the overview. */
export function publishedPosts(posts: Post[], production: boolean): Post[] {
  return posts.filter((p) => !(production && p.draft)).sort((a, b) => a.order - b.order || b.updated.localeCompare(a.updated) || a.slug.localeCompare(b.slug));
}

export const postsIn = (posts: Post[], lang: LandingLanguage): Post[] => posts.filter((p) => p.lang === lang);

/** The other language versions of an article, in the order of the language menu. */
export function translationsOf(post: Post, posts: Post[]): Post[] {
  return LANDING_LANGUAGES.flatMap((l) => posts.filter((p) => p.lang === l && p.translation === post.translation && p !== post));
}

/** The landing page's three: those marked featured first, then the overview's order. */
export function featuredPosts(posts: Post[]): Post[] {
  return [...posts.filter((p) => p.featured), ...posts.filter((p) => !p.featured)].slice(0, 3);
}
