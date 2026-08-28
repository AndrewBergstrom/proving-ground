# Proving Ground

**Interview prep for the practical engineer.** Track-based learning for the rounds that actually decide **Forward Deployed Engineer**, **platform engineering**, and **applied-AI / agentic** roles: decomposition under ambiguity, systems integration, orchestrating AI agents, translating tech to stakeholders, applied system design, and more. Plus a real in-browser coding playground. Not another LeetCode grind.

- **Live app:** https://proving-ground-theta.vercel.app
- **Repository:** https://github.com/AndrewBergstrom/proving-ground

Every track runs the same loop: **Learn -> Practice -> Quiz -> Reinforce**. Progress is saved locally and, if you sign in, synced across your devices.

---

## At a glance

| | |
|---|---|
| **Tracks** | 7 (Foundations, DSA, Forward Deployed, Platform & Cloud, Applied AI, Data Engineering, Data Science & ML) |
| **Modules** | 37 |
| **Coding problems** | 24 (JavaScript + Python in-browser; Java / C# / C++ / Go / Rust optional via a self-hosted judge) |
| **SQL problems** | 4 (real SQLite in the browser) |
| **Practical builds** | 12 self-scored build exercises |
| **Framework drills** | 28 stages across RAG, agents, observability, incident command, and more |
| **Decomposition prompts** | 9 |
| **Pattern-recognition cards** | 25 |
| **Stack** | Zero-dependency static site (HTML + CSS + vanilla JS). No build step. |

---

## Documentation

Start here, then jump to what you need. Each doc has its own table of contents.

### [Architecture](docs/architecture.md)
How the app is built and why.
- [System overview](docs/architecture.md#system-overview) · [File layout](docs/architecture.md#file-layout) · [The module engine](docs/architecture.md#the-module-engine) · [Rendering and views](docs/architecture.md#rendering-and-views) · [Design constraints](docs/architecture.md#design-constraints)

### [Content model](docs/content-model.md)
The data structures that hold every track, module, and problem, plus how to author new content.
- [The data layer](docs/content-model.md#the-data-layer) · [Module shape](docs/content-model.md#module-shape) · [Practice types](docs/content-model.md#practice-types) · [Add a coding problem](docs/content-model.md#add-a-coding-problem) · [Add a module](docs/content-model.md#add-a-module)

### [Curriculum](docs/curriculum.md)
Every track and module, and what each one teaches.
- [Foundations](docs/curriculum.md#foundations) · [DSA](docs/curriculum.md#algorithms--data-structures) · [Forward Deployed](docs/curriculum.md#forward-deployed) · [Platform & Cloud](docs/curriculum.md#platform--cloud) · [Applied AI](docs/curriculum.md#applied-ai) · [Data Engineering](docs/curriculum.md#data-engineering) · [Data Science & ML](docs/curriculum.md#data-science--ml)

### [Progress and sync](docs/progress-and-sync.md)
The finish-or-restart progress model, spaced repetition, and optional cross-device sync.
- [Finish-or-restart model](docs/progress-and-sync.md#finish-or-restart-model) · [Durable vs session state](docs/progress-and-sync.md#durable-vs-session-state) · [Spaced repetition](docs/progress-and-sync.md#spaced-repetition) · [Accounts and sync](docs/progress-and-sync.md#accounts-and-sync)

### [Code judge](docs/code-judge.md)
The in-browser languages and the optional self-hosted judge for compiled languages.
- [In-browser languages](docs/code-judge.md#in-browser-languages) · [Compiled languages (Judge0)](docs/code-judge.md#compiled-languages-judge0) · [The harness](docs/code-judge.md#the-harness) · [Add a language or problem](docs/code-judge.md#add-a-language-or-problem) · [Self-hosting runbook](judge/RUNBOOK.md)

### [Development](docs/development.md)
Run it locally, test it, deploy it, and the conventions to keep.
- [Local preview](docs/development.md#local-preview) · [Testing](docs/development.md#testing) · [Deployment](docs/development.md#deployment) · [Conventions](docs/development.md#conventions) · [Pre-commit checklist](docs/development.md#pre-commit-checklist)

---

## Quick start

It is a static site, so there is nothing to build:

```bash
git clone https://github.com/AndrewBergstrom/proving-ground.git
cd proving-ground
npx serve .          # or: python3 -m http.server
# then open the printed localhost URL
```

Opening `index.html` directly works too, though a local server is closer to production. See [Development](docs/development.md) for testing and deploy details.

---

## Why this exists

Research across Forward Deployed and applied-AI interview reports, plus the coding-interview rubric literature, points to a consistent gap: these loops reward decomposition, pragmatic shipping, and clear explanation, while classic prep platforms drill algorithm puzzles. The industry is trending further this way, toward engineers who can orchestrate the agents that write code and translate technical work for stakeholders. Proving Ground trains the skills that transfer, from zero, without assuming the fundamentals interviews quietly expect.

## Status

Personal project, actively developed. The app and cross-device sign-in work in production. Compiled-language support is built and gated off until a judge is provisioned (see the [Code judge](docs/code-judge.md) doc). Content and interview formats reflect best-effort, adversarially-verified research; loops vary by company and change over time.
