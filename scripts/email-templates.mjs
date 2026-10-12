// The e-mails Supabase sends for Keypacer accounts, in every interface language.
//
// Supabase fills each template in with Go's template language. The account
// stores the learner's interface language as `locale` in its user metadata
// (src/sync/account.ts), so `.Data.locale` picks the text; anything else gets
// English. No images: they would need hosting and many mail apps block them.
//
//   node scripts/email-templates.mjs   writes supabase/templates/*.html and
//                                      the templates block in supabase/config.toml
//
// The HTML files are what to paste into the Supabase dashboard by hand; the
// workflow "Email templates" sends them, with the subjects, through the
// Supabase Management API instead (scripts/push-email-templates.mjs).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const LANGUAGES = ['en', 'de', 'fr', 'es', 'it', 'pl'];

/** The templates Keypacer uses, by their Supabase name. */
export const KINDS = ['confirmation', 'magic_link', 'recovery'];

const TEXT = {
  en: {
    confirmation: {
      subject: 'Confirm your Keypacer account: {{ .Token }}',
      heading: 'Welcome to Keypacer',
      intro: 'Enter this code in Keypacer to confirm your e-mail address and finish creating your account:',
      button: 'Confirm my address',
      ignore: 'If you did not create an account, just ignore this e-mail. Without the code, no account is opened.',
    },
    magic_link: {
      subject: 'Your Keypacer sign-in code: {{ .Token }}',
      heading: 'Sign in to Keypacer',
      intro: 'Enter this code in Keypacer to sign in:',
      button: 'Sign in',
      ignore: 'If you did not ask to sign in, just ignore this e-mail. Nobody can sign in without the code.',
    },
    recovery: {
      subject: 'Reset your Keypacer password: {{ .Token }}',
      heading: 'Choose a new password',
      intro: 'Enter this code in Keypacer to choose a new password for your account:',
      button: 'Choose a new password',
      ignore: 'If you did not ask for this, just ignore this e-mail. Your password stays as it is.',
    },
    or: 'Or open this link on the device where you asked for the code:',
    expires: 'The code and the link work for one hour.',
    tagline: 'Keypacer, the free touch-typing trainer',
    privacy: 'Privacy policy',
  },
  de: {
    confirmation: {
      subject: 'Bestätige dein Keypacer-Konto: {{ .Token }}',
      heading: 'Willkommen bei Keypacer',
      intro: 'Gib diesen Code in Keypacer ein, um deine E-Mail-Adresse zu bestätigen und dein Konto fertig anzulegen:',
      button: 'Adresse bestätigen',
      ignore: 'Wenn du kein Konto angelegt hast, ignoriere diese E-Mail einfach. Ohne den Code wird kein Konto eröffnet.',
    },
    magic_link: {
      subject: 'Dein Keypacer-Anmeldecode: {{ .Token }}',
      heading: 'Bei Keypacer anmelden',
      intro: 'Gib diesen Code in Keypacer ein, um dich anzumelden:',
      button: 'Anmelden',
      ignore: 'Wenn du dich nicht anmelden wolltest, ignoriere diese E-Mail einfach. Ohne den Code kann sich niemand anmelden.',
    },
    recovery: {
      subject: 'Dein Keypacer-Passwort zurücksetzen: {{ .Token }}',
      heading: 'Neues Passwort wählen',
      intro: 'Gib diesen Code in Keypacer ein, um ein neues Passwort für dein Konto zu wählen:',
      button: 'Neues Passwort wählen',
      ignore: 'Wenn du das nicht angefordert hast, ignoriere diese E-Mail einfach. Dein Passwort bleibt, wie es ist.',
    },
    or: 'Oder öffne diesen Link auf dem Gerät, auf dem du den Code angefordert hast:',
    expires: 'Code und Link gelten eine Stunde lang.',
    tagline: 'Keypacer, der kostenlose Trainer fürs Zehnfingersystem',
    privacy: 'Datenschutzerklärung',
  },
  fr: {
    confirmation: {
      subject: 'Confirme ton compte Keypacer : {{ .Token }}',
      heading: 'Bienvenue sur Keypacer',
      intro: 'Saisis ce code dans Keypacer pour confirmer ton adresse e-mail et terminer la création de ton compte :',
      button: 'Confirmer mon adresse',
      ignore: 'Si tu n’as pas créé de compte, ignore simplement cet e-mail. Sans le code, aucun compte n’est ouvert.',
    },
    magic_link: {
      subject: 'Ton code de connexion Keypacer : {{ .Token }}',
      heading: 'Se connecter à Keypacer',
      intro: 'Saisis ce code dans Keypacer pour te connecter :',
      button: 'Se connecter',
      ignore: 'Si tu n’as pas demandé à te connecter, ignore simplement cet e-mail. Personne ne peut se connecter sans le code.',
    },
    recovery: {
      subject: 'Réinitialise ton mot de passe Keypacer : {{ .Token }}',
      heading: 'Choisir un nouveau mot de passe',
      intro: 'Saisis ce code dans Keypacer pour choisir un nouveau mot de passe pour ton compte :',
      button: 'Choisir un nouveau mot de passe',
      ignore: 'Si tu n’as rien demandé, ignore simplement cet e-mail. Ton mot de passe reste inchangé.',
    },
    or: 'Ou ouvre ce lien sur l’appareil où tu as demandé le code :',
    expires: 'Le code et le lien sont valables une heure.',
    tagline: 'Keypacer, l’entraîneur de dactylographie gratuit',
    privacy: 'Politique de confidentialité',
  },
  es: {
    confirmation: {
      subject: 'Confirma tu cuenta de Keypacer: {{ .Token }}',
      heading: 'Te damos la bienvenida a Keypacer',
      intro: 'Escribe este código en Keypacer para confirmar tu dirección de correo y terminar de crear tu cuenta:',
      button: 'Confirmar mi dirección',
      ignore: 'Si no has creado ninguna cuenta, ignora este correo. Sin el código no se abre ninguna cuenta.',
    },
    magic_link: {
      subject: 'Tu código de acceso a Keypacer: {{ .Token }}',
      heading: 'Iniciar sesión en Keypacer',
      intro: 'Escribe este código en Keypacer para iniciar sesión:',
      button: 'Iniciar sesión',
      ignore: 'Si no has pedido iniciar sesión, ignora este correo. Nadie puede entrar sin el código.',
    },
    recovery: {
      subject: 'Restablece tu contraseña de Keypacer: {{ .Token }}',
      heading: 'Elige una contraseña nueva',
      intro: 'Escribe este código en Keypacer para elegir una contraseña nueva para tu cuenta:',
      button: 'Elegir una contraseña nueva',
      ignore: 'Si no lo has pedido tú, ignora este correo. Tu contraseña no cambia.',
    },
    or: 'O abre este enlace en el dispositivo donde pediste el código:',
    expires: 'El código y el enlace valen durante una hora.',
    tagline: 'Keypacer, el entrenador de mecanografía gratuito',
    privacy: 'Política de privacidad',
  },
  it: {
    confirmation: {
      subject: 'Conferma il tuo account Keypacer: {{ .Token }}',
      heading: 'Ti diamo il benvenuto su Keypacer',
      intro: 'Inserisci questo codice in Keypacer per confermare il tuo indirizzo e-mail e completare la creazione dell’account:',
      button: 'Conferma il mio indirizzo',
      ignore: 'Se non hai creato un account, ignora pure questa e-mail. Senza il codice non viene aperto nessun account.',
    },
    magic_link: {
      subject: 'Il tuo codice di accesso a Keypacer: {{ .Token }}',
      heading: 'Accedi a Keypacer',
      intro: 'Inserisci questo codice in Keypacer per accedere:',
      button: 'Accedi',
      ignore: 'Se non hai chiesto di accedere, ignora pure questa e-mail. Senza il codice nessuno può entrare.',
    },
    recovery: {
      subject: 'Reimposta la tua password di Keypacer: {{ .Token }}',
      heading: 'Scegli una nuova password',
      intro: 'Inserisci questo codice in Keypacer per scegliere una nuova password per il tuo account:',
      button: 'Scegli una nuova password',
      ignore: 'Se non l’hai chiesto tu, ignora pure questa e-mail. La tua password resta invariata.',
    },
    or: 'Oppure apri questo link sul dispositivo da cui hai chiesto il codice:',
    expires: 'Il codice e il link valgono per un’ora.',
    tagline: 'Keypacer, l’allenatore di dattilografia gratuito',
    privacy: 'Informativa sulla privacy',
  },
  pl: {
    confirmation: {
      subject: 'Potwierdź swoje konto Keypacer: {{ .Token }}',
      heading: 'Witaj w Keypacer',
      intro: 'Wpisz ten kod w Keypacer, aby potwierdzić adres e-mail i dokończyć zakładanie konta:',
      button: 'Potwierdź adres',
      ignore: 'Jeśli to nie Ty zakładasz konto, po prostu zignoruj tę wiadomość. Bez kodu żadne konto nie zostanie utworzone.',
    },
    magic_link: {
      subject: 'Twój kod logowania do Keypacer: {{ .Token }}',
      heading: 'Zaloguj się do Keypacer',
      intro: 'Wpisz ten kod w Keypacer, aby się zalogować:',
      button: 'Zaloguj się',
      ignore: 'Jeśli ta prośba o logowanie nie pochodzi od Ciebie, po prostu zignoruj tę wiadomość. Bez kodu nikt się nie zaloguje.',
    },
    recovery: {
      subject: 'Zresetuj hasło do Keypacer: {{ .Token }}',
      heading: 'Ustaw nowe hasło',
      intro: 'Wpisz ten kod w Keypacer, aby ustawić nowe hasło do swojego konta:',
      button: 'Ustaw nowe hasło',
      ignore: 'Jeśli ta prośba nie pochodzi od Ciebie, po prostu zignoruj tę wiadomość. Twoje hasło się nie zmieni.',
    },
    or: 'Albo otwórz ten link na urządzeniu, na którym poproszono o kod:',
    expires: 'Kod i link są ważne przez godzinę.',
    tagline: 'Keypacer, darmowy trener pisania bezwzrokowego',
    privacy: 'Polityka prywatności',
  },
};

// Brand colours from src/style.css (the stair logo's ember, magenta and cobalt), as hex for mail apps.
const C = { ember: '#dd5400', magenta: '#a22697', cobalt: '#214dba', ink: '#262b3d', muted: '#5f6476', bg: '#f5f6fa', panel: '#ffffff', border: '#e3e5ec', code: '#eef1fb' };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A Go template choosing `pick(lang)` by the account's language; English when it has none or another. */
function byLanguage(pick) {
  const [first, ...rest] = LANGUAGES.filter((l) => l !== 'en');
  let out = `{{ if eq $l "${first}" }}${pick(first)}`;
  for (const l of rest) out += `{{ else if eq $l "${l}" }}${pick(l)}`;
  return `${out}{{ else }}${pick('en')}{{ end }}`;
}

/** Sets `$l` to the account's language; `or` turns a missing one into English. */
const LANGUAGE = '{{ $l := or .Data.locale "en" }}';

/** The subject line for one template, as a Go template. */
export function subject(kind) {
  // Subjects keep `{{ .Token }}` as is; the rest of the text is plain.
  return LANGUAGE + byLanguage((l) => TEXT[l][kind].subject);
}

/** The HTML body for one template, as a Go template. */
export function html(kind) {
  const k = (key) => byLanguage((l) => esc(TEXT[l][kind][key]));
  const common = (key) => byLanguage((l) => esc(TEXT[l][key]));
  const step = (color, height) => `<td valign="bottom" style="padding:0 2px 0 0"><div style="width:7px;height:${height}px;background:${color};border-radius:2px"></div></td>`;
  return `${LANGUAGE}<!doctype html>
<html lang="{{ $l }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${k('heading')}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};color:${C.ink};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px">
<tr><td style="padding:0 4px 16px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
${step(C.ember, 8)}${step(C.magenta, 14)}${step(C.cobalt, 20)}
<td valign="bottom" style="padding-left:8px;font-size:18px;font-weight:700;letter-spacing:-0.01em;color:${C.ink}">Keypacer</td>
</tr></table>
</td></tr>
<tr><td style="background:${C.panel};border:1px solid ${C.border};border-radius:14px;padding:28px 28px 24px">
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${C.ink}">${k('heading')}</h1>
<p style="margin:0 0 18px;font-size:16px;line-height:1.5">${k('intro')}</p>
<p style="margin:0 0 18px;padding:14px 0;background:${C.code};border-radius:10px;text-align:center;font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:30px;font-weight:700;letter-spacing:0.18em;color:${C.ink}">{{ .Token }}</p>
<p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:${C.muted}">${common('or')}</p>
<p style="margin:0 0 20px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:11px 20px;background:${C.cobalt};color:#ffffff;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none">${k('button')}</a></p>
<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:${C.muted}">${common('expires')}</p>
<p style="margin:0;font-size:14px;line-height:1.5;color:${C.muted}">${k('ignore')}</p>
</td></tr>
<tr><td style="padding:16px 4px 0;font-size:12px;line-height:1.5;color:${C.muted}">
${common('tagline')} · <a href="{{ .SiteURL }}/datenschutz" style="color:${C.muted}">${common('privacy')}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}

/** Every language's text, for tests and previews: which keys each language has. */
export const TEXTS = TEXT;

/** supabase/config.toml with its block of templates (between the BEGIN and END lines) brought up to date. */
export function withConfigBlock(config) {
  // TOML literal strings: the subjects contain double quotes but no single ones.
  const block = KINDS.map((kind) => `[auth.email.template.${kind}]\nsubject = '${subject(kind)}'\ncontent_path = "./supabase/templates/${kind}.html"\n`).join('\n');
  return config.replace(/(# BEGIN email templates\n)[\s\S]*?(# END email templates)/, `$1${block}$2`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const kind of KINDS) {
    const file = new URL(`../supabase/templates/${kind}.html`, import.meta.url);
    writeFileSync(file, html(kind));
    console.log(`wrote supabase/templates/${kind}.html`);
  }
  const config = new URL('../supabase/config.toml', import.meta.url);
  writeFileSync(config, withConfigBlock(readFileSync(config, 'utf8')));
  console.log('updated supabase/config.toml');
}
