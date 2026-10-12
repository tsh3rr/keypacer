# E-Mail einschalten (Resend)

Alles für Anmelde-Codes, „Passwort vergessen“ und die Bestätigung der E-Mail-Adresse ist im Code fertig, aber aus. Diese Liste schaltet es ein. Kosten: nur die Domain. Resend Free (3.000 Mails im Monat, 100 am Tag) stellt beim Limit den Versand ein und verrechnet nichts.

Reihenfolge: erst Staging (Vorschau-Builds) testen, dann Produktion.

## 1. Domain

- [x] keypacer.com gekauft, liegt bei Cloudflare.

## 2. Resend: keypacer.com verifizieren

- [ ] Auf [resend.com](https://resend.com) ein kostenloses Konto anlegen.
- [ ] **Domains** → **Add Domain** → `keypacer.com`, **Region: Ireland (eu-west-1)** → **Add**. Die Region lässt sich später nicht ändern, und die Datenschutzerklärung sagt „Server in der EU“.
- [ ] DNS-Einträge setzen, am einfachsten mit **Auto configure** / **Sign in to Cloudflare** auf der Resend-Seite (Cloudflare-Login, Zone `keypacer.com` erlauben). Von Hand: Cloudflare → `keypacer.com` → **DNS** → **Records** → **Add record**, jeden Eintrag genau so übernehmen, wie Resend ihn zeigt:
  - **MX**, Name `send`, Mail server `feedback-smtp.eu-west-1.amazonses.com`, Priority `10`
  - **TXT**, Name `send`, Inhalt `v=spf1 include:amazonses.com ~all`
  - **TXT**, Name `resend._domainkey`, Inhalt = der lange `p=…`-Schlüssel von Resend
  - empfohlen: **TXT**, Name `_dmarc`, Inhalt `v=DMARC1; p=none;`
  - Ein MX für `keypacer.com` selbst (z. B. Cloudflare Email Routing) stört nicht: Resend nutzt nur die Subdomain `send`.
- [ ] Zurück bei Resend: **Verify DNS Records**. Meist nach wenigen Minuten „Verified“.
- [ ] In der Domain unter **Configuration**: **Click Tracking** und **Open Tracking** aus.
- [ ] **API Keys** → **Create API Key**: Name `supabase`, Permission **Sending access**, Domain `keypacer.com`. Schlüssel kopieren (wird nur einmal gezeigt).
- [ ] Den Auftragsverarbeitungsvertrag ansehen: [resend.com/legal/dpa](https://resend.com/legal/dpa).

## 3. Supabase: über Resend versenden (Produktion, optional auch Staging)

- [ ] Supabase → Projekt → **Authentication** → **Emails** → **SMTP Settings** → **Enable custom SMTP**:
  - Sender email: `login@keypacer.com`
  - Sender name: `Keypacer`
  - Host: `smtp.resend.com`
  - Port: `465`
  - Username: `resend`
  - Password: der Resend-API-Key aus Schritt 2
  - **Save changes**
- [ ] Test: Supabase → **Authentication** → **Users** → **Add user** → **Send invitation** an deine eigene Adresse. Kommt die Mail von `login@keypacer.com` an, funktioniert der Versand. Bei Resend unter **Emails** siehst du sie als „Delivered“. (Den eingeladenen Testnutzer danach wieder löschen.)

Die Keypacer-Vorlagen (sechs Sprachen, mit Code) trägt der Workflow *Email templates* ein:

- [ ] GitHub → `tsh3rr/keypacer` → **Settings** → **Environments** → `production` (und `staging`, falls dort auch Resend eingetragen ist):
  - **Environment secrets** → `RESEND_API_KEY` = derselbe API-Key
  - **Environment variables** → `MAIL_FROM` = `login@keypacer.com`
- [ ] **Actions** → *Email templates* → **Run workflow** → `production`. Danach stehen in Supabase unter **Authentication** → **Emails** → **Templates** die Keypacer-Vorlagen.

## 4. Supabase (zuerst Staging, nach dem Test Produktion)

- [ ] **Authentication** → **URL Configuration**: **Site URL** = `https://keypacer.com`, unter **Redirect URLs** `https://keypacer.com/**` ergänzen (die `workers.dev`-Einträge dürfen bleiben).
- [ ] **Authentication** → **Rate Limits**: „Emails sent per hour“ z. B. auf `30` (Resend Free schafft 100 am Tag).
- [ ] **Authentication** → **Sign In / Providers** → **Email** → **Confirm email** **an** → **Save**. Wer sich bisher registriert hat, gilt schon als bestätigt und merkt nichts.

## 5. App umschalten

`EMAIL_LINKS` in `vite.config.ts` (je Supabase-Projekt) macht in der App „Mit Code anmelden“, „Passwort vergessen?“ und die Code-Eingabe nach der Registrierung sichtbar und schaltet in der Datenschutzerklärung den Absatz zu Resend ein. Seit PR #33 steht er für beide Projekte auf `true`.

Test nach dem Deploy:
- Konto mit echter Adresse anlegen → Mail kommt (mit „Confirm email“ an: Code eingeben) → angemeldet
- Abmelden → „Stattdessen mit Code per E-Mail anmelden“ → Code kommt → angemeldet
- „Passwort vergessen?“ → Code → neues Passwort wählen
- `/datenschutz` zeigt den Absatz „E-Mail-Versand“

Wichtig: Sobald Supabase über Resend versendet, ist Resend ein Auftragsverarbeiter; der Absatz dazu in der Datenschutzerklärung schaltet mit `EMAIL_LINKS` ein.
