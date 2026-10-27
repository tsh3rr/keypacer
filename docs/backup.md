# Datenbank-Backup (Cloudflare R2)

Der kostenlose Supabase-Plan hat keine Backups, die man herunterladen kann. Der Workflow *Database backup* (`.github/workflows/supabase-backup.yml`) sichert deshalb jede Nacht um 02:17 UTC die Produktionsdatenbank:

- **Inhalt:** Rollen, Schema und alle Daten aus `auth` (Konten samt Passwort-Hashes) und `public` (Profile, Übungsdaten, Lernstand, Trainingspartner).
- **Verschlüsselung:** mit [age](https://age-encryption.org), bevor die Datei den GitHub-Runner verlässt. Im Repo liegt nur der öffentliche Schlüssel; entschlüsseln kann nur, wer den privaten Schlüssel hat.
- **Ablage:** ein R2-Bucket bei Cloudflare in der EU, Dateien `daily/keypacer-JJJJ-MM-TT-HHMM.tar.gz.age`. Eine Lebenszyklus-Regel löscht jede Datei nach 90 Tagen (so steht es auch in der Datenschutzerklärung).
- **Kosten:** keine. Ein Backup ist wenige MB groß, 90 Stück bleiben weit unter den 10 GB, die R2 kostenlos bietet.

Bis alles unten eingerichtet ist, überspringt der Workflow sich selbst und bleibt grün.

## Einrichten (einmalig, ca. 15 Minuten)

### 1. Schlüsselpaar erzeugen

Auf deinem Rechner (`brew install age`, `apt install age` oder unter Windows `winget install FiloSottile.age`):

```sh
age-keygen -o keypacer-backup-key.txt
```

Die Ausgabe zeigt `Public key: age1…`. Diese Zeile brauchst du gleich.

**Die Datei `keypacer-backup-key.txt` ist der einzige Weg an die Backups.** Leg sie in deinen Passwort-Manager (als Notiz oder Anhang) und zusätzlich an einen zweiten sicheren Ort. Nicht ins Repo, nicht in GitHub-Secrets.

### 2. R2-Bucket anlegen

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **R2 Object Storage**. Beim ersten Mal R2 aktivieren (verlangt eine Zahlungsmethode, die kostenlose Stufe kostet aber nichts).
2. **Create bucket** → Name `keypacer-backups` → **Location**: **Specify jurisdiction** → **European Union (EU)** → **Create bucket**.
3. Im Bucket → **Settings** → **Object lifecycle rules** → **Add rule**: Name `90 Tage`, für alle Objekte, **Delete objects** nach `90` Tagen → **Save**.
4. Die **Account ID** steht rechts auf der R2-Übersichtsseite. Kopieren.
5. R2-Übersicht → **Manage API tokens** (bzw. **API** → **Manage API tokens**) → **Create Account API token**: Name `github-keypacer-backup`, Berechtigung **Object Read & Write**, **Apply to specific buckets only** → `keypacer-backups` → **Create**. **Access Key ID** und **Secret Access Key** kopieren (das Secret wird nur einmal angezeigt).

### 3. In GitHub eintragen

GitHub → Repo → **Settings** → **Environments** → `production`:

- **Environment variables** → **Add variable**: `BACKUP_AGE_RECIPIENT` = der `age1…`-Schlüssel aus Schritt 1 (öffentlich, darum eine Variable und kein Secret).
- **Environment secrets** → **Add secret**:
  - `R2_ACCOUNT_ID` = Account ID aus Schritt 2.4
  - `R2_BUCKET` = `keypacer-backups`
  - `R2_ACCESS_KEY_ID` und `R2_SECRET_ACCESS_KEY` = aus Schritt 2.5

`SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` und `SUPABASE_PROJECT_ID` sind dieselben wie für *Database migrations* (siehe [accounts-setup.md](accounts-setup.md), Abschnitt 1). Fehlen sie noch, dort zuerst eintragen.

### 4. Ausprobieren

GitHub → **Actions** → *Database backup* → **Run workflow**. Nach 2–3 Minuten liegt im Bucket unter `daily/` eine Datei. Schlägt ein Lauf fehl, schickt GitHub dir eine Mail.

## Backup öffnen

Datei im Cloudflare-Dashboard herunterladen (Bucket → Datei → **Download**), dann:

```sh
mkdir backup && age -d -i keypacer-backup-key.txt keypacer-….tar.gz.age | tar -xz -C backup
```

Im Ordner liegen `roles.sql`, `schema.sql` und `data.sql`. `data.sql` ist lesbarer Text; so kannst du auch nur einzelne Zeilen heraussuchen, etwa versehentlich gelöschte Übungen einer Person.

## Wiederherstellen

Am sichersten in ein **neues, leeres** Supabase-Projekt (im kostenlosen Plan musst du dafür vorher Staging pausieren, weil nur zwei Projekte gleichzeitig laufen dürfen). Die Verbindungsadresse findest du im neuen Projekt unter **Connect** → **Session pooler**.

```sh
cd backup
DB='<Adresse aus Connect → Session pooler, mit eingesetztem Passwort>'
psql --file roles.sql --dbname "$DB"
psql --single-transaction --variable ON_ERROR_STOP=1 \
  --file schema.sql \
  --command 'SET session_replication_role = replica' \
  --file data.sql \
  --dbname "$DB"
```

Fehler in `roles.sql` (etwa `permission denied for parameter …`) sind harmlos: dort stehen nur Zeitlimits und Rechte für Supabase-eigene Rollen. Der zweite Befehl läuft in einer Transaktion: entweder kommt alles an oder nichts.

Danach im neuen Projekt die Einstellungen aus [accounts-setup.md](accounts-setup.md) (Anmelde-Adressen, E-Mail, Google) und [email-setup.md](email-setup.md) wiederholen, denn die stehen nicht in der Datenbank, und in `vite.config.ts` URL und Publishable Key des neuen Projekts eintragen.

## Probe ohne Risiko (lokal)

Mit Docker und der [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) lässt sich ein Backup gefahrlos auf dem eigenen Rechner zurückspielen:

```sh
mkdir -p probe/supabase/migrations && cp -r supabase/config.toml supabase/templates probe/supabase/
cd probe && supabase db start
DB='postgresql://postgres:postgres@127.0.0.1:54322/postgres'
# dann die beiden psql-Befehle von oben, mit diesem $DB
psql "$DB" -c 'select count(*) from auth.users' -c 'select count(*) from public.practice_sessions'
supabase stop --no-backup
```

So wurde der Ablauf auch getestet: Konto (das Passwort passt danach noch), Benutzername, Übungen, Lernstand und alle Zugriffsregeln kamen vollständig an.
