import { describe, expect, it } from 'vitest';
import { imageSize } from './imageSize';
import { checkPosts, featuredPosts, parsePost, publishedPosts, translationsOf, PostError, type PostSource } from './posts';

/** A 1×1 PNG with its size patched to 1200×675. */
function png(width = 1200, height = 675): Uint8Array {
  const b = new Uint8Array(33);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  new DataView(b.buffer).setUint32(16, width);
  new DataView(b.buffer).setUint32(20, height);
  return b;
}

const FRONT = {
  title: 'Zehnfingersystem in 30 Tagen lernen',
  description: 'Ein realistischer Plan mit 15 Minuten am Tag, und warum Genauigkeit vor Tempo schneller ans Ziel führt.',
  updated: '2026-10-27',
  topic: 'start',
  translation: 'zehnfinger-30-tage',
};

function source(fields: Record<string, unknown> = {}, body = 'Text.', over: Partial<PostSource> = {}): PostSource {
  const all = { ...FRONT, ...fields };
  const yaml = Object.entries(all).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${v}`).join('\n');
  return { lang: 'de', slug: 'zehnfingersystem-in-30-tagen', markdown: `---\n${yaml}\n---\n\n${body}\n`, files: {}, ...over };
}

describe('reading an article', () => {
  it('reads the fields and fills in colour, order and reading time', () => {
    const p = parsePost(source());
    expect(p).toMatchObject({ title: FRONT.title, updated: '2026-10-27', topic: 'start', color: 'ember', order: 100, featured: false, draft: false, minutes: 1 });
  });

  it.each([
    [{ title: undefined }, 'title'],
    [{ description: 'Zu kurz.' }, 'description'],
    [{ updated: 'gestern' }, 'updated'],
    [{ topic: 'news' }, 'topic'],
    [{ color: 'green' }, 'color'],
    [{ date: '2026-10-27' }, 'unknown field "date"'],
    [{ translatedFrom: 'en' }, 'translatedFrom'],
    [{ cover: 'cover.png' }, 'coverAlt'],
  ])('refuses %o and names the problem', (fields, message) => {
    expect(() => parsePost(source(fields))).toThrow(PostError);
    expect(() => parsePost(source(fields))).toThrow(message);
  });

  it('refuses a folder name with umlauts or capitals', () => {
    expect(() => parsePost(source({}, 'Text.', { slug: 'Übung' }))).toThrow('folder name');
  });

  it('keeps <kbd>, escapes any other HTML and refuses script links', () => {
    const p = parsePost(source({}, 'Drück <kbd>F</kbd> <script>alert(1)</script> <b style="color:red">x</b>'));
    expect(p.html).toContain('<kbd>F</kbd>');
    expect(p.html).not.toContain('<script');
    expect(p.html).not.toContain('<b ');
    expect(() => parsePost(source({}, '[klick](javascript:alert(1))'))).toThrow('not allowed');
  });

  it('turns a youtube block into a box that loads nothing from YouTube until clicked', () => {
    const p = parsePost(source({}, '```youtube\n1ArVtCQqQRE\nHow I Type REALLY Fast · Ali Abdaal\n```'));
    expect(p.video).toBe(true);
    expect(p.html).toContain('data-youtube="1ArVtCQqQRE"');
    expect(p.html).toContain('href="https://www.youtube.com/watch?v=1ArVtCQqQRE"');
    expect(p.html).toContain('Video laden');
    expect(p.html).not.toMatch(/<iframe|<img|ytimg|youtube-nocookie/);
    expect(parsePost(source()).video).toBe(false);
    expect(parsePost(source({}, '```js\nlet x\n```')).html).toContain('<code class="language-js">');
  });

  it('refuses a youtube block without a valid id or a title', () => {
    expect(() => parsePost(source({}, '```youtube\nhttps://youtu.be/1ArVtCQqQRE\nTitel\n```'))).toThrow('id');
    expect(() => parsePost(source({}, '```youtube\n1ArVtCQqQRE\n```'))).toThrow('title');
  });

  it('gives headings ids, and keeps the title the only top heading', () => {
    expect(parsePost(source({}, '## Warum Genauigkeit vor Tempo kommt')).html).toContain('<h2 id="warum-genauigkeit-vor-tempo-kommt">');
    expect(() => parsePost(source({}, '# Noch ein Titel'))).toThrow('##');
  });

  it('gives pictures their size and needs a description and the file', () => {
    const files = { 'heatmap.png': png(928, 302), 'cover.png': png() };
    const p = parsePost(source({ cover: 'cover.png', coverAlt: 'Tastatur' }, '![Heatmap der Tastatur](heatmap.png)', { files }));
    expect(p.html).toContain('<img src="heatmap.png" width="928" height="302" alt="Heatmap der Tastatur"');
    expect(p.cover).toEqual({ file: 'cover.png', width: 1200, height: 675, alt: 'Tastatur' });
    expect(p.pictures.map((x) => x.file)).toEqual(['cover.png', 'heatmap.png']);
    expect(() => parsePost(source({}, '![](heatmap.png)', { files }))).toThrow('description');
    expect(() => parsePost(source({}, '![Bild](fehlt.png)', { files }))).toThrow('not in the folder');
    expect(() => parsePost(source({}, '![Bild](../geheim.png)', { files }))).toThrow('own folder');
  });
});

describe('articles together', () => {
  const de = parsePost(source());
  const en = parsePost(source({ title: 'Learn touch typing in 30 days', translatedFrom: 'de' }, 'Text.', { lang: 'en', slug: 'touch-typing-in-30-days' }));

  it('links translations by their key', () => {
    checkPosts([de, en]);
    expect(translationsOf(de, [de, en])).toEqual([en]);
    expect(translationsOf(en, [de, en])).toEqual([de]);
  });

  it('needs the German original of a translation, and one article per key and language', () => {
    expect(() => checkPosts([en])).toThrow('no German article');
    expect(() => checkPosts([de, parsePost(source({}, 'Text.', { slug: 'noch-einer' }))])).toThrow('share translation');
  });

  it('leaves drafts out of production only, and sorts by order', () => {
    const draft = parsePost(source({ draft: true, order: 1, translation: 'entwurf' }, 'Text.', { slug: 'entwurf' }));
    expect(publishedPosts([de, draft], true)).toEqual([de]);
    expect(publishedPosts([de, draft], false)).toEqual([draft, de]);
  });

  it('puts featured articles first on the landing page, three at most', () => {
    const many = [1, 2, 3, 4].map((n) => parsePost(source({ translation: `a${n}`, order: n, featured: n === 4 }, 'Text.', { slug: `a${n}` })));
    expect(featuredPosts(many).map((p) => p.slug)).toEqual(['a4', 'a1', 'a2']);
  });
});

describe('picture sizes', () => {
  it('reads PNG and rejects anything else', () => {
    expect(imageSize(png(10, 20))).toEqual({ width: 10, height: 20 });
    expect(imageSize(new TextEncoder().encode('<svg></svg>'))).toBeUndefined();
  });

  it('reads a JPEG frame header', () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8, 0x02, 0xa3, 0x04, 0xb0, 3, 0, 0, 0]);
    expect(imageSize(jpeg)).toEqual({ width: 1200, height: 675 });
  });
});
