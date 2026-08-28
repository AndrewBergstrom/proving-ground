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
  SUPABASE_ANON_KEY: "sb_publishable_VAf7cj0iQBuaqa0uirA2eg_vRwNLZ5A"
};
