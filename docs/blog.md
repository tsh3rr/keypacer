# Blogartikel schreiben und veröffentlichen

Der Blog liegt unter `/blog/` (Englisch), `/de/blog/`, `/es/blog/`, `/fr/blog/`, `/it/blog/` und `/pl/blog/`. Es gibt kein Backend und keinen Editor: Jeder Artikel ist eine Markdown-Datei im Repo, und der Build macht daraus fertige Seiten. Veröffentlicht ist ein Artikel, sobald er auf `main` ist.

## Wo die Artikel liegen

```
content/blog/
  de/
    zehnfingersystem-in-30-tagen/
      index.md        ← der Text
      cover.jpg       ← Titelbild (optional)
      heatmap.png     ← weitere Bilder (optional)
  en/
    touch-typing-in-30-days/
      index.md
      cover.jpg
```

Der Ordnername ist die Adresse: `/de/blog/zehnfingersystem-in-30-tagen/`. Erlaubt sind nur Kleinbuchstaben, Ziffern und einzelne Bindestriche (ä → ae, ß → ss). Deutsch ist immer das Original; die anderen Sprachen sind maschinelle Übersetzungen davon.

## Der Kopf einer Datei

```markdown
---
title: Zehnfingersystem in 30 Tagen lernen
description: Ein realistischer Plan mit 15 Minuten am Tag, und warum Genauigkeit vor Tempo schneller ans Ziel führt.
updated: 2026-10-27
topic: start
cover: cover.jpg
coverAlt: Tastatur mit hervorgehobenen Tasten F und J
translation: zehnfinger-30-tage
order: 1
featured: true
---

Ab hier der Text in Markdown …
```

| Feld | Pflicht | Bedeutung |
| --- | --- | --- |
| `title` | ja | Überschrift, Seitentitel, Vorschau beim Teilen |
| `description` | ja | Text im Suchergebnis und auf der Karte, 50 bis 160 Zeichen |
| `updated` | ja | Letzte echte Überarbeitung (JJJJ-MM-TT). Im Artikel steht nur Monat und Jahr. Nur ändern, wenn sich der Inhalt wirklich ändert. |
| `topic` | ja | `start` (Einstieg), `method` (Methode), `tips` (Tipps), `keyboard` (Tastatur, auch Sonderzeichen und Shortcuts), `knowledge` (Wissen), `health` (Gesundheit) |
| `translation` | ja | Gleicher Wert in allen Sprachfassungen eines Artikels; verbindet sie für Sprachumschalter und Google |
| `translatedFrom` | bei Übersetzungen | `de`. Zeigt „Automatisch aus dem Deutschen übersetzt“ mit Link zum Original |
| `cover`, `coverAlt` | nein | Titelbild im Ordner (PNG, JPEG oder WebP, am besten 1200 × 675) und seine Beschreibung. Ohne Bild zeigt die Karte die Themenfarbe mit Logo, beim Teilen erscheint `og.png`. |
| `color` | nein | Kartenfarbe: `ember`, `magenta`, `cobalt` oder `neutral` (hellgrau). Ohne Angabe kommt sie vom Thema. |
| `order` | nein | Reihenfolge in der Übersicht, kleinste Zahl zuerst (Standard 100) |
| `featured` | nein | `true` = erscheint auf der Startseite unter „Aus dem Blog“ (höchstens drei) |
| `draft` | nein | `true` = nur in Vorschau-Builds sichtbar, nie auf keypacer.com |

## Was im Text geht

Normales Markdown: `## Zwischenüberschriften` (keine `#`, das ist der Titel), Absätze, Listen, Tabellen, `> Merksätze`, Links und Bilder. Tasten schreibst du als `<kbd>F</kbd>`. Anderes HTML wird als Text angezeigt, und eingebettete Inhalte von Dritten (YouTube, X, …) gehen nicht, weil sie Daten weitergeben würden und die Sicherheitsregeln in `public/_headers` sie blockieren.

Bilder legst du in den Ordner des Artikels und bindest sie mit Beschreibung ein: `![Heatmap der Tastatur nach einer Woche](heatmap.png)`.

Der Build prüft alles und bricht mit einer Meldung ab, die die Datei nennt: fehlende Pflichtfelder, ein Bild ohne Beschreibung oder ohne Datei, eine Übersetzung ohne deutsches Original, zwei Artikel mit derselben Adresse.

## Veröffentlichen

1. Branch anlegen, Artikel schreiben. Lokal zeigt `npm run dev` ihn unter `http://localhost:5173/de/blog/<ordner>/` und lädt bei jeder Änderung neu.
2. Pull Request öffnen. Die CI baut alles, Cloudflare legt eine Vorschau an, die Suchmaschinen nicht indexieren.
3. Mergen. Nach dem Deploy ist der Artikel live, mit Sitemap-Eintrag und RSS-Feed (`/de/blog/feed.xml`).

Die Ordner `blog/` und `<sprache>/blog/` im Hauptverzeichnis erzeugt der Build selbst; sie stehen in `.gitignore` und werden bei jedem Start überschrieben.
