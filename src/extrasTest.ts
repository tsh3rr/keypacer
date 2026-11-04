import type { Corpus } from './corpus';
import {
  CAPITALS, DEFAULT_DRILL_PARAMS, eligibleWords, needsShift, openChars, stepChars, unlockSteps, unlockTargetMs,
  type CurriculumState, type DrillParams,
} from './drill';
import { stageOf, type StageId } from './path';
import { DEFAULT_PLACEMENT_PARAMS, placementResult, type PlacementParams } from './placement';
import { firstAttempts } from './weakness';
import { corpusFilter } from './wordfilter';
import type { KeystrokeEvent } from './types';

/**
 * The extras test: a short text of sentences that uses each locked capital,
 * punctuation mark and digit a few times, typed once. Every step in unlock
 * order the learner already types cleanly is unlocked, stopping at the first
 * one they miss or hunt for, as the placement test does for letters.
 *
 * It opens once every letter is unlocked: after a placement test that
 * passed all letters, or later from the learning path for the stage the
 * learner is in. Like the placement it asks for far less evidence than the
 * regular unlock bar; the regular drills sort out whatever it lets through.
 */

const isLetter = (c: string) => /^\p{L}$/u.test(c);

/** Sentence-ending marks; the Spanish pairs open the sentence with their inverted mark. */
const ENDERS = new Set(['.', '?', '!']);
const SENTENCE_WRAPS = new Map([['¿?', ['¿', '?']], ['¡!', ['¡', '!']]]);
/** Marks that wrap a word. */
const WORD_WRAPS = new Map([['"', ['"', '"']], ["'", ["'", "'"]], ['()', ['(', ')']]]);

/**
 * The locked steps the extras test can unlock, in unlock order: none while a
 * letter is still locked. With `stage`, only that stage's.
 */
export function lockedExtras(state: CurriculumState, corpus: Corpus, stage?: StageId): string[] {
  const unlocked = new Set(state.unlocked);
  const locked = unlockSteps(corpus, state.layout).filter((s) => !unlocked.has(s));
  if (locked.some(isLetter)) return [];
  return stage ? locked.filter((s) => stageOf(s) === stage) : locked;
}

/** The stage of the next locked step, when the extras test can unlock it. */
export function extrasStage(state: CurriculumState, corpus: Corpus): StageId | null {
  const next = lockedExtras(state, corpus)[0];
  return next === undefined ? null : stageOf(next);
}

export interface ExtrasParams {
  /** Each tested punctuation mark and digit appears this often; capitals start at least this many sentences. */
  minPerStep: number;
  minCapitals: number;
  /** Words per sentence, before marks push it longer. */
  sentenceMin: number;
  sentenceMax: number;
  /** Common words the text is made of. */
  commonWords: number;
}

export const DEFAULT_EXTRAS_PARAMS: Readonly<ExtrasParams> = Object.freeze({
  minPerStep: 2,
  minCapitals: 5,
  sentenceMin: 4,
  sentenceMax: 6,
  commonWords: 300,
});

/**
 * The test text for `steps` (locked steps, in unlock order): sentences of
 * common words that start with a capital once capitals are unlocked or
 * tested, end with a tested or unlocked sentence mark, and carry each tested
 * mark and digit at least `minPerStep` times.
 */
export function extrasText(
  corpus: Corpus,
  state: CurriculumState,
  steps: readonly string[],
  rand: () => number = Math.random,
  p: ExtrasParams = DEFAULT_EXTRAS_PARAMS,
): string {
  const letters = state.unlocked.filter(isLetter);
  const open = new Set([...openChars(state), ...steps.flatMap((s) => stepChars(s, letters, state.layout))]);
  const blocked = corpusFilter(corpus);
  const pool = eligibleWords(corpus, new Set(letters)).slice(0, p.commonWords).filter((w) => w.length > 1);
  const used = new Set<string>();
  const word = () => {
    for (let tries = 0; tries < 50; tries++) {
      const w = pool[Math.floor(rand() * pool.length)];
      if (!used.has(w) || tries === 49) {
        used.add(w);
        return w;
      }
    }
    return pool[0] ?? 'a';
  };
  const shuffle = <T>(xs: T[]) => {
    for (let i = xs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [xs[i], xs[j]] = [xs[j], xs[i]];
    }
    return xs;
  };
  const repeat = (xs: readonly string[]) => xs.flatMap((s) => Array.from({ length: p.minPerStep }, () => s));

  const enders = shuffle(repeat(steps.filter((s) => ENDERS.has(s) || SENTENCE_WRAPS.has(s))));
  const marks = shuffle(repeat(steps.filter((s) => !isLetter(s) && s !== CAPITALS && !ENDERS.has(s) && !SENTENCE_WRAPS.has(s)
    && !/^\p{Nd}$/u.test(s))));
  // Digits go into numbers of two or three.
  const digitList = shuffle(repeat(steps.filter((s) => /^\p{Nd}$/u.test(s))));
  const numbers: string[] = [];
  while (digitList.length > 0) numbers.push(digitList.splice(0, digitList.length === 4 ? 2 : Math.min(3, digitList.length)).join(''));

  const capitals = [...open].some((c) => c !== c.toLowerCase());
  const fillEnders = ['.', '?', '!'].filter((c) => open.has(c));
  const count = Math.max(2, enders.length, Math.ceil(marks.length / 2), Math.ceil(numbers.length / 2),
    steps.includes(CAPITALS) ? p.minCapitals : 0);

  // Each sentence: its words, then the marks and numbers dealt out to it.
  const sentences = Array.from({ length: count }, () => ({ marks: [] as string[], numbers: [] as string[] }));
  marks.forEach((m, i) => sentences[i % count].marks.push(m));
  numbers.forEach((n, i) => sentences[(count - 1 - i % count)].numbers.push(n));

  const out: string[] = [];
  sentences.forEach((s, i) => {
    const length = Math.max(p.sentenceMin + Math.floor(rand() * (p.sentenceMax - p.sentenceMin + 1)), s.marks.length + 2);
    const tokens = Array.from({ length }, word);
    const up = tokens[0][0].toUpperCase();
    if (capitals && open.has(up)) tokens[0] = up + tokens[0].slice(1);
    // Marks after a word or joining two (, ; : -) stay off the last word; wraps go anywhere.
    const free = shuffle([...tokens.keys()].slice(0, -1));
    const wrapAt = shuffle([...tokens.keys()]);
    const taken = new Set<number>();
    for (const m of s.marks) {
      const wrap = WORD_WRAPS.get(m);
      const at = (wrap ? wrapAt : free).find((k) => !taken.has(k)) ?? (wrap ? wrapAt[0] : free[0] ?? 0);
      taken.add(at);
      if (wrap) tokens[at] = wrap[0] + tokens[at] + wrap[1];
      else if (m === '-') {
        let next = word();
        for (let tries = 0; tries < 10 && blocked(tokens[at].toLowerCase() + next); tries++) next = word();
        tokens[at] += '-' + next;
      } else tokens[at] += m;
    }
    // Numbers stand between words, never first, so the sentence still opens with its capital.
    for (const n of s.numbers) tokens.splice(1 + Math.floor(rand() * tokens.length), 0, n);
    const end = enders[i] ?? (fillEnders.length > 0 ? fillEnders[Math.floor(rand() * fillEnders.length)] : '');
    const pair = SENTENCE_WRAPS.get(end);
    if (pair) {
      tokens[0] = pair[0] + tokens[0];
      tokens[tokens.length - 1] += pair[1];
    } else tokens[tokens.length - 1] += end;
    out.push(...tokens);
  });
  return out.join(' ');
}

export interface ExtrasPlacement {
  state: CurriculumState;
  wpm: number;
  accuracy: number;
  /** Steps the test unlocked, in unlock order. */
  unlocked: string[];
  /** The first step that held the test back, if any. */
  stoppedAt: string | null;
}

/**
 * Unlocks the tested steps the learner typed cleanly, in unlock order, up to
 * the first one that went wrong, was slow or never came up. Pooled steps
 * (capitals, brackets) are judged on all their characters together. The bar
 * is the placement's: few errors, and a typical time within a multiple of the
 * learner's level target, looser for characters typed with Shift or AltGr.
 */
export function placeExtras(
  events: readonly KeystrokeEvent[],
  state: CurriculumState,
  steps: readonly string[],
  p: PlacementParams = DEFAULT_PLACEMENT_PARAMS,
  dp: DrillParams = DEFAULT_DRILL_PARAMS,
): ExtrasPlacement {
  const { wpm, accuracy } = placementResult(events);
  const next: CurriculumState = { ...state, unlocked: [...state.unlocked] };
  const letters = state.unlocked.filter(isLetter);

  const stats = new Map<string, { n: number; errors: number; logs: number[] }>();
  for (const a of firstAttempts(events)) {
    const s = stats.get(a.expected) ?? { n: 0, errors: 0, logs: [] };
    s.n++;
    if (a.error) s.errors++;
    if (a.logLatency !== null) s.logs.push(a.logLatency);
    stats.set(a.expected, s);
  }
  const passes = (step: string) => {
    const chars = stepChars(step, letters, state.layout);
    const all = chars.map((c) => stats.get(c)).filter((s) => s !== undefined);
    const n = all.reduce((sum, s) => sum + s.n, 0);
    const errors = all.reduce((sum, s) => sum + s.errors, 0);
    if (n === 0) return false;
    // A pooled step has more tries, so it may have a few more slips at the same rate.
    if (errors > Math.max(p.maxLetterErrors, Math.floor(n * 0.15)) || errors / n > p.maxLetterErrorRate) return false;
    const logs = all.flatMap((s) => s.logs).sort((a, b) => a - b);
    if (logs.length === 0) return true;
    const slack = p.latencySlack * (needsShift(step, state.layout) ? dp.shiftLatencySlack : 1);
    return Math.exp(logs[Math.floor(logs.length / 2)]) <= unlockTargetMs(state.tier, dp) * slack;
  };

  const unlocked: string[] = [];
  let stoppedAt: string | null = null;
  for (const step of steps) {
    if (!passes(step)) {
      stoppedAt = step;
      break;
    }
    unlocked.push(step);
    next.unlocked.push(step);
  }
  return { state: next, wpm, accuracy, unlocked, stoppedAt };
}
