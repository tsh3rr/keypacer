import {
  FEEDBACK_KINDS, MAX_MESSAGE, TECH_KEYS, isEmail, markShown, shouldPrompt,
  type FeedbackKind, type PromptState, type Tech,
} from './feedback';
import { legalHref, t, tNodes, type MessageKey } from './i18n';
import { captchaEnabled, captchaToken } from './sync/captcha';

/**
 * The feedback card under a round's result and the feedback form (see
 * feedback.ts for when the card appears). The form posts to /api/feedback.
 */

export const FEEDBACK_ON = __FEEDBACK__;

const STORE_KEY = 'typing-trainer.feedback';
const BUBBLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

const KIND_LABELS: Record<FeedbackKind, MessageKey> = { idea: 'feedback.kindIdea', bug: 'feedback.kindBug', praise: 'feedback.kindPraise' };
const ERRORS: Record<string, MessageKey> = {
  empty: 'feedback.empty', badEmail: 'feedback.badEmail',
  tooMany: 'feedback.tooMany', captcha: 'feedback.failed', unavailable: 'feedback.failed',
};

export interface FeedbackDeps {
  promptEl: HTMLElement;
  popEl: HTMLElement;
  /** The details sent when the learner leaves "Include technical details" on. */
  tech: () => Tech;
  /** The signed-in address, offered when a reply is wanted. */
  email: () => string | null;
  /** Back to the typing field once the form or the card is gone. */
  refocus: () => void;
}

function load(): PromptState {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}

function save(s: PromptState): void {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* the card may come back; harmless */ }
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string) =>
  Object.assign(document.createElement(tag), { className: cls }, text === undefined ? {} : { textContent: text });

function button(label: string, cls: string, onClick: () => void): HTMLButtonElement {
  const b = el('button', cls, label);
  b.type = 'button';
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  return b;
}

export function createFeedback(deps: FeedbackDeps) {
  const { promptEl, popEl } = deps;
  // The first run with this feature starts the clock for "not on the first day".
  if (FEEDBACK_ON) {
    const s = load();
    if (s.firstSeenAt === undefined) save({ ...s, firstSeenAt: Date.now() });
  }

  // --- The card ---

  function renderPrompt(): void {
    const icon = el('span', 'fb-ico');
    icon.innerHTML = BUBBLE;
    const text = el('div', 'fb-prompt-text');
    text.append(el('b', '', t('feedback.promptTitle')), el('span', '', t('feedback.promptText')));
    const actions = el('div', 'fb-prompt-actions');
    actions.append(
      button(t('feedback.open'), 'primary', () => {
        hidePrompt();
        open();
      }),
      button(t('feedback.later'), 'link-btn', () => {
        hidePrompt();
        deps.refocus();
      }),
    );
    const never = button('✕', 'icon-btn fb-never', () => {
      save({ ...load(), done: true });
      hidePrompt();
      deps.refocus();
    });
    never.title = t('feedback.never');
    never.setAttribute('aria-label', t('feedback.never'));
    promptEl.replaceChildren(icon, text, actions, never);
  }

  /** Shows the card under this result if it is due; returns whether it did. */
  function maybePrompt(drills: number): boolean {
    if (!FEEDBACK_ON) return false;
    const s = load();
    const now = Date.now();
    if (!shouldPrompt(s, drills, now)) return false;
    save(markShown(s, drills, now));
    renderPrompt();
    promptEl.hidden = false;
    return true;
  }

  function hidePrompt(): void {
    promptEl.hidden = true;
  }

  // --- The form ---

  let kind: FeedbackKind = 'idea';
  let message = '';
  let reply = false;
  let email = '';
  let withTech = true;
  let stage: 'form' | 'sending' | 'done' = 'form';
  let error = '';
  /** Where the reply goes, for the thank-you. */
  let sentTo = '';

  function closeButton(): HTMLButtonElement {
    const b = button('✕', 'icon-btn', close);
    b.setAttribute('aria-label', t('feedback.close'));
    return b;
  }

  function renderDone(): void {
    const card = el('div', 'ob-card method-card fb-card fb-done');
    const check = el('span', 'fb-check');
    check.innerHTML = CHECK;
    const title = el('h2', '', t('feedback.doneTitle'));
    title.id = 'feedback-title';
    const note = sentTo ? t('feedback.doneReply', { email: sentTo }) : t('feedback.doneNote');
    card.append(check, title, el('p', '', note), button(t('feedback.back'), 'primary', close));
    popEl.replaceChildren(card);
    card.querySelector<HTMLButtonElement>('button.primary')?.focus();
  }

  function renderForm(): void {
    const card = el('form', 'ob-card method-card fb-card');
    card.noValidate = true;
    card.addEventListener('submit', (e) => {
      e.preventDefault();
      void send();
    });

    const head = el('div', 'ob-head');
    const title = el('h2', '', t('feedback.title'));
    title.id = 'feedback-title';
    head.append(title, closeButton());

    const kindField = el('div', 'ob-field');
    const kindLabel = el('span', 'ob-label', t('feedback.kind'));
    kindLabel.id = 'feedback-kind';
    const seg = el('div', 'segmented fb-seg');
    seg.setAttribute('role', 'radiogroup');
    seg.setAttribute('aria-labelledby', 'feedback-kind');
    for (const k of FEEDBACK_KINDS) {
      const b = button(t(KIND_LABELS[k]), '', () => {
        kind = k;
        seg.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-checked', String(FEEDBACK_KINDS[i] === k)));
      });
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(k === kind));
      seg.append(b);
    }
    kindField.append(kindLabel, seg);

    const text = el('textarea', 'fb-text');
    text.value = message;
    text.maxLength = MAX_MESSAGE;
    text.placeholder = t('feedback.placeholder');
    text.setAttribute('aria-label', t('feedback.title'));
    const count = el('span', 'fb-count', `${message.length} / ${MAX_MESSAGE}`);
    count.setAttribute('aria-hidden', 'true');
    text.addEventListener('input', () => {
      message = text.value;
      count.textContent = `${message.length} / ${MAX_MESSAGE}`;
    });

    const replyBox = checkbox(t('feedback.reply'), t('feedback.replyHint'), reply, (on) => {
      reply = on;
      if (on && !email) email = deps.email() ?? '';
      renderForm();
      if (on) popEl.querySelector<HTMLInputElement>('.fb-mail')?.focus();
    });
    const parts: HTMLElement[] = [head, el('p', 'ob-intro', t('feedback.intro')), kindField, text, count, replyBox];
    if (reply) {
      const mail = el('input', 'fb-mail');
      Object.assign(mail, { type: 'email', value: email, autocomplete: 'email', placeholder: t('feedback.emailPlaceholder') });
      mail.setAttribute('aria-label', t('feedback.emailLabel'));
      mail.addEventListener('input', () => { email = mail.value; });
      parts.push(mail);
    }
    parts.push(checkbox(t('feedback.tech'), t('feedback.techHint'), withTech, (on) => {
      withTech = on;
      renderForm();
    }));
    if (withTech) {
      const tech = deps.tech();
      const box = el('div', 'fb-tech');
      box.textContent = t('feedback.techPreview', Object.fromEntries(TECH_KEYS.map((k) => [k, tech[k] ?? '–'])));
      parts.push(box);
    }
    // Turnstile shows a checkbox here only when it is unsure.
    const captchaHost = el('div', 'fb-captcha');
    parts.push(captchaHost);
    // A field people never see or reach; bots fill it in (checked by the worker).
    const trap = el('input', 'fb-trap');
    Object.assign(trap, { type: 'text', name: 'website', tabIndex: -1, autocomplete: 'off' });
    trap.setAttribute('aria-hidden', 'true');
    parts.push(trap);
    if (error) parts.push(el('p', 'account-error fb-error', error));

    const privacy = Object.assign(el('a', '', t('feedback.privacy')), { href: legalHref('/datenschutz'), target: '_blank', rel: 'noopener' });
    const note = el('p', 'ob-note');
    note.append(...tNodes('feedback.note', { privacy }));
    const submit = el('button', 'primary', t(stage === 'sending' ? 'feedback.sending' : 'feedback.send'));
    submit.type = 'submit';
    submit.disabled = stage === 'sending';
    const btns = el('div', 'fb-btns');
    btns.append(button(t('feedback.cancel'), 'link-btn', close), submit);
    const foot = el('div', 'fb-foot');
    foot.append(note, btns);
    parts.push(foot);

    card.append(...parts);
    popEl.replaceChildren(card);
  }

  function checkbox(label: string, hint: string, checked: boolean, onChange: (on: boolean) => void): HTMLLabelElement {
    const wrap = el('label', 'fb-opt');
    const box = el('input');
    box.type = 'checkbox';
    box.checked = checked;
    box.addEventListener('change', () => onChange(box.checked));
    const words = el('span', '', label);
    words.append(el('small', '', hint));
    wrap.append(box, words);
    return wrap;
  }

  async function send(): Promise<void> {
    if (stage === 'sending') return;
    const trap = popEl.querySelector<HTMLInputElement>('.fb-trap')?.value ?? '';
    if (!message.trim()) return showError(t('feedback.empty'), '.fb-text');
    if (reply && !isEmail(email.trim())) return showError(t('feedback.badEmail'), '.fb-mail');
    stage = 'sending';
    error = '';
    renderForm();
    try {
      const token = captchaEnabled ? await captchaToken(popEl.querySelector<HTMLElement>('.fb-captcha')!) : undefined;
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind, message, email: reply ? email.trim() : undefined, tech: withTech ? deps.tech() : undefined, token, website: trap,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? String(res.status));
      }
      sentTo = reply ? email.trim() : '';
      save({ ...load(), done: true });
      message = '';
      stage = 'done';
      renderDone();
    } catch (err) {
      console.error('Feedback failed', err);
      stage = 'form';
      error = t(ERRORS[(err as Error).message] ?? 'feedback.failed');
      renderForm();
    }
  }

  function showError(text: string, field: string): void {
    error = text;
    renderForm();
    popEl.querySelector<HTMLElement>(field)?.focus();
  }

  function open(): void {
    hidePrompt();
    stage = 'form';
    error = '';
    renderForm();
    popEl.hidden = false;
    popEl.querySelector<HTMLTextAreaElement>('.fb-text')?.focus();
  }

  function close(): void {
    // A message on its way finishes in the background; what was typed stays for next time.
    if (stage === 'done') stage = 'form';
    popEl.hidden = true;
    deps.refocus();
  }

  popEl.addEventListener('keydown', (e) => {
    // Keys typed here are not practice; Esc closes only this.
    e.stopPropagation();
    if (e.key === 'Escape') close();
  });
  popEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target === popEl) close();
  });

  return {
    maybePrompt,
    hidePrompt,
    open,
    get isOpen() { return !popEl.hidden; },
    /** Redraws in a new interface language. */
    retranslate(): void {
      if (!promptEl.hidden) renderPrompt();
      if (popEl.hidden) return;
      if (stage === 'done') renderDone();
      else renderForm();
    },
  };
}
