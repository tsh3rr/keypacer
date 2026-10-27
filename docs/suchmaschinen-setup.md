# Bei Google, Bing und Co. anmelden

Technisch ist alles im Code: jede Sprache hat ihre eigene Startseite mit Titel, Beschreibung, Canonical-Link, hreflang-Verweisen auf die anderen Sprachen, Open-Graph-Vorschau und strukturierten Daten. Der Build schreibt `robots.txt` und `sitemap.xml`; Vorschau-Builds sperren Suchmaschinen aus, der Trainer unter `/app/` bleibt aus den Ergebnissen heraus. Diese Liste meldet die Seite bei den Suchmaschinen an. Kosten: keine.

## 1. Vorher prüfen

- [ ] Die Änderung ist auf `main` gemergt und Cloudflare hat neu gebaut.
- [ ] https://keypacer.com/robots.txt zeigt `Allow: /` und die Zeile `Sitemap: https://keypacer.com/sitemap.xml`. Steht dort `Disallow: /`, ist es ein Vorschau-Build und nicht die Produktion.
- [ ] https://keypacer.com/sitemap.xml öffnet sich und listet `/`, `/de/`, `/es/`, `/fr/`, `/it/`, `/pl/` und die drei Rechtsseiten.

## 2. Google Search Console

- [ ] https://search.google.com/search-console öffnen, mit deinem Google-Konto anmelden.
- [ ] **Property hinzufügen** → links **Domain** wählen → `keypacer.com` eintragen → **Weiter**. (Die Domain-Property deckt `https://`, `www.` und alle Unterseiten auf einmal ab.)
- [ ] Google zeigt einen TXT-Eintrag (`google-site-verification=…`). Erkennt Google Cloudflare als Anbieter, auf **Bestätigung bei Cloudflare starten** klicken und den Zugriff erlauben, fertig. Sonst von Hand: Cloudflare → `keypacer.com` → **DNS** → **Records** → **Add record** → Typ `TXT`, Name `@`, Inhalt den Text von Google → **Save**, dann in der Search Console **Bestätigen**. Kann ein paar Minuten dauern; den TXT-Eintrag danach nicht löschen.
- [ ] Links **Sitemaps** → bei „Neue Sitemap hinzufügen“ `sitemap.xml` eintragen → **Senden**. Status sollte nach kurzer Zeit „Erfolgreich“ sein, mit 9 gefundenen Seiten.
- [ ] Oben in die Suchleiste `https://keypacer.com/` eingeben → **Indexierung beantragen**. Dasselbe für `https://keypacer.com/de/` (und gern die anderen Sprachen). Das beschleunigt nur den ersten Besuch; nötig ist es nicht.

## 3. Bing Webmaster Tools (deckt auch DuckDuckGo, Ecosia und Yahoo ab)

- [ ] https://www.bing.com/webmasters öffnen und mit demselben Google-Konto anmelden.
- [ ] **Aus der Google Search Console importieren** → **Weiter** → Zugriff erlauben → `keypacer.com` auswählen → **Importieren**. Bing übernimmt Bestätigung und Sitemap, du musst nichts mehr eintragen.
- [ ] Falls der Import nicht angeboten wird: **Website hinzufügen** → `https://keypacer.com` → Bestätigung per DNS (TXT- oder CNAME-Eintrag in Cloudflare wie oben) → danach unter **Sitemaps** `https://keypacer.com/sitemap.xml` einreichen.

## 4. Optional: Änderungen sofort melden (IndexNow)

- [ ] Cloudflare → `keypacer.com` → **Caching** → **Configuration** → **Crawler Hints** einschalten. Cloudflare meldet geänderte Seiten dann selbst per IndexNow an Bing, Yandex und Co. Google nutzt IndexNow nicht, liest aber die Sitemap regelmäßig.

## 5. Danach

- Nach jeder Änderung an Titel, Beschreibung, Logo oder Seitenname: in der Search Console oben `https://keypacer.com/` und `https://keypacer.com/de/` prüfen → **Indexierung beantragen**. Google übernimmt Seitenname und Favicon erst beim nächsten Besuch der Startseite; bis dahin steht dort `keypacer.com` und ein graues Weltkugel-Symbol, und das kann ein bis drei Wochen dauern.
- Was Google über `/app/?lang=…` schon aufgenommen hat (englischer Titel „Keypacer: touch typing trainer“), verschwindet nach dem nächsten Besuch von selbst, weil der Trainer jetzt `noindex` ist. Schneller geht es in der Search Console unter **Entfernen** → **Neuer Antrag** → Präfix `https://keypacer.com/app/`.

- Erste Treffer kommen meist nach ein paar Tagen, gute Plätze für „Zehnfingersystem lernen“ und ähnliche Suchen brauchen Wochen bis Monate. Mit `site:keypacer.com` in Google oder Bing siehst du, was schon drin ist.
- In der Search Console zeigt **Seiten** (unter „Indexierung“), was aufgenommen ist und was nicht. `/app/` steht dort absichtlich unter „Durch noindex-Tag ausgeschlossen“, ebenso `keypacer.jeremiasz-kapek.workers.dev`-Adressen als „Duplikat“: beides ist richtig so.
- **Verbesserungen** bzw. der [Test für Rich-Suchergebnisse](https://search.google.com/test/rich-results) zeigen, ob die strukturierten Daten gelesen werden. Die FAQ-Kästchen zeigt Google inzwischen fast nur noch bei Behörden- und Gesundheitsseiten an; die Daten schaden nicht und andere Suchmaschinen nutzen sie.
- Was am meisten hilft, liegt außerhalb des Codes: Links von anderen Seiten (Foren, Reddit, Schul- und Lernseiten, Verzeichnisse für kostenlose Tools). Siehe dazu auch die Promotion-Strategie.
