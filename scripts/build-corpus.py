#!/usr/bin/env python3
"""Regenerate a frequency-ranked word list for one language.

Usage (from the repo root):
    python -m pip install "wordfreq==3.1.1" "pyspellchecker==0.9.0" "spylls==0.1.7"
    python scripts/build-corpus.py en 10000
    python scripts/build-corpus.py de 10000
    (likewise fr, es, it, pl, pt-BR, pt-PT, id)

Writes src/corpora/<lang>-words.ts. The word data comes from wordfreq
(https://github.com/rspeer/wordfreq), whose word lists are licensed under
CC BY-SA 4.0, so the generated file is too (see its header).

wordfreq folds German "ß" to "ss" and keeps stray English words and names, so
for German each word is checked against pyspellchecker's German frequency list
(https://github.com/barrust/pyspellchecker, from OpenSubtitles via
https://github.com/hermitdave/FrequencyWords): the spelling it uses most
("straße", but "dass") is kept, and words it doesn't know are dropped.
French and Italian words are checked against pyspellchecker's lists the same
way (spelling unchanged), which drops names and stray English. Its Spanish list
misses common words, so Spanish and Polish (which it lacks) instead drop words
wordfreq finds more often in English than in the language itself.
pyspellchecker is only needed for German, French and Italian.

wordfreq has one Portuguese list for Brazil and Portugal, so each variant
keeps the words its LibreOffice Hunspell dictionary accepts (checked with
spylls, https://github.com/zverok/spylls): "econômico" and "ônibus" for
Brazil, "económico" for Portugal. The Brazilian dictionary also takes names
and English in lowercase, so a word Portugal's rejects must be neither a name
nor a common English word, and a short hand-picked list (EXCLUDE) catches the
rest. Words wordfreq finds more often in English are left out either way.

Indonesian is checked against LibreOffice's Indonesian Hunspell dictionary the
same way. It misses many words with a suffix ("harusnya", "tinggalkan"), so a
word it rejects is kept when it is a word it knows plus -nya, -lah, -kah, -pun,
-kan, -ku or -mu (or -an and -i on a stem of four letters or more, so names like
"toni" stay out). Names, English words and abbreviations ("yg", "km") are left
out, and two-letter words must be on a short list.

spylls is only needed for Portuguese and Indonesian; the dictionaries are
downloaded once into ~/.cache/keypacer-dictionaries.
"""

import itertools
import re
import sys
from importlib.metadata import version
from pathlib import Path

import wordfreq

# Letters a language's practice words may use. Words with digits, apostrophes,
# hyphens or other letters are left out until those keys are drilled.
LETTERS = {
    "en": "abcdefghijklmnopqrstuvwxyz",
    "de": "abcdefghijklmnopqrstuvwxyzäöüß",
    "fr": "abcdefghijklmnopqrstuvwxyzàâæçéèêëîïôœùûüÿ",
    "es": "abcdefghijklmnopqrstuvwxyzáéíóúüñ",
    # í, ó and ú only turn up in loanwords and names.
    "it": "abcdefghijklmnopqrstuvwxyzàèéìòù",
    "pl": "abcdefghijklmnopqrstuvwxyząćęłńóśźż",
    # ü left Brazilian spelling in 2009; k, w and y only turn up in loanwords.
    "pt-BR": "abcdefghijklmnopqrstuvwxyzáàâãçéêíóôõú",
    "pt-PT": "abcdefghijklmnopqrstuvwxyzáàâãçéêíóôõú",
    # Indonesian has no accented letters.
    "id": "abcdefghijklmnopqrstuvwxyz",
}

# wordfreq's code for languages whose variants share one list.
WORDFREQ_LANG = {"pt-BR": "pt", "pt-PT": "pt"}

# Variants whose words are checked against a LibreOffice Hunspell dictionary
# (https://github.com/LibreOffice/dictionaries, pinned to one commit).
HUNSPELL = {"pt-BR": "pt_BR", "pt-PT": "pt_PT"}
HUNSPELL_COMMIT = "4f1df64b2e8e14751aa7c2205d170ca016071315"
# The folder of a dictionary in that repository, where it isn't named like the dictionary.
HUNSPELL_DIR = {"id_ID": "id"}

# Indonesian suffixes (see the docstring): any stem, and the ones that need a longer stem.
ID_SUFFIXES = ("nya", "lah", "kah", "pun", "kan", "ku", "mu")
ID_SHORT_SUFFIXES = ("an", "i")
# Two-letter Indonesian words; the rest of wordfreq's are abbreviations and chat ("yg", "lu").
ID_TWO_LETTER = {"di", "ke", "ya", "ia", "ku", "mu", "si", "ah", "eh", "es", "bu"}

# Names, acronyms and misspellings that get past the checks above, picked by hand
# from the words only one variant's list has.
EXCLUDE = {
    "pt-BR": set("""
        antônio souza moscou botafogo amazônia camila irã maracanã caribe noel renata beto lana iguaçu
        lu bianca melissa tijuca luna maceió mara luana enrique marcela fabiano juazeiro val silas caracas
        mari roberta ava ibope estadão sus vip qui mai var ão sera politica porno pornô playboy manaus
        alagoas vargas armênia mônica polônia macedônia guarulhos sic objectivo excepto excepção ceará
    """.split()),
    "pt-PT": {"jean", "prof", "sra", "dra", "ceará"},
    "id": {"abdullah", "penisku"},
}

# wordfreq splits "fazê-lo" into "fazê" and "lo". The pronouns that only come
# after a hyphen, and "tê" (from "tê-lo"), are no words on their own.
CLITIC_PARTS = {"lo", "la", "los", "las", "ta", "tê"}

# Languages whose words are checked against pyspellchecker (see the docstring).
SPELLCHECK = {"de", "fr", "it"}

# Languages whose words are dropped when wordfreq finds them more often in English.
NOT_ENGLISH = {"es", "pl"}

# One-letter tokens that are real words; others ("s", "t", "m") come from
# split contractions and abbreviations.
SINGLE_LETTER_WORDS = {
    "en": {"a", "i"},
    "de": set(),
    "fr": {"a", "à", "y"},
    "es": {"a", "e", "o", "u", "y"},
    "it": {"a", "e", "è", "i", "o"},
    "pl": {"a", "i", "o", "u", "w", "z"},
    "pt-BR": {"a", "à", "e", "é", "o"},
    "pt-PT": {"a", "à", "e", "é", "o"},
    "id": set(),
}

LINE_WIDTH = 100

SPELLCHECK_NOTE = """
// The choice of words checked against pyspellchecker's word
// frequencies (https://github.com/barrust/pyspellchecker), built from OpenSubtitles 2018
// by Hermit Dave (https://github.com/hermitdave/FrequencyWords, CC BY-SA 4.0)."""


HUNSPELL_NOTE = """
// Only words the {name} Hunspell dictionary of LibreOffice accepts are kept
// (https://github.com/LibreOffice/dictionaries/tree/{commit}/{name}, {license}),
// which keeps this variant's spelling. Names, common English words and a few
// hand-picked names and misspellings are left out."""

HUNSPELL_LICENSE = {"pt_BR": "VERO, LGPLv3 / MPL", "pt_PT": "Universidade do Minho, GPL / LGPL / MPL"}

ID_NOTE = """
// Only words the id_ID Hunspell dictionary of LibreOffice accepts, alone or with a
// suffix such as -nya or -kan, are kept
// (https://github.com/LibreOffice/dictionaries/tree/{commit}/id, hunspell-id authors, LGPLv3).
// Names, English words, abbreviations and chat spellings are left out."""


def hunspell(name: str):
    """The LibreOffice dictionary `name` (e.g. "pt_BR"), downloaded once and cached."""
    import urllib.request
    from spylls.hunspell import Dictionary

    cache = Path.home() / ".cache" / "keypacer-dictionaries" / HUNSPELL_COMMIT[:12]
    cache.mkdir(parents=True, exist_ok=True)
    for ext in ("aff", "dic"):
        f = cache / f"{name}.{ext}"
        if not f.exists():
            folder = HUNSPELL_DIR.get(name, name)
            url = f"https://raw.githubusercontent.com/LibreOffice/dictionaries/{HUNSPELL_COMMIT}/{folder}/{name}.{ext}"
            urllib.request.urlretrieve(url, f)
    return Dictionary.from_files(str(cache / name))


def capitalized_entries(name: str) -> set[str]:
    """Lowercased stems the dictionary lists only with a capital: names of people and places."""
    hunspell(name)  # makes sure the files are there
    dic = Path.home() / ".cache" / "keypacer-dictionaries" / HUNSPELL_COMMIT[:12] / f"{name}.dic"
    stems = [line.split("/")[0].split("\t")[0].strip() for line in dic.read_text(encoding="utf-8-sig").splitlines()[1:]]
    lower = {s for s in stems if s[:1].islower()}
    # Places come with their state, "Souza-BA".
    return {re.sub("-[A-Z]{2}$", "", s).lower() for s in stems if s[:1].isupper()} - lower


def indonesian_filter():
    """Keeps Indonesian words the dictionary knows, alone or with a suffix (see the docstring)."""
    own = hunspell("id_ID")
    names = capitalized_entries("id_ID")

    def is_name(w: str) -> bool:
        return w in names and not any(f.stem[:1].islower() for f in own.lookuper.good_forms(w))

    def known(w: str) -> bool:
        if own.lookup(w):
            return True
        for suffix in ID_SUFFIXES + ID_SHORT_SUFFIXES:
            stem = w[: -len(suffix)]
            shortest = 4 if suffix in ID_SHORT_SUFFIXES else 3
            if w.endswith(suffix) and len(stem) >= shortest and own.lookup(stem) and not is_name(stem):
                return True
        return False

    def keep(w: str) -> str | None:
        if w in EXCLUDE["id"] or (len(w) == 2 and w not in ID_TWO_LETTER) or not known(w) or is_name(w):
            return None
        return w if wordfreq.zipf_frequency(w, "en") <= wordfreq.zipf_frequency(w, "id") else None

    return keep


def spelling_fixer(lang: str):
    """Maps a wordfreq word to its usual spelling, or None to drop it; identity if not needed."""
    if lang == "id":
        return indonesian_filter()
    if lang in HUNSPELL:
        own = hunspell(HUNSPELL[lang])
        # The Brazilian dictionary also takes names, brands and English in
        # lowercase ("souza", "twitter"). Portugal's is stricter, so a word it
        # rejects must pass two more checks: it is no name, and it is not a
        # common English word.
        strict = hunspell("pt_PT")
        names = capitalized_entries("pt_BR") | capitalized_entries("pt_PT")
        base = WORDFREQ_LANG[lang]

        def is_name(w: str) -> bool:
            # Portugal's dictionary knows it only with a capital ("Paulo"), or a
            # dictionary lists it with a capital and it is no form of a
            # lowercase word ("Souza-BA", but "registro" from "registrar").
            if strict.lookup(w.capitalize()):
                return True
            return w in names and not any(f.stem[:1].islower() for f in own.lookuper.good_forms(w))

        def keep(w: str) -> str | None:
            if w in EXCLUDE[lang] or w in CLITIC_PARTS or not own.lookup(w) or not re.search("[aeiouáàâãéêíóôõú]", w):
                return None
            # The verb before such a pronoun ("ajudá", "protegê"): Brazil's dictionary
            # takes it, Portugal's does not, and the infinitive is a word.
            if w[-1] in "áê" and not strict.lookup(w) and w != "bebê" and own.lookup(w[:-1] + {"á": "ar", "ê": "er"}[w[-1]]):
                return None
            if re.fullmatch("[ivxl]+", w) and len(w) > 1:  # Roman numerals
                return None
            if not strict.lookup(w) and (is_name(w) or wordfreq.zipf_frequency(w, "en") >= 3.9):
                return None
            return w if wordfreq.zipf_frequency(w, "en") <= wordfreq.zipf_frequency(w, base) else None

        return keep
    if lang in NOT_ENGLISH:
        return lambda w: w if wordfreq.zipf_frequency(w, "en") <= wordfreq.zipf_frequency(w, lang) else None
    if lang not in SPELLCHECK:
        return lambda w: w
    from spellchecker import SpellChecker

    freq = SpellChecker(language=lang).word_frequency

    if lang != "de":
        return lambda w: w if freq[w] > 0 else None

    def fix(w: str) -> str | None:
        # Every way of writing each "ss" as "ss" or "ß"; keep the most used one.
        parts = w.split("ss")
        variants = [
            "".join(p + s for p, s in zip(parts, [*joins, ""]))
            for joins in itertools.product(["ss", "ß"], repeat=len(parts) - 1)
        ]
        best = max(variants, key=lambda v: freq[v])
        return best if freq[best] > 0 else None

    return fix


def build(lang: str, count: int) -> list[str]:
    allowed = re.compile(f"^[{LETTERS[lang]}]+$")
    singles = SINGLE_LETTER_WORDS.get(lang, set())
    fix = spelling_fixer(lang)
    words: list[str] = []
    seen: set[str] = set()
    # Ask for extra so filtering still leaves `count` words.
    for raw in wordfreq.top_n_list(WORDFREQ_LANG.get(lang, lang), count * 3, wordlist="best"):
        w = fix(raw) if allowed.match(raw) else None
        if w is None or (len(w) == 1 and w not in singles) or w in seen:
            continue
        seen.add(w)
        words.append(w)
        if len(words) == count:
            return words
    raise SystemExit(f"only {len(words)} words found for {lang}")


def note(lang: str) -> str:
    if lang == "id":
        return ID_NOTE.format(commit=HUNSPELL_COMMIT)
    if lang in HUNSPELL:
        name = HUNSPELL[lang]
        return HUNSPELL_NOTE.format(name=name, commit=HUNSPELL_COMMIT, license=HUNSPELL_LICENSE[name])
    if lang == "de":
        return SPELLCHECK_NOTE.replace("The choice of words", '"ss"/"ß" spelling and the choice of words')
    if lang in SPELLCHECK:
        return SPELLCHECK_NOTE
    if lang in NOT_ENGLISH:
        return "\n// Words wordfreq finds more often in English than in this language are left out."
    return ""


def render(lang: str, words: list[str]) -> str:
    lines: list[str] = []
    line = ""
    for w in words:
        if line and len(line) + 1 + len(w) > LINE_WIDTH:
            lines.append(line)
            line = w
        else:
            line = f"{line} {w}" if line else w
    lines.append(line)
    body = "\n".join(lines)
    return f"""// GENERATED by scripts/build-corpus.py, do not edit by hand.
// Regenerate: python scripts/build-corpus.py {lang} {len(words)}
//
// The {len(words)} most frequent {lang} words, most frequent first, from wordfreq {version('wordfreq')}
// (https://github.com/rspeer/wordfreq, "best" list), keeping only plain lowercase letters.{note(lang)}
//
// License: wordfreq's word list data is redistributable under CC BY-SA 4.0
// (https://creativecommons.org/licenses/by-sa/4.0/); this file is a derived work
// under the same license. wordfreq by Robyn Speer, built on data from Google Books
// Ngrams (http://books.google.com/ngrams), Wikipedia, the Leeds Internet Corpus,
// ParaCrawl, OPUS OpenSubtitles 2018 (http://www.opensubtitles.org/) and the SUBTLEX
// word lists by Marc Brysbaert et al., which are freely available data
// (http://crr.ugent.be/programs-data/subtitle-frequencies).

export default `
{body}
`;
"""


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    lang, count = sys.argv[1], int(sys.argv[2])
    if lang not in LETTERS:
        raise SystemExit(f"add the {lang} alphabet to LETTERS first")
    out = Path(__file__).resolve().parent.parent / "src" / "corpora" / f"{lang}-words.ts"
    out.write_text(render(lang, build(lang, count)), encoding="utf-8", newline="\n")
    print(f"wrote {count} words to {out}")


if __name__ == "__main__":
    main()
