# Curriculum

Every track and module, and what each one teaches. This is the learner-facing map. For how modules are structured as data, see [Content model](content-model.md).

[Back to the docs index](../README.md#documentation)

Each module runs the same loop: **Learn -> Practice -> Quiz -> Reinforce**. A lesson is Learn + Practice + Quiz; finishing it unlocks spaced-repetition Reinforce. See [Progress and sync](progress-and-sync.md).

## Contents

- [Foundations](#foundations)
- [Algorithms & Data Structures](#algorithms--data-structures)
- [Forward Deployed](#forward-deployed)
- [Platform & Cloud](#platform--cloud)
- [Applied AI](#applied-ai)
- [Data Engineering](#data-engineering)
- [Data Science & ML](#data-science--ml)

## Foundations

The assumed knowledge, taught from zero. Built because interviews (and most prep) quietly assume you already know this. Start here if any of the DSA terms look unfamiliar; DSA modules link back here.

| Module | Teaches |
|---|---|
| Reading Big-O Notation | What `n`, `O(1)`, `O(n)`, `O(log n)`, `O(n log n)`, `O(n^2)` mean; time vs space; the Big-O ladder; simplifying (drop constants and lower-order terms); why `n-1` and 0-indexing. |
| Arrays & Indexing | What an array is, 0-indexed positions, length vs last index, and what is fast (index access) vs slow (search). |
| Loops & Iteration | Looping over items, the counter/accumulator pattern, and iterating by value vs by index. |
| Hash Maps & Sets | Near-instant lookup and membership, and how they turn an `O(n^2)` scan into `O(n)`. |
| Recursion | Base case vs recursive case, "trust the smaller call," the call stack cost, and the bridge to Dynamic Programming. |

## Algorithms & Data Structures

The LeetCode-style pattern round: recognize the pattern, then implement it. Beginner-honest prompts explain the complexity in words.

| Module | Teaches |
|---|---|
| Two Pointers | Opposite-ends and slow/fast scans; `O(n)` time, `O(1)` space. |
| Hashing | Trading space for `O(1)` lookups; frequency counting and complements. |
| Sliding Window | Fixed and dynamic windows over contiguous runs without recomputing. |
| Dynamic Programming | Naming the state, the recurrence, and base cases; Kadane, climbing stairs, house robber. |
| Binary Search | Halving a sorted space, and binary-searching the answer when feasibility is monotonic. |
| Pattern Recognition Deck | A 25-card spaced-repetition deck that drills reading the tell and naming the pattern. |

The coding problems in this track also support Java, C#, C++, Go, and Rust when a judge is configured (see [Code judge](code-judge.md)).

## Forward Deployed

The practical-engineer loop AI companies actually run. Breadth, shipping, and communication over algorithmic depth.

| Module | Teaches |
|---|---|
| Decomposition Under Ambiguity | The signature round: clarify across six dimensions before solutioning. Premature solutioning is the top rejection reason. |
| Systems Integration | Wiring one system to another: auth, incremental sync, idempotency, the anti-corruption layer, poll vs webhook. |
| Practical Builds | The take-home: build something that works, adapt to a curveball, explain it. Scored on four dimensions. |
| Orchestrating AI Coding Agents | The shift from writing code to directing and verifying it: spec, decompose, delegate, verify, integrate, and know when to take the wheel. |
| Stakeholder Communication | Translating tech to outcomes: read the audience, lead with the bottom line (BLUF), set expectations, confirm understanding. |

## Platform & Cloud

Applied, pragmatic production thinking over algorithm puzzles.

| Module | Teaches |
|---|---|
| System Design Under Ambiguity | Clarify, sketch, then lead the deep dives on the risky parts. The bar shifts with seniority. |
| Infrastructure as Code | Declarative desired state, plan-before-apply, state and drift, modules/variables across environments (Terraform). |
| CI/CD & Deployment Pipelines | CI vs CD, build-once-promote-many, progressive delivery, automated rollback, gates that block bad code. |
| Observability & SLOs | Observability vs monitoring, SLI/SLO/error budget, the three signals, alerting on symptoms not causes. |
| Incident Response & On-Call | Mitigate before root-cause, severity, suspect the recent change, communicate on a cadence, blameless postmortem. |
| Reliability Builds | Production take-homes: rate limiting and reliable delivery, reasoning about concurrency, failure, and isolation. |

## Applied AI

The emerging applied-AI interview, still forming its canon.

| Module | Teaches |
|---|---|
| Prompt Engineering | Structure over hope, few-shot examples, output as a validated contract, chain-of-thought tradeoffs, abstain paths, and prompt injection. |
| RAG & Agent Design | The six-stage framework: Scope, Ingest, Retrieve, Act/Generate, Guardrails, Evaluate. |
| Vector Search & Retrieval | Embeddings, chunking, ANN/vector databases, dense vs sparse vs hybrid, and reranking. |
| Agents & Tool Use | Typed tools, the reason-act-observe (ReAct) loop, bounded loops, approval gates, and auditability. |
| LLM System Design | Latency/cost/quality tradeoffs, streaming and caching, model routing, context management, guardrails and evals. |
| Evals & LLM Judging | Reproducible eval sets, validated LLM-as-judge, and per-case reporting instead of vibes. |

## Data Engineering

The data-plumbing loop, with a sensor and meter-data slant that fits energy and water companies. Practices run real SQL in the browser.

| Module | Teaches |
|---|---|
| SQL Fundamentals | Clause run-order, aggregation and grouping, and WHERE vs HAVING. |
| SQL Window Functions | `OVER` / `PARTITION BY` for running and rolling calculations and rankings. |
| Pipelines & Modeling | How data moves and is shaped for reliable, queryable output. |
| Data Quality | Validating, deduplicating, and trusting data as it lands. |

## Data Science & ML

Statistics, machine learning, and model evaluation, including the time-series forecasting behind energy and water analytics. Practices implement the math by hand in the playground (no libraries).

| Module | Teaches |
|---|---|
| Statistics Foundations | Mean vs median, spread (variance, standard deviation), and when each summary lies. |
| Data Wrangling | Cleaning and reshaping data before analysis (reuses the SQL playground). |
| Machine Learning Fundamentals | The core ideas behind training and generalization. |
| Model Evaluation | Measuring a model honestly: the metrics that fit the task. |
| Time Series & Forecasting | Smoothing, moving averages, and forecasting, with an energy/water slant. |
