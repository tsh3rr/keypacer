import { LEGAL_UPDATED, OWNER } from './owner';

/**
 * The Impressum, the privacy policy and the terms of use, in every interface language.
 *
 * Written for a private, non-commercial site run from Austria: no ads, no
 * payment, no tracking beyond anonymous page counts. Practice data stays in the browser unless the
 * learner signs in to the optional account, which syncs it through Supabase
 * (EU, Frankfurt). Cloudflare delivers the files and, once its site key is
 * set, Turnstile guards e-mail sign-in (the paragraph appears with it).
 * Where the account sends e-mail through Resend (EMAIL_LINKS), the policy
 * says so. Once an Umami website ID is set (UMAMI), the landing pages and the
 * trainer's page count visits and the policy gets its analytics section and opt-out button
 * (wired in page.ts). If any of that changes (analytics, ads, a donation button,
 * another processor), these texts have to change first.
 *
 * German is the binding version; every other language is a translation and
 * says so at the top. A change to the German text has to reach all of them.
 */

export type LegalPage = 'imprint' | 'privacy' | 'terms';
export type LegalLanguage = 'de' | 'en' | 'fr' | 'es' | 'it' | 'pl';

/** The languages in the switch on the legal pages, each named in its own language. */
export const LEGAL_LANGUAGES: readonly { id: LegalLanguage; name: string }[] = [
  { id: 'de', name: 'Deutsch' },
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
  { id: 'it', name: 'Italiano' },
  { id: 'pl', name: 'Polski' },
];

export function isLegalLanguage(id: string | null | undefined): id is LegalLanguage {
  return LEGAL_LANGUAGES.some((l) => l.id === id);
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const name = esc(OWNER.name);
const town = esc(OWNER.town);
const mail = `<a href="mailto:${esc(OWNER.email)}">${esc(OWNER.email)}</a>`;

/**
 * Account e-mails go out through Resend, on the same switch as sign-in by
 * e-mail code in the app: each build's Supabase project either sends through
 * Resend (and the app offers codes) or does neither (vite.config.ts).
 */
const RESEND = __EMAIL_LINKS__;

/** What changes in the privacy policy once account e-mails go through Resend. */
const accountMail = {
  de: {
    methods: RESEND ? 'mit deinem Google-Konto, mit E-Mail-Adresse und Passwort oder mit einem Code, den wir dir per E-Mail schicken' : 'mit deinem Google-Konto oder mit E-Mail-Adresse und Passwort',
    supabase: RESEND ? '. Die E-Mails rund um dein Konto verschickt Supabase über Resend (siehe unten).' : ' und verschickt auch E-Mails rund um dein Konto, etwa zum Zurücksetzen des Passworts.',
    section: RESEND ? `
    <p><strong>E-Mail-Versand:</strong> Anmeldecodes, die Bestätigung deiner E-Mail-Adresse und Codes zum Zurücksetzen des Passworts schicken wir dir über den Versanddienst Resend (Resend, Inc., USA). Resend erhält dafür deine E-Mail-Adresse und den Inhalt der Nachricht (Code und Anmeldelink) und speichert Versandprotokolle (Zeitpunkt, Empfänger, Zustellstatus), um die Zustellung sicherzustellen; diese bewahrt Resend nur begrenzte Zeit auf. Öffnungs- und Klickverfolgung haben wir ausgeschaltet. Die E-Mails werden über Server in der EU (Irland) verschickt. Resend verarbeitet die Daten als unser Auftragsverarbeiter auf Grundlage seines Auftragsverarbeitungsvertrags; soweit dabei ein Zugriff aus den USA möglich ist, ist er durch die EU-Standardvertragsklauseln abgesichert (Art. 46 Abs. 2 lit. c DSGVO). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Mehr dazu in der <a href="https://resend.com/legal/privacy-policy">Datenschutzerklärung von Resend</a>.</p>` : '',
  },
  en: {
    methods: RESEND ? 'with your Google account, with an e-mail address and password, or with a code we send you by e-mail' : 'with your Google account or with an e-mail address and password',
    supabase: RESEND ? '. Supabase sends the e-mails about your account through Resend (see below).' : ' and also sends e-mails about your account, such as for resetting your password.',
    section: RESEND ? `
    <p><strong>Sending e-mail:</strong> we send you sign-in codes, the confirmation of your e-mail address and codes for resetting your password through the mail service Resend (Resend, Inc., USA). For this, Resend receives your e-mail address and the content of the message (code and sign-in link) and keeps delivery logs (time, recipient, delivery status) to make sure mail arrives; it keeps them only for a limited time. We have turned off open and click tracking. The e-mails are sent from servers in the EU (Ireland). Resend processes the data as our processor under its data processing agreement; where access from the USA is possible, it is covered by the EU Standard Contractual Clauses (Art. 46(2)(c) GDPR). The legal basis is Art. 6(1)(b) GDPR. See <a href="https://resend.com/legal/privacy-policy">Resend's privacy policy</a> for more.</p>` : '',
  },
  fr: {
    methods: RESEND ? 'avec ton compte Google, avec une adresse e-mail et un mot de passe, ou avec un code que nous t’envoyons par e-mail' : 'avec ton compte Google ou avec une adresse e-mail et un mot de passe',
    supabase: RESEND ? '. Supabase envoie les e-mails liés à ton compte via Resend (voir ci-dessous).' : ' et envoie aussi les e-mails liés à ton compte, par exemple pour réinitialiser ton mot de passe.',
    section: RESEND ? `
    <p><strong>Envoi d’e-mails :</strong> nous t’envoyons les codes de connexion, la confirmation de ton adresse e-mail et les codes de réinitialisation du mot de passe via le service d’envoi Resend (Resend, Inc., États-Unis). Pour cela, Resend reçoit ton adresse e-mail et le contenu du message (code et lien de connexion) et conserve des journaux d’envoi (heure, destinataire, statut de remise) pour s’assurer que le courrier arrive ; il ne les garde que pendant une durée limitée. Nous avons désactivé le suivi des ouvertures et des clics. Les e-mails partent de serveurs situés dans l’UE (Irlande). Resend traite les données en tant que notre sous-traitant sur la base de son accord de traitement des données ; dans la mesure où un accès depuis les États-Unis est possible, il est encadré par les clauses contractuelles types de l’UE (art. 46, par. 2, point c, du RGPD). La base juridique est l’art. 6, par. 1, point b, du RGPD. Plus d’informations dans la <a href="https://resend.com/legal/privacy-policy">politique de confidentialité de Resend</a>.</p>` : '',
  },
  es: {
    methods: RESEND ? 'con tu cuenta de Google, con una dirección de correo electrónico y una contraseña, o con un código que te enviamos por correo electrónico' : 'con tu cuenta de Google o con una dirección de correo electrónico y una contraseña',
    supabase: RESEND ? '. Supabase envía los correos relacionados con tu cuenta a través de Resend (ver más abajo).' : ' y también envía los correos relacionados con tu cuenta, por ejemplo para restablecer la contraseña.',
    section: RESEND ? `
    <p><strong>Envío de correos:</strong> te enviamos los códigos de inicio de sesión, la confirmación de tu dirección de correo y los códigos para restablecer la contraseña a través del servicio de envío Resend (Resend, Inc., EE. UU.). Para ello, Resend recibe tu dirección de correo y el contenido del mensaje (código y enlace de inicio de sesión) y guarda registros de envío (hora, destinatario, estado de entrega) para asegurarse de que el correo llega; solo los conserva durante un tiempo limitado. Hemos desactivado el seguimiento de aperturas y clics. Los correos se envían desde servidores en la UE (Irlanda). Resend trata los datos como nuestro encargado del tratamiento conforme a su acuerdo de tratamiento de datos; en la medida en que sea posible un acceso desde EE. UU., está cubierto por las cláusulas contractuales tipo de la UE (art. 46.2.c) del RGPD). La base jurídica es el art. 6.1.b) del RGPD. Más información en la <a href="https://resend.com/legal/privacy-policy">política de privacidad de Resend</a>.</p>` : '',
  },
  it: {
    methods: RESEND ? 'con il tuo account Google, con indirizzo e-mail e password oppure con un codice che ti inviamo via e-mail' : 'con il tuo account Google oppure con indirizzo e-mail e password',
    supabase: RESEND ? '. Supabase invia le e-mail relative al tuo account tramite Resend (vedi sotto).' : ' e invia anche le e-mail relative al tuo account, ad esempio per reimpostare la password.',
    section: RESEND ? `
    <p><strong>Invio di e-mail:</strong> i codici di accesso, la conferma del tuo indirizzo e-mail e i codici per reimpostare la password te li inviamo tramite il servizio di spedizione Resend (Resend, Inc., USA). Per questo Resend riceve il tuo indirizzo e-mail e il contenuto del messaggio (codice e link di accesso) e conserva registri di invio (ora, destinatario, stato di consegna) per assicurarsi che la posta arrivi; li conserva solo per un periodo limitato. Abbiamo disattivato il tracciamento di aperture e clic. Le e-mail vengono inviate da server nell’UE (Irlanda). Resend tratta i dati come nostro responsabile del trattamento sulla base del suo accordo sul trattamento dei dati; nella misura in cui è possibile un accesso dagli USA, questo è coperto dalle clausole contrattuali tipo dell’UE (art. 46, par. 2, lett. c) GDPR). La base giuridica è l’art. 6, par. 1, lett. b) GDPR. Maggiori informazioni nell’<a href="https://resend.com/legal/privacy-policy">informativa sulla privacy di Resend</a>.</p>` : '',
  },
  pl: {
    methods: RESEND ? 'przez konto Google, adresem e-mail i hasłem albo kodem, który wyślemy Ci e-mailem' : 'przez konto Google albo adresem e-mail i hasłem',
    supabase: RESEND ? '. E-maile dotyczące Twojego konta Supabase wysyła przez Resend (zob. niżej).' : ' i wysyła też e-maile dotyczące Twojego konta, np. do resetowania hasła.',
    section: RESEND ? `
    <p><strong>Wysyłka e-maili:</strong> kody logowania, potwierdzenie adresu e-mail i kody do resetowania hasła wysyłamy Ci przez usługę wysyłkową Resend (Resend, Inc., USA). Resend otrzymuje w tym celu Twój adres e-mail i treść wiadomości (kod i link do logowania) oraz przechowuje dzienniki wysyłki (czas, odbiorca, status doręczenia), aby zapewnić doręczenie; przechowuje je tylko przez ograniczony czas. Śledzenie otwarć i kliknięć wyłączyliśmy. E-maile są wysyłane z serwerów w UE (Irlandia). Resend przetwarza dane jako nasz podmiot przetwarzający na podstawie swojej umowy powierzenia przetwarzania danych; o ile możliwy jest przy tym dostęp z USA, jest on zabezpieczony standardowymi klauzulami umownymi UE (art. 46 ust. 2 lit. c RODO). Podstawą prawną jest art. 6 ust. 1 lit. b RODO. Więcej w <a href="https://resend.com/legal/privacy-policy">polityce prywatności Resend</a>.</p>` : '',
  },
};

/** Whether e-mail sign-in is behind Cloudflare Turnstile (see src/sync/captcha.ts). */
const CAPTCHA = __TURNSTILE_SITE_KEY__ !== '';

const captcha = {
  short: {
    de: CAPTCHA ? ' Einzige Ausnahme: Beim Anmelden und Registrieren mit E-Mail prüft Cloudflare Turnstile, dass ein Mensch das Formular abschickt (siehe <em>Schutz vor automatisierten Anmeldungen</em>).' : '',
    en: CAPTCHA ? ' The one exception: when you sign in or sign up with e-mail, Cloudflare Turnstile checks that a person is sending the form (see <em>Protection against automated sign-ups</em>).' : '',
    fr: CAPTCHA ? ' Seule exception : quand tu te connectes ou t’inscris par e-mail, Cloudflare Turnstile vérifie que c’est bien une personne qui envoie le formulaire (voir <em>Protection contre les inscriptions automatisées</em>).' : '',
    es: CAPTCHA ? ' La única excepción: cuando inicias sesión o te registras con correo electrónico, Cloudflare Turnstile comprueba que es una persona quien envía el formulario (ver <em>Protección contra registros automatizados</em>).' : '',
    it: CAPTCHA ? ' Unica eccezione: quando accedi o ti registri con l’e-mail, Cloudflare Turnstile verifica che sia una persona a inviare il modulo (vedi <em>Protezione dalle registrazioni automatiche</em>).' : '',
    pl: CAPTCHA ? ' Jedyny wyjątek: przy logowaniu i rejestracji przez e-mail Cloudflare Turnstile sprawdza, czy formularz wysyła człowiek (zob. <em>Ochrona przed automatyczną rejestracją</em>).' : '',
  },
  section: {
    de: CAPTCHA ? `
    <p><strong>Schutz vor automatisierten Anmeldungen:</strong> Schickst du das Formular zum Anmelden, Registrieren, für einen Anmeldecode oder ein neues Passwort ab, prüft Cloudflare Turnstile (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA), ob ein Mensch es abschickt. Erst in diesem Moment lädt dein Browser ein Skript von Cloudflare. Es wertet technische Merkmale deines Browsers und Geräts sowie deine IP-Adresse aus; meist merkst du davon nichts, manchmal erscheint ein Kästchen zum Anklicken. Das Ergebnis, ein nur einmal gültiger Code, geht an Supabase, das ihn bei Cloudflare prüft. Laut Cloudflare werden diese Daten nicht für Werbung oder zum Wiedererkennen über Websites hinweg verwendet. Rechtsgrundlage ist unser berechtigtes Interesse, Konten und Datenbank vor Missbrauch durch automatisch angelegte Konten zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO). Mehr dazu in der <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Datenschutzerklärung zu Turnstile</a>. Mit Google angemeldet läuft diese Prüfung nicht.</p>` : '',
    en: CAPTCHA ? `
    <p><strong>Protection against automated sign-ups:</strong> when you send the form to sign in, sign up, get a sign-in code or a new password, Cloudflare Turnstile (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA) checks whether a person is sending it. Only at that moment does your browser load a script from Cloudflare. It looks at technical features of your browser and device and at your IP address; usually you notice nothing, sometimes a box to tick appears. The result, a code that is valid only once, goes to Supabase, which checks it with Cloudflare. According to Cloudflare, this data is not used for advertising or to recognise you across websites. The legal basis is our legitimate interest in protecting accounts and the database from abuse by automatically created accounts (Art. 6(1)(f) GDPR). Cloudflare is certified under the EU-US Data Privacy Framework (Art. 45 GDPR). See the <a href="https://www.cloudflare.com/turnstile-privacy-policy/">Turnstile privacy policy</a> for more. Signing in with Google does not use this check.</p>` : '',
    fr: CAPTCHA ? `
    <p><strong>Protection contre les inscriptions automatisées :</strong> quand tu envoies le formulaire pour te connecter, t’inscrire, recevoir un code de connexion ou un nouveau mot de passe, Cloudflare Turnstile (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, États-Unis) vérifie que c’est une personne qui l’envoie. C’est seulement à ce moment-là que ton navigateur charge un script de Cloudflare. Celui-ci analyse des caractéristiques techniques de ton navigateur et de ton appareil ainsi que ton adresse IP ; la plupart du temps tu ne remarques rien, parfois une case à cocher apparaît. Le résultat, un code valable une seule fois, est transmis à Supabase, qui le vérifie auprès de Cloudflare. Selon Cloudflare, ces données ne sont pas utilisées à des fins publicitaires ni pour te reconnaître d’un site à l’autre. La base juridique est notre intérêt légitime à protéger les comptes et la base de données contre les abus par des comptes créés automatiquement (art. 6, par. 1, point f, du RGPD). Cloudflare est certifié au titre du cadre de protection des données UE–États-Unis (art. 45 du RGPD). Plus d’informations dans la <a href="https://www.cloudflare.com/turnstile-privacy-policy/">politique de confidentialité de Turnstile</a>. La connexion avec Google n’utilise pas cette vérification.</p>` : '',
    es: CAPTCHA ? `
    <p><strong>Protección contra registros automatizados:</strong> cuando envías el formulario para iniciar sesión, registrarte, recibir un código de inicio de sesión o una nueva contraseña, Cloudflare Turnstile (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, EE. UU.) comprueba si lo envía una persona. Solo en ese momento tu navegador carga un script de Cloudflare. Este analiza características técnicas de tu navegador y dispositivo, así como tu dirección IP; normalmente no notas nada, a veces aparece una casilla para marcar. El resultado, un código válido una sola vez, se envía a Supabase, que lo comprueba con Cloudflare. Según Cloudflare, estos datos no se utilizan para publicidad ni para reconocerte entre sitios web. La base jurídica es nuestro interés legítimo en proteger las cuentas y la base de datos frente al abuso mediante cuentas creadas automáticamente (art. 6.1.f) del RGPD). Cloudflare está certificado conforme al Marco de Privacidad de Datos UE-EE. UU. (art. 45 del RGPD). Más información en la <a href="https://www.cloudflare.com/turnstile-privacy-policy/">política de privacidad de Turnstile</a>. Al iniciar sesión con Google no se realiza esta comprobación.</p>` : '',
    it: CAPTCHA ? `
    <p><strong>Protezione dalle registrazioni automatiche:</strong> quando invii il modulo per accedere, registrarti, ricevere un codice di accesso o una nuova password, Cloudflare Turnstile (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA) verifica che a inviarlo sia una persona. Solo in quel momento il tuo browser carica uno script di Cloudflare, che analizza caratteristiche tecniche del tuo browser e del tuo dispositivo e il tuo indirizzo IP; di solito non noti nulla, a volte compare una casella da spuntare. Il risultato, un codice valido una sola volta, va a Supabase, che lo verifica presso Cloudflare. Secondo Cloudflare, questi dati non vengono usati per pubblicità né per riconoscerti tra siti diversi. La base giuridica è il nostro legittimo interesse a proteggere gli account e il database dagli abusi tramite account creati automaticamente (art. 6, par. 1, lett. f) GDPR). Cloudflare è certificata nell’ambito del Data Privacy Framework UE-USA (art. 45 GDPR). Maggiori informazioni nell’<a href="https://www.cloudflare.com/turnstile-privacy-policy/">informativa sulla privacy di Turnstile</a>. L’accesso con Google non usa questa verifica.</p>` : '',
    pl: CAPTCHA ? `
    <p><strong>Ochrona przed automatyczną rejestracją:</strong> gdy wysyłasz formularz logowania, rejestracji, prośby o kod logowania lub nowe hasło, Cloudflare Turnstile (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA) sprawdza, czy wysyła go człowiek. Dopiero wtedy Twoja przeglądarka wczytuje skrypt Cloudflare. Analizuje on cechy techniczne Twojej przeglądarki i urządzenia oraz Twój adres IP; zwykle nic nie zauważasz, czasem pojawia się pole do zaznaczenia. Wynik, kod ważny tylko raz, trafia do Supabase, które sprawdza go w Cloudflare. Według Cloudflare dane te nie są wykorzystywane do reklam ani do rozpoznawania Cię na różnych stronach. Podstawą prawną jest nasz prawnie uzasadniony interes w ochronie kont i bazy danych przed nadużyciami przez automatycznie zakładane konta (art. 6 ust. 1 lit. f RODO). Cloudflare ma certyfikat w ramach EU-US Data Privacy Framework (art. 45 RODO). Więcej w <a href="https://www.cloudflare.com/turnstile-privacy-policy/">polityce prywatności Turnstile</a>. Przy logowaniu przez Google ta kontrola nie jest wykonywana.</p>` : '',
  },
};

/** Whether the landing pages and the trainer count visits with Umami Cloud (vite.config.ts). */
const ANALYTICS = __UMAMI_WEBSITE_ID__ !== '';

/** What changes in the privacy policy once the site counts visits. */
const analytics = {
  short: {
    de: ANALYTICS
      ? 'Es gibt keine Werbung und keine eingebundenen Inhalte von Dritten, auch keine externen Schriftarten. Wir zählen nur anonym mit Umami, ohne Cookies, wie oft die Startseite, der Blog und der Trainer aufgerufen werden (siehe <em>Reichweitenmessung</em>); was du im Trainer tust und tippst, wird dabei nicht erfasst.'
      : 'Es gibt keine Werbung, keine Analyse- oder Tracking-Dienste und keine eingebundenen Inhalte von Dritten, auch keine externen Schriftarten.',
    en: ANALYTICS
      ? 'There are no ads and no embedded third-party content, not even external fonts. We only count anonymously with Umami, without cookies, how often the start page, the blog and the trainer are opened (see <em>Visitor statistics</em>); what you do and type in the trainer is not recorded.'
      : 'There are no ads, no analytics or tracking services and no embedded third-party content, not even external fonts.',
    fr: ANALYTICS
      ? 'Il n’y a ni publicité ni contenu intégré de tiers, pas même des polices externes. Nous comptons seulement de façon anonyme avec Umami, sans cookies, combien de fois la page d’accueil, le blog et l’entraîneur sont ouverts (voir <em>Mesure d’audience</em>) ; ce que tu fais et tapes dans l’entraîneur n’est pas enregistré.'
      : 'Il n’y a ni publicité, ni service d’analyse ou de suivi, ni contenu intégré de tiers, pas même des polices externes.',
    es: ANALYTICS
      ? 'No hay publicidad ni contenido integrado de terceros, ni siquiera fuentes externas. Solo contamos de forma anónima con Umami, sin cookies, cuántas veces se abren la página de inicio, el blog y el entrenador (ver <em>Estadísticas de visitas</em>); lo que haces y escribes en el entrenador no se registra.'
      : 'No hay publicidad, ni servicios de análisis o seguimiento, ni contenido integrado de terceros, ni siquiera fuentes externas.',
    it: ANALYTICS
      ? 'Non ci sono pubblicità né contenuti incorporati di terzi, nemmeno font esterni. Contiamo solo in modo anonimo con Umami, senza cookie, quante volte vengono aperti la pagina iniziale, il blog e l’allenatore (vedi <em>Statistiche delle visite</em>); ciò che fai e digiti nell’allenatore non viene registrato.'
      : 'Non ci sono pubblicità, servizi di analisi o tracciamento né contenuti incorporati di terzi, nemmeno font esterni.',
    pl: ANALYTICS
      ? 'Nie ma reklam ani osadzonych treści stron trzecich, nawet zewnętrznych czcionek. Liczymy tylko anonimowo, za pomocą Umami i bez plików cookie, jak często otwierana jest strona startowa, blog i trener (zob. <em>Statystyki odwiedzin</em>); to, co robisz i piszesz w trenerze, nie jest rejestrowane.'
      : 'Nie ma reklam, usług analitycznych ani śledzących, ani osadzonych treści stron trzecich, nawet zewnętrznych czcionek.',
  },
  stored: {
    de: ANALYTICS ? '\n      <li><strong>Reichweitenmessung ausgeschaltet:</strong> nur wenn du sie unten unter <em>Reichweitenmessung</em> ausschaltest, ein Vermerk darüber (<code>umami.disabled</code>).</li>' : '',
    en: ANALYTICS ? '\n      <li><strong>Visitor statistics turned off:</strong> only if you turn them off below under <em>Visitor statistics</em>, a note saying so (<code>umami.disabled</code>).</li>' : '',
    fr: ANALYTICS ? '\n      <li><strong>Mesure d’audience désactivée :</strong> uniquement si tu la désactives plus bas sous <em>Mesure d’audience</em>, une note l’indiquant (<code>umami.disabled</code>).</li>' : '',
    es: ANALYTICS ? '\n      <li><strong>Estadísticas de visitas desactivadas:</strong> solo si las desactivas más abajo en <em>Estadísticas de visitas</em>, una nota que lo indica (<code>umami.disabled</code>).</li>' : '',
    it: ANALYTICS ? '\n      <li><strong>Statistiche delle visite disattivate:</strong> solo se le disattivi più sotto in <em>Statistiche delle visite</em>, una nota che lo indica (<code>umami.disabled</code>).</li>' : '',
    pl: ANALYTICS ? '\n      <li><strong>Wyłączone statystyki odwiedzin:</strong> tylko jeśli wyłączysz je niżej w sekcji <em>Statystyki odwiedzin</em>, adnotacja o tym (<code>umami.disabled</code>).</li>' : '',
  },
  section: {
    de: ANALYTICS ? `

    <h2>Reichweitenmessung</h2>
    <p>Um zu sehen, wie viele Menschen die Startseite besuchen, woher sie kommen und ob sie den Trainer öffnen, zählen wir Aufrufe der Startseite, des Blogs und des Trainers mit Umami Cloud (Umami Software, Inc., USA). Im Trainer wird nur gezählt, dass die Seite geöffnet wurde; deine Übungen, dein Tastenprotokoll und dein Konto bleiben davon unberührt. Auf diesen Rechtsseiten läuft Umami nicht. Beim Aufruf lädt dein Browser ein Skript von Umami und schickt diese Angaben: die aufgerufene Seite ohne Zusätze in der Adresse, die Seite, von der du kommst, Browser, Betriebssystem, Gerätetyp, Bildschirmgröße und Sprache sowie, falls du auf der Startseite auf einen der Knöpfe zum Trainer klickst, welchen davon. Aus deiner IP-Adresse ermittelt Umami das Land und die Region; die IP-Adresse selbst wird nicht gespeichert. Damit ein Besuch nur einmal zählt, bildet Umami aus IP-Adresse, Browserangaben und einem Geheimwert, der jeden Monat wechselt, eine Kennung, aus der sich weder deine IP-Adresse ablesen lässt noch du über Monate oder andere Websites hinweg wiedererkannt wirst. Umami setzt keine Cookies und legt nichts auf deinem Gerät ab. Wir sehen nur zusammengefasste Zahlen.</p>
    <p>Rechtsgrundlage ist unser berechtigtes Interesse, die Website anhand anonymer Besucherzahlen zu verbessern (Art. 6 Abs. 1 lit. f DSGVO). Umami verarbeitet die Daten als unser Auftragsverarbeiter auf Grundlage seines Auftragsverarbeitungsvertrags; soweit dabei eine Verarbeitung in den USA möglich ist, ist sie durch die EU-Standardvertragsklauseln abgesichert (Art. 46 Abs. 2 lit. c DSGVO). Die Statistik wird nach höchstens 12 Monaten gelöscht. Mehr dazu in der <a href="https://umami.is/privacy">Datenschutzerklärung von Umami</a>.</p>
    <p>Du kannst widersprechen: Hast du in deinem Browser „Do Not Track“ eingeschaltet, zählt Umami dich nicht. Außerdem kannst du die Messung hier für diesen Browser ausschalten; dafür speichern wir einen Vermerk im lokalen Speicher deines Browsers.</p>
    <p class="legal-optout"><button type="button" data-analytics-optout></button> <span data-analytics-state></span></p>` : '',
    en: ANALYTICS ? `

    <h2>Visitor statistics</h2>
    <p>To see how many people visit the start page, where they come from and whether they open the trainer, we count visits to the start page, the blog and the trainer with Umami Cloud (Umami Software, Inc., USA). In the trainer, only the fact that the page was opened is counted; your drills, your keystroke log and your account are not touched by it. Umami does not run on these legal pages. When a page is opened, your browser loads a script from Umami and sends this: the page you opened without anything added to its address, the page you came from, your browser, operating system, device type, screen size and language, and, if you click one of the buttons on the start page that lead to the trainer, which one. Umami derives your country and region from your IP address; the IP address itself is not stored. So that a visit counts only once, Umami makes an identifier from your IP address, browser details and a secret value that changes every month; it does not reveal your IP address and cannot recognise you across months or on other websites. Umami sets no cookies and stores nothing on your device. We only see totals.</p>
    <p>The legal basis is our legitimate interest in improving the website from anonymous visitor numbers (Art. 6(1)(f) GDPR). Umami processes the data as our processor under its data processing agreement; where processing in the USA is possible, it is covered by the EU Standard Contractual Clauses (Art. 46(2)(c) GDPR). The statistics are deleted after 12 months at the latest. See <a href="https://umami.is/privacy">Umami's privacy policy</a> for more.</p>
    <p>You can object: if your browser has "Do Not Track" turned on, Umami does not count you. You can also turn the statistics off for this browser here; to remember that, we store a note in your browser's local storage.</p>
    <p class="legal-optout"><button type="button" data-analytics-optout></button> <span data-analytics-state></span></p>` : '',
    fr: ANALYTICS ? `

    <h2>Mesure d’audience</h2>
    <p>Pour savoir combien de personnes visitent la page d’accueil, d’où elles viennent et si elles ouvrent l’entraîneur, nous comptons les visites de la page d’accueil, du blog et de l’entraîneur avec Umami Cloud (Umami Software, Inc., États-Unis). Dans l’entraîneur, seul le fait que la page a été ouverte est compté ; tes exercices, ton journal des frappes et ton compte n’en sont pas concernés. Umami ne fonctionne pas sur ces pages juridiques. À l’ouverture d’une page, ton navigateur charge un script d’Umami et envoie les informations suivantes : la page ouverte sans ce qui est ajouté à son adresse, la page d’où tu viens, ton navigateur, ton système d’exploitation, le type d’appareil, la taille de l’écran et la langue, ainsi que, si tu cliques sur l’un des boutons de la page d’accueil qui mènent à l’entraîneur, lequel. Umami déduit ton pays et ta région de ton adresse IP ; l’adresse IP elle-même n’est pas enregistrée. Pour qu’une visite ne compte qu’une fois, Umami forme un identifiant à partir de l’adresse IP, des informations du navigateur et d’une valeur secrète qui change chaque mois ; il ne révèle pas ton adresse IP et ne permet pas de te reconnaître d’un mois à l’autre ni sur d’autres sites. Umami ne dépose aucun cookie et n’enregistre rien sur ton appareil. Nous ne voyons que des totaux.</p>
    <p>La base juridique est notre intérêt légitime à améliorer le site à partir de chiffres de visite anonymes (art. 6, par. 1, point f, du RGPD). Umami traite les données en tant que notre sous-traitant sur la base de son accord de traitement des données ; dans la mesure où un traitement aux États-Unis est possible, il est encadré par les clauses contractuelles types de l’UE (art. 46, par. 2, point c, du RGPD). Les statistiques sont supprimées au plus tard après 12 mois. Plus d’informations dans la <a href="https://umami.is/privacy">politique de confidentialité d’Umami</a>.</p>
    <p>Tu peux t’y opposer : si ton navigateur a activé « Do Not Track », Umami ne te compte pas. Tu peux aussi désactiver la mesure ici pour ce navigateur ; pour s’en souvenir, nous enregistrons une note dans le stockage local de ton navigateur.</p>
    <p class="legal-optout"><button type="button" data-analytics-optout></button> <span data-analytics-state></span></p>` : '',
    es: ANALYTICS ? `

    <h2>Estadísticas de visitas</h2>
    <p>Para saber cuántas personas visitan la página de inicio, de dónde vienen y si abren el entrenador, contamos las visitas a la página de inicio, al blog y al entrenador con Umami Cloud (Umami Software, Inc., EE. UU.). En el entrenador solo se cuenta que la página se abrió; tus ejercicios, tu registro de pulsaciones y tu cuenta no se ven afectados. Umami no funciona en estas páginas legales. Al abrir una página, tu navegador carga un script de Umami y envía estos datos: la página abierta sin nada añadido a su dirección, la página de la que vienes, tu navegador, sistema operativo, tipo de dispositivo, tamaño de pantalla e idioma y, si haces clic en uno de los botones de la página de inicio que llevan al entrenador, cuál de ellos. Umami deduce tu país y región a partir de tu dirección IP; la dirección IP en sí no se guarda. Para que una visita cuente solo una vez, Umami genera un identificador a partir de la dirección IP, los datos del navegador y un valor secreto que cambia cada mes; no revela tu dirección IP ni permite reconocerte de un mes a otro ni en otros sitios web. Umami no usa cookies ni guarda nada en tu dispositivo. Solo vemos totales.</p>
    <p>La base jurídica es nuestro interés legítimo en mejorar el sitio web a partir de cifras de visitas anónimas (art. 6.1.f) del RGPD). Umami trata los datos como nuestro encargado del tratamiento conforme a su acuerdo de tratamiento de datos; en la medida en que sea posible un tratamiento en EE. UU., está cubierto por las cláusulas contractuales tipo de la UE (art. 46.2.c) del RGPD). Las estadísticas se eliminan como máximo a los 12 meses. Más información en la <a href="https://umami.is/privacy">política de privacidad de Umami</a>.</p>
    <p>Puedes oponerte: si tu navegador tiene activado «Do Not Track», Umami no te cuenta. Además, puedes desactivar aquí las estadísticas para este navegador; para recordarlo, guardamos una nota en el almacenamiento local de tu navegador.</p>
    <p class="legal-optout"><button type="button" data-analytics-optout></button> <span data-analytics-state></span></p>` : '',
    it: ANALYTICS ? `

    <h2>Statistiche delle visite</h2>
    <p>Per sapere quante persone visitano la pagina iniziale, da dove arrivano e se aprono l’allenatore, contiamo le visite alla pagina iniziale, al blog e all’allenatore con Umami Cloud (Umami Software, Inc., USA). Nell’allenatore viene contato solo il fatto che la pagina è stata aperta; i tuoi esercizi, il tuo registro dei tasti e il tuo account non ne sono toccati. Umami non è attivo su queste pagine legali. All’apertura di una pagina il tuo browser carica uno script di Umami e invia questi dati: la pagina aperta senza aggiunte al suo indirizzo, la pagina da cui arrivi, browser, sistema operativo, tipo di dispositivo, dimensioni dello schermo e lingua e, se clicchi su uno dei pulsanti della pagina iniziale che portano all’allenatore, quale. Umami ricava il tuo paese e la tua regione dall’indirizzo IP; l’indirizzo IP in sé non viene salvato. Perché una visita conti una sola volta, Umami crea un identificativo a partire da indirizzo IP, dati del browser e un valore segreto che cambia ogni mese; non rivela il tuo indirizzo IP e non permette di riconoscerti da un mese all’altro né su altri siti. Umami non usa cookie e non salva nulla sul tuo dispositivo. Noi vediamo solo totali.</p>
    <p>La base giuridica è il nostro legittimo interesse a migliorare il sito sulla base di numeri di visita anonimi (art. 6, par. 1, lett. f) GDPR). Umami tratta i dati come nostro responsabile del trattamento sulla base del suo accordo sul trattamento dei dati; nella misura in cui è possibile un trattamento negli USA, questo è coperto dalle clausole contrattuali tipo dell’UE (art. 46, par. 2, lett. c) GDPR). Le statistiche vengono cancellate al più tardi dopo 12 mesi. Maggiori informazioni nell’<a href="https://umami.is/privacy">informativa sulla privacy di Umami</a>.</p>
    <p>Puoi opporti: se nel tuo browser è attivo «Do Not Track», Umami non ti conta. Puoi anche disattivare qui le statistiche per questo browser; per ricordarlo salviamo una nota nella memoria locale del tuo browser.</p>
    <p class="legal-optout"><button type="button" data-analytics-optout></button> <span data-analytics-state></span></p>` : '',
    pl: ANALYTICS ? `

    <h2>Statystyki odwiedzin</h2>
    <p>Aby wiedzieć, ile osób odwiedza stronę startową, skąd przychodzą i czy otwierają trener, liczymy odwiedziny strony startowej, bloga i trenera za pomocą Umami Cloud (Umami Software, Inc., USA). W trenerze liczy się tylko to, że strona została otwarta; Twoje ćwiczenia, dziennik naciśnięć i konto pozostają nietknięte. Na tych stronach prawnych Umami nie działa. Przy otwarciu strony Twoja przeglądarka wczytuje skrypt Umami i wysyła następujące dane: otwartą stronę bez dodatków w adresie, stronę, z której przychodzisz, przeglądarkę, system operacyjny, typ urządzenia, rozmiar ekranu i język, a jeśli klikniesz jeden z przycisków na stronie startowej prowadzących do trenera, to który. Z adresu IP Umami ustala kraj i region; sam adres IP nie jest zapisywany. Aby wizyta liczyła się tylko raz, Umami tworzy z adresu IP, danych przeglądarki i tajnej wartości zmieniającej się co miesiąc identyfikator, z którego nie da się odczytać Twojego adresu IP ani rozpoznać Cię w kolejnych miesiącach czy na innych stronach. Umami nie używa plików cookie i niczego nie zapisuje na Twoim urządzeniu. Widzimy tylko łączne liczby.</p>
    <p>Podstawą prawną jest nasz prawnie uzasadniony interes w ulepszaniu strony na podstawie anonimowych liczb odwiedzin (art. 6 ust. 1 lit. f RODO). Umami przetwarza dane jako nasz podmiot przetwarzający na podstawie swojej umowy powierzenia przetwarzania danych; o ile możliwe jest przetwarzanie w USA, jest ono zabezpieczone standardowymi klauzulami umownymi UE (art. 46 ust. 2 lit. c RODO). Statystyki są usuwane najpóźniej po 12 miesiącach. Więcej w <a href="https://umami.is/privacy">polityce prywatności Umami</a>.</p>
    <p>Możesz się sprzeciwić: jeśli w przeglądarce masz włączone „Do Not Track”, Umami Cię nie liczy. Możesz też wyłączyć tutaj statystyki dla tej przeglądarki; aby to zapamiętać, zapisujemy adnotację w pamięci lokalnej Twojej przeglądarki.</p>
    <p class="legal-optout"><button type="button" data-analytics-optout></button> <span data-analytics-state></span></p>` : '',
  },
};

/** Page chrome: titles, the back link and the language switch. */
export const LEGAL_UI = {
  de: {
    imprint: 'Impressum',
    privacy: 'Datenschutzerklärung',
    terms: 'Nutzungsbedingungen',
    back: '← Zurück zum Training',
    language: 'Sprache',
    updated: `Stand: ${LEGAL_UPDATED.de}`,
    note: '',
    optOut: 'Reichweitenmessung ausschalten',
    optIn: 'Reichweitenmessung wieder einschalten',
    optedOut: 'In diesem Browser ausgeschaltet.',
    optedIn: 'In diesem Browser eingeschaltet.',
  },
  en: {
    imprint: 'Legal notice (Impressum)',
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    back: '← Back to practice',
    language: 'Language',
    updated: `Last updated: ${LEGAL_UPDATED.en}`,
    note: 'This is a translation. The German version is the binding one.',
    optOut: 'Turn off visitor statistics',
    optIn: 'Turn visitor statistics back on',
    optedOut: 'Turned off in this browser.',
    optedIn: 'Turned on in this browser.',
  },
  fr: {
    imprint: 'Mentions légales (Impressum)',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d’utilisation',
    back: '← Retour à l’entraînement',
    language: 'Langue',
    updated: `Dernière mise à jour : ${LEGAL_UPDATED.fr}`,
    note: 'Ceci est une traduction. Seule la version allemande fait foi.',
    optOut: 'Désactiver la mesure d’audience',
    optIn: 'Réactiver la mesure d’audience',
    optedOut: 'Désactivée dans ce navigateur.',
    optedIn: 'Activée dans ce navigateur.',
  },
  es: {
    imprint: 'Aviso legal (Impressum)',
    privacy: 'Política de privacidad',
    terms: 'Condiciones de uso',
    back: '← Volver a practicar',
    language: 'Idioma',
    updated: `Última actualización: ${LEGAL_UPDATED.es}`,
    note: 'Esto es una traducción. La versión alemana es la vinculante.',
    optOut: 'Desactivar las estadísticas de visitas',
    optIn: 'Volver a activar las estadísticas de visitas',
    optedOut: 'Desactivadas en este navegador.',
    optedIn: 'Activadas en este navegador.',
  },
  it: {
    imprint: 'Note legali (Impressum)',
    privacy: 'Informativa sulla privacy',
    terms: 'Condizioni d’uso',
    back: '← Torna all’esercizio',
    language: 'Lingua',
    updated: `Ultimo aggiornamento: ${LEGAL_UPDATED.it}`,
    note: 'Questa è una traduzione. Fa fede la versione tedesca.',
    optOut: 'Disattiva le statistiche delle visite',
    optIn: 'Riattiva le statistiche delle visite',
    optedOut: 'Disattivate in questo browser.',
    optedIn: 'Attivate in questo browser.',
  },
  pl: {
    imprint: 'Nota prawna (Impressum)',
    privacy: 'Polityka prywatności',
    terms: 'Regulamin',
    back: '← Wróć do ćwiczeń',
    language: 'Język',
    updated: `Ostatnia aktualizacja: ${LEGAL_UPDATED.pl}`,
    note: 'To jest tłumaczenie. Wiążąca jest wersja niemiecka.',
    optOut: 'Wyłącz statystyki odwiedzin',
    optIn: 'Włącz ponownie statystyki odwiedzin',
    optedOut: 'Wyłączone w tej przeglądarce.',
    optedIn: 'Włączone w tej przeglądarce.',
  },
} satisfies Record<LegalLanguage, Record<string, string>>;

const licenses = {
  de: `
    <h2>Quellen und Lizenzen</h2>
    <ul>
      <li>Die Übungswörter stammen aus <a href="https://github.com/rspeer/wordfreq">wordfreq</a> (Robyn Speer), Lizenz <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de">CC BY-SA 4.0</a>. Die deutsche Rechtschreibung wurde mit den Worthäufigkeiten aus <a href="https://github.com/barrust/pyspellchecker">pyspellchecker</a> geprüft, die auf <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (Hermit Dave, CC BY-SA 4.0) beruhen. Die daraus erstellten Wortlisten stehen ebenfalls unter CC BY-SA 4.0.</li>
      <li>Der Filter für anstößige Wörter nutzt die <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words">List of Dirty, Naughty, Obscene, and Otherwise Bad Words</a>, Lizenz <a href="https://creativecommons.org/licenses/by/4.0/deed.de">CC BY 4.0</a>.</li>
    </ul>
    <h2>Danke</h2>
    <p>Keypacer ist von <a href="https://monkeytype.com">Monkeytype</a> inspiriert, dem quelloffenen Tipptrainer von Miodec und seiner Community. Das schlichte, ablenkungsfreie Üben dort hat gezeigt, wie gut sich Tippen im Browser anfühlen kann. Keypacer verwendet keinen Code und keine Wortlisten von Monkeytype.</p>`,
  en: `
    <h2>Sources and licenses</h2>
    <ul>
      <li>Practice words come from <a href="https://github.com/rspeer/wordfreq">wordfreq</a> (Robyn Speer), licensed <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. German spelling was checked against the word frequencies in <a href="https://github.com/barrust/pyspellchecker">pyspellchecker</a>, which are based on <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (Hermit Dave, CC BY-SA 4.0). The resulting word lists are under CC BY-SA 4.0 as well.</li>
      <li>The offensive-word filter uses the <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words">List of Dirty, Naughty, Obscene, and Otherwise Bad Words</a>, licensed <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</li>
    </ul>
    <h2>Thanks</h2>
    <p>Keypacer is inspired by <a href="https://monkeytype.com">Monkeytype</a>, the open-source typing test by Miodec and its community. Its clean, distraction-free practice showed how good typing in a browser can feel. Keypacer uses no code or word lists from Monkeytype.</p>`,
  fr: `
    <h2>Sources et licences</h2>
    <ul>
      <li>Les mots d’entraînement proviennent de <a href="https://github.com/rspeer/wordfreq">wordfreq</a> (Robyn Speer), sous licence <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">CC BY-SA 4.0</a>. L’orthographe allemande a été vérifiée à l’aide des fréquences de mots de <a href="https://github.com/barrust/pyspellchecker">pyspellchecker</a>, fondées sur <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (Hermit Dave, CC BY-SA 4.0). Les listes de mots qui en résultent sont également sous CC BY-SA 4.0.</li>
      <li>Le filtre de mots choquants utilise la <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words">List of Dirty, Naughty, Obscene, and Otherwise Bad Words</a>, sous licence <a href="https://creativecommons.org/licenses/by/4.0/deed.fr">CC BY 4.0</a>.</li>
    </ul>
    <h2>Merci</h2>
    <p>Keypacer s’inspire de <a href="https://monkeytype.com">Monkeytype</a>, le test de frappe open source de Miodec et de sa communauté. Son entraînement épuré et sans distraction a montré à quel point taper dans un navigateur peut être agréable. Keypacer n’utilise ni code ni listes de mots de Monkeytype.</p>`,
  es: `
    <h2>Fuentes y licencias</h2>
    <ul>
      <li>Las palabras de práctica proceden de <a href="https://github.com/rspeer/wordfreq">wordfreq</a> (Robyn Speer), con licencia <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es">CC BY-SA 4.0</a>. La ortografía alemana se comprobó con las frecuencias de palabras de <a href="https://github.com/barrust/pyspellchecker">pyspellchecker</a>, basadas en <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (Hermit Dave, CC BY-SA 4.0). Las listas de palabras resultantes también están bajo CC BY-SA 4.0.</li>
      <li>El filtro de palabras ofensivas usa la <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words">List of Dirty, Naughty, Obscene, and Otherwise Bad Words</a>, con licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es">CC BY 4.0</a>.</li>
    </ul>
    <h2>Gracias</h2>
    <p>Keypacer está inspirado en <a href="https://monkeytype.com">Monkeytype</a>, el test de mecanografía de código abierto de Miodec y su comunidad. Su práctica limpia y sin distracciones demostró lo bien que puede sentirse escribir en un navegador. Keypacer no usa código ni listas de palabras de Monkeytype.</p>`,
  it: `
    <h2>Fonti e licenze</h2>
    <ul>
      <li>Le parole per l’esercizio provengono da <a href="https://github.com/rspeer/wordfreq">wordfreq</a> (Robyn Speer), con licenza <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.it">CC BY-SA 4.0</a>. L’ortografia tedesca è stata verificata con le frequenze di parole di <a href="https://github.com/barrust/pyspellchecker">pyspellchecker</a>, basate su <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (Hermit Dave, CC BY-SA 4.0). Anche gli elenchi di parole risultanti sono sotto CC BY-SA 4.0.</li>
      <li>Il filtro delle parole offensive usa la <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words">List of Dirty, Naughty, Obscene, and Otherwise Bad Words</a>, con licenza <a href="https://creativecommons.org/licenses/by/4.0/deed.it">CC BY 4.0</a>.</li>
    </ul>
    <h2>Grazie</h2>
    <p>Keypacer si ispira a <a href="https://monkeytype.com">Monkeytype</a>, il test di dattilografia open source di Miodec e della sua community. Il suo esercizio essenziale e senza distrazioni ha mostrato quanto possa essere piacevole scrivere nel browser. Keypacer non usa codice né elenchi di parole di Monkeytype.</p>`,
  pl: `
    <h2>Źródła i licencje</h2>
    <ul>
      <li>Słowa do ćwiczeń pochodzą z <a href="https://github.com/rspeer/wordfreq">wordfreq</a> (Robyn Speer), licencja <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pl">CC BY-SA 4.0</a>. Pisownię niemiecką sprawdzono na podstawie częstości słów z <a href="https://github.com/barrust/pyspellchecker">pyspellchecker</a>, opartych na <a href="https://github.com/hermitdave/FrequencyWords">FrequencyWords</a> (Hermit Dave, CC BY-SA 4.0). Powstałe z nich listy słów również są dostępne na licencji CC BY-SA 4.0.</li>
      <li>Filtr obraźliwych słów korzysta z <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words">List of Dirty, Naughty, Obscene, and Otherwise Bad Words</a>, licencja <a href="https://creativecommons.org/licenses/by/4.0/deed.pl">CC BY 4.0</a>.</li>
    </ul>
    <h2>Dziękujemy</h2>
    <p>Keypacer jest inspirowany <a href="https://monkeytype.com">Monkeytype</a>, otwartoźródłowym testem pisania autorstwa Miodeca i jego społeczności. Jego prosty, wolny od rozpraszaczy trening pokazał, jak przyjemne może być pisanie w przeglądarce. Keypacer nie używa kodu ani list słów z Monkeytype.</p>`,
};

const imprint: Record<LegalLanguage, string> = {
  de: `
    <h2>Offenlegung gemäß § 25 Mediengesetz</h2>
    <p>Medieninhaber:<br>${name}<br>Wohnort: ${town}, Österreich</p>
    <p>Kontakt: ${mail}</p>
    <p>Inhalt der Website: Keypacer ist ein kostenloser Trainer für das Zehnfingersystem. Die Website ist ein privates, nicht kommerzielles Projekt ohne Werbung. Im Blog erscheinen Artikel zum Tippenlernen und zu Keypacer; sie werden auf Deutsch geschrieben, die anderen Sprachfassungen sind maschinell übersetzt.</p>
    ${licenses.de}`,
  en: `
    <h2>Disclosure under § 25 of the Austrian Media Act (MedienG)</h2>
    <p>Media owner:<br>${name}<br>Place of residence: ${town}, Austria</p>
    <p>Contact: ${mail}</p>
    <p>About this website: Keypacer is a free touch-typing trainer. The website is a private, non-commercial project without advertising. The blog publishes articles about learning to type and about Keypacer; they are written in German, and the other language versions are machine-translated.</p>
    ${licenses.en}`,
  fr: `
    <h2>Informations selon le § 25 de la loi autrichienne sur les médias (MedienG)</h2>
    <p>Propriétaire du média :<br>${name}<br>Lieu de résidence : ${town}, Autriche</p>
    <p>Contact : ${mail}</p>
    <p>Contenu du site : Keypacer est un entraîneur gratuit de dactylographie à dix doigts. Le site est un projet privé, non commercial et sans publicité. Le blog publie des articles sur l’apprentissage de la frappe et sur Keypacer ; ils sont écrits en allemand, les autres versions linguistiques sont traduites automatiquement.</p>
    ${licenses.fr}`,
  es: `
    <h2>Información conforme al § 25 de la Ley austriaca de medios (MedienG)</h2>
    <p>Propietario del medio:<br>${name}<br>Lugar de residencia: ${town}, Austria</p>
    <p>Contacto: ${mail}</p>
    <p>Contenido del sitio: Keypacer es un entrenador gratuito de mecanografía con diez dedos. El sitio web es un proyecto privado, no comercial y sin publicidad. En el blog se publican artículos sobre cómo aprender a escribir y sobre Keypacer; se escriben en alemán y las demás versiones están traducidas automáticamente.</p>
    ${licenses.es}`,
  it: `
    <h2>Informativa ai sensi del § 25 della legge austriaca sui media (MedienG)</h2>
    <p>Titolare del mezzo di comunicazione:<br>${name}<br>Luogo di residenza: ${town}, Austria</p>
    <p>Contatto: ${mail}</p>
    <p>Contenuto del sito: Keypacer è un allenatore gratuito per la dattilografia a dieci dita. Il sito è un progetto privato, non commerciale e senza pubblicità. Nel blog escono articoli su come imparare a scrivere e su Keypacer; sono scritti in tedesco, le altre versioni linguistiche sono tradotte automaticamente.</p>
    ${licenses.it}`,
  pl: `
    <h2>Informacje zgodnie z § 25 austriackiej ustawy o mediach (MedienG)</h2>
    <p>Właściciel medium:<br>${name}<br>Miejsce zamieszkania: ${town}, Austria</p>
    <p>Kontakt: ${mail}</p>
    <p>Treść strony: Keypacer to darmowy trener pisania bezwzrokowego dziesięcioma palcami. Strona jest prywatnym, niekomercyjnym projektem bez reklam. Na blogu publikujemy artykuły o nauce pisania i o Keypacerze; powstają po niemiecku, a pozostałe wersje językowe są tłumaczone maszynowo.</p>
    ${licenses.pl}`,
};

const privacy: Record<LegalLanguage, string> = {
  de: `
    <h2>Kurz gesagt</h2>
    <p>Keypacer braucht kein Konto und setzt keine Cookies. ${analytics.short.de}${captcha.short.de} Was du übst, bleibt in deinem Browser. Nur wenn du dich freiwillig anmeldest, um deinen Fortschritt zwischen Geräten abzugleichen, werden deine Übungsdaten auf einem Server in der EU gespeichert (siehe <em>Freiwilliges Konto</em>).</p>

    <h2>Verantwortlicher</h2>
    <p>${name}<br>${town}, Österreich<br>${mail}</p>

    <h2>Daten in deinem Browser</h2>
    <p>Damit das Training funktioniert und dein Fortschritt erhalten bleibt, speichert Keypacer auf deinem Gerät im lokalen Speicher deines Browsers (localStorage und IndexedDB):</p>
    <ul>
      <li><strong>Einstellungen:</strong> Tastaturlayout, Übungs- und Oberflächensprache, Farbschema, Hilfen beim Tippen, ob die Einrichtung abgeschlossen ist und ob du einen Hinweis weggeklickt hast, dein Wochenziel; falls du mehrere Tastaturen nutzt, deren Namen und Layouts und welche gerade gewählt ist.</li>
      <li><strong>Lernstand:</strong> welche Tasten freigeschaltet sind und welche du schon beherrschst, und wie weit du im Lernpfad bist, je Sprache und Layout.</li>
      <li><strong>Tastenprotokoll:</strong> für jeden Anschlag im Übungstext das erwartete und das getippte Zeichen, die Taste, die Zeit seit dem vorigen Anschlag, Datum und Uhrzeit sowie die Übungsrunde, und wenn du unter <em>Einstellungen → Tastaturen</em> mehrere Tastaturen angelegt hast, auf welcher davon. Daraus berechnet Keypacer deine schwachen Tasten und die nächsten Übungen. Erfasst wird nur, was du in das Übungsfeld tippst.</li>${analytics.stored.de}
    </ul>
    <p>Ohne Konto verlassen diese Daten dein Gerät nicht; wir erhalten sie nicht und können sie nicht einsehen. Wenn du angemeldet bist, liegen hier außerdem deine Anmeldung (ein Zugangsschlüssel, damit du angemeldet bleibst) und der Stand des letzten Abgleichs. Das Speichern ist technisch unbedingt erforderlich, um den Dienst bereitzustellen, den du ausdrücklich nutzt (§ 165 Abs. 3 TKG 2021); eine Einwilligung und ein Cookie-Banner sind dafür nicht nötig.</p>
    <p>Du behältst die Kontrolle: Unter <em>Einstellungen → Tastenprotokoll und Export</em> kannst du das Protokoll ansehen, als JSON oder CSV exportieren und löschen. Alles zusammen entfernst du, indem du in deinem Browser die Websitedaten für diese Seite löschst.</p>

    <h2>Freiwilliges Konto und Abgleich zwischen Geräten</h2>
    <p>Du kannst dich unter <em>Einstellungen → Konto</em> ${accountMail.de.methods} anmelden. Dann gleicht Keypacer deinen Fortschritt zwischen deinen Geräten ab. Dafür verarbeiten wir:</p>
    <ul>
      <li><strong>Anmeldedaten:</strong> deine E-Mail-Adresse, dein Passwort (nur als nicht umkehrbarer Hash gespeichert), eine interne Benutzerkennung, Zeitpunkt der Registrierung und der letzten Anmeldung sowie technische Protokolle der Anmeldung (IP-Adresse, Browserangaben, Zeitpunkt), die der Absicherung gegen Missbrauch dienen.</li>
      <li><strong>Benutzername:</strong> den du beim Registrieren wählst. Er wird in der App statt deiner E-Mail-Adresse angezeigt. Andere Nutzer sehen ihn nur, wenn du einer Gruppe von Trainingspartnern beitrittst (siehe unten); beim Registrieren lässt sich nur prüfen, ob ein Name schon vergeben ist.</li>
      <li><strong>Übungsdaten:</strong> das Tastenprotokoll jeder abgeschlossenen Übungsrunde (wie oben unter <em>Tastenprotokoll</em> beschrieben) und dein Lernstand je Sprache und Layout, außerdem Namen und Layouts deiner Tastaturen, falls du mehrere angelegt hast. Deine übrigen Einstellungen bleiben nur auf dem jeweiligen Gerät.</li>
    </ul>
    <p>Rechtsgrundlage ist die Erfüllung des Nutzungsverhältnisses, das du mit der Anmeldung eingehst (Art. 6 Abs. 1 lit. b DSGVO, siehe <a href="/nutzungsbedingungen">Nutzungsbedingungen</a>); die Anmeldeprotokolle verarbeiten wir aufgrund unseres berechtigten Interesses an einem sicheren Dienst (Art. 6 Abs. 1 lit. f DSGVO).</p>
    <p>Konto und Daten werden bei Supabase gespeichert (Supabase, Inc., USA), auf Servern in Frankfurt am Main (EU). Supabase verarbeitet die Daten als unser Auftragsverarbeiter auf Grundlage seines Auftragsverarbeitungsvertrags${accountMail.de.supabase} Soweit dabei ein Zugriff aus Ländern außerhalb der EU möglich ist, etwa durch Supabase selbst oder dessen Unterauftragsverarbeiter, ist er durch die EU-Standardvertragsklauseln abgesichert (Art. 46 Abs. 2 lit. c DSGVO). Mehr dazu in der <a href="https://supabase.com/privacy">Datenschutzerklärung von Supabase</a>.</p>
    <p>Wir speichern deine Daten, solange du dein Konto hast. Unter <em>Einstellungen → Konto → Konto löschen</em> löschst du dein Konto samt allen dort gespeicherten Übungsdaten sofort; die Daten auf deinem Gerät bleiben, bis du sie selbst löschst. Löschst du unter <em>Tastenprotokoll und Export</em> das Protokoll, während du angemeldet bist, wird es auch im Konto gelöscht. Anmeldeprotokolle löscht Supabase automatisch nach kurzer Zeit.</p>
    <p><strong>Trainingspartner (freiwillig):</strong> Mit Konto kannst du eine kleine Gruppe gründen (bis zu 8 Personen) und Freunde per Einladungslink dazuholen. Die Mitglieder einer Gruppe sehen gegenseitig ihren Benutzernamen, ihr Wochenziel, an wie vielen Tagen sie in der laufenden Woche geübt haben, ihre Serie in Wochen und die Anfeuerungen (👏) der Woche; die durchschnittliche Tippgeschwindigkeit nur, wenn das jeweilige Mitglied sie freigibt. Dafür speichern wir die Gruppe, wer dazugehört, diese Wochenzahlen und die Anfeuerungen. Wer den Einladungslink hat, sieht vor dem Beitritt den Benutzernamen der Person, die die Gruppe gegründet hat, und wie viele Mitglieder sie hat. Dein Tastenprotokoll und deine E-Mail-Adresse sehen andere nie. Rechtsgrundlage ist die Erfüllung des Nutzungsverhältnisses, weil du diese Funktion ausdrücklich nutzt (Art. 6 Abs. 1 lit. b DSGVO). Wenn du die Gruppe verlässt, daraus entfernt wirst oder dein Konto löschst, werden deine Wochenzahlen und Anfeuerungen in dieser Gruppe sofort gelöscht.</p>
    <p><strong>Anmeldung mit Google:</strong> Wählst du „Weiter mit Google“, wirst du zu Google weitergeleitet (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) und meldest dich dort an. Google teilt uns danach deine E-Mail-Adresse, deinen Namen und die Adresse deines Profilbilds mit; wir verwenden nur die E-Mail-Adresse und speichern die übrigen Angaben nur, weil Supabase sie mit der Anmeldung ablegt. Für die Anmeldung bei Google ist Google selbst verantwortlich, siehe <a href="https://policies.google.com/privacy?hl=de">Datenschutzerklärung von Google</a>. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>${accountMail.de.section}${captcha.section.de}${analytics.section.de}

    <h2>Hosting</h2>
    <p>Die Website wird über Cloudflare ausgeliefert (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA). Beim Aufruf verarbeitet Cloudflare technisch notwendige Daten, damit die Seite bei dir ankommt und vor Angriffen geschützt ist: deine IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse sowie Angaben deines Browsers wie Browsertyp und Betriebssystem. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und funktionierenden Website (Art. 6 Abs. 1 lit. f DSGVO).</p>
    <p>Cloudflare handelt dabei als unser Auftragsverarbeiter auf Grundlage seines Auftragsverarbeitungsvertrags. Eine Verarbeitung in den USA ist möglich; Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert, für das ein Angemessenheitsbeschluss der EU-Kommission besteht (Art. 45 DSGVO). Wir selbst werten keine Zugriffsprotokolle aus. Mehr dazu in der <a href="https://www.cloudflare.com/de-de/privacypolicy/">Datenschutzerklärung von Cloudflare</a>.</p>

    <h2>Kontakt per E-Mail</h2>
    <p>Wenn du uns schreibst, verwenden wir deine E-Mail-Adresse und deine Nachricht nur, um dir zu antworten (Art. 6 Abs. 1 lit. f DSGVO). Wir löschen sie, sobald die Anfrage erledigt ist und keine gesetzliche Pflicht zur Aufbewahrung besteht.</p>

    <h2>Deine Rechte</h2>
    <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung, auf Datenübertragbarkeit und auf Widerspruch (Art. 15 bis 21 DSGVO). Schreib uns dazu einfach eine E-Mail. Wenn du meinst, dass wir deine Daten nicht rechtmäßig verarbeiten, kannst du dich bei der Österreichischen Datenschutzbehörde beschweren: Barichgasse 40–42, 1030 Wien, <a href="https://www.dsb.gv.at">www.dsb.gv.at</a>.</p>

    <h2>Änderungen</h2>
    <p>Wenn Keypacer neue Funktionen bekommt, die Daten verarbeiten, oder einen weiteren Dienstleister einsetzt, passen wir diese Erklärung vorher an.</p>`,
  en: `
    <h2>In short</h2>
    <p>Keypacer needs no account and sets no cookies. ${analytics.short.en}${captcha.short.en} What you practise stays in your browser. Only if you choose to sign in, to keep your progress in sync between devices, is your practice data stored on a server in the EU (see <em>Optional account</em>).</p>

    <h2>Controller</h2>
    <p>${name}<br>${town}, Austria<br>${mail}</p>

    <h2>Data in your browser</h2>
    <p>So that training works and your progress is kept, Keypacer stores the following on your device, in your browser's local storage (localStorage and IndexedDB):</p>
    <ul>
      <li><strong>Settings:</strong> keyboard layout, practice and interface language, colour theme, typing aids, whether setup is finished or a notice was dismissed, your weekly goal, and, if you use several keyboards, their names and layouts and which one is selected.</li>
      <li><strong>Learning state:</strong> which keys are unlocked and which you have mastered, and how far along the learning path you are, per language and layout.</li>
      <li><strong>Keystroke log:</strong> for each keystroke in the practice text, the expected and the typed character, the key, the time since the previous keystroke, the date and time, and the practice round, plus which keyboard you typed on if you set up several under <em>Settings → Keyboards</em>. Keypacer uses it to work out your weak keys and your next drills. Only what you type into the practice field is recorded.</li>${analytics.stored.en}
    </ul>
    <p>Without an account this data does not leave your device; we do not receive it and cannot see it. When you are signed in, your sign-in (an access token, so you stay signed in) and the state of the last sync are stored here too. Storing it is strictly necessary to provide the service you explicitly use (§ 165(3) of the Austrian Telecommunications Act 2021, TKG 2021), so it needs no consent and no cookie banner.</p>
    <p>You stay in control: under <em>Settings → Keystroke log and export</em> you can view the log, export it as JSON or CSV, and delete it. To remove everything, clear this site's data in your browser.</p>

    <h2>Optional account and sync between devices</h2>
    <p>Under <em>Settings → Account</em> you can sign in ${accountMail.en.methods}. Keypacer then keeps your progress in sync between your devices. For this we process:</p>
    <ul>
      <li><strong>Sign-in data:</strong> your e-mail address, your password (stored only as a one-way hash), an internal user ID, when you registered and last signed in, and technical sign-in logs (IP address, browser details, time) used to protect against abuse.</li>
      <li><strong>Username:</strong> the one you choose when you sign up. The app shows it instead of your e-mail address. Other users only see it if you join a group of training buddies (see below); signing up only reveals whether a name is already taken.</li>
      <li><strong>Practice data:</strong> the keystroke log of each finished practice round (as described above under <em>Keystroke log</em>) and your learning state per language and layout, plus the names and layouts of your keyboards if you set up several. Your other settings stay on each device.</li>
    </ul>
    <p>The legal basis is performing the service you sign up for (Art. 6(1)(b) GDPR, see the <a href="/nutzungsbedingungen">terms of use</a>); we process the sign-in logs based on our legitimate interest in a secure service (Art. 6(1)(f) GDPR).</p>
    <p>Accounts and data are stored with Supabase (Supabase, Inc., USA), on servers in Frankfurt am Main (EU). Supabase processes the data as our processor under its data processing agreement${accountMail.en.supabase} Where access from outside the EU is possible, for example by Supabase itself or its sub-processors, it is covered by the EU Standard Contractual Clauses (Art. 46(2)(c) GDPR). See <a href="https://supabase.com/privacy">Supabase's privacy policy</a> for more.</p>
    <p>We keep your data for as long as you have your account. Under <em>Settings → Account → Delete account</em> you delete your account and all practice data stored with it at once; the data on your device stays until you delete it yourself. If you clear the log under <em>Keystroke log and export</em> while signed in, it is deleted from your account too. Supabase deletes sign-in logs automatically after a short time.</p>
    <p><strong>Training buddies (optional):</strong> with an account you can start a small group (up to 8 people) and bring friends in with an invite link. Members of a group see each other's username, weekly goal, how many days they practised in the current week, their streak in weeks, and the week's cheers (👏); average typing speed only if that member chooses to share it. For this we store the group, who is in it, these weekly numbers and the cheers. Anyone with the invite link can see, before joining, the username of the person who started the group and how many members it has. Others never see your keystroke log or your e-mail address. The legal basis is performing the service, since you use this feature explicitly (Art. 6(1)(b) GDPR). When you leave the group, are removed from it or delete your account, your weekly numbers and cheers in that group are deleted at once.</p>
    <p><strong>Signing in with Google:</strong> if you choose "Continue with Google", you are sent to Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland) to sign in there. Google then gives us your e-mail address, your name and the address of your profile picture; we only use the e-mail address and keep the rest only because Supabase stores it with the sign-in. Google is responsible for signing you in on its side, see <a href="https://policies.google.com/privacy">Google's privacy policy</a>. The legal basis is Art. 6(1)(b) GDPR.</p>${accountMail.en.section}${captcha.section.en}${analytics.section.en}

    <h2>Hosting</h2>
    <p>The website is delivered through Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA). When you open it, Cloudflare processes the technical data needed to get the page to you and to protect it from attacks: your IP address, the date and time, the address requested, and details your browser sends such as browser type and operating system. The legal basis is our legitimate interest in a secure, working website (Art. 6(1)(f) GDPR).</p>
    <p>Cloudflare acts as our processor under its data processing agreement. Processing in the USA is possible; Cloudflare is certified under the EU-US Data Privacy Framework, which is covered by an adequacy decision of the European Commission (Art. 45 GDPR). We do not analyse access logs ourselves. See <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare's privacy policy</a> for more.</p>

    <h2>Contact by e-mail</h2>
    <p>If you write to us, we use your e-mail address and message only to answer you (Art. 6(1)(f) GDPR). We delete them once the request is dealt with, unless the law requires us to keep them.</p>

    <h2>Your rights</h2>
    <p>You have the right of access, rectification, erasure and restriction of processing, the right to data portability and the right to object (Art. 15 to 21 GDPR). Just send us an e-mail. If you believe we process your data unlawfully, you can complain to the Austrian Data Protection Authority (Datenschutzbehörde): Barichgasse 40–42, 1030 Vienna, <a href="https://www.dsb.gv.at">www.dsb.gv.at</a>.</p>

    <h2>Changes</h2>
    <p>If Keypacer gets new features that process data, or uses another service provider, we will update this policy first.</p>`,
  fr: `
    <h2>En bref</h2>
    <p>Keypacer ne demande pas de compte et ne dépose pas de cookies. ${analytics.short.fr}${captcha.short.fr} Ce que tu pratiques reste dans ton navigateur. C’est seulement si tu choisis de te connecter, pour synchroniser ta progression entre tes appareils, que tes données d’entraînement sont stockées sur un serveur dans l’UE (voir <em>Compte facultatif</em>).</p>

    <h2>Responsable du traitement</h2>
    <p>${name}<br>${town}, Autriche<br>${mail}</p>

    <h2>Données dans ton navigateur</h2>
    <p>Pour que l’entraînement fonctionne et que ta progression soit conservée, Keypacer enregistre sur ton appareil, dans le stockage local de ton navigateur (localStorage et IndexedDB) :</p>
    <ul>
      <li><strong>Réglages :</strong> disposition du clavier, langue d’entraînement et de l’interface, thème de couleurs, aides à la frappe, si la configuration est terminée et si tu as fermé un message, ton objectif hebdomadaire et, si tu utilises plusieurs claviers, leurs noms et dispositions et celui qui est sélectionné.</li>
      <li><strong>Niveau d’apprentissage :</strong> quelles touches sont débloquées et lesquelles tu maîtrises, et où tu en es dans le parcours d’apprentissage, par langue et par disposition.</li>
      <li><strong>Journal des frappes :</strong> pour chaque frappe dans le texte d’entraînement, le caractère attendu et le caractère tapé, la touche, le temps écoulé depuis la frappe précédente, la date et l’heure ainsi que la série d’exercices, et, si tu as créé plusieurs claviers sous <em>Réglages → Claviers</em>, sur lequel tu as tapé. Keypacer s’en sert pour déterminer tes touches faibles et tes prochains exercices. Seul ce que tu tapes dans le champ d’entraînement est enregistré.</li>${analytics.stored.fr}
    </ul>
    <p>Sans compte, ces données ne quittent pas ton appareil ; nous ne les recevons pas et ne pouvons pas les consulter. Quand tu es connecté, ta connexion (une clé d’accès pour que tu restes connecté) et l’état de la dernière synchronisation y sont aussi enregistrés. Ce stockage est strictement nécessaire pour fournir le service que tu utilises expressément (§ 165, al. 3, de la loi autrichienne sur les télécommunications de 2021, TKG 2021) ; il ne nécessite donc ni consentement ni bannière de cookies.</p>
    <p>Tu gardes le contrôle : sous <em>Réglages → Journal des frappes et export</em>, tu peux consulter le journal, l’exporter en JSON ou en CSV et le supprimer. Pour tout effacer, supprime les données de ce site dans ton navigateur.</p>

    <h2>Compte facultatif et synchronisation entre appareils</h2>
    <p>Sous <em>Réglages → Compte</em>, tu peux te connecter ${accountMail.fr.methods}. Keypacer synchronise alors ta progression entre tes appareils. Pour cela, nous traitons :</p>
    <ul>
      <li><strong>Données de connexion :</strong> ton adresse e-mail, ton mot de passe (enregistré uniquement sous forme de hachage irréversible), un identifiant d’utilisateur interne, la date d’inscription et de dernière connexion, ainsi que des journaux techniques de connexion (adresse IP, informations du navigateur, heure) qui servent à se protéger contre les abus.</li>
      <li><strong>Nom d’utilisateur :</strong> celui que tu choisis à l’inscription. L’application l’affiche à la place de ton adresse e-mail. Les autres utilisateurs ne le voient que si tu rejoins un groupe de partenaires d’entraînement (voir ci-dessous) ; à l’inscription, on peut seulement vérifier si un nom est déjà pris.</li>
      <li><strong>Données d’entraînement :</strong> le journal des frappes de chaque série d’exercices terminée (comme décrit plus haut sous <em>Journal des frappes</em>) et ton niveau d’apprentissage par langue et par disposition, ainsi que les noms et dispositions de tes claviers si tu en as créé plusieurs. Tes autres réglages restent sur chaque appareil.</li>
    </ul>
    <p>La base juridique est l’exécution de la relation d’utilisation que tu établis en t’inscrivant (art. 6, par. 1, point b, du RGPD, voir les <a href="/nutzungsbedingungen">conditions d’utilisation</a>) ; nous traitons les journaux de connexion sur la base de notre intérêt légitime à un service sûr (art. 6, par. 1, point f, du RGPD).</p>
    <p>Les comptes et les données sont stockés chez Supabase (Supabase, Inc., États-Unis), sur des serveurs à Francfort-sur-le-Main (UE). Supabase traite les données en tant que notre sous-traitant sur la base de son accord de traitement des données${accountMail.fr.supabase} Dans la mesure où un accès depuis des pays hors de l’UE est possible, par exemple par Supabase elle-même ou ses sous-traitants ultérieurs, il est encadré par les clauses contractuelles types de l’UE (art. 46, par. 2, point c, du RGPD). Plus d’informations dans la <a href="https://supabase.com/privacy">politique de confidentialité de Supabase</a>.</p>
    <p>Nous conservons tes données tant que tu as ton compte. Sous <em>Réglages → Compte → Supprimer le compte</em>, tu supprimes immédiatement ton compte et toutes les données d’entraînement qui y sont enregistrées ; les données sur ton appareil restent jusqu’à ce que tu les supprimes toi-même. Si tu effaces le journal sous <em>Journal des frappes et export</em> pendant que tu es connecté, il est aussi effacé du compte. Supabase supprime automatiquement les journaux de connexion après peu de temps.</p>
    <p><strong>Partenaires d’entraînement (facultatif) :</strong> avec un compte, tu peux créer un petit groupe (jusqu’à 8 personnes) et y inviter des amis par un lien d’invitation. Les membres d’un groupe voient mutuellement leur nom d’utilisateur, leur objectif hebdomadaire, le nombre de jours où ils se sont entraînés dans la semaine en cours, leur série en semaines et les encouragements (👏) de la semaine ; la vitesse de frappe moyenne seulement si le membre concerné choisit de la partager. Pour cela, nous enregistrons le groupe, qui en fait partie, ces chiffres hebdomadaires et les encouragements. Toute personne disposant du lien d’invitation voit, avant de rejoindre le groupe, le nom d’utilisateur de la personne qui l’a créé et le nombre de membres. Les autres ne voient jamais ton journal des frappes ni ton adresse e-mail. La base juridique est l’exécution de la relation d’utilisation, puisque tu utilises expressément cette fonction (art. 6, par. 1, point b, du RGPD). Si tu quittes le groupe, en es retiré ou supprimes ton compte, tes chiffres hebdomadaires et tes encouragements dans ce groupe sont supprimés immédiatement.</p>
    <p><strong>Connexion avec Google :</strong> si tu choisis « Continuer avec Google », tu es redirigé vers Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande) pour t’y connecter. Google nous transmet ensuite ton adresse e-mail, ton nom et l’adresse de ta photo de profil ; nous n’utilisons que l’adresse e-mail et ne conservons le reste que parce que Supabase l’enregistre avec la connexion. Google est lui-même responsable de la connexion chez Google, voir la <a href="https://policies.google.com/privacy?hl=fr">politique de confidentialité de Google</a>. La base juridique est l’art. 6, par. 1, point b, du RGPD.</p>${accountMail.fr.section}${captcha.section.fr}${analytics.section.fr}

    <h2>Hébergement</h2>
    <p>Le site est diffusé via Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, États-Unis). Lors de la consultation, Cloudflare traite les données techniquement nécessaires pour que la page te parvienne et soit protégée contre les attaques : ton adresse IP, la date et l’heure, l’adresse demandée ainsi que des informations de ton navigateur comme le type de navigateur et le système d’exploitation. La base juridique est notre intérêt légitime à un site sûr et fonctionnel (art. 6, par. 1, point f, du RGPD).</p>
    <p>Cloudflare agit en tant que notre sous-traitant sur la base de son accord de traitement des données. Un traitement aux États-Unis est possible ; Cloudflare est certifié au titre du cadre de protection des données UE–États-Unis, qui fait l’objet d’une décision d’adéquation de la Commission européenne (art. 45 du RGPD). Nous n’analysons pas nous-mêmes les journaux d’accès. Plus d’informations dans la <a href="https://www.cloudflare.com/privacypolicy/">politique de confidentialité de Cloudflare</a>.</p>

    <h2>Contact par e-mail</h2>
    <p>Si tu nous écris, nous utilisons ton adresse e-mail et ton message uniquement pour te répondre (art. 6, par. 1, point f, du RGPD). Nous les supprimons une fois la demande traitée, sauf obligation légale de conservation.</p>

    <h2>Tes droits</h2>
    <p>Tu as le droit d’accès, de rectification, d’effacement et de limitation du traitement, le droit à la portabilité des données et le droit d’opposition (art. 15 à 21 du RGPD). Il te suffit de nous envoyer un e-mail. Si tu estimes que nous traitons tes données de manière illicite, tu peux déposer une plainte auprès de l’autorité autrichienne de protection des données (Datenschutzbehörde) : Barichgasse 40–42, 1030 Vienne, <a href="https://www.dsb.gv.at">www.dsb.gv.at</a>.</p>

    <h2>Modifications</h2>
    <p>Si Keypacer reçoit de nouvelles fonctions qui traitent des données, ou fait appel à un autre prestataire, nous adapterons d’abord cette politique.</p>`,
  es: `
    <h2>En resumen</h2>
    <p>Keypacer no necesita cuenta y no usa cookies. ${analytics.short.es}${captcha.short.es} Lo que practicas se queda en tu navegador. Solo si decides iniciar sesión para sincronizar tu progreso entre dispositivos, tus datos de práctica se guardan en un servidor de la UE (ver <em>Cuenta opcional</em>).</p>

    <h2>Responsable del tratamiento</h2>
    <p>${name}<br>${town}, Austria<br>${mail}</p>

    <h2>Datos en tu navegador</h2>
    <p>Para que el entrenamiento funcione y tu progreso se conserve, Keypacer guarda en tu dispositivo, en el almacenamiento local de tu navegador (localStorage e IndexedDB):</p>
    <ul>
      <li><strong>Ajustes:</strong> distribución del teclado, idioma de práctica y de la interfaz, tema de color, ayudas para escribir, si la configuración está terminada y si has cerrado algún aviso, tu objetivo semanal y, si usas varios teclados, sus nombres y distribuciones y cuál está seleccionado.</li>
      <li><strong>Nivel de aprendizaje:</strong> qué teclas están desbloqueadas y cuáles dominas, y cuánto has avanzado en la ruta de aprendizaje, por idioma y distribución.</li>
      <li><strong>Registro de pulsaciones:</strong> para cada pulsación en el texto de práctica, el carácter esperado y el escrito, la tecla, el tiempo desde la pulsación anterior, la fecha y la hora y la ronda de práctica, y, si has creado varios teclados en <em>Ajustes → Teclados</em>, en cuál escribiste. Keypacer lo usa para calcular tus teclas débiles y tus próximos ejercicios. Solo se registra lo que escribes en el campo de práctica.</li>${analytics.stored.es}
    </ul>
    <p>Sin cuenta, estos datos no salen de tu dispositivo; no los recibimos ni podemos verlos. Si has iniciado sesión, aquí se guardan además tu sesión (una clave de acceso para que sigas conectado) y el estado de la última sincronización. Este almacenamiento es estrictamente necesario para prestar el servicio que utilizas expresamente (§ 165.3 de la Ley austriaca de Telecomunicaciones de 2021, TKG 2021), por lo que no requiere consentimiento ni banner de cookies.</p>
    <p>Tú tienes el control: en <em>Ajustes → Registro de pulsaciones y exportación</em> puedes ver el registro, exportarlo como JSON o CSV y borrarlo. Para eliminarlo todo, borra en tu navegador los datos de este sitio.</p>

    <h2>Cuenta opcional y sincronización entre dispositivos</h2>
    <p>En <em>Ajustes → Cuenta</em> puedes iniciar sesión ${accountMail.es.methods}. Entonces Keypacer sincroniza tu progreso entre tus dispositivos. Para ello tratamos:</p>
    <ul>
      <li><strong>Datos de acceso:</strong> tu dirección de correo electrónico, tu contraseña (guardada solo como hash irreversible), un identificador interno de usuario, la fecha de registro y del último inicio de sesión, y registros técnicos de inicio de sesión (dirección IP, datos del navegador, hora) que sirven para protegerse contra el abuso.</li>
      <li><strong>Nombre de usuario:</strong> el que eliges al registrarte. La aplicación lo muestra en lugar de tu dirección de correo. Otros usuarios solo lo ven si te unes a un grupo de compañeros de entrenamiento (ver más abajo); al registrarse solo se puede comprobar si un nombre ya está ocupado.</li>
      <li><strong>Datos de práctica:</strong> el registro de pulsaciones de cada ronda de práctica terminada (como se describe arriba en <em>Registro de pulsaciones</em>) y tu nivel de aprendizaje por idioma y distribución, además de los nombres y distribuciones de tus teclados si has creado varios. El resto de tus ajustes se queda en cada dispositivo.</li>
    </ul>
    <p>La base jurídica es la ejecución de la relación de uso que estableces al registrarte (art. 6.1.b) del RGPD, ver las <a href="/nutzungsbedingungen">condiciones de uso</a>); tratamos los registros de inicio de sesión sobre la base de nuestro interés legítimo en un servicio seguro (art. 6.1.f) del RGPD).</p>
    <p>Las cuentas y los datos se almacenan en Supabase (Supabase, Inc., EE. UU.), en servidores de Fráncfort del Meno (UE). Supabase trata los datos como nuestro encargado del tratamiento conforme a su acuerdo de tratamiento de datos${accountMail.es.supabase} En la medida en que sea posible un acceso desde países fuera de la UE, por ejemplo por parte de la propia Supabase o de sus subencargados, está cubierto por las cláusulas contractuales tipo de la UE (art. 46.2.c) del RGPD). Más información en la <a href="https://supabase.com/privacy">política de privacidad de Supabase</a>.</p>
    <p>Conservamos tus datos mientras tengas tu cuenta. En <em>Ajustes → Cuenta → Eliminar cuenta</em> eliminas al instante tu cuenta y todos los datos de práctica guardados en ella; los datos de tu dispositivo se conservan hasta que los borres tú. Si borras el registro en <em>Registro de pulsaciones y exportación</em> con la sesión iniciada, también se borra de la cuenta. Supabase elimina automáticamente los registros de inicio de sesión al poco tiempo.</p>
    <p><strong>Compañeros de entrenamiento (opcional):</strong> con una cuenta puedes crear un grupo pequeño (hasta 8 personas) e invitar a amigos con un enlace de invitación. Los miembros de un grupo ven mutuamente su nombre de usuario, su objetivo semanal, cuántos días han practicado en la semana en curso, su racha en semanas y los ánimos (👏) de la semana; la velocidad media de escritura solo si ese miembro decide compartirla. Para ello guardamos el grupo, quién forma parte de él, estas cifras semanales y los ánimos. Quien tenga el enlace de invitación ve, antes de unirse, el nombre de usuario de la persona que creó el grupo y cuántos miembros tiene. Los demás nunca ven tu registro de pulsaciones ni tu dirección de correo. La base jurídica es la ejecución de la relación de uso, ya que utilizas esta función expresamente (art. 6.1.b) del RGPD). Si dejas el grupo, te expulsan de él o eliminas tu cuenta, tus cifras semanales y tus ánimos en ese grupo se borran al instante.</p>
    <p><strong>Inicio de sesión con Google:</strong> si eliges «Continuar con Google», se te redirige a Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlanda) para iniciar sesión allí. Después, Google nos comunica tu dirección de correo, tu nombre y la dirección de tu foto de perfil; solo usamos la dirección de correo y guardamos el resto únicamente porque Supabase lo almacena con el inicio de sesión. Google es responsable del inicio de sesión en su lado, ver la <a href="https://policies.google.com/privacy?hl=es">política de privacidad de Google</a>. La base jurídica es el art. 6.1.b) del RGPD.</p>${accountMail.es.section}${captcha.section.es}${analytics.section.es}

    <h2>Alojamiento</h2>
    <p>El sitio web se sirve a través de Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, EE. UU.). Al abrirlo, Cloudflare trata los datos técnicamente necesarios para que la página te llegue y esté protegida frente a ataques: tu dirección IP, la fecha y la hora, la dirección solicitada y datos de tu navegador como el tipo de navegador y el sistema operativo. La base jurídica es nuestro interés legítimo en un sitio web seguro y que funcione (art. 6.1.f) del RGPD).</p>
    <p>Cloudflare actúa como nuestro encargado del tratamiento conforme a su acuerdo de tratamiento de datos. Es posible un tratamiento en EE. UU.; Cloudflare está certificado conforme al Marco de Privacidad de Datos UE-EE. UU., sobre el que existe una decisión de adecuación de la Comisión Europea (art. 45 del RGPD). Nosotros no analizamos registros de acceso. Más información en la <a href="https://www.cloudflare.com/privacypolicy/">política de privacidad de Cloudflare</a>.</p>

    <h2>Contacto por correo electrónico</h2>
    <p>Si nos escribes, usamos tu dirección de correo y tu mensaje solo para responderte (art. 6.1.f) del RGPD). Los borramos en cuanto la consulta está resuelta, salvo que la ley nos obligue a conservarlos.</p>

    <h2>Tus derechos</h2>
    <p>Tienes derecho de acceso, rectificación, supresión y limitación del tratamiento, derecho a la portabilidad de los datos y derecho de oposición (arts. 15 a 21 del RGPD). Basta con que nos envíes un correo. Si crees que tratamos tus datos de forma ilícita, puedes presentar una reclamación ante la autoridad austriaca de protección de datos (Datenschutzbehörde): Barichgasse 40–42, 1030 Viena, <a href="https://www.dsb.gv.at">www.dsb.gv.at</a>.</p>

    <h2>Cambios</h2>
    <p>Si Keypacer recibe nuevas funciones que traten datos o recurre a otro proveedor de servicios, adaptaremos antes esta política.</p>`,
  it: `
    <h2>In breve</h2>
    <p>Keypacer non richiede un account e non usa cookie. ${analytics.short.it}${captcha.short.it} Ciò su cui ti eserciti resta nel tuo browser. Solo se scegli di accedere per sincronizzare i progressi tra i tuoi dispositivi, i tuoi dati di esercizio vengono salvati su un server nell’UE (vedi <em>Account facoltativo</em>).</p>

    <h2>Titolare del trattamento</h2>
    <p>${name}<br>${town}, Austria<br>${mail}</p>

    <h2>Dati nel tuo browser</h2>
    <p>Perché l’allenamento funzioni e i tuoi progressi vengano conservati, Keypacer salva sul tuo dispositivo, nella memoria locale del tuo browser (localStorage e IndexedDB):</p>
    <ul>
      <li><strong>Impostazioni:</strong> layout della tastiera, lingua di esercizio e dell’interfaccia, tema dei colori, aiuti alla digitazione, se la configurazione è completata e se hai chiuso un avviso, il tuo obiettivo settimanale e, se usi più tastiere, i loro nomi e layout e quale è selezionata.</li>
      <li><strong>Livello di apprendimento:</strong> quali tasti sono sbloccati e quali padroneggi, e a che punto sei del percorso di apprendimento, per lingua e layout.</li>
      <li><strong>Registro dei tasti:</strong> per ogni battuta nel testo di esercizio, il carattere atteso e quello digitato, il tasto, il tempo trascorso dalla battuta precedente, data e ora e il turno di esercizio e, se in <em>Impostazioni → Tastiere</em> hai creato più tastiere, su quale hai digitato. Keypacer lo usa per individuare i tuoi tasti deboli e i prossimi esercizi. Viene registrato solo ciò che digiti nel campo di esercizio.</li>${analytics.stored.it}
    </ul>
    <p>Senza account questi dati non lasciano il tuo dispositivo; noi non li riceviamo e non possiamo vederli. Se hai effettuato l’accesso, qui sono salvati anche il tuo accesso (una chiave che ti mantiene connesso) e lo stato dell’ultima sincronizzazione. La memorizzazione è strettamente necessaria per fornire il servizio che usi espressamente (§ 165, comma 3, della legge austriaca sulle telecomunicazioni 2021, TKG 2021); non servono quindi consenso né banner dei cookie.</p>
    <p>Il controllo resta a te: in <em>Impostazioni → Registro dei tasti ed esportazione</em> puoi vedere il registro, esportarlo in JSON o CSV ed eliminarlo. Per cancellare tutto, elimina nel tuo browser i dati di questo sito.</p>

    <h2>Account facoltativo e sincronizzazione tra dispositivi</h2>
    <p>In <em>Impostazioni → Account</em> puoi accedere ${accountMail.it.methods}. Keypacer sincronizza poi i tuoi progressi tra i tuoi dispositivi. A tal fine trattiamo:</p>
    <ul>
      <li><strong>Dati di accesso:</strong> il tuo indirizzo e-mail, la tua password (salvata solo come hash non reversibile), un identificativo utente interno, la data di registrazione e dell’ultimo accesso e registri tecnici degli accessi (indirizzo IP, dati del browser, ora) che servono a proteggersi dagli abusi.</li>
      <li><strong>Nome utente:</strong> quello che scegli alla registrazione. L’app lo mostra al posto del tuo indirizzo e-mail. Gli altri utenti lo vedono solo se entri in un gruppo di compagni di allenamento (vedi sotto); alla registrazione si può solo verificare se un nome è già occupato.</li>
      <li><strong>Dati di esercizio:</strong> il registro dei tasti di ogni turno di esercizio concluso (come descritto sopra in <em>Registro dei tasti</em>) e il tuo livello di apprendimento per lingua e layout, oltre ai nomi e ai layout delle tue tastiere se ne hai create più di una. Le altre impostazioni restano su ciascun dispositivo.</li>
    </ul>
    <p>La base giuridica è l’esecuzione del rapporto di utilizzo che instauri con la registrazione (art. 6, par. 1, lett. b) GDPR, vedi le <a href="/nutzungsbedingungen">condizioni d’uso</a>); i registri degli accessi li trattiamo sulla base del nostro legittimo interesse a un servizio sicuro (art. 6, par. 1, lett. f) GDPR).</p>
    <p>Account e dati sono salvati presso Supabase (Supabase, Inc., USA), su server a Francoforte sul Meno (UE). Supabase tratta i dati come nostro responsabile del trattamento sulla base del suo accordo sul trattamento dei dati${accountMail.it.supabase} Nella misura in cui è possibile un accesso da paesi al di fuori dell’UE, ad esempio da parte di Supabase stessa o dei suoi sub-responsabili, questo è coperto dalle clausole contrattuali tipo dell’UE (art. 46, par. 2, lett. c) GDPR). Maggiori informazioni nell’<a href="https://supabase.com/privacy">informativa sulla privacy di Supabase</a>.</p>
    <p>Conserviamo i tuoi dati finché hai il tuo account. In <em>Impostazioni → Account → Elimina account</em> elimini subito il tuo account con tutti i dati di esercizio salvati; i dati sul tuo dispositivo restano finché non li cancelli tu. Se svuoti il registro in <em>Registro dei tasti ed esportazione</em> mentre hai effettuato l’accesso, viene cancellato anche nell’account. Supabase cancella automaticamente i registri degli accessi dopo poco tempo.</p>
    <p><strong>Compagni di allenamento (facoltativo):</strong> con un account puoi creare un piccolo gruppo (fino a 8 persone) e invitare amici con un link di invito. I membri di un gruppo vedono a vicenda il nome utente, l’obiettivo settimanale, in quanti giorni si sono esercitati nella settimana in corso, la serie in settimane e gli incoraggiamenti (👏) della settimana; la velocità media di digitazione solo se il membro sceglie di condividerla. Per questo salviamo il gruppo, chi ne fa parte, questi numeri settimanali e gli incoraggiamenti. Chi ha il link di invito vede, prima di entrare, il nome utente della persona che ha creato il gruppo e quanti membri ha. Gli altri non vedono mai il tuo registro dei tasti né il tuo indirizzo e-mail. La base giuridica è l’esecuzione del rapporto di utilizzo, poiché usi espressamente questa funzione (art. 6, par. 1, lett. b) GDPR). Se lasci il gruppo, ne vieni rimosso o elimini l’account, i tuoi numeri settimanali e gli incoraggiamenti in quel gruppo vengono cancellati subito.</p>
    <p><strong>Accesso con Google:</strong> se scegli «Continua con Google», vieni reindirizzato a Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlanda) per accedere lì. Google ci comunica poi il tuo indirizzo e-mail, il tuo nome e l’indirizzo della tua immagine del profilo; usiamo solo l’indirizzo e-mail e conserviamo il resto solo perché Supabase lo salva con l’accesso. Per l’accesso presso Google è responsabile Google stessa, vedi l’<a href="https://policies.google.com/privacy?hl=it">informativa sulla privacy di Google</a>. La base giuridica è l’art. 6, par. 1, lett. b) GDPR.</p>${accountMail.it.section}${captcha.section.it}${analytics.section.it}

    <h2>Hosting</h2>
    <p>Il sito viene distribuito tramite Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA). All’apertura, Cloudflare tratta i dati tecnicamente necessari perché la pagina ti arrivi e sia protetta dagli attacchi: il tuo indirizzo IP, data e ora, l’indirizzo richiesto e dati del tuo browser come tipo di browser e sistema operativo. La base giuridica è il nostro legittimo interesse a un sito sicuro e funzionante (art. 6, par. 1, lett. f) GDPR).</p>
    <p>Cloudflare agisce come nostro responsabile del trattamento sulla base del suo accordo sul trattamento dei dati. È possibile un trattamento negli USA; Cloudflare è certificata nell’ambito del Data Privacy Framework UE-USA, per il quale esiste una decisione di adeguatezza della Commissione europea (art. 45 GDPR). Noi non analizziamo i registri di accesso. Maggiori informazioni nell’<a href="https://www.cloudflare.com/privacypolicy/">informativa sulla privacy di Cloudflare</a>.</p>

    <h2>Contatto via e-mail</h2>
    <p>Se ci scrivi, usiamo il tuo indirizzo e-mail e il tuo messaggio solo per risponderti (art. 6, par. 1, lett. f) GDPR). Li cancelliamo una volta evasa la richiesta, salvo obblighi di legge di conservarli.</p>

    <h2>I tuoi diritti</h2>
    <p>Hai diritto di accesso, rettifica, cancellazione e limitazione del trattamento, alla portabilità dei dati e di opposizione (artt. da 15 a 21 GDPR). Basta scriverci un’e-mail. Se ritieni che trattiamo i tuoi dati in modo illecito, puoi presentare reclamo all’autorità austriaca per la protezione dei dati (Datenschutzbehörde): Barichgasse 40–42, 1030 Vienna, <a href="https://www.dsb.gv.at">www.dsb.gv.at</a>.</p>

    <h2>Modifiche</h2>
    <p>Se Keypacer riceve nuove funzioni che trattano dati o si avvale di un altro fornitore di servizi, aggiorneremo prima questa informativa.</p>`,
  pl: `
    <h2>W skrócie</h2>
    <p>Keypacer nie wymaga konta i nie używa plików cookie. ${analytics.short.pl}${captcha.short.pl} To, co ćwiczysz, zostaje w Twojej przeglądarce. Tylko jeśli dobrowolnie się zalogujesz, aby synchronizować postępy między urządzeniami, Twoje dane z ćwiczeń są przechowywane na serwerze w UE (zob. <em>Dobrowolne konto</em>).</p>

    <h2>Administrator danych</h2>
    <p>${name}<br>${town}, Austria<br>${mail}</p>

    <h2>Dane w Twojej przeglądarce</h2>
    <p>Aby trening działał, a Twoje postępy się nie gubiły, Keypacer zapisuje na Twoim urządzeniu, w pamięci lokalnej przeglądarki (localStorage i IndexedDB):</p>
    <ul>
      <li><strong>Ustawienia:</strong> układ klawiatury, język ćwiczeń i interfejsu, motyw kolorystyczny, pomoce przy pisaniu, czy konfiguracja jest zakończona i czy zamknięto jakiś komunikat, Twój cel tygodniowy, a jeśli używasz kilku klawiatur, ich nazwy i układy oraz to, która jest wybrana.</li>
      <li><strong>Stan nauki:</strong> które klawisze są odblokowane, które już opanowałeś(-aś) i jak daleko jesteś na ścieżce nauki, osobno dla każdego języka i układu.</li>
      <li><strong>Dziennik naciśnięć:</strong> dla każdego naciśnięcia w tekście ćwiczenia oczekiwany i wpisany znak, klawisz, czas od poprzedniego naciśnięcia, data i godzina oraz runda ćwiczeń, a jeśli w <em>Ustawienia → Klawiatury</em> dodałeś(-aś) kilka klawiatur, na której z nich pisałeś(-aś). Na tej podstawie Keypacer ustala Twoje słabe klawisze i kolejne ćwiczenia. Rejestrowane jest tylko to, co wpisujesz w polu ćwiczeń.</li>${analytics.stored.pl}
    </ul>
    <p>Bez konta dane te nie opuszczają Twojego urządzenia; nie otrzymujemy ich i nie możemy ich zobaczyć. Gdy jesteś zalogowany(-a), zapisywane są tu również Twoje logowanie (klucz dostępu, abyś pozostał(a) zalogowany(-a)) i stan ostatniej synchronizacji. Zapisywanie jest niezbędne do świadczenia usługi, z której wyraźnie korzystasz (§ 165 ust. 3 austriackiej ustawy o telekomunikacji z 2021 r., TKG 2021), dlatego nie wymaga zgody ani banera cookie.</p>
    <p>Masz kontrolę: w <em>Ustawienia → Dziennik naciśnięć i eksport</em> możesz przejrzeć dziennik, wyeksportować go jako JSON lub CSV i usunąć. Wszystko naraz usuniesz, czyszcząc w przeglądarce dane tej strony.</p>

    <h2>Dobrowolne konto i synchronizacja między urządzeniami</h2>
    <p>W <em>Ustawienia → Konto</em> możesz zalogować się ${accountMail.pl.methods}. Keypacer synchronizuje wtedy Twoje postępy między urządzeniami. W tym celu przetwarzamy:</p>
    <ul>
      <li><strong>Dane logowania:</strong> Twój adres e-mail, hasło (przechowywane wyłącznie jako nieodwracalny skrót), wewnętrzny identyfikator użytkownika, datę rejestracji i ostatniego logowania oraz techniczne dzienniki logowania (adres IP, dane przeglądarki, czas), które służą ochronie przed nadużyciami.</li>
      <li><strong>Nazwa użytkownika:</strong> ta, którą wybierasz przy rejestracji. Aplikacja wyświetla ją zamiast Twojego adresu e-mail. Inni użytkownicy widzą ją tylko wtedy, gdy dołączysz do grupy partnerów treningowych (zob. niżej); przy rejestracji można jedynie sprawdzić, czy nazwa jest już zajęta.</li>
      <li><strong>Dane z ćwiczeń:</strong> dziennik naciśnięć każdej ukończonej rundy ćwiczeń (jak opisano wyżej w sekcji <em>Dziennik naciśnięć</em>) i Twój stan nauki dla każdego języka i układu, a także nazwy i układy Twoich klawiatur, jeśli dodałeś(-aś) kilka. Pozostałe ustawienia zostają na danym urządzeniu.</li>
    </ul>
    <p>Podstawą prawną jest wykonanie umowy o korzystanie z usługi, którą zawierasz przy rejestracji (art. 6 ust. 1 lit. b RODO, zob. <a href="/nutzungsbedingungen">regulamin</a>); dzienniki logowania przetwarzamy na podstawie naszego prawnie uzasadnionego interesu w bezpiecznej usłudze (art. 6 ust. 1 lit. f RODO).</p>
    <p>Konta i dane są przechowywane w Supabase (Supabase, Inc., USA), na serwerach we Frankfurcie nad Menem (UE). Supabase przetwarza dane jako nasz podmiot przetwarzający na podstawie swojej umowy powierzenia przetwarzania danych${accountMail.pl.supabase} O ile możliwy jest dostęp z krajów spoza UE, np. przez samo Supabase lub jego podwykonawców, jest on zabezpieczony standardowymi klauzulami umownymi UE (art. 46 ust. 2 lit. c RODO). Więcej w <a href="https://supabase.com/privacy">polityce prywatności Supabase</a>.</p>
    <p>Przechowujemy Twoje dane, dopóki masz konto. W <em>Ustawienia → Konto → Usuń konto</em> natychmiast usuwasz konto wraz ze wszystkimi zapisanymi w nim danymi z ćwiczeń; dane na Twoim urządzeniu zostają, dopóki sam(a) ich nie usuniesz. Jeśli wyczyścisz dziennik w <em>Dziennik naciśnięć i eksport</em>, będąc zalogowanym(-ą), zostanie on usunięty także z konta. Dzienniki logowania Supabase usuwa automatycznie po krótkim czasie.</p>
    <p><strong>Partnerzy treningowi (dobrowolnie):</strong> mając konto, możesz założyć małą grupę (do 8 osób) i zaprosić znajomych linkiem z zaproszeniem. Członkowie grupy widzą nawzajem swoją nazwę użytkownika, cel tygodniowy, liczbę dni ćwiczeń w bieżącym tygodniu, serię w tygodniach i doping (👏) z danego tygodnia; średnią prędkość pisania tylko wtedy, gdy dany członek zdecyduje się ją udostępnić. W tym celu zapisujemy grupę, jej członków, te tygodniowe liczby i doping. Kto ma link z zaproszeniem, przed dołączeniem widzi nazwę użytkownika osoby, która założyła grupę, i liczbę jej członków. Inni nigdy nie widzą Twojego dziennika naciśnięć ani adresu e-mail. Podstawą prawną jest wykonanie umowy o korzystanie z usługi, ponieważ wyraźnie korzystasz z tej funkcji (art. 6 ust. 1 lit. b RODO). Gdy opuścisz grupę, zostaniesz z niej usunięty(-a) lub usuniesz konto, Twoje tygodniowe liczby i doping w tej grupie są natychmiast usuwane.</p>
    <p><strong>Logowanie przez Google:</strong> jeśli wybierzesz „Kontynuuj z Google”, zostaniesz przekierowany(-a) do Google (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlandia), aby się tam zalogować. Następnie Google przekazuje nam Twój adres e-mail, imię i nazwisko oraz adres zdjęcia profilowego; używamy tylko adresu e-mail, a resztę przechowujemy wyłącznie dlatego, że Supabase zapisuje ją razem z logowaniem. Za logowanie w Google odpowiada samo Google, zob. <a href="https://policies.google.com/privacy?hl=pl">politykę prywatności Google</a>. Podstawą prawną jest art. 6 ust. 1 lit. b RODO.</p>${accountMail.pl.section}${captcha.section.pl}${analytics.section.pl}

    <h2>Hosting</h2>
    <p>Strona jest dostarczana przez Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA). Przy jej otwarciu Cloudflare przetwarza dane technicznie niezbędne, aby strona do Ciebie dotarła i była chroniona przed atakami: Twój adres IP, datę i godzinę, żądany adres oraz dane przeglądarki, takie jak jej typ i system operacyjny. Podstawą prawną jest nasz prawnie uzasadniony interes w bezpiecznej i działającej stronie (art. 6 ust. 1 lit. f RODO).</p>
    <p>Cloudflare działa jako nasz podmiot przetwarzający na podstawie swojej umowy powierzenia przetwarzania danych. Możliwe jest przetwarzanie w USA; Cloudflare ma certyfikat w ramach EU-US Data Privacy Framework, dla którego Komisja Europejska wydała decyzję stwierdzającą odpowiedni stopień ochrony (art. 45 RODO). Sami nie analizujemy dzienników dostępu. Więcej w <a href="https://www.cloudflare.com/privacypolicy/">polityce prywatności Cloudflare</a>.</p>

    <h2>Kontakt e-mailowy</h2>
    <p>Jeśli do nas napiszesz, używamy Twojego adresu e-mail i wiadomości wyłącznie po to, by Ci odpowiedzieć (art. 6 ust. 1 lit. f RODO). Usuwamy je po załatwieniu sprawy, o ile przepisy nie wymagają ich przechowywania.</p>

    <h2>Twoje prawa</h2>
    <p>Masz prawo dostępu do danych, ich sprostowania, usunięcia i ograniczenia przetwarzania, prawo do przenoszenia danych i prawo sprzeciwu (art. 15–21 RODO). Wystarczy napisać do nas e-mail. Jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem, możesz złożyć skargę do austriackiego organu ochrony danych (Datenschutzbehörde): Barichgasse 40–42, 1030 Wiedeń, <a href="https://www.dsb.gv.at">www.dsb.gv.at</a>.</p>

    <h2>Zmiany</h2>
    <p>Jeśli Keypacer otrzyma nowe funkcje przetwarzające dane lub zacznie korzystać z innego usługodawcy, najpierw zaktualizujemy tę politykę.</p>`,
};

/**
 * Short terms for a free, private, non-commercial site under Austrian law.
 * They mainly matter for accounts: username rules, what happens on abuse,
 * and limited liability. Written with care, but not checked by a lawyer.
 */
const terms: Record<LegalLanguage, string> = {
  de: `
    <h2>Kurz gesagt</h2>
    <p>Keypacer ist kostenlos und ein privates Projekt. Üben kannst du ohne Konto und ohne diese Bedingungen zu lesen. Legst du ein Konto an, gelten sie zusätzlich: Wähle einen anständigen Benutzernamen, geh fair mit anderen um und lass den Dienst in Ruhe arbeiten. Wer dagegen verstößt, kann gesperrt werden.</p>

    <h2>1. Anbieter und Geltung</h2>
    <p>Keypacer wird von ${name}, ${town}, Österreich, betrieben (Kontakt: ${mail}). Diese Bedingungen gelten für die Nutzung der Website und besonders für das freiwillige Konto. Mit der Registrierung erklärst du dich mit ihnen einverstanden. Bist du jünger als 14 Jahre, brauchst du für ein Konto die Zustimmung deiner Eltern.</p>

    <h2>2. Kostenloser Dienst ohne Garantie</h2>
    <p>Keypacer kostet nichts und enthält keine Werbung. Wir bemühen uns, dass alles funktioniert, können aber nicht versprechen, dass die Website immer erreichbar und fehlerfrei ist oder dass deine Daten nie verloren gehen. Funktionen können sich ändern oder wegfallen. Sichere wichtige Daten über <em>Einstellungen → Tastenprotokoll und Export</em>. Keypacer ist ein Übungswerkzeug und kein Gesundheitsangebot: Wenn dir beim Tippen Hände, Arme oder Nacken wehtun, mach eine Pause und lass dich bei anhaltenden Beschwerden ärztlich beraten.</p>

    <h2>3. Dein Konto</h2>
    <p>Ein Konto ist für eine Person gedacht. Halte dein Passwort geheim und gib dein Konto nicht weiter. Du kannst es jederzeit unter <em>Einstellungen → Konto → Konto löschen</em> selbst löschen.</p>

    <h2>4. Benutzernamen</h2>
    <p>Dein Benutzername ist für deine Trainingspartner sichtbar. Er darf nicht</p>
    <ul>
      <li>beleidigend, bedrohend, diskriminierend, sexuell, gewaltverherrlichend oder sonst anstößig sein,</li>
      <li>vorgeben, eine andere Person, Keypacer selbst oder eine Organisation zu sein,</li>
      <li>Namens-, Marken- oder andere Rechte Dritter verletzen,</li>
      <li>Werbung, Links oder persönliche Daten anderer enthalten.</li>
    </ul>
    <p>Ein automatischer Filter blockiert manche Namen, er erkennt aber nicht alles. Ob ein Name passt, entscheiden im Zweifel wir.</p>

    <h2>5. Fair bleiben</h2>
    <p>Lade nur Leute in eine Gruppe von Trainingspartnern ein, die das auch wollen, und belästige niemanden, auch nicht über Anfeuerungen. Nicht erlaubt ist außerdem, Konten automatisch anzulegen, Schutzmaßnahmen oder Grenzen zu umgehen, auf fremde Daten zuzugreifen, den Dienst zu überlasten oder ihn anders als vorgesehen zu nutzen. Wenn du Missbrauch bemerkst, schreib uns an ${mail}.</p>

    <h2>6. Sperren und Löschen bei Verstößen</h2>
    <p>Verstößt jemand gegen diese Bedingungen, können wir je nach Schwere einen Benutzernamen zurücksetzen, die Person aus Gruppen entfernen, das Konto vorübergehend sperren oder es löschen. Meistens melden wir uns vorher per E-Mail und geben dir Gelegenheit, dich zu äußern; bei schweren Verstößen oder Gefahr für andere oder den Dienst handeln wir sofort. Wenn du eine Sperre für falsch hältst, schreib uns.</p>

    <h2>7. Haftung</h2>
    <p>Da Keypacer unentgeltlich ist, haften wir nur für Schäden, die wir vorsätzlich oder grob fahrlässig verursachen. Für Personenschäden haften wir nach den gesetzlichen Bestimmungen. Für die Inhalte verlinkter Websites sind deren Betreiber verantwortlich.</p>

    <h2>8. Ende des Dienstes</h2>
    <p>Wir können Keypacer oder das Konto-Angebot einstellen. Konten löschen wir in diesem Fall frühestens 30 Tage nach einer Ankündigung per E-Mail, damit du deine Daten vorher exportieren kannst.</p>

    <h2>9. Änderungen dieser Bedingungen</h2>
    <p>Wir können diese Bedingungen ändern, etwa wenn neue Funktionen dazukommen. Wesentliche Änderungen kündigen wir Kontoinhabern vorher per E-Mail oder in der App an. Wenn du nicht einverstanden bist, kannst du dein Konto löschen.</p>

    <h2>10. Anwendbares Recht</h2>
    <p>Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts und der Verweisungsnormen. Wenn du Verbraucher bist, behältst du den Schutz der zwingenden Bestimmungen des Landes, in dem du lebst.</p>`,
  en: `
    <h2>In short</h2>
    <p>Keypacer is free and a private project. You can practise without an account and without reading these terms. If you create an account, they apply as well: choose a decent username, treat others fairly and leave the service alone to do its job. Anyone who breaks these rules can be suspended.</p>

    <h2>1. Provider and scope</h2>
    <p>Keypacer is run by ${name}, ${town}, Austria (contact: ${mail}). These terms apply to using the website and in particular to the optional account. By signing up you agree to them. If you are under 14, you need your parents' permission for an account.</p>

    <h2>2. A free service without guarantees</h2>
    <p>Keypacer costs nothing and has no ads. We try to keep everything working, but cannot promise that the website is always available and free of errors, or that your data is never lost. Features may change or be removed. Keep a copy of important data via <em>Settings → Keystroke log and export</em>. Keypacer is a practice tool, not a health service: if your hands, arms or neck hurt while typing, take a break, and see a doctor if the pain persists.</p>

    <h2>3. Your account</h2>
    <p>An account is meant for one person. Keep your password secret and do not share your account. You can delete it yourself at any time under <em>Settings → Account → Delete account</em>.</p>

    <h2>4. Usernames</h2>
    <p>Your training buddies can see your username. It must not</p>
    <ul>
      <li>be insulting, threatening, discriminatory, sexual, glorify violence or be otherwise offensive,</li>
      <li>pretend to be another person, Keypacer itself or an organisation,</li>
      <li>infringe the name, trademark or other rights of others,</li>
      <li>contain advertising, links or other people's personal data.</li>
    </ul>
    <p>An automatic filter blocks some names, but it does not catch everything. When in doubt, we decide whether a name is acceptable.</p>

    <h2>5. Play fair</h2>
    <p>Only invite people into a group of training buddies who want to be there, and do not harass anyone, including through cheers. It is also not allowed to create accounts automatically, get around protections or limits, access other people's data, overload the service or use it in ways it is not meant for. If you notice abuse, write to us at ${mail}.</p>

    <h2>6. Suspension and deletion</h2>
    <p>If someone breaks these terms, depending on how serious it is, we may reset their username, remove them from groups, suspend the account for a while or delete it. Usually we contact you by e-mail first and give you a chance to respond; for serious breaches or where others or the service are at risk, we act straight away. If you think a suspension is wrong, write to us.</p>

    <h2>7. Liability</h2>
    <p>As Keypacer is free of charge, we are only liable for damage we cause intentionally or through gross negligence. Liability for personal injury follows the law. The operators of linked websites are responsible for their content.</p>

    <h2>8. End of the service</h2>
    <p>We may shut down Keypacer or the account service. In that case we delete accounts no sooner than 30 days after announcing it by e-mail, so you can export your data first.</p>

    <h2>9. Changes to these terms</h2>
    <p>We may change these terms, for example when new features are added. We announce significant changes to account holders in advance by e-mail or in the app. If you do not agree, you can delete your account.</p>

    <h2>10. Governing law</h2>
    <p>Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods and conflict-of-law rules. If you are a consumer, you keep the protection of the mandatory laws of the country where you live.</p>`,
  fr: `
    <h2>En bref</h2>
    <p>Keypacer est gratuit et c’est un projet privé. Tu peux t’entraîner sans compte et sans lire ces conditions. Si tu crées un compte, elles s’appliquent en plus : choisis un nom d’utilisateur correct, sois fair-play avec les autres et laisse le service faire son travail tranquillement. Quiconque enfreint ces règles peut être suspendu.</p>

    <h2>1. Prestataire et champ d’application</h2>
    <p>Keypacer est exploité par ${name}, ${town}, Autriche (contact : ${mail}). Ces conditions s’appliquent à l’utilisation du site et en particulier au compte facultatif. En t’inscrivant, tu les acceptes. Si tu as moins de 14 ans, il te faut l’accord de tes parents pour un compte.</p>

    <h2>2. Un service gratuit sans garantie</h2>
    <p>Keypacer ne coûte rien et ne contient pas de publicité. Nous faisons en sorte que tout fonctionne, mais ne pouvons pas promettre que le site soit toujours accessible et sans erreurs, ni que tes données ne soient jamais perdues. Des fonctions peuvent changer ou disparaître. Sauvegarde tes données importantes via <em>Réglages → Journal des frappes et export</em>. Keypacer est un outil d’entraînement, pas un service de santé : si tes mains, tes bras ou ta nuque te font mal en tapant, fais une pause et consulte un médecin si la douleur persiste.</p>

    <h2>3. Ton compte</h2>
    <p>Un compte est destiné à une seule personne. Garde ton mot de passe secret et ne partage pas ton compte. Tu peux le supprimer toi-même à tout moment sous <em>Réglages → Compte → Supprimer le compte</em>.</p>

    <h2>4. Noms d’utilisateur</h2>
    <p>Ton nom d’utilisateur est visible par tes partenaires d’entraînement. Il ne doit pas</p>
    <ul>
      <li>être insultant, menaçant, discriminatoire, sexuel, glorifier la violence ou être choquant d’une autre manière,</li>
      <li>prétendre être une autre personne, Keypacer lui-même ou une organisation,</li>
      <li>porter atteinte au nom, à une marque ou à d’autres droits de tiers,</li>
      <li>contenir de la publicité, des liens ou des données personnelles d’autres personnes.</li>
    </ul>
    <p>Un filtre automatique bloque certains noms, mais il ne détecte pas tout. En cas de doute, c’est nous qui décidons si un nom convient.</p>

    <h2>5. Reste fair-play</h2>
    <p>N’invite dans un groupe de partenaires d’entraînement que des personnes qui le souhaitent, et ne harcèle personne, y compris par des encouragements. Il est également interdit de créer des comptes automatiquement, de contourner des protections ou des limites, d’accéder aux données d’autrui, de surcharger le service ou de l’utiliser autrement que prévu. Si tu remarques un abus, écris-nous à ${mail}.</p>

    <h2>6. Suspension et suppression en cas d’infraction</h2>
    <p>Si quelqu’un enfreint ces conditions, nous pouvons, selon la gravité, réinitialiser un nom d’utilisateur, retirer la personne de groupes, suspendre temporairement le compte ou le supprimer. La plupart du temps, nous te contactons d’abord par e-mail et te donnons l’occasion de t’expliquer ; en cas d’infraction grave ou de danger pour d’autres ou pour le service, nous agissons immédiatement. Si tu penses qu’une suspension est injustifiée, écris-nous.</p>

    <h2>7. Responsabilité</h2>
    <p>Keypacer étant gratuit, nous ne sommes responsables que des dommages que nous causons intentionnellement ou par négligence grave. Pour les dommages corporels, notre responsabilité est engagée conformément à la loi. Les exploitants des sites liés sont responsables de leur contenu.</p>

    <h2>8. Fin du service</h2>
    <p>Nous pouvons arrêter Keypacer ou l’offre de comptes. Dans ce cas, nous supprimons les comptes au plus tôt 30 jours après l’avoir annoncé par e-mail, afin que tu puisses exporter tes données avant.</p>

    <h2>9. Modification de ces conditions</h2>
    <p>Nous pouvons modifier ces conditions, par exemple lorsque de nouvelles fonctions sont ajoutées. Nous annonçons à l’avance les modifications importantes aux titulaires de compte par e-mail ou dans l’application. Si tu n’es pas d’accord, tu peux supprimer ton compte.</p>

    <h2>10. Droit applicable</h2>
    <p>Le droit autrichien s’applique, à l’exclusion de la Convention des Nations unies sur les contrats de vente internationale de marchandises et des règles de conflit de lois. Si tu es consommateur, tu conserves la protection des dispositions impératives du pays où tu vis.</p>`,
  es: `
    <h2>En resumen</h2>
    <p>Keypacer es gratuito y un proyecto privado. Puedes practicar sin cuenta y sin leer estas condiciones. Si creas una cuenta, se aplican además: elige un nombre de usuario decente, trata a los demás con respeto y deja que el servicio haga su trabajo. Quien las incumpla puede ser bloqueado.</p>

    <h2>1. Proveedor y ámbito de aplicación</h2>
    <p>Keypacer lo gestiona ${name}, ${town}, Austria (contacto: ${mail}). Estas condiciones se aplican al uso del sitio web y, en particular, a la cuenta opcional. Al registrarte, las aceptas. Si tienes menos de 14 años, necesitas el permiso de tus padres para tener una cuenta.</p>

    <h2>2. Un servicio gratuito sin garantías</h2>
    <p>Keypacer no cuesta nada y no tiene publicidad. Nos esforzamos para que todo funcione, pero no podemos prometer que el sitio esté siempre disponible y sin errores, ni que tus datos nunca se pierdan. Las funciones pueden cambiar o desaparecer. Guarda una copia de tus datos importantes en <em>Ajustes → Registro de pulsaciones y exportación</em>. Keypacer es una herramienta de práctica, no un servicio de salud: si te duelen las manos, los brazos o la nuca al escribir, haz una pausa y consulta a un médico si las molestias persisten.</p>

    <h2>3. Tu cuenta</h2>
    <p>Una cuenta es para una sola persona. Mantén tu contraseña en secreto y no compartas tu cuenta. Puedes eliminarla tú mismo en cualquier momento en <em>Ajustes → Cuenta → Eliminar cuenta</em>.</p>

    <h2>4. Nombres de usuario</h2>
    <p>Tus compañeros de entrenamiento pueden ver tu nombre de usuario. No debe</p>
    <ul>
      <li>ser insultante, amenazante, discriminatorio, sexual, glorificar la violencia ni ser ofensivo de otro modo,</li>
      <li>hacerse pasar por otra persona, por Keypacer o por una organización,</li>
      <li>vulnerar derechos de nombre, de marca u otros derechos de terceros,</li>
      <li>contener publicidad, enlaces ni datos personales de otras personas.</li>
    </ul>
    <p>Un filtro automático bloquea algunos nombres, pero no lo detecta todo. En caso de duda, decidimos nosotros si un nombre es aceptable.</p>

    <h2>5. Juega limpio</h2>
    <p>Invita a un grupo de compañeros de entrenamiento solo a quien quiera estar en él, y no acoses a nadie, tampoco mediante ánimos. Tampoco está permitido crear cuentas de forma automática, eludir protecciones o límites, acceder a datos ajenos, sobrecargar el servicio ni usarlo de forma distinta a la prevista. Si detectas un abuso, escríbenos a ${mail}.</p>

    <h2>6. Bloqueo y eliminación por infracciones</h2>
    <p>Si alguien incumple estas condiciones, según la gravedad podemos restablecer su nombre de usuario, sacarlo de grupos, bloquear la cuenta temporalmente o eliminarla. Normalmente te contactamos antes por correo electrónico y te damos la oportunidad de explicarte; en caso de infracciones graves o de peligro para otras personas o para el servicio, actuamos de inmediato. Si crees que un bloqueo es injusto, escríbenos.</p>

    <h2>7. Responsabilidad</h2>
    <p>Como Keypacer es gratuito, solo respondemos de los daños que causemos con dolo o negligencia grave. De los daños personales respondemos conforme a la ley. Los operadores de los sitios web enlazados son responsables de su contenido.</p>

    <h2>8. Fin del servicio</h2>
    <p>Podemos cerrar Keypacer o el servicio de cuentas. En ese caso, eliminaremos las cuentas como pronto 30 días después de anunciarlo por correo electrónico, para que puedas exportar tus datos antes.</p>

    <h2>9. Cambios en estas condiciones</h2>
    <p>Podemos modificar estas condiciones, por ejemplo cuando se añadan nuevas funciones. Anunciaremos con antelación los cambios importantes a los titulares de cuentas por correo electrónico o en la aplicación. Si no estás de acuerdo, puedes eliminar tu cuenta.</p>

    <h2>10. Ley aplicable</h2>
    <p>Se aplica el derecho austriaco, con exclusión de la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías y de las normas de conflicto. Si eres consumidor, conservas la protección de las disposiciones imperativas del país en el que vives.</p>`,
  it: `
    <h2>In breve</h2>
    <p>Keypacer è gratuito ed è un progetto privato. Puoi esercitarti senza account e senza leggere queste condizioni. Se crei un account, valgono anche queste: scegli un nome utente decoroso, comportati correttamente con gli altri e lascia che il servizio faccia il suo lavoro. Chi le viola può essere sospeso.</p>

    <h2>1. Fornitore e ambito di applicazione</h2>
    <p>Keypacer è gestito da ${name}, ${town}, Austria (contatto: ${mail}). Queste condizioni valgono per l’uso del sito e in particolare per l’account facoltativo. Registrandoti le accetti. Se hai meno di 14 anni, per un account ti serve il consenso dei tuoi genitori.</p>

    <h2>2. Un servizio gratuito senza garanzie</h2>
    <p>Keypacer non costa nulla e non contiene pubblicità. Facciamo il possibile perché tutto funzioni, ma non possiamo promettere che il sito sia sempre raggiungibile e privo di errori, né che i tuoi dati non vadano mai persi. Le funzioni possono cambiare o essere rimosse. Salva i dati importanti tramite <em>Impostazioni → Registro dei tasti ed esportazione</em>. Keypacer è uno strumento di esercizio, non un servizio sanitario: se mentre digiti ti fanno male mani, braccia o collo, fai una pausa e, se il disturbo persiste, rivolgiti a un medico.</p>

    <h2>3. Il tuo account</h2>
    <p>Un account è pensato per una sola persona. Tieni segreta la password e non condividere l’account. Puoi eliminarlo tu stesso in qualsiasi momento in <em>Impostazioni → Account → Elimina account</em>.</p>

    <h2>4. Nomi utente</h2>
    <p>Il tuo nome utente è visibile ai tuoi compagni di allenamento. Non deve</p>
    <ul>
      <li>essere offensivo, minaccioso, discriminatorio, sessuale, esaltare la violenza o essere altrimenti sconveniente,</li>
      <li>spacciarsi per un’altra persona, per Keypacer stesso o per un’organizzazione,</li>
      <li>violare diritti al nome, marchi o altri diritti di terzi,</li>
      <li>contenere pubblicità, link o dati personali di altre persone.</li>
    </ul>
    <p>Un filtro automatico blocca alcuni nomi, ma non riconosce tutto. Nel dubbio, decidiamo noi se un nome è accettabile.</p>

    <h2>5. Comportati correttamente</h2>
    <p>Invita in un gruppo di compagni di allenamento solo persone che lo desiderano e non molestare nessuno, nemmeno con gli incoraggiamenti. Non è inoltre consentito creare account in modo automatico, aggirare protezioni o limiti, accedere ai dati altrui, sovraccaricare il servizio o usarlo in modo diverso da quello previsto. Se noti un abuso, scrivici a ${mail}.</p>

    <h2>6. Sospensione e cancellazione in caso di violazioni</h2>
    <p>Se qualcuno viola queste condizioni, a seconda della gravità possiamo reimpostare il nome utente, rimuovere la persona dai gruppi, sospendere temporaneamente l’account o eliminarlo. Di solito ti contattiamo prima via e-mail e ti diamo modo di esprimerti; in caso di violazioni gravi o di pericolo per altri o per il servizio, interveniamo subito. Se ritieni che una sospensione sia sbagliata, scrivici.</p>

    <h2>7. Responsabilità</h2>
    <p>Poiché Keypacer è gratuito, rispondiamo solo dei danni causati con dolo o colpa grave. Per i danni alla persona rispondiamo secondo le disposizioni di legge. Dei contenuti dei siti collegati sono responsabili i rispettivi gestori.</p>

    <h2>8. Fine del servizio</h2>
    <p>Possiamo chiudere Keypacer o il servizio di account. In tal caso eliminiamo gli account non prima di 30 giorni dall’annuncio via e-mail, così puoi esportare prima i tuoi dati.</p>

    <h2>9. Modifiche a queste condizioni</h2>
    <p>Possiamo modificare queste condizioni, ad esempio quando si aggiungono nuove funzioni. Le modifiche sostanziali le annunciamo in anticipo ai titolari di account via e-mail o nell’app. Se non sei d’accordo, puoi eliminare il tuo account.</p>

    <h2>10. Legge applicabile</h2>
    <p>Si applica il diritto austriaco, con esclusione della Convenzione delle Nazioni Unite sui contratti di compravendita internazionale di merci e delle norme di conflitto. Se sei un consumatore, mantieni la tutela delle disposizioni imperative del paese in cui vivi.</p>`,
  pl: `
    <h2>W skrócie</h2>
    <p>Keypacer jest darmowy i jest prywatnym projektem. Możesz ćwiczyć bez konta i bez czytania tego regulaminu. Jeśli założysz konto, obowiązuje on dodatkowo: wybierz przyzwoitą nazwę użytkownika, traktuj innych uczciwie i nie przeszkadzaj usłudze w działaniu. Kto łamie te zasady, może zostać zablokowany.</p>

    <h2>1. Usługodawca i zakres</h2>
    <p>Operatorem Keypacer jest ${name}, ${town}, Austria (kontakt: ${mail}). Regulamin dotyczy korzystania ze strony, a w szczególności dobrowolnego konta. Rejestrując się, akceptujesz go. Jeśli masz mniej niż 14 lat, do założenia konta potrzebujesz zgody rodziców.</p>

    <h2>2. Darmowa usługa bez gwarancji</h2>
    <p>Keypacer nic nie kosztuje i nie zawiera reklam. Staramy się, aby wszystko działało, ale nie możemy obiecać, że strona będzie zawsze dostępna i wolna od błędów ani że Twoje dane nigdy nie zginą. Funkcje mogą się zmieniać lub znikać. Ważne dane zabezpieczaj przez <em>Ustawienia → Dziennik naciśnięć i eksport</em>. Keypacer jest narzędziem do ćwiczeń, a nie usługą zdrowotną: jeśli przy pisaniu bolą Cię dłonie, ręce lub kark, zrób przerwę, a przy utrzymujących się dolegliwościach skonsultuj się z lekarzem.</p>

    <h2>3. Twoje konto</h2>
    <p>Konto jest przeznaczone dla jednej osoby. Zachowaj hasło w tajemnicy i nie udostępniaj konta innym. Możesz je w każdej chwili usunąć samodzielnie w <em>Ustawienia → Konto → Usuń konto</em>.</p>

    <h2>4. Nazwy użytkowników</h2>
    <p>Twoją nazwę użytkownika widzą Twoi partnerzy treningowi. Nie może ona</p>
    <ul>
      <li>być obraźliwa, zawierać gróźb, dyskryminować, mieć charakteru seksualnego, gloryfikować przemocy ani być w inny sposób niestosowna,</li>
      <li>podszywać się pod inną osobę, sam Keypacer ani organizację,</li>
      <li>naruszać praw do nazwiska, znaków towarowych ani innych praw osób trzecich,</li>
      <li>zawierać reklam, linków ani danych osobowych innych osób.</li>
    </ul>
    <p>Automatyczny filtr blokuje niektóre nazwy, ale nie wykrywa wszystkiego. W razie wątpliwości to my decydujemy, czy nazwa jest dopuszczalna.</p>

    <h2>5. Graj fair</h2>
    <p>Zapraszaj do grupy partnerów treningowych tylko osoby, które tego chcą, i nikogo nie nękaj, również za pomocą dopingu. Niedozwolone jest także automatyczne zakładanie kont, obchodzenie zabezpieczeń lub limitów, dostęp do cudzych danych, przeciążanie usługi lub korzystanie z niej niezgodnie z przeznaczeniem. Jeśli zauważysz nadużycie, napisz do nas na ${mail}.</p>

    <h2>6. Blokada i usunięcie w razie naruszeń</h2>
    <p>Jeśli ktoś narusza ten regulamin, w zależności od wagi naruszenia możemy zresetować nazwę użytkownika, usunąć tę osobę z grup, tymczasowo zablokować konto lub je usunąć. Zazwyczaj najpierw kontaktujemy się e-mailem i dajemy możliwość wyjaśnień; przy poważnych naruszeniach lub zagrożeniu dla innych bądź dla usługi działamy natychmiast. Jeśli uważasz, że blokada jest niesłuszna, napisz do nas.</p>

    <h2>7. Odpowiedzialność</h2>
    <p>Ponieważ Keypacer jest bezpłatny, odpowiadamy tylko za szkody wyrządzone umyślnie lub przez rażące niedbalstwo. Za szkody na osobie odpowiadamy zgodnie z przepisami prawa. Za treść stron, do których prowadzą linki, odpowiadają ich operatorzy.</p>

    <h2>8. Zakończenie usługi</h2>
    <p>Możemy zakończyć działanie Keypacer lub oferty kont. W takim przypadku usuniemy konta najwcześniej 30 dni po ogłoszeniu tego e-mailem, abyś mógł (mogła) wcześniej wyeksportować swoje dane.</p>

    <h2>9. Zmiany regulaminu</h2>
    <p>Możemy zmieniać ten regulamin, np. gdy dojdą nowe funkcje. O istotnych zmianach informujemy posiadaczy kont z wyprzedzeniem e-mailem lub w aplikacji. Jeśli się nie zgadzasz, możesz usunąć konto.</p>

    <h2>10. Prawo właściwe</h2>
    <p>Obowiązuje prawo austriackie z wyłączeniem Konwencji Narodów Zjednoczonych o umowach międzynarodowej sprzedaży towarów oraz norm kolizyjnych. Jeśli jesteś konsumentem, zachowujesz ochronę wynikającą z bezwzględnie obowiązujących przepisów kraju, w którym mieszkasz.</p>`,
};

/** The body of a legal page as HTML. Only OWNER values are interpolated, and they are escaped. */
export function legalHtml(page: LegalPage, lang: LegalLanguage): string {
  return { imprint, privacy, terms }[page][lang];
}
