import { describe, expect, it } from 'vitest';
import { de } from './corpora/de';
import { en } from './corpora/en';
import { es } from './corpora/es';
import { CAPITALS, initialCurriculum, seededRandom, stepChars, unlockSteps, type CurriculumState } from './drill';
import { extrasStage, extrasText, lockedExtras, placeExtras } from './extrasTest';
import type { Corpus } from './corpus';
import { TypingSession } from './session';
import type { KeystrokeEvent, PracticeContext } from './types';

const EN: PracticeContext = { language: 'en', layout: 'qwerty-us' };
const DE: PracticeContext = { language: 'de', layout: 'qwertz-de' };
const ES: PracticeContext = { language: 'es', layout: 'qwerty-es' };

/** A curriculum with every letter unlocked, at level 6 (40 WPM). */
function allLetters(corpus: Corpus, ctx: PracticeContext): CurriculumState {
  const state = initialCurriculum(corpus, ctx);
  state.unlocked = unlockSteps(corpus, ctx.layout).filter((s) => /^\p{L}$/u.test(s));
  state.tier = 6;
  return state;
}

/** Types `text` at `iki` ms per key, pressing a wrong key first before every character in `weak`. */
function typeText(text: string, ctx: PracticeContext, iki = 150, weak = ''): KeystrokeEvent[] {
  const s = new TypingSession(text, ctx, 'extras');
  const out: KeystrokeEvent[] = [];
  let t = 1_000_000;
  for (const c of text) {
    if (weak.includes(c)) out.push(s.press('#', (t += iki), null)!);
    out.push(s.press(c, (t += iki), null)!);
  }
  return out;
}

describe('lockedExtras', () => {
  it('offers nothing while a letter is still locked', () => {
    expect(lockedExtras(initialCurriculum(en, EN), en)).toEqual([]);
    expect(extrasStage(initialCurriculum(en, EN), en)).toBeNull();
  });

  it('lists the locked capitals, marks and digits once all letters are in, or one stage of them', () => {
    const state = allLetters(en, EN);
    const steps = lockedExtras(state, en);
    expect(steps[0]).toBe(CAPITALS);
    expect(steps).toContain('.');
    expect(steps).toContain('7');
    expect(extrasStage(state, en)).toBe('capitals');
    expect(lockedExtras(state, en, 'digits')).toEqual(['1', '2', '0', '3', '5', '4', '9', '6', '8', '7']);
  });
});

describe('extrasText', () => {
  for (const [corpus, ctx] of [[en, EN], [de, DE], [es, ES]] as const) {
    it(`uses every tested step at least twice (${ctx.language})`, () => {
      const state = allLetters(corpus, ctx);
      const steps = lockedExtras(state, corpus);
      const text = extrasText(corpus, state, steps, seededRandom(3));
      const letters = state.unlocked;
      for (const step of steps) {
        const chars = stepChars(step, letters, ctx.layout);
        const n = [...text].filter((c) => chars.includes(c)).length;
        expect(n, `${step} in ${text}`).toBeGreaterThanOrEqual(2);
      }
      // Nothing outside the letters and the tested steps.
      const allowed = new Set([' ', ...letters, ...steps.flatMap((s) => stepChars(s, letters, ctx.layout))]);
      for (const c of text) expect(allowed.has(c), `${c} in ${text}`).toBe(true);
      expect(text.split(' ').length).toBeLessThan(80);
    });
  }

  it('starts sentences with a capital when only capitals are tested', () => {
    const state = allLetters(en, EN);
    const text = extrasText(en, state, [CAPITALS], seededRandom(1));
    expect([...text].filter((c) => /\p{Lu}/u.test(c)).length).toBeGreaterThanOrEqual(5);
    expect(text).toMatch(/^[a-zA-Z ]+$/);
  });
});

describe('placeExtras', () => {
  const state = allLetters(en, EN);
  const steps = lockedExtras(state, en);
  const text = extrasText(en, state, steps, seededRandom(5));

  it('unlocks every tested step for a fast, clean typist', () => {
    const p = placeExtras(typeText(text, EN), state, steps);
    expect(p.unlocked).toEqual(steps);
    expect(p.stoppedAt).toBeNull();
    expect(p.state.unlocked).toEqual([...state.unlocked, ...steps]);
    // The state passed in is left as it was.
    expect(state.unlocked).not.toContain(CAPITALS);
  });

  it('stops at the first step in unlock order that goes wrong', () => {
    const p = placeExtras(typeText(text, EN, 150, ';'), state, steps);
    const at = steps.indexOf(';');
    expect(p.stoppedAt).toBe(';');
    expect(p.unlocked).toEqual(steps.slice(0, at));
  });

  it('unlocks nothing for a slow typist', () => {
    const p = placeExtras(typeText(text, EN, 1100), state, steps);
    expect(p.unlocked).toEqual([]);
    expect(p.stoppedAt).toBe(CAPITALS);
  });
});
