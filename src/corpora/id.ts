import type { Corpus } from '../corpus';
import sentences from './id-sentences';
import words from './id-words';

// The 10,000 most common Indonesian words, most frequent first, lowercase.
// Regenerate with scripts/build-corpus.py.
export const id: Corpus = {
  language: 'id',
  name: 'Bahasa Indonesia',
  words: words.trim().split(/\s+/),
  // Indonesian letter frequency: a, n, i, e, u and k already make words
  // (ini, anak, akan, ikan). f, v, z and q only turn up in loanwords, and x
  // not at all among the common words ("taksi").
  unlockOrder: [...'anieuktrsmdglbphyojcwfvzq'],
  // Straight quotes like every corpus typed on US QWERTY.
  punctuation: ['.', ',', '?', '!', '-', ':', ';', '"', '()', "'"],
  sentences,
  // Indonesian is not in the offensive-word lists (src/wordfilter.ts), so its common swear words are blocked here.
  blockedSubstrings: [
    'kontol', 'memek', 'ngentot', 'ngewe', 'jembut', 'pepek', 'peler', 'bangsat', 'bajingan', 'brengsek',
    'goblok', 'tolol', 'kampret', 'jancuk', 'pantek', 'lonte', 'pelacur', 'bokep', 'toket', 'sange', 'perek',
  ],
};
