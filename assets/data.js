/* Proving Ground  - content layer. Plain globals (classic script), no build step.
 * Structure: TRACKS -> MODULES. Each module runs a Learn -> Practice -> Quiz -> Reinforce loop.
 * PROBLEMS are the coding-playground bank; recall cards drive spaced repetition. */

/* ===================== TRACKS ===================== */
var TRACKS = [
  { id: "dsa", name: "Algorithms & Data Structures", short: "DSA", blurb: "The LeetCode-style pattern round. Recognize the pattern, then implement it under time pressure." },
  { id: "fde", name: "Forward Deployed", short: "FDE", blurb: "Decomposition under ambiguity, practical builds, and customer framing  - the loop AI companies actually run." },
  { id: "platform", name: "Platform & Cloud", short: "Platform", blurb: "Applied system design, reliability, and infrastructure. Pragmatic design over algorithm puzzles." },
  { id: "ai", name: "Applied AI", short: "AI", blurb: "RAG, agents, and evals  - the emerging applied-AI interview, still forming." }
];

/* ===================== CODING PROBLEM BANK ===================== */
var PROBLEMS = [
  {
    id: "two-sum", title: "Two Sum", difficulty: "Easy", pattern: "Hashing / Two Pointers",
    prompt: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Exactly one solution exists. Return them as [i, j] with i < j.",
    fnName: "twoSum",
    starter: "function twoSum(nums, target) {\n  // return [i, j] with i < j\n\n}",
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 5, 3, 7], 12], expected: [1, 3] }
    ],
    solution: "function twoSum(nums, target) {\n  const seen = {};\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (need in seen) return [seen[need], i];\n    seen[nums[i]] = i;\n  }\n}"
  },
  {
    id: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", pattern: "Two Pointers",
    prompt: "Return true if s is a palindrome, considering only alphanumeric characters and ignoring case.",
    fnName: "isPalindrome",
    starter: "function isPalindrome(s) {\n  // return true or false\n\n}",
    tests: [
      { args: ["A man, a plan, a canal: Panama"], expected: true },
      { args: ["race a car"], expected: false },
      { args: [" "], expected: true },
      { args: ["0P"], expected: false }
    ],
    solution: "function isPalindrome(s) {\n  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let i = 0, j = t.length - 1;\n  while (i < j) { if (t[i] !== t[j]) return false; i++; j--; }\n  return true;\n}"
  },
  {
    id: "max-profit", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", pattern: "Sliding Window / Greedy",
    prompt: "Given prices where prices[i] is the price on day i, return the maximum profit from buying on one day and selling on a later day. Return 0 if no profit is possible.",
    fnName: "maxProfit",
    starter: "function maxProfit(prices) {\n  // return the max profit\n\n}",
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1, 2]], expected: 1 },
      { args: [[2, 4, 1]], expected: 2 }
    ],
    solution: "function maxProfit(prices) {\n  let min = Infinity, best = 0;\n  for (const p of prices) { min = Math.min(min, p); best = Math.max(best, p - min); }\n  return best;\n}"
  },
  {
    id: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy", pattern: "Hashing",
    prompt: "Return true if any value appears at least twice in nums, and false if every element is distinct.",
    fnName: "containsDuplicate",
    starter: "function containsDuplicate(nums) {\n  // return true or false\n\n}",
    tests: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[]], expected: false },
      { args: [[1, 1, 1, 1]], expected: true }
    ],
    solution: "function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}"
  },
  {
    id: "max-subarray", title: "Maximum Subarray", difficulty: "Easy", pattern: "Dynamic Programming",
    prompt: "Return the largest sum of any contiguous subarray of nums (the subarray must contain at least one element).",
    fnName: "maxSubArray",
    starter: "function maxSubArray(nums) {\n  // return the largest contiguous sum\n\n}",
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1, -2, -3]], expected: -1 }
    ],
    solution: "function maxSubArray(nums) {\n  let cur = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); best = Math.max(best, cur); }\n  return best;\n}"
  },
  {
    id: "binary-search", title: "Binary Search", difficulty: "Easy", pattern: "Modified Binary Search",
    prompt: "Given a sorted (ascending) array nums and a target, return the index of target, or -1 if it is not present. Aim for O(log n).",
    fnName: "search",
    starter: "function search(nums, target) {\n  // return the index or -1\n\n}",
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[], 1], expected: -1 }
    ],
    solution: "function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}"
  },
  {
    id: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", pattern: "Hashing",
    prompt: "Return true if t is an anagram of s (same characters with the same counts), otherwise false.",
    fnName: "isAnagram",
    starter: "function isAnagram(s, t) {\n  // return true or false\n\n}",
    tests: [
      { args: ["anagram", "nagaram"], expected: true },
      { args: ["rat", "car"], expected: false },
      { args: ["a", "ab"], expected: false },
      { args: ["ab", "ba"], expected: true }
    ],
    solution: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const c = {};\n  for (const ch of s) c[ch] = (c[ch] || 0) + 1;\n  for (const ch of t) { if (!c[ch]) return false; c[ch]--; }\n  return true;\n}"
  }
];

/* ===================== DECOMPOSITION PROMPTS ===================== */
var DECOMP = [
  { badge: "FDE · data integration", prompt: "A customer sends us a messy CSV of their orders every day. Build something that turns it into clean, queryable data.", dims: [ { h: "Inputs", q: ["What's the schema, and is it stable day to day?", "Encoding, delimiter, size, how is it delivered?"] }, { h: "Constraints", q: ["One-time or recurring? What cadence?", "What happens on a bad file: retry, alert, skip?"] }, { h: "Scale", q: ["Rows per day now, and expected growth?", "How many customers / feeds like this?"] }, { h: "Edge cases", q: ["Malformed rows, missing fields, duplicates?", "Partial or late files?"] }, { h: "Success criteria", q: ["What does 'queryable' mean: a DB, an API, a dashboard?", "Who queries it and how often?"] }, { h: "Ambiguities", q: ["Existing pipeline or warehouse to fit into?", "Auth, PII, retention requirements?"] } ] },
  { badge: "Applied-AI · retrieval", prompt: "Design the retrieval layer for a customer's private knowledge base so their chatbot can answer questions from it.", dims: [ { h: "Inputs", q: ["Document types, volume, and update frequency?", "One tenant or many (isolation)?"] }, { h: "Constraints", q: ["Latency budget per query?", "Cost ceiling; freshness requirement?"] }, { h: "Scale", q: ["Number of documents and total tokens?", "Queries per second at peak?"] }, { h: "Edge cases", q: ["Out-of-scope questions: refuse or fall back?", "Stale or conflicting documents; no good match?"] }, { h: "Success criteria", q: ["How do we measure answer quality: what evals?", "Retrieval vs generation quality separately?"] }, { h: "Ambiguities", q: ["Chunking and embedding strategy?", "Privacy, access control, audit needs?"] } ] },
  { badge: "Platform · reliability", prompt: "Build a rate limiter for our public API.", dims: [ { h: "Inputs", q: ["Limit per user, per IP, per key, per endpoint?", "What identifies a caller?"] }, { h: "Constraints", q: ["What limits and window shape?", "Single node or distributed? Fail open or closed?"] }, { h: "Scale", q: ["Requests per second and number of clients?", "How many gateway nodes share state?"] }, { h: "Edge cases", q: ["Bursts, clock skew, race conditions?", "Response on limit: 429, headers, retry-after?"] }, { h: "Success criteria", q: ["Accuracy vs performance tradeoff acceptable?", "Observability: who's being throttled?"] }, { h: "Ambiguities", q: ["Algorithm: token bucket, sliding window?", "Shared store: Redis, in-memory, gateway-native?"] } ] },
  { badge: "Platform · observability", prompt: "A team wants a dashboard showing the health of their data pipelines.", dims: [ { h: "Inputs", q: ["Which pipelines, and what defines 'health'?", "Where does the telemetry come from?"] }, { h: "Constraints", q: ["Real-time or periodic refresh?", "Data retention window?"] }, { h: "Scale", q: ["How many pipelines and event volume?", "How many viewers, how often?"] }, { h: "Edge cases", q: ["A pipeline down vs degraded?", "Missing data; alerting on top?"] }, { h: "Success criteria", q: ["What decisions should this drive?", "Primary user: on-call, lead, exec?"] }, { h: "Ambiguities", q: ["Existing tooling (Grafana, Datadog)?", "Build vs configure?"] } ] },
  { badge: "FDE · systems integration", prompt: "A customer wants their Salesforce data synced into our product every night so their reps see it in-app.", dims: [ { h: "Inputs", q: ["Which objects and fields; full or incremental?", "Their Salesforce edition and API limits?"] }, { h: "Constraints", q: ["Nightly enough, or near-real-time?", "One-way or bidirectional; API rate limits?"] }, { h: "Scale", q: ["Record counts today and growth?", "How many customers run this sync?"] }, { h: "Edge cases", q: ["Deleted records, field conflicts, schema changes?", "A sync that fails halfway?"] }, { h: "Success criteria", q: ["What does 'synced' mean: freshness SLA, reconciled counts?", "Who notices first if it breaks?"] }, { h: "Ambiguities", q: ["Per-tenant OAuth and PII handling?", "Existing ETL to reuse?"] } ] },
  { badge: "Platform · eventing", prompt: "Design a system that reliably delivers event notifications to customers' webhook endpoints.", dims: [ { h: "Inputs", q: ["Which events, what payload shape?", "How many endpoints per customer?"] }, { h: "Constraints", q: ["At-least-once or exactly-once?", "Ordering guaranteed; delivery latency target?"] }, { h: "Scale", q: ["Events per second and fan-out?", "Number of subscribers?"] }, { h: "Edge cases", q: ["Endpoint down/slow: retries and backoff?", "Poison events, duplicate delivery, thundering herd?"] }, { h: "Success criteria", q: ["Delivery success rate; dead-letter handling?", "What observability do customers get?"] }, { h: "Ambiguities", q: ["Payload signing and verification?", "Idempotency keys and replay?"] } ] },
  { badge: "Applied-AI · agents", prompt: "Build an agent that can take actions in a customer's system on their behalf, like updating records or sending messages.", dims: [ { h: "Inputs", q: ["Which tools/actions, and what triggers a run?", "What context does the agent get?"] }, { h: "Constraints", q: ["Latency and cost per run?", "Which actions require human approval?"] }, { h: "Scale", q: ["Runs per day and concurrency?", "How many tools?"] }, { h: "Edge cases", q: ["A wrong or harmful action, a failed tool?", "Ambiguous instructions or a loop?"] }, { h: "Success criteria", q: ["Task success rate, and how measured?", "What does a good eval look like?"] }, { h: "Ambiguities", q: ["Guardrails, approval gates, permission scoping?", "Auditability of every action?"] } ] },
  { badge: "Applied-AI · internal tool", prompt: "Our support team wants an internal tool that surfaces past tickets similar to the one they're working on.", dims: [ { h: "Inputs", q: ["Which ticket fields, and how much history?", "Similarity by text, metadata, or both?"] }, { h: "Constraints", q: ["Latency per search; freshness of new tickets?", "Privacy or on-prem requirements?"] }, { h: "Scale", q: ["Number of tickets and searches per day?", "Concurrent agents?"] }, { h: "Edge cases", q: ["No similar ticket; stale or duplicate tickets?", "PII inside ticket text?"] }, { h: "Success criteria", q: ["Do agents resolve faster? How is 'similar' judged?", "How measured?"] }, { h: "Ambiguities", q: ["Build vs reuse existing search?", "Ranking signals and a feedback loop?"] } ] }
];

/* ===================== PRACTICAL BUILDS ===================== */
var RUBRIC = [
  { key: "framing", name: "Customer framing", desc: "Did the design start from the customer's need?" },
  { key: "quality", name: "Build quality", desc: "Clean code and a genuinely working result, not a demo." },
  { key: "adapt", name: "Adaptability", desc: "Handled the curveball without breaking what worked." },
  { key: "explain", name: "Explanation", desc: "Could clearly walk someone through the decisions." }
];
var BUILDS = [
  { id: "csv", badge: "FDE · data integration", title: "Messy CSV → clean, queryable data", brief: "A customer drops a CSV of their orders into a folder every night. Build a small tool that turns each file into clean, queryable data your team can trust.", clarify: ["Pick the target: SQLite, Parquet + DuckDB, or a query API. Justify it.", "Define the canonical schema and the natural key for a unique order.", "Decide failure behavior: quarantine bad rows with reasons, never crash.", "Decide idempotency: re-running the same file must not double-count."], build: ["Parse robustly: encoding, delimiter, header-name variance.", "Validate and coerce types; collect row-level errors.", "Deduplicate on the natural key; make the run idempotent.", "Write to your store; emit a summary: rows in, out, rejected.", "A real CLI: input path, --dry-run, --verbose."], curveball: "Some nightly files now arrive gzipped, and occasionally a file is a partial re-send of yesterday. Handle both without reprocessing or duplicating data, and without changing the command your team already runs.", explain: ["Lead with the customer's need, not your architecture.", "Run it on a deliberately messy file; show the summary counts.", "Justify your dedupe strategy and bad-row handling."], reference: ["Idempotent upserts on a natural key, so re-runs are safe.", "Bad rows quarantined with reasons, not dropped silently.", "Config over hardcoding; re-runnable and observable.", "A working end-to-end run, not a notebook."] },
  { id: "ratelimit", badge: "Platform · reliability", title: "Rate limiter for a public API", brief: "Add rate limiting to a public API so one noisy client can't degrade it for everyone.", clarify: ["Per user, per IP, per key, per endpoint?", "What limit and window shape; single-node or distributed?", "Fail open or fail closed if the store is unavailable?", "Response contract: 429 with Retry-After and headers?"], build: ["Choose an algorithm (token bucket or sliding window); justify it.", "Get the boundary right: no double-count race.", "Return 429 with Retry-After and rate-limit headers.", "Make limits configurable per route or plan.", "Degrade gracefully if the store is down; don't 500."], curveball: "You now run three API nodes behind a load balancer. Make the limit global across nodes, and reason about what happens when the shared store has 50ms latency or briefly goes down.", explain: ["Walk your algorithm choice and its burst behavior.", "Explain the distributed-state tradeoff.", "Show the failure mode when the store is unavailable."], reference: ["Token bucket tolerates bursts; sliding window is smoother.", "Atomic increment (Redis INCR/EXPIRE or Lua) avoids races.", "Graceful degradation beats hard failures.", "Standard headers, per-plan config, a demo that recovers."] },
  { id: "rag", badge: "Applied-AI · retrieval", title: "Minimal RAG service with an 'I don't know'", brief: "Build a minimal RAG service that answers questions over a folder of a customer's documents, and can tell you when it doesn't know.", clarify: ["Document types, volume, and change frequency?", "Latency and cost budget per query?", "Out-of-scope behavior: refuse or general-knowledge?", "How will you measure that it works?"], build: ["Ingest: chunk and embed; justify chunk size and overlap.", "Retrieve: embed the query, pull a tight top-k, maybe rerank.", "Generate: a grounded, structured answer citing sources.", "Guardrail: abstain when retrieval is weak; never fabricate.", "Evaluate: a tiny eval set, retrieval and generation separately."], curveball: "The customer says answers are sometimes confidently wrong. Add a way to detect and cut low-grounding answers, and show a metric that proves it improved.", explain: ["Walk the six stages of the RAG framework.", "Show one strong answer and one correct refusal.", "State your eval numbers, kept separate."], reference: ["Evaluate retrieval (Precision@k, NDCG) and generation (faithfulness) separately.", "An abstain path beats a confident hallucination.", "Cite sources so answers are auditable.", "Cache embeddings; keep top-k tight for cost."] },
  { id: "refactor", badge: "Build quality · adaptability", title: "Refactor under a new requirement, keep tests green", brief: "You're handed a working-but-gnarly module with a passing test suite. A new requirement lands. Ship it without breaking the tests or the readability.", clarify: ["What exactly is the new requirement; are the tests the contract?", "Any performance or interface-stability constraints?", "Is readability part of what's judged? (Usually yes.)"], build: ["Run the tests first; understand current behavior.", "Refactor in small, safe steps, tests green between each.", "Add the new behavior behind a clear seam; test it.", "Keep the public interface stable unless changing it is the point."], curveball: "A second, slightly conflicting requirement arrives. Show how your refactor made it a small change instead of a rewrite.", explain: ["Narrate the refactor as green steps, not one leap.", "Point to the seam that made the second change cheap.", "Show the suite still passing."], reference: ["Characterization tests first to lock behavior.", "Small green steps; never a long red period.", "New behavior isolated; interface stable.", "Adaptability proven by the second change being cheap."] },
  { id: "webhooks", badge: "Platform · eventing", title: "Webhook delivery service with retries", brief: "Build a service that delivers event notifications to customer webhook URLs and keeps trying when they fail.", clarify: ["Delivery guarantee: at-least-once? Ordering required?", "Retry and backoff policy; when to dead-letter?", "Do you sign payloads for verification?", "How do customers dedupe a repeat?"], build: ["Accept events and enqueue them, decoupled from the producer.", "POST to the endpoint; non-2xx and timeouts are failures.", "Retry with exponential backoff and jitter, capped, then dead-letter.", "Sign payloads and include an idempotency key.", "Expose delivery status and observability."], curveball: "A customer's endpoint is down for six hours, then comes back. Make sure their events aren't lost and don't replay in a thundering herd, and that one bad endpoint can't starve delivery to everyone else.", explain: ["State your delivery guarantee and how you achieve it.", "Walk the backoff strategy and dead-letter path.", "Show how one slow customer is isolated."], reference: ["A durable queue; ingestion decoupled from delivery.", "Exponential backoff with jitter and a max-attempt cap.", "Per-customer isolation so one endpoint can't block others.", "Signed payloads and idempotency keys."] },
  { id: "evalharness", badge: "Applied-AI · evaluation", title: "Eval harness for an LLM feature", brief: "An LLM feature 'works on the demo' but nobody knows if a change makes it better or worse. Build an eval harness that answers that.", clarify: ["What is the task, and what does 'correct' mean?", "Where does the eval set come from; how representative?", "Offline, online, or both?"], build: ["Assemble a small, representative eval set with expected outputs or rubrics.", "Choose metrics that match the task.", "Run the current system over the set; record scores reproducibly.", "Make it a one-command run any change can be measured against.", "Report per-case results so regressions are debuggable."], curveball: "The task has no single right answer. Add an LLM-as-judge scorer, then show how you'd check the judge itself isn't biased or drifting.", explain: ["Explain how the eval set was built and why the metrics fit.", "State the pass/fail bar.", "Show a per-case view where a regression would surface."], reference: ["A version-controlled eval set and reproducible run beat vibes.", "Metrics fit the task; per-case output for debugging.", "Validate an LLM-judge against human labels first.", "A clear pass/fail bar for objective shipping decisions."] }
];

/* ===================== RAG / AGENT FRAMEWORK ===================== */
var RAG_STAGES = [
  { id: "scope", step: "Stage 1", h: "Scope", p: "Inputs, outputs, latency budget, cost ceiling, and what a wrong answer costs. Frame the problem before any architecture." },
  { id: "ingest", step: "Stage 2", h: "Ingest", p: "Chunk and embed source documents into a vector store. Justify chunk size, overlap, and indexing choices out loud." },
  { id: "retrieve", step: "Stage 3", h: "Retrieve", p: "Embed the query, pull a tight top-k, and consider reranking. Retrieve less but more relevant to control cost and noise." },
  { id: "act", step: "Stage 4", h: "Act / Generate", p: "Structured output for reliability. For agents, define the tools, their schemas, and approval gates before any action." },
  { id: "guard", step: "Stage 5", h: "Guardrails", p: "Refuse out-of-scope requests, validate outputs, and route to a human above confidence or risk thresholds." },
  { id: "eval", step: "Stage 6", h: "Evaluate", p: "Measure retrieval and generation quality separately so you can localize failures, and track them over time." }
];

/* ===================== PATTERN RECOGNITION CARDS ===================== */
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
  { id: "greedy", tell: "Reach a global optimum by making the locally best choice each step (activity selection, jump game).", name: "Greedy", why: "When a local optimum provably leads to the global one, sort by the right key and take greedily." },
  { id: "binsearchans", tell: "Minimize the maximum, or maximize the minimum, where feasibility is monotonic in the answer.", name: "Binary Search on the Answer", why: "If 'can we do it within budget X?' is monotonic, binary-search X and test feasibility each step." },
  { id: "bitmask", tell: "Toggle or count bits, find the one non-duplicated number, or enumerate subsets compactly.", name: "Bit Manipulation", why: "XOR cancels pairs; a bitmask stores a whole set in one integer for fast set operations." },
  { id: "trie", tell: "Many prefix lookups, autocomplete, or dictionary word search.", name: "Trie (Prefix Tree)", why: "Shared prefixes become shared paths, so a lookup costs O(word length) regardless of dictionary size." },
  { id: "quickselect", tell: "Find the k-th smallest or largest element without fully sorting.", name: "Quickselect", why: "Partition like quicksort but recurse into only one side, averaging O(n)." },
  { id: "dutch", tell: "Sort an array of three distinct categories in a single pass (0/1/2, colors).", name: "Dutch National Flag", why: "Three pointers partition into low, mid, and high regions in one linear scan." },
  { id: "treedfs", tell: "Compute a value for each node from its children: subtree sums, height, or diameter.", name: "Tree DFS (Postorder)", why: "Recurse to the children first, then combine their results at the parent in one traversal." }
];

/* ===================== MODULES =====================
 * learn: { intro, points:[{h,p}], template:{lang,code}|null, example:{h,p}|null }
 * practice: { type:"code"|"decomp"|"build"|"framework", refs:[ids], note }
 * quiz: array of { q, choices:[], answer:index, explain }  OR  { code:"problem-id" }
 * recall: [ {front, back} ]  (spaced-repetition cards)  OR  patternIds for the deck module */
var MODULES = [
  /* ---------- DSA ---------- */
  {
    id: "two-pointers", track: "dsa", title: "Two Pointers", kicker: "Core pattern", est: "45 min",
    learn: {
      intro: "Two pointers is the workhorse of array and string problems. Instead of nesting two loops (O(n²)), you keep two indices and move them with intent  - usually inward from both ends, or one chasing the other  - so the whole thing is a single pass.",
      points: [
        { h: "When to reach for it", p: "A sorted array where you need a pair or triplet; comparing elements from both ends; partitioning or removing in place; merging two sorted inputs." },
        { h: "The two shapes", p: "Opposite ends (left = 0, right = n−1, move based on a comparison) for sorted-pair and palindrome problems. Same direction (slow / fast) for in-place removal and cycle detection." },
        { h: "Why it's fast", p: "Each pointer moves at most n steps, so the scan is O(n) time and O(1) extra space  - the line you say out loud in the interview." }
      ],
      template: { lang: "JavaScript", code: "let i = 0, j = arr.length - 1;\nwhile (i < j) {\n  const sum = arr[i] + arr[j];\n  if (sum === target) return [i, j];\n  if (sum < target) i++;   // need bigger, advance left\n  else j--;                // need smaller, retreat right\n}" },
      example: { h: "Worked example: Valid Palindrome", p: "Point at both ends, skip non-alphanumeric characters, compare the two characters, and walk inward. One pass, no reversed copy, O(1) space." }
    },
    practice: { type: "code", refs: ["valid-palindrome", "two-sum"], note: "Two Sum is the hashing cousin: once you internalize the two-pointer instinct on a sorted array, notice how a hash map does the same job when it isn't sorted." },
    quiz: [
      { q: "You're given a SORTED array and must find whether any two numbers sum to a target. Best first instinct?", choices: ["Nested loops, O(n²)", "Two pointers from both ends", "Sort it again, then binary search each element", "Recursion with memoization"], answer: 1, explain: "It's already sorted, so move inward: if the sum is too small advance the left pointer, too big retreat the right. O(n) time, O(1) space." },
      { q: "Which problem is NOT a natural two-pointers fit?", choices: ["Reverse a string in place", "Container with most water", "Count distinct substrings of a string", "Merge two sorted arrays"], answer: 2, explain: "Counting distinct substrings wants a set or suffix structure. The other three all pair naturally with two moving indices." },
      { code: "valid-palindrome" }
    ],
    recall: [
      { front: "The two shapes of two-pointers?", back: "Opposite ends (sorted pairs, palindromes) and slow/fast same-direction (in-place removal, cycle detection)." },
      { front: "Time and space of a two-pointer scan?", back: "O(n) time, O(1) extra space  - each pointer moves at most n steps." },
      { front: "On a sorted array, if arr[i] + arr[j] is too small, which pointer moves?", back: "Advance i (left) to increase the sum." }
    ]
  },
  {
    id: "hashing", track: "dsa", title: "Hashing", kicker: "Core pattern", est: "40 min",
    learn: {
      intro: "Hashing trades space for time. A hash map or set turns 'have I seen this?' or 'where is this?' from an O(n) scan into an O(1) lookup  - the most common way to drop an O(n²) brute force to O(n).",
      points: [
        { h: "When to reach for it", p: "Membership tests, counting frequencies, finding complements (two-sum style), grouping, and deduplication." },
        { h: "The tradeoff to say out loud", p: "O(n) time, O(n) space. Almost always worth it, but name the extra memory  - interviewers listen for it." },
        { h: "Watch out", p: "Key types and meaning: a stringified array key, order not being preserved, and collisions in how you build the key." }
      ],
      template: { lang: "JavaScript", code: "const seen = new Map();\nfor (const x of arr) {\n  const k = key(x);\n  if (seen.has(k)) { /* found a match */ }\n  seen.set(k, value);\n}" },
      example: { h: "Worked example: Valid Anagram", p: "Count each character of s, then decrement with each character of t. Any missing character or a count that goes negative means it isn't an anagram. O(n)." }
    },
    practice: { type: "code", refs: ["contains-duplicate", "valid-anagram", "two-sum"], note: "All three collapse an O(n²) scan into O(n) with a set or map. Say the space cost as you go." },
    quiz: [
      { q: "The cleanest way to check if two strings are anagrams?", choices: ["Sort both and compare", "Count characters in one, decrement with the other", "Nested loop matching each character", "Reverse one and compare"], answer: 1, explain: "Counting is O(n) versus sorting's O(n log n): increment from s, decrement from t, and any miss or negative count means not an anagram." },
      { q: "Contains Duplicate in one line uses:", choices: ["A sorted array", "A Set and a size comparison", "Two pointers", "Binary search"], answer: 1, explain: "new Set(nums).size !== nums.length  - the set collapses duplicates, so a size mismatch means one existed." },
      { code: "contains-duplicate" }
    ],
    recall: [
      { front: "What does hashing trade, and what does it buy?", back: "Trades O(n) space for O(1) lookups  - turning many O(n²) brute forces into O(n)." },
      { front: "One-liner for Contains Duplicate?", back: "new Set(nums).size !== nums.length" }
    ]
  },
  {
    id: "sliding-window", track: "dsa", title: "Sliding Window", kicker: "Core pattern", est: "40 min",
    learn: {
      intro: "A sliding window keeps a contiguous run of elements and moves its edges instead of recomputing each subrange. It turns 'best subarray/substring of some size or condition' from O(n²) into O(n).",
      points: [
        { h: "When to reach for it", p: "Longest / shortest / best contiguous subarray or substring under a constraint (sum, distinct characters, at most k of something)." },
        { h: "Fixed vs dynamic", p: "Fixed window: slide a constant width and update in O(1). Dynamic window: grow the right edge, and shrink from the left while the constraint is violated." },
        { h: "The invariant", p: "State (a running sum, a character count) is updated as edges move, never rebuilt  - that's where the O(n) comes from." }
      ],
      template: { lang: "JavaScript", code: "let left = 0, best = 0, sum = 0;\nfor (let right = 0; right < arr.length; right++) {\n  sum += arr[right];\n  while (sum > limit) { sum -= arr[left]; left++; }\n  best = Math.max(best, right - left + 1);\n}" },
      example: { h: "Related: Best Time to Buy and Sell Stock", p: "A degenerate window: track the lowest price so far (the left edge) and the best profit if you sold today (the right edge). One pass." }
    },
    practice: { type: "code", refs: ["max-profit"], note: "Best Time to Buy/Sell is the gateway: a single pass tracking a running minimum. Build the habit of updating state as the window moves." },
    quiz: [
      { q: "'Longest substring with at most K distinct characters' is a signal for:", choices: ["Dynamic programming", "A dynamic sliding window", "Binary search", "Union-find"], answer: 1, explain: "Grow the right edge; while more than K distinct, shrink from the left. Track the max width seen." },
      { code: "max-profit" }
    ],
    recall: [
      { front: "Fixed vs dynamic window?", back: "Fixed: constant width, O(1) update per slide. Dynamic: grow right, shrink left while the constraint is violated." },
      { front: "Where does the O(n) come from?", back: "State is updated as edges move, never recomputed from scratch." }
    ]
  },
  {
    id: "dynamic-programming", track: "dsa", title: "Dynamic Programming", kicker: "Core pattern", est: "60 min",
    learn: {
      intro: "Dynamic programming solves problems with overlapping subproblems by defining a state, writing a recurrence between states, and remembering each result once. The hard part isn't the code  - it's naming the state.",
      points: [
        { h: "When to reach for it", p: "Optimize (min/max/count) under a sequence of choices where the same subproblem recurs: knapsack, coin change, edit distance, longest common subsequence." },
        { h: "The three questions", p: "What is the state (what fully describes a subproblem)? What is the recurrence (how do states combine)? What are the base cases?" },
        { h: "Kadane's shortcut", p: "For Maximum Subarray the state is 'best sum ending here'; either extend the previous run or start fresh at the current element." }
      ],
      template: { lang: "JavaScript", code: "// Kadane: state = best sum ending at i\nlet cur = nums[0], best = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  cur = Math.max(nums[i], cur + nums[i]);\n  best = Math.max(best, cur);\n}" },
      example: { h: "Worked example: Maximum Subarray", p: "At each index, the best subarray ending here is either just this element or this element added to the best ending at the previous index. Track the running best." }
    },
    practice: { type: "code", refs: ["max-subarray"], note: "Maximum Subarray (Kadane) is the cleanest first DP: one variable of state, an obvious recurrence. Say the state out loud before you code." },
    quiz: [
      { q: "The single most important step in a DP problem is:", choices: ["Writing the loops", "Defining the state precisely", "Choosing the language", "Adding memoization"], answer: 1, explain: "Once the state and recurrence are right, the code is mechanical. A vague state is where DP attempts fail." },
      { q: "In Kadane's algorithm, the state at index i is:", choices: ["The total sum so far", "The best subarray sum ENDING at i", "The number of positive elements", "The max element seen"], answer: 1, explain: "Best-ending-here either extends the previous run or restarts at nums[i]; the global answer is the max over all i." },
      { code: "max-subarray" }
    ],
    recall: [
      { front: "The three questions of any DP?", back: "What's the state? What's the recurrence? What are the base cases?" },
      { front: "Kadane's state definition?", back: "Best subarray sum ending at index i = max(nums[i], cur + nums[i])." }
    ]
  },
  {
    id: "binary-search", track: "dsa", title: "Binary Search", kicker: "Core pattern", est: "40 min",
    learn: {
      intro: "Binary search halves the search space each step by asking a yes/no question whose answer is monotonic. It's not just for sorted arrays  - it's for any answer space where 'is X feasible?' flips from no to yes exactly once.",
      points: [
        { h: "When to reach for it", p: "A sorted (or rotated-sorted) array; or any problem asking to minimize the max / maximize the min where feasibility is monotonic in the answer." },
        { h: "The invariant", p: "Keep the target inside [lo, hi]. Decide carefully whether to use lo <= hi or lo < hi, and whether to move mid ± 1  - off-by-one is the classic bug." },
        { h: "Binary search on the answer", p: "When you can't search positions, search the answer value: guess X, test feasibility in O(n), and narrow. Common in 'minimum capacity / speed' problems." }
      ],
      template: { lang: "JavaScript", code: "let lo = 0, hi = nums.length - 1;\nwhile (lo <= hi) {\n  const mid = (lo + hi) >> 1;\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) lo = mid + 1;\n  else hi = mid - 1;\n}\nreturn -1;" },
      example: { h: "Worked example: classic Binary Search", p: "Maintain [lo, hi]. Compare the midpoint to the target and discard the half that cannot contain it. O(log n)." }
    },
    practice: { type: "code", refs: ["binary-search"], note: "Get the boundary conditions muscle-memory clean here  - empty array, single element, target absent. Those edge cases are where interviews are won or lost." },
    quiz: [
      { q: "'Minimize the maximum load across k workers' is a signal for:", choices: ["Plain binary search on the array", "Binary search on the ANSWER (feasibility is monotonic)", "Dynamic programming", "A heap"], answer: 1, explain: "Guess a max-load X, check feasibility in O(n), and binary-search X. Feasibility flips from no to yes exactly once." },
      { q: "The most common binary-search bug is:", choices: ["Using recursion", "Off-by-one in the bounds or mid update", "Sorting first", "Returning the value instead of the index"], answer: 1, explain: "The lo/hi update and the <= vs < condition must keep the target inside the range; get them consistent." },
      { code: "binary-search" }
    ],
    recall: [
      { front: "When can you binary search something that isn't a sorted array?", back: "When 'is answer X feasible?' is monotonic  - search the answer value and test feasibility." },
      { front: "The classic binary-search bug?", back: "Off-by-one in the bounds / mid ± 1 / the <= vs < condition." }
    ]
  },
  {
    id: "pattern-recognition", track: "dsa", title: "Pattern Recognition Deck", kicker: "Reinforcement", est: "ongoing",
    learn: {
      intro: "The transferable DSA skill isn't memorizing 300 solutions  - it's reading a novel problem and knowing which of ~20 patterns it maps to. This deck drills exactly that: the tell, then the pattern.",
      points: [
        { h: "How to use it", p: "Read the tell, name the pattern in your head, reveal, and grade honestly. Cards you miss come back sooner." },
        { h: "Why recognition first", p: "In a real interview the problem is unlabeled. Recognizing the shape is what unlocks the template you drilled in the other modules." }
      ],
      template: null, example: null
    },
    practice: { type: "deck", refs: [], note: "This module's practice IS the full 25-card recognition deck under Reinforce." },
    quiz: [
      { q: "'Longest contiguous subarray under a sum limit' most likely wants:", choices: ["Sliding window", "Union-find", "Trie", "Two heaps"], answer: 0, explain: "Contiguous + longest/shortest under a constraint is the sliding-window tell." },
      { q: "'Order tasks given prerequisites' most likely wants:", choices: ["Greedy", "Topological sort", "Binary search", "Dutch national flag"], answer: 1, explain: "Dependencies with an ordering (and possible cycle detection) is topological sort." },
      { q: "'Find the median of a running stream' most likely wants:", choices: ["Prefix sum", "Two heaps", "Quickselect", "Monotonic stack"], answer: 1, explain: "A max-heap for the lower half and a min-heap for the upper half give O(1) median access." }
    ],
    recall: "DECK" /* special: use the full PATTERNS deck */
  },
  /* ---------- FDE ---------- */
  {
    id: "decomposition", track: "fde", title: "Decomposition Under Ambiguity", kicker: "Signature round", est: "50 min",
    learn: {
      intro: "The FDE decomposition round is graded on how you break down a problem you've never seen  - not on landing the optimal answer. Premature solutioning is the single most common reason candidates are rejected. Your job: pin the problem down before you touch a solution.",
      points: [
        { h: "Clarify across six dimensions", p: "Inputs, constraints, scale, edge cases, success criteria, and the ambiguities you'd resolve with the customer. Hit these and you look senior." },
        { h: "It's scored twice", p: "Good clarifying questions count under both Communication and Problem Solving in the rubric  - the highest-leverage habit in any loop." },
        { h: "Think out loud", p: "Narrate the tradeoffs you're weighing. Silence reads as either stuck or reckless." }
      ],
      template: null,
      example: { h: "The move", p: "Before proposing anything, state your assumptions as questions: 'I'm assuming this is a recurring nightly job, not one-time  - is that right?' Then design against the answers." }
    },
    practice: { type: "decomp", refs: [0, 4, 1], note: "Work each prompt: write your clarifying questions first, then reveal the dimensions and check what you missed." },
    quiz: [
      { q: "The single most common reason candidates fail the FDE decomposition round?", choices: ["Wrong time complexity", "Jumping to a solution before clarifying", "Not knowing the language", "Slow typing"], answer: 1, explain: "The round scores your reasoning process; leaping to a solution skips the part being evaluated." },
      { q: "A strong clarifying question about a data pipeline would be:", choices: ["What's your favorite database?", "Is this one-time or recurring, and what's the freshness SLA?", "Can I use Python?", "How big is your team?"], answer: 1, explain: "It resolves a real ambiguity (cadence, freshness) that changes the design. That's what interviewers reward." }
    ],
    recall: [
      { front: "The six clarification dimensions?", back: "Inputs, constraints, scale, edge cases, success criteria, ambiguities." },
      { front: "Why is jumping to code penalized?", back: "The round grades your reasoning process; premature solutioning skips exactly what's being scored, and it's the #1 rejection reason." }
    ]
  },
  {
    id: "practical-builds-fde", track: "fde", title: "Practical Builds", kicker: "Take-home", est: "ongoing",
    learn: {
      intro: "FDE coding is practical, not LeetCode-hard: parse a messy CSV, wire an integration, ship a small service. The take-home wants a running build and a clear walkthrough, scored on four dimensions.",
      points: [
        { h: "The four scored dimensions", p: "Customer framing, build quality (clean code + a genuinely working result, not a demo), adaptability (handle the curveball), and explanation." },
        { h: "Build-and-extend", p: "Expect a multi-part task: build the core, then extend it when a new requirement lands mid-exercise. Design seams so the extension is cheap." },
        { h: "Ship, then explain", p: "A working, well-explained solution beats a clever, silent one every time." }
      ],
      template: null, example: null
    },
    practice: { type: "build", refs: ["csv", "refactor"], note: "Do each in your own editor, handle the curveball, then self-score on the four dimensions." },
    quiz: [
      { q: "The FDE take-home is primarily scored on:", choices: ["Algorithmic complexity", "Customer framing, build quality, adaptability, explanation", "Lines of code", "Which framework you used"], answer: 1, explain: "It mirrors real delivery: did you start from the customer, ship something that works, adapt to change, and explain it clearly?" },
      { q: "'Build quality' in this rubric means:", choices: ["A slick demo that isn't wired up", "Clean code AND a genuinely working, deployable result", "The most clever one-liner", "Maximum abstraction"], answer: 1, explain: "Demos that don't actually run score poorly; they want production-minded, working code." }
    ],
    recall: [
      { front: "The four FDE build dimensions?", back: "Customer framing, build quality, adaptability, explanation." },
      { front: "What is 'build-and-extend'?", back: "A multi-part task: build the core, then extend when a new requirement lands mid-exercise  - design seams so the change is cheap." }
    ]
  },
  /* ---------- PLATFORM ---------- */
  {
    id: "system-design-ambiguity", track: "platform", title: "System Design Under Ambiguity", kicker: "Applied design", est: "50 min",
    learn: {
      intro: "Platform and cloud interviews favor applied, pragmatic design over algorithm puzzles. The structure is the same everywhere: clarify requirements, sketch a high-level design, then lead the deep dives  - and the depth you lead scales with your seniority.",
      points: [
        { h: "The arc", p: "Requirements and scope → high-level design → deep dives on the risky parts → wrap up. Time-box it so you don't sink the whole session into one corner." },
        { h: "Seniority signal", p: "Junior candidates can let the interviewer surface weak points; senior and staff candidates are expected to find and lead those deep dives themselves." },
        { h: "Reason about tradeoffs", p: "Reliability, cost, and latency pull against each other. Name the tradeoff you're making, don't just pick." }
      ],
      template: null,
      example: { h: "The move", p: "For a rate limiter or webhook system, start from the guarantees (at-least-once? global limit?) and the failure modes, not the boxes on the diagram." }
    },
    practice: { type: "decomp", refs: [2, 5, 3], note: "These are platform-flavored decomposition prompts. Clarify the guarantees and failure modes before you design." },
    quiz: [
      { q: "How does the system-design bar shift with seniority?", choices: ["Senior candidates write more code", "Senior/staff must find weak points and lead deep dives themselves", "Junior candidates get harder problems", "It doesn't change"], answer: 1, explain: "The round is designed to detect exactly this: can you proactively steer to the risky parts, or do you wait to be led?" },
      { q: "Designing a webhook delivery system, you should start from:", choices: ["The database schema", "The delivery guarantee and failure modes", "The programming language", "The UI"], answer: 1, explain: "Guarantees (at-least-once, ordering) and failure handling (retries, dead-letter, isolation) drive the whole architecture." }
    ],
    recall: [
      { front: "The system-design arc?", back: "Requirements → high-level design → deep dives on the risky parts → wrap up (time-boxed)." },
      { front: "What scales with seniority in system design?", back: "How proactively you find weak points and lead the deep dives yourself." }
    ]
  },
  {
    id: "reliability-builds", track: "platform", title: "Reliability Builds", kicker: "Take-home", est: "ongoing",
    learn: {
      intro: "Platform take-homes probe production thinking: rate limiting, reliable delivery, graceful degradation. They want to see you reason about concurrency, failure, and isolation  - not just the happy path.",
      points: [
        { h: "Design for failure first", p: "What happens when the store is slow or down? When an endpoint is dead for hours? Fail open or closed  - and say why." },
        { h: "Isolation", p: "One noisy client or one dead endpoint must not degrade everyone else. Per-tenant isolation is a senior tell." },
        { h: "Idempotency and retries", p: "Exponential backoff with jitter, capped, then dead-letter. Idempotency keys so retries and duplicates are safe." }
      ],
      template: null, example: null
    },
    practice: { type: "build", refs: ["ratelimit", "webhooks"], note: "Both hinge on the curveball: distributed state and a recovering-from-outage thundering herd. That's where the real signal is." },
    quiz: [
      { q: "A dead customer endpoint recovers after six hours. The danger to design against is:", choices: ["Too few logs", "A thundering herd of replayed events, and starving other customers", "Slow typing", "Wrong HTTP method"], answer: 1, explain: "Backoff with jitter plus per-customer isolation prevents both the herd and one endpoint blocking delivery to everyone else." },
      { q: "The safe retry primitive for a rate-limit counter across nodes is:", choices: ["A local variable", "An atomic increment (e.g. Redis INCR/EXPIRE or a Lua script)", "A file on disk", "A random delay"], answer: 1, explain: "Atomicity avoids the double-count race when multiple nodes update the shared counter concurrently." }
    ],
    recall: [
      { front: "Backoff strategy for webhook retries?", back: "Exponential backoff with jitter, capped at a max attempt count, then dead-letter." },
      { front: "Why per-tenant isolation?", back: "So one noisy client or one dead endpoint can't degrade delivery/service for everyone else." }
    ]
  },
  /* ---------- AI ---------- */
  {
    id: "rag-agents", track: "ai", title: "RAG & Agent Design", kicker: "Applied-AI design", est: "50 min",
    learn: {
      intro: "The applied-AI design round has an emerging canonical shape. Walk any RAG or agent question through six stages out loud, and separate the parts most candidates skip: guardrails and evaluation.",
      points: [
        { h: "The six stages", p: "Scope → Ingest → Retrieve → Act/Generate → Guardrails → Evaluate. Naming them is half the battle." },
        { h: "Guardrails aren't optional", p: "Refuse out-of-scope requests, validate outputs, and route to a human above a confidence threshold. An abstain path beats a confident hallucination." },
        { h: "Evaluate the two halves separately", p: "When an answer is wrong, was it bad retrieval or bad generation? Score retrieval (Precision@k, NDCG) and generation (faithfulness) independently to localize failures." }
      ],
      template: null,
      example: { h: "The move", p: "For 'design retrieval over a private knowledge base', justify chunk size, top-k, and how you'd measure quality  - the eval story is what separates strong candidates." }
    },
    practice: { type: "framework", refs: ["scope", "ingest", "retrieve", "act", "guard", "eval"], note: "Tick each stage as you can run a real RAG/agent question through it unaided." },
    quiz: [
      { q: "When a RAG answer is wrong, your FIRST diagnostic question is:", choices: ["Was it the temperature?", "Bad retrieval or bad generation?", "Which model?", "Was the prompt too long?"], answer: 1, explain: "Evaluating retrieval and generation separately lets you localize the failure instead of guessing." },
      { q: "The right response when retrieval is weak / out of scope is:", choices: ["Answer confidently anyway", "Abstain or route to a human above a threshold", "Increase max tokens", "Retry the same query"], answer: 1, explain: "Guardrails: a designed abstain path and human fallback beat a confident hallucination." },
      { q: "A standard retrieval-quality metric is:", choices: ["BLEU", "NDCG@k", "F1 on the whole answer", "Perplexity"], answer: 1, explain: "Retrieval is ranking: Precision@k, Recall@k, Hit Rate, and NDCG@k are the classic metrics." }
    ],
    recall: [
      { front: "The six RAG/agent stages?", back: "Scope, Ingest, Retrieve, Act/Generate, Guardrails, Evaluate." },
      { front: "Why evaluate retrieval and generation separately?", back: "To localize a wrong answer: was it bad retrieval or model hallucination?" },
      { front: "Retrieval-quality metrics?", back: "Precision@k, Recall@k, Hit Rate, NDCG@k." }
    ]
  },
  {
    id: "ai-evals", track: "ai", title: "Evals & LLM Judging", kicker: "Take-home", est: "ongoing",
    learn: {
      intro: "If you can't measure whether a change makes an LLM feature better or worse, you're shipping on vibes. Evals are the applied-AI equivalent of a test suite, and building one is a common take-home.",
      points: [
        { h: "A reproducible eval set", p: "A small, representative, version-controlled set with expected outputs or rubrics, run by one command so any change can be scored against it." },
        { h: "LLM-as-judge, validated", p: "For open-ended tasks, an LLM judge is standard  - but validate it against human labels on a sample before you trust it, and watch for bias and drift." },
        { h: "Per-case, not just aggregate", p: "Report per-case results so a regression is debuggable, not just a number that moved." }
      ],
      template: null, example: null
    },
    practice: { type: "build", refs: ["evalharness"], note: "Build the harness, then handle the curveball: an LLM-as-judge scorer whose own reliability you have to defend." },
    quiz: [
      { q: "Before trusting an LLM-as-judge, you should:", choices: ["Nothing, it's fine", "Validate it against human labels on a sample", "Use the largest model", "Only judge short answers"], answer: 1, explain: "LLM judges reach near-human agreement on some tasks but carry bias and drift  - check correlation with human labels first." },
      { q: "The most useful eval output for debugging is:", choices: ["A single aggregate score", "Per-case results showing which inputs regressed", "The token count", "The latency"], answer: 1, explain: "Per-case results let you see exactly what broke; an aggregate only tells you something moved." }
    ],
    recall: [
      { front: "What makes an eval trustworthy vs vibes?", back: "A reproducible, version-controlled eval set run by one command, with per-case results." },
      { front: "Before trusting an LLM-as-judge?", back: "Validate it against human labels on a sample; watch for bias and drift." }
    ]
  }
];
