import { blogPath, postPath } from '../blog/render.ts';
import { postsIn, type Post } from '../blog/posts.ts';
import { SOURCE_URL } from './brand.ts';
import { COPY, LANDING_LANGUAGES, landingPath } from './content.ts';

/**
 * /llms.txt (llmstxt.org): a plain summary of the site for AI assistants and
 * AI search, built from the English landing copy and the published articles,
 * so it never says anything the pages don't.
 */
export function llmsTxt(site: string, posts: Post[] = []): string {
  const c = COPY.en;
  const line = (title: string, url: string, note: string) => `- [${title}](${url}): ${note}`;
  const articles = (lang: 'en' | 'de') => postsIn(posts, lang).map((p) => line(p.title, site + postPath(p), p.description));
  const sections = [
    `# Keypacer`,
    `> ${c.description}`,
    `Keypacer is a free web app for learning touch typing. ${c.hero.lead} It runs in the browser, needs no sign-up, shows no ads and sets no cookies. An optional free account syncs progress between devices.`,
    `## Method\n\n${c.method.items.map((m) => `- **${m.title}**: ${m.text}`).join('\n')}`,
    `## Features\n\n${c.features.items.map((f) => `- **${f.title}**: ${f.text}`).join('\n')}`,
    `## Questions\n\n${c.faq.items.map((f) => `- **${f.q}** ${f.a}`).join('\n')}`,
    `## Pages\n\n${[
      line('Keypacer (English)', `${site}/`, 'what Keypacer is and how it works'),
      ...LANDING_LANGUAGES.filter((l) => l !== 'en').map((l) => line(`Keypacer (${COPY[l].name})`, site + landingPath(l), `the same page in ${COPY[l].name}`)),
      line('The trainer', `${site}/app/`, 'start practising right away, no account needed'),
    ].join('\n')}`,
  ];
  const en = articles('en');
  if (en.length) sections.push(`## Blog\n\n${line('All articles', site + blogPath('en'), 'touch typing method, tips and keyboards')}\n${en.join('\n')}`);
  const de = articles('de');
  sections.push(`## Optional\n\n${[
    ...de,
    line('Source code', SOURCE_URL, 'Keypacer on GitHub'),
    line('Privacy policy', `${site}/datenschutz`, 'in German'),
  ].join('\n')}`);
  return `${sections.join('\n\n')}\n`;
}
