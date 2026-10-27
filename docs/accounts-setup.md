# Konten einrichten (Supabase)

Einmalige Schritte im Supabase- und GitHub-Dashboard, damit Anmeldung und Abgleich funktionieren.
Alles gilt für **beide** Supabase-Projekte: zuerst Staging, dann Produktion.

| | Staging | Produktion |
|---|---|---|
| Projekt-ID (Ref) | `dghypouxfnfcdvpylznt` | `ubjwlxcawxwrgolszlkz` |
| Wird verwendet von | lokaler Entwicklung, Vorschau-Builds aller anderen Branches | Builds von `main` |

Die App wählt das Projekt selbst (Cloudflare setzt beim Build `WORKERS_CI_BRANCH`, siehe `vite.config.ts`). In Cloudflare ist nichts einzustellen.

## 1. Datenbank-Tabellen anlegen (GitHub-Secrets)

Die Tabellen kommen aus `supabase/migrations/`. Der Workflow *Database migrations* spielt sie bei einem PR in Staging und nach dem Merge in Produktion ein, sobald diese Secrets gesetzt sind:

1. **Access Token** (einer für beide): supabase.com → rechts oben dein Avatar → **Account preferences** → **Access Tokens** → **Generate new token**, Name `github-keypacer`. Token kopieren.
2. **Datenbank-Passwort** je Projekt: Projekt öffnen → **Project Settings** (Zahnrad) → **Database** → **Reset database password**. Neues Passwort kopieren.
3. GitHub: `tsh3rr/keypacer` → **Settings** → **Environments** → `staging` (fehlt es: **New environment**) → **Environment secrets** → **Add environment secret**:
   - `SUPABASE_ACCESS_TOKEN` = Token aus Schritt 1
   - `SUPABASE_DB_PASSWORD` = Passwort des Staging-Projekts
   - `SUPABASE_PROJECT_ID` = `dghypouxfnfcdvpylznt`
4. Dasselbe für das Environment `production`, mit dem Produktions-Passwort und `ubjwlxcawxwrgolszlkz`.

Prüfen: GitHub → **Actions** → *Database migrations* → **Run workflow** (läuft gegen Produktion), oder auf den nächsten PR warten (Staging). Danach siehst du in Supabase unter **Table Editor** die Tabellen `practice_sessions`, `user_state` und `profiles`.

## 2. Anmelde-Adressen erlauben

Projekt → **Authentication** → **URL Configuration**:

- **Site URL**: die Adresse der Seite. Produktion: `https://keypacer.jeremiasz-kapek.workers.dev` (oder später deine Domain). Staging: dieselbe Adresse ist in Ordnung.
- **Redirect URLs** → **Add URL**:
  - Produktion: `https://keypacer.jeremiasz-kapek.workers.dev/**`
  - Staging: `https://*-keypacer.jeremiasz-kapek.workers.dev/**` (Vorschau-Builds) und `http://localhost:5173/**` (lokal)

## 3. E-Mail und Passwort

Projekt → **Authentication** → **Sign In / Providers** → **Email**:

- **Enable Email provider**: an
- **Confirm email**: **aus**, solange es keinen eigenen Mailversand gibt (Schritt 6). Sonst bekommt jeder neue Nutzer eine Bestätigungsmail, die der eingebaute Versand nicht zustellt, und kann sich nie anmelden. Nachteil: Die E-Mail-Adresse wird nicht geprüft. Passwort vergessen geht in dieser Zeit auch nicht (braucht ebenfalls eine Mail), die Links sind in der App ausgeblendet, solange `EMAIL_LINKS` aus ist.
- **Minimum password length**: `8`
- **Save**

War **Confirm email** schon an, als sich jemand registriert hat, bleibt dieses Konto auch nach dem Ausschalten unbestätigt und kann sich nicht anmelden (die App sagt dann, das Konto sei noch nicht freigeschaltet). Freischalten: Projekt → **SQL Editor** → **New query**:

```sql
update auth.users set email_confirmed_at = now() where email_confirmed_at is null;
```

→ **Run**. Oder das Konto unter **Authentication** → **Users** löschen und neu registrieren.

## 4. Google-Anmeldung (optional, später)

Der Knopf ist ausgeblendet, bis `OAUTH_PROVIDERS` in `src/sync/account.ts` `'google'` enthält.

Einmal in der Google Cloud Console, dann in beiden Supabase-Projekten:

1. [console.cloud.google.com](https://console.cloud.google.com) → oben Projektauswahl → **Neues Projekt** → Name `Keypacer` → **Erstellen**.
2. Menü → **APIs & Dienste** → **OAuth-Zustimmungsbildschirm** (heißt auch **Google Auth Platform**) → **Jetzt starten**:
   - App-Name `Keypacer`, Support-E-Mail: deine Adresse → **Weiter**
   - Zielgruppe: **Extern** → **Weiter**, Kontakt-E-Mail → **Weiter** → zustimmen → **Erstellen**
   - **Branding**: Startseite `https://keypacer.jeremiasz-kapek.workers.dev`, Datenschutzerklärung `…/datenschutz`, Nutzungsbedingungen leer lassen; unter **Autorisierte Domains** `supabase.co` und `workers.dev`-Adresse bzw. später deine Domain → **Speichern**
   - **Zielgruppe** → **App veröffentlichen** (Status „In Produktion“). Für E-Mail und Name braucht es keine Prüfung durch Google.
3. **Clients** → **Client erstellen** → Anwendungstyp **Webanwendung**, Name `Keypacer`:
   - **Autorisierte JavaScript-Quellen**: `https://keypacer.jeremiasz-kapek.workers.dev` und `http://localhost:5173`
   - **Autorisierte Weiterleitungs-URIs**: `https://ubjwlxcawxwrgolszlkz.supabase.co/auth/v1/callback` und `https://dghypouxfnfcdvpylznt.supabase.co/auth/v1/callback`
   - **Erstellen** → **Client-ID** und **Clientschlüssel** kopieren.
4. In **jedem** Supabase-Projekt: **Authentication** → **Sign In / Providers** → **Google** → **Enable Sign in with Google** an, Client-ID und Client Secret einfügen → **Save**.

## 5. Vorlagen für die Anmelde-E-Mails

Kommen mit Schritt 6 automatisch: der Workflow *Email templates* trägt `supabase/templates` (sechs Sprachen) ein.

## 6. E-Mail-Versand über Resend

Anleitung: [email-setup.md](email-setup.md). Code-Anmeldung, „Passwort vergessen“ und die Bestätigung der Adresse schaltet `EMAIL_LINKS` in `vite.config.ts` je Supabase-Projekt ein; der Absatz zu Resend in der Datenschutzerklärung schaltet mit.

## 7. Sicherheit vor dem öffentlichen Start

Einmal in **beiden** Projekten prüfen (die Datenbank selbst ist über `supabase/migrations/` abgesichert):

- **Authentication** → **Sign In / Providers**: **Allow anonymous sign-ins** aus, **Minimum password length** `8` (Schritt 3). Die App verlangt 8 Zeichen, Supabase sonst nur 6, und wer die App umgeht, spricht direkt mit Supabase.
- **Authentication** → **URL Configuration**: nur die Adressen aus Schritt 2, keine weiteren Platzhalter. Kommt eine eigene Domain dazu, die alte workers.dev-Adresse erst entfernen, wenn niemand sie mehr nutzt.
- **Authentication** → **Rate Limits**: Standardwerte lassen (Anmelden und Registrieren 30 je 5 Minuten und IP-Adresse).
- **Advisors** → **Security Advisor**: sollte keine Fehler (rot) zeigen. Warnungen zu `username_available` und `buddy_invite` sind gewollt, die dürfen auch Abgemeldete aufrufen.
- **Project Settings** → **API Keys**: nur der *Publishable key* steht im Code. *Secret keys* und das Datenbank-Passwort nie in Code, Chat oder Screenshots; falls doch passiert: neu erzeugen.
- **Organization** → **Billing**: *Spend cap* bleibt an, damit keine Überraschungsrechnung kommt.
- Sobald es eigenen Mailversand gibt (Schritt 6): **Confirm email** einschalten. Bis dahin kann jemand ein Konto mit fremder E-Mail-Adresse anlegen, und meldet sich der echte Besitzer später mit Google an, kann Supabase ihn in dieses Konto führen.

## 8. Captcha gegen Massen-Registrierungen (Cloudflare Turnstile)

Anmelden, Registrieren, Anmeldecode und Passwort-Link mit E-Mail laufen dann über eine meist unsichtbare Prüfung. Google-Anmeldung ist nicht betroffen. Solange in `vite.config.ts` kein Site Key steht, ist alles aus. Die Reihenfolge ist wichtig, sonst kann sich niemand mehr mit E-Mail anmelden:

1. Cloudflare-Dashboard → **Turnstile** → **Add widget**: Name `keypacer`. Unter **Hostnames** drei Einträge: `keypacer.com` (die Seite), `jeremiasz-kapek.workers.dev` (deckt auch die Vorschau-Builds ab, die gegen Staging laufen) und `localhost` (für lokale Tests). **Widget Mode**: *Managed*. **Pre-clearance**: *No*. **Create**. Danach zeigt Cloudflare **Site Key** und **Secret Key**.
2. Den **Site Key** in `vite.config.ts` bei `TURNSTILE` für `production` und `staging` eintragen (oder Claude schicken). Er ist öffentlich. Mergen und warten, bis Cloudflare neu gebaut hat. Erst dann erscheint auch der Turnstile-Absatz in der Datenschutzerklärung. Ab jetzt schicken die Formulare ein Token mit, Supabase ignoriert es aber noch.
3. Den **Secret Key** zuerst im **Staging**-Projekt eintragen: Supabase → Projekt → **Authentication** → **Attack Protection** → **Enable Captcha protection** an → Provider **Turnstile by Cloudflare** → Secret Key → **Save**. Der Secret Key ist geheim: nicht in Code, Chat oder Screenshots.
4. Auf einer Vorschau-Adresse testen: abmelden, mit E-Mail und Passwort anmelden, ein neues Konto anlegen, „Passwort vergessen“ ausprobieren. Klappt etwas nicht, Schritt 3 wieder ausschalten.
5. Dann dasselbe im **Produktions**-Projekt (gleicher Secret Key) und auf keypacer.com noch einmal kurz anmelden.

Meldet die App „Die Prüfung, dass du kein Bot bist, hat nicht geklappt“, fehlt meist ein Hostname im Widget (Schritt 1) oder in Supabase steht ein anderer Secret Key als der zum Site Key gehörende.

Die Sicherheits-Header der Seite (Content-Security-Policy usw.) stehen in `public/_headers`. Kommt ein neuer Dienst dazu (z. B. Analytics oder Captcha), muss er dort und in der Datenschutzerklärung ergänzt werden.

## 9. Pausieren im Gratis-Tarif verhindern

Supabase pausiert Gratis-Projekte nach etwa einer Woche ohne Datenbank-Zugriff. Der Workflow *Database keep-alive* (`.github/workflows/supabase-keep-alive.yml`) fragt deshalb jede Woche dreimal beide Projekte kurz ab, zu jede Woche anderen, zufälligen Zeiten (einmal Mo–Di, einmal Mi–Do, einmal Fr–So) und mit wechselnden Abfragen. GitHub startet geplante Läufe oft Stunden zu spät oder gar nicht; darum fragt jeder Lauf ab, der als erster nach der gewählten Zeit kommt. Reine Leseabfragen zählen für Supabase offenbar nicht als Aktivität (Staging wurde trotzdem pausiert), darum schreibt jeder Ping zusätzlich die einzeilige Tabelle `keep_alive` (Migration `20261021090000_keep_alive.sql`). Er braucht keine Secrets. Testen (fragt sofort ab): GitHub → **Actions** → *Database keep-alive* → **Run workflow**. Schlägt er fehl, schickt GitHub eine Mail; meist ist das Projekt dann schon pausiert und muss einmal im Supabase-Dashboard mit **Restore project** geweckt werden.
