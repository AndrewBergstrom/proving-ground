# Content model

Everything a user sees is data in `assets/data.js`. This doc is the reference for those structures and a guide to authoring new content. For how the engine consumes them, see [Architecture](architecture.md).

[Back to the docs index](../README.md#documentation)

## Contents

- [The data layer](#the-data-layer)
- [Track shape](#track-shape)
- [Module shape](#module-shape)
- [Practice types](#practice-types)
- [Coding problem shape](#coding-problem-shape)
- [Supporting banks](#supporting-banks)
- [Add a coding problem](#add-a-coding-problem)
- [Add a module](#add-a-module)
- [Authoring conventions](#authoring-conventions)

## The data layer

`data.js` declares each content collection as a top-level `var`:

| Global | What it holds |
|---|---|
| `TRACKS` | The 7 tracks (id, name, blurb). |
| `MODULES` | Every module across all tracks. |
| `PROBLEMS` | The coding-problem bank (JavaScript + Python, plus optional compiled-language solutions). |
| `SQL_PROBLEMS` | SQL problems run against the sample dataset. |
| `SQL_SETUP` | The `CREATE TABLE` + seed SQL for the sample database. |
| `BUILDS` | Self-scored practical build exercises. |
| `RUBRIC` | The four dimensions builds are scored on. |
| `DECOMP` | Decomposition prompts (clarifying-question drills). |
| `RAG_STAGES` | Reusable "tick each stage" framework stages (RAG, agents, observability, incident command, retrieval). |
| `PATTERNS` | The 25-card pattern-recognition deck. |

There is no logic here, only data. The engine in `app.js` reads it.

## Track shape

```js
{ id: "fde", name: "Forward Deployed", short: "FDE", blurb: "One-line pitch shown on the track card." }
```

A module joins a track by its `track` field matching a track `id`. Track order and module order follow array order.

## Module shape

```js
{
  id: "systems-integration",
  track: "fde",
  title: "Systems Integration",
  kicker: "Core skill",          // small label on the card
  est: "50 min",
  learn: {
    intro: "One or two sentences framing the module.",
    points: [ { h: "Heading", p: "A teaching point." }, ... ],
    template: { lang: "JavaScript", code: "..." } | null,   // optional code sample
    example:  { h: "The move", p: "A worked example." }     | null
  },
  practice: { type: "build", refs: ["integration"], note: "How to work the practice." },
  quiz: [
    { q: "Question?", choices: ["a", "b", "c"], answer: 1, explain: "Why b." },
    { code: "two-sum" }    // optional: a live coding check inside the quiz
  ],
  recall: [ { front: "Prompt", back: "Answer" }, ... ]   // or the string "DECK"
}
```

Notes:

- `quiz` entries are either a multiple-choice object, a `{ code: "<problem-id>" }` live coding check, or a `{ sql: "<sql-id>" }` SQL check.
- `recall` is an array of flashcards, or the literal string `"DECK"` for the pattern-recognition module (which uses the full `PATTERNS` deck).
- `template` and `example` are optional; pass `null` to omit.

## Practice types

The `practice.type` field selects how the Practice step renders. `refs` points into the matching bank.

| `type` | `refs` point to | Renders |
|---|---|---|
| `code` | `PROBLEMS` ids | The coding playground (JS/Python, plus compiled languages if enabled). |
| `sql` | `SQL_PROBLEMS` ids | The SQL playground against the sample database. |
| `build` | `BUILDS` ids | A self-scored build card (clarify, build, curveball, explain, rubric, reference). |
| `framework` | `RAG_STAGES` ids | A grid of stages you tick off as you internalize each. |
| `decomp` | `DECOMP` **array indices** | A decomposition drill: write clarifying questions, then reveal the dimensions. |
| `deck` | (none) | The 25-card pattern-recognition review deck. |

Note that `decomp` refs are numeric indices into the `DECOMP` array, while every other type uses string ids. Appending to `DECOMP` is safe (it does not shift existing indices); inserting in the middle is not.

## Coding problem shape

```js
{
  id: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  pattern: "Hashing / Two Pointers",
  prompt: "Plain-English problem statement, including a complexity hint.",
  fnName: "twoSum",
  starter:  "function twoSum(nums, target) {\n  // ...\n}",
  tests: [ { args: [[2,7,11,15], 9], expected: [0,1] }, ... ],
  solution: "function twoSum(nums, target) { ... }",
  starterPy: "def twoSum(nums, target):\n    pass",
  solutionPy: "def twoSum(nums, target):\n    ...",

  // OPTIONAL: enables compiled languages for this problem (see Code judge doc)
  sig: { params: ["int[]", "int"], ret: "int[]" },
  code: {
    java:   { starter: "...", solution: "..." },
    csharp: { starter: "...", solution: "..." },
    cpp:    { starter: "...", solution: "..." },
    go:     { starter: "...", solution: "..." },
    rust:   { fn: "two_sum", starter: "...", solution: "..." }
  }
}
```

The same `tests` array is shared across all languages. JavaScript and Python are always available. Adding `sig` + `code` lights up the compiled languages (Java, C#, C++, Go, Rust) for that problem when a judge is configured. Details in [Code judge](code-judge.md#add-a-language-or-problem).

## Supporting banks

- **`BUILDS`** - each has `id`, `badge`, `title`, `brief`, and the arrays `clarify`, `build`, `explain`, `reference`, plus a `curveball` string. Scored against `RUBRIC` (customer framing, build quality, adaptability, explanation).
- **`DECOMP`** - each has a `badge`, a `prompt`, and `dims`: the dimensions a strong candidate surfaces (Inputs, Constraints, Scale, Edge cases, Success criteria, Ambiguities).
- **`RAG_STAGES`** - each stage has `id`, `step`, `h`, `p`. Ids are globally unique so multiple frameworks can share the array; the engine looks them up by id.
- **`PATTERNS`** - each card has `id`, `tell` (the signal), `name` (the pattern), and `why`.
- **`SQL_PROBLEMS`** / **`SQL_SETUP`** - problems run against the `sites` + `readings` sample tables (meter data with an energy/water slant).

## Add a coding problem

1. Verify the solution first. Write it in JavaScript and Python and confirm both pass the tests (see [Development: testing](development.md#testing)).
2. Append an object to `PROBLEMS` with `id`, `title`, `difficulty`, `pattern`, a plain-English `prompt`, `fnName`, `starter`, `tests`, `solution`, `starterPy`, `solutionPy`.
3. Reference the new `id` from a module's `practice.refs` (for a `code` practice) or a quiz `{ code: "<id>" }`.
4. Keep the prompt beginner-honest: explain the complexity in words, do not assume the reader knows `n`, `O(n)`, or 0-indexing (that is what the Foundations track is for).

To also enable compiled languages, add `sig` and `code`. See [Code judge](code-judge.md#add-a-language-or-problem).

## Add a module

1. Append a module object to `MODULES` with a unique `id` and the target `track`.
2. Fill `learn` (intro + points, optional template/example).
3. Choose a `practice.type` and point `refs` at existing (or newly added) bank entries.
4. Write a `quiz` (2 to 4 items works well) and `recall` cards.
5. Verify integrity: every ref resolves, quizzes are well-formed, no duplicate ids. The verification recipe is in [Development](development.md#testing).

## Authoring conventions

- **No em dashes** in any copy. Use hyphens.
- **Teach from zero.** Interviews assume fundamentals; this app does not. If a term might be unfamiliar, define it or link the reader to Foundations.
- **One idea per teaching point.** `points` should read as a scannable list, not paragraphs.
- **Quizzes teach.** Every quiz item has an `explain` that reinforces the point, not just marks right/wrong.
- **Recall cards are atomic.** One front, one back, one fact.
