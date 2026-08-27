# Proving Ground

Interview prep for the practical engineer. Built for the rounds that actually decide **Forward Deployed Engineer**, **platform engineering**, and **applied-AI / agentic** loops: decomposition under ambiguity, practical builds, and system design. Not another LeetCode grind.

## Why this exists

Research across FDE and applied-AI interview reports plus the coding-interview rubric literature points to a consistent gap: these loops reward decomposition, pragmatic shipping, and clear explanation, while classic prep platforms drill algorithm puzzles. Proving Ground trains the skills that transfer.

## What's inside

- **The Loop** — how practical loops differ from the algorithm loop, and the four dimensions interviewers actually score.
- **Decomposition trainer** — the flagship. Practice generating clarifying questions on ambiguous, real-world prompts before revealing the dimensions strong candidates cover.
- **Pattern deck** — spaced-repetition flashcards that train pattern *recognition* (read the tell, name the pattern), scheduled by how well you recall each one.
- **RAG & agent design** — the six-stage framework for the applied-AI design round, plus how evaluation actually works.
- **Method** — the learning science the app is built on (retrieval practice, spacing, interleaving, faded scaffolding).

All progress is stored locally in your browser (`localStorage`). No accounts, no backend.

## Tech

Zero-dependency static site: plain HTML, CSS, and vanilla JavaScript. No build step.

## Local preview

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

## Deploy

Static site — deploys on Vercel with no configuration. Import the repo at [vercel.com/new](https://vercel.com/new) or run `vercel` from the project root.

## Roadmap

- More decomposition prompts and pattern cards
- A practical-build track (parse-a-CSV, rate-limiter, small RAG pipeline) with rubric self-scoring
- System design walkthroughs by seniority level
