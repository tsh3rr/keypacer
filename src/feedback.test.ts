import { describe, expect, it } from 'vitest';
import { MAX_MESSAGE, PROMPT_RULES, feedbackMail, markShown, parseFeedback, shouldPrompt, type PromptState } from './feedback';

const DAY = 86_400_000;
const day1 = new Date(2026, 9, 20, 12).getTime();
const day2 = day1 + DAY;

describe('parseFeedback', () => {
  it('trims, keeps known details and drops everything else', () => {
    const r = parseFeedback({ kind: 'idea', message: '  More digits ', email: ' a@b.at ', tech: { layout: 'qwertz-de', drills: 12, secret: 'x' }, extra: 1 });
    expect(r).toEqual({ ok: true, value: { kind: 'idea', message: 'More digits', email: 'a@b.at', tech: { layout: 'qwertz-de', drills: '12' } } });
  });

  it('refuses what the form would not send', () => {
    expect(parseFeedback(null)).toEqual({ ok: false, problem: 'badRequest' });
    expect(parseFeedback({ kind: 'spam', message: 'x' })).toEqual({ ok: false, problem: 'badRequest' });
    expect(parseFeedback({ kind: 'bug', message: '   ' })).toEqual({ ok: false, problem: 'empty' });
    expect(parseFeedback({ kind: 'bug', message: 'x'.repeat(MAX_MESSAGE + 1) })).toEqual({ ok: false, problem: 'tooLong' });
    expect(parseFeedback({ kind: 'bug', message: 'x', email: 'not an address' })).toEqual({ ok: false, problem: 'badEmail' });
  });

  it('treats an empty address as no reply wanted', () => {
    expect(parseFeedback({ kind: 'praise', message: 'Nice', email: '' })).toEqual({ ok: true, value: { kind: 'praise', message: 'Nice' } });
  });
});

describe('feedbackMail', () => {
  it('names the kind and the reply address and lists the details', () => {
    const m = feedbackMail({ kind: 'bug', message: 'The caret\njumps', email: 'a@b.at', tech: { version: 'abc1234', layout: 'qwertz-de' } });
    expect(m.subject).toBe('[Keypacer Feedback · Etwas klappt nicht] The caret jumps');
    expect(m.text).toContain('Antwort erwünscht: ja, an a@b.at');
    expect(m.text).toContain('The caret\njumps');
    expect(m.text).toContain('Version: abc1234\nLayout: qwertz-de');
  });

  it('shortens a long first line in the subject', () => {
    expect(feedbackMail({ kind: 'idea', message: 'x'.repeat(100) }).subject).toMatch(/x{59}…$/);
  });
});

describe('shouldPrompt', () => {
  const seen = { firstSeenAt: day1 };

  it('waits for enough rounds and a second day', () => {
    expect(shouldPrompt(seen, PROMPT_RULES.minDrills - 1, day2)).toBe(false);
    expect(shouldPrompt(seen, PROMPT_RULES.minDrills, day1 + 3_600_000)).toBe(false);
    expect(shouldPrompt(seen, PROMPT_RULES.minDrills, day2)).toBe(true);
    expect(shouldPrompt({}, 50, day2)).toBe(false);
  });

  it('after "Not now" waits two weeks and 30 rounds', () => {
    const s = markShown(seen, 10, day2);
    expect(shouldPrompt(s, 100, day2 + 13 * DAY)).toBe(false);
    expect(shouldPrompt(s, 39, day2 + 20 * DAY)).toBe(false);
    expect(shouldPrompt(s, 40, day2 + 14 * DAY)).toBe(true);
  });

  it('stops after three times, after ✕ and after sending', () => {
    let s: PromptState = { ...seen };
    for (let i = 0; i < 3; i++) s = markShown(s, 10 + i * 40, day2 + i * 20 * DAY);
    expect(shouldPrompt(s, 1000, day2 + 400 * DAY)).toBe(false);
    expect(shouldPrompt({ ...seen, done: true }, 100, day2)).toBe(false);
  });
});
