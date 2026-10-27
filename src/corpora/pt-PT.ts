import type { Corpus } from '../corpus';
import sentences from './pt-PT-sentences';
import words from './pt-PT-words';

// The 10,000 most common European Portuguese words, most frequent first, lowercase,
// in this variant's spelling. Regenerate with scripts/build-corpus.py.
export const ptPT: Corpus = {
  language: 'pt-PT',
  name: 'Português (Portugal)',
  words: words.trim().split(/\s+/),
  // Portuguese letter frequency. ã and ç come early among the accented letters,
  // as they are in so many words (não, ação); k, w and y only in loanwords.
  unlockOrder: [...'eaosridmnutcplvqfgãbhéçázjíêxóúõàâôwyk'],
  // Straight quotes: “ ” are on neither Portuguese keyboard.
  punctuation: ['.', ',', '?', '!', '-', ':', ';', '"', '()', "'"],
  sentences,
};
