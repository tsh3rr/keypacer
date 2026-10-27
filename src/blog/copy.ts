import type { LandingLanguage } from '../landing/content.ts';

/**
 * Interface text of the blog, one per page language. The articles themselves
 * are Markdown files in content/blog/<lang>/ (see posts.ts).
 */

/** Topics an article can belong to, in the order the overview lists them. */
export const TOPICS = ['start', 'method', 'tips', 'keyboard', 'knowledge', 'health'] as const;
export type Topic = (typeof TOPICS)[number];

export interface BlogCopy {
  /** Link in the navigation and the footer, and the start of every page title. */
  name: string;
  /** Search result title and snippet of the overview. */
  title: string;
  description: string;
  /** Overview heading and the line under it. */
  heading: string;
  intro: string;
  /** The landing page section with three articles. */
  teaser: { eyebrow: string; title: string; intro: string; all: string };
  /** `{n}`: minutes. */
  minutes: string;
  /** `{date}`: month and year of the last change. */
  updated: string;
  readMore: string;
  /** Breadcrumbs: label of the trail and of the front page. */
  trail: string;
  home: string;
  /** Under an article that was translated from German, with a link to the original. */
  translated: string;
  original: string;
  /** Other languages the article exists in. */
  alsoIn: string;
  /** The box at the end of every article. */
  cta: { title: string; text: string; button: string };
  related: string;
  topics: Record<Topic, string>;
}

export const BLOG_COPY: Record<LandingLanguage, BlogCopy> = {
  en: {
    name: 'Blog',
    title: 'Blog · Keypacer: learn touch typing step by step',
    description: 'Guides to touch typing: the method, the keyboard, special characters and how to get faster without making more mistakes.',
    heading: 'Better typing, step by step',
    intro: 'Articles about the method, the keyboard and practising. Each one ends with an exercise in the trainer.',
    teaser: {
      eyebrow: 'From the blog',
      title: 'Better typing, step by step',
      intro: 'Short articles about the method, the keyboard and how to get faster without making more mistakes.',
      all: 'All articles',
    },
    minutes: '{n} min read',
    updated: 'Updated {date}',
    readMore: 'Read more',
    trail: 'Breadcrumb',
    home: 'Home',
    translated: 'Automatically translated from German.',
    original: 'Read the original',
    alsoIn: 'Also in',
    cta: {
      title: 'Try it now',
      text: 'In a few minutes the trainer finds your weakest keys and builds your first drill from them.',
      button: 'Practise in the trainer',
    },
    related: 'Keep reading',
    topics: { start: 'Getting started', method: 'Method', keyboard: 'Keyboard', knowledge: 'Background', tips: 'Tips', health: 'Health' },
  },
  de: {
    name: 'Blog',
    title: 'Blog · Keypacer: Zehnfingersystem Schritt für Schritt',
    description: 'Ratgeber zum Zehnfingersystem: Methode, Tastatur, Sonderzeichen und wie du schneller tippst, ohne mehr Fehler zu machen.',
    heading: 'Besser tippen, Schritt für Schritt',
    intro: 'Artikel zur Methode, zur Tastatur und zum Üben. Jeder endet mit einer Übung im Trainer.',
    teaser: {
      eyebrow: 'Aus dem Blog',
      title: 'Besser tippen, Schritt für Schritt',
      intro: 'Kurze Artikel zur Methode, zur Tastatur und dazu, wie du schneller wirst, ohne mehr Fehler zu machen.',
      all: 'Alle Artikel',
    },
    minutes: '{n} Min. Lesezeit',
    updated: 'Aktualisiert: {date}',
    readMore: 'Weiterlesen',
    trail: 'Pfad',
    home: 'Start',
    translated: 'Automatisch aus dem Deutschen übersetzt.',
    original: 'Original lesen',
    alsoIn: 'Auch auf',
    cta: {
      title: 'Probier es gleich aus',
      text: 'Der Trainer findet in ein paar Minuten deine schwächsten Tasten und baut daraus deine erste Übung.',
      button: 'Jetzt im Trainer üben',
    },
    related: 'Weiterlesen',
    topics: { start: 'Einstieg', method: 'Methode', keyboard: 'Tastatur', knowledge: 'Wissen', tips: 'Tipps', health: 'Gesundheit' },
  },
  es: {
    name: 'Blog',
    title: 'Blog · Keypacer: mecanografía paso a paso',
    description: 'Guías de mecanografía: el método, el teclado, los caracteres especiales y cómo escribir más rápido sin cometer más errores.',
    heading: 'Escribe mejor, paso a paso',
    intro: 'Artículos sobre el método, el teclado y la práctica. Cada uno termina con un ejercicio en el entrenador.',
    teaser: {
      eyebrow: 'Del blog',
      title: 'Escribe mejor, paso a paso',
      intro: 'Artículos breves sobre el método, el teclado y cómo ganar velocidad sin cometer más errores.',
      all: 'Todos los artículos',
    },
    minutes: '{n} min de lectura',
    updated: 'Actualizado: {date}',
    readMore: 'Seguir leyendo',
    trail: 'Ruta',
    home: 'Inicio',
    translated: 'Traducido automáticamente del alemán.',
    original: 'Leer el original',
    alsoIn: 'También en',
    cta: {
      title: 'Pruébalo ahora',
      text: 'En unos minutos, el entrenador encuentra tus teclas más débiles y crea con ellas tu primer ejercicio.',
      button: 'Practicar en el entrenador',
    },
    related: 'Sigue leyendo',
    topics: { start: 'Primeros pasos', method: 'Método', keyboard: 'Teclado', knowledge: 'Saber', tips: 'Consejos', health: 'Salud' },
  },
  fr: {
    name: 'Blog',
    title: 'Blog · Keypacer : la frappe à dix doigts pas à pas',
    description: 'Guides de dactylographie : la méthode, le clavier, les caractères spéciaux et comment taper plus vite sans faire plus de fautes.',
    heading: 'Mieux taper, pas à pas',
    intro: 'Des articles sur la méthode, le clavier et l’entraînement. Chacun se termine par un exercice dans l’entraîneur.',
    teaser: {
      eyebrow: 'Sur le blog',
      title: 'Mieux taper, pas à pas',
      intro: 'De courts articles sur la méthode, le clavier et comment gagner en vitesse sans faire plus de fautes.',
      all: 'Tous les articles',
    },
    minutes: '{n} min de lecture',
    updated: 'Mis à jour : {date}',
    readMore: 'Lire la suite',
    trail: 'Fil d’Ariane',
    home: 'Accueil',
    translated: 'Traduit automatiquement de l’allemand.',
    original: 'Lire l’original',
    alsoIn: 'Aussi en',
    cta: {
      title: 'Essaie tout de suite',
      text: 'En quelques minutes, l’entraîneur trouve tes touches les plus faibles et en fait ton premier exercice.',
      button: 'S’entraîner maintenant',
    },
    related: 'À lire aussi',
    topics: { start: 'Premiers pas', method: 'Méthode', keyboard: 'Clavier', knowledge: 'Savoir', tips: 'Astuces', health: 'Santé' },
  },
  it: {
    name: 'Blog',
    title: 'Blog · Keypacer: dattilografia passo dopo passo',
    description: 'Guide alla dattilografia: il metodo, la tastiera, i caratteri speciali e come scrivere più velocemente senza fare più errori.',
    heading: 'Scrivere meglio, passo dopo passo',
    intro: 'Articoli sul metodo, sulla tastiera e sull’esercizio. Ognuno termina con un esercizio nell’allenatore.',
    teaser: {
      eyebrow: 'Dal blog',
      title: 'Scrivere meglio, passo dopo passo',
      intro: 'Brevi articoli sul metodo, sulla tastiera e su come diventare più veloce senza fare più errori.',
      all: 'Tutti gli articoli',
    },
    minutes: '{n} min di lettura',
    updated: 'Aggiornato: {date}',
    readMore: 'Continua a leggere',
    trail: 'Percorso',
    home: 'Home',
    translated: 'Tradotto automaticamente dal tedesco.',
    original: 'Leggi l’originale',
    alsoIn: 'Anche in',
    cta: {
      title: 'Provalo subito',
      text: 'In pochi minuti l’allenatore trova i tuoi tasti più deboli e ne ricava il tuo primo esercizio.',
      button: 'Esercitati ora',
    },
    related: 'Continua a leggere',
    topics: { start: 'Primi passi', method: 'Metodo', keyboard: 'Tastiera', knowledge: 'Approfondimenti', tips: 'Consigli', health: 'Salute' },
  },
  pl: {
    name: 'Blog',
    title: 'Blog · Keypacer: pisanie bezwzrokowe krok po kroku',
    description: 'Poradniki pisania bezwzrokowego: metoda, klawiatura, znaki specjalne i jak pisać szybciej, nie robiąc więcej błędów.',
    heading: 'Pisz lepiej, krok po kroku',
    intro: 'Artykuły o metodzie, klawiaturze i ćwiczeniu. Każdy kończy się ćwiczeniem w trenerze.',
    teaser: {
      eyebrow: 'Z bloga',
      title: 'Pisz lepiej, krok po kroku',
      intro: 'Krótkie artykuły o metodzie, klawiaturze i o tym, jak pisać szybciej bez większej liczby błędów.',
      all: 'Wszystkie artykuły',
    },
    minutes: '{n} min czytania',
    updated: 'Zaktualizowano: {date}',
    readMore: 'Czytaj dalej',
    trail: 'Ścieżka',
    home: 'Start',
    translated: 'Przetłumaczono automatycznie z niemieckiego.',
    original: 'Przeczytaj oryginał',
    alsoIn: 'Także w',
    cta: {
      title: 'Wypróbuj od razu',
      text: 'W kilka minut trener znajduje Twoje najsłabsze klawisze i układa z nich Twoje pierwsze ćwiczenie.',
      button: 'Ćwicz w trenerze',
    },
    related: 'Czytaj dalej',
    topics: { start: 'Na początek', method: 'Metoda', keyboard: 'Klawiatura', knowledge: 'Wiedza', tips: 'Porady', health: 'Zdrowie' },
  },
};
