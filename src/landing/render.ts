import { BRAND_MARK, SOURCE_URL } from './brand.ts';
import { BLOG_COPY } from '../blog/copy.ts';
import { blogPath, blogTeaser } from '../blog/render.ts';
import type { Post } from '../blog/posts.ts';
import { COPY, LANDING_LANGUAGES, landingPath, type LandingCopy, type LandingLanguage } from './content.ts';
import { HEAT_LEVELS, PLACED, PLACE_CELLS, QWERTY_TOP, STEPS, WEEK_DONE, WEEK_GOAL, skippedText, tabAt, type FingerTint, type VignetteData } from './vignettes.ts';
import { ROWS, getLayout, howToType } from '../layouts.ts';
import { fingerFor, fingerId } from '../fingers.ts';
import { de } from '../locales/de.ts';
import { en, type Message } from '../locales/en.ts';
import { es } from '../locales/es.ts';
import { fr } from '../locales/fr.ts';
import { it } from '../locales/it.ts';
import { pl } from '../locales/pl.ts';
import { ptBR } from '../locales/pt-BR.ts';
import { ptPT } from '../locales/pt-PT.ts';

/**
 * Builds the landing pages, the sitemap and robots.txt at build time (see the
 * landing plugin in vite.config.ts). The pages are plain HTML with all their
 * text in place, so search engines and link previews read them without
 * running any script; src/landing/main.ts adds the typing demo, the headline
 * typing itself and the moving feature pictures.
 */

export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON inside a <script> block: "<" escaped so text cannot close the block. */
export const jsonBlock = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c');

export const appPath = (lang: LandingLanguage): string => `/app/?lang=${lang}`;

/** The keyboard each page assumes until the keys pressed say otherwise, and its pictures show. */
const PAGE_LAYOUT: Record<LandingLanguage, string> = {
  en: 'qwerty-us', de: 'qwertz-de', es: 'qwerty-es', fr: 'azerty-fr', it: 'qwerty-it', pl: 'qwerty-pl',
  'pt-BR': 'abnt2-br', 'pt-PT': 'qwerty-pt',
};

/** Finger names come from the trainer's own interface text, so both say the same. */
const APP_TEXT: Record<LandingLanguage, Record<string, Message>> = { en, de, es, fr, it, pl, 'pt-BR': ptBR, 'pt-PT': ptPT };

export function fingerNames(lang: LandingLanguage): Record<string, string> {
  const names: Record<string, string> = {};
  for (const [key, value] of Object.entries(APP_TEXT[lang])) {
    if (key.startsWith('finger.') && typeof value === 'string') names[key.slice('finger.'.length)] = value;
  }
  return names;
}

const baseKey = (layout: string, code: string): string => getLayout(layout)?.keys.get(code) ?? '';

/** Everything the feature pictures need for this page (vignettes.ts). */
export function vignetteData(lang: LandingLanguage): VignetteData {
  const v = COPY[lang].vignettes;
  const own = PAGE_LAYOUT[lang];
  const qwerty = own.startsWith('qwerty') ? own : 'qwerty-us';
  const tabs = ([['QWERTZ', 'qwertz-de'], ['AZERTY', 'azerty-fr'], ['QWERTY', qwerty], ['Dvorak', 'dvorak-us']] as const)
    .map(([name, id], i) => ({ name, keys: ROWS[1].slice(0, 6).map((code) => baseKey(id, code)), caption: v.layouts[i] }));
  const start = own.startsWith('qwertz') ? 0 : own.startsWith('azerty') ? 1 : 2;

  // The home row, or the top row when the word needs it (AZERTY's home row has no vowels).
  const word = [...v.fingerWord];
  const rowCodes = [ROWS[2], ROWS[1]].map((r) => r.slice(0, 10))
    .find((codes) => word.every((ch) => codes.some((c) => baseKey(own, c) === ch))) ?? ROWS[2].slice(0, 10);
  const names = fingerNames(lang);
  const nameOf = (code: string) => {
    const f = fingerFor(code);
    return f ? (f.name === 'thumb' ? names.thumb : names[fingerId(f)]) ?? '' : '';
  };
  return {
    tabs,
    start,
    row: rowCodes.map((code, i) => ({
      ch: baseKey(own, code),
      tint: (fingerFor(code)?.name ?? 'index') as FingerTint,
      // Where the fingers rest: what reads as learnt first.
      known: [0, 1, 2, 3, 6, 7, 8].includes(i),
    })),
    word: v.fingerWord,
    wordFingers: word.map((ch) => nameOf(howToType(own, ch)?.code ?? '')),
    placing: v.placing,
    skipped: v.skipped,
    lang,
  };
}

/** Monday to Sunday, short, without the trailing dot some languages use. */
function weekdays(lang: LandingLanguage): string[] {
  const f = new Intl.DateTimeFormat(lang, { weekday: 'short', timeZone: 'UTC' });
  return Array.from({ length: 7 }, (_, i) => {
    const s = f.format(new Date(Date.UTC(2024, 0, 1 + i))).replace(/\.$/, '');
    return s.charAt(0).toLocaleUpperCase(lang) + s.slice(1);
  });
}

const chip = (text: string, tone: 'error' | 'focus' | 'accent'): string => `<kbd class="lp-chip lp-chip-${tone}">${esc(text)}</kbd>`;

const ARROW = '<span aria-hidden="true">→</span>';
const LOCK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

/** The six feature pictures at their last frame; main.ts animates the same elements. */
function stages(lang: LandingLanguage, c: LandingCopy, d: VignetteData): string[] {
  const v = c.vignettes;
  const last = (i: number) => STEPS[i];

  const tab = tabAt(d, last(0));
  const layouts = `
            <div class="tabs lp-v-tabs">${d.tabs.map((t, i) => `<span${i === tab ? ' class="is-on"' : ''}>${esc(t.name)}</span>`).join('')}</div>
            <div class="lp-v-keys">${d.tabs[tab].keys.map((k, i) => `<span class="lp-v-key${k !== QWERTY_TOP[i] ? ' is-diff' : ''}">${esc(k)}</span>`).join('')}</div>
            <span class="lp-v-cap">${esc(d.tabs[tab].caption)}</span>`;

  const at = last(1) % d.word.length;
  const next = d.word[at];
  const finger = `
            <p class="lp-v-next"><kbd class="lp-v-cobalt">${esc(next.toLocaleUpperCase(lang))}</kbd><span>${esc(d.wordFingers[at])}</span></p>
            <div class="lp-v-row">${d.row.map((k) => `<span class="lp-v-fkey tint-${k.tint}${k.ch === next ? ' is-next' : k.known ? ' is-known' : ''}">${esc(k.ch)}</span>`).join('')}</div>
            <span class="lp-v-word">${[...d.word].map((ch, i) => `<span class="${i < at ? 'is-typed' : i === at ? 'is-current' : ''}">${esc(ch)}</span>`).join('')}</span>`;

  const placed: number = PLACED[STEPS[2]];
  const placement = `
            <span class="lp-v-pill">${esc(v.letters)} <b>${placed}/${PLACE_CELLS}</b></span>
            <div class="lp-v-cells">${Array.from({ length: PLACE_CELLS }, (_, i) =>
              `<span class="${i < PLACED[0] ? 'is-first' : i < placed ? 'is-skipped' : ''}" style="--i:${Math.max(0, i - PLACED[0])}"></span>`).join('')}</div>
            <span class="lp-v-note is-done">${esc(skippedText(d, placed - PLACED[0]))}</span>`;

  const heatKeys = ['e', 'n', 'r', 's', c.analysis.example.focus[0], 't'];
  const progress = `
            <div class="lp-v-chart">
              <span class="lp-v-speed">${esc(v.speed)} <b>42</b> ${esc(c.demo.wpm)}</span>
              <div class="lp-v-plot">
                <svg viewBox="0 0 160 80" preserveAspectRatio="none">
                  <path class="lp-v-area" d="M0 70 L22 64 L44 66 L66 50 L88 46 L110 34 L132 30 L160 14 L160 80 L0 80 Z"/>
                  <path class="lp-v-line" d="M0 70 L22 64 L44 66 L66 50 L88 46 L110 34 L132 30 L160 14" vector-effect="non-scaling-stroke"/>
                </svg>
              </div>
            </div>
            <div class="lp-v-heat">${heatKeys.map((k, i) => `<span class="heat-${Math.max(0, HEAT_LEVELS[i] - 1)}" data-heat="${HEAT_LEVELS[i]}">${esc(k)}</span>`).join('')}</div>`;

  const doneDays: readonly number[] = WEEK_DONE.slice(0, last(4));
  const week = `
            <div class="lp-v-days">${weekdays(lang).map((day, i) =>
              `<span><i class="${doneDays.includes(i) ? 'is-done' : ''}"></i>${esc(day)}</span>`).join('')}</div>
            <div class="lp-v-goal">
              <span class="lp-v-bar"><i style="width:${(doneDays.length / WEEK_GOAL) * 100}%"></i></span>
              <span class="lp-v-goal-text"><span>${esc(v.weekGoal)}</span><b>${doneDays.length} / ${WEEK_GOAL}</b></span>
            </div>`;

  const sync = `
            <div class="lp-v-sync">
              <span class="lp-v-device">${esc(v.laptop)}<b>${esc(v.lesson)} 7</b></span>
              <span class="lp-v-track"></span>
              <span class="lp-v-dot is-across"></span>
              <span class="lp-v-device">${esc(v.tablet)}<b>${esc(v.lesson)} <span class="lp-v-lesson">7</span></b></span>
            </div>
            <span class="lp-v-cap">${LOCK}${esc(v.stored)}</span>`;

  return [layouts, finger, placement, progress, week, sync];
}

/** Tint of each feature picture's background, as in the design. */
const STAGE_TONE = ['accent', 'focus', 'error', 'accent', 'focus', 'accent'] as const;
/** The logo's three steps, bottom to top, for the method cards and privacy icons. */
const STEP_TONE = ['ember', 'magenta', 'cobalt', 'ember'] as const;

const PRIVACY_ICONS = [
  '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
  '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M8 21h8"/></svg>',
  '<svg class="icon" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
];
const PRIVACY_GLYPHS = [
  '<span class="lp-glyph" aria-hidden="true">0</span>',
  '<svg class="lp-glyph lp-glyph-house" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 0 48 22V48H0V22Z"/></svg>',
  '<span class="lp-glyph" aria-hidden="true">EU</span>',
];
const PRIVACY_CHIP = ['error', 'focus', 'accent'] as const;

/** Example rows of the weak-keys table: error share and time per key, weakest first. */
const WEAK_EXAMPLE = [[11.2, 412, 4], [8.4, 365, 3], [6.1, 338, 3], [3.9, 301, 2], [2.2, 276, 1]] as const;

/** Umami Cloud's script; it sends to api-gateway.umami.dev (both are allowed in public/_headers). */
const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';

/**
 * The Umami tag for the landing pages and the trainer's page (vite.config.ts).
 * No cookies, Do Not Track respected, and nothing after the path is sent, so
 * sign-in and invite links stay out of the statistics.
 */
export const umamiTag = (id: string): string =>
  `<script defer src="${UMAMI_SCRIPT}" data-website-id="${esc(id)}" data-do-not-track="true" data-exclude-search="true" data-exclude-hash="true"></script>`;

/** Icons, manifest and the shared stylesheet, in the <head> of every landing and blog page. */
export function headLinks(umami: string, styles: string[]): string {
  return `<link rel="icon" href="/favicon.ico?v=2" sizes="32x32" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="stylesheet" href="/src/style.css" />
    ${styles.map((href) => `<link rel="stylesheet" href="${href}" />`).join('\n    ')}${umami ? `
    ${umamiTag(umami)}` : ''}`;
}

export interface Chrome {
  /** Where each entry of the language menu leads (the same page in that language, or the closest one). */
  languageHref: (l: LandingLanguage) => string;
  /** Whether this language has articles: then the navigation and the footer link to the blog. */
  blog: boolean;
  /** Set on blog pages: the in-page section links point back to the landing page. */
  onBlog?: boolean;
}

const languageMenu = (lang: LandingLanguage, ch: Chrome): string => LANDING_LANGUAGES.map((l) =>
  `<a href="${ch.languageHref(l)}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''}>${esc(COPY[l].name)}</a>`).join('');

/** The top bar of the landing and blog pages. */
export function siteHeader(lang: LandingLanguage, ch: Chrome): string {
  const c = COPY[lang];
  const home = landingPath(lang);
  const at = ch.onBlog ? home : '';
  return `<header class="topbar lp-top">
      <a class="brand" href="${home}">${BRAND_MARK}<span class="brand-word">key<b>pacer</b></span></a>
      <nav class="lp-sections" aria-label="${esc(c.nav.sections)}">
        <a href="${at}#methode">${esc(c.nav.method)}</a>
        <a href="${at}#funktionen">${esc(c.nav.features)}</a>
        <a href="${at}#fragen">${esc(c.nav.faq)}</a>${ch.blog ? `
        <a href="${blogPath(lang)}"${ch.onBlog ? ' aria-current="page"' : ''}>${esc(BLOG_COPY[lang].name)}</a>` : ''}
      </nav>
      <span class="spacer"></span>
      <details class="lp-lang">
        <summary aria-label="${esc(c.nav.languages)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg><span class="lp-lang-name">${esc(c.name)}</span></summary>
        <nav class="menu lp-lang-menu" aria-label="${esc(c.nav.languages)}">${languageMenu(lang, ch)}</nav>
      </details>
      <a class="lp-signin" href="/app/?signin&amp;lang=${lang}">${esc(c.nav.signIn)}</a>
      <a class="lp-btn lp-btn-small" href="${appPath(lang)}" data-umami-event="open-app-nav">${esc(c.nav.open)}</a>
    </header>`;
}

/** The footer of the landing and blog pages: languages, the blog and the legal pages. */
export function siteFooter(lang: LandingLanguage, ch: Chrome): string {
  const c = COPY[lang];
  return `<footer class="site-foot lp-foot">
      <nav class="lp-foot-langs" aria-label="${esc(c.nav.languages)}">${languageMenu(lang, ch)}</nav>${ch.blog ? `
      <a href="${blogPath(lang)}">${esc(BLOG_COPY[lang].name)}</a>` : ''}
      <a href="/impressum?lang=${lang}">${esc(c.foot.imprint)}</a>
      <a href="/datenschutz?lang=${lang}">${esc(c.foot.privacy)}</a>
      <a href="/nutzungsbedingungen?lang=${lang}">${esc(c.foot.terms)}</a>
    </footer>`;
}

/**
 * The page for one language. With an Umami website ID, the page loads Umami
 * (umamiTag) and swaps its
 * "0 trackers" claims for the analytics copy.
 */
export function renderLanding(lang: LandingLanguage, site: string, umami = '', posts: Post[] = []): string {
  const base = COPY[lang];
  const c = umami ? {
    ...base,
    facts: { ...base.facts, items: base.facts.items.map((f, i, all) => i === all.length - 1 ? { ...f, label: base.analytics.fact } : f) },
    privacy: { ...base.privacy, items: base.privacy.items.map((p, i) => i === 0 ? base.analytics.item : p) },
  } : base;
  const url = site + landingPath(lang);
  const app = appPath(lang);
  const vignettes = vignetteData(lang);

  const alternates = LANDING_LANGUAGES.map((l) =>
    `<link rel="alternate" hreflang="${l}" href="${site}${landingPath(l)}" />`).join('\n    ');

  const structured = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Keypacer',
      url,
      description: c.description,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any (web browser)',
      inLanguage: lang,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      // What AI assistants and search engines can quote when they compare trainers.
      featureList: [...c.method.items, ...c.features.items].map((f) => f.title),
      sameAs: [SOURCE_URL],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: c.faq.items.map((f) => ({
        '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  const chrome: Chrome = { languageHref: landingPath, blog: posts.length > 0 };

  const percent = new Intl.NumberFormat(lang, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const weakRows = c.analysis.example.keys.map((k, i) => {
    const [err, ms, heat] = WEAK_EXAMPLE[i];
    return `<tr><td><kbd class="lp-heat heat-${heat}">${esc(k)}</kbd></td><td><span class="lp-err"><span class="lp-err-bar" aria-hidden="true"><i style="--w:${Math.round((err / 12) * 100)}%"></i></span><span>${percent.format(err / 100)}</span></span></td><td>${ms} ms</td></tr>`;
  }).join('\n              ');

  const stage = stages(lang, c, vignettes);
  const sectionHead = (id: string, eyebrow: string, title: string) =>
    `<p class="lp-kicker">${esc(eyebrow)}</p>\n        <h2 id="${id}">${esc(title)}</h2>`;

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${url}" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${site}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Keypacer" />
    <meta property="og:title" content="${esc(c.hero.title)}" />
    <meta property="og:description" content="${esc(c.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${site}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${c.ogLocale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <!-- Returning learners and sign-in or invite links go straight on to the trainer. -->
    <script src="/to-app.js"></script>
    ${headLinks(umami, ['/src/landing/landing.css', ...(posts.length ? ['/src/blog/blog.css'] : [])])}
    <script type="application/ld+json">${jsonBlock(structured)}</script>
  </head>
  <body class="lp">
    <a class="lp-skip" href="#inhalt">${esc(c.nav.skip)}</a>
    ${siteHeader(lang, chrome)}

    <main id="inhalt" class="lp-main">
      <section class="lp-hero" aria-labelledby="lp-title">
        <p class="lp-eyebrow">${esc(c.hero.eyebrow)}</p>
        <h1 id="lp-title" class="lp-title">${esc(c.hero.title)}</h1>
        <p class="lp-lead">${esc(c.hero.lead)}</p>

        <div id="lp-demo" class="lp-demo">
          <div class="lp-demo-head">
            <span aria-hidden="true"></span>
            <label id="lp-label" for="lp-input"><i class="lp-live" aria-hidden="true"></i><span>${esc(c.demo.label)}</span></label>
            <span id="lp-stats" class="lp-stats"></span>
          </div>
          <div id="lp-type" class="text-wrap">
            <div id="lp-text" class="text lp-text" aria-hidden="true">${esc(c.demo.lines[0])}</div>
            <button id="lp-start" class="start-pill" type="button" hidden><kbd aria-hidden="true">⌨</kbd>${esc(c.demo.start)}</button>
          </div>
          <textarea id="lp-input" class="typing-input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>
          <div role="status" aria-live="polite"><div id="lp-result" class="lp-result" hidden></div></div>
        </div>

        <div id="lp-cta" class="lp-cta">
          <span class="lp-arrow" aria-hidden="true"></span>
          <a id="lp-go" class="lp-btn lp-btn-big" href="${app}" data-umami-event="start-hero"><span data-cta>${esc(c.hero.cta)}</span> ${ARROW}</a>
          <p class="lp-note">${esc(c.hero.note)}</p>
        </div>
      </section>

      <section class="lp-facts" aria-label="${esc(c.facts.label)}">
        <ul>
          ${c.facts.items.map((f) => `<li><strong>${esc(f.value)}</strong><span>${esc(f.label)}</span></li>`).join('\n          ')}
        </ul>
      </section>

      <section id="methode" class="lp-section" aria-labelledby="lp-method">
        ${sectionHead('lp-method', c.method.eyebrow, c.method.title)}
        <p class="lp-intro">${esc(c.method.intro)}</p>
        <ol class="lp-grid lp-steps">
          ${c.method.items.map((i, n) => `<li class="lp-card"><div class="lp-band lp-${STEP_TONE[n]}" aria-hidden="true"><span>0${n + 1}</span></div><div class="lp-card-body"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div></li>`).join('\n          ')}
        </ol>
      </section>

      <section class="lp-section lp-analysis" aria-labelledby="lp-analysis">
        <div>
          <p class="lp-kicker">${esc(c.analysis.eyebrow)}</p>
          <h2 id="lp-analysis">${esc(c.analysis.title)}</h2>
          <p class="lp-analysis-text">${esc(c.analysis.text)}</p>
          <ul class="lp-points">
            ${c.analysis.points.map((p, i) => `<li><kbd class="lp-chip lp-chip-${PRIVACY_CHIP[i]}" aria-hidden="true">${esc(p.chip)}</kbd><span><b>${esc(p.strong)}</b> <span>${esc(p.text)}</span></span></li>`).join('\n            ')}
          </ul>
        </div>
        <figure class="lp-weak-table">
          <figcaption><span>${esc(c.analysis.tableTitle)}</span><span>${esc(c.analysis.tableNote)}</span></figcaption>
          <table>
            <thead><tr>${c.analysis.columns.map((col) => `<th scope="col">${esc(col)}</th>`).join('')}</tr></thead>
            <tbody>
              ${weakRows}
            </tbody>
          </table>
          <p class="lp-next-drill"><span>${esc(c.analysis.nextPrefix)}</span>${c.analysis.example.focus.map((k) => chip(k, 'focus')).join('')}<span>${esc(c.analysis.nextSuffix)}</span></p>
        </figure>
      </section>

      <section id="funktionen" class="lp-section" aria-labelledby="lp-features">
        ${sectionHead('lp-features', c.features.eyebrow, c.features.title)}
        <ul class="lp-grid lp-feats">
          ${c.features.items.map((i, n) => `<li class="lp-feat" data-v="${n}">
            <div class="lp-stage lp-stage-${STAGE_TONE[n]} lp-v${n}" aria-hidden="true">${stage[n]}
            </div>
            <div class="lp-feat-body"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>
          </li>`).join('\n          ')}
        </ul>
      </section>

      <section class="lp-section" aria-labelledby="lp-privacy">
        ${sectionHead('lp-privacy', c.privacy.eyebrow, c.privacy.title)}
        <p class="lp-intro">${esc(c.privacy.intro)}</p>
        <ul class="lp-grid lp-privacy">
          ${c.privacy.items.map((p, i) => `<li class="lp-priv lp-priv-${STEP_TONE[i]}">${PRIVACY_GLYPHS[i]}<span class="lp-priv-icon lp-${STEP_TONE[i]}" aria-hidden="true">${PRIVACY_ICONS[i]}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><span class="lp-chips">${p.chips.map((t) => chip(t, PRIVACY_CHIP[i])).join('')}</span></li>`).join('\n          ')}
        </ul>
      </section>

      ${posts.length ? blogTeaser(lang, posts) : ''}<section id="fragen" class="lp-section lp-faq" aria-labelledby="lp-faq">
        <h2 id="lp-faq">${esc(c.faq.title)}</h2>
        ${c.faq.items.map((f) => `<details><summary>${esc(f.q)}<span class="lp-plus" aria-hidden="true">+</span></summary><p>${esc(f.a)}</p></details>`).join('\n        ')}
      </section>

      <section class="lp-final" aria-labelledby="lp-final">
        <div>
          <h2 id="lp-final">${esc(c.final.title)}</h2>
          <p>${esc(c.final.text)}</p>
          <a class="lp-btn lp-btn-big" href="${app}" data-umami-event="start-final"><span data-cta>${esc(c.final.cta)}</span> ${ARROW}</a>
        </div>
        ${BRAND_MARK.replace(/ks-/g, 'ksf-').replace('class="brand-mark"', 'class="lp-final-mark"')}
      </section>
    </main>

    ${siteFooter(lang, chrome)}

    <script type="application/json" id="lp-data">${jsonBlock({
      ...c.demo, app, lang, continue: c.hero.continue, titles: [c.hero.title, ...c.hero.rotate],
      vignettes,
    })}</script>
    <script type="module" src="/src/landing/main.ts"></script>
  </body>
</html>
`;
}

/** Every landing page, each listing its translations (hreflang) for search engines, then the blog's addresses. */
export function sitemapXml(site: string, blog = ''): string {
  const links = LANDING_LANGUAGES.map((l) =>
    `    <xhtml:link rel="alternate" hreflang="${l}" href="${site}${landingPath(l)}"/>`).join('\n');
  const urls = LANDING_LANGUAGES.map((l) => `  <url>
    <loc>${site}${landingPath(l)}</loc>
${links}
    <xhtml:link rel="alternate" hreflang="x-default" href="${site}/"/>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}${blog ? `\n${blog}` : ''}
</urlset>
`;
}

/** Production is open to search engines; preview builds are not, so they never compete with it. */
export function robotsTxt(site: string, production: boolean): string {
  return production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
}
