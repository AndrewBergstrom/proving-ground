/* Supabase config for cross-device sync (optional).
 *
 * Fill these in from your Supabase project: Settings -> API.
 * The anon (public) key is SAFE to expose in client code; access is
 * restricted by Row Level Security so a user can only read/write their
 * own progress row.
 *
 * Leave both blank to run the app in LOCAL-ONLY mode: no login, progress
 * saved per-device in the browser (exactly the pre-sync behavior).
 */
window.PG_CONFIG = {
  SUPABASE_URL: "https://wohlbejcuflznilmbtgx.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_VAf7cj0iQBuaqa0uirA2eg_vRwNLZ5A",

  // Social sign-in buttons to show. List ONLY providers you have actually
  // enabled in Supabase (Authentication -> Providers) and created an OAuth
  // app for. A button for a provider that isn't enabled will error on click.
  // Supported: "github", "google", "apple", "facebook". Email link always works.
  OAUTH_PROVIDERS: ["github", "google"],

  // Compiled-language code judge (optional). URL of your self-hosted Judge0
  // edge (see judge/RUNBOOK.md). BLANK = feature OFF: only the in-browser
  // languages (JavaScript, Python) run, exactly as before. When set, problems
  // that provide solutions in compiled languages show them in the selector and
  // run on the judge.
  JUDGE_URL: "",

  // Which compiled languages to offer, if JUDGE_URL is set and a problem
  // supports them. Order is the display order.
  REMOTE_LANGS: ["java", "csharp", "cpp", "go", "rust"]
};
