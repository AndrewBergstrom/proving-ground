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
    { id: "prefix", tell: "Many range-sum queries, or a subarray summing to exactly K.", name: "Prefix Sum", why: "Precompute cumulative sums so any range is one subtraction; hash prefixes for subarray targets." }
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
      s.reps = s.reps || 0;
      return s;
    } catch (e) {
      return { patterns: {}, decompDone: [], rag: {}, reps: 0 };
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    renderProgressChip();
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
  }

  $("#tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab");
    if (b) showView(b.getAttribute("data-view"));
  });
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-goto]");
    if (g) showView(g.getAttribute("data-goto"));
  });

  // ---------- progress chip ----------
  function renderProgressChip() { $("#pcNum").textContent = String(state.reps); }

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
        '<p class="fc-hint">Recall the pattern, then tap to flip</p>' +
      '</div>' +
      '<div class="deck-progress">' +
        '<div class="deck-track"><div class="deck-fill" id="deckFill"></div></div>' +
        '<div class="deck-legend"><span>' + queue.length + ' in this session</span><span id="masteredCount"></span></div>' +
      '</div>';

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
      '<div class="grade-row">' +
        gradeBtn("again", "Again", "missed") +
        gradeBtn("hard", "Hard", "slow") +
        gradeBtn("good", "Good", "got it") +
        gradeBtn("easy", "Easy", "instant") +
      '</div>';
    $$(".grade", fc).forEach(function (b) {
      b.addEventListener("click", function () { grade(b.getAttribute("data-grade")); });
    });
  }
  function gradeBtn(g, key, sub) {
    return '<button class="grade" data-grade="' + g + '"><span class="g-key">' + key + '</span><span class="g-sub">' + sub + '</span></button>';
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
  $("#resetProgress").addEventListener("click", function () {
    if (!window.confirm("Reset all saved progress on this device? This cannot be undone.")) return;
    state = { patterns: {}, decompDone: [], rag: {}, reps: 0 };
    queue = [];
    save();
    renderRag();
    renderDecomp();
    showView("loop");
  });

  // ---------- util ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- init ----------
  renderProgressChip();
  renderRag();
  renderDecomp();
})();
