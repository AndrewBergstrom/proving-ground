# Development

Run Proving Ground locally, verify changes, deploy, and the conventions that keep it a clean static site.

[Back to the docs index](../README.md#documentation)

## Contents

- [Local preview](#local-preview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Pre-commit checklist](#pre-commit-checklist)

## Local preview

There is no build step. Serve the folder and open the printed URL:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Opening `index.html` directly works for a quick look, but a local server better matches production (relative paths, `cleanUrls`). To exercise sign-in or the code judge locally, set the relevant values in `assets/config.js` (see [Progress and sync](progress-and-sync.md) and [Code judge](code-judge.md)).

## Testing

There is no test framework in the repo. Tools are installed locally as needed and removed before commit so the site stays dependency-free. The verification approach that has kept the content correct:

**1. Syntax check every script:**

```bash
node --check assets/data.js
node --check assets/app.js
node --check assets/judge.js
```

**2. Content integrity.** Load `data.js` in a Node `vm` sandbox and assert: every `practice.refs` and quiz ref resolves to a real problem / build / framework stage / decomp index; quizzes, recall, and learn blocks are well-formed; no duplicate ids. This catches the most common authoring mistakes.

**3. Coding solutions actually pass.** Run each JavaScript `solution` against its `tests` in a `vm`, and generate a Python harness (wrapping `solution` + `json.loads`/`json.dumps` of the tests) and run it with `python3`. A solution should never be committed unverified.

**4. Headless UI smoke test.** With `jsdom` (installed locally, gitignored), boot the app, navigate track -> module -> Learn -> Practice, and assert the expected practice element mounts with no runtime errors. This is how new modules and the coder integration are checked.

```bash
npm install jsdom --no-save     # local only; do not commit package.json
```

**5. Judge harness (when touching compiled languages).** Generate each language's program from the seeded solutions and, where a local toolchain exists, compile and run it (C++ verifies end-to-end locally; the rest by inspection). Headless tests confirm the feature-off path is unchanged and the feature-on path posts a valid program and renders results.

> Important: any `package.json` / `package-lock.json` created by `npm install` must be removed before committing, and `node_modules` stays gitignored. See [Deployment](#deployment) for why.

## Deployment

- **Host:** Vercel. The site deploys with no configuration; `vercel.json` only sets `{ "cleanUrls": true }`.
- **Auto-deploy:** pushing to `main` triggers a production deploy automatically (about 25 seconds). No manual command needed.
- **Live URL:** https://proving-ground-theta.vercel.app
- **Never add `package.json`.** Vercel treats its presence as a signal to run a Node build, which breaks the static deploy. Keeping the repo free of it is what makes the zero-config static deploy work.

The optional Judge0 code judge is deployed separately on its own box; see [`judge/RUNBOOK.md`](../judge/RUNBOOK.md).

## Conventions

- **No em dashes** in any user-facing copy or content. Use hyphens.
- **Pure static.** No build step, no framework, no `package.json`. Vanilla JS only.
- **Content is data.** Prefer editing `assets/data.js` over `app.js`; the engine is generic. See [Content model](content-model.md).
- **Feature flags, not branches.** Optional integrations (Supabase, the judge) are gated on config and degrade to local-only when blank.
- **Secrets never in client code or git.** Only the Supabase public/anon key belongs in `config.js`. Real judge secrets live in gitignored files on the judge box.
- **Teach from zero.** Do not assume fundamentals; that is what the Foundations track exists for.
- **Verify before you commit.** Especially coding solutions and content refs.

## Pre-commit checklist

Before committing content or code changes:

- [ ] `node --check` passes on every edited `.js` file.
- [ ] Content integrity passes (all refs resolve, no duplicate ids, quizzes/recall/learn well-formed).
- [ ] Any new or changed coding solutions pass their tests in both JavaScript and Python (and compiled languages if touched).
- [ ] Headless smoke test navigates the affected modules with no runtime errors.
- [ ] No em dashes were introduced.
- [ ] No `package.json` / `package-lock.json` is staged; `node_modules` is not staged.
- [ ] No secrets are staged (only `*.example` config files).
