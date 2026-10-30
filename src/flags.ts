/**
 * Small flags for the language pickers. They are drawn as SVG rather than
 * flag emoji because Windows has no flag emoji and shows the letter pair
 * ("DE", "FR") instead. Decorative only: the language name next to a flag
 * is what screen readers announce.
 */

const FLAGS: Record<string, string> = {
  // English: the Union flag, simplified (no counterchanged red diagonals) to read at 16 px.
  en: '<rect width="60" height="40" fill="#012169"/>'
    + '<path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"/>'
    + '<path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" stroke-width="3"/>'
    + '<path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/>'
    + '<path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/>',
  de: '<rect width="60" height="40" fill="#ffce00"/><rect width="60" height="26.7" fill="#dd0000"/><rect width="60" height="13.3" fill="#000"/>',
  fr: '<rect width="60" height="40" fill="#ef4135"/><rect width="40" height="40" fill="#fff"/><rect width="20" height="40" fill="#0055a4"/>',
  es: '<rect width="60" height="40" fill="#aa151b"/><rect y="10" width="60" height="20" fill="#f1bf00"/>',
  it: '<rect width="60" height="40" fill="#ce2b37"/><rect width="40" height="40" fill="#fff"/><rect width="20" height="40" fill="#009246"/>',
  pl: '<rect width="60" height="40" fill="#dc143c"/><rect width="60" height="20" fill="#fff"/>',
  // Brazil without the stars and motto, Portugal with the armillary sphere as a plain ring: both read at 16 px.
  'pt-BR': '<rect width="60" height="40" fill="#009c3b"/><path d="M30 5 55 20 30 35 5 20z" fill="#ffdf00"/><circle cx="30" cy="20" r="8.5" fill="#002776"/>',
  'pt-PT': '<rect width="60" height="40" fill="#da291c"/><rect width="24" height="40" fill="#046a38"/>'
    + '<circle cx="24" cy="20" r="8" fill="none" stroke="#ffe900" stroke-width="3"/><circle cx="24" cy="20" r="4" fill="#fff"/>',
  id: '<rect width="60" height="40" fill="#fff"/><rect width="60" height="20" fill="#ce1126"/>',
};

/** "Automatic" follows the browser, so it gets a globe (the same one as the language menu button). */
const GLOBE = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>';

/** The flag for a language id ("auto" gets a globe), or null when there is none. */
export function flag(language: string): HTMLSpanElement | null {
  if (language === 'auto') {
    const span = document.createElement('span');
    span.className = 'flag flag-globe';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = GLOBE;
    return span;
  }
  const shapes = FLAGS[language];
  if (!shapes) return null;
  const span = document.createElement('span');
  span.className = 'flag';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 60 40" preserveAspectRatio="none">${shapes}</svg>`;
  return span;
}

/** A flag followed by the label, for buttons and menu items. */
export function withFlag(language: string, label: string): (Node | string)[] {
  const f = flag(language);
  return f ? [f, label] : [label];
}
