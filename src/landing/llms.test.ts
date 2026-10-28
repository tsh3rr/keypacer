import { describe, expect, it } from 'vitest';
import { COPY, LANDING_LANGUAGES, landingPath } from './content';
import { llmsTxt } from './llms';

const SITE = 'https://example.test';

describe('llms.txt', () => {
  it('names the site, sums it up and links every landing page and the trainer', () => {
    const txt = llmsTxt(SITE);
    expect(txt.startsWith('# Keypacer\n\n> ')).toBe(true);
    expect(txt).toContain(COPY.en.description);
    for (const l of LANDING_LANGUAGES) expect(txt).toContain(`(${SITE}${landingPath(l)})`);
    expect(txt).toContain(`(${SITE}/app/)`);
    for (const f of COPY.en.faq.items) expect(txt).toContain(f.q);
  });
});
