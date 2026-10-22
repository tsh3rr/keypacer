import '@fontsource-variable/jetbrains-mono';
import { guessUiLanguage, isUiLanguage } from '../i18n';
import { loadThemeSetting, loadUiLanguageSetting } from '../settings';
import { LEGAL_LANGUAGES, LEGAL_UI, isLegalLanguage, legalHtml, type LegalLanguage, type LegalPage } from './content';

/**
 * The Impressum, privacy and terms pages. They open in the language the link
 * asks for (?lang=, set by the landing pages and the trainer), else the app's
 * interface language, else the browser's, and in the app's theme. The
 * language switch here only changes these pages, and links between them keep it.
 */

const page = document.body.dataset.legal as LegalPage;
const body = document.getElementById('legal-body')!;
const title = document.getElementById('legal-title')!;
const back = document.getElementById('legal-back')!;
const note = document.getElementById('legal-note')!;
const updated = document.getElementById('legal-updated')!;
const switcher = document.getElementById('legal-language') as HTMLSelectElement;

const theme = loadThemeSetting();
if (theme !== 'system') document.documentElement.dataset.theme = theme;

const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
const saved = loadUiLanguageSetting();
const linked = new URLSearchParams(location.search).get('lang');
const ui = isUiLanguage(saved) ? saved : guessUiLanguage(locales);
let lang: LegalLanguage = isLegalLanguage(linked) ? linked : isLegalLanguage(ui) ? ui : 'en';

for (const l of LEGAL_LANGUAGES) {
  switcher.append(Object.assign(document.createElement('option'), { value: l.id, lang: l.id, textContent: l.name }));
}

/** A link to one of the legal pages, keeping the language shown here. */
function withLanguage(a: HTMLAnchorElement): void {
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !/^\/(impressum|datenschutz|nutzungsbedingungen)$/.test(url.pathname)) return;
  url.searchParams.set('lang', lang);
  a.href = url.pathname + url.search;
}

function render(): void {
  const ui = LEGAL_UI[lang];
  document.documentElement.lang = lang;
  document.title = `${ui[page]} · Keypacer`;
  title.textContent = ui[page];
  back.textContent = ui.back;
  note.textContent = ui.note;
  note.hidden = !ui.note;
  updated.textContent = ui.updated;
  switcher.setAttribute('aria-label', ui.language);
  switcher.value = lang;
  body.innerHTML = legalHtml(page, lang);
  renderOptOut();
  document.querySelectorAll<HTMLAnchorElement>('[data-legal-link]').forEach((a) => {
    a.textContent = ui[a.dataset.legalLink as LegalPage];
  });
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach(withLanguage);
  // So a reload or a shared link shows the same language.
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(history.state, '', url);
}

/**
 * The opt-out for the visitor statistics on the landing pages and the trainer (only in the privacy
 * policy, and only while they are on). Umami's script skips counting while
 * localStorage holds umami.disabled; every page of the site shares it.
 */
const OPT_OUT_KEY = 'umami.disabled';

function optedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) !== null;
  } catch {
    return false;
  }
}

function renderOptOut(): void {
  const button = body.querySelector<HTMLButtonElement>('[data-analytics-optout]');
  const state = body.querySelector<HTMLElement>('[data-analytics-state]');
  if (!button || !state) return;
  const ui = LEGAL_UI[lang];
  const off = optedOut();
  button.textContent = off ? ui.optIn : ui.optOut;
  state.textContent = off ? ui.optedOut : ui.optedIn;
}

body.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('[data-analytics-optout]')) return;
  try {
    if (optedOut()) localStorage.removeItem(OPT_OUT_KEY);
    else localStorage.setItem(OPT_OUT_KEY, '1');
  } catch {
    // Storage blocked: nothing to remember, and Umami cannot read it either.
  }
  renderOptOut();
});

switcher.addEventListener('change', () => {
  if (isLegalLanguage(switcher.value)) lang = switcher.value;
  render();
});

render();
