import type { Corpus } from '../corpus';
import sentences from './pt-BR-sentences';
import words from './pt-BR-words';

// The 10,000 most common Brazilian Portuguese words, most frequent first, lowercase,
// in this variant's spelling. Regenerate with scripts/build-corpus.py.
export const ptBR: Corpus = {
  language: 'pt-BR',
  name: 'Português (Brasil)',
  words: words.trim().split(/\s+/),
  // Portuguese letter frequency. ã and ç come early among the accented letters,
  // as they are in so many words (não, ação); k, w and y only in loanwords.
  unlockOrder: [...'eaosridmnutcplvqgfãbhéçázjíêxóúõàâôwky'],
  // Straight quotes: “ ” are on neither Portuguese keyboard.
  punctuation: ['.', ',', '?', '!', '-', ':', ';', '"', '()', "'"],
  sentences,
};
