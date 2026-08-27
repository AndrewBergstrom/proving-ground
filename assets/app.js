/* Proving Ground — app logic (vanilla JS, no build step) */
(function () {
  "use strict";

  // ---------- data ----------
  var PATTERNS = [
    { id: "sliding", tell: "Longest / shortest / best contiguous subarray or substring meeting a condition.", name: "Sliding Window", why: "A moving window grows and shrinks over contiguous elements in O(n) instead of recomputing every subrange." },
    { id: "twoptr", tell: "A sorted array; find a pair or triplet summing to a target, or work inward from both ends.", name: "Two Pointers", why: "Two indices moving toward each other exploit the sort order to skip whole regions." },
    { id: "fastslow", tell: "Detect a cycle in a linked list, or find its middle in a single pass.", name: "Fast & Slow Pointers", why: "One pointer moves twice as fast; they meet inside a cycle and split the list by position." },
    { id: "intervals", tell: "Overlapping intervals: merge them, insert one, or count concurrent events.", name: "Merge Intervals", why: "Sort by start, then sweep, merging or counting overlaps as you go." },
    { id: "cyclic", tell: "An array of size n holding values 1..n; find the missing or duplicate in O(1) space.", name: "Cyclic Sort", why: "Each value has a home index, so you can place elements in one pass and read off anomalies." },
    { id: "monostack", tell: "Next greater / smaller element, or the largest rectangle in a histogram.", name: "Monotonic Stack", why: "A stack kept in sorted order resolves 'nearest bigger/smaller' in amortized O(n)." },
    { id: "twoheap", tell: "Find the median of a running stream, or keep two halves balanced.", name: "Two Heaps", why: "A max-heap for the lower half and min-heap for the upper give O(1) median access." },
    { id: "subsets", tell: "Generate all combinations, permutations, or subsets of a set.", name: "Subsets / Backtracking", why: "Build candidates incrementally and undo the last choice to explore every branch." },
    { id: "binsearch", tell: "A sorted or rotated-sorted array; find a target or a boundary in O(log n).", name: "Modified Binary Search", why: "Halve the search space each step by reasoning about which side must contain the answer." },
    { id: "topk", tell: "The top K, smallest K, or K most frequent elements.", name: "Top-K (Heap)", why: "A size-K heap keeps only the candidates that matter in O(n log k)." },
    { id: "kmerge", tell: "Merge K sorted lists or arrays into one sorted output.", name: "K-way Merge", why: "A min-heap of the K current heads always yields the next smallest element." },
    { id: "reverse", tell: "Reverse a sublist or reorder a linked list in place.", name: "In-place Linked List Reversal", why: "Re-point next-pointers as you walk, using O(1) extra space." },
    { id: "bfs", tell: "Shortest path or level-by-level traversal on an unweighted graph or tree.", name: "BFS", why: "A queue explores nodes in waves, so the first time you reach a node is the shortest way." },
    { id: "dfs", tell: "Explore every path, count connected components, or flood-fill islands.", name: "DFS", why: "Recursion or a stack dives deep, marking visited nodes to cover the whole structure." },
    { id: "topo", tell: "Order tasks with prerequisites, or detect a cycle in dependencies.", name: "Topological Sort", why: "Repeatedly emit nodes with no remaining incoming edges; leftovers mean a cycle." },
    { id: "dp", tell: "Optimize a value under choices with overlapping subproblems (knapsack, coin change, edit distance).", name: "Dynamic Programming", why: "Define a state, a recurrence, and memoize so each subproblem is solved once." },
    { id: "union", tell: "Group elements, merge sets, or track connected components as edges arrive.", name: "Union-Find", why: "Union by rank with path compression answers connectivity in near-constant time." },
    { id: "prefix", tell: "Many range-sum queries, or a subarray summing to exactly K.", name: "Prefix Sum", why: "Precompute cumulative sums so any range is one subtraction; hash prefixes for subarray targets." },
    { id: "greedy", tell: "Reach a global optimum by making the locally best choice each step (activity selection, jump game, assign cookies).", name: "Greedy", why: "When a local optimum provably leads to the global one, sort by the right key and take greedily." },
    { id: "binsearchans", tell: "Minimize the maximum, or maximize the minimum, where feasibility is monotonic in the answer.", name: "Binary Search on the Answer", why: "If 'can we do it within budget X?' is monotonic, binary-search X and test feasibility each step." },
    { id: "bitmask", tell: "Toggle or count bits, find the one non-duplicated number, or enumerate subsets compactly.", name: "Bit Manipulation", why: "XOR cancels pairs; a bitmask stores a whole set in one integer for fast set operations." },
    { id: "trie", tell: "Many prefix lookups, autocomplete, or dictionary word search.", name: "Trie (Prefix Tree)", why: "Shared prefixes become shared paths, so a lookup costs O(word length) regardless of dictionary size." },
    { id: "quickselect", tell: "Find the k-th smallest or largest element without fully sorting.", name: "Quickselect", why: "Partition like quicksort but recurse into only one side, averaging O(n)." },
    { id: "dutch", tell: "Sort an array of three distinct categories in a single pass (0/1/2, colors).", name: "Dutch National Flag", why: "Three pointers partition into low, mid, and high regions in one linear scan." },
    { id: "treedfs", tell: "Compute a value for each node from its children: subtree sums, height, or diameter.", name: "Tree DFS (Postorder)", why: "Recurse to the children first, then combine their results at the parent in one traversal." }
  ];

  var DECOMP = [
    {
      badge: "FDE · data integration",
      prompt: "A customer sends us a messy CSV of their orders every day. Build something that turns it into clean, queryable data.",
      dims: [
        { h: "Inputs", q: ["What's the schema, and is it stable day to day?", "Encoding, delimiter, size, how is it delivered?", "Who owns the source if it breaks?"] },
        { h: "Constraints", q: ["One-time or recurring? What cadence?", "Latency budget: minutes or hours after arrival?", "What happens on a bad file: retry, alert, skip?"] },
        { h: "Scale", q: ["Rows per day now, and expected growth?", "How many customers / feeds like this?"] },
        { h: "Edge cases", q: ["Malformed rows, missing fields, duplicates?", "Timezone / currency / encoding inconsistencies?", "Partial or late files?"] },
        { h: "Success criteria", q: ["What does 'queryable' mean: a DB, an API, a dashboard?", "Who queries it and how often?"] },
        { h: "Ambiguities", q: ["Any existing pipeline or warehouse to fit into?", "Auth, PII, retention requirements?"] }
      ]
    },
    {
      badge: "Applied-AI · retrieval",
      prompt: "Design the retrieval layer for a customer's private knowledge base so their chatbot can answer questions from it.",
      dims: [
        { h: "Inputs", q: ["Document types, volume, and update frequency?", "Structured, unstructured, or mixed?", "One tenant or many (isolation)?"] },
        { h: "Constraints", q: ["Latency budget per query?", "Cost ceiling per query / per month?", "Freshness: how fast must new docs be searchable?"] },
        { h: "Scale", q: ["Number of documents and total tokens?", "Queries per second at peak?"] },
        { h: "Edge cases", q: ["Out-of-scope questions: refuse or fall back?", "Stale or conflicting documents?", "No good match found?"] },
        { h: "Success criteria", q: ["How do we measure answer quality: what evals?", "Retrieval quality vs generation quality separately?"] },
        { h: "Ambiguities", q: ["Chunking and embedding strategy assumptions?", "Privacy, access control, audit needs?"] }
      ]
    },
    {
      badge: "Platform · reliability",
      prompt: "Build a rate limiter for our public API.",
      dims: [
        { h: "Inputs", q: ["Limit per user, per IP, per API key, per endpoint?", "What identifies a caller?"] },
        { h: "Constraints", q: ["What limits and what window shape?", "Single node or distributed across many?", "Fail open or fail closed under load?"] },
        { h: "Scale", q: ["Requests per second and number of clients?", "How many gateway nodes share state?"] },
        { h: "Edge cases", q: ["Bursts, clock skew, race conditions on the counter?", "What response on limit: 429, headers, retry-after?"] },
        { h: "Success criteria", q: ["Accuracy vs performance tradeoff acceptable?", "Observability: how do we see who's throttled?"] },
        { h: "Ambiguities", q: ["Algorithm: token bucket, sliding window, fixed window?", "Shared store: Redis, in-memory, gateway-native?"] }
      ]
    },
    {
      badge: "Platform · observability",
      prompt: "A team wants a dashboard showing the health of their data pipelines.",
      dims: [
        { h: "Inputs", q: ["Which pipelines, and what signals define 'health'?", "Where does the telemetry come from?"] },
        { h: "Constraints", q: ["Real-time or periodic refresh?", "Data retention window?"] },
        { h: "Scale", q: ["How many pipelines and how much event volume?", "How many viewers, how often?"] },
        { h: "Edge cases", q: ["A pipeline is fully down vs degraded?", "Missing or delayed metrics?", "Alerting on top of the dashboard?"] },
        { h: "Success criteria", q: ["What decisions should this dashboard drive?", "Who is the primary user: on-call, lead, exec?"] },
        { h: "Ambiguities", q: ["Existing tooling (Grafana, Datadog) to use?", "Build vs configure?"] }
      ]
    },
    {
      badge: "FDE · systems integration",
      prompt: "A customer wants their Salesforce data synced into our product every night so their reps see it in-app.",
      dims: [
        { h: "Inputs", q: ["Which objects and fields, and is it full or incremental?", "Their Salesforce edition and API limits?"] },
        { h: "Constraints", q: ["Is nightly enough, or do they expect near-real-time?", "One-way or bidirectional sync?", "How do we stay under their API rate limits?"] },
        { h: "Scale", q: ["Record counts today and growth?", "How many customers will run this same sync?"] },
        { h: "Edge cases", q: ["Deleted records, field-mapping conflicts, schema changes on their side?", "A sync that fails halfway through?"] },
        { h: "Success criteria", q: ["What does 'synced' mean: a freshness SLA, reconciled counts?", "Who notices first if it breaks?"] },
        { h: "Ambiguities", q: ["Per-tenant OAuth and PII handling?", "Any existing ETL or warehouse to reuse?"] }
      ]
    },
    {
      badge: "Platform · eventing",
      prompt: "Design a system that reliably delivers event notifications to customers' webhook endpoints.",
      dims: [
        { h: "Inputs", q: ["Which events, what payload shape?", "How many endpoints per customer?"] },
        { h: "Constraints", q: ["At-least-once or exactly-once delivery?", "Is ordering guaranteed?", "Target delivery latency?"] },
        { h: "Scale", q: ["Events per second and fan-out per event?", "Number of subscribers?"] },
        { h: "Edge cases", q: ["Endpoint down or slow: retries and backoff?", "Poison events, duplicate delivery, thundering herd on recovery?"] },
        { h: "Success criteria", q: ["Delivery success rate and dead-letter handling?", "What observability do customers get?"] },
        { h: "Ambiguities", q: ["Payload signing and verification?", "Idempotency keys and replay support?"] }
      ]
    },
    {
      badge: "Applied-AI · agents",
      prompt: "Build an agent that can take actions in a customer's system on their behalf, like updating records or sending messages.",
      dims: [
        { h: "Inputs", q: ["Which tools/actions, and what triggers a run?", "What context does the agent get?"] },
        { h: "Constraints", q: ["Latency and cost per run?", "Which actions require human approval before executing?"] },
        { h: "Scale", q: ["Runs per day and concurrency?", "How many tools in the toolset?"] },
        { h: "Edge cases", q: ["A wrong or harmful action, a failed tool call?", "Ambiguous instructions or an infinite loop?"] },
        { h: "Success criteria", q: ["Task success rate, and how do you measure it?", "What does a good eval look like?"] },
        { h: "Ambiguities", q: ["Guardrails, approval gates, and permission scoping?", "Auditability of every action taken?"] }
      ]
    },
    {
      badge: "Applied-AI · internal tool",
      prompt: "Our support team wants an internal tool that surfaces past tickets similar to the one they're working on.",
      dims: [
        { h: "Inputs", q: ["Which ticket fields, and how much history?", "Is similarity by text, metadata, or both?"] },
        { h: "Constraints", q: ["Latency per search and freshness of new tickets?", "Privacy or on-prem requirements?"] },
        { h: "Scale", q: ["Number of tickets and searches per day?", "Concurrent agents?"] },
        { h: "Edge cases", q: ["No similar ticket exists; stale or duplicate tickets?", "PII inside ticket text?"] },
        { h: "Success criteria", q: ["Do agents resolve faster? How is 'similar' judged?", "How would you measure it?"] },
        { h: "Ambiguities", q: ["Build vs reuse existing search infra?", "Ranking signals and a feedback loop?"] }
      ]
    }
  ];

  var RAG_STAGES = [
    { id: "scope", step: "Stage 1", h: "Scope", p: "Inputs, outputs, latency budget, cost ceiling, and what a wrong answer actually costs. Frame the problem before any architecture." },
    { id: "ingest", step: "Stage 2", h: "Ingest", p: "Chunk and embed source documents into a vector store. Justify chunk size, overlap, and indexing choices out loud." },
    { id: "retrieve", step: "Stage 3", h: "Retrieve", p: "Embed the query, pull a tight top-k, and consider reranking. Retrieve less but more relevant to control cost and noise." },
    { id: "act", step: "Stage 4", h: "Act / Generate", p: "Structured output for reliability. For agents, define the tools, their schemas, and approval gates before any action." },
    { id: "guard", step: "Stage 5", h: "Guardrails", p: "Refuse out-of-scope requests, validate outputs, and route to a human above confidence or risk thresholds." },
    { id: "eval", step: "Stage 6", h: "Evaluate", p: "Measure retrieval and generation quality separately so you can localize failures, and track them over time." }
  ];

  var BUILDS = [
    {
      id: "csv",
      badge: "FDE · data integration",
      title: "Messy CSV → clean, queryable data",
      brief: "A customer drops a CSV of their orders into a folder every night. Build a small tool that turns each file into clean, queryable data your team can trust.",
      clarify: [
        "Pick the target: a SQLite table, Parquet + DuckDB, or a small query API. Justify it.",
        "Define the canonical schema and the natural key that identifies a unique order.",
        "Decide failure behavior up front: quarantine bad rows with reasons, never crash or drop silently.",
        "Decide idempotency: re-running the same file must not double-count."
      ],
      build: [
        "Parse robustly: handle encoding, delimiter, and header-name variance.",
        "Validate and coerce types; collect row-level errors instead of failing the whole file.",
        "Deduplicate on the natural key so the run is idempotent.",
        "Write to your chosen store and emit a summary: rows in, out, and rejected.",
        "Make it a real CLI: input path, --dry-run, and --verbose flags."
      ],
      curveball: "Some nightly files now arrive gzipped, and occasionally a file is a partial re-send of yesterday. Handle both without reprocessing or duplicating data, and without changing the command your team already runs.",
      explain: [
        "Lead with the customer's need, not your architecture.",
        "Run it live on a deliberately messy file and show the summary counts.",
        "Justify your dedupe strategy and what happens to bad rows."
      ],
      reference: [
        "Idempotent upserts keyed on a natural key, so re-runs are safe.",
        "Bad rows quarantined to a rejects file with reasons, not dropped silently.",
        "Config over hardcoding; the tool is re-runnable and observable.",
        "A working end-to-end run, not a notebook that only works once."
      ]
    },
    {
      id: "ratelimit",
      badge: "Platform · reliability",
      title: "Rate limiter for a public API",
      brief: "Add rate limiting to a public API so one noisy client can't degrade it for everyone.",
      clarify: [
        "What identifies a caller: API key, user, or IP? Per-endpoint or global?",
        "What limit and window shape, and is state single-node or shared across nodes?",
        "Fail open or fail closed if the limiter's store is unavailable?",
        "Response contract on limit: 429 with Retry-After and X-RateLimit-* headers?"
      ],
      build: [
        "Choose an algorithm (token bucket or sliding window) and justify it.",
        "Get the boundary right: no double-count race under concurrent requests.",
        "Return 429 with Retry-After and rate-limit headers.",
        "Make limits configurable per route or plan.",
        "Handle the store being down: degrade gracefully, don't return 500s."
      ],
      curveball: "You now run three API nodes behind a load balancer. Make the limit global across nodes, and reason about what happens when the shared store has 50ms latency or briefly goes down.",
      explain: [
        "Walk your algorithm choice and its burst behavior.",
        "Explain the distributed-state tradeoff you made.",
        "Show the failure mode: what a client sees when the store is unavailable."
      ],
      reference: [
        "Token bucket tolerates bursts; sliding window is smoother but costlier.",
        "Atomic increment (e.g. Redis INCR/EXPIRE or a Lua script) avoids races.",
        "Graceful degradation when the store is down beats hard failures.",
        "Standard headers and per-plan config; a demo that hits the limit and recovers."
      ]
    },
    {
      id: "rag",
      badge: "Applied-AI · retrieval",
      title: "Minimal RAG service with an 'I don't know'",
      brief: "Build a minimal RAG service that answers questions over a folder of a customer's documents, and can tell you when it doesn't know.",
      clarify: [
        "Document types, volume, and how often they change?",
        "Latency and cost budget per query?",
        "Out-of-scope behavior: refuse, or answer from general knowledge?",
        "How will you measure that it works: what does the eval look like?"
      ],
      build: [
        "Ingest: chunk and embed into a vector store; justify chunk size and overlap.",
        "Retrieve: embed the query, pull a tight top-k, optionally rerank.",
        "Generate: a grounded, structured answer that cites its sources.",
        "Guardrail: abstain when retrieval is weak; never fabricate.",
        "Evaluate: a tiny eval set, scoring retrieval and generation separately."
      ],
      curveball: "The customer says answers are sometimes confidently wrong. Add a way to detect and cut low-grounding answers, and show a metric that proves it improved.",
      explain: [
        "Walk the six stages: scope, ingest, retrieve, generate, guardrails, evaluate.",
        "Show one strong answer and one correct refusal.",
        "State your eval numbers, retrieval and generation kept separate."
      ],
      reference: [
        "Evaluate retrieval (Precision@k, NDCG) and generation (faithfulness) separately.",
        "An abstain path with a confidence threshold beats a confident hallucination.",
        "Cite sources so answers are auditable.",
        "Cache embeddings and keep top-k tight to control cost and latency."
      ]
    },
    {
      id: "refactor",
      badge: "Build quality · adaptability",
      title: "Refactor under a new requirement, keep tests green",
      brief: "You're handed a working-but-gnarly module with a passing test suite. A new requirement lands. Ship it without breaking the tests or the readability.",
      clarify: [
        "What exactly is the new requirement, and are the existing tests the contract?",
        "Any performance or interface-stability constraints?",
        "Is readability itself part of what's being judged? (Usually yes.)"
      ],
      build: [
        "Run the tests first and understand current behavior before touching anything.",
        "Refactor in small, safe steps (extract, rename), tests green between each.",
        "Add the new behavior behind a clear seam; write tests for it.",
        "Keep the public interface stable unless changing it is the point."
      ],
      curveball: "A second, slightly conflicting requirement arrives. Show how your refactor made it a small change instead of a rewrite.",
      explain: [
        "Narrate the refactor as a sequence of green steps, not one big leap.",
        "Point to the seam that made the second change cheap.",
        "Show the test suite still passing at the end."
      ],
      reference: [
        "Characterization tests first to lock current behavior.",
        "Small green steps; never a long red period.",
        "New behavior isolated behind a seam; interface kept stable.",
        "Adaptability is proven by the second change being cheap, not the first."
      ]
    },
    {
      id: "webhooks",
      badge: "Platform · eventing",
      title: "Webhook delivery service with retries",
      brief: "Build a service that delivers event notifications to customer webhook URLs and keeps trying when they fail.",
      clarify: [
        "Delivery guarantee: at-least-once? Is ordering required?",
        "Retry and backoff policy, and when do you give up (dead-letter)?",
        "Do you sign payloads so customers can verify them?",
        "How do customers dedupe if they receive an event twice?"
      ],
      build: [
        "Accept events and enqueue them, decoupled from the producer.",
        "POST to the endpoint; treat non-2xx and timeouts as failures.",
        "Retry with exponential backoff and jitter, capped, then dead-letter.",
        "Sign payloads and include an idempotency key.",
        "Expose delivery status and basic observability."
      ],
      curveball: "A customer's endpoint is down for six hours, then comes back. Make sure their events aren't lost and don't replay in a thundering herd, and that one bad endpoint can't starve delivery to everyone else.",
      explain: [
        "State your delivery guarantee and how you achieve it.",
        "Walk the backoff strategy and the dead-letter path.",
        "Show how one slow customer is isolated from the rest."
      ],
      reference: [
        "A durable queue so events survive a crash; ingestion decoupled from delivery.",
        "Exponential backoff with jitter and a max-attempt cap, then dead-letter.",
        "Per-customer isolation so one slow endpoint can't block others.",
        "Signed payloads plus idempotency keys so customers can verify and dedupe."
      ]
    },
    {
      id: "evalharness",
      badge: "Applied-AI · evaluation",
      title: "Eval harness for an LLM feature",
      brief: "An LLM feature 'works on the demo' but nobody knows if a change makes it better or worse. Build an eval harness that answers that.",
      clarify: [
        "What exactly is the task, and what does 'correct' mean for it?",
        "Where does the eval set come from, and how representative is it?",
        "Offline eval on a fixed set, online on live traffic, or both?"
      ],
      build: [
        "Assemble a small, representative eval set with expected outputs or rubrics.",
        "Choose metrics that match the task (exact match, rubric score, faithfulness).",
        "Run the current system over the set and record scores reproducibly.",
        "Make it a one-command run any change can be measured against.",
        "Report per-case results so regressions are debuggable, not just an aggregate."
      ],
      curveball: "The task has no single right answer. Add an LLM-as-judge scorer, then show how you'd check the judge itself isn't biased or drifting.",
      explain: [
        "Explain how the eval set was built and why the metrics fit.",
        "State the pass/fail bar that makes 'better or worse' objective.",
        "Show a per-case view where a regression would surface."
      ],
      reference: [
        "A version-controlled eval set and reproducible run beat vibes-based checks.",
        "Metrics fit the task; per-case output makes regressions debuggable.",
        "Validate an LLM-judge against human labels on a sample before trusting it.",
        "A clear pass/fail bar so shipping decisions are objective."
      ]
    }
  ];

  var RUBRIC = [
    { key: "framing", name: "Customer framing", desc: "Did the design start from the customer's need?" },
    { key: "quality", name: "Build quality", desc: "Clean code and a genuinely working result, not a demo." },
    { key: "adapt", name: "Adaptability", desc: "Handled the curveball without breaking what worked." },
    { key: "explain", name: "Explanation", desc: "Could clearly walk someone through the decisions." }
  ];

  var INTERVALS = [0, 1, 3, 7, 16, 35]; // days per box
  var DAY = 86400000;

  // ---------- state ----------
  var KEY = "pg.v1";
  var state = load();

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "{}");
      s.patterns = s.patterns || {};
      s.decompDone = s.decompDone || [];
      s.rag = s.rag || {};
      s.builds = s.builds || {};
      s.reps = s.reps || 0;
      return s;
    } catch (e) {
      return { patterns: {}, decompDone: [], rag: {}, builds: {}, reps: 0 };
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    renderProgress();
  }

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---------- navigation ----------
  function showView(name) {
    $$(".view").forEach(function (v) { v.classList.toggle("is-active", v.getAttribute("data-view") === name); });
    $$(".tab").forEach(function (t) { t.classList.toggle("is-active", t.getAttribute("data-view") === name); });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "patterns") renderDeck();
    if (name === "decomp") renderDecomp();
    if (name === "builds") renderBuilds();
    if (name === "loop") renderProgress();
  }

  $("#tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab");
    if (b) showView(b.getAttribute("data-view"));
  });
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-goto]");
    if (g) showView(g.getAttribute("data-goto"));
  });

  // ---------- progress dashboard + ring ----------
  function computeProgress() {
    var dTotal = DECOMP.length, dDone = state.decompDone.length;
    var pTotal = PATTERNS.length;
    var pMat = PATTERNS.filter(function (p) { return cardState(p.id).box >= 3; }).length;
    var pDue = dueNow().length;
    var bTotal = BUILDS.length, bDone = BUILDS.filter(function (b) { return buildDone(b.id); }).length;
    var rTotal = RAG_STAGES.length, rDone = RAG_STAGES.filter(function (s) { return !!state.rag[s.id]; }).length;
    var overall = (dDone / dTotal + pMat / pTotal + bDone / bTotal + rDone / rTotal) / 4;
    return { dTotal: dTotal, dDone: dDone, pTotal: pTotal, pMat: pMat, pDue: pDue, bTotal: bTotal, bDone: bDone, rTotal: rTotal, rDone: rDone, overall: overall };
  }

  function renderProgress() {
    var g = computeProgress();

    // header ring
    var C = 2 * Math.PI * 16;
    var fg = $("#ringFg");
    if (fg) { fg.style.strokeDasharray = C.toFixed(1); fg.style.strokeDashoffset = (C * (1 - g.overall)).toFixed(1); }
    var pct = $("#ringPct");
    if (pct) pct.textContent = Math.round(g.overall * 100) + "%";

    // "due" nudge dot on the pattern deck tab
    var patTab = $('.tab[data-view="patterns"]');
    if (patTab) {
      var dot = patTab.querySelector(".due-dot");
      if (g.pDue > 0 && !dot) { dot = document.createElement("span"); dot.className = "due-dot"; patTab.appendChild(dot); }
      else if (g.pDue === 0 && dot) { dot.remove(); }
    }

    // dashboard
    var dash = $("#dashboard");
    if (!dash) return;
    dash.innerHTML = dashboardHTML(g);
    var rst = $("#dashReset", dash);
    if (rst) rst.addEventListener("click", resetAll);
  }

  function dashboardHTML(g) {
    function tile(view, label, valHTML, sub, frac, good) {
      return '<button class="dash-tile" data-goto="' + view + '">' +
        '<div class="dt-label">' + label + '</div>' +
        '<div class="dt-val">' + valHTML + '</div>' +
        '<div class="dt-sub">' + sub + '</div>' +
        '<div class="dt-bar' + (good ? " is-good" : "") + '"><span class="dt-fill" style="width:' + Math.round(frac * 100) + '%"></span></div>' +
        '</button>';
    }
    function of(n) { return '<span class="dt-of"> / ' + n + '</span>'; }
    var duePill = g.pDue > 0 ? '<span class="dt-pill">' + g.pDue + ' due</span>' : "";
    return '<div class="dash-head"><h3>Your progress</h3>' +
      '<button class="dash-reset" id="dashReset">Reset progress</button></div>' +
      '<div class="dash-tiles">' +
        tile("decomp", "Decomposition", g.dDone + of(g.dTotal), "prompts reviewed", g.dTotal ? g.dDone / g.dTotal : 0, g.dDone >= g.dTotal) +
        tile("patterns", "Pattern deck", g.pMat + of(g.pTotal) + duePill, "patterns maturing", g.pTotal ? g.pMat / g.pTotal : 0, g.pMat >= g.pTotal) +
        tile("builds", "Builds", g.bDone + of(g.bTotal), "self-scored", g.bTotal ? g.bDone / g.bTotal : 0, g.bDone >= g.bTotal) +
        tile("rag", "RAG framework", g.rDone + of(g.rTotal), "stages internalized", g.rTotal ? g.rDone / g.rTotal : 0, g.rDone >= g.rTotal) +
      '</div>';
  }

  function resetAll() {
    if (!window.confirm("Reset all saved progress on this device? This cannot be undone.")) return;
    state = { patterns: {}, decompDone: [], rag: {}, builds: {}, reps: 0 };
    queue = [];
    save();
    renderRag();
    renderDecomp();
    showView("loop");
  }

  // ---------- decomposition ----------
  var decompIndex = 0;
  function renderDecomp() {
    var p = DECOMP[decompIndex];
    var stage = $("#decompStage");
    var done = state.decompDone.indexOf(decompIndex) !== -1;
    stage.innerHTML =
      '<div class="decomp-card">' +
        '<div class="decomp-top">' +
          '<span class="decomp-badge">' + esc(p.badge) + '</span>' +
          '<p class="decomp-prompt">' + esc(p.prompt) + '</p>' +
        '</div>' +
        '<div class="decomp-body">' +
          '<p class="decomp-instruct">Write every clarifying question you would ask before proposing anything. Then reveal the dimensions strong candidates cover and check what you missed.</p>' +
          '<textarea class="decomp-input" id="decompInput" placeholder="Your clarifying questions..."></textarea>' +
          '<div class="decomp-actions">' +
            '<button class="btn btn-primary" id="revealBtn">Reveal the dimensions</button>' +
            '<button class="btn btn-ghost" id="markBtn">' + (done ? "Reviewed ✓" : "Mark reviewed") + '</button>' +
          '</div>' +
          '<div class="reveal-panel" id="revealPanel">' +
            '<p class="reveal-title">Dimensions a strong candidate surfaces</p>' +
            '<div class="dim-list">' + p.dims.map(dimHTML).join("") + '</div>' +
          '</div>' +
          '<div class="decomp-nav">' +
            '<button class="btn btn-ghost" id="prevPrompt">← Previous</button>' +
            '<span class="decomp-counter">' + (decompIndex + 1) + " / " + DECOMP.length + '</span>' +
            '<button class="btn btn-ghost" id="nextPrompt">Next →</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    $("#revealBtn").addEventListener("click", function () { $("#revealPanel").classList.add("show"); });
    $("#markBtn").addEventListener("click", function () {
      if (state.decompDone.indexOf(decompIndex) === -1) {
        state.decompDone.push(decompIndex);
        state.reps += 1;
        save();
        this.textContent = "Reviewed ✓";
      }
    });
    $("#prevPrompt").addEventListener("click", function () { decompIndex = (decompIndex - 1 + DECOMP.length) % DECOMP.length; renderDecomp(); });
    $("#nextPrompt").addEventListener("click", function () { decompIndex = (decompIndex + 1) % DECOMP.length; renderDecomp(); });
  }
  function dimHTML(d) {
    return '<div class="dim"><h4>' + esc(d.h) + "</h4><ul>" +
      d.q.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ul></div>";
  }

  // ---------- practical build track ----------
  var buildIndex = 0;
  function buildDone(id) {
    var s = state.builds[id];
    return !!(s && RUBRIC.every(function (r) { return s[r.key]; }));
  }
  function renderBuilds() {
    var b = BUILDS[buildIndex];
    var scores = state.builds[b.id] || {};
    var stage = $("#buildStage");
    stage.innerHTML =
      '<div class="build-card">' +
        '<div class="build-top">' +
          '<span class="build-badge">' + esc(b.badge) + '</span>' +
          '<h3 class="build-title">' + esc(b.title) + '</h3>' +
          '<p class="build-brief">' + esc(b.brief) + '</p>' +
        '</div>' +
        '<div class="build-body">' +
          stepBlock("1", "Clarify &amp; scope", "Lock these decisions before you write code.", listHTML(b.clarify)) +
          stepBlock("2", "Build it in your editor", "What a solid build includes. Timebox it like a take-home.", listHTML(b.build)) +
          stepBlock("3", "Handle the curveball", "Reveal only after your first version works.",
            '<button class="btn btn-ghost reveal-btn" data-reveal="cb">Reveal the curveball</button>' +
            '<div class="reveal-box" data-box="cb"><div class="curveball">' + esc(b.curveball) + '</div></div>') +
          stepBlock("4", "Explain it", "Record a 2-minute walkthrough covering:", listHTML(b.explain)) +
          stepBlock("5", "Self-score", "Rate yourself on the four dimensions interviewers actually use.", rubricHTML(b, scores)) +
          stepBlock("6", "What good looks like", "Attempt everything above first, then check yourself.",
            '<button class="btn btn-ghost reveal-btn" data-reveal="ref">Reveal the reference</button>' +
            '<div class="reveal-box" data-box="ref"><div class="reference"><h5>Signals of a strong build</h5><ul>' +
            b.reference.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul></div></div>') +
        '</div>' +
        '<div class="build-nav">' +
          '<button class="btn btn-ghost" id="prevBuild">← Previous</button>' +
          '<div class="build-pills">' + BUILDS.map(function (x) { return '<span class="bpill' + (buildDone(x.id) ? " done" : "") + '"></span>'; }).join("") + '</div>' +
          '<button class="btn btn-ghost" id="nextBuild">Next →</button>' +
        '</div>' +
      '</div>';

    $$('[data-reveal]', stage).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var box = $('[data-box="' + btn.getAttribute("data-reveal") + '"]', stage);
        if (box) { box.classList.add("show"); btn.style.display = "none"; }
      });
    });
    $$(".rate", stage).forEach(function (btn) {
      btn.addEventListener("click", function () { rate(b.id, btn.getAttribute("data-dim"), parseInt(btn.getAttribute("data-val"), 10)); });
    });
    $("#prevBuild").addEventListener("click", function () { buildIndex = (buildIndex - 1 + BUILDS.length) % BUILDS.length; renderBuilds(); });
    $("#nextBuild").addEventListener("click", function () { buildIndex = (buildIndex + 1) % BUILDS.length; renderBuilds(); });
  }
  function stepBlock(n, title, note, body) {
    return '<div class="build-step"><div class="step-h"><span class="step-n">' + n + '</span><h4>' + title + '</h4></div>' +
      (note ? '<p class="step-note">' + note + "</p>" : "") + body + "</div>";
  }
  function listHTML(items) {
    return '<ul class="build-list">' + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }
  function rubricHTML(b, scores) {
    var labels = { 1: "Poor", 2: "OK", 3: "Strong" };
    var rows = RUBRIC.map(function (r) {
      var chosen = scores[r.key];
      var buttons = [1, 2, 3].map(function (v) {
        return '<button class="rate' + (chosen === v ? " sel" : "") + '" data-dim="' + r.key + '" data-val="' + v + '">' + labels[v] + "</button>";
      }).join("");
      return '<div class="rubric-row"><div class="rubric-label"><div class="rl-name">' + esc(r.name) + '</div><div class="rl-desc">' + esc(r.desc) + '</div></div><div class="rate-group">' + buttons + "</div></div>";
    }).join("");
    return '<div class="rubric">' + rows + "</div>" + readinessHTML(b, scores);
  }
  function readinessHTML(b, scores) {
    var vals = RUBRIC.map(function (r) { return scores[r.key] || 0; });
    var rated = vals.filter(function (v) { return v > 0; }).length;
    if (rated < RUBRIC.length) {
      return '<div class="readiness"><span class="r-text">Rate all four to see your readiness on this build.</span></div>';
    }
    var total = vals.reduce(function (a, c) { return a + c; }, 0); // 4..12
    var pct = Math.round((total / 12) * 100);
    var msg = total >= 11 ? "Interview-ready on this one." : total >= 8 ? "Solid — tighten the weakest dimension." : "Rebuild it; target the lows.";
    return '<div class="readiness"><span class="r-ring">' + pct + '%</span><span class="r-text">' + msg + "</span></div>";
  }
  function rate(id, dim, val) {
    var s = state.builds[id] || {};
    var wasDone = buildDone(id);
    s[dim] = val;
    state.builds[id] = s;
    if (!wasDone && buildDone(id)) state.reps += 1; // count a build once, when fully self-scored
    save();
    renderBuilds();
  }

  // ---------- pattern deck (spaced repetition) ----------
  var queue = [];
  var current = null;
  var flipped = false;

  function cardState(id) { return state.patterns[id] || { box: 0, due: 0 }; }
  function dueNow() {
    var now = Date.now();
    return PATTERNS.filter(function (p) { return cardState(p.id).due <= now; });
  }
  function nextDueLabel() {
    var now = Date.now();
    var future = PATTERNS.map(function (p) { return cardState(p.id).due; }).filter(function (d) { return d > now; });
    if (!future.length) return "";
    var soonest = Math.min.apply(null, future);
    var hrs = Math.round((soonest - now) / 3600000);
    if (hrs < 24) return "Next review in ~" + Math.max(1, hrs) + "h";
    return "Next review in ~" + Math.round(hrs / 24) + "d";
  }

  function renderDeck() {
    flipped = false;
    if (!queue.length) queue = dueNow().map(function (p) { return p.id; });
    updateDueBadge();
    var stage = $("#deckStage");

    if (!queue.length) {
      current = null;
      stage.innerHTML =
        '<div class="deck-empty">' +
          '<h3>All caught up.</h3>' +
          '<p>' + (nextDueLabel() || "Nothing scheduled yet — start reviewing to build your schedule.") + '</p>' +
          '<button class="btn btn-primary" id="reviewAll">Review the full deck anyway</button>' +
        '</div>';
      $("#reviewAll").addEventListener("click", function () {
        queue = PATTERNS.map(function (p) { return p.id; });
        renderDeck();
      });
      return;
    }

    current = PATTERNS.filter(function (p) { return p.id === queue[0]; })[0];
    stage.innerHTML =
      '<div class="flashcard" id="flashcard">' +
        '<p class="fc-side-label">The tell</p>' +
        '<p class="fc-tell">' + esc(current.tell) + '</p>' +
        '<p class="fc-hint">Name the pattern in your head first, then check yourself.</p>' +
        '<button class="btn btn-primary fc-reveal" id="revealCard">Show the answer</button>' +
      '</div>' +
      '<div class="deck-progress">' +
        '<div class="deck-track"><div class="deck-fill" id="deckFill"></div></div>' +
        '<div class="deck-legend"><span>' + queue.length + ' left this session</span><span id="masteredCount"></span></div>' +
      '</div>';

    $("#revealCard").addEventListener("click", flip);
    $("#flashcard").addEventListener("click", flip);
    updateDeckProgress();
  }

  function flip() {
    if (flipped || !current) return;
    flipped = true;
    var fc = $("#flashcard");
    fc.style.cursor = "default";
    fc.innerHTML =
      '<p class="fc-side-label">Pattern</p>' +
      '<p class="fc-answer">' + esc(current.name) + '</p>' +
      '<p class="fc-why">' + esc(current.why) + '</p>' +
      '<p class="grade-prompt">How well did you recall it? Your grade sets when this card comes back.</p>' +
      '<div class="grade-row">' +
        gradeBtn("again", "Again", "back this round") +
        gradeBtn("hard", "Hard", "in " + nextLabel(current.id, "hard")) +
        gradeBtn("good", "Good", "in " + nextLabel(current.id, "good")) +
        gradeBtn("easy", "Easy", "in " + nextLabel(current.id, "easy")) +
      '</div>';
    $$(".grade", fc).forEach(function (b) {
      b.addEventListener("click", function () { grade(b.getAttribute("data-grade")); });
    });
  }
  function gradeBtn(g, key, sub) {
    return '<button class="grade" data-grade="' + g + '"><span class="g-key">' + key + '</span><span class="g-sub">' + sub + '</span></button>';
  }
  function humanDays(d) {
    if (d < 1) return "now";
    if (d < 7) return d + "d";
    if (d < 30) return Math.round(d / 7) + "w";
    return Math.round(d / 30) + "mo";
  }
  function nextLabel(id, g) {
    var box = cardState(id).box;
    if (g === "again") return "now";
    if (g === "hard") box = Math.max(1, box);
    else if (g === "good") box = Math.min(INTERVALS.length - 1, box + 1);
    else if (g === "easy") box = Math.min(INTERVALS.length - 1, box + 2);
    return humanDays(INTERVALS[box]);
  }

  function grade(g) {
    if (!current) return;
    var cs = cardState(current.id);
    var box = cs.box;
    if (g === "again") box = 0;
    else if (g === "hard") box = Math.max(1, box);
    else if (g === "good") box = Math.min(INTERVALS.length - 1, box + 1);
    else if (g === "easy") box = Math.min(INTERVALS.length - 1, box + 2);

    var due = g === "again" ? Date.now() : Date.now() + INTERVALS[box] * DAY;
    state.patterns[current.id] = { box: box, due: due };
    state.reps += 1;
    save();

    var id = queue.shift();
    if (g === "again") queue.push(id); // reappears later this session
    flipped = false;
    renderDeck();
  }

  function updateDueBadge() {
    var n = dueNow().length;
    $("#dueBadge").textContent = n + (n === 1 ? " due" : " due");
  }
  function updateDeckProgress() {
    var mastered = PATTERNS.filter(function (p) { return cardState(p.id).box >= 3; }).length;
    var fill = $("#deckFill");
    if (fill) fill.style.width = Math.round((mastered / PATTERNS.length) * 100) + "%";
    var mc = $("#masteredCount");
    if (mc) mc.textContent = mastered + " / " + PATTERNS.length + " maturing";
  }

  // ---------- rag checklist ----------
  function renderRag() {
    var grid = $("#ragGrid");
    grid.innerHTML = RAG_STAGES.map(function (s) {
      var checked = state.rag[s.id] ? " checked" : "";
      return '<div class="rag-stage">' +
        '<span class="rs-step">' + esc(s.step) + '</span>' +
        '<h4>' + esc(s.h) + '</h4>' +
        '<p>' + esc(s.p) + '</p>' +
        '<label class="rag-check"><input type="checkbox" data-rag="' + s.id + '"' + checked + '> Internalized</label>' +
        '</div>';
    }).join("");
    $$('input[data-rag]', grid).forEach(function (cb) {
      cb.addEventListener("change", function () {
        state.rag[cb.getAttribute("data-rag")] = cb.checked;
        save();
      });
    });
  }

  // ---------- reset ----------
  $("#resetProgress").addEventListener("click", resetAll);

  // ---------- util ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- init ----------
  renderProgress();
  renderRag();
  renderDecomp();
})();
