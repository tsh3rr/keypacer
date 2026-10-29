/**
 * Text of the landing pages, one per interface language. Each page is its own
 * address (/, /de/, /es/, /pt-br/, …) so search engines can show it to people searching
 * in that language; render.ts turns this into static HTML at build time.
 *
 * Only claim what the app does: the method points mirror the "How it works"
 * step of the first-run setup (onboarding.method* in the locale files), and
 * the privacy cards the privacy policy (src/legal/content.ts).
 */

export const LANDING_LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'pl', 'pt-BR', 'pt-PT', 'id'] as const;
export type LandingLanguage = (typeof LANDING_LANGUAGES)[number];

/** Address of a landing page; English is the site's front page. Paths are lowercase: /pt-br/. */
export const landingPath = (lang: LandingLanguage): string => (lang === 'en' ? '/' : `/${lang.toLowerCase()}/`);

interface Item { title: string; text: string }

export interface LandingCopy {
  /** The language named in itself, for the language links. */
  name: string;
  /** Open Graph locale, e.g. de_DE. */
  ogLocale: string;
  /** Search result title, about 60 characters. */
  title: string;
  /** Search result snippet, about 155 characters. */
  description: string;
  /** `sections` labels the in-page links (method, features, faq); `skip` is the skip link. */
  nav: { languages: string; signIn: string; open: string; sections: string; method: string; features: string; faq: string; skip: string };
  /**
   * `continue` replaces `cta` for someone who has practised in this browser before.
   * `rotate`: more headlines the hero types out in turn after `title` (main.ts).
   */
  hero: { eyebrow: string; title: string; rotate: string[]; lead: string; cta: string; continue: string; note: string };
  demo: {
    label: string;
    start: string;
    /** Label above the result, in place of `label`. */
    result: string;
    /** Short (live counter) and long (under the big number in the result). */
    wpm: string;
    wpmLong: string;
    accuracy: string;
    slowTitle: string;
    slowNone: string;
    /** After the line: lesson 1 comes next (a beginner, see handoff.ts). */
    nextBeginner: string;
    ctaBeginner: string;
    /** ... or the rest of the placement test, {n} words, to skip ahead. */
    nextFast: string;
    ctaFast: string;
    again: string;
    /** Practice lines for the hero; one is picked at random. Plain text, no line breaks. */
    lines: string[];
  };
  facts: { label: string; items: { value: string; label: string }[] };
  method: { eyebrow: string; title: string; intro: string; items: Item[] };
  /** What is measured, next to an example table of weak keys (`example`: keys, weakest first, and the drill's focus). */
  analysis: {
    eyebrow: string;
    title: string;
    text: string;
    points: { chip: string; strong: string; text: string }[];
    tableTitle: string;
    tableNote: string;
    columns: [string, string, string];
    nextPrefix: string;
    nextSuffix: string;
    example: { keys: string[]; focus: string[] };
  };
  features: { eyebrow: string; title: string; items: Item[] };
  /**
   * Text inside the feature pictures (render.ts, main.ts).
   * `layouts`: captions for the QWERTZ, AZERTY, QWERTY and Dvorak tabs.
   * `fingerWord`: typed letter by letter on one row of the page's layout.
   * `skipped`: plural forms by Intl.PluralRules category, with {n}.
   */
  vignettes: {
    layouts: [string, string, string, string];
    fingerWord: string;
    letters: string;
    placing: string;
    skipped: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
    speed: string;
    weekGoal: string;
    lesson: string;
    laptop: string;
    tablet: string;
    stored: string;
  };
  privacy: { eyebrow: string; title: string; intro: string; items: (Item & { chips: [string, string] })[] };
  /**
   * Replaces the "0 trackers" fact and the first privacy item while visitor
   * statistics (Umami, vite.config.ts) are on.
   */
  analytics: { fact: string; item: Item & { chips: [string, string] } };
  faq: { title: string; items: { q: string; a: string }[] };
  final: { title: string; text: string; cta: string };
  foot: { imprint: string; privacy: string; terms: string };
}

export const COPY: Record<LandingLanguage, LandingCopy> = {
  en: {
    name: 'English',
    ogLocale: 'en_GB',
    title: 'Keypacer: free touch typing trainer that adapts to you',
    description:
      'Learn to touch type for free. Keypacer measures every keystroke, finds the keys that slow you down and builds each drill around them. No sign-up needed.',
    nav: { languages: 'Language', signIn: 'Sign in', open: 'Open the trainer', sections: 'Page sections', method: 'Method', features: 'Features', faq: 'Questions', skip: 'Skip to content' },
    hero: {
      eyebrow: 'Free · no sign-up · no ads',
      title: 'Learn to touch type with a trainer that understands your mistakes',
      rotate: [
        'Ten fingers. Ten minutes a day.',
        'Every drill targets your slowest keys',
        'Accuracy first, then speed',
      ],
      lead: 'Keypacer measures every keystroke, finds the keys and letter pairs that slow you down, and builds your next drill from them. So you never practise what you already know.',
      cta: 'Start practising for free',
      continue: 'Keep practising',
      note: 'Runs in your browser. No ads, no account needed.',
    },
    demo: {
      label: 'Try it: type the line',
      start: 'Click here and start typing',
      result: 'Your result',
      wpm: 'WPM',
      wpmLong: 'words per minute',
      accuracy: 'accuracy',
      slowTitle: 'These keys held you up:',
      slowNone: 'Accurate and steady. Let’s see how you do with the whole keyboard.',
      nextBeginner: 'Your first lesson: the six most common letters, then one new key at a time.',
      ctaBeginner: 'Start lesson 1',
      nextFast: 'You already type quite fast. About {n} more words in the trainer, then you skip the keys you already know.',
      ctaFast: 'Finish the placement test',
      again: 'Try another line',
      lines: [
        'the quick brown fox jumps over the lazy dog while the band plays on',
        'practice makes progress when you keep your eyes on the screen',
        'every key you learn without looking makes the next one easier',
      ],
    },
    facts: {
      label: 'Keypacer in numbers',
      items: [
        { value: '∞', label: 'drills that adapt to your skill' },
        { value: '1 min', label: 'to your first drill, no sign-up' },
        { value: '10,000', label: 'most common words per language' },
        { value: '0', label: 'cookies, trackers and ads' },
      ],
    },
    method: {
      eyebrow: 'The method',
      title: 'How you get faster',
      intro: 'No one-size-fits-all lessons. Every drill comes from the way you type, and gets more precise with every round.',
      items: [
        { title: 'One key at a time', text: 'You start with the six most common letters and type real words early on. The next key joins only once all the previous ones are accurate and fluent.' },
        { title: 'Accuracy first, then speed', text: 'A wrong key keeps you on the same letter until you hit the right one. When accuracy drops, the speed counter disappears until you type accurately again.' },
        { title: 'Targeted, not uniform', text: 'Every drill focuses on the keys and letter pairs that slow you down, and brings back keys you haven’t practised for a while so they stick.' },
        { title: 'Short rounds, real breaks', text: 'Warm-up, short focus rounds, then real sentences. When your concentration fades, Keypacer suggests a break instead of letting mistakes sink in.' },
      ],
    },
    analysis: {
      eyebrow: 'What Keypacer measures',
      title: 'Keypacer notices which keys slow you down',
      text: 'Do you hesitate for a moment before the q, or mix up b and v? You barely notice, but it costs you speed every time. Keypacer times every keystroke to the millisecond and builds your next drill from exactly those keys and letter pairs.',
      points: [
        { chip: '1×', strong: 'The first try counts.', text: 'A mistake stays a mistake, even if you correct it right away.' },
        { chip: '2s', strong: 'Thinking pauses don’t count.', text: 'Pauses of more than two seconds don’t distort your speed.' },
        { chip: '↺', strong: 'Nothing gets forgotten.', text: 'Keys you haven’t practised for a while come back for review.' },
      ],
      tableTitle: 'Weakest keys',
      tableNote: 'Example after three rounds',
      columns: ['Key', 'Errors', 'Time'],
      nextPrefix: 'Next drill focuses on',
      nextSuffix: 'and the pairs around them.',
      example: { keys: ['q', 'z', 'x', 'j', 'b'], focus: ['q', 'z', 'qu'] },
    },
    features: {
      eyebrow: 'Features',
      title: 'Everything you need, nothing you don’t',
      items: [
        { title: 'Your language, your keyboard', text: 'English, German, French, Spanish, Italian, Polish, Portuguese (Brazil and Portugal) or Indonesian, on QWERTY, QWERTZ, AZERTY, Dvorak, Colemak and more. Keypacer recognises your layout from the keys you press.' },
        { title: 'Finger guide', text: 'A keyboard under the text shows which finger is next. Keys you already know fade out bit by bit.' },
        { title: 'Placement test', text: 'Can already type a bit? Take a one-minute test and Keypacer skips every key you have already mastered.' },
        { title: 'Progress you can see', text: 'Speed and accuracy over time, an error heatmap and your slowest keys and letter pairs.' },
        { title: 'Weekly goal and plan', text: 'Set how often you want to practise and add the plan to your calendar. Short, regular sessions do more than long, occasional ones.' },
        { title: 'Carry on anywhere', text: 'With a free account your lessons are safe even if your browser data gets deleted, and you pick up where you left off on any device.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · German layout', 'Français · French layout', 'English · US layout', 'English · Dvorak'],
      fingerWord: 'glad',
      letters: 'Letters',
      placing: 'Placement running …',
      skipped: { one: '{n} key skipped', other: '{n} keys skipped' },
      speed: 'Speed',
      weekGoal: 'Weekly goal',
      lesson: 'Lesson',
      laptop: 'Laptop',
      tablet: 'Tablet',
      stored: 'Stored in Frankfurt, EU',
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'Your typing data stays with you',
      intro: 'Keypacer knows exactly how you type. That’s why this knowledge stays with you.',
      items: [
        { title: 'No cookies, no tracking', text: 'Keypacer sets no cookies, shows no ads and uses no analytics services.', chips: ['0 cookies', '0 trackers'] },
        { title: 'Without an account, it all stays in your browser', text: 'Your keystrokes are only stored locally. You can export or delete them at any time.', chips: ['.json', '.csv'] },
        { title: 'With an account, in the EU', text: 'The optional account syncs your rounds between your devices via servers in Frankfurt.', chips: ['Frankfurt', 'optional account'] },
      ],
    },
    analytics: {
      fact: 'cookies and ads',
      item: { title: 'No cookies, no ads', text: 'Keypacer sets no cookies and shows no ads. Visits are only counted anonymously, without cookies.', chips: ['0 cookies', 'anonymous stats'] },
    },
    faq: {
      title: 'Questions',
      items: [
        { q: 'Is Keypacer free?', a: 'Yes. Practising, progress and the optional account are free, with no ads.' },
        { q: 'What makes Keypacer different from other typing trainers?', a: 'Most trainers give everyone the same lessons. Keypacer measures every keystroke and builds each drill from the keys and letter pairs that slow you down most right now.' },
        { q: 'Do I need an account?', a: 'No. You can start right away; without an account your progress is saved in your browser. A free account keeps it safe even if your browser data is deleted, and lets you pick up where you left off on your other devices.' },
        { q: 'How long does it take to learn touch typing?', a: 'Most people can type without looking after a few weeks of 15 to 20 minutes a day. Short daily sessions work better than long, occasional ones, and speed keeps growing after that.' },
        { q: 'Which keyboard layouts are supported?', a: 'US and UK QWERTY, German and Swiss QWERTZ, French and Belgian AZERTY, Spanish, Italian, Swedish/Finnish, Polish, Brazilian ABNT2 and Portuguese layouts, Dvorak, Colemak and Colemak-DH. Keypacer detects your layout from the keys you press.' },
        { q: 'Does it work on a phone or tablet?', a: 'Keypacer is made for a real keyboard. A tablet with a keyboard works well; on a phone you can look around, but touch typing needs a physical keyboard.' },
      ],
    },
    final: { title: 'Your first drill takes two minutes', text: 'Type one line and Keypacer knows where to start.', cta: 'Start practising for free' },
    foot: { imprint: 'Legal notice', privacy: 'Privacy', terms: 'Terms' },
  },

  de: {
    name: 'Deutsch',
    ogLocale: 'de_DE',
    title: 'Zehnfingersystem lernen: kostenloser Tipptrainer | Keypacer',
    description:
      'Lerne das Zehnfingersystem kostenlos online. Keypacer misst jeden Tastendruck, erkennt die Tasten, die dich bremsen, und übt gezielt diese. Ohne Anmeldung.',
    nav: { languages: 'Sprache', signIn: 'Anmelden', open: 'Zum Training', sections: 'Seitenbereiche', method: 'Methode', features: 'Funktionen', faq: 'Fragen', skip: 'Zum Inhalt springen' },
    hero: {
      eyebrow: 'Kostenlos · ohne Anmeldung · ohne Werbung',
      title: 'Lerne das Zehnfingersystem mit einem Trainer, der deine Fehler versteht',
      rotate: [
        'Zehn Finger. Zehn Minuten am Tag.',
        'Jede Übung zielt auf deine langsamsten Tasten',
        'Erst sauber tippen, dann schnell',
      ],
      lead: 'Keypacer misst jeden Tastendruck, findet die Tasten und Buchstabenpaare, die dich bremsen, und baut daraus deine nächste Übung. So übst du nie, was du schon kannst.',
      cta: 'Jetzt kostenlos üben',
      continue: 'Weiter üben',
      note: 'Läuft im Browser. Keine Werbung, kein Konto nötig.',
    },
    demo: {
      label: 'Probier’s aus: tippe die Zeile',
      start: 'Hier klicken und lostippen',
      result: 'Dein Ergebnis',
      wpm: 'WpM',
      wpmLong: 'Wörter pro Minute',
      accuracy: 'Genauigkeit',
      slowTitle: 'Bei diesen Tasten hast du gezögert:',
      slowNone: 'Sauber und gleichmäßig. Mal sehen, wie es mit der ganzen Tastatur läuft.',
      nextBeginner: 'Deine erste Lektion: die sechs häufigsten Buchstaben, dann eine neue Taste nach der anderen.',
      ctaBeginner: 'Lektion 1 starten',
      nextFast: 'Du tippst schon ziemlich flott. Noch etwa {n} Wörter im Trainer, dann überspringst du die Tasten, die du schon kannst.',
      ctaFast: 'Einstufung abschließen',
      again: 'Andere Zeile tippen',
      lines: [
        'zwölf boxkämpfer jagen viktor quer über den großen sylter deich',
        'wer blind tippt, schaut auf den text und nicht auf die tasten',
        'jede taste, die du ohne hinsehen findest, macht die nächste leichter',
      ],
    },
    facts: {
      label: 'Keypacer in Zahlen',
      items: [
        { value: '∞', label: 'Übungen, die sich deinem Können anpassen' },
        { value: '1 Min', label: 'bis zur ersten Übung, ohne Anmeldung' },
        { value: '10 000', label: 'häufigste Wörter je Sprache' },
        { value: '0', label: 'Cookies, Tracker und Werbung' },
      ],
    },
    method: {
      eyebrow: 'Die Methode',
      title: 'So wirst du schneller',
      intro: 'Keine Einheitslektionen. Jede Übung entsteht aus der Art, wie du tippst, und wird mit jeder Runde genauer.',
      items: [
        { title: 'Eine Taste nach der anderen', text: 'Du startest mit den sechs häufigsten Buchstaben und tippst früh echte Wörter. Die nächste Taste kommt erst dazu, wenn alle bisherigen sicher und flüssig sitzen.' },
        { title: 'Erst sauber, dann schnell', text: 'Eine falsche Taste hält dich auf dem Buchstaben fest. Sinkt die Genauigkeit, verschwindet die Tempoanzeige, bis du wieder sauber tippst.' },
        { title: 'Gezielt statt gleichförmig', text: 'Jede Übung setzt auf die Tasten und Buchstabenpaare, die dich bremsen, und holt länger nicht geübte Tasten zurück, damit sie sitzen bleiben.' },
        { title: 'Kurze Runden, echte Pausen', text: 'Aufwärmen, kurze Fokusrunden, dann echte Sätze. Lässt deine Konzentration nach, schlägt Keypacer eine Pause vor, statt Fehler einzuschleifen.' },
      ],
    },
    analysis: {
      eyebrow: 'Was Keypacer misst',
      title: 'Keypacer merkt, welche Tasten dich bremsen',
      text: 'Du zögerst kurz vor dem ö oder verwechselst z und y? Das spürst du kaum, aber es kostet dich jedes Mal Tempo. Keypacer misst jeden Anschlag auf die Millisekunde und stellt die nächste Übung aus genau diesen Tasten und Buchstabenpaaren zusammen.',
      points: [
        { chip: '1×', strong: 'Der erste Versuch zählt.', text: 'Ein Fehler bleibt ein Fehler, auch wenn du ihn sofort korrigierst.' },
        { chip: '2s', strong: 'Denkpausen fallen raus.', text: 'Pausen über zwei Sekunden verfälschen dein Tempo nicht.' },
        { chip: '↺', strong: 'Nichts gerät in Vergessenheit.', text: 'Tasten, die du länger nicht geübt hast, kommen zur Wiederholung zurück.' },
      ],
      tableTitle: 'Schwächste Tasten',
      tableNote: 'Beispiel nach drei Runden',
      columns: ['Taste', 'Fehler', 'Zeit'],
      nextPrefix: 'Nächste Übung setzt auf',
      nextSuffix: 'und die Paare drumherum.',
      example: { keys: ['ö', 'z', 'ü', 'c', 'v'], focus: ['ö', 'z', 'sch'] },
    },
    features: {
      eyebrow: 'Funktionen',
      title: 'Alles, was du brauchst, und nicht mehr',
      items: [
        { title: 'Deine Sprache, deine Tastatur', text: 'Deutsch, Englisch, Französisch, Spanisch, Italienisch, Polnisch, Portugiesisch (Brasilien und Portugal) oder Indonesisch, auf QWERTZ, QWERTY, AZERTY, Dvorak, Colemak und mehr. Dein Layout erkennt Keypacer an den Tasten, die du drückst.' },
        { title: 'Fingerhilfe', text: 'Unter dem Text zeigt eine Tastatur, welcher Finger dran ist. Tasten, die du schon kannst, blendet sie nach und nach aus.' },
        { title: 'Einstufungstest', text: 'Du tippst schon ein bisschen? Eine Minute Test, und Keypacer überspringt alle Tasten, die du schon beherrschst.' },
        { title: 'Fortschritt, den du siehst', text: 'Tempo und Genauigkeit im Verlauf, eine Fehler-Heatmap und deine langsamsten Tasten und Buchstabenpaare.' },
        { title: 'Wochenziel und Plan', text: 'Leg fest, wie oft du üben willst, und trag den Plan in deinen Kalender ein. Kurze, regelmäßige Runden bringen mehr als seltene, lange.' },
        { title: 'Überall weitermachen', text: 'Mit einem kostenlosen Konto sind deine Lektionen gesichert, auch wenn Browserdaten gelöscht werden, und du machst auf jedem Gerät dort weiter, wo du aufgehört hast.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · Deutsches Layout', 'Français · Französisches Layout', 'English · US-Layout', 'English · Dvorak'],
      fingerWord: 'glas',
      letters: 'Buchstaben',
      placing: 'Einstufung läuft …',
      skipped: { one: '{n} Taste übersprungen', other: '{n} Tasten übersprungen' },
      speed: 'Tempo',
      weekGoal: 'Wochenziel',
      lesson: 'Lektion',
      laptop: 'Laptop',
      tablet: 'Tablet',
      stored: 'Gespeichert in Frankfurt, EU',
    },
    privacy: {
      eyebrow: 'Datenschutz',
      title: 'Deine Tippdaten bleiben bei dir',
      intro: 'Keypacer weiß genau, wie du tippst. Deshalb bleibt dieses Wissen bei dir.',
      items: [
        { title: 'Keine Cookies, kein Tracking', text: 'Keypacer setzt keine Cookies, zeigt keine Werbung und nutzt keine Analysedienste.', chips: ['0 Cookies', '0 Tracker'] },
        { title: 'Ohne Konto bleibt alles im Browser', text: 'Deine Anschläge werden nur lokal gespeichert. Du kannst sie jederzeit exportieren oder löschen.', chips: ['.json', '.csv'] },
        { title: 'Mit Konto in der EU', text: 'Das freiwillige Konto gleicht deine Runden über Server in Frankfurt zwischen deinen Geräten ab.', chips: ['Frankfurt', 'freiwilliges Konto'] },
      ],
    },
    analytics: {
      fact: 'Cookies und Werbung',
      item: { title: 'Keine Cookies, keine Werbung', text: 'Keypacer setzt keine Cookies und zeigt keine Werbung. Besuche zählen wir nur anonym, ohne Cookies.', chips: ['0 Cookies', 'anonyme Statistik'] },
    },
    faq: {
      title: 'Häufige Fragen',
      items: [
        { q: 'Ist Keypacer kostenlos?', a: 'Ja. Üben, Fortschritt und das freiwillige Konto sind kostenlos und ohne Werbung.' },
        { q: 'Was macht Keypacer anders als andere Tipptrainer?', a: 'Die meisten Trainer geben allen dieselben Lektionen. Keypacer misst jeden Tastendruck und stellt jede Übung aus den Tasten und Buchstabenpaaren zusammen, die dich gerade am meisten bremsen.' },
        { q: 'Brauche ich ein Konto?', a: 'Nein. Du kannst sofort loslegen, ohne Konto speichert der Browser deinen Fortschritt. Mit einem kostenlosen Konto ist er sicher, auch wenn die Browserdaten gelöscht werden, und du kannst auf weiteren Geräten weitermachen.' },
        { q: 'Wie lange dauert es, das Zehnfingersystem zu lernen?', a: 'Die meisten tippen nach einigen Wochen mit 15 bis 20 Minuten am Tag blind. Kurze tägliche Einheiten bringen mehr als lange, seltene, und das Tempo steigt danach weiter.' },
        { q: 'Welche Tastaturlayouts gibt es?', a: 'Deutsches und Schweizer QWERTZ, US- und UK-QWERTY, französisches und belgisches AZERTY, spanisch, italienisch, schwedisch/finnisch, polnisch, brasilianisch (ABNT2) und portugiesisch, Dvorak, Colemak und Colemak-DH. Keypacer erkennt dein Layout an den Tasten, die du drückst.' },
        { q: 'Geht das auch auf Handy oder Tablet?', a: 'Keypacer ist für eine echte Tastatur gemacht. Ein Tablet mit Tastatur funktioniert gut; auf dem Handy kannst du dich umsehen, aber blind tippen lernt man an einer richtigen Tastatur.' },
      ],
    },
    final: { title: 'Deine erste Übung dauert zwei Minuten', text: 'Eine Zeile tippen, und Keypacer weiß, wo du anfängst.', cta: 'Jetzt kostenlos üben' },
    foot: { imprint: 'Impressum', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen' },
  },

  es: {
    name: 'Español',
    ogLocale: 'es_ES',
    title: 'Curso de mecanografía gratis que se adapta a ti | Keypacer',
    description:
      'Aprende mecanografía gratis y online. Keypacer mide cada pulsación, encuentra las teclas que te frenan y practica justo esas. Sin registrarte.',
    nav: { languages: 'Idioma', signIn: 'Iniciar sesión', open: 'Ir al entrenador', sections: 'Secciones de la página', method: 'Método', features: 'Funciones', faq: 'Preguntas', skip: 'Saltar al contenido' },
    hero: {
      eyebrow: 'Gratis · sin registro · sin anuncios',
      title: 'Aprende mecanografía con un entrenador que entiende tus errores',
      rotate: [
        'Diez dedos. Diez minutos al día.',
        'Cada ejercicio apunta a tus teclas más lentas',
        'Primero precisión, luego velocidad',
      ],
      lead: 'Keypacer mide cada pulsación, encuentra las teclas y pares de letras que te frenan y con ellos crea tu próximo ejercicio. Así nunca practicas lo que ya sabes.',
      cta: 'Empezar gratis',
      continue: 'Seguir practicando',
      note: 'Funciona en el navegador. Sin anuncios y sin cuenta.',
    },
    demo: {
      label: 'Pruébalo: escribe la línea',
      start: 'Haz clic aquí y empieza a escribir',
      result: 'Tu resultado',
      wpm: 'PPM',
      wpmLong: 'palabras por minuto',
      accuracy: 'precisión',
      slowTitle: 'Estas teclas te hicieron dudar:',
      slowNone: 'Preciso y constante. Veamos qué tal con el teclado completo.',
      nextBeginner: 'Tu primera lección: las seis letras más frecuentes y luego una tecla nueva cada vez.',
      ctaBeginner: 'Empezar la lección 1',
      nextFast: 'Ya escribes bastante rápido. Unas {n} palabras más en el entrenador y te saltas las teclas que ya dominas.',
      ctaFast: 'Terminar la prueba de nivel',
      again: 'Escribir otra línea',
      lines: [
        'el veloz murciélago hindú comía feliz cardillo y kiwi',
        'quien escribe sin mirar tiene los ojos en el texto y no en las teclas',
        'cada tecla que encuentras sin mirar hace más fácil la siguiente',
      ],
    },
    facts: {
      label: 'Keypacer en cifras',
      items: [
        { value: '∞', label: 'ejercicios que se adaptan a tu nivel' },
        { value: '1 min', label: 'hasta tu primer ejercicio, sin registro' },
        { value: '10 000', label: 'palabras más frecuentes por idioma' },
        { value: '0', label: 'cookies, rastreadores y anuncios' },
      ],
    },
    method: {
      eyebrow: 'El método',
      title: 'Cómo te vuelves más rápido',
      intro: 'Nada de lecciones iguales para todos. Cada ejercicio nace de tu forma de escribir y se afina con cada ronda.',
      items: [
        { title: 'Una tecla tras otra', text: 'Empiezas con las seis letras más frecuentes y pronto escribes palabras reales. La siguiente tecla solo llega cuando todas las anteriores son precisas y fluidas.' },
        { title: 'Primero precisión, luego velocidad', text: 'Si pulsas una tecla equivocada, no avanzas hasta acertar la letra. Si baja la precisión, la velocidad se oculta hasta que vuelves a escribir sin errores.' },
        { title: 'Dirigido, no uniforme', text: 'Cada ejercicio insiste en las teclas y pares de letras que te frenan y repasa las que llevas tiempo sin practicar para que no se olviden.' },
        { title: 'Rondas cortas, pausas de verdad', text: 'Calentamiento, rondas cortas y concentradas y luego frases reales. Cuando tu concentración baja, Keypacer te propone una pausa en lugar de repetir errores.' },
      ],
    },
    analysis: {
      eyebrow: 'Lo que mide Keypacer',
      title: 'Keypacer detecta qué teclas te frenan',
      text: '¿Dudas un instante antes de la ñ o confundes la b y la v? Apenas lo notas, pero cada vez te cuesta velocidad. Keypacer mide cada pulsación al milisegundo y arma tu próximo ejercicio justo con esas teclas y pares de letras.',
      points: [
        { chip: '1×', strong: 'Cuenta el primer intento.', text: 'Un error sigue siendo un error, aunque lo corrijas al momento.' },
        { chip: '2s', strong: 'Las pausas para pensar no cuentan.', text: 'Las pausas de más de dos segundos no falsean tu velocidad.' },
        { chip: '↺', strong: 'Nada cae en el olvido.', text: 'Las teclas que llevas tiempo sin practicar vuelven para repasarlas.' },
      ],
      tableTitle: 'Teclas más débiles',
      tableNote: 'Ejemplo tras tres rondas',
      columns: ['Tecla', 'Errores', 'Tiempo'],
      nextPrefix: 'El próximo ejercicio se centra en',
      nextSuffix: 'y los pares de alrededor.',
      example: { keys: ['ñ', 'z', 'j', 'x', 'q'], focus: ['ñ', 'z', 'qu'] },
    },
    features: {
      eyebrow: 'Funciones',
      title: 'Todo lo que necesitas, nada más',
      items: [
        { title: 'Tu idioma, tu teclado', text: 'Español, inglés, alemán, francés, italiano, polaco, portugués (Brasil y Portugal) o indonesio, en QWERTY, QWERTZ, AZERTY, Dvorak, Colemak y más. Keypacer reconoce tu distribución por las teclas que pulsas.' },
        { title: 'Guía de dedos', text: 'Bajo el texto, un teclado muestra qué dedo toca. Las teclas que ya dominas se van atenuando poco a poco.' },
        { title: 'Prueba de nivel', text: '¿Ya escribes algo? Un minuto de prueba y Keypacer se salta todas las teclas que ya dominas.' },
        { title: 'Progreso visible', text: 'Velocidad y precisión a lo largo del tiempo, un mapa de errores y tus teclas y pares de letras más lentos.' },
        { title: 'Meta semanal y plan', text: 'Decide cuántas veces quieres practicar y añade el plan a tu calendario. Las sesiones cortas y regulares rinden más que las largas y esporádicas.' },
        { title: 'Sigue en cualquier lugar', text: 'Con una cuenta gratuita tus lecciones están a salvo aunque se borren los datos del navegador, y sigues donde lo dejaste en cualquier dispositivo.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · distribución alemana', 'Français · distribución francesa', 'Español · distribución española', 'English · Dvorak'],
      fingerWord: 'hada',
      letters: 'Letras',
      placing: 'Prueba de nivel en curso …',
      skipped: { one: '{n} tecla saltada', other: '{n} teclas saltadas' },
      speed: 'Velocidad',
      weekGoal: 'Meta semanal',
      lesson: 'Lección',
      laptop: 'Portátil',
      tablet: 'Tableta',
      stored: 'Guardado en Fráncfort, UE',
    },
    privacy: {
      eyebrow: 'Privacidad',
      title: 'Tus datos de escritura se quedan contigo',
      intro: 'Keypacer sabe exactamente cómo escribes. Por eso ese conocimiento se queda contigo.',
      items: [
        { title: 'Sin cookies ni rastreo', text: 'Keypacer no usa cookies, no muestra anuncios y no utiliza servicios de analítica.', chips: ['0 cookies', '0 rastreadores'] },
        { title: 'Sin cuenta, todo queda en el navegador', text: 'Tus pulsaciones solo se guardan en tu equipo. Puedes exportarlas o borrarlas cuando quieras.', chips: ['.json', '.csv'] },
        { title: 'Con cuenta, en la UE', text: 'La cuenta opcional sincroniza tus rondas entre tus dispositivos a través de servidores en Fráncfort.', chips: ['Fráncfort', 'cuenta opcional'] },
      ],
    },
    analytics: {
      fact: 'cookies y anuncios',
      item: { title: 'Sin cookies ni anuncios', text: 'Keypacer no usa cookies ni muestra anuncios. Las visitas solo se cuentan de forma anónima, sin cookies.', chips: ['0 cookies', 'estadística anónima'] },
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Keypacer es gratis?', a: 'Sí. Practicar, ver tu progreso y la cuenta opcional son gratis y sin anuncios.' },
        { q: '¿Qué hace diferente a Keypacer de otros cursos de mecanografía?', a: 'La mayoría da a todos las mismas lecciones. Keypacer mide cada pulsación y crea cada ejercicio con las teclas y pares de letras que más te frenan en ese momento.' },
        { q: '¿Necesito una cuenta?', a: 'No. Puedes empezar ya; sin cuenta, el navegador guarda tu progreso. Con una cuenta gratuita está a salvo aunque se borren los datos del navegador, y puedes seguir en tus otros dispositivos.' },
        { q: '¿Cuánto se tarda en aprender mecanografía?', a: 'La mayoría escribe sin mirar tras unas semanas de 15 a 20 minutos al día. Sesiones cortas y diarias funcionan mejor que largas y esporádicas, y la velocidad sigue subiendo después.' },
        { q: '¿Qué distribuciones de teclado hay?', a: 'Español, QWERTY de EE. UU. y Reino Unido, QWERTZ alemán y suizo, AZERTY francés y belga, italiano, sueco/finés, polaco, brasileño ABNT2 y portugués, Dvorak, Colemak y Colemak-DH. Keypacer detecta tu distribución por las teclas que pulsas.' },
        { q: '¿Funciona en el móvil o la tableta?', a: 'Keypacer está pensado para un teclado físico. Una tableta con teclado funciona bien; en el móvil puedes echar un vistazo, pero la mecanografía se aprende con un teclado de verdad.' },
      ],
    },
    final: { title: 'Tu primer ejercicio lleva dos minutos', text: 'Escribe una línea y Keypacer sabrá por dónde empezar.', cta: 'Empezar gratis' },
    foot: { imprint: 'Aviso legal', privacy: 'Privacidad', terms: 'Condiciones de uso' },
  },

  fr: {
    name: 'Français',
    ogLocale: 'fr_FR',
    title: 'Apprendre la dactylographie gratuitement | Keypacer',
    description:
      'Apprenez à taper au clavier à dix doigts, gratuitement. Keypacer mesure chaque frappe, trouve les touches qui vous freinent et les travaille. Sans inscription.',
    nav: { languages: 'Langue', signIn: 'Se connecter', open: 'Ouvrir l’entraîneur', sections: 'Sections de la page', method: 'Méthode', features: 'Fonctionnalités', faq: 'Questions', skip: 'Aller au contenu' },
    hero: {
      eyebrow: 'Gratuit · sans inscription · sans publicité',
      title: 'Tapez à dix doigts avec un entraîneur qui comprend vos erreurs',
      rotate: [
        'Dix doigts. Dix minutes par jour.',
        'Chaque exercice cible vos touches les plus lentes',
        'D’abord taper juste, ensuite vite',
      ],
      lead: 'Keypacer mesure chaque frappe, trouve les touches et paires de lettres qui vous freinent et en fait votre prochain exercice. Vous ne travaillez jamais ce que vous savez déjà.',
      cta: 'Commencer gratuitement',
      continue: 'Continuer l’entraînement',
      note: 'Fonctionne dans le navigateur. Sans publicité, sans compte.',
    },
    demo: {
      label: 'Essayez : tapez la ligne',
      start: 'Cliquez ici et commencez à taper',
      result: 'Votre résultat',
      wpm: 'MPM',
      wpmLong: 'mots par minute',
      accuracy: 'précision',
      slowTitle: 'Ces touches vous ont fait hésiter :',
      slowNone: 'Précis et régulier. Voyons ce que ça donne avec tout le clavier.',
      nextBeginner: 'Votre première leçon : les six lettres les plus fréquentes, puis une nouvelle touche à la fois.',
      ctaBeginner: 'Commencer la leçon 1',
      nextFast: 'Vous tapez déjà assez vite. Encore environ {n} mots dans l’entraîneur, puis vous sautez les touches que vous maîtrisez.',
      ctaFast: 'Terminer le test de niveau',
      again: 'Taper une autre ligne',
      lines: [
        'portez ce vieux whisky au juge blond qui fume',
        'taper sans regarder, c’est garder les yeux sur le texte et pas sur le clavier',
        'chaque touche trouvée sans regarder rend la suivante plus facile',
      ],
    },
    facts: {
      label: 'Keypacer en chiffres',
      items: [
        { value: '∞', label: 'exercices qui s’adaptent à votre niveau' },
        { value: '1 min', label: 'jusqu’au premier exercice, sans inscription' },
        { value: '10 000', label: 'mots les plus fréquents par langue' },
        { value: '0', label: 'cookie, traceur ou publicité' },
      ],
    },
    method: {
      eyebrow: 'La méthode',
      title: 'Comment vous gagnez en vitesse',
      intro: 'Pas de leçons identiques pour tous. Chaque exercice naît de votre façon de taper et s’affine à chaque série.',
      items: [
        { title: 'Une touche après l’autre', text: 'Vous commencez par les six lettres les plus fréquentes et tapez très tôt de vrais mots. La touche suivante n’arrive que lorsque toutes les précédentes sont sûres et fluides.' },
        { title: 'D’abord juste, ensuite vite', text: 'Une mauvaise touche vous retient sur la lettre. Si la précision baisse, l’affichage de la vitesse disparaît jusqu’à ce que vous tapiez de nouveau sans erreur.' },
        { title: 'Ciblé, pas uniforme', text: 'Chaque exercice insiste sur les touches et paires de lettres qui vous freinent et ramène celles que vous n’avez pas travaillées depuis un moment, pour qu’elles restent.' },
        { title: 'Séries courtes, vraies pauses', text: 'Échauffement, courtes séries ciblées, puis de vraies phrases. Quand votre concentration baisse, Keypacer propose une pause plutôt que d’ancrer les erreurs.' },
      ],
    },
    analysis: {
      eyebrow: 'Ce que mesure Keypacer',
      title: 'Keypacer repère les touches qui vous freinent',
      text: 'Vous hésitez un instant avant le é ou confondez le b et le n ? Vous le remarquez à peine, mais cela vous coûte de la vitesse à chaque fois. Keypacer mesure chaque frappe à la milliseconde et compose votre prochain exercice avec exactement ces touches et paires de lettres.',
      points: [
        { chip: '1×', strong: 'Le premier essai compte.', text: 'Une erreur reste une erreur, même si vous la corrigez aussitôt.' },
        { chip: '2s', strong: 'Les pauses de réflexion ne comptent pas.', text: 'Les pauses de plus de deux secondes ne faussent pas votre vitesse.' },
        { chip: '↺', strong: 'Rien ne tombe dans l’oubli.', text: 'Les touches que vous n’avez pas travaillées depuis un moment reviennent en révision.' },
      ],
      tableTitle: 'Touches les plus faibles',
      tableNote: 'Exemple après trois séries',
      columns: ['Touche', 'Erreurs', 'Temps'],
      nextPrefix: 'Le prochain exercice cible',
      nextSuffix: 'et les paires autour.',
      example: { keys: ['é', 'è', 'ç', 'à', 'w'], focus: ['é', 'è', 'qu'] },
    },
    features: {
      eyebrow: 'Fonctionnalités',
      title: 'L’essentiel, rien de plus',
      items: [
        { title: 'Votre langue, votre clavier', text: 'Français, anglais, allemand, espagnol, italien, polonais, portugais (Brésil et Portugal) ou indonésien, sur AZERTY, QWERTY, QWERTZ, Dvorak, Colemak et d’autres. Keypacer reconnaît votre disposition aux touches que vous tapez.' },
        { title: 'Guide des doigts', text: 'Sous le texte, un clavier montre quel doigt utiliser. Les touches que vous connaissez déjà s’estompent peu à peu.' },
        { title: 'Test de niveau', text: 'Vous tapez déjà un peu ? Une minute de test, et Keypacer saute toutes les touches que vous maîtrisez.' },
        { title: 'Des progrès visibles', text: 'Vitesse et précision dans le temps, une carte des erreurs et vos touches et paires de lettres les plus lentes.' },
        { title: 'Objectif et planning', text: 'Choisissez à quelle fréquence vous entraîner et ajoutez le planning à votre agenda. Des séries courtes et régulières valent mieux que de longues séances rares.' },
        { title: 'Continuez partout', text: 'Avec un compte gratuit, vos leçons sont sauvegardées même si les données du navigateur sont effacées, et vous reprenez là où vous en étiez sur n’importe quel appareil.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · disposition allemande', 'Français · disposition française', 'English · disposition américaine', 'English · Dvorak'],
      fingerWord: 'type',
      letters: 'Lettres',
      placing: 'Test en cours …',
      skipped: { one: '{n} touche sautée', other: '{n} touches sautées' },
      speed: 'Vitesse',
      weekGoal: 'Objectif de la semaine',
      lesson: 'Leçon',
      laptop: 'Portable',
      tablet: 'Tablette',
      stored: 'Hébergé à Francfort, UE',
    },
    privacy: {
      eyebrow: 'Confidentialité',
      title: 'Vos données de frappe restent chez vous',
      intro: 'Keypacer sait exactement comment vous tapez. C’est pourquoi ce savoir reste chez vous.',
      items: [
        { title: 'Ni cookies ni pistage', text: 'Keypacer ne dépose aucun cookie, n’affiche aucune publicité et n’utilise aucun service d’analyse.', chips: ['0 cookie', '0 traceur'] },
        { title: 'Sans compte, tout reste dans le navigateur', text: 'Vos frappes sont enregistrées uniquement en local. Vous pouvez les exporter ou les supprimer à tout moment.', chips: ['.json', '.csv'] },
        { title: 'Avec un compte, dans l’UE', text: 'Le compte facultatif synchronise vos séries entre vos appareils via des serveurs à Francfort.', chips: ['Francfort', 'compte facultatif'] },
      ],
    },
    analytics: {
      fact: 'cookie ou publicité',
      item: { title: 'Ni cookies ni publicité', text: 'Keypacer ne dépose aucun cookie et n’affiche aucune publicité. Les visites sont seulement comptées de façon anonyme, sans cookie.', chips: ['0 cookie', 'statistiques anonymes'] },
    },
    faq: {
      title: 'Questions fréquentes',
      items: [
        { q: 'Keypacer est-il gratuit ?', a: 'Oui. L’entraînement, le suivi des progrès et le compte facultatif sont gratuits et sans publicité.' },
        { q: 'Qu’est-ce qui distingue Keypacer des autres logiciels de dactylographie ?', a: 'La plupart donnent à tout le monde les mêmes leçons. Keypacer mesure chaque frappe et compose chaque exercice avec les touches et paires de lettres qui vous freinent le plus en ce moment.' },
        { q: 'Faut-il un compte ?', a: 'Non. Vous pouvez commencer tout de suite ; sans compte, le navigateur garde vos progrès. Avec un compte gratuit, ils sont en sécurité même si les données du navigateur sont effacées, et vous pouvez continuer sur vos autres appareils.' },
        { q: 'Combien de temps faut-il pour apprendre à taper à dix doigts ?', a: 'La plupart des gens tapent sans regarder après quelques semaines à raison de 15 à 20 minutes par jour. Des séances courtes et quotidiennes valent mieux que de longues séances rares, et la vitesse continue ensuite de progresser.' },
        { q: 'Quelles dispositions de clavier sont prises en charge ?', a: 'AZERTY français et belge, QWERTY américain et britannique, QWERTZ allemand et suisse, espagnol, italien, suédois/finnois, polonais, brésilien ABNT2 et portugais, Dvorak, Colemak et Colemak-DH. Keypacer reconnaît votre disposition aux touches que vous tapez.' },
        { q: 'Ça marche sur téléphone ou tablette ?', a: 'Keypacer est fait pour un vrai clavier. Une tablette avec clavier fonctionne bien ; sur téléphone vous pouvez jeter un œil, mais la frappe à dix doigts s’apprend sur un clavier physique.' },
      ],
    },
    final: { title: 'Votre premier exercice prend deux minutes', text: 'Tapez une ligne et Keypacer sait par où commencer.', cta: 'Commencer gratuitement' },
    foot: { imprint: 'Mentions légales', privacy: 'Confidentialité', terms: 'Conditions d’utilisation' },
  },

  it: {
    name: 'Italiano',
    ogLocale: 'it_IT',
    title: 'Corso di dattilografia gratis che si adatta a te | Keypacer',
    description:
      'Impara a scrivere con dieci dita, gratis e online. Keypacer misura ogni battuta, trova i tasti che ti rallentano e allena proprio quelli. Senza registrazione.',
    nav: { languages: 'Lingua', signIn: 'Accedi', open: 'Apri l’allenatore', sections: 'Sezioni della pagina', method: 'Metodo', features: 'Funzioni', faq: 'Domande', skip: 'Vai al contenuto' },
    hero: {
      eyebrow: 'Gratis · senza registrazione · senza pubblicità',
      title: 'Impara a scrivere con dieci dita con un allenatore che capisce i tuoi errori',
      rotate: [
        'Dieci dita. Dieci minuti al giorno.',
        'Ogni esercizio punta sui tuoi tasti più lenti',
        'Prima la precisione, poi la velocità',
      ],
      lead: 'Keypacer misura ogni battuta, trova i tasti e le coppie di lettere che ti rallentano e ne fa il tuo prossimo esercizio. Così non ti alleni mai su ciò che sai già.',
      cta: 'Inizia gratis',
      continue: 'Continua ad allenarti',
      note: 'Funziona nel browser. Niente pubblicità, nessun account.',
    },
    demo: {
      label: 'Provalo: scrivi la riga',
      start: 'Clicca qui e inizia a scrivere',
      result: 'Il tuo risultato',
      wpm: 'PPM',
      wpmLong: 'parole al minuto',
      accuracy: 'precisione',
      slowTitle: 'Su questi tasti hai esitato:',
      slowNone: 'Preciso e regolare. Vediamo come va con tutta la tastiera.',
      nextBeginner: 'La tua prima lezione: le sei lettere più frequenti, poi un tasto nuovo alla volta.',
      ctaBeginner: 'Inizia la lezione 1',
      nextFast: 'Scrivi già piuttosto veloce. Ancora circa {n} parole nell’allenatore, poi salti i tasti che conosci già.',
      ctaFast: 'Completa il test di livello',
      again: 'Scrivi un’altra riga',
      lines: [
        'quel vituperabile xenofobo zelante assaggia il whisky ed esclama alleluja',
        'chi scrive senza guardare tiene gli occhi sul testo e non sui tasti',
        'ogni tasto che trovi senza guardare rende più facile il prossimo',
      ],
    },
    facts: {
      label: 'Keypacer in cifre',
      items: [
        { value: '∞', label: 'esercizi che si adattano al tuo livello' },
        { value: '1 min', label: 'al primo esercizio, senza registrazione' },
        { value: '10.000', label: 'parole più frequenti per lingua' },
        { value: '0', label: 'cookie, tracker e pubblicità' },
      ],
    },
    method: {
      eyebrow: 'Il metodo',
      title: 'Come diventi più veloce',
      intro: 'Niente lezioni uguali per tutti. Ogni esercizio nasce da come scrivi e diventa più preciso a ogni giro.',
      items: [
        { title: 'Un tasto dopo l’altro', text: 'Inizi con le sei lettere più frequenti e presto scrivi parole vere. Il tasto successivo arriva solo quando tutti i precedenti sono sicuri e fluidi.' },
        { title: 'Prima la precisione, poi la velocità', text: 'Un tasto sbagliato ti ferma sulla lettera finché non premi quello giusto. Se la precisione cala, l’indicatore di velocità sparisce finché non torni a scrivere senza errori.' },
        { title: 'Mirato, non uniforme', text: 'Ogni esercizio insiste sui tasti e le coppie di lettere che ti rallentano e riporta quelli che non alleni da un po’, perché restino.' },
        { title: 'Giri brevi, pause vere', text: 'Riscaldamento, brevi giri di concentrazione, poi frasi vere. Quando la concentrazione cala, Keypacer ti propone una pausa invece di farti ripetere gli errori.' },
      ],
    },
    analysis: {
      eyebrow: 'Cosa misura Keypacer',
      title: 'Keypacer si accorge di quali tasti ti rallentano',
      text: 'Esiti un attimo prima della ò o confondi la b e la v? Te ne accorgi appena, ma ogni volta ti costa velocità. Keypacer misura ogni battuta al millisecondo e compone il prossimo esercizio proprio con quei tasti e coppie di lettere.',
      points: [
        { chip: '1×', strong: 'Conta il primo tentativo.', text: 'Un errore resta un errore, anche se lo correggi subito.' },
        { chip: '2s', strong: 'Le pause per pensare non contano.', text: 'Le pause oltre i due secondi non falsano la tua velocità.' },
        { chip: '↺', strong: 'Niente finisce nel dimenticatoio.', text: 'I tasti che non alleni da un po’ tornano per un ripasso.' },
      ],
      tableTitle: 'Tasti più deboli',
      tableNote: 'Esempio dopo tre giri',
      columns: ['Tasto', 'Errori', 'Tempo'],
      nextPrefix: 'Il prossimo esercizio punta su',
      nextSuffix: 'e le coppie intorno.',
      example: { keys: ['ò', 'à', 'z', 'q', 'ù'], focus: ['ò', 'z', 'gl'] },
    },
    features: {
      eyebrow: 'Funzioni',
      title: 'Tutto quello che serve, niente di più',
      items: [
        { title: 'La tua lingua, la tua tastiera', text: 'Italiano, inglese, tedesco, francese, spagnolo, polacco, portoghese (Brasile e Portogallo) o indonesiano, su QWERTY, QWERTZ, AZERTY, Dvorak, Colemak e altre. Keypacer riconosce il tuo layout dai tasti che premi.' },
        { title: 'Guida per le dita', text: 'Sotto il testo una tastiera mostra quale dito tocca. I tasti che conosci già sbiadiscono a poco a poco.' },
        { title: 'Test di livello', text: 'Scrivi già un po’? Un minuto di test, e Keypacer salta tutti i tasti che padroneggi.' },
        { title: 'Progressi visibili', text: 'Velocità e precisione nel tempo, una mappa degli errori e i tuoi tasti e coppie di lettere più lenti.' },
        { title: 'Obiettivo settimanale e piano', text: 'Scegli quanto spesso vuoi allenarti e aggiungi il piano al tuo calendario. Sessioni brevi e regolari rendono più di quelle lunghe e rare.' },
        { title: 'Continua ovunque', text: 'Con un account gratuito le tue lezioni sono al sicuro anche se i dati del browser vengono cancellati, e riprendi da dove avevi lasciato su qualsiasi dispositivo.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · layout tedesco', 'Français · layout francese', 'Italiano · layout italiano', 'English · Dvorak'],
      fingerWord: 'gala',
      letters: 'Lettere',
      placing: 'Test in corso …',
      skipped: { one: '{n} tasto saltato', other: '{n} tasti saltati' },
      speed: 'Velocità',
      weekGoal: 'Obiettivo settimanale',
      lesson: 'Lezione',
      laptop: 'Portatile',
      tablet: 'Tablet',
      stored: 'Salvato a Francoforte, UE',
    },
    privacy: {
      eyebrow: 'Privacy',
      title: 'I tuoi dati di battitura restano tuoi',
      intro: 'Keypacer sa esattamente come scrivi. Per questo ciò che sa resta tuo.',
      items: [
        { title: 'Niente cookie, niente tracciamento', text: 'Keypacer non usa cookie, non mostra pubblicità e non usa servizi di analisi.', chips: ['0 cookie', '0 tracker'] },
        { title: 'Senza account resta tutto nel browser', text: 'Le tue battute vengono salvate solo in locale. Puoi esportarle o cancellarle quando vuoi.', chips: ['.json', '.csv'] },
        { title: 'Con account, nell’UE', text: 'L’account facoltativo sincronizza i tuoi giri tra i dispositivi tramite server a Francoforte.', chips: ['Francoforte', 'account facoltativo'] },
      ],
    },
    analytics: {
      fact: 'cookie e pubblicità',
      item: { title: 'Niente cookie, niente pubblicità', text: 'Keypacer non usa cookie e non mostra pubblicità. Le visite vengono contate solo in forma anonima, senza cookie.', chips: ['0 cookie', 'statistiche anonime'] },
    },
    faq: {
      title: 'Domande frequenti',
      items: [
        { q: 'Keypacer è gratis?', a: 'Sì. Allenamento, progressi e l’account facoltativo sono gratis e senza pubblicità.' },
        { q: 'Cosa rende Keypacer diverso dagli altri corsi di dattilografia?', a: 'La maggior parte dà a tutti le stesse lezioni. Keypacer misura ogni battuta e compone ogni esercizio con i tasti e le coppie di lettere che ti rallentano di più in quel momento.' },
        { q: 'Serve un account?', a: 'No. Puoi iniziare subito; senza account è il browser a salvare i tuoi progressi. Con un account gratuito sono al sicuro anche se i dati del browser vengono cancellati, e puoi continuare sugli altri tuoi dispositivi.' },
        { q: 'Quanto ci vuole per imparare a scrivere con dieci dita?', a: 'La maggior parte delle persone scrive senza guardare dopo qualche settimana di 15–20 minuti al giorno. Sessioni brevi e quotidiane funzionano meglio di sessioni lunghe e rare, e la velocità poi continua a crescere.' },
        { q: 'Quali layout di tastiera sono supportati?', a: 'Italiano, QWERTY americano e britannico, QWERTZ tedesco e svizzero, AZERTY francese e belga, spagnolo, svedese/finlandese, polacco, brasiliano ABNT2 e portoghese, Dvorak, Colemak e Colemak-DH. Keypacer riconosce il tuo layout dai tasti che premi.' },
        { q: 'Funziona su telefono o tablet?', a: 'Keypacer è pensato per una tastiera vera. Un tablet con tastiera va bene; sul telefono puoi dare un’occhiata, ma a scrivere con dieci dita si impara su una tastiera fisica.' },
      ],
    },
    final: { title: 'Il primo esercizio richiede due minuti', text: 'Scrivi una riga e Keypacer sa da dove partire.', cta: 'Inizia gratis' },
    foot: { imprint: 'Note legali', privacy: 'Privacy', terms: 'Condizioni d’uso' },
  },

  pl: {
    name: 'Polski',
    ogLocale: 'pl_PL',
    title: 'Nauka pisania bezwzrokowego za darmo | Keypacer',
    description:
      'Naucz się pisać bezwzrokowo, za darmo i online. Keypacer mierzy każde uderzenie, znajduje klawisze, które cię spowalniają, i ćwiczy właśnie je. Bez rejestracji.',
    nav: { languages: 'Język', signIn: 'Zaloguj się', open: 'Otwórz trenera', sections: 'Sekcje strony', method: 'Metoda', features: 'Funkcje', faq: 'Pytania', skip: 'Przejdź do treści' },
    hero: {
      eyebrow: 'Za darmo · bez rejestracji · bez reklam',
      title: 'Naucz się pisać bezwzrokowo z trenerem, który rozumie twoje błędy',
      rotate: [
        'Dziesięć palców. Dziesięć minut dziennie.',
        'Każde ćwiczenie celuje w twoje najwolniejsze klawisze',
        'Najpierw dokładnie, potem szybko',
      ],
      lead: 'Keypacer mierzy każde uderzenie, znajduje klawisze i pary liter, które cię spowalniają, i robi z nich twoje kolejne ćwiczenie. Nigdy nie ćwiczysz tego, co już umiesz.',
      cta: 'Zacznij za darmo',
      continue: 'Ćwicz dalej',
      note: 'Działa w przeglądarce. Bez reklam i bez konta.',
    },
    demo: {
      label: 'Spróbuj: przepisz linijkę',
      start: 'Kliknij tutaj i zacznij pisać',
      result: 'Twój wynik',
      wpm: 'sł./min',
      wpmLong: 'słów na minutę',
      accuracy: 'dokładność',
      slowTitle: 'Przy tych klawiszach się zawahałeś(-aś):',
      slowNone: 'Bez błędów i równym tempem. Zobaczmy, jak pójdzie z całą klawiaturą.',
      nextBeginner: 'Twoja pierwsza lekcja: sześć najczęstszych liter, potem jeden nowy klawisz naraz.',
      ctaBeginner: 'Zacznij lekcję 1',
      nextFast: 'Piszesz już całkiem szybko. Jeszcze około {n} słów w trenerze, a potem pominiesz klawisze, które już znasz.',
      ctaFast: 'Dokończ test poziomujący',
      again: 'Przepisz inną linijkę',
      lines: [
        'pchnąć w tę łódź jeża lub ośm skrzyń fig',
        'kto pisze bezwzrokowo, patrzy na tekst, a nie na klawisze',
        'każdy klawisz znaleziony bez patrzenia ułatwia następny',
      ],
    },
    facts: {
      label: 'Keypacer w liczbach',
      items: [
        { value: '∞', label: 'ćwiczeń dopasowanych do twoich umiejętności' },
        { value: '1 min', label: 'do pierwszego ćwiczenia, bez rejestracji' },
        { value: '10 000', label: 'najczęstszych słów w każdym języku' },
        { value: '0', label: 'ciasteczek, trackerów i reklam' },
      ],
    },
    method: {
      eyebrow: 'Metoda',
      title: 'Jak przyspieszasz',
      intro: 'Żadnych lekcji dla wszystkich. Każde ćwiczenie powstaje z tego, jak piszesz, i z każdą rundą jest dokładniejsze.',
      items: [
        { title: 'Klawisz po klawiszu', text: 'Zaczynasz od sześciu najczęstszych liter i szybko piszesz prawdziwe słowa. Kolejny klawisz dochodzi dopiero wtedy, gdy wszystkie dotychczasowe piszesz pewnie i płynnie.' },
        { title: 'Najpierw dokładnie, potem szybko', text: 'Błędny klawisz zatrzymuje cię na literze. Gdy dokładność spada, licznik tempa znika, dopóki znów nie zaczniesz pisać bez błędów.' },
        { title: 'Celowo, nie po równo', text: 'Każde ćwiczenie stawia na klawisze i pary liter, które cię spowalniają, i wraca do tych, których dawno nie ćwiczyłeś(-aś), żeby zostały w pamięci.' },
        { title: 'Krótkie rundy, prawdziwe przerwy', text: 'Rozgrzewka, krótkie rundy skupienia, potem prawdziwe zdania. Gdy słabnie koncentracja, Keypacer proponuje przerwę, zamiast utrwalać błędy.' },
      ],
    },
    analysis: {
      eyebrow: 'Co mierzy Keypacer',
      title: 'Keypacer zauważa, które klawisze cię spowalniają',
      text: 'Wahasz się chwilę przed ą albo mylisz b i n? Ledwo to zauważasz, ale za każdym razem kosztuje cię to tempo. Keypacer mierzy każde uderzenie co do milisekundy i układa kolejne ćwiczenie właśnie z tych klawiszy i par liter.',
      points: [
        { chip: '1×', strong: 'Liczy się pierwsza próba.', text: 'Błąd zostaje błędem, nawet jeśli od razu go poprawisz.' },
        { chip: '2s', strong: 'Przerwy na myślenie się nie liczą.', text: 'Przerwy dłuższe niż dwie sekundy nie zaniżają twojego tempa.' },
        { chip: '↺', strong: 'Nic nie idzie w zapomnienie.', text: 'Klawisze, których dawno nie ćwiczyłeś(-aś), wracają do powtórki.' },
      ],
      tableTitle: 'Najsłabsze klawisze',
      tableNote: 'Przykład po trzech rundach',
      columns: ['Klawisz', 'Błędy', 'Czas'],
      nextPrefix: 'Następne ćwiczenie stawia na',
      nextSuffix: 'i pary wokół nich.',
      example: { keys: ['ą', 'ę', 'ź', 'ż', 'ć'], focus: ['ą', 'ę', 'rz'] },
    },
    features: {
      eyebrow: 'Funkcje',
      title: 'Wszystko, czego trzeba, nic ponad to',
      items: [
        { title: 'Twój język, twoja klawiatura', text: 'Polski, angielski, niemiecki, francuski, hiszpański, włoski, portugalski (Brazylia i Portugalia) lub indonezyjski, na QWERTY, QWERTZ, AZERTY, Dvorak, Colemak i innych. Keypacer rozpoznaje układ po klawiszach, które naciskasz.' },
        { title: 'Podpowiedź palców', text: 'Pod tekstem klawiatura pokazuje, który palec jest teraz potrzebny. Klawisze, które już znasz, stopniowo przygasają.' },
        { title: 'Test poziomujący', text: 'Już trochę piszesz? Minuta testu i Keypacer pomija wszystkie klawisze, które już opanowałeś(-aś).' },
        { title: 'Widoczne postępy', text: 'Tempo i dokładność w czasie, mapa błędów oraz twoje najwolniejsze klawisze i pary liter.' },
        { title: 'Cel tygodniowy i plan', text: 'Ustal, jak często chcesz ćwiczyć, i dodaj plan do kalendarza. Krótkie, regularne rundy dają więcej niż rzadkie i długie.' },
        { title: 'Kontynuuj wszędzie', text: 'Z darmowym kontem twoje lekcje są bezpieczne, nawet jeśli dane przeglądarki zostaną usunięte, a na każdym urządzeniu kontynuujesz tam, gdzie skończyłeś(-aś).' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · układ niemiecki', 'Français · układ francuski', 'Polski · układ programisty', 'English · Dvorak'],
      fingerWord: 'laska',
      letters: 'Litery',
      placing: 'Test w toku …',
      skipped: { one: 'Pominięto {n} klawisz', few: 'Pominięto {n} klawisze', other: 'Pominięto {n} klawiszy' },
      speed: 'Tempo',
      weekGoal: 'Cel tygodniowy',
      lesson: 'Lekcja',
      laptop: 'Laptop',
      tablet: 'Tablet',
      stored: 'Zapisane we Frankfurcie, UE',
    },
    privacy: {
      eyebrow: 'Prywatność',
      title: 'Twoje dane zostają z tobą',
      intro: 'Keypacer wie dokładnie, jak piszesz. Dlatego ta wiedza zostaje z tobą.',
      items: [
        { title: 'Bez ciasteczek i śledzenia', text: 'Keypacer nie używa ciasteczek, nie wyświetla reklam i nie korzysta z usług analitycznych.', chips: ['0 ciasteczek', '0 trackerów'] },
        { title: 'Bez konta wszystko zostaje w przeglądarce', text: 'Twoje naciśnięcia klawiszy są zapisywane tylko lokalnie. W każdej chwili możesz je wyeksportować lub usunąć.', chips: ['.json', '.csv'] },
        { title: 'Z kontem w UE', text: 'Dobrowolne konto synchronizuje twoje rundy między urządzeniami przez serwery we Frankfurcie.', chips: ['Frankfurt', 'dobrowolne konto'] },
      ],
    },
    analytics: {
      fact: 'ciasteczek i reklam',
      item: { title: 'Bez ciasteczek i reklam', text: 'Keypacer nie używa ciasteczek i nie wyświetla reklam. Odwiedziny liczymy tylko anonimowo, bez ciasteczek.', chips: ['0 ciasteczek', 'anonimowe statystyki'] },
    },
    faq: {
      title: 'Częste pytania',
      items: [
        { q: 'Czy Keypacer jest darmowy?', a: 'Tak. Ćwiczenia, postępy i dobrowolne konto są darmowe i bez reklam.' },
        { q: 'Czym Keypacer różni się od innych trenerów pisania?', a: 'Większość trenerów daje wszystkim te same lekcje. Keypacer mierzy każde uderzenie i układa każde ćwiczenie z klawiszy i par liter, które w tej chwili najbardziej cię spowalniają.' },
        { q: 'Czy potrzebuję konta?', a: 'Nie. Możesz zacząć od razu; bez konta postępy zapisuje przeglądarka. Z darmowym kontem są bezpieczne, nawet jeśli dane przeglądarki zostaną usunięte, i możesz kontynuować na innych urządzeniach.' },
        { q: 'Ile trwa nauka pisania bezwzrokowego?', a: 'Większość osób pisze bez patrzenia po kilku tygodniach ćwiczeń po 15–20 minut dziennie. Krótkie codzienne sesje działają lepiej niż długie i rzadkie, a tempo rośnie dalej.' },
        { q: 'Jakie układy klawiatury są obsługiwane?', a: 'Polski (programisty), amerykański i brytyjski QWERTY, niemiecki i szwajcarski QWERTZ, francuski i belgijski AZERTY, hiszpański, włoski, szwedzki/fiński, brazylijski ABNT2 i portugalski, Dvorak, Colemak i Colemak-DH. Keypacer rozpoznaje układ po klawiszach, które naciskasz.' },
        { q: 'Czy działa na telefonie lub tablecie?', a: 'Keypacer jest stworzony z myślą o prawdziwej klawiaturze. Tablet z klawiaturą sprawdza się dobrze; na telefonie możesz się rozejrzeć, ale pisania bezwzrokowego uczy się na fizycznej klawiaturze.' },
      ],
    },
    final: { title: 'Pierwsze ćwiczenie zajmie dwie minuty', text: 'Przepisz jedną linijkę, a Keypacer będzie wiedział, od czego zacząć.', cta: 'Zacznij za darmo' },
    foot: { imprint: 'Nota prawna', privacy: 'Prywatność', terms: 'Regulamin' },
  },
  'pt-BR': {
    name: 'Português (Brasil)',
    ogLocale: 'pt_BR',
    title: 'Curso de digitação grátis que se adapta a você | Keypacer',
    description:
      'Aprenda digitação com os dez dedos, grátis e online. O Keypacer mede cada tecla, encontra as que deixam você lento e treina justamente essas. Sem cadastro.',
    nav: { languages: 'Idioma', signIn: 'Entrar', open: 'Abrir o treinador', sections: 'Seções da página', method: 'Método', features: 'Recursos', faq: 'Perguntas', skip: 'Pular para o conteúdo' },
    hero: {
      eyebrow: 'Grátis · sem cadastro · sem anúncios',
      title: 'Aprenda a digitar com os dez dedos com um treinador que entende seus erros',
      rotate: [
        'Dez dedos. Dez minutos por dia.',
        'Cada exercício mira suas teclas mais lentas',
        'Primeiro sem erros, depois rápido',
      ],
      lead: 'O Keypacer mede cada tecla, encontra as teclas e os pares de letras que deixam você lento e monta com eles o seu próximo exercício. Assim você nunca treina o que já sabe.',
      cta: 'Começar grátis',
      continue: 'Continuar praticando',
      note: 'Funciona no navegador. Sem anúncios e sem precisar de conta.',
    },
    demo: {
      label: 'Experimente: digite a linha',
      start: 'Clique aqui e comece a digitar',
      result: 'Seu resultado',
      wpm: 'PPM',
      wpmLong: 'palavras por minuto',
      accuracy: 'precisão',
      slowTitle: 'Estas teclas seguraram você:',
      slowNone: 'Limpo e regular. Vamos ver como você se sai com o teclado inteiro.',
      nextBeginner: 'Sua primeira lição: as seis letras mais comuns e depois uma tecla nova de cada vez.',
      ctaBeginner: 'Começar a lição 1',
      nextFast: 'Você já digita bem rápido. Mais umas {n} palavras no treinador e você pula as teclas que já domina.',
      ctaFast: 'Terminar o nivelamento',
      again: 'Digitar outra linha',
      lines: [
        'a prática leva ao progresso quando os olhos ficam na tela',
        'cada tecla que você aprende sem olhar facilita a próxima',
        'quem digita sem olhar mantém os olhos no texto e não nas mãos',
      ],
    },
    facts: {
      label: 'O Keypacer em números',
      items: [
        { value: '∞', label: 'exercícios que se adaptam ao seu nível' },
        { value: '1 min', label: 'até o primeiro exercício, sem cadastro' },
        { value: '10.000', label: 'palavras mais comuns por idioma' },
        { value: '0', label: 'cookies, rastreadores e anúncios' },
      ],
    },
    method: {
      eyebrow: 'O método',
      title: 'Como você fica mais rápido',
      intro: 'Nada de lições iguais para todo mundo. Cada exercício nasce do seu jeito de digitar e fica mais preciso a cada rodada.',
      items: [
        { title: 'Uma tecla de cada vez', text: 'Você começa com as seis letras mais comuns e logo digita palavras de verdade. A próxima tecla só entra quando todas as anteriores estão precisas e fluentes.' },
        { title: 'Primeiro sem erros, depois rápido', text: 'Uma tecla errada mantém você na mesma letra. Quando a precisão cai, o contador de velocidade some até você voltar a digitar sem erros.' },
        { title: 'Direcionado, não igual para todos', text: 'Cada exercício se apoia nas teclas e nos pares de letras que deixam você lento, e traz de volta teclas que você não pratica há algum tempo, para que fiquem.' },
        { title: 'Rodadas curtas, pausas de verdade', text: 'Aquecimento, rodadas curtas de foco e depois frases de verdade. Quando a concentração cai, o Keypacer sugere uma pausa em vez de deixar você fixar erros.' },
      ],
    },
    analysis: {
      eyebrow: 'O que o Keypacer mede',
      title: 'O Keypacer percebe quais teclas deixam você lento',
      text: 'Você hesita um instante antes do ç ou troca o b pelo v? Você mal percebe, mas isso custa velocidade toda vez. O Keypacer mede cada tecla ao milissegundo e monta o próximo exercício exatamente com essas teclas e pares de letras.',
      points: [
        { chip: '1×', strong: 'Vale a primeira tentativa.', text: 'Um erro continua sendo um erro, mesmo que você o corrija na hora.' },
        { chip: '2s', strong: 'Pausas para pensar não contam.', text: 'Pausas de mais de dois segundos não distorcem sua velocidade.' },
        { chip: '↺', strong: 'Nada é esquecido.', text: 'Teclas que você não pratica há algum tempo voltam para revisão.' },
      ],
      tableTitle: 'Teclas mais fracas',
      tableNote: 'Exemplo depois de três rodadas',
      columns: ['Tecla', 'Erros', 'Tempo'],
      nextPrefix: 'O próximo exercício foca em',
      nextSuffix: 'e nos pares em volta.',
      example: { keys: ['ç', 'ã', 'x', 'j', 'q'], focus: ['ç', 'ã', 'ção'] },
    },
    features: {
      eyebrow: 'Recursos',
      title: 'Tudo o que você precisa, nada que atrapalhe',
      items: [
        { title: 'Seu idioma, seu teclado', text: 'Português do Brasil ou de Portugal, inglês, alemão, francês, espanhol, italiano, polonês ou indonésio, no ABNT2, QWERTY, QWERTZ, AZERTY, Dvorak, Colemak e outros. O Keypacer reconhece seu layout pelas teclas que você aperta.' },
        { title: 'Guia de dedos', text: 'Um teclado abaixo do texto mostra qual dedo vem a seguir. As teclas que você já sabe vão sumindo aos poucos.' },
        { title: 'Teste de nivelamento', text: 'Já digita um pouco? Um teste de um minuto, e o Keypacer pula todas as teclas que você já domina.' },
        { title: 'Progresso visível', text: 'Velocidade e precisão ao longo do tempo, um mapa de calor dos erros e suas teclas e pares de letras mais lentos.' },
        { title: 'Meta semanal e plano', text: 'Defina com que frequência quer praticar e coloque o plano na sua agenda. Rodadas curtas e regulares rendem mais do que sessões longas e raras.' },
        { title: 'Continue em qualquer lugar', text: 'Com uma conta grátis suas lições ficam seguras mesmo se os dados do navegador forem apagados, e você continua de onde parou em qualquer dispositivo.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · layout alemão', 'Français · layout francês', 'Português · ABNT2', 'English · Dvorak'],
      fingerWord: 'sala',
      letters: 'Letras',
      placing: 'Nivelamento em andamento …',
      skipped: { one: '{n} tecla pulada', other: '{n} teclas puladas' },
      speed: 'Velocidade',
      weekGoal: 'Meta semanal',
      lesson: 'Lição',
      laptop: 'Notebook',
      tablet: 'Tablet',
      stored: 'Guardado em Frankfurt, UE',
    },
    privacy: {
      eyebrow: 'Privacidade',
      title: 'Seus dados de digitação ficam com você',
      intro: 'O Keypacer sabe exatamente como você digita. Por isso esse conhecimento fica com você.',
      items: [
        { title: 'Sem cookies, sem rastreamento', text: 'O Keypacer não usa cookies, não mostra anúncios e não usa serviços de análise.', chips: ['0 cookies', '0 rastreadores'] },
        { title: 'Sem conta, tudo fica no navegador', text: 'Suas teclas só são guardadas no seu aparelho. Você pode exportá-las ou apagá-las quando quiser.', chips: ['.json', '.csv'] },
        { title: 'Com conta, na UE', text: 'A conta opcional sincroniza suas rodadas entre seus dispositivos por servidores em Frankfurt.', chips: ['Frankfurt', 'conta opcional'] },
      ],
    },
    analytics: {
      fact: 'cookies e anúncios',
      item: { title: 'Sem cookies, sem anúncios', text: 'O Keypacer não usa cookies e não mostra anúncios. As visitas são só contadas de forma anônima, sem cookies.', chips: ['0 cookies', 'estatísticas anônimas'] },
    },
    faq: {
      title: 'Perguntas',
      items: [
        { q: 'O Keypacer é grátis?', a: 'Sim. A prática, o progresso e a conta opcional são grátis, sem anúncios.' },
        { q: 'O que diferencia o Keypacer de outros cursos de digitação?', a: 'A maioria dos cursos dá as mesmas lições para todo mundo. O Keypacer mede cada tecla e monta cada exercício com as teclas e os pares de letras que mais deixam você lento agora.' },
        { q: 'Preciso de uma conta?', a: 'Não. Você pode começar na hora; sem conta, o navegador guarda seu progresso. Uma conta grátis mantém tudo seguro mesmo se os dados do navegador forem apagados, e permite continuar nos seus outros dispositivos.' },
        { q: 'Quanto tempo leva para aprender a digitar com os dez dedos?', a: 'A maioria das pessoas consegue digitar sem olhar depois de algumas semanas, com 15 a 20 minutos por dia. Sessões curtas e diárias funcionam melhor do que sessões longas e raras, e a velocidade continua crescendo depois disso.' },
        { q: 'Quais layouts de teclado são suportados?', a: 'Português ABNT2 (Brasil) e português de Portugal, QWERTY dos EUA e do Reino Unido, QWERTZ alemão e suíço, AZERTY francês e belga, espanhol, italiano, sueco/finlandês e polonês, Dvorak, Colemak e Colemak-DH. O Keypacer detecta seu layout pelas teclas que você aperta.' },
        { q: 'Funciona no celular ou no tablet?', a: 'O Keypacer foi feito para um teclado de verdade. Um tablet com teclado funciona bem; no celular dá para dar uma olhada, mas digitar com os dez dedos precisa de um teclado físico.' },
      ],
    },
    final: { title: 'Seu primeiro exercício leva dois minutos', text: 'Digite uma linha e o Keypacer sabe por onde você começa.', cta: 'Começar grátis' },
    foot: { imprint: 'Aviso legal', privacy: 'Privacidade', terms: 'Termos' },
  },
  'pt-PT': {
    name: 'Português (Portugal)',
    ogLocale: 'pt_PT',
    title: 'Aprende a escrever com os dez dedos, grátis | Keypacer',
    description:
      'Curso de datilografia grátis e online. O Keypacer mede cada tecla, descobre as que te atrasam e treina precisamente essas. Sem registo.',
    nav: { languages: 'Língua', signIn: 'Iniciar sessão', open: 'Abrir o treinador', sections: 'Secções da página', method: 'Método', features: 'Funcionalidades', faq: 'Perguntas', skip: 'Saltar para o conteúdo' },
    hero: {
      eyebrow: 'Grátis · sem registo · sem anúncios',
      title: 'Aprende a escrever com os dez dedos com um treinador que percebe os teus erros',
      rotate: [
        'Dez dedos. Dez minutos por dia.',
        'Cada exercício aponta às tuas teclas mais lentas',
        'Primeiro sem erros, depois depressa',
      ],
      lead: 'O Keypacer mede cada tecla, descobre as teclas e os pares de letras que te atrasam e faz com eles o teu próximo exercício. Assim nunca treinas o que já sabes.',
      cta: 'Começar grátis',
      continue: 'Continuar a praticar',
      note: 'Funciona no navegador. Sem anúncios e sem precisares de conta.',
    },
    demo: {
      label: 'Experimenta: escreve a linha',
      start: 'Clica aqui e começa a escrever',
      result: 'O teu resultado',
      wpm: 'PPM',
      wpmLong: 'palavras por minuto',
      accuracy: 'precisão',
      slowTitle: 'Estas teclas atrasaram-te:',
      slowNone: 'Limpo e regular. Vamos ver como te sais com o teclado todo.',
      nextBeginner: 'A tua primeira lição: as seis letras mais comuns e depois uma tecla nova de cada vez.',
      ctaBeginner: 'Começar a lição 1',
      nextFast: 'Já escreves bastante depressa. Mais umas {n} palavras no treinador e saltas as teclas que já dominas.',
      ctaFast: 'Terminar o teste de nível',
      again: 'Escrever outra linha',
      lines: [
        'a prática traz progresso quando os olhos ficam no ecrã',
        'cada tecla que aprendes sem olhar torna a seguinte mais fácil',
        'quem escreve sem olhar mantém os olhos no texto e não nas mãos',
      ],
    },
    facts: {
      label: 'O Keypacer em números',
      items: [
        { value: '∞', label: 'exercícios que se adaptam ao teu nível' },
        { value: '1 min', label: 'até ao primeiro exercício, sem registo' },
        { value: '10 000', label: 'palavras mais comuns por língua' },
        { value: '0', label: 'cookies, rastreadores e anúncios' },
      ],
    },
    method: {
      eyebrow: 'O método',
      title: 'Como ficas mais rápido',
      intro: 'Nada de lições iguais para todos. Cada exercício nasce da tua forma de escrever e fica mais preciso a cada ronda.',
      items: [
        { title: 'Uma tecla de cada vez', text: 'Começas com as seis letras mais comuns e cedo escreves palavras a sério. A tecla seguinte só entra quando todas as anteriores estão precisas e fluentes.' },
        { title: 'Primeiro sem erros, depois depressa', text: 'Uma tecla errada mantém-te na mesma letra. Quando a precisão desce, o contador de velocidade desaparece até voltares a escrever sem erros.' },
        { title: 'Direcionado, não igual para todos', text: 'Cada exercício aposta nas teclas e nos pares de letras que te atrasam, e traz de volta teclas que não praticas há algum tempo, para que fiquem.' },
        { title: 'Rondas curtas, pausas a sério', text: 'Aquecimento, rondas curtas de foco e depois frases a sério. Quando a concentração baixa, o Keypacer sugere uma pausa em vez de te deixar treinar erros.' },
      ],
    },
    analysis: {
      eyebrow: 'O que o Keypacer mede',
      title: 'O Keypacer repara nas teclas que te atrasam',
      text: 'Hesitas um instante antes do ç ou trocas o b pelo v? Mal dás por isso, mas custa-te velocidade de cada vez. O Keypacer mede cada tecla ao milissegundo e faz o próximo exercício precisamente com essas teclas e pares de letras.',
      points: [
        { chip: '1×', strong: 'Conta a primeira tentativa.', text: 'Um erro continua a ser um erro, mesmo que o corrijas logo.' },
        { chip: '2s', strong: 'As pausas para pensar não contam.', text: 'Pausas de mais de dois segundos não distorcem a tua velocidade.' },
        { chip: '↺', strong: 'Nada fica esquecido.', text: 'As teclas que não praticas há algum tempo voltam para revisão.' },
      ],
      tableTitle: 'Teclas mais fracas',
      tableNote: 'Exemplo depois de três rondas',
      columns: ['Tecla', 'Erros', 'Tempo'],
      nextPrefix: 'O próximo exercício foca-se em',
      nextSuffix: 'e nos pares à volta.',
      example: { keys: ['ç', 'ã', 'x', 'j', 'q'], focus: ['ç', 'ã', 'ção'] },
    },
    features: {
      eyebrow: 'Funcionalidades',
      title: 'Tudo o que precisas, nada que estorve',
      items: [
        { title: 'A tua língua, o teu teclado', text: 'Português de Portugal ou do Brasil, inglês, alemão, francês, espanhol, italiano, polaco ou indonésio, em QWERTY, ABNT2, QWERTZ, AZERTY, Dvorak, Colemak e outros. O Keypacer reconhece a tua disposição pelas teclas em que carregas.' },
        { title: 'Guia dos dedos', text: 'Um teclado por baixo do texto mostra que dedo vem a seguir. As teclas que já sabes vão desaparecendo aos poucos.' },
        { title: 'Teste de nível', text: 'Já escreves um pouco? Um teste de um minuto, e o Keypacer salta todas as teclas que já dominas.' },
        { title: 'Progresso à vista', text: 'Velocidade e precisão ao longo do tempo, um mapa de calor dos erros e as tuas teclas e pares de letras mais lentos.' },
        { title: 'Meta semanal e plano', text: 'Define com que frequência queres praticar e põe o plano no teu calendário. Rondas curtas e regulares rendem mais do que sessões longas e raras.' },
        { title: 'Continua em qualquer lado', text: 'Com uma conta gratuita as tuas lições ficam seguras mesmo que os dados do navegador sejam apagados, e continuas onde ficaste em qualquer dispositivo.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · disposição alemã', 'Français · disposição francesa', 'Português · disposição portuguesa', 'English · Dvorak'],
      fingerWord: 'sala',
      letters: 'Letras',
      placing: 'Teste de nível em curso …',
      skipped: { one: '{n} tecla saltada', other: '{n} teclas saltadas' },
      speed: 'Velocidade',
      weekGoal: 'Meta semanal',
      lesson: 'Lição',
      laptop: 'Portátil',
      tablet: 'Tablet',
      stored: 'Guardado em Frankfurt, UE',
    },
    privacy: {
      eyebrow: 'Privacidade',
      title: 'Os teus dados de escrita ficam contigo',
      intro: 'O Keypacer sabe exatamente como escreves. Por isso esse conhecimento fica contigo.',
      items: [
        { title: 'Sem cookies, sem rastreio', text: 'O Keypacer não usa cookies, não mostra anúncios e não usa serviços de análise.', chips: ['0 cookies', '0 rastreadores'] },
        { title: 'Sem conta, fica tudo no navegador', text: 'As tuas teclas só são guardadas no teu equipamento. Podes exportá-las ou apagá-las quando quiseres.', chips: ['.json', '.csv'] },
        { title: 'Com conta, na UE', text: 'A conta opcional sincroniza as tuas rondas entre os teus dispositivos através de servidores em Frankfurt.', chips: ['Frankfurt', 'conta opcional'] },
      ],
    },
    analytics: {
      fact: 'cookies e anúncios',
      item: { title: 'Sem cookies, sem anúncios', text: 'O Keypacer não usa cookies e não mostra anúncios. As visitas só são contadas de forma anónima, sem cookies.', chips: ['0 cookies', 'estatísticas anónimas'] },
    },
    faq: {
      title: 'Perguntas',
      items: [
        { q: 'O Keypacer é grátis?', a: 'Sim. A prática, o progresso e a conta opcional são gratuitos, sem anúncios.' },
        { q: 'O que distingue o Keypacer de outros cursos de datilografia?', a: 'A maioria dos cursos dá as mesmas lições a toda a gente. O Keypacer mede cada tecla e faz cada exercício com as teclas e os pares de letras que mais te atrasam neste momento.' },
        { q: 'Preciso de uma conta?', a: 'Não. Podes começar já; sem conta, o navegador guarda o teu progresso. Uma conta gratuita mantém tudo seguro mesmo que os dados do navegador sejam apagados, e permite-te continuar nos teus outros dispositivos.' },
        { q: 'Quanto tempo demora a aprender a escrever com os dez dedos?', a: 'A maioria das pessoas consegue escrever sem olhar ao fim de algumas semanas, com 15 a 20 minutos por dia. Sessões curtas e diárias funcionam melhor do que sessões longas e raras, e a velocidade continua a crescer depois disso.' },
        { q: 'Que disposições de teclado são suportadas?', a: 'Português de Portugal e português ABNT2 (Brasil), QWERTY dos EUA e do Reino Unido, QWERTZ alemão e suíço, AZERTY francês e belga, espanhol, italiano, sueco/finlandês e polaco, Dvorak, Colemak e Colemak-DH. O Keypacer deteta a tua disposição pelas teclas em que carregas.' },
        { q: 'Funciona no telemóvel ou no tablet?', a: 'O Keypacer foi feito para um teclado a sério. Um tablet com teclado funciona bem; no telemóvel podes dar uma vista de olhos, mas escrever com os dez dedos precisa de um teclado físico.' },
      ],
    },
    final: { title: 'O teu primeiro exercício demora dois minutos', text: 'Escreve uma linha e o Keypacer fica a saber por onde começas.', cta: 'Começar grátis' },
    foot: { imprint: 'Informação legal', privacy: 'Privacidade', terms: 'Termos' },
  },
  id: {
    name: 'Bahasa Indonesia',
    ogLocale: 'id_ID',
    title: 'Belajar mengetik 10 jari gratis, latihan yang menyesuaikan | Keypacer',
    description:
      'Belajar mengetik 10 jari gratis dan online. Keypacer mengukur setiap ketukan, menemukan tombol yang memperlambatmu, dan melatih tepat tombol itu. Tanpa daftar.',
    nav: { languages: 'Bahasa', signIn: 'Masuk', open: 'Buka pelatih', sections: 'Bagian halaman', method: 'Metode', features: 'Fitur', faq: 'Pertanyaan', skip: 'Langsung ke konten' },
    hero: {
      eyebrow: 'Gratis · tanpa daftar · tanpa iklan',
      title: 'Belajar mengetik 10 jari dengan pelatih yang memahami kesalahanmu',
      rotate: [
        'Sepuluh jari. Sepuluh menit sehari.',
        'Setiap latihan menyasar tombol terlambatmu',
        'Tepat dulu, baru cepat',
      ],
      lead: 'Keypacer mengukur setiap ketukan, menemukan tombol dan pasangan huruf yang memperlambatmu, lalu menyusun latihan berikutnya dari situ. Jadi kamu tidak pernah melatih yang sudah kamu kuasai.',
      cta: 'Mulai latihan gratis',
      continue: 'Lanjut latihan',
      note: 'Berjalan di browser. Tanpa iklan, tanpa perlu akun.',
    },
    demo: {
      label: 'Coba sekarang: ketik baris ini',
      start: 'Klik di sini dan mulai mengetik',
      result: 'Hasilmu',
      wpm: 'KPM',
      wpmLong: 'kata per menit',
      accuracy: 'akurasi',
      slowTitle: 'Tombol-tombol ini menahanmu:',
      slowNone: 'Tepat dan stabil. Mari lihat hasilmu dengan seluruh keyboard.',
      nextBeginner: 'Pelajaran pertamamu: enam huruf yang paling umum, lalu satu tombol baru setiap kali.',
      ctaBeginner: 'Mulai pelajaran 1',
      nextFast: 'Kamu sudah mengetik cukup cepat. Sekitar {n} kata lagi di pelatih, lalu kamu melewati tombol yang sudah kamu kuasai.',
      ctaFast: 'Selesaikan tes penempatan',
      again: 'Coba baris lain',
      lines: [
        'latihan membawa kemajuan kalau matamu tetap melihat layar',
        'setiap tombol yang kamu pelajari tanpa melihat membuat tombol berikutnya lebih mudah',
        'orang yang mengetik tanpa melihat menjaga matanya pada teks dan bukan pada tangan',
      ],
    },
    facts: {
      label: 'Keypacer dalam angka',
      items: [
        { value: '∞', label: 'latihan yang menyesuaikan kemampuanmu' },
        { value: '1 mnt', label: 'menuju latihan pertama, tanpa daftar' },
        { value: '10.000', label: 'kata paling umum per bahasa' },
        { value: '0', label: 'cookie, pelacak, dan iklan' },
      ],
    },
    method: {
      eyebrow: 'Metodenya',
      title: 'Cara kamu menjadi lebih cepat',
      intro: 'Bukan pelajaran yang sama untuk semua orang. Setiap latihan lahir dari caramu mengetik, dan makin tepat di setiap ronde.',
      items: [
        { title: 'Satu tombol setiap kali', text: 'Kamu mulai dengan enam huruf yang paling umum dan sejak awal sudah mengetik kata sungguhan. Tombol berikutnya baru ikut setelah semua tombol sebelumnya tepat dan lancar.' },
        { title: 'Tepat dulu, baru cepat', text: 'Tombol yang salah membuatmu tetap di huruf yang sama sampai kamu menekan yang benar. Saat akurasi turun, penghitung kecepatan menghilang sampai kamu mengetik dengan tepat lagi.' },
        { title: 'Terarah, bukan seragam', text: 'Setiap latihan berfokus pada tombol dan pasangan huruf yang memperlambatmu, dan memunculkan lagi tombol yang sudah lama tidak kamu latih agar tetap melekat.' },
        { title: 'Ronde pendek, istirahat sungguhan', text: 'Pemanasan, ronde fokus singkat, lalu kalimat sungguhan. Saat konsentrasimu menurun, Keypacer menyarankan istirahat daripada membiarkan kesalahan tertanam.' },
      ],
    },
    analysis: {
      eyebrow: 'Apa yang diukur Keypacer',
      title: 'Keypacer tahu tombol mana yang memperlambatmu',
      text: 'Kamu ragu sejenak sebelum menekan f, atau sering tertukar antara b dan v? Hampir tidak terasa, tetapi setiap kali itu memakan kecepatan. Keypacer mencatat waktu setiap ketukan hingga milidetik dan menyusun latihan berikutnya tepat dari tombol dan pasangan huruf itu.',
      points: [
        { chip: '1×', strong: 'Percobaan pertama yang dihitung.', text: 'Kesalahan tetap kesalahan, meski langsung kamu perbaiki.' },
        { chip: '2d', strong: 'Jeda berpikir tidak dihitung.', text: 'Jeda lebih dari dua detik tidak mengacaukan kecepatanmu.' },
        { chip: '↺', strong: 'Tidak ada yang terlupa.', text: 'Tombol yang sudah lama tidak kamu latih muncul lagi untuk diulang.' },
      ],
      tableTitle: 'Tombol terlemah',
      tableNote: 'Contoh setelah tiga ronde',
      columns: ['Tombol', 'Kesalahan', 'Waktu'],
      nextPrefix: 'Latihan berikutnya berfokus pada',
      nextSuffix: 'dan pasangan di sekitarnya.',
      example: { keys: ['f', 'v', 'z', 'y', 'c'], focus: ['f', 'v', 'ny'] },
    },
    features: {
      eyebrow: 'Fitur',
      title: 'Semua yang kamu perlukan, tanpa yang tidak perlu',
      items: [
        { title: 'Bahasamu, keyboardmu', text: 'Bahasa Indonesia, Inggris, Jerman, Prancis, Spanyol, Italia, Polandia, atau Portugis (Brasil dan Portugal), di QWERTY, QWERTZ, AZERTY, Dvorak, Colemak, dan lainnya. Keypacer mengenali tata letakmu dari tombol yang kamu tekan.' },
        { title: 'Panduan jari', text: 'Keyboard di bawah teks menunjukkan jari mana yang berikutnya. Tombol yang sudah kamu kuasai perlahan memudar.' },
        { title: 'Tes penempatan', text: 'Sudah bisa mengetik sedikit? Ikuti tes satu menit, dan Keypacer melewati semua tombol yang sudah kamu kuasai.' },
        { title: 'Kemajuan yang terlihat', text: 'Kecepatan dan akurasi dari waktu ke waktu, peta panas kesalahan, serta tombol dan pasangan huruf terlambatmu.' },
        { title: 'Target dan rencana mingguan', text: 'Tentukan seberapa sering kamu ingin berlatih dan tambahkan rencananya ke kalender. Sesi pendek yang rutin lebih bermanfaat daripada sesi panjang yang jarang.' },
        { title: 'Lanjutkan di mana saja', text: 'Dengan akun gratis, pelajaranmu tetap aman meski data browser terhapus, dan kamu bisa melanjutkan dari tempat terakhir di perangkat mana pun.' },
      ],
    },
    vignettes: {
      layouts: ['Deutsch · tata letak Jerman', 'Français · tata letak Prancis', 'Bahasa Indonesia · QWERTY AS', 'English · Dvorak'],
      fingerWord: 'gajah',
      letters: 'Huruf',
      placing: 'Tes penempatan berjalan …',
      skipped: { other: '{n} tombol dilewati' },
      speed: 'Kecepatan',
      weekGoal: 'Target mingguan',
      lesson: 'Pelajaran',
      laptop: 'Laptop',
      tablet: 'Tablet',
      stored: 'Disimpan di Frankfurt, UE',
    },
    privacy: {
      eyebrow: 'Privasi',
      title: 'Data ketikanmu tetap milikmu',
      intro: 'Keypacer tahu persis bagaimana kamu mengetik. Karena itu, pengetahuan ini tetap ada padamu.',
      items: [
        { title: 'Tanpa cookie, tanpa pelacakan', text: 'Keypacer tidak memasang cookie, tidak menampilkan iklan, dan tidak memakai layanan analitik.', chips: ['0 cookie', '0 pelacak'] },
        { title: 'Tanpa akun, semuanya tetap di browsermu', text: 'Ketukanmu hanya disimpan secara lokal. Kamu bisa mengekspor atau menghapusnya kapan saja.', chips: ['.json', '.csv'] },
        { title: 'Dengan akun, di Uni Eropa', text: 'Akun opsional menyinkronkan ronde-rondemu antarperangkat lewat server di Frankfurt.', chips: ['Frankfurt', 'akun opsional'] },
      ],
    },
    analytics: {
      fact: 'cookie dan iklan',
      item: { title: 'Tanpa cookie, tanpa iklan', text: 'Keypacer tidak memasang cookie dan tidak menampilkan iklan. Kunjungan hanya dihitung secara anonim, tanpa cookie.', chips: ['0 cookie', 'statistik anonim'] },
    },
    faq: {
      title: 'Pertanyaan',
      items: [
        { q: 'Apakah Keypacer gratis?', a: 'Ya. Latihan, kemajuan, dan akun opsional semuanya gratis, tanpa iklan.' },
        { q: 'Apa bedanya Keypacer dengan aplikasi latihan mengetik lainnya?', a: 'Kebanyakan aplikasi memberi semua orang pelajaran yang sama. Keypacer mengukur setiap ketukan dan menyusun setiap latihan dari tombol dan pasangan huruf yang paling memperlambatmu saat ini.' },
        { q: 'Apakah aku perlu akun?', a: 'Tidak. Kamu bisa langsung mulai; tanpa akun, kemajuanmu disimpan di browser. Akun gratis menjaganya tetap aman meski data browser terhapus, dan memungkinkanmu melanjutkan di perangkat lain.' },
        { q: 'Berapa lama belajar mengetik 10 jari?', a: 'Kebanyakan orang sudah bisa mengetik tanpa melihat setelah beberapa minggu berlatih 15 sampai 20 menit sehari. Sesi pendek setiap hari lebih efektif daripada sesi panjang yang jarang, dan kecepatan terus bertambah setelahnya.' },
        { q: 'Tata letak keyboard apa saja yang didukung?', a: 'QWERTY AS (yang dipakai hampir semua keyboard di Indonesia) dan UK, QWERTZ Jerman dan Swiss, AZERTY Prancis dan Belgia, Spanyol, Italia, Swedia/Finlandia, Polandia, ABNT2 Brasil dan Portugal, Dvorak, Colemak, dan Colemak-DH. Keypacer mengenali tata letakmu dari tombol yang kamu tekan.' },
        { q: 'Apakah bisa dipakai di ponsel atau tablet?', a: 'Keypacer dibuat untuk keyboard sungguhan. Tablet dengan keyboard bisa dipakai dengan baik; di ponsel kamu bisa melihat-lihat, tetapi mengetik 10 jari memerlukan keyboard fisik.' },
      ],
    },
    final: { title: 'Latihan pertamamu hanya dua menit', text: 'Ketik satu baris, dan Keypacer tahu dari mana kamu mulai.', cta: 'Mulai latihan gratis' },
    foot: { imprint: 'Informasi hukum', privacy: 'Privasi', terms: 'Ketentuan' },
  },
};
