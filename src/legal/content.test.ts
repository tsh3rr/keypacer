import { describe, expect, it } from 'vitest';
import { LEGAL_LANGUAGES, LEGAL_UI, legalHtml } from './content';
import { UI_LANGUAGES } from '../i18n';

describe('legal texts', () => {
  it('exist in every interface language', () => {
    expect(LEGAL_LANGUAGES.map((l) => l.id).sort()).toEqual(UI_LANGUAGES.map((l) => l.id).sort());
  });

  it('say that only the German version is binding', () => {
    for (const { id } of LEGAL_LANGUAGES) expect(Boolean(LEGAL_UI[id].note)).toBe(id !== 'de');
  });

  it('have the same sections in every language', () => {
    for (const page of ['imprint', 'privacy', 'terms'] as const) {
      const shape = (html: string) => [(html.match(/<h2>/g) ?? []).length, (html.match(/<li>/g) ?? []).length, (html.match(/<a /g) ?? []).length];
      const de = shape(legalHtml(page, 'de'));
      for (const { id } of LEGAL_LANGUAGES) expect(shape(legalHtml(page, id)), `${page} ${id}`).toEqual(de);
    }
  });

  it('name the mailbox and, where the form is on, the feedback form', () => {
    for (const { id } of LEGAL_LANGUAGES) {
      const html = legalHtml('privacy', id);
      expect(html, id).toContain('Gmail');
      expect(html.includes('feedback@keypacer.com'), id).toBe(__FEEDBACK__);
      expect(legalHtml('imprint', id), id).toContain('hi@keypacer.com');
    }
  });
});
