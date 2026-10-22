import '@fontsource-variable/jetbrains-mono';
import { guessUiLanguage, isUiLanguage } from '../i18n';
import { loadThemeSetting, loadUiLanguageSetting } from '../settings';
import { LEGAL_UI, legalHtml, type LegalLanguage, type LegalPage } from './content';

/**
 * The Impressum, privacy and terms pages. They open in the app's interface language
 * and theme, and the language switch here only changes this page.
 */

const page = document.body.dataset.legal as LegalPage;
const body = document.getElementById('legal-body')!;
const title = document.getElementById('legal-title')!;
const back = document.getElementById('legal-back')!;
const note = document.getElementById('legal-note')!;
const updated = document.getElementById('legal-updated')!;
const switcher = document.getElementById('legal-language')!;

const theme = loadThemeSetting();
if (theme !== 'system') document.documentElement.dataset.theme = theme;

const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
const saved = loadUiLanguageSetting();
const ui = isUiLanguage(saved) ? saved : guessUiLanguage(locales);
// The legal texts exist in German (binding) and English; every other interface language gets English.
let lang: LegalLanguage = ui === 'de' ? 'de' : 'en';

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
  body.innerHTML = legalHtml(page, lang);
  switcher.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) =>
    b.setAttribute('aria-checked', String(b.dataset.lang === lang)));
  renderOptOut();
  document.querySelectorAll<HTMLAnchorElement>('[data-legal-link]').forEach((a) => {
    a.textContent = ui[a.dataset.legalLink as LegalPage];
  });
}

/**
 * The opt-out for the landing pages' visitor statistics (only in the privacy
 * policy, and only while they are on). Umami's script skips counting while
 * localStorage holds umami.disabled; this page and the landing pages share it.
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

switcher.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => {
  b.addEventListener('click', () => {
    lang = b.dataset.lang as LegalLanguage;
    render();
  });
});

render();
