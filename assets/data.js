/* Proving Ground  - content layer. Plain globals (classic script), no build step.
 * Structure: TRACKS -> MODULES. Each module runs a Learn -> Practice -> Quiz -> Reinforce loop.
 * PROBLEMS are the coding-playground bank; recall cards drive spaced repetition. */

/* ===================== TRACKS ===================== */
var TRACKS = [
  { id: "foundations", name: "Foundations", short: "Basics", blurb: "New to this? Start here. The assumed knowledge - Big-O, arrays, loops, and hashing - explained from zero, so the rest of the app actually makes sense." },
  { id: "dsa", name: "Algorithms & Data Structures", short: "DSA", blurb: "The LeetCode-style pattern round. Recognize the pattern, then implement it under time pressure." },
  { id: "fde", name: "Forward Deployed", short: "FDE", blurb: "Decomposition under ambiguity, systems integration, orchestrating AI coding agents, and translating tech to stakeholders  - the practical-engineer loop AI companies actually run." },
  { id: "platform", name: "Platform & Cloud", short: "Platform", blurb: "Applied system design, infrastructure as code, CI/CD, observability, and incident response. Pragmatic production thinking over algorithm puzzles." },
  { id: "ai", name: "Applied AI", short: "AI", blurb: "RAG, agents, and evals  - the emerging applied-AI interview, still forming." },
  { id: "data-eng", name: "Data Engineering", short: "Data", blurb: "SQL, pipelines, and modeling. The data-plumbing loop, with a sensor and meter-data slant that fits energy and water companies." },
  { id: "data-sci", name: "Data Science & ML", short: "DS/ML", blurb: "Statistics, data wrangling, machine learning, and model evaluation - including the time-series forecasting behind energy and water analytics." }
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
    solution: "function twoSum(nums, target) {\n  const seen = {};\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (need in seen) return [seen[need], i];\n    seen[nums[i]] = i;\n  }\n}",
    starterPy: "def twoSum(nums, target):\n    # return [i, j] with i < j\n    pass",
    solutionPy: "def twoSum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        need = target - n\n        if need in seen:\n            return [seen[need], i]\n        seen[n] = i"
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
    solution: "function isPalindrome(s) {\n  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let i = 0, j = t.length - 1;\n  while (i < j) { if (t[i] !== t[j]) return false; i++; j--; }\n  return true;\n}",
    starterPy: "def isPalindrome(s):\n    # return True or False\n    pass",
    solutionPy: "def isPalindrome(s):\n    t = [c.lower() for c in s if c.isalnum()]\n    return t == t[::-1]"
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
    solution: "function maxProfit(prices) {\n  let min = Infinity, best = 0;\n  for (const p of prices) { min = Math.min(min, p); best = Math.max(best, p - min); }\n  return best;\n}",
    starterPy: "def maxProfit(prices):\n    # return the max profit\n    pass",
    solutionPy: "def maxProfit(prices):\n    lo, best = float('inf'), 0\n    for p in prices:\n        lo = min(lo, p)\n        best = max(best, p - lo)\n    return best"
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
    solution: "function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}",
    starterPy: "def containsDuplicate(nums):\n    # return True or False\n    pass",
    solutionPy: "def containsDuplicate(nums):\n    return len(set(nums)) != len(nums)"
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
    solution: "function maxSubArray(nums) {\n  let cur = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); best = Math.max(best, cur); }\n  return best;\n}",
    starterPy: "def maxSubArray(nums):\n    # return the largest contiguous sum\n    pass",
    solutionPy: "def maxSubArray(nums):\n    cur = best = nums[0]\n    for n in nums[1:]:\n        cur = max(n, cur + n)\n        best = max(best, cur)\n    return best"
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
    solution: "function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}",
    starterPy: "def search(nums, target):\n    # return the index or -1\n    pass",
    solutionPy: "def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1"
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
    solution: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const c = {};\n  for (const ch of s) c[ch] = (c[ch] || 0) + 1;\n  for (const ch of t) { if (!c[ch]) return false; c[ch]--; }\n  return true;\n}",
    starterPy: "def isAnagram(s, t):\n    # return True or False\n    pass",
    solutionPy: "def isAnagram(s, t):\n    from collections import Counter\n    return Counter(s) == Counter(t)"
  },
  {
    id: "sum-array", title: "Sum an Array", difficulty: "Intro", pattern: "Loops · O(n)",
    prompt: "Return the sum of all the numbers in nums. An empty array sums to 0. You visit each of the n items once, which is what makes this O(n).",
    fnName: "sumArray",
    starter: "function sumArray(nums) {\n  // add up every number and return the total\n\n}",
    tests: [{ args: [[1, 2, 3]], expected: 6 }, { args: [[]], expected: 0 }, { args: [[5]], expected: 5 }, { args: [[-1, 1]], expected: 0 }],
    solution: "function sumArray(nums) {\n  let total = 0;\n  for (const n of nums) total += n;\n  return total;\n}",
    starterPy: "def sumArray(nums):\n    # add up every number and return the total\n    pass",
    solutionPy: "def sumArray(nums):\n    total = 0\n    for n in nums:\n        total += n\n    return total"
  },
  {
    id: "last-element", title: "Last Element", difficulty: "Intro", pattern: "Indexing · O(1)",
    prompt: "Return the last item in nums, or null if nums is empty. For n items the last index is n-1, because indexes start at 0. Jumping straight to an index is O(1).",
    fnName: "lastElement",
    starter: "function lastElement(nums) {\n  // return the last item, or null if empty\n\n}",
    tests: [{ args: [[1, 2, 3]], expected: 3 }, { args: [[9]], expected: 9 }, { args: [["a", "b"]], expected: "b" }, { args: [[]], expected: null }],
    solution: "function lastElement(nums) {\n  return nums.length ? nums[nums.length - 1] : null;\n}",
    starterPy: "def lastElement(nums):\n    # return the last item, or None if empty\n    pass",
    solutionPy: "def lastElement(nums):\n    return nums[len(nums) - 1] if nums else None"
  },
  {
    id: "count-positives", title: "Count Positives", difficulty: "Intro", pattern: "Loops · O(n)",
    prompt: "Return how many numbers in nums are greater than 0. Loop through once and keep a counter - a classic O(n) scan.",
    fnName: "countPositives",
    starter: "function countPositives(nums) {\n  // count how many numbers are greater than 0\n\n}",
    tests: [{ args: [[-1, 2, -3, 4]], expected: 2 }, { args: [[1, 2, 3]], expected: 3 }, { args: [[-1, -2]], expected: 0 }, { args: [[]], expected: 0 }],
    solution: "function countPositives(nums) {\n  let count = 0;\n  for (const n of nums) if (n > 0) count++;\n  return count;\n}",
    starterPy: "def countPositives(nums):\n    # count how many numbers are greater than 0\n    pass",
    solutionPy: "def countPositives(nums):\n    count = 0\n    for n in nums:\n        if n > 0:\n            count += 1\n    return count"
  },
  {
    id: "mean", title: "Mean (Average)", difficulty: "Easy", pattern: "Statistics",
    prompt: "Return the mean (average) of nums: the sum divided by how many numbers there are. Assume nums has at least one number.",
    fnName: "mean",
    starter: "function mean(nums) {\n  // return the average\n\n}",
    tests: [{ args: [[1, 2, 3]], expected: 2 }, { args: [[2, 4]], expected: 3 }, { args: [[1, 2]], expected: 1.5 }, { args: [[10]], expected: 10 }],
    solution: "function mean(nums) {\n  let sum = 0;\n  for (const n of nums) sum += n;\n  return sum / nums.length;\n}",
    starterPy: "def mean(nums):\n    # return the average\n    pass",
    solutionPy: "def mean(nums):\n    return sum(nums) / len(nums)"
  },
  {
    id: "median", title: "Median", difficulty: "Easy", pattern: "Statistics",
    prompt: "Return the median of nums: the middle value after sorting. If the count is even, return the average of the two middle values.",
    fnName: "median",
    starter: "function median(nums) {\n  // sort, then return the middle (or the average of the two middle values)\n\n}",
    tests: [{ args: [[3, 1, 2]], expected: 2 }, { args: [[1, 2, 3, 4]], expected: 2.5 }, { args: [[5]], expected: 5 }, { args: [[4, 1, 2, 3]], expected: 2.5 }],
    solution: "function median(nums) {\n  const a = [...nums].sort((x, y) => x - y);\n  const m = Math.floor(a.length / 2);\n  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;\n}",
    starterPy: "def median(nums):\n    # sort, then return the middle (or the average of the two middle values)\n    pass",
    solutionPy: "def median(nums):\n    a = sorted(nums)\n    m = len(a) // 2\n    if len(a) % 2:\n        return a[m]\n    return (a[m - 1] + a[m]) / 2"
  },
  {
    id: "moving-average", title: "Moving Average", difficulty: "Easy", pattern: "Time series",
    prompt: "Return the moving average of nums over a window of size k: the average of each group of k consecutive values, left to right. Example: [1,2,3,4] with k=2 gives [1.5, 2.5, 3.5]. This is how you smooth noisy sensor or demand data.",
    fnName: "movingAverage",
    starter: "function movingAverage(nums, k) {\n  // average of each consecutive window of size k\n\n}",
    tests: [{ args: [[1, 2, 3, 4], 2], expected: [1.5, 2.5, 3.5] }, { args: [[2, 4, 6], 3], expected: [4] }, { args: [[1, 2, 3], 1], expected: [1, 2, 3] }, { args: [[10, 20], 2], expected: [15] }],
    solution: "function movingAverage(nums, k) {\n  const res = [];\n  for (let i = 0; i + k <= nums.length; i++) {\n    let s = 0;\n    for (let j = i; j < i + k; j++) s += nums[j];\n    res.push(s / k);\n  }\n  return res;\n}",
    starterPy: "def movingAverage(nums, k):\n    # average of each consecutive window of size k\n    pass",
    solutionPy: "def movingAverage(nums, k):\n    res = []\n    for i in range(len(nums) - k + 1):\n        res.append(sum(nums[i:i+k]) / k)\n    return res"
  },
  {
    id: "rmse", title: "RMSE (Forecast Error)", difficulty: "Easy", pattern: "Model evaluation",
    prompt: "Return the Root Mean Squared Error between actual and predicted (same length): the square root of the average of the squared differences. RMSE is the standard score for how far off a forecast is.",
    fnName: "rmse",
    starter: "function rmse(actual, predicted) {\n  // sqrt of the mean of the squared differences\n\n}",
    tests: [{ args: [[1, 2, 3], [1, 2, 3]], expected: 0 }, { args: [[2, 2], [5, 5]], expected: 3 }, { args: [[0, 0, 0], [2, 2, 2]], expected: 2 }, { args: [[10], [13]], expected: 3 }],
    solution: "function rmse(actual, predicted) {\n  let s = 0;\n  for (let i = 0; i < actual.length; i++) {\n    const d = actual[i] - predicted[i];\n    s += d * d;\n  }\n  return Math.sqrt(s / actual.length);\n}",
    starterPy: "def rmse(actual, predicted):\n    import math\n    # sqrt of the mean of the squared differences\n    pass",
    solutionPy: "def rmse(actual, predicted):\n    import math\n    s = 0\n    for a, p in zip(actual, predicted):\n        s += (a - p) ** 2\n    return math.sqrt(s / len(actual))"
  },
  {
    id: "accuracy", title: "Accuracy", difficulty: "Easy", pattern: "Model evaluation",
    prompt: "Return the accuracy: the fraction of predictions that match the labels (same length). Example: 3 of 4 correct gives 0.75.",
    fnName: "accuracy",
    starter: "function accuracy(predictions, labels) {\n  // fraction of predictions that equal the label\n\n}",
    tests: [{ args: [[1, 0, 1], [1, 0, 1]], expected: 1 }, { args: [[1, 1], [0, 0]], expected: 0 }, { args: [[1, 0, 1, 1], [1, 0, 0, 1]], expected: 0.75 }, { args: [[1], [1]], expected: 1 }],
    solution: "function accuracy(predictions, labels) {\n  let c = 0;\n  for (let i = 0; i < predictions.length; i++) if (predictions[i] === labels[i]) c++;\n  return c / predictions.length;\n}",
    starterPy: "def accuracy(predictions, labels):\n    # fraction of predictions that equal the label\n    pass",
    solutionPy: "def accuracy(predictions, labels):\n    c = 0\n    for p, l in zip(predictions, labels):\n        if p == l:\n            c += 1\n    return c / len(predictions)"
  },
  {
    id: "is-subsequence", title: "Is Subsequence", difficulty: "Easy", pattern: "Two Pointers",
    prompt: "Return true if s is a subsequence of t: all characters of s appear in t in the same order (not necessarily next to each other). Walk one pointer through each string.",
    fnName: "isSubsequence",
    starter: "function isSubsequence(s, t) {\n  // return true or false\n\n}",
    tests: [{ args: ["abc", "ahbgdc"], expected: true }, { args: ["axc", "ahbgdc"], expected: false }, { args: ["", "abc"], expected: true }, { args: ["abc", "abc"], expected: true }],
    solution: "function isSubsequence(s, t) {\n  let i = 0;\n  for (const c of t) {\n    if (i < s.length && s[i] === c) i++;\n  }\n  return i === s.length;\n}",
    starterPy: "def isSubsequence(s, t):\n    # return True or False\n    pass",
    solutionPy: "def isSubsequence(s, t):\n    i = 0\n    for c in t:\n        if i < len(s) and s[i] == c:\n            i += 1\n    return i == len(s)"
  },
  {
    id: "max-window-sum", title: "Max Sum of Size-K Window", difficulty: "Easy", pattern: "Sliding Window",
    prompt: "Return the largest sum of any k consecutive numbers in nums. Slide a fixed window of size k: add the new number, drop the one that left, no recomputing.",
    fnName: "maxWindowSum",
    starter: "function maxWindowSum(nums, k) {\n  // largest sum of any k consecutive numbers\n\n}",
    tests: [{ args: [[1, 2, 3, 4], 2], expected: 7 }, { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 }, { args: [[5], 1], expected: 5 }, { args: [[1, 1, 1], 2], expected: 2 }],
    solution: "function maxWindowSum(nums, k) {\n  let s = 0;\n  for (let i = 0; i < k; i++) s += nums[i];\n  let best = s;\n  for (let i = k; i < nums.length; i++) {\n    s += nums[i] - nums[i - k];\n    best = Math.max(best, s);\n  }\n  return best;\n}",
    starterPy: "def maxWindowSum(nums, k):\n    # largest sum of any k consecutive numbers\n    pass",
    solutionPy: "def maxWindowSum(nums, k):\n    s = sum(nums[:k])\n    best = s\n    for i in range(k, len(nums)):\n        s += nums[i] - nums[i - k]\n        best = max(best, s)\n    return best"
  },
  {
    id: "max-vowels", title: "Max Vowels in a Window", difficulty: "Medium", pattern: "Sliding Window",
    prompt: "Return the maximum number of vowels (a, e, i, o, u) in any window of k consecutive characters of s. Same sliding-window idea, counting vowels as the window moves.",
    fnName: "maxVowels",
    starter: "function maxVowels(s, k) {\n  // max vowels in any window of size k\n\n}",
    tests: [{ args: ["abciiidef", 3], expected: 3 }, { args: ["aeiou", 2], expected: 2 }, { args: ["leetcode", 3], expected: 2 }, { args: ["rhythms", 4], expected: 0 }],
    solution: "function maxVowels(s, k) {\n  const v = new Set(['a', 'e', 'i', 'o', 'u']);\n  let c = 0;\n  for (let i = 0; i < k; i++) if (v.has(s[i])) c++;\n  let best = c;\n  for (let i = k; i < s.length; i++) {\n    if (v.has(s[i])) c++;\n    if (v.has(s[i - k])) c--;\n    best = Math.max(best, c);\n  }\n  return best;\n}",
    starterPy: "def maxVowels(s, k):\n    # max vowels in any window of size k\n    pass",
    solutionPy: "def maxVowels(s, k):\n    vowels = set('aeiou')\n    c = sum(1 for ch in s[:k] if ch in vowels)\n    best = c\n    for i in range(k, len(s)):\n        if s[i] in vowels:\n            c += 1\n        if s[i - k] in vowels:\n            c -= 1\n        best = max(best, c)\n    return best"
  },
  {
    id: "climb-stairs", title: "Climbing Stairs", difficulty: "Easy", pattern: "Dynamic Programming",
    prompt: "You can climb 1 or 2 steps at a time. Return how many distinct ways there are to reach the top of n steps. (The ways to reach step n = ways to reach n-1 plus ways to reach n-2. That's the DP.)",
    fnName: "climbStairs",
    starter: "function climbStairs(n) {\n  // number of distinct ways to climb n steps (1 or 2 at a time)\n\n}",
    tests: [{ args: [2], expected: 2 }, { args: [3], expected: 3 }, { args: [1], expected: 1 }, { args: [5], expected: 8 }],
    solution: "function climbStairs(n) {\n  let a = 1, b = 1;\n  for (let i = 0; i < n; i++) {\n    const t = b;\n    b = a + b;\n    a = t;\n  }\n  return a;\n}",
    starterPy: "def climbStairs(n):\n    # number of distinct ways to climb n steps (1 or 2 at a time)\n    pass",
    solutionPy: "def climbStairs(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a"
  },
  {
    id: "house-robber", title: "House Robber", difficulty: "Medium", pattern: "Dynamic Programming",
    prompt: "Each house holds some money, but you can't rob two adjacent houses. Return the maximum you can rob. (At each house: skip it, or rob it plus the best from two houses back. Classic DP.)",
    fnName: "rob",
    starter: "function rob(nums) {\n  // max money without robbing two adjacent houses\n\n}",
    tests: [{ args: [[1, 2, 3, 1]], expected: 4 }, { args: [[2, 7, 9, 3, 1]], expected: 12 }, { args: [[5]], expected: 5 }, { args: [[]], expected: 0 }],
    solution: "function rob(nums) {\n  let prev = 0, cur = 0;\n  for (const n of nums) {\n    const t = Math.max(cur, prev + n);\n    prev = cur;\n    cur = t;\n  }\n  return cur;\n}",
    starterPy: "def rob(nums):\n    # max money without robbing two adjacent houses\n    pass",
    solutionPy: "def rob(nums):\n    prev, cur = 0, 0\n    for n in nums:\n        prev, cur = cur, max(cur, prev + n)\n    return cur"
  },
  {
    id: "search-insert", title: "Search Insert Position", difficulty: "Easy", pattern: "Modified Binary Search",
    prompt: "Given a sorted array and a target, return the index of the target, or the index where it would be inserted to keep the array sorted. Do it in O(log n) with binary search.",
    fnName: "searchInsert",
    starter: "function searchInsert(nums, target) {\n  // index of target, or where it would be inserted\n\n}",
    tests: [{ args: [[1, 3, 5, 6], 5], expected: 2 }, { args: [[1, 3, 5, 6], 2], expected: 1 }, { args: [[1, 3, 5, 6], 7], expected: 4 }, { args: [[1, 3, 5, 6], 0], expected: 0 }],
    solution: "function searchInsert(nums, target) {\n  let lo = 0, hi = nums.length;\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] < target) lo = mid + 1;\n    else hi = mid;\n  }\n  return lo;\n}",
    starterPy: "def searchInsert(nums, target):\n    # index of target, or where it would be inserted\n    pass",
    solutionPy: "def searchInsert(nums, target):\n    lo, hi = 0, len(nums)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo"
  },
  {
    id: "int-sqrt", title: "Integer Square Root", difficulty: "Easy", pattern: "Binary Search on the Answer",
    prompt: "Return the integer square root of x: the largest whole number whose square is <= x. Example: intSqrt(8) = 2. Binary-search the answer between 1 and x - this is the 'search the answer, not the array' idea.",
    fnName: "intSqrt",
    starter: "function intSqrt(x) {\n  // largest whole number whose square is <= x\n\n}",
    tests: [{ args: [4], expected: 2 }, { args: [8], expected: 2 }, { args: [0], expected: 0 }, { args: [16], expected: 4 }],
    solution: "function intSqrt(x) {\n  if (x < 2) return x;\n  let lo = 1, hi = x, ans = 0;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (mid * mid <= x) { ans = mid; lo = mid + 1; }\n    else hi = mid - 1;\n  }\n  return ans;\n}",
    starterPy: "def intSqrt(x):\n    # largest whole number whose square is <= x\n    pass",
    solutionPy: "def intSqrt(x):\n    if x < 2:\n        return x\n    lo, hi, ans = 1, x, 0\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if mid * mid <= x:\n            ans = mid\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return ans"
  },
  {
    id: "factorial", title: "Factorial", difficulty: "Intro", pattern: "Recursion",
    prompt: "Return n! (n factorial): n * (n-1) * ... * 1, with 0! = 1. Solve it recursively: the base case is n <= 1, and the recursive case is n * factorial(n-1).",
    fnName: "factorial",
    starter: "function factorial(n) {\n  // base case: n <= 1 returns 1\n  // recursive case: n * factorial(n - 1)\n\n}",
    tests: [{ args: [0], expected: 1 }, { args: [1], expected: 1 }, { args: [5], expected: 120 }, { args: [3], expected: 6 }],
    solution: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
    starterPy: "def factorial(n):\n    # base case: n <= 1 returns 1\n    # recursive case: n * factorial(n - 1)\n    pass",
    solutionPy: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)"
  },
  {
    id: "recursive-sum", title: "Recursive Sum", difficulty: "Intro", pattern: "Recursion",
    prompt: "Return the sum of nums using recursion (no loop). Base case: an empty array sums to 0. Recursive case: the first number plus the sum of the rest.",
    fnName: "recursiveSum",
    starter: "function recursiveSum(nums) {\n  // base case: empty array returns 0\n  // recursive case: nums[0] + recursiveSum(rest)\n\n}",
    tests: [{ args: [[1, 2, 3]], expected: 6 }, { args: [[]], expected: 0 }, { args: [[5]], expected: 5 }, { args: [[-1, 1]], expected: 0 }],
    solution: "function recursiveSum(nums) {\n  if (nums.length === 0) return 0;\n  return nums[0] + recursiveSum(nums.slice(1));\n}",
    starterPy: "def recursiveSum(nums):\n    # base case: empty list returns 0\n    # recursive case: nums[0] + recursiveSum(rest)\n    pass",
    solutionPy: "def recursiveSum(nums):\n    if not nums:\n        return 0\n    return nums[0] + recursiveSum(nums[1:])"
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
  { id: "evalharness", badge: "Applied-AI · evaluation", title: "Eval harness for an LLM feature", brief: "An LLM feature 'works on the demo' but nobody knows if a change makes it better or worse. Build an eval harness that answers that.", clarify: ["What is the task, and what does 'correct' mean?", "Where does the eval set come from; how representative?", "Offline, online, or both?"], build: ["Assemble a small, representative eval set with expected outputs or rubrics.", "Choose metrics that match the task.", "Run the current system over the set; record scores reproducibly.", "Make it a one-command run any change can be measured against.", "Report per-case results so regressions are debuggable."], curveball: "The task has no single right answer. Add an LLM-as-judge scorer, then show how you'd check the judge itself isn't biased or drifting.", explain: ["Explain how the eval set was built and why the metrics fit.", "State the pass/fail bar.", "Show a per-case view where a regression would surface."], reference: ["A version-controlled eval set and reproducible run beat vibes.", "Metrics fit the task; per-case output for debugging.", "Validate an LLM-judge against human labels first.", "A clear pass/fail bar for objective shipping decisions."] },
  { id: "integration", badge: "FDE · systems integration", title: "Nightly sync from a customer's API into your app", brief: "A customer wants their records (think Salesforce contacts) to appear in your product every morning. Build a small, reliable sync that pulls from their API each night and lands clean data your app can read.", clarify: ["Full reload or incremental (only what changed since last run)?", "Their auth: OAuth or API key, and what are the rate limits?", "One-way into your app, or bidirectional?", "What does 'synced' mean: a freshness SLA, reconciled counts?", "How are deletes on their side reflected on yours?"], build: ["Authenticate, then page through their API respecting rate limits.", "Pull incrementally using a cursor or an updated-since watermark.", "Map their schema to yours behind a translation layer, not inline.", "Upsert idempotently on a stable natural key; re-runs must not duplicate.", "Record a run summary: pulled, upserted, skipped, errors."], curveball: "Their API starts rate-limiting you mid-sync (HTTP 429) and, separately, they rename a field you depend on. Make the sync resilient to both: back off and resume without losing data, and absorb the schema drift without a code change every time.", explain: ["Lead with the freshness the customer actually needs, not your pipeline.", "Show an incremental run that pulls only what changed.", "Justify your idempotency key and the translation layer."], reference: ["Incremental cursor over full re-pull; resumable on failure.", "Respect 429 with backoff and continue where it left off.", "An anti-corruption layer so their schema drift doesn't ripple into your app.", "Idempotent upserts on a natural key; an observable run summary."] },
  { id: "statusdoc", badge: "FDE · communication", title: "Translate an outage into a stakeholder update", brief: "A background job that generates customer reports failed overnight, and reports are six hours late. Write the update three ways: for the customer's executive sponsor, for their technical admin, and as an internal note for your own team.", clarify: ["Who is each audience and what decision do they need to make?", "What is actually known versus still under investigation?", "What is the ask or next step for each reader?", "What cadence of follow-up updates will you commit to?"], build: ["Lead every version with the bottom line up front (BLUF).", "Translate the technical cause into the impact that audience feels.", "State what you're doing and exactly when the next update lands.", "Keep the exec version to a few jargon-free sentences.", "Give the admin the technical specifics; keep the internal note blunt and action-oriented."], curveball: "The exec replies, 'Is our data safe, and will this happen again?' Write the two-sentence answer that is honest and reassuring without over-promising a fix you haven't shipped.", explain: ["Read each version aloud; the first sentence should carry the whole message.", "Check that no unexplained jargon reached the non-technical reader.", "Confirm each version names a next-update time."], reference: ["BLUF in every version; the answer is the first sentence.", "Impact translated to the audience, not raw technical cause.", "Expectations and a next-update time stated explicitly.", "Altitude matched to the reader; honesty over false reassurance."] },
  { id: "terraform", badge: "Platform · infrastructure as code", title: "A reusable Terraform module, planned before applied", brief: "Provision a small piece of cloud infrastructure (say an object-storage bucket plus its access policy) as a reusable Terraform module, with clean inputs, outputs, and a safe plan/apply workflow across environments.", clarify: ["Which resources and which provider?", "What varies per environment (dev/test/prod) and belongs in variables?", "Where does state live, and how is it locked?", "What are the naming and tagging conventions?"], build: ["Define the resources, with variables for the parts that change per environment.", "Expose outputs that other modules or environments consume.", "Run plan and actually read it before you apply.", "Wire remote state with locking so two people can't collide.", "Stand up dev/test/prod by parameterizing, not copy-pasting the module."], curveball: "Someone changed the bucket by hand in the cloud console, so your state no longer matches reality (drift). Show how you detect it and reconcile without destroying data, then bring up a second environment from the same module cleanly.", explain: ["Walk the plan output and exactly what it would change.", "Justify what you made a variable versus hardcoded.", "Explain how remote state and locking prevent collisions."], reference: ["Declarative desired state, not imperative setup scripts.", "Plan-before-apply as the safety gate on every change.", "Remote state with locking; drift detected via plan and reconciled deliberately.", "Environment differences live in variables, not forked copies of the module."] },
  { id: "pipeline", badge: "Platform · delivery", title: "A deployment pipeline with a safe rollout", brief: "Design and wire a CI/CD pipeline that takes a commit to production without anyone running deploy commands by hand, and can undo a bad release fast.", clarify: ["What gates a merge: tests, lint, security scan, review?", "Build once and promote the same artifact, or rebuild per stage?", "Rollout strategy: canary, blue-green, or rolling?", "How is a rollback triggered, and how fast is it?"], build: ["Lay out the stages: build, test, package a versioned artifact, deploy to staging, then prod.", "Promote the identical artifact rather than rebuilding per stage.", "Roll out progressively: canary a small slice, watch health, then widen.", "Keep an automated rollback path tied to health signals.", "Make every run reproducible and logged, so any deploy is auditable."], curveball: "The canary looks fine, but error rates climb five minutes after full rollout. Show how the pipeline detects that and rolls back automatically, and how you'd stop that same bad build from being promoted again.", explain: ["Walk a single commit through every gate to prod.", "Justify your rollout strategy and its blast radius.", "Show where rollback kicks in and how fast."], reference: ["Build-once-promote-many with an immutable, versioned artifact.", "Progressive delivery to limit blast radius.", "Automated rollback tied to health signals, not a human noticing.", "Gates that block bad code before prod; every deploy reproducible and audited."] }
];

/* ===================== REUSABLE FRAMEWORK STAGES =====================
 * Each set is a "tick every stage once you can run it unaided" practice.
 * Looked up by id via byId(RAG_STAGES, id); ids are globally unique. */
var RAG_STAGES = [
  /* RAG / agent design */
  { id: "scope", step: "Stage 1", h: "Scope", p: "Inputs, outputs, latency budget, cost ceiling, and what a wrong answer costs. Frame the problem before any architecture." },
  { id: "ingest", step: "Stage 2", h: "Ingest", p: "Chunk and embed source documents into a vector store. Justify chunk size, overlap, and indexing choices out loud." },
  { id: "retrieve", step: "Stage 3", h: "Retrieve", p: "Embed the query, pull a tight top-k, and consider reranking. Retrieve less but more relevant to control cost and noise." },
  { id: "act", step: "Stage 4", h: "Act / Generate", p: "Structured output for reliability. For agents, define the tools, their schemas, and approval gates before any action." },
  { id: "guard", step: "Stage 5", h: "Guardrails", p: "Refuse out-of-scope requests, validate outputs, and route to a human above confidence or risk thresholds." },
  { id: "eval", step: "Stage 6", h: "Evaluate", p: "Measure retrieval and generation quality separately so you can localize failures, and track them over time." },
  /* Orchestrating AI coding agents */
  { id: "ao-spec", step: "Step 1", h: "Spec before you spawn", p: "Write the intent, the constraints, and a concrete definition of done before you hand work to an agent. A vague prompt yields vague code; the spec is your steering wheel." },
  { id: "ao-decompose", step: "Step 2", h: "Decompose into verifiable units", p: "Break the work into small pieces each with a clear check. Agents drift on large open-ended tasks; a tight scope with an obvious way to verify keeps them honest." },
  { id: "ao-delegate", step: "Step 3", h: "Delegate with the right context", p: "Give the agent the interface, examples, and constraints it needs, and nothing it doesn't. Then let it draft. Feeding it the whole repo when it needs one function wastes tokens and focus." },
  { id: "ao-verify", step: "Step 4", h: "Verify like a senior reviewer", p: "You own the output. Run it, test the edges, read for correctness and security. Trust nothing you didn't check; a confident agent is not a correct one." },
  { id: "ao-integrate", step: "Step 5", h: "Integrate and keep it coherent", p: "Land the verified pieces into the whole. Reconcile interfaces, delete dead scaffolding, and keep the build green between steps so the system never drifts into a broken state." },
  { id: "ao-steer", step: "Step 6", h: "Know when to take the wheel", p: "When the agent loops, invents an API, or the task needs real judgment, stop delegating and drive. Orchestration is choosing which lever to pull, not deferring every decision to the model." },
  /* Observability and SLOs */
  { id: "ob-sli", step: "Stage 1", h: "Pick the SLI", p: "A Service Level Indicator is the one measured thing that reflects user happiness: request success rate, latency, or freshness. Measure what the user feels, not what is easy to graph." },
  { id: "ob-slo", step: "Stage 2", h: "Set the SLO", p: "A Service Level Objective is the target for that indicator over a window, e.g. 99.9% of requests succeed each month. It's a deliberate promise, not a hope." },
  { id: "ob-budget", step: "Stage 3", h: "Spend the error budget", p: "100% minus the SLO is your error budget: the failure you're allowed. It turns reliability into a currency you spend on shipping speed versus hardening." },
  { id: "ob-signals", step: "Stage 4", h: "Instrument the three signals", p: "Metrics (what is happening), logs (what happened), traces (where the time went). Together they take you from 'it's slow' to 'this call, this dependency' fast." },
  { id: "ob-alert", step: "Stage 5", h: "Alert on symptoms, not causes", p: "Page on user-facing SLO burn, not on every CPU spike. An alert that doesn't need a human action is noise that trains people to ignore the pager." },
  /* Incident command */
  { id: "ic-detect", step: "Stage 1", h: "Detect and declare", p: "Something is wrong: an alert fired or a customer reported it. Acknowledge fast and declare an incident with a named owner. A named incident beats a silent scramble." },
  { id: "ic-triage", step: "Stage 2", h: "Triage the blast radius", p: "Who and what is affected, and how badly? Set a severity. Scope drives everything: how many people you pull in and how loudly you communicate." },
  { id: "ic-mitigate", step: "Stage 3", h: "Mitigate first, fix later", p: "Stop the bleeding before you hunt the root cause. Roll back, fail over, or flag the feature off. Restoring service is the job; the perfect fix can wait for calm." },
  { id: "ic-communicate", step: "Stage 4", h: "Communicate on a cadence", p: "Stakeholders need a steady drumbeat: what's impacted, what you're doing, when the next update lands. Silence during an outage is its own incident." },
  { id: "ic-resolve", step: "Stage 5", h: "Resolve and verify", p: "Confirm the system is truly healthy, not just quiet, before closing. Watch the SLIs recover and check the mitigation didn't mask a second failure." },
  { id: "ic-postmortem", step: "Stage 6", h: "Blameless postmortem", p: "Write the timeline, the contributing causes, and the action items. Blame the system and the gaps, not the person; the goal is that this class of failure can't recur." }
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
    practice: { type: "code", refs: ["valid-palindrome", "is-subsequence", "two-sum"], note: "Valid Palindrome and Is Subsequence are pure two-pointer scans. Two Sum is the hashing cousin: once the two-pointer instinct clicks on a sorted array, notice how a hash map does the same job when it isn't sorted." },
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
    practice: { type: "code", refs: ["max-profit", "max-window-sum", "max-vowels"], note: "Best Time to Buy/Sell is the gateway (a running minimum). Max Sum of Size-K Window and Max Vowels are textbook fixed-size windows: add the new item, drop the one that left, never recompute." },
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
    practice: { type: "code", refs: ["max-subarray", "climb-stairs", "house-robber"], note: "Maximum Subarray (Kadane) is the cleanest first DP. Climbing Stairs and House Robber add the classic 'this step depends on the previous one or two' recurrence. Say the state out loud before you code." },
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
    practice: { type: "code", refs: ["binary-search", "search-insert", "int-sqrt"], note: "Get the boundaries clean on plain Binary Search and Search Insert. Integer Square Root is your first taste of binary-searching the ANSWER instead of an array index." },
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
    id: "systems-integration", track: "fde", title: "Systems Integration", kicker: "Core skill", est: "50 min",
    learn: {
      intro: "Most forward-deployed work is wiring one system to another: pull the customer's data out of their tool, reshape it, and land it in yours. The hard parts are almost never algorithms. They're auth, rate limits, idempotency, and the customer's messy reality. This is the day job, and interviews probe it directly.",
      points: [
        { h: "Auth is the first wall", p: "Before a single record moves, you have to get in: OAuth flows, API keys, token refresh, and per-tenant credentials. Half of integration bugs live here. Ask early what auth the customer's system uses and what its rate limits are." },
        { h: "Incremental beats full reload", p: "Re-pulling everything every night doesn't scale and hammers their API. Pull only what changed since last run using a cursor or an updated-since watermark, and make the job resumable if it dies halfway." },
        { h: "Idempotency makes retries safe", p: "Networks fail mid-sync. If re-running the same batch double-counts records, you have a data-integrity bug. Upsert on a stable natural key so running twice is the same as running once." },
        { h: "The anti-corruption layer", p: "Never let the customer's schema leak straight into your app. Map their fields to your model in one translation layer, so when they rename a field or add a quirk, you change one place, not ten. Their mess stays their mess." },
        { h: "Poll vs webhook", p: "Polling asks 'anything new?' on a schedule: simple, but laggy and wasteful. Webhooks push events to you in near-real-time: fresher, but you must handle retries, duplicates, and out-of-order delivery. Pick based on the freshness the customer actually needs." }
      ],
      template: null,
      example: { h: "The move", p: "When asked to 'sync their data nightly,' don't start drawing boxes. Start with: what auth, what rate limits, full or incremental, and what's the natural key that makes a record unique? Those four answers shape the entire design." }
    },
    practice: { type: "build", refs: ["integration"], note: "Build the nightly sync in your editor, handle the rate-limit-and-schema-drift curveball, then self-score on the four dimensions." },
    quiz: [
      { q: "Why upsert on a natural key instead of just inserting rows?", choices: ["It's faster to type", "So a retry or a re-sent file doesn't create duplicate records", "It uses less memory", "Databases require it"], answer: 1, explain: "Idempotency: syncs fail and get retried, so running the same batch twice must not double-count. A stable natural key makes the upsert safe." },
      { q: "The main reason to put a translation layer between their schema and yours is:", choices: ["It looks more professional", "So their schema changes don't ripple through your whole app", "It's required by OAuth", "To make the sync slower and safer"], answer: 1, explain: "An anti-corruption layer localizes their mess: when they rename or add a field, you change one mapping, not every place that touched the data." },
      { q: "A customer needs records to appear 'within a minute of changing.' This points to:", choices: ["A nightly full reload", "Webhooks (push) rather than slow polling", "A bigger database", "Manual export"], answer: 1, explain: "Near-real-time freshness favors webhooks pushing events to you, accepting the cost of handling retries, duplicates, and ordering." }
    ],
    recall: [
      { front: "Full reload vs incremental sync?", back: "Incremental pulls only what changed since last run (via a cursor/watermark); it scales and spares their API. Full reload doesn't." },
      { front: "What makes a sync safe to retry?", back: "Idempotency: upsert on a stable natural key so running twice equals running once, no duplicates." },
      { front: "What is an anti-corruption layer?", back: "A translation layer mapping the customer's schema to yours, so their schema drift changes one place, not your whole app." },
      { front: "Poll vs webhook tradeoff?", back: "Polling is simple but laggy and wasteful; webhooks are fresh but you must handle retries, duplicates, and ordering." }
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
  {
    id: "agent-orchestration", track: "fde", title: "Orchestrating AI Coding Agents", kicker: "The shift", est: "45 min",
    learn: {
      intro: "The industry is moving from 'who writes the best code by hand' to 'who can direct the agents that write it, and vouch for the result.' Your leverage is no longer typing speed; it's decomposing work, specifying it crisply, and verifying what comes back. This is a real, learnable skill, and it's increasingly what practical-engineer interviews and jobs actually test.",
      points: [
        { h: "The leverage shifted", p: "An engineer who can orchestrate agents ships far more than one who types every line, but only if they can guarantee the output. The bottleneck moved from writing code to specifying and verifying it. That's the skill to build." },
        { h: "Spec before you spawn", p: "A vague prompt yields vague code. State the intent, the constraints, and a concrete definition of done up front. The clearer your spec, the less you rework. Treat the agent like a fast, literal junior who does exactly what you asked, not what you meant." },
        { h: "Decompose into verifiable units", p: "Agents drift on big open-ended tasks. Break work into small pieces, each with an obvious way to check it (a test, a run, a diff you can read). Small verifiable units keep both you and the agent honest." },
        { h: "You own the output", p: "The agent's confidence is not correctness. Review its work like a senior reviews a junior: run it, test the edges, read for correctness and security. When you ship it, it's yours, so verify nothing you didn't check." },
        { h: "Know when to take the wheel", p: "When the agent loops, invents an API that doesn't exist, or the task needs real judgment, stop delegating and drive. Orchestration is knowing which lever to pull, not blindly deferring every call to the model." }
      ],
      template: null,
      example: { h: "The move", p: "Faced with 'add rate limiting to this service,' don't paste it into an agent and hope. Write the spec (per-key limit, 429 with Retry-After, fail-open), split it into build + tests, let the agent draft each, then run the tests yourself and read the concurrency path. Direct, verify, own it." }
    },
    practice: { type: "framework", refs: ["ao-spec", "ao-decompose", "ao-delegate", "ao-verify", "ao-integrate", "ao-steer"], note: "Tick each step once you can run a real feature through it: spec it, split it, delegate, verify, integrate, and know when to intervene." },
    quiz: [
      { q: "As agents write more of the code, the engineer's highest-value skill becomes:", choices: ["Typing faster than the agent", "Specifying work crisply and verifying the output", "Memorizing more syntax", "Avoiding agents entirely"], answer: 1, explain: "The bottleneck moves from writing to directing and verifying. The engineer who can spec clearly and vouch for the result has the leverage." },
      { q: "An agent returns code that 'looks right' and runs on the happy path. You should:", choices: ["Ship it, it ran", "Review and test it like a senior reviews a junior before you own it", "Ask the agent if it's sure", "Add more comments"], answer: 1, explain: "Confidence is not correctness. You own what you ship: run it, test the edges, and read for correctness and security before trusting it." },
      { q: "Why decompose a task into small units before handing it to an agent?", choices: ["Agents charge per task", "Small units each have a clear check, so drift is caught early", "It's required by the tool", "To make it take longer"], answer: 1, explain: "Agents drift on large open-ended work. Small pieces with an obvious way to verify keep the output honest and the failures local." }
    ],
    recall: [
      { front: "What did the leverage shift from and to?", back: "From writing code by hand to specifying work crisply and verifying agent output. The bottleneck moved from typing to directing." },
      { front: "Why 'spec before you spawn'?", back: "A vague prompt yields vague code. Intent + constraints + a definition of done up front means less rework; the agent does what you asked, not what you meant." },
      { front: "Why review agent output like a senior reviewer?", back: "Agent confidence is not correctness, and you own what you ship. Run it, test edges, read for correctness and security." },
      { front: "When do you take the wheel?", back: "When the agent loops, hallucinates an API, or the task needs real judgment. Orchestration is choosing which lever to pull, not deferring everything." }
    ]
  },
  {
    id: "stakeholder-comms", track: "fde", title: "Stakeholder Communication", kicker: "The multiplier", est: "45 min",
    learn: {
      intro: "The other half of the practical-engineer shift: the ability to translate technical reality into language a stakeholder can act on. A brilliant build nobody understands or trusts is worth less than a modest one explained clearly. In forward-deployed and customer-facing roles, communication is not soft; it's the multiplier on everything else you do.",
      points: [
        { h: "Read the audience first", p: "An executive, an engineer, and an end user need different altitudes. The exec wants impact and risk; the engineer wants the mechanism; the user wants what changes for them. Decide who you're talking to and what decision they need to make before you say a word." },
        { h: "Lead with the bottom line (BLUF)", p: "Bottom Line Up Front: put the answer, the impact, or the ask in the first sentence, then the supporting detail below for whoever wants it. Busy readers should get the point without reading to the end. Burying the lede is the most common communication mistake." },
        { h: "Translate feature into outcome", p: "Nobody outside engineering cares about p99 latency or a queue depth; they care that reports load before the meeting and nothing gets lost. Convert every technical fact into the outcome the listener feels. That translation is the entire skill." },
        { h: "Set expectations honestly", p: "Name scope, risk, and timeline early. A clear 'not yet, and here's why' builds more trust than a vague yes you can't keep. It's surprises, not bad news, that break relationships. Under-promise the date; over-deliver the update." },
        { h: "Confirm you were understood", p: "Communication is measured at the receiver, not the sender. Play back what you heard, and check they got what you meant. A demo is a story with a beginning and a payoff, not a feature tour, so end on the outcome that matters to them." }
      ],
      template: null,
      example: { h: "The move", p: "Instead of 'the ETL job OOM'd so the Airflow DAG failed,' tell the customer's sponsor: 'Your morning reports are delayed about two hours; no data is lost, we've fixed the cause, and I'll confirm when they're flowing again by 10am.' Same facts, translated to the outcome and the next step they care about." }
    },
    practice: { type: "build", refs: ["statusdoc"], note: "Write the outage update three ways (exec, admin, internal), handle the exec's follow-up, then self-score. Framing = right audience and BLUF; quality = clarity and no stray jargon." },
    quiz: [
      { q: "BLUF (Bottom Line Up Front) means:", choices: ["Save the conclusion for the end", "Put the answer, impact, or ask in the first sentence", "Use bullet points only", "Always be blunt"], answer: 1, explain: "Lead with the point so a busy reader gets it immediately; supporting detail goes below for whoever wants it." },
      { q: "Explaining a latency fix to a non-technical sponsor, you should say:", choices: ["We cut p99 from 800ms to 120ms", "Your dashboards now load in about a second instead of stalling", "We optimized the query planner", "We added an index and a cache"], answer: 1, explain: "Translate the technical fact into the outcome they feel. The sponsor cares that it's fast for their team, not the millisecond numbers." },
      { q: "Which builds more trust with a stakeholder?", choices: ["A vague yes to keep them happy", "A clear 'not yet, here's why and when' with expectations set early", "Going silent until it's done", "Promising the earliest possible date"], answer: 1, explain: "Surprises break relationships, not bad news. Honest scope and timeline, and a steady update cadence, build trust." }
    ],
    recall: [
      { front: "What does BLUF stand for and mean?", back: "Bottom Line Up Front: put the answer/impact/ask in the first sentence, detail below." },
      { front: "The core of technical-to-stakeholder translation?", back: "Convert every technical fact into the outcome the listener feels (latency numbers -> 'reports load before your meeting')." },
      { front: "Why set expectations early, even bad ones?", back: "Surprises break relationships, not bad news. A clear 'not yet, here's why' beats a vague yes you can't keep." },
      { front: "Where is communication actually measured?", back: "At the receiver, not the sender. Confirm they understood what you meant; match the altitude to the audience." }
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
    id: "iac-terraform", track: "platform", title: "Infrastructure as Code", kicker: "Core skill", est: "50 min",
    learn: {
      intro: "Infrastructure as code means you define your servers, databases, and networks in version-controlled files (Terraform is the common tool) instead of clicking around a cloud console. The payoff is huge: environments become reproducible, reviewable in a pull request, and rebuildable from scratch. Platform interviews increasingly assume you think this way.",
      points: [
        { h: "Declarative, not imperative", p: "You describe the desired end state ('one bucket, this policy'), and the tool figures out the steps to get there. You don't write 'create this, then that.' This is why the same file run twice is safe: the tool only changes what doesn't match." },
        { h: "Plan before apply", p: "Terraform's plan step shows you exactly what will change before anything happens: what's created, changed, or destroyed. Reading the plan is the safety gate. 'It'll destroy the database' is a lot better to learn from a plan than from production." },
        { h: "State is the source of truth", p: "Terraform keeps a state file mapping your code to the real resources it created. Store it remotely with locking so two people can't apply at once. When reality drifts from state (someone edits by hand), plan shows the gap so you can reconcile it deliberately." },
        { h: "Modules and variables keep it DRY", p: "A module is a reusable chunk of infrastructure with inputs and outputs. Dev, test, and prod should be the same module with different variables (size, region, name), not three copied-and-diverged folders. That's how you avoid 'works in dev, breaks in prod.'" },
        { h: "Idempotent by design", p: "Applying the same config repeatedly converges to the same state, with no duplicate resources and no surprise churn. Idempotency is what makes infrastructure code trustworthy to run in a pipeline." }
      ],
      template: { lang: "HCL (Terraform)", code: "variable \"env\"    { type = string }\nvariable \"region\" { type = string }\n\nresource \"aws_s3_bucket\" \"reports\" {\n  bucket = \"acme-reports-${var.env}\"   # differs per environment\n  tags   = { Environment = var.env }\n}\n\noutput \"bucket_name\" {\n  value = aws_s3_bucket.reports.bucket  # consumed by other modules\n}\n\n# workflow:  terraform plan   (read the diff)\n#            terraform apply  (make it real, after reading)" },
      example: { h: "The move", p: "Asked to 'stand up a staging environment,' don't script a sequence of CLI calls. Write (or reuse) a module, parameterize what differs from prod, run plan and read it, then apply. Reproducible, reviewable, and you can tear it down and rebuild it identically." }
    },
    practice: { type: "build", refs: ["terraform"], note: "Build a reusable module in your editor, handle the drift-and-second-environment curveball, then self-score. Adaptability = the drift reconcile and the clean second env." },
    quiz: [
      { q: "Why run 'terraform plan' before 'apply'?", choices: ["It's faster", "It shows exactly what will be created, changed, or destroyed before it happens", "It's required to log in", "It formats your code"], answer: 1, explain: "Plan is the safety gate: you read the diff (especially any destroys) before touching real infrastructure." },
      { q: "Dev, test, and prod should be:", choices: ["Three separate copied folders that drift apart", "The same module with different variables", "Built by hand in the console", "One giant file"], answer: 1, explain: "One parameterized module per environment keeps them consistent and avoids 'works in dev, breaks in prod' from divergence." },
      { q: "Someone edits a resource by hand and it no longer matches your code. This is called:", choices: ["A merge conflict", "Drift, which plan will surface so you can reconcile it", "A rollback", "A cold start"], answer: 1, explain: "Drift is when real infrastructure diverges from Terraform's state; plan detects the gap so you reconcile deliberately instead of being surprised." }
    ],
    recall: [
      { front: "Declarative vs imperative infrastructure?", back: "Declarative describes the desired end state and the tool computes the steps; imperative scripts each step. Declarative is safe to re-run." },
      { front: "What is 'plan before apply'?", back: "Terraform's plan shows exactly what will change (create/modify/destroy) before you apply. It's the safety gate." },
      { front: "What is drift?", back: "When real infrastructure diverges from Terraform's state (e.g. a manual console edit); plan surfaces it so you reconcile deliberately." },
      { front: "How should dev/test/prod relate?", back: "The same module with different variables, not copied folders that diverge." }
    ]
  },
  {
    id: "cicd-pipelines", track: "platform", title: "CI/CD & Deployment Pipelines", kicker: "Core skill", est: "50 min",
    learn: {
      intro: "A deployment pipeline takes a commit all the way to production without anyone running deploy commands by hand, and lets you undo a bad release fast. 'Design a deployment pipeline' is a signature platform interview prompt, and the strong answers are all about safe, reversible rollout, not just automation.",
      points: [
        { h: "CI vs CD", p: "Continuous Integration: every commit is automatically built and tested, so breakage is caught in minutes, not at release. Continuous Delivery/Deployment: that validated code flows automatically toward production. CI proves it works; CD gets it out safely." },
        { h: "Build once, promote many", p: "Build a single immutable, versioned artifact, then promote that exact artifact through staging to prod. Rebuilding per environment means the thing you tested isn't the thing you shipped. Same bytes everywhere is the rule." },
        { h: "Progressive delivery limits blast radius", p: "Don't flip 100% of traffic to a new version at once. Canary (send a small slice first and watch), blue-green (stand up the new version beside the old and switch), or rolling (replace instances gradually). Each limits how many users a bad release can hurt." },
        { h: "Automated rollback tied to health", p: "The pipeline should watch health signals (error rate, latency, SLO burn) and roll back automatically when they degrade, rather than waiting for a human to notice at 2am. Fast, boring recovery beats heroic debugging." },
        { h: "Gates block bad code", p: "Tests, linting, and security scans gate the merge; a failed gate stops promotion. The whole point is that broken or risky code can't reach prod without a human deliberately overriding a red gate." }
      ],
      template: null,
      example: { h: "The move", p: "Asked to design a pipeline, start from the guarantees: what gates a merge, how you build once and promote the same artifact, how you roll out progressively, and how fast you can roll back. The rollout and rollback story is what separates a strong answer from 'and then it deploys.'" }
    },
    practice: { type: "build", refs: ["pipeline"], note: "Design and wire the pipeline, handle the canary-looks-fine-then-errors-climb curveball, then self-score. The rollback story is where the signal is." },
    quiz: [
      { q: "'Build once, promote many' means:", choices: ["Rebuild the code fresh in each environment", "Build one immutable versioned artifact and promote that exact one to prod", "Only build on Fridays", "Build twice to be safe"], answer: 1, explain: "If you rebuild per stage, the artifact you tested isn't the one you ship. Promoting the same bytes everywhere keeps testing meaningful." },
      { q: "A canary deployment reduces risk by:", choices: ["Deploying to everyone at once but faster", "Sending a small slice of traffic to the new version first and watching health", "Skipping tests", "Deploying only at night"], answer: 1, explain: "A canary exposes a small fraction of users first, so a bad release is caught before it hits everyone. It limits blast radius." },
      { q: "The best trigger for an automated rollback is:", choices: ["A manager's approval", "Degrading health signals like error rate or SLO burn", "A fixed timer", "The number of commits"], answer: 1, explain: "Tie rollback to health so recovery is fast and automatic, instead of waiting for a human to notice the incident." }
    ],
    recall: [
      { front: "CI vs CD?", back: "CI builds and tests every commit (proves it works); CD flows validated code toward prod safely (gets it out)." },
      { front: "Why 'build once, promote many'?", back: "Rebuilding per stage means you ship something other than what you tested. Promote the same immutable, versioned artifact everywhere." },
      { front: "Canary vs blue-green vs rolling?", back: "Canary: small traffic slice first. Blue-green: new version beside old, then switch. Rolling: replace instances gradually. All limit blast radius." },
      { front: "What should trigger an automated rollback?", back: "Degrading health signals (error rate, latency, SLO burn), not a human noticing at 2am." }
    ]
  },
  {
    id: "observability-slos", track: "platform", title: "Observability & SLOs", kicker: "Core skill", est: "45 min",
    learn: {
      intro: "You can't operate what you can't see. Observability is how you know a system is healthy, and where it hurts when it isn't. SLOs turn 'is it reliable?' from a feeling into a number you can manage and make tradeoffs against. Interviewers use this to tell operators from coders.",
      points: [
        { h: "Observability vs monitoring", p: "Monitoring checks the things you already knew to watch (is CPU high?). Observability is being able to ask new questions of a live system you didn't anticipate ('why is only this one customer slow?'). Modern systems fail in ways you didn't predict, so you need the latter." },
        { h: "SLI, SLO, error budget", p: "An SLI is the measured signal (e.g. % of requests under 300ms). An SLO is the target for it (99.9% each month). The error budget is what's left: 100% minus the SLO, the failure you're allowed to spend. This is the reliability contract, in numbers." },
        { h: "The three signals", p: "Metrics (aggregate numbers over time: rates, latencies), logs (discrete records of what happened), and traces (the path of one request across services). Together they take you from 'it's slow' to 'this call to this dependency' quickly." },
        { h: "Alert on symptoms, not causes", p: "Page a human on user-facing pain (SLO burn, error spikes), not on every internal blip like a brief CPU spike that self-heals. An alert that doesn't require action is noise, and noise trains people to ignore the pager." },
        { h: "The error budget is a decision tool", p: "When you're within budget, you can ship faster and take risks. When you've burned it, you slow down and harden. It turns 'ship vs stabilize' arguments into a data-driven call instead of a turf war." }
      ],
      template: null,
      example: { h: "The move", p: "Asked 'how would you know this service is healthy?', don't list dashboards. Name the SLI that reflects user happiness, the SLO target, what the error budget buys you, and what single symptom you'd page on. That framing signals an operator." }
    },
    practice: { type: "framework", refs: ["ob-sli", "ob-slo", "ob-budget", "ob-signals", "ob-alert"], note: "Tick each stage once you can define it for a real service unaided: its SLI, its SLO, the error budget, the signals you'd instrument, and the one symptom you'd page on." },
    quiz: [
      { q: "An SLO (Service Level Objective) is:", choices: ["A log format", "A target for a reliability indicator over a window, e.g. 99.9% success", "A type of server", "A deployment tool"], answer: 1, explain: "The SLI is the measured signal; the SLO is the target for it over a window. It's a deliberate promise, not a hope." },
      { q: "Your error budget is 100% minus the SLO. It's useful because:", choices: ["It has no real use", "It turns reliability into a currency you spend on shipping speed vs hardening", "It replaces testing", "It sets your salary"], answer: 1, explain: "Within budget, ship faster; out of budget, slow down and harden. It makes the ship-vs-stabilize call data-driven." },
      { q: "You should page a human on:", choices: ["Every CPU spike", "User-facing symptoms like SLO burn or error spikes", "Every log line", "Successful deploys"], answer: 1, explain: "Alert on symptoms that need action, not internal blips that self-heal. Noisy alerts train people to ignore the pager." }
    ],
    recall: [
      { front: "Observability vs monitoring?", back: "Monitoring watches known things (CPU high?); observability lets you ask new, unanticipated questions of a live system." },
      { front: "SLI vs SLO vs error budget?", back: "SLI = measured signal; SLO = target for it over a window; error budget = 100% minus the SLO, the failure you're allowed to spend." },
      { front: "The three observability signals?", back: "Metrics (aggregate numbers), logs (discrete events), traces (one request across services)." },
      { front: "What should you alert (page) on?", back: "User-facing symptoms like SLO burn, not internal causes that self-heal. Actionable alerts only." }
    ]
  },
  {
    id: "incident-response", track: "platform", title: "Incident Response & On-Call", kicker: "Signature round", est: "45 min",
    learn: {
      intro: "The on-call / troubleshooting round drops you into a broken production system and watches how you respond. It rewards a calm, structured process over raw cleverness: restore service first, communicate steadily, then learn from it. This is where platform seniority shows most clearly.",
      points: [
        { h: "Mitigate before you root-cause", p: "When prod is down, the job is to stop the bleeding, not to satisfy your curiosity. Roll back the recent deploy, fail over, or flag the feature off. Restore service now; the perfect root-cause investigation happens after, in calm." },
        { h: "Severity drives the response", p: "Set a severity fast: how many users, how badly, is data at risk? Severity decides how many people you pull in and how loudly you communicate. Over-communicating a real incident is rarely the mistake people regret." },
        { h: "Suspect the recent change first", p: "Most incidents trace to something that just changed: a deploy, a config flip, a traffic surge. Form a hypothesis and check the timeline against recent changes before you go spelunking in code. 'What changed in the last hour?' is the fastest first question." },
        { h: "Communicate on a cadence", p: "Stakeholders need a steady drumbeat: what's impacted, what you're doing, when the next update lands, even if the update is 'still investigating.' Silence during an outage reads as loss of control and is its own incident." },
        { h: "Blameless postmortem", p: "Afterward, write the timeline, contributing causes, and action items. Blame the system and the gaps (missing alert, no rollback path), not the person who pushed the button. The goal is that this class of failure can't recur, and blame just makes people hide the next one." }
      ],
      template: null,
      example: { h: "The move", p: "Handed 'the API is returning 500s,' don't dive straight into code. Say: I'd check what deployed recently and roll it back to mitigate, set a sev and post a status update, confirm the SLIs recover, then run a blameless postmortem. That sequence is the signal." }
    },
    practice: { type: "framework", refs: ["ic-detect", "ic-triage", "ic-mitigate", "ic-communicate", "ic-resolve", "ic-postmortem"], note: "Tick each stage once you can run a real outage through it unaided: detect and declare, triage severity, mitigate, communicate on a cadence, resolve and verify, then a blameless postmortem." },
    quiz: [
      { q: "Production is down. Your first priority is to:", choices: ["Find the exact root cause", "Mitigate and restore service (roll back, fail over, flag off)", "Write the postmortem", "Blame the last committer"], answer: 1, explain: "Stop the bleeding first. Root-cause analysis happens after service is restored, when you can think calmly." },
      { q: "The fastest useful first question in an incident is usually:", choices: ["Who wrote this code?", "What changed recently (deploy, config, traffic)?", "Can we rewrite it?", "Is it Friday?"], answer: 1, explain: "Most incidents trace to a recent change. Checking the timeline against deploys/config is faster than reading code cold." },
      { q: "A blameless postmortem exists to:", choices: ["Identify who to discipline", "Fix the system and gaps so the failure class can't recur", "Assign fault fairly", "Satisfy legal"], answer: 1, explain: "Blame makes people hide the next failure. Focusing on system gaps (missing alert, no rollback) is what actually prevents recurrence." }
    ],
    recall: [
      { front: "First priority when prod is down?", back: "Mitigate and restore service (roll back, fail over, flag off) before hunting the root cause." },
      { front: "Fastest first question in an incident?", back: "What changed recently? Most incidents trace to a deploy, config change, or traffic shift." },
      { front: "Why communicate on a cadence during an outage?", back: "Stakeholders need a steady drumbeat; silence reads as loss of control and is its own incident." },
      { front: "Point of a blameless postmortem?", back: "Fix the system and the gaps so the failure class can't recur; blame just makes people hide the next one." }
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
  },
  /* ---------- DATA ENGINEERING ---------- */
  {
    id: "sql-fundamentals", track: "data-eng", title: "SQL Fundamentals", kicker: "Core skill", est: "50 min",
    learn: {
      intro: "SQL is the lingua franca of data engineering. Most data interviews start here: pull the right rows, join tables, aggregate, and filter groups. Get fluent and half the loop is won.",
      points: [
        { h: "The clause order", p: "You write SELECT first, but SQL runs FROM/JOIN, then WHERE, then GROUP BY, then HAVING, then SELECT, then ORDER BY. That order explains why WHERE cannot see aggregates but HAVING can." },
        { h: "Aggregate and group", p: "SUM, COUNT, and AVG collapse rows within each GROUP BY bucket. Every non-aggregated column in SELECT must also appear in GROUP BY." },
        { h: "WHERE vs HAVING", p: "WHERE filters rows before grouping; HAVING filters groups after aggregation. Filtering on a SUM needs HAVING." }
      ],
      template: { lang: "SQL", code: "SELECT s.name, SUM(r.kwh) AS total_kwh\nFROM readings r\nJOIN sites s ON s.id = r.site_id\nWHERE s.region = 'West'\nGROUP BY s.name\nHAVING SUM(r.kwh) > 50\nORDER BY s.name;" },
      example: { h: "The sample dataset", p: "You have sites(id, name, region) and readings(id, site_id, ts, kwh): meter readings per site over time. The playground runs your SQL against it live." }
    },
    practice: { type: "sql", refs: ["sql-total-per-site", "sql-region-threshold"], note: "Write real SQL and run it against the sample meter data. Tables: sites(id, name, region), readings(id, site_id, ts, kwh)." },
    quiz: [
      { q: "Which clause filters groups AFTER aggregation?", choices: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1, explain: "WHERE filters rows before grouping; HAVING filters the aggregated groups, e.g. HAVING SUM(kwh) > 50." },
      { q: "Every non-aggregated column in SELECT must also appear in:", choices: ["WHERE", "ORDER BY", "GROUP BY", "a subquery"], answer: 2, explain: "Grouping collapses rows, so any plain column you select must be part of the GROUP BY key." },
      { sql: "sql-total-per-site" }
    ],
    recall: [
      { front: "WHERE vs HAVING?", back: "WHERE filters rows before grouping; HAVING filters groups after aggregation. Filter a SUM with HAVING." },
      { front: "Logical run order of a SELECT?", back: "FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY." }
    ]
  },
  {
    id: "sql-windows", track: "data-eng", title: "SQL Window Functions", kicker: "Core skill", est: "50 min",
    learn: {
      intro: "Window functions compute across a set of rows related to the current row without collapsing them the way GROUP BY does. They are how you do running totals, rankings, and period-over-period change: the bread and butter of time-series and sensor data.",
      points: [
        { h: "OVER and PARTITION BY", p: "OVER defines the window. PARTITION BY splits it into groups (e.g. per site); ORDER BY within the window enables running and rolling calculations." },
        { h: "The common ones", p: "ROW_NUMBER, RANK, DENSE_RANK for ordering; SUM and AVG OVER for running totals and moving averages; LAG and LEAD for the previous or next row." },
        { h: "Why DE loves them", p: "Sensor and meter data is inherently time-series. Running totals, daily rollups, and day-over-day deltas are window functions, not joins." }
      ],
      template: { lang: "SQL", code: "SELECT ts, kwh,\n  SUM(kwh) OVER (PARTITION BY site_id ORDER BY ts) AS running_kwh,\n  kwh - LAG(kwh) OVER (PARTITION BY site_id ORDER BY ts) AS delta\nFROM readings;" },
      example: { h: "Running total", p: "SUM(kwh) OVER (ORDER BY ts) adds each row's kwh to the sum of all prior rows: a cumulative meter reading, computed in one pass." }
    },
    practice: { type: "sql", refs: ["sql-running-total", "sql-rank-sites"], note: "These are the time-series patterns energy and water companies lean on. Same sample tables." },
    quiz: [
      { q: "To compute a running total per site over time, you use:", choices: ["GROUP BY site_id", "SUM(kwh) OVER (PARTITION BY site_id ORDER BY ts)", "COUNT(*)", "a self-join"], answer: 1, explain: "A windowed SUM with PARTITION BY site_id and ORDER BY ts accumulates within each site without collapsing rows." },
      { q: "To compare each reading to the previous one (day-over-day change), reach for:", choices: ["RANK()", "LAG()", "HAVING", "DISTINCT"], answer: 1, explain: "LAG() returns a prior row's value in the ordered window, so kwh - LAG(kwh) is the delta." },
      { sql: "sql-running-total" }
    ],
    recall: [
      { front: "What does OVER (PARTITION BY x ORDER BY y) do?", back: "Defines a window split by x and ordered by y, enabling running and rolling calcs per group without collapsing rows." },
      { front: "Previous-row value in a window?", back: "LAG() (and LEAD() for the next row), used for period-over-period deltas." }
    ]
  },
  {
    id: "data-pipelines", track: "data-eng", title: "Pipelines & Modeling", kicker: "Design", est: "45 min",
    learn: {
      intro: "Beyond SQL, DE interviews probe how you move and model data: batch vs streaming, making loads safe to re-run, and shaping raw events into tables analysts can trust.",
      points: [
        { h: "Idempotent and incremental", p: "A pipeline must be safe to re-run: upsert on a natural key, process only new or changed data, and handle late-arriving records without duplicating." },
        { h: "Dimensional modeling", p: "Facts (measurements, e.g. readings) and dimensions (context, e.g. sites) form the star schema analysts query. Always know the grain: one row per what?" },
        { h: "Batch vs streaming", p: "Batch for periodic rollups; streaming for low latency. Most real systems are both. Name the latency and cost tradeoff." }
      ],
      template: null, example: null
    },
    practice: { type: "build", refs: ["csv", "webhooks"], note: "The CSV ingest and webhook delivery builds are data-pipeline problems: idempotency, dedup, late data, and reliable delivery." },
    quiz: [
      { q: "The property that makes a pipeline safe to re-run is:", choices: ["Speed", "Idempotency", "Compression", "Sharding"], answer: 1, explain: "Idempotent loads (e.g. upsert on a natural key) mean re-running does not duplicate or corrupt data." },
      { q: "In a star schema, meter readings are a ___ and sites are a ___:", choices: ["dimension / fact", "fact / dimension", "view / index", "key / value"], answer: 1, explain: "Measurements (readings) are facts; descriptive context (sites) are dimensions." }
    ],
    recall: [
      { front: "What makes a pipeline safe to re-run?", back: "Idempotency: upsert on a natural key, process incrementally, handle late data without duplicating." },
      { front: "Facts vs dimensions?", back: "Facts are measurements (readings); dimensions are descriptive context (sites). Mind the grain." }
    ]
  },
  {
    id: "data-quality", track: "data-eng", title: "Data Quality", kicker: "Design", est: "40 min",
    learn: {
      intro: "Data is only as useful as it is trustworthy. Interviews increasingly ask how you keep it clean: dedup, late and out-of-order data, slowly changing dimensions, and automated tests.",
      points: [
        { h: "Dedup and late data", p: "Real feeds send duplicates and out-of-order records. Deduplicate on a natural key, and window on event time, not arrival time." },
        { h: "Slowly changing dimensions", p: "When a site's attributes change, do you overwrite (SCD type 1) or keep history (SCD type 2)? It depends on whether analysts need the past." },
        { h: "Test your data", p: "Assertions (not-null, unique, referential, row-count bounds) run in the pipeline, dbt-style, so a bad load fails loudly instead of silently corrupting dashboards." }
      ],
      template: null, example: null
    },
    practice: { type: "decomp", refs: [0, 3], note: "Clarify the data-quality edges first: malformed rows, duplicates, late files, and what 'clean' means to the consumer." },
    quiz: [
      { q: "A feed occasionally re-sends yesterday's records. The fix is:", choices: ["Ignore it", "Deduplicate on a natural key", "Add more servers", "Compress the file"], answer: 1, explain: "Dedup on a stable natural key makes re-sends and duplicates harmless." },
      { q: "Keeping history when a dimension's attributes change is:", choices: ["SCD type 1 (overwrite)", "SCD type 2 (new versioned row)", "A fact table", "Normalization"], answer: 1, explain: "SCD type 2 adds a new versioned row so the past is preserved; type 1 overwrites." }
    ],
    recall: [
      { front: "Handle duplicate or re-sent records?", back: "Deduplicate on a natural key; window on event time, not arrival time." },
      { front: "SCD type 1 vs type 2?", back: "Type 1 overwrites (no history); type 2 adds a versioned row (keeps history)." }
    ]
  },
  /* ---------- FOUNDATIONS ---------- */
  {
    id: "read-big-o", track: "foundations", title: "Reading Big-O Notation", kicker: "Start here", est: "40 min",
    learn: {
      intro: "Every time this app says something runs in 'O(n) time,' it is describing how the work grows as the input gets bigger. This is the single most assumed idea in interviews, and almost nobody teaches it plainly. So let's make it concrete.",
      points: [
        { h: "What is n?", p: "n just means the size of the input, usually how many items are in the list. If a list has 10 numbers, n is 10; if it has a million, n is a million. Big-O describes how the work scales as n grows." },
        { h: "How to read the common ones", p: "O(1) = constant: the same tiny amount of work no matter how big n is (like grabbing the first item). O(n) = linear: work grows in step with n (double the items, double the work, like adding them all up). O(log n) = grows very slowly (each step throws away half the data, like binary search). O(n log n) = the cost of a good sort: a little worse than linear, far better than quadratic. O(n^2) = quadratic: work explodes (a loop inside a loop)." },
        { h: "How they rank", p: "From fastest-growing (best) to slowest: O(1) < O(log n) < O(n) < O(n log n) < O(n^2). When someone asks you to 'make it faster,' they usually mean move one rung down this ladder, like turning an O(n^2) nested loop into an O(n) single pass with a hash map." },
        { h: "Simplifying Big-O: keep only what dominates", p: "Big-O cares about the biggest term when n is huge, so you drop constants and smaller terms. Two passes over the list is O(2n), but we just call it O(n): the 2 doesn't change how it scales. A loop that does O(n) work next to a nested loop that does O(n^2) is O(n + n^2), which simplifies to O(n^2) because the n^2 part swamps the rest. You are always naming the term that grows fastest." },
        { h: "Time vs space", p: "'O(n) time' is how many steps it takes. 'O(1) space' is how much extra memory it uses. 'In place' means O(1) space: you don't build a second copy. Interviewers care about both." },
        { h: "Why they ask", p: "They want to know your code still works when n is huge. An O(n) solution handles a million items fine; an O(n^2) one might take forever. Saying the complexity out loud shows you can reason about that." }
      ],
      template: { lang: "JavaScript", code: "// O(1): one step, no matter how big nums is\nreturn nums[0];\n\n// O(n): touches every item once\nlet total = 0;\nfor (const x of nums) total += x;\n\n// O(n^2): a loop inside a loop -> n times n steps\nfor (const a of nums)\n  for (const b of nums)\n    /* compare a and b */;" },
      example: { h: "n-1 and counting from 0", p: "Lists are 0-indexed: the first item is at index 0, so a list of n items has its last item at index n-1. That is why you'll see nums[n-1] for the last element. It is not a typo, it is the last slot." }
    },
    practice: { type: "code", refs: ["sum-array", "last-element"], note: "Solve both, then notice: summing touches every item (O(n)), but grabbing the last item is one step (O(1)). Same array, very different cost." },
    quiz: [
      { q: "In Big-O, what does 'n' usually mean?", choices: ["The answer to the problem", "The size of the input (e.g. number of items)", "The number of lines of code", "A random variable"], answer: 1, explain: "n is the input size. Big-O describes how the work grows as n grows." },
      { q: "A single loop that touches every item in a list of n items is:", choices: ["O(1)", "O(n)", "O(n^2)", "O(log n)"], answer: 1, explain: "One pass over n items is linear time, O(n). Double the items, double the work." },
      { q: "For a 0-indexed list of n items, the last item is at index:", choices: ["n", "n-1", "1", "0"], answer: 1, explain: "Indexes start at 0, so the last of n items sits at index n-1." },
      { q: "You do two separate passes over a list, then one nested loop. What is the overall Big-O?", choices: ["O(2n + n^2)", "O(n^2)", "O(n)", "O(3)"], answer: 1, explain: "Drop constants and smaller terms: O(2n + n^2) simplifies to O(n^2) because the nested loop dominates as n grows." },
      { q: "Order these from fastest-growing (best) to worst: O(n), O(1), O(n^2), O(log n).", choices: ["O(1), O(log n), O(n), O(n^2)", "O(n^2), O(n), O(log n), O(1)", "O(1), O(n), O(log n), O(n^2)", "O(log n), O(1), O(n), O(n^2)"], answer: 0, explain: "Constant is cheapest, then logarithmic, then linear, then quadratic: O(1) < O(log n) < O(n) < O(n^2)." },
      { code: "sum-array" }
    ],
    recall: [
      { front: "What does O(n) mean in plain words?", back: "Work grows in step with the input size n: double the items, double the work (a single pass)." },
      { front: "What does O(1) mean?", back: "Constant work: the same tiny cost no matter how big the input is (e.g. reading one index)." },
      { front: "'In place' / O(1) space means?", back: "You don't build a second copy; you use a fixed, small amount of extra memory." },
      { front: "Last index of a 0-indexed list of n items?", back: "n-1 (indexes start at 0)." },
      { front: "Why does O(2n + n^2) simplify to O(n^2)?", back: "Big-O keeps only the fastest-growing term and drops constants: as n gets huge, n^2 swamps 2n." },
      { front: "The Big-O ladder from best to worst?", back: "O(1) < O(log n) < O(n) < O(n log n) < O(n^2). 'Make it faster' usually means move down a rung." }
    ]
  },
  {
    id: "arrays-indexing", track: "foundations", title: "Arrays & Indexing", kicker: "Start here", est: "35 min",
    learn: {
      intro: "An array (or list) is just an ordered row of items. Almost every problem starts with one, so it is worth being crystal clear on how they work.",
      points: [
        { h: "What an array is", p: "An ordered sequence of items, each in a numbered slot. [10, 20, 30] has three items. Order matters and is preserved." },
        { h: "Indexes start at 0", p: "The position of an item is its index, and indexes start at 0. In [10, 20, 30], index 0 is 10, index 1 is 20, index 2 is 30. So the length is 3 but the last index is 2 (that is n-1)." },
        { h: "What's fast, what's not", p: "Jumping to an item by its index is instant, O(1): the computer knows exactly where it is. But searching for a value when you don't know its index means scanning, O(n)." }
      ],
      template: { lang: "JavaScript", code: "const nums = [10, 20, 30];\nnums[0];                // 10  (first item)\nnums[nums.length - 1];  // 30  (last item, index n-1)\nnums.length;            // 3   (how many items = n)" },
      example: null
    },
    practice: { type: "code", refs: ["last-element", "count-positives"], note: "Last Element makes n-1 concrete; Count Positives is your first real scan across every index." },
    quiz: [
      { q: "In the array [7, 8, 9], what is at index 1?", choices: ["7", "8", "9", "nothing"], answer: 1, explain: "Index 0 is 7, index 1 is 8, index 2 is 9. Indexing starts at 0." },
      { q: "Reading nums[i] when you already know i is:", choices: ["O(n), you have to search", "O(1), instant", "impossible", "O(n^2)"], answer: 1, explain: "Direct index access is constant time; the computer jumps straight to that slot." },
      { code: "last-element" }
    ],
    recall: [
      { front: "What index is the first item of an array?", back: "0. Arrays are 0-indexed." },
      { front: "Length vs last index?", back: "A list of n items has length n but its last index is n-1." },
      { front: "Cost of reading nums[i] vs searching for a value?", back: "Reading a known index is O(1); searching for a value is O(n)." }
    ]
  },
  {
    id: "loops-iteration", track: "foundations", title: "Loops & Iteration", kicker: "Start here", est: "40 min",
    learn: {
      intro: "A loop is how you do something to every item without writing it out by hand. Once you are comfortable looping, most 'scan the array' problems become easy.",
      points: [
        { h: "What a loop does", p: "It repeats a block of code, usually once per item. 'For each number in the list, add it to a total' is a loop. Looping over n items is O(n)." },
        { h: "The counter / accumulator pattern", p: "Keep a variable (a count or a running total) outside the loop, update it each time through, and return it at the end. This one pattern solves a huge share of beginner problems." },
        { h: "Iterating by value vs by index", p: "You can loop by value ('for each n in nums') or by index ('for i from 0 to n-1, use nums[i]'). Index loops matter when you need the position, or two positions at once, which is the Two Pointers idea." }
      ],
      template: { lang: "JavaScript", code: "// by value\nlet total = 0;\nfor (const n of nums) total += n;\n\n// by index (gives you the position i, 0 through n-1)\nfor (let i = 0; i < nums.length; i++) {\n  // nums[i] is the current item, i is its index\n}" },
      example: null
    },
    practice: { type: "code", refs: ["count-positives", "sum-array"], note: "Both use the counter/accumulator pattern: start a variable, update it each pass, return it at the end." },
    quiz: [
      { q: "To count how many items meet a condition, you:", choices: ["Sort the array", "Keep a counter and add 1 each time the condition is true", "Use recursion only", "Reverse the array"], answer: 1, explain: "A counter you increment inside the loop is the standard O(n) approach." },
      { q: "'for (let i = 0; i < nums.length; i++)' loops i over:", choices: ["1 to n", "0 to n-1", "just the last item", "random indexes"], answer: 1, explain: "It starts at 0 and stops before length, so i covers every valid index, 0 through n-1." },
      { code: "count-positives" }
    ],
    recall: [
      { front: "The counter / accumulator pattern?", back: "Keep a variable outside the loop, update it each pass, return it at the end." },
      { front: "Why loop by index instead of by value?", back: "When you need the position i, or two positions at once (the Two Pointers idea)." }
    ]
  },
  {
    id: "hashmaps-sets", track: "foundations", title: "Hash Maps & Sets", kicker: "Start here", est: "45 min",
    learn: {
      intro: "A hash map and a set are the two tools that most often turn a slow O(n^2) solution into a fast O(n) one. Knowing when to reach for them is a big interview edge.",
      points: [
        { h: "What a hash map is", p: "A collection of key -> value pairs with near-instant lookup. 'Have I seen this value before, and where?' becomes an O(1) question instead of an O(n) search. In JavaScript it is an object or Map; in Python a dict." },
        { h: "What a set is", p: "A collection of unique items with instant 'is this in here?' checks. Adding a duplicate does nothing. Perfect for detecting repeats or de-duplicating." },
        { h: "Why they're fast", p: "Instead of scanning the whole list every time (O(n) per check, O(n^2) overall), you remember what you've seen in the map or set and check in O(1). The cost is O(n) extra memory, a trade you name out loud." }
      ],
      template: { lang: "JavaScript", code: "// set: instant membership + uniqueness\nconst seen = new Set();\nseen.add(5);\nseen.has(5);   // true, O(1)\n\n// map: remember where you saw something\nconst index = new Map();\nindex.set(value, i);\nif (index.has(need)) { /* found the match */ }" },
      example: null
    },
    practice: { type: "code", refs: ["contains-duplicate", "two-sum"], note: "Contains Duplicate is a set in one line; Two Sum is a map remembering what it has seen. Both drop O(n^2) to O(n)." },
    quiz: [
      { q: "The main win of a hash map / set over scanning a list is:", choices: ["Less memory", "O(1) lookups instead of O(n) searches", "Sorted output", "Fewer lines only"], answer: 1, explain: "Constant-time lookups turn repeated O(n) searches (O(n^2) total) into O(n)." },
      { q: "To check for duplicates in a list, the cleanest tool is:", choices: ["A second sorted copy", "A Set", "Two pointers", "Binary search"], answer: 1, explain: "Add items to a set; if one is already there, it's a duplicate. O(n) time." },
      { code: "contains-duplicate" }
    ],
    recall: [
      { front: "What does a hash map buy you?", back: "O(1) lookup of 'have I seen this / where is it' instead of an O(n) scan, trading O(n) memory." },
      { front: "When to reach for a set?", back: "Membership checks, detecting duplicates, and de-duplicating, all O(1) per operation." }
    ]
  },
  {
    id: "recursion", track: "foundations", title: "Recursion", kicker: "Start here", est: "45 min",
    learn: {
      intro: "Recursion is a function that solves a problem by calling itself on a smaller piece of the same problem. It feels strange at first, but it is just 'do a tiny bit, then hand the rest to a smaller copy of yourself.' Dynamic programming, tree traversal, and divide-and-conquer all build on it.",
      points: [
        { h: "The two parts every recursion needs", p: "A base case: the smallest version you can answer directly, with no more calling (this is what stops it). And a recursive case: do one small step, then call yourself on something smaller that moves toward the base case. Miss the base case and it never stops (a stack overflow, the code equivalent of a mirror facing a mirror)." },
        { h: "A concrete example: factorial", p: "5! means 5 * 4 * 3 * 2 * 1. Notice 5! is just 5 * 4!, and 4! is 4 * 3!, and so on down to 1! = 1. So: base case n <= 1 returns 1; recursive case returns n * factorial(n-1). Each call peels off one number and trusts the smaller call to handle the rest." },
        { h: "Trust the smaller call", p: "The hard part is mental: you assume the recursive call already returns the right answer for the smaller input, and you only reason about combining it with your one step. You do not trace every level in your head. Define the base case, define the one step, trust the rest." },
        { h: "Cost: the call stack", p: "Each call waits on the one inside it, stacking up until the base case, then unwinding. Recursing n deep uses O(n) memory for that stack, even if you wrote no arrays. Anything you can do recursively you can also do with a loop; recursion just reads cleaner when the problem is naturally self-similar." }
      ],
      template: { lang: "JavaScript", code: "function factorial(n) {\n  if (n <= 1) return 1;        // base case: stop here\n  return n * factorial(n - 1); // recursive case: one step + smaller call\n}\n\n// factorial(3)\n//   -> 3 * factorial(2)\n//        -> 2 * factorial(1)\n//             -> 1   (base case)\n//        -> 2 * 1 = 2\n//   -> 3 * 2 = 6" },
      example: { h: "How to spot a recursive problem", p: "Ask: 'can I describe the answer in terms of the same problem on a smaller input?' Sum of a list = first item + sum of the rest. The 10th step of climbing stairs = ways to reach step 9 + step 8. When the answer refers to itself on something smaller, recursion (or its table-filling cousin, dynamic programming) fits." }
    },
    practice: { type: "code", refs: ["factorial", "recursive-sum"], note: "Write the base case first, every time, then the one step. Factorial multiplies; Recursive Sum adds. Same skeleton, and it is the exact skeleton the DSA Dynamic Programming module builds on." },
    quiz: [
      { q: "What is the job of the base case in a recursion?", choices: ["To make it run faster", "To stop the recursion by answering the smallest case directly", "To call the function twice", "To sort the input"], answer: 1, explain: "The base case is the smallest input you answer without recursing. Without it, the function calls itself forever." },
      { q: "factorial is defined as n * factorial(n-1). What is the recursive case doing?", choices: ["Solving the whole problem at once", "One small step (multiply by n), then trusting a smaller call for the rest", "Looping n times", "Nothing, it's the base case"], answer: 1, explain: "Recursion does one step and delegates the smaller remainder to another call, down to the base case." },
      { q: "Recursing n levels deep costs how much memory for the call stack?", choices: ["O(1)", "O(n)", "O(n^2)", "None, recursion is free"], answer: 1, explain: "Each pending call sits on the stack until the base case unwinds it, so depth n uses O(n) stack space." },
      { code: "factorial" }
    ],
    recall: [
      { front: "The two parts every recursion needs?", back: "A base case (smallest input, answered directly, stops the recursion) and a recursive case (one small step + a call on a smaller input)." },
      { front: "What happens if you forget the base case?", back: "It calls itself forever and crashes (stack overflow). The base case is what stops it." },
      { front: "How should you reason about the recursive call?", back: "Trust it returns the correct answer for the smaller input; you only reason about combining it with your one step." },
      { front: "Memory cost of recursing n deep?", back: "O(n) for the call stack: each pending call waits until the base case unwinds." }
    ]
  },
  /* ---------- DATA SCIENCE & ML ---------- */
  {
    id: "statistics-foundations", track: "data-sci", title: "Statistics Foundations", kicker: "Core skill", est: "45 min",
    learn: {
      intro: "Data science starts with describing data honestly. Mean, median, and spread are the first questions any analyst asks, and interviews expect you to know when each one lies.",
      points: [
        { h: "Mean vs median", p: "The mean is the average (sum / count). The median is the middle value when sorted. The median resists outliers: one billionaire barely moves the median income but wildly inflates the mean." },
        { h: "Spread: variance and standard deviation", p: "The mean alone hides how spread out the data is. Standard deviation measures the typical distance from the mean: small means tightly clustered, large means all over the place." },
        { h: "Distributions", p: "Data has a shape. A normal (bell curve) distribution is symmetric; skewed data has a long tail. The shape decides whether the mean or the median is the honest summary." }
      ],
      template: null,
      example: { h: "Why it matters for energy / water", p: "Average daily usage can look fine while a few extreme-demand days (the tail) are what actually strain the grid. Median and spread catch what the mean hides." }
    },
    practice: { type: "code", refs: ["mean", "median"], note: "Implement both by hand. Notice median needs a sort; mean is a single pass." },
    quiz: [
      { q: "Which is more resistant to a few extreme outliers?", choices: ["The mean", "The median", "They're identical", "Neither"], answer: 1, explain: "The median is the middle value, so extreme outliers barely move it; they can drag the mean a lot." },
      { q: "Standard deviation measures:", choices: ["The average", "The middle value", "How spread out the data is around the mean", "The largest value"], answer: 2, explain: "It is the typical distance of points from the mean, i.e. the spread." },
      { code: "mean" }
    ],
    recall: [
      { front: "Mean vs median, when do they differ most?", back: "On skewed data or with outliers: the mean gets dragged toward the tail; the median stays central." },
      { front: "What does standard deviation tell you?", back: "How spread out the data is around the mean (small = tight, large = dispersed)." }
    ]
  },
  {
    id: "data-wrangling", track: "data-sci", title: "Data Wrangling", kicker: "Core skill", est: "40 min",
    learn: {
      intro: "Most data-science time is spent cleaning and reshaping data, not modeling. The core moves (filter, aggregate, group, join) are the same whether you do them in SQL, pandas, or plain code.",
      points: [
        { h: "The four core moves", p: "Filter (keep the rows you want), aggregate (sum / avg / count them), group-by (do that per category), and join (combine two tables on a shared key). Master these and you can shape almost any dataset." },
        { h: "SQL and pandas are the same ideas", p: "A pandas groupby is a SQL GROUP BY; a merge is a JOIN. If you learned it in the Data Engineering track's SQL, you already know the concepts. pandas is the in-memory Python version." },
        { h: "Clean before you model", p: "Missing values, duplicates, wrong types, and outliers wreck a model silently. Handling them (drop, fill, or flag) is the unglamorous majority of real work." }
      ],
      template: null, example: null
    },
    practice: { type: "sql", refs: ["sql-total-per-site", "sql-region-threshold"], note: "These GROUP BY / HAVING queries are exactly the aggregate-and-filter moves you'll do in pandas: same logic, SQL syntax." },
    quiz: [
      { q: "A pandas groupby().sum() is the same idea as which SQL?", choices: ["SELECT *", "GROUP BY with SUM", "DROP TABLE", "CREATE INDEX"], answer: 1, explain: "Grouping rows by a key and aggregating is GROUP BY plus an aggregate in both." },
      { q: "Roughly how much of real data-science work is cleaning and wrangling?", choices: ["About 10%", "About half or more", "None", "Only for beginners"], answer: 1, explain: "The large majority of the effort is getting data clean and shaped before any modeling." }
    ],
    recall: [
      { front: "The four core data-wrangling moves?", back: "Filter, aggregate, group-by, and join." },
      { front: "pandas groupby vs SQL?", back: "Same concept: groupby = GROUP BY, merge = JOIN. pandas is the in-memory Python version." }
    ]
  },
  {
    id: "ml-fundamentals", track: "data-sci", title: "Machine Learning Fundamentals", kicker: "Core skill", est: "50 min",
    learn: {
      intro: "Machine learning sounds mystical, but the core vocabulary is simple. Get these terms straight and most ML interview questions become approachable.",
      points: [
        { h: "Supervised vs unsupervised", p: "Supervised = you have labeled examples (inputs with known answers) and learn to predict the answer. Unsupervised = no labels; you find structure, like grouping similar customers (clustering)." },
        { h: "Features and labels", p: "Features are the inputs (a home's size, location, age). The label is what you predict (its price). The model learns the relationship from many examples." },
        { h: "Train / test split and overfitting", p: "You train on one slice of data and test on a held-out slice you never trained on. If it aces training but flops on the test set, it memorized instead of learned. That is overfitting." }
      ],
      template: null,
      example: { h: "Energy / water example", p: "Predicting tomorrow's demand from features like temperature, day-of-week, and recent usage is supervised regression. You would test on days the model never saw." }
    },
    practice: { type: "code", refs: ["accuracy"], note: "Accuracy is how you score a supervised classifier's predictions against the true labels." },
    quiz: [
      { q: "You have data labeled with the correct answer and want to predict it. That is:", choices: ["Unsupervised learning", "Supervised learning", "Clustering", "Reinforcement only"], answer: 1, explain: "Labeled inputs mapped to a predicted label is supervised learning." },
      { q: "A model that scores great on training data but poorly on new data has:", choices: ["Underfit", "Overfit", "Perfect generalization", "Too few features"], answer: 1, explain: "It memorized the training set instead of learning the pattern. The held-out test set reveals it." },
      { q: "In predicting house price from size and location, 'price' is the:", choices: ["Feature", "Label (target)", "Outlier", "Index"], answer: 1, explain: "Price is what you predict, the label. Size and location are features." }
    ],
    recall: [
      { front: "Supervised vs unsupervised?", back: "Supervised uses labeled examples to predict an answer; unsupervised finds structure with no labels (e.g. clustering)." },
      { front: "Features vs label?", back: "Features are the inputs; the label is what you predict." },
      { front: "What is overfitting, and how do you catch it?", back: "Memorizing training data so it fails on new data; a held-out test set reveals it." }
    ]
  },
  {
    id: "model-evaluation", track: "data-sci", title: "Model Evaluation", kicker: "Core skill", est: "45 min",
    learn: {
      intro: "A model is only as good as how you measure it, and accuracy alone will fool you. Knowing the right metric for the job is a favorite interview probe.",
      points: [
        { h: "Accuracy and its trap", p: "Accuracy is the fraction correct. But if 99% of emails are not spam, a model that always says 'not spam' is 99% accurate and useless. On imbalanced data, accuracy lies." },
        { h: "Precision and recall", p: "Precision: of the things you flagged positive, how many really were? Recall: of the real positives, how many did you catch? There is a tradeoff; chase recall and precision usually drops. F1 balances the two." },
        { h: "Regression error: RMSE and MAE", p: "For predicting numbers (not categories), you measure how far off you are. RMSE (root mean squared error) punishes big misses harder; MAE (mean absolute error) treats them evenly." }
      ],
      template: null,
      example: { h: "Why forecasters use RMSE", p: "For energy / water demand, a few large forecast misses are what cause outages, so RMSE's extra penalty on big errors matches what you actually care about." }
    },
    practice: { type: "code", refs: ["accuracy", "rmse"], note: "Accuracy scores classifiers; RMSE scores numeric forecasts. Implementing both makes the formulas stick." },
    quiz: [
      { q: "Why can accuracy be misleading?", choices: ["It's hard to compute", "On imbalanced data, always guessing the majority looks accurate but is useless", "It only works for regression", "It ignores the training set"], answer: 1, explain: "With 99% one class, a trivial always-majority model scores 99% accuracy while catching nothing." },
      { q: "'Of the items I flagged positive, how many truly were?' is:", choices: ["Recall", "Precision", "Accuracy", "RMSE"], answer: 1, explain: "That is precision. Recall is the reverse: of the true positives, how many you caught." },
      { q: "For predicting a continuous number, a standard error metric is:", choices: ["Accuracy", "Precision", "RMSE", "F1"], answer: 2, explain: "RMSE (or MAE) measures how far numeric predictions are from the truth." },
      { code: "accuracy" }
    ],
    recall: [
      { front: "Why is accuracy misleading on imbalanced data?", back: "Always predicting the majority class scores high accuracy while catching none of the rare (often important) class." },
      { front: "Precision vs recall?", back: "Precision: of flagged positives, how many were real. Recall: of real positives, how many you caught." },
      { front: "Metric for numeric predictions?", back: "RMSE or MAE: how far off the numbers are (RMSE punishes big misses harder)." }
    ]
  },
  {
    id: "time-series", track: "data-sci", title: "Time Series & Forecasting", kicker: "Applied", est: "45 min",
    learn: {
      intro: "A lot of real data (energy demand, water flow, sensor readings) arrives over time, and time-series has its own rules. This is the corner of data science that fits utility and climate work best.",
      points: [
        { h: "Trend and seasonality", p: "A time series often has a trend (a long-term rise or fall) and seasonality (repeating cycles: daily, weekly, yearly). Demand up every evening and every summer is seasonality." },
        { h: "Smoothing with moving averages", p: "Raw sensor data is noisy. A moving average (the average of the last k points) smooths it so the real pattern shows through. It is the simplest, most-used time-series tool." },
        { h: "Forecasting and honest testing", p: "To predict the future you must not peek at it: test on later time periods the model never saw, never by shuffling randomly (that leaks the future into training). Score forecasts with RMSE." }
      ],
      template: null,
      example: { h: "The whole loop", p: "Smooth the meter data (moving average), spot the daily / seasonal pattern, forecast tomorrow, and score it with RMSE against what actually happened. That is the core of demand forecasting." }
    },
    practice: { type: "code", refs: ["moving-average", "rmse"], note: "Moving average smooths a series; RMSE scores your forecast. Together they are the backbone of demand forecasting." },
    quiz: [
      { q: "Demand rising every evening and every summer is an example of:", choices: ["A trend", "Seasonality", "An outlier", "Noise"], answer: 1, explain: "Repeating cycles (daily, yearly) are seasonality. A trend is a long-term direction." },
      { q: "The simplest way to smooth noisy sensor data is:", choices: ["Delete outliers", "A moving average", "Sort it", "One-hot encoding"], answer: 1, explain: "Averaging over a sliding window of recent points smooths noise while keeping the pattern." },
      { q: "To test a forecasting model honestly, you:", choices: ["Shuffle all data randomly", "Train on earlier time, test on later time it never saw", "Test on the training data", "Only use accuracy"], answer: 1, explain: "Time order matters: random shuffling leaks future info. Hold out later periods and score with RMSE." },
      { code: "moving-average" }
    ],
    recall: [
      { front: "Trend vs seasonality?", back: "Trend is a long-term rise/fall; seasonality is repeating cycles (daily, weekly, yearly)." },
      { front: "How do you smooth noisy time-series data?", back: "A moving average: the average of the last k points over a sliding window." },
      { front: "How do you test a forecast honestly?", back: "Train on earlier periods, test on later ones the model never saw (never random-shuffle); score with RMSE." }
    ]
  }
];

/* ===================== SQL PROBLEM BANK ===================== */
var SQL_SETUP =
  "CREATE TABLE sites (id INTEGER, name TEXT, region TEXT);" +
  "INSERT INTO sites VALUES (1,'Harbor','West'),(2,'Ridge','West'),(3,'Delta','East');" +
  "CREATE TABLE readings (id INTEGER, site_id INTEGER, ts TEXT, kwh INTEGER);" +
  "INSERT INTO readings VALUES (1,1,'2024-01-01',10),(2,1,'2024-01-02',20),(3,1,'2024-01-03',30),(4,2,'2024-01-01',50),(5,2,'2024-01-02',60),(6,3,'2024-01-01',5),(7,3,'2024-01-02',15),(8,3,'2024-01-03',25);";

var SQL_PROBLEMS = [
  {
    id: "sql-total-per-site", title: "Total usage per site", difficulty: "Easy",
    prompt: "Return each site's name and its total kwh across all readings, ordered by name. Columns: name, total_kwh.",
    starter: "-- tables: sites(id, name, region), readings(id, site_id, ts, kwh)\n-- return columns: name, total_kwh\nSELECT\n\nFROM readings r\n;",
    solution: "SELECT s.name, SUM(r.kwh) AS total_kwh\nFROM readings r\nJOIN sites s ON s.id = r.site_id\nGROUP BY s.name\nORDER BY s.name;",
    expected: { columns: ["name", "total_kwh"], rows: [["Delta", 45], ["Harbor", 60], ["Ridge", 110]] }
  },
  {
    id: "sql-region-threshold", title: "West sites over a threshold", difficulty: "Easy",
    prompt: "Return name and total_kwh for sites in the 'West' region whose total kwh is over 50, ordered by name. Columns: name, total_kwh.",
    starter: "-- tables: sites(id, name, region), readings(id, site_id, ts, kwh)\n-- return columns: name, total_kwh\nSELECT\n\nFROM readings r\n;",
    solution: "SELECT s.name, SUM(r.kwh) AS total_kwh\nFROM readings r\nJOIN sites s ON s.id = r.site_id\nWHERE s.region = 'West'\nGROUP BY s.name\nHAVING SUM(r.kwh) > 50\nORDER BY s.name;",
    expected: { columns: ["name", "total_kwh"], rows: [["Harbor", 60], ["Ridge", 110]] }
  },
  {
    id: "sql-running-total", title: "Running total for a site", difficulty: "Medium",
    prompt: "For site_id 1, return each reading's ts, kwh, and a running total of kwh ordered by ts. Columns: ts, kwh, running_kwh.",
    starter: "-- tables: readings(id, site_id, ts, kwh)\n-- return columns: ts, kwh, running_kwh\nSELECT\n\nFROM readings\nWHERE site_id = 1\n;",
    solution: "SELECT ts, kwh,\n  SUM(kwh) OVER (ORDER BY ts) AS running_kwh\nFROM readings\nWHERE site_id = 1\nORDER BY ts;",
    expected: { columns: ["ts", "kwh", "running_kwh"], rows: [["2024-01-01", 10, 10], ["2024-01-02", 20, 30], ["2024-01-03", 30, 60]] }
  },
  {
    id: "sql-rank-sites", title: "Rank sites by usage", difficulty: "Medium",
    prompt: "Rank sites by total kwh, highest first. Return name, total_kwh, and the rank (rnk), ordered by rank. Columns: name, total_kwh, rnk.",
    starter: "-- tables: sites(id, name, region), readings(id, site_id, ts, kwh)\n-- return columns: name, total_kwh, rnk\nSELECT\n\nFROM readings r\n;",
    solution: "SELECT s.name, SUM(r.kwh) AS total_kwh,\n  RANK() OVER (ORDER BY SUM(r.kwh) DESC) AS rnk\nFROM readings r\nJOIN sites s ON s.id = r.site_id\nGROUP BY s.name\nORDER BY rnk;",
    expected: { columns: ["name", "total_kwh", "rnk"], rows: [["Ridge", 110, 1], ["Harbor", 60, 2], ["Delta", 45, 3]] }
  }
];
