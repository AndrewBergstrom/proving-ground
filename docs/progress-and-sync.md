# Progress and sync

How Proving Ground tracks what you have learned, why leaving mid-lesson resets it, and how optional sign-in syncs progress across devices.

[Back to the docs index](../README.md#documentation)

## Contents

- [Finish-or-restart model](#finish-or-restart-model)
- [Durable vs session state](#durable-vs-session-state)
- [Spaced repetition](#spaced-repetition)
- [Accounts and sync](#accounts-and-sync)
- [Security](#security)

## Finish-or-restart model

A **lesson** is Learn + Practice + Quiz. The rule:

> Finish the whole lesson in one sitting, or that module resets to the start.

Nothing partial is saved. If you complete Learn and Practice but leave before the Quiz, the module is back to zero on reload. This is a deliberate anti-distraction, study-it-through habit mechanic, not a bug.

When you pass a lesson:

- The module is marked **completed** (durably, forever).
- Its recall cards are seeded into the spaced-repetition schedule.
- **Reinforce** unlocks (it is locked until the lesson is done, and it persists across sessions because review is a multi-day process).

Track readiness meters and the overall readiness ring in the topbar are simply completed modules over total.

## Durable vs session state

State is split into two halves with very different lifetimes. This split is the mechanism behind finish-or-restart.

**Durable** (persists to `localStorage` under the key `pg.v3`, and syncs if signed in):

```js
{
  completed: { [moduleId]: true },   // finished lessons, forever
  cards:     { ... },                // spaced-repetition schedule
  lang:      "js"                     // last-used coder language
}
```

**Session** (in-memory only, resets on reload):

```js
{
  learned:    {},   // Learn step marked read
  solved:     {},   // problems passed this session
  code:       {},   // editor contents, keyed "<lang>:<problemId>"
  quiz:       {},   // quiz answers
  decompDone: [],   // decomposition prompts reviewed
  rag:        {},   // framework stages ticked
  builds:     {},   // build self-scores
  deck:       {}    // cards reviewed this session
}
```

Because the in-progress signals live only in memory, a reload wipes an unfinished lesson while keeping everything you have genuinely completed.

## Spaced repetition

Reinforce is a lightweight, box-style scheduler. Recall cards from completed lessons are reviewed on expanding intervals:

```js
INTERVALS = [0, 1, 3, 7, 16, 35]   // days
```

Grading a card well advances it to the next interval; missing it sends it back so it returns sooner. Because the schedule is durable, review spans days and survives reloads and sign-outs. The DSA Pattern Recognition module uses the full 25-card `PATTERNS` deck as its persistent Reinforce deck.

## Accounts and sync

Sign-in is **optional**. With no account, progress is saved per-device in `localStorage` and the app is fully functional. Signing in adds cross-device sync.

- **Backend:** [Supabase](https://supabase.com) (hosted Postgres + Auth). The client loads `@supabase/supabase-js` from a CDN; the app still deploys as a pure static site.
- **Sign-in methods:** email magic link, plus GitHub and Google OAuth. Which social buttons appear is driven by `PG_CONFIG.OAUTH_PROVIDERS`.
- **Sync behavior:** on sign-in, remote progress is pulled and merged with local (union of completed modules; per-card, keep the more mature or more recent schedule), pushed back, then debounce-synced on every durable change.
- **Schema:** `supabase/schema.sql` defines a `progress` table (`user_id`, `completed`, `cards`, `lang`, `updated_at`) with row-level-security policies so each user can read and write only their own row.

Configuration lives in `assets/config.js`:

```js
window.PG_CONFIG = {
  SUPABASE_URL: "https://<project>.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_...",
  OAUTH_PROVIDERS: ["github", "google"]
};
```

Leaving `SUPABASE_URL` / `SUPABASE_ANON_KEY` blank runs the app in local-only mode with no sign-in, exactly as before sync existed.

## Security

- **PKCE OAuth flow.** The Supabase client uses `flowType: "pkce"`, so an OAuth return carries only a single-use `?code=`, never access or refresh tokens in the URL.
- **Public keys only in client code.** The Supabase anon/publishable key is safe to expose because row-level security restricts every read and write to the signed-in user's own row. Never put a service-role key, an OAuth client secret, or a database password in client code.
- **Session handling.** On an OAuth return the app only signs the user in and never clobbers an established session with a null result while the URL token is still being processed.

For the compiled-language judge's separate security model (untrusted code execution), see [Code judge](code-judge.md) and [`judge/RUNBOOK.md`](../judge/RUNBOOK.md).
