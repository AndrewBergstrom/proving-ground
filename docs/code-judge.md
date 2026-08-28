# Code judge

How code runs in the playground: in-browser for JavaScript, Python, and SQL, and on an optional self-hosted judge for compiled languages.

[Back to the docs index](../README.md#documentation)

## Contents

- [In-browser languages](#in-browser-languages)
- [Compiled languages (Judge0)](#compiled-languages-judge0)
- [The harness](#the-harness)
- [Add a language or problem](#add-a-language-or-problem)
- [Self-hosting](#self-hosting)

## In-browser languages

These run entirely client-side, with no server and no cost:

| Language | Runtime |
|---|---|
| JavaScript | A sandboxed Web Worker (no DOM, terminated on timeout). |
| Python | Pyodide (CPython compiled to WebAssembly) in a dedicated Web Worker, loaded once and reused, with an 8-second per-run timeout that recreates the worker if user code hangs. |
| SQL | sql.js (SQLite compiled to WebAssembly) against a small sample dataset. |

Every problem ships JavaScript and Python starters and solutions. SQL problems run against the `sites` + `readings` sample tables. All of this works in the default checkout with no configuration.

## Compiled languages (Judge0)

Java, C#, C++, Go, and Rust cannot run in the browser: they need a real compiler on a server. Proving Ground supports them through a **self-hosted [Judge0](https://judge0.com)**, kept fully optional and gated on config.

- **Feature flag.** With `PG_CONFIG.JUDGE_URL` blank (the default), compiled languages simply do not appear; the app behaves exactly as an in-browser-only site. Set `JUDGE_URL` to your judge and the compiled languages show up on any problem that supports them.
- **Which languages appear** is controlled by `PG_CONFIG.REMOTE_LANGS` (default `["java", "csharp", "cpp", "go", "rust"]`).
- **Pure static, still.** `judge.js` is a client that talks to your judge over HTTPS. No backend is added to the app itself.

```js
// assets/config.js
window.PG_CONFIG = {
  // ...
  JUDGE_URL: "",                                    // blank = compiled languages OFF
  REMOTE_LANGS: ["java", "csharp", "cpp", "go", "rust"]
};
```

Security for running untrusted code (sandboxing, network isolation, rate limiting, an internal-only API behind a token-injecting proxy) is handled by the self-hosting stack, documented in [`judge/RUNBOOK.md`](../judge/RUNBOOK.md).

## The harness

The problem model is function-style: a `fnName` plus `tests` of `{ args, expected }`. To run that on a compiled language, `assets/judge.js` generates a complete, self-checking program:

1. It reads the problem's `sig` (parameter and return types) and the user's code.
2. For each test case it emits typed literals for the arguments and expected value, calls the function, and compares.
3. The program prints one line per case: `PG_CASE <i> <P|F> <gotAsString>`.
4. It POSTs the program to Judge0 (`/submissions?wait=true`) with CPU/wall/memory limits, then parses those `PG_CASE` lines back into the **same result shape the local runners use**, so the results UI is identical.

Supporting details:

- **Type system.** The harness currently supports `int`, `bool`, `string`, and `int[]`. Extend the per-language adapters in `judge.js` to add more types.
- **Language ids.** Judge0's numeric `language_id` values vary by version, so the client fetches `/languages` once and resolves ids by matching language names with a regex. This is version-proof.
- **Verification.** The generated programs were validated by compiling and running (C++ end-to-end locally; the rest by inspection) and by headless tests confirming the feature-off and feature-on paths. See [Development: testing](development.md#testing).

## Add a language or problem

**To make an existing problem support compiled languages**, add two fields to it in `PROBLEMS` (see [Content model](content-model.md#coding-problem-shape)):

```js
sig: { params: ["int[]", "int"], ret: "int[]" },
code: {
  java:   { starter: "class Solution { ... }", solution: "class Solution { ... }" },
  csharp: { starter: "public class Solution { ... }", solution: "..." },
  cpp:    { starter: "vector<int> twoSum(vector<int> nums, int target) { ... }", solution: "..." },
  go:     { starter: "func twoSum(nums []int, target int) []int { ... }", solution: "..." },
  rust:   { fn: "two_sum", starter: "fn two_sum(...) -> Vec<i32> { ... }", solution: "..." }
}
```

- The same `tests` are reused across languages; you only author `starter` and `solution` per language.
- Java and C# wrap a `Solution` class; C++/Go/Rust use a free function named `fnName`.
- Rust's `fn` override handles snake_case names (`two_sum` vs `twoSum`).
- Always verify each solution actually passes before committing.

Currently seeded across all five languages: `two-sum`, `valid-palindrome`, `binary-search`. Adding more is content work, not infrastructure.

**To add a new language** (for example Kotlin or TypeScript), add an entry to `LANGS` (label + name-match regex) and an adapter to `ADAPT` in `judge.js`, then include it in `REMOTE_LANGS`.

## Self-hosting

The full provisioning guide, including the security model, secrets, firewall, and the cgroup-v1 step Judge0 1.13.x needs, is in [`judge/RUNBOOK.md`](../judge/RUNBOOK.md). In short:

1. Create a small, dedicated, disposable VPS (a Hetzner CX22 is plenty, roughly EUR 4-5/month).
2. Point a DNS record at it and run the provided `docker compose up`.
3. Set `JUDGE_URL` in `assets/config.js` to your judge domain and deploy.

The stack runs Judge0 with the API bound to the internal network, behind a Caddy edge that terminates TLS, restricts CORS to your app origin, rate-limits per IP, and injects the auth token server-side so the browser never holds a secret and the API is never publicly reachable.
