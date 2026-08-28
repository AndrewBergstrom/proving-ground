# Architecture

How Proving Ground is built and why. For the data structures behind the content, see [Content model](content-model.md). To run and test it, see [Development](development.md).

[Back to the docs index](../README.md#documentation)

## Contents

- [System overview](#system-overview)
- [File layout](#file-layout)
- [Load order](#load-order)
- [The module engine](#the-module-engine)
- [Rendering and views](#rendering-and-views)
- [The coding playground](#the-coding-playground)
- [Design constraints](#design-constraints)

## System overview

Proving Ground is a **zero-dependency static site**: plain HTML, CSS, and vanilla JavaScript with no build step, no framework, and no bundler. The browser is the runtime. Everything the user does happens client-side, with two optional server touchpoints:

1. **Supabase** for account sign-in and cross-device progress sync (optional; blank config = local-only).
2. **A self-hosted Judge0** for compiled-language code execution (optional; blank config = in-browser languages only).

Both are feature-gated on config values, so the default checkout runs as a fully local, backend-free app.

The design splits cleanly into a **content layer** (data) and an **engine** (behavior):

```
assets/data.js    all content: tracks, modules, problems, builds, decks
        |            (pure data, no logic)
        v
assets/app.js     the engine: routing, rendering, the 4-step loop,
                    progress, the coders, auth, sync
```

This separation is deliberate: adding a track or a problem is a data edit, not a code change. See [Content model](content-model.md).

## File layout

```
index.html            shell: topbar, <main id="app">, footer, script tags
privacy.html          privacy policy (for OAuth consent + users)
terms.html            terms of service
vercel.json           { "cleanUrls": true }

assets/
  config.js           Supabase + judge config (feature flags)
  data.js             content layer (see Content model)
  app.js              the engine
  judge.js            compiled-language judge client (optional feature)
  styles.css          cool-neutral + ember design system

supabase/
  schema.sql          progress table + row-level-security policies

judge/                self-hosting stack for the code judge (see judge/RUNBOOK.md)

docs/                 this documentation
```

## Load order

`index.html` loads scripts in this exact order, which matters:

```html
<script src="assets/config.js"></script>                     <!-- window.PG_CONFIG -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/data.js"></script>                       <!-- TRACKS, MODULES, ... -->
<script src="assets/judge.js"></script>                      <!-- window.PGJudge -->
<script src="assets/app.js"></script>                        <!-- boots the app -->
```

`config.js` defines globals before anything reads them. `data.js` declares the content as top-level `var`s. `judge.js` exposes `window.PGJudge` and no-ops when the judge is not configured. `app.js` runs last and immediately renders plus initializes auth.

Two more libraries load lazily, on demand, only the first time they are needed:

- **Pyodide** (`v0.26.4`, from jsDelivr) for running Python, in a dedicated Web Worker.
- **sql.js** (`@1`, from jsDelivr) for running SQL against an in-browser SQLite database.

## The module engine

Every module, in every track, runs the same four-step loop:

```
Learn  ->  Practice  ->  Quiz  ->  Reinforce
```

- **Learn** - an intro, a set of teaching points, an optional code template, and an optional worked example.
- **Practice** - one of several practice types (a coding playground, a SQL playground, a decomposition drill, a self-scored build, a framework checklist, or a review deck). See [Practice types](content-model.md#practice-types).
- **Quiz** - multiple-choice questions, optionally including a live coding check or SQL check.
- **Reinforce** - spaced-repetition flashcards seeded when the lesson is completed.

A **lesson** is defined as Learn + Practice + Quiz. Finishing all three marks the module complete (durably), seeds its recall cards into the spaced-repetition schedule, and unlocks Reinforce. Leaving mid-lesson resets that module. The rationale and exact state model are in [Progress and sync](progress-and-sync.md).

## Rendering and views

`app.js` keeps a tiny view object and re-renders on navigation:

```js
var view = { name: "home", track: null, module: null, step: "learn" };
```

- `render()` swaps `#app`'s content based on `view.name` (`home`, `track`, or `module`).
- Inside a module, `renderStep()` dispatches to `renderLearn`, `renderPractice`, `renderQuiz`, or `renderReinforce`.
- `go(patch)` merges fields into `view` and re-renders. Navigation is click-driven via `data-track`, `data-module`, and `data-nav` attributes wired after each render.

There is no client-side router or history integration; it is a single-page view machine driven entirely by in-memory state plus `localStorage`.

## The coding playground

The playground (`mountCoder`) is language-aware:

- **JavaScript** runs in a sandboxed **Web Worker** (no DOM, terminated on timeout).
- **Python** runs in a dedicated **Pyodide Web Worker**, loaded once and reused, with an 8-second per-run timeout that terminates and recreates the worker if user code hangs.
- **SQL** runs via **sql.js** (SQLite compiled to WebAssembly) against a small sample dataset, through a separate `mountSqlCoder`.
- **Compiled languages** (Java, C#, C++, Go, Rust) route to the optional self-hosted judge via `window.PGJudge`. See [Code judge](code-judge.md).

Every runner returns the same result shape, so the results UI (`renderResults`) is language-agnostic.

## Design constraints

These are load-bearing rules, not preferences:

- **No `package.json`.** Its presence would make Vercel attempt a Node build and break the static deploy. `node_modules` exists only locally for testing and is gitignored. See [Development](development.md#deployment).
- **No build step.** What you edit is what ships. This keeps the project approachable and the deploy trivial.
- **Feature flags, not forks.** Supabase and the judge are optional and gated on config, so the app degrades gracefully to local-only.
- **No em dashes in user-facing copy.** A house style choice; use hyphens.
- **Only public keys in client code.** The Supabase publishable/anon key is safe (protected by row-level security). Never the service key, an OAuth secret, or a database password. See [Progress and sync](progress-and-sync.md#security).
