# Besucherstatistik mit Umami einschalten

Umami zählt Besuche auf den Startseiten (`/`, `/de/`, `/es/`, …) und Aufrufe des Trainers (`/app/`), aber nicht, was im Trainer passiert, und nichts auf den Rechtsseiten. Solange in `vite.config.ts` keine Website-ID steht, ist alles aus: kein Skript, die Startseite sagt weiter „0 Tracker“ und die Datenschutzerklärung hat keinen Abschnitt dazu.

## 1. Konto und Website anlegen

1. Auf [cloud.umami.is](https://cloud.umami.is) registrieren. Falls bei der Anmeldung eine Region zur Wahl steht, **EU** wählen.
2. **Websites** → **Add website**: Name `Keypacer`, Domain `keypacer.com` (bzw. die Adresse, unter der die Seite läuft).
3. Website öffnen → **Edit** (oder **Settings**) → die **Website ID** kopieren (eine UUID).
4. Unter den Konto- bzw. Rechtseinstellungen den **Auftragsverarbeitungsvertrag (DPA)** von Umami abschließen bzw. herunterladen und aufbewahren. Die Datenschutzerklärung beruft sich darauf.
5. Prüfen, wie lange dein Tarif die Daten aufbewahrt. Die Datenschutzerklärung sagt „höchstens 12 Monate“; behält der Tarif länger, das in Umami kürzer einstellen oder den Satz in `src/legal/content.ts` anpassen.

## 2. Website-ID eintragen

In `vite.config.ts` bei `UMAMI` die ID für `production` eintragen (Staging bleibt leer, damit Vorschau-Builds nicht mitgezählt werden):

```ts
const UMAMI = { production: 'deine-website-id', staging: '' };
```

Mit dem nächsten Deploy von `main` laden die Startseiten und der Trainer das Skript, die Texte auf der Startseite wechseln von „0 Tracker“ zu „anonyme Statistik“ und die Datenschutzerklärung bekommt den Abschnitt *Reichweitenmessung* samt Knopf zum Abschalten.

Zum lokalen Ausprobieren statt dessen `VITE_UMAMI_WEBSITE_ID=…` in `.env.local` setzen.

## Was gezählt wird

- Seitenaufrufe der Startseiten und des Trainers (`/app/`), ohne Adresszusätze (`?…`, `#…`), mit Herkunftsseite, Browser, Gerät und Land. Im Trainer bleibt es bei diesem einen Aufruf.
- Klicks auf die drei Knöpfe der Startseite zum Trainer als Ereignisse `open-app-nav`, `start-hero` und `start-final`.
- Wer „Do Not Track“ eingeschaltet oder in der Datenschutzerklärung die Messung abgeschaltet hat (`umami.disabled` im localStorage), wird nicht gezählt.
