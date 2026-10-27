/**
 * In-app feedback: when to ask for it, and what a message looks like on its
 * way to the server (src/worker/index.ts), which mails it to
 * feedback@keypacer.com through Resend.
 *
 * Asking is rare and never interrupts typing: a quiet card under a round's
 * result, only once the learner knows the app, at most three times, never
 * again after ✕ or a sent message. "Give feedback" in the settings and the
 * footer is always there.
 *
 * Shared by the app and the worker, so both check a message the same way.
 */

export const FEEDBACK_KINDS = ['idea', 'bug', 'praise'] as const;
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

export const MAX_MESSAGE = 2000;
const MAX_EMAIL = 254;
const MAX_TECH_VALUE = 300;

/** The technical details a learner can choose to send, nothing else (see the privacy policy). */
export const TECH_KEYS = ['version', 'uiLanguage', 'language', 'layout', 'drills', 'browser', 'window'] as const;
export type TechKey = (typeof TECH_KEYS)[number];
export type Tech = Partial<Record<TechKey, string>>;

export interface FeedbackMessage {
  kind: FeedbackKind;
  message: string;
  /** Only when the learner asked for a reply. */
  email?: string;
  tech?: Tech;
}

export type FeedbackProblem = 'empty' | 'tooLong' | 'badEmail' | 'badRequest';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(s: string): boolean {
  return s.length <= MAX_EMAIL && EMAIL.test(s);
}

/** Checks a message as it arrives (JSON from the form); trims, and drops unknown fields. */
export function parseFeedback(raw: unknown): { ok: true; value: FeedbackMessage } | { ok: false; problem: FeedbackProblem } {
  if (!raw || typeof raw !== 'object') return { ok: false, problem: 'badRequest' };
  const r = raw as Record<string, unknown>;
  if (!FEEDBACK_KINDS.includes(r.kind as FeedbackKind) || typeof r.message !== 'string') return { ok: false, problem: 'badRequest' };
  const message = r.message.trim();
  if (!message) return { ok: false, problem: 'empty' };
  if (message.length > MAX_MESSAGE) return { ok: false, problem: 'tooLong' };
  const value: FeedbackMessage = { kind: r.kind as FeedbackKind, message };
  if (r.email !== undefined && r.email !== '') {
    const email = typeof r.email === 'string' ? r.email.trim() : '';
    if (!isEmail(email)) return { ok: false, problem: 'badEmail' };
    value.email = email;
  }
  if (r.tech && typeof r.tech === 'object') {
    const tech: Tech = {};
    for (const k of TECH_KEYS) {
      const v = (r.tech as Record<string, unknown>)[k];
      if (typeof v === 'string' || typeof v === 'number') tech[k] = String(v).slice(0, MAX_TECH_VALUE);
    }
    if (Object.keys(tech).length) value.tech = tech;
  }
  return { ok: true, value };
}

const KIND_NAMES: Record<FeedbackKind, string> = { idea: 'Idee', bug: 'Etwas klappt nicht', praise: 'Lob' };
const TECH_NAMES: Record<TechKey, string> = {
  version: 'Version',
  uiLanguage: 'Oberfläche',
  language: 'Übungssprache',
  layout: 'Layout',
  drills: 'Übungen',
  browser: 'Browser',
  window: 'Fenster',
};

/** The e-mail the owner gets, in German: subject and plain text. */
export function feedbackMail(f: FeedbackMessage): { subject: string; text: string } {
  const firstLine = f.message.replace(/\s+/g, ' ');
  const preview = firstLine.length > 60 ? `${firstLine.slice(0, 59)}…` : firstLine;
  const lines = [
    `Art: ${KIND_NAMES[f.kind]}`,
    `Antwort erwünscht: ${f.email ? `ja, an ${f.email} (einfach auf Antworten drücken)` : 'nein'}`,
    '',
    f.message,
  ];
  if (f.tech) {
    lines.push('', '—', 'Technische Angaben:');
    for (const k of TECH_KEYS) if (f.tech[k] !== undefined) lines.push(`${TECH_NAMES[k]}: ${f.tech[k]}`);
  }
  return { subject: `[Keypacer Feedback · ${KIND_NAMES[f.kind]}] ${preview}`, text: lines.join('\n') };
}

// --- When to ask ---

export interface PromptState {
  /** First time the app ran with this feature, ms. */
  firstSeenAt?: number;
  /** How often the card has been shown. */
  shown?: number;
  lastShownAt?: number;
  /** Rounds done when it was last shown. */
  lastShownDrills?: number;
  /** ✕ was pressed, or feedback was sent: never ask again. */
  done?: boolean;
}

export const PROMPT_RULES = {
  /** Rounds before the first ask, so the learner knows the app. */
  minDrills: 8,
  maxShown: 3,
  /** After "Not now": at least this long and this many rounds before the next ask. */
  againDays: 14,
  againDrills: 30,
};

const DAY = 86_400_000;
const localDay = (ms: number) => {
  const d = new Date(ms);
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
};

/** Whether the card may appear under this round's result. */
export function shouldPrompt(s: PromptState, drills: number, now: number, rules = PROMPT_RULES): boolean {
  if (s.done || (s.shown ?? 0) >= rules.maxShown || drills < rules.minDrills) return false;
  // Not on the first day: a learner who has come back is a better judge.
  if (s.firstSeenAt === undefined || localDay(s.firstSeenAt) === localDay(now)) return false;
  if (!s.shown) return true;
  return now - (s.lastShownAt ?? 0) >= rules.againDays * DAY && drills - (s.lastShownDrills ?? 0) >= rules.againDrills;
}

export function markShown(s: PromptState, drills: number, now: number): PromptState {
  return { ...s, shown: (s.shown ?? 0) + 1, lastShownAt: now, lastShownDrills: drills };
}
