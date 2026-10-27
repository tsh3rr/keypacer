# Feedback und Postfächer einschalten

Die Feedback-Funktion ist im Code fertig: ab und zu eine Karte unter dem Ergebnis einer Übung, „Feedback geben“ in den Einstellungen und in der Fußzeile, ein Formular, das über den Worker (`src/worker/index.ts`) und Resend eine Mail an feedback@keypacer.com schickt. In Vorschau-Builds ist sie an, in Produktion aus (`FEEDBACK` in `vite.config.ts`), bis die Schritte unten erledigt sind. Kosten: keine.

Das Impressum nennt ab diesem Stand hi@keypacer.com. Deshalb Teil A zuerst erledigen, bevor der Pull Request live geht.

## A. Empfang: feedback@ und hi@ an Gmail (Cloudflare Email Routing, ca. 15 Minuten)

- [ ] Cloudflare-Dashboard → `keypacer.com` → **Email** → **Email Routing** → **Get started** bzw. **Enable Email Routing**.
- [ ] Cloudflare schlägt drei MX-Einträge (`route1/2/3.mx.cloudflare.net`) und einen SPF-Eintrag für `keypacer.com` vor → **Add records and enable**. Die Resend-Einträge auf `send` und `resend._domainkey` bleiben, wie sie sind.
- [ ] **Destination addresses** → **Add destination address** → deine Gmail-Adresse. Cloudflare schickt eine Bestätigungsmail, den Link darin anklicken.
- [ ] **Routing rules** → **Create address**: Custom address `feedback`, Action **Send to an email**, Ziel deine Gmail-Adresse → **Save**.
- [ ] Dasselbe für `hi`.
- [ ] **Catch-all** aus lassen, sonst kommt Spam an erfundene Adressen bei dir an.
- [ ] Test: von einer anderen Adresse an hi@keypacer.com schreiben. Unter **Email Routing** → **Activity log** steht dann „Forwarded“.
- [ ] Tipp: in Gmail ein Filter „An: feedback@keypacer.com“ → Label „Keypacer Feedback“.

## B. Antworten als hi@keypacer.com aus Gmail (ca. 5 Minuten)

- [ ] Resend → **API Keys** → **Create API Key**: Name `gmail`, Permission **Sending access**, Domain `keypacer.com`. Schlüssel kopieren.
- [ ] Gmail am Computer → Zahnrad → **Alle Einstellungen** → **Konten und Import** → **Senden als** → **Weitere E-Mail-Adresse hinzufügen**.
- [ ] Name `Keypacer`, Adresse `hi@keypacer.com`, „Als Alias behandeln“ an → **Nächster Schritt**.
- [ ] SMTP-Server `smtp.resend.com`, Port `465`, Benutzername `resend`, Passwort = der neue Schlüssel, **SSL** → **Konto hinzufügen**.
- [ ] Gmail schickt einen Bestätigungscode an hi@keypacer.com; dank Teil A landet er in deinem Gmail. Code eingeben.
- [ ] Optional: „Von derselben Adresse antworten, an die die Nachricht gesendet wurde“ wählen.

Feedback-Mails haben die Adresse der Person als *Antwort an*, wenn sie eine Antwort wollte: In Gmail einfach auf **Antworten** drücken und als Absender hi@keypacer.com wählen.

## C. Feedback-Formular anschließen (ca. 5 Minuten)

- [ ] Resend → **API Keys** → **Create API Key**: Name `feedback`, Permission **Sending access**, Domain `keypacer.com`. Schlüssel kopieren.
- [ ] Cloudflare → **Workers & Pages** → `keypacer` → **Settings** → **Variables and Secrets** → **Add** → Type **Secret**, Name `RESEND_API_KEY`, Wert = der Schlüssel → **Deploy**.
- [ ] Turnstile-Prüfung im Worker: Cloudflare → **Turnstile** → das Widget, das die Anmeldung schützt → **Settings** → **Secret Key** kopieren. Dann wie oben ein Secret `TURNSTILE_SECRET_KEY` anlegen. (Ohne dieses Secret funktioniert das Formular auch, dann schützen nur das Limit von 3 Nachrichten pro Minute und Adresse und ein verstecktes Lockfeld.)
- [ ] Test in einer Vorschau (Pull Request → Cloudflare-Vorschau-Link): Einstellungen → **Feedback geben** → absenden. Die Mail kommt von feedback@keypacer.com in deinem Gmail an; bei Resend steht sie unter **Emails**.

## D. In Produktion einschalten

- [ ] In `vite.config.ts` `FEEDBACK = { production: true, staging: true }` setzen und deployen (oder Claude darum bitten). Damit erscheinen Karte, Formular und der Absatz „Feedback“ in der Datenschutzerklärung gleichzeitig.

## Wie oft die Karte kommt

Geregelt in `src/feedback.ts` (`PROMPT_RULES`): frühestens ab der 8. Übung und nicht am ersten Tag, nur unter einem ruhigen Ergebnis (kein neuer Buchstabe, keine Pausenkarte, kein Konto-Hinweis), nach „Nicht jetzt“ frühestens nach 14 Tagen und 30 weiteren Übungen, höchstens dreimal, nach ✕ oder gesendetem Feedback nie wieder.

## Kontingent

Resend Free: 100 Mails am Tag, 3.000 im Monat, geteilt mit den Anmelde-Codes. Das Limit im Worker hält Spam klein; sollte Feedback je das Tageskontingent gefährden, lässt sich `PROMPT_RULES` strenger stellen oder das Limit in `wrangler.jsonc` senken.
