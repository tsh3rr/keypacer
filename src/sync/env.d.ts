/** Supabase project URL and publishable key, picked per branch in vite.config.ts. */
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_KEY__: string;
/** Cloudflare Turnstile site key, or '' when the captcha is off (vite.config.ts). */
declare const __TURNSTILE_SITE_KEY__: string;
/** Whether the Supabase project sends e-mail (code sign-in, password reset), picked per branch in vite.config.ts. */
declare const __EMAIL_LINKS__: boolean;
