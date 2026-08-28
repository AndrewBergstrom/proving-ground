/* Proving Ground - compiled-language judge client (optional).
 *
 * Turns a function-style problem (fnName + tests[{args, expected}] + a small
 * type signature) into a complete, self-checking program in Java, C#, C++, Go,
 * or Rust, sends it to a self-hosted Judge0 (see judge/RUNBOOK.md), and parses
 * the per-case pass/fail back into the same result shape the local JS/Python
 * runners use.
 *
 * Feature is OFF unless window.PG_CONFIG.JUDGE_URL is set. Types supported by
 * the harness today: "int", "bool", "string", "int[]" (extend ADAPT to add more).
 *
 * The program prints one line per case:  PG_CASE <i> <P|F> <gotAsString>
 */
(function () {
  "use strict";

  var DEFAULT_ORDER = ["java", "csharp", "cpp", "go", "rust"];

  // Remote languages: display label + a regex to resolve the numeric Judge0
  // language_id from GET /languages (names/ids vary by Judge0 version).
  var LANGS = {
    java:   { label: "Java",  match: /openjdk/i },
    csharp: { label: "C#",    match: /c#|mono/i },
    cpp:    { label: "C++",   match: /c\+\+/i },
    go:     { label: "Go",    match: /^go[\s(]/i },
    rust:   { label: "Rust",  match: /rust/i }
  };

  function cfg() { return window.PG_CONFIG || {}; }
  function base() { return String(cfg().JUDGE_URL || "").replace(/\/+$/, ""); }
  function enabled() { return !!base(); }

  function q(v) { return JSON.stringify(v); }               // safe string literal (double-quoted, escaped)
  function ints(v) { return v.join(", "); }

  /* ---------- per-language adapters ---------- */
  var ADAPT = {
    java: {
      name: function (t) { return t === "int" ? "int" : t === "bool" ? "boolean" : t === "string" ? "String" : "int[]"; },
      lit: function (t, v) { return t === "int" ? String(v) : t === "bool" ? (v ? "true" : "false") : t === "string" ? q(v) : "new int[]{" + ints(v) + "}"; },
      decl: function (t, n, e) { return this.name(t) + " " + n + " = " + e + ";"; },
      call: function (fn, a) { return "sol." + fn + "(" + a.join(", ") + ")"; },
      eq: function (t, a, b) { return t === "string" ? a + ".equals(" + b + ")" : t === "int[]" ? "java.util.Arrays.equals(" + a + ", " + b + ")" : a + " == " + b; },
      str: function (t, v) { return t === "int[]" ? "java.util.Arrays.toString(" + v + ")" : t === "string" ? v : "String.valueOf(" + v + ")"; },
      report: function (i, ret) { return "rep(" + i + ", " + this.eq(ret, "got", "want") + ", " + this.str(ret, "got") + ");"; },
      block: function (L) { return "{\n      " + L.join("\n      ") + "\n    }"; },
      file: function (userCode, fnName, body) {
        return "import java.util.*;\n" + userCode + "\n" +
          "public class Main {\n" +
          "  static void rep(int i, boolean pass, String got){ System.out.println(\"PG_CASE \"+i+(pass?\" P \":\" F \")+got); }\n" +
          "  public static void main(String[] a){\n" +
          "    Solution sol = new Solution();\n    " + body + "\n  }\n}\n";
      }
    },
    csharp: {
      name: function (t) { return t === "int" ? "int" : t === "bool" ? "bool" : t === "string" ? "string" : "int[]"; },
      lit: function (t, v) { return t === "int" ? String(v) : t === "bool" ? (v ? "true" : "false") : t === "string" ? q(v) : "new int[]{" + ints(v) + "}"; },
      decl: function (t, n, e) { return this.name(t) + " " + n + " = " + e + ";"; },
      call: function (fn, a) { return "sol." + fn + "(" + a.join(", ") + ")"; },
      eq: function (t, a, b) { return t === "int[]" ? "System.Linq.Enumerable.SequenceEqual(" + a + ", " + b + ")" : a + " == " + b; },
      str: function (t, v) { return t === "int[]" ? "\"[\" + string.Join(\", \", " + v + ") + \"]\"" : t === "string" ? v : v + ".ToString()"; },
      report: function (i, ret) { return "Rep(" + i + ", " + this.eq(ret, "got", "want") + ", " + this.str(ret, "got") + ");"; },
      block: function (L) { return "{\n      " + L.join("\n      ") + "\n    }"; },
      file: function (userCode, fnName, body) {
        return "using System;\nusing System.Linq;\n" + userCode + "\n" +
          "public class Program {\n" +
          "  static void Rep(int i, bool pass, string got){ Console.WriteLine(\"PG_CASE \"+i+(pass?\" P \":\" F \")+got); }\n" +
          "  public static void Main(){\n    var sol = new Solution();\n    " + body + "\n  }\n}\n";
      }
    },
    cpp: {
      name: function (t) { return t === "int" ? "int" : t === "bool" ? "bool" : t === "string" ? "string" : "vector<int>"; },
      lit: function (t, v) { return t === "int" ? String(v) : t === "bool" ? (v ? "true" : "false") : t === "string" ? q(v) : "{" + ints(v) + "}"; },
      decl: function (t, n, e) { return this.name(t) + " " + n + " = " + e + ";"; },
      call: function (fn, a) { return fn + "(" + a.join(", ") + ")"; },
      eq: function (t, a, b) { return a + " == " + b; },
      str: function (t, v) { return t === "int[]" ? "vecstr(" + v + ")" : t === "string" ? v : t === "bool" ? "(" + v + "?std::string(\"true\"):std::string(\"false\"))" : "std::to_string(" + v + ")"; },
      report: function (i, ret) { return "rep(" + i + ", " + this.eq(ret, "got", "want") + ", " + this.str(ret, "got") + ");"; },
      block: function (L) { return "{\n      " + L.join("\n      ") + "\n    }"; },
      file: function (userCode, fnName, body) {
        return "#include <bits/stdc++.h>\nusing namespace std;\n" +
          "static string vecstr(const vector<int>& v){ string s=\"[\"; for(size_t i=0;i<v.size();++i){ if(i) s+=\", \"; s+=to_string(v[i]); } return s+\"]\"; }\n" +
          "static void rep(int i, bool pass, const string& got){ cout<<\"PG_CASE \"<<i<<(pass?\" P \":\" F \")<<got<<\"\\n\"; }\n" +
          userCode + "\n" +
          "int main(){\n    " + body + "\n    return 0;\n}\n";
      }
    },
    go: {
      name: function (t) { return t === "int" ? "int" : t === "bool" ? "bool" : t === "string" ? "string" : "[]int"; },
      lit: function (t, v) { return t === "int" ? String(v) : t === "bool" ? (v ? "true" : "false") : t === "string" ? q(v) : "[]int{" + ints(v) + "}"; },
      decl: function (t, n, e) { return "var " + n + " " + this.name(t) + " = " + e; },
      call: function (fn, a) { return fn + "(" + a.join(", ") + ")"; },
      eq: function (t, a, b) { return t === "int[]" ? "reflect.DeepEqual(" + a + ", " + b + ")" : a + " == " + b; },
      str: function (t, v) { return t === "string" ? v : "fmt.Sprintf(\"%v\", " + v + ")"; },
      report: function (i, ret) { return "rep(" + i + ", " + this.eq(ret, "got", "want") + ", " + this.str(ret, "got") + ")"; },
      block: function (L) { return "{\n      " + L.join("\n      ") + "\n    }"; },
      file: function (userCode, fnName, body) {
        return "package main\nimport (\n\t\"fmt\"\n\t\"reflect\"\n)\n" +
          "var _ = reflect.DeepEqual\n" +
          "func rep(i int, pass bool, got string){ s := \"F\"; if pass { s = \"P\" }; fmt.Printf(\"PG_CASE %d %s %s\\n\", i, s, got) }\n" +
          userCode + "\n" +
          "func main(){\n    " + body + "\n}\n";
      }
    },
    rust: {
      name: function (t) { return t === "int" ? "i32" : t === "bool" ? "bool" : t === "string" ? "String" : "Vec<i32>"; },
      lit: function (t, v) { return t === "int" ? String(v) : t === "bool" ? (v ? "true" : "false") : t === "string" ? q(v) + ".to_string()" : "vec![" + ints(v) + "]"; },
      decl: function (t, n, e) { return "let " + n + ": " + this.name(t) + " = " + e + ";"; },
      call: function (fn, a) { return fn + "(" + a.join(", ") + ")"; },
      eq: function (t, a, b) { return a + " == " + b; },
      str: function (t, v) { return t === "int[]" ? "format!(\"{:?}\", " + v + ")" : "format!(\"{}\", " + v + ")"; },
      report: function (i, ret) { return "rep(" + i + ", " + this.eq(ret, "got", "want") + ", " + this.str(ret, "got") + ");"; },
      block: function (L) { return "{\n      " + L.join("\n      ") + "\n    }"; },
      file: function (userCode, fnName, body) {
        return "fn rep(i: i32, pass: bool, got: String){ println!(\"PG_CASE {} {} {}\", i, if pass {\"P\"} else {\"F\"}, got); }\n" +
          userCode + "\n" +
          "fn main(){\n    " + body + "\n}\n";
      }
    }
  };

  /* ---------- source assembly ---------- */
  function fnFor(prob, langId) {
    var e = prob.code && prob.code[langId];
    return (e && e.fn) || prob.fnName;
  }

  function buildSource(langId, prob, userCode) {
    var A = ADAPT[langId];
    if (!A) throw new Error("Unsupported language: " + langId);
    if (!prob.sig) throw new Error("Problem " + prob.id + " has no type signature (sig).");
    var sig = prob.sig, fn = fnFor(prob, langId);
    var body = prob.tests.map(function (t, i) {
      var L = [], argVars = [];
      t.args.forEach(function (v, ai) {
        var nm = "a" + ai;
        L.push(A.decl(sig.params[ai], nm, A.lit(sig.params[ai], v)));
        argVars.push(nm);
      });
      L.push(A.decl(sig.ret, "want", A.lit(sig.ret, t.expected)));
      L.push(A.decl(sig.ret, "got", A.call(fn, argVars)));
      L.push(A.report(i, sig.ret));
      return A.block(L);
    }).join("\n    ");
    return A.file(userCode, fn, body);
  }

  /* ---------- Judge0 language id resolution (cached) ---------- */
  var _idPromise = null;
  function resolveIds() {
    if (_idPromise) return _idPromise;
    _idPromise = fetch(base() + "/languages").then(function (r) {
      if (!r.ok) throw new Error("could not list judge languages (" + r.status + ")");
      return r.json();
    }).then(function (list) {
      var map = {};
      Object.keys(LANGS).forEach(function (id) {
        var re = LANGS[id].match;
        var hits = list.filter(function (L) { return re.test(L.name); }).sort(function (a, b) { return b.id - a.id; });
        if (hits.length) map[id] = hits[0].id;
      });
      return map;
    }).catch(function (e) { _idPromise = null; throw e; });
    return _idPromise;
  }

  /* ---------- run + parse ---------- */
  function trunc(s) { s = String(s == null ? "" : s); return s.length > 4000 ? s.slice(0, 4000) + "\n..." : s; }
  function tryParse(s) { try { return JSON.parse(s); } catch (e) { return s; } }

  function parseResult(prob, res) {
    if (res.compile_output) return { error: "Compile error:\n" + trunc(res.compile_output) };
    var stId = res.status && res.status.id;
    if (stId === 6) return { error: "Compile error:\n" + trunc(res.message || "") };
    var out = res.stdout || "";
    var byIdx = {};
    out.split("\n").forEach(function (line) {
      var m = line.match(/^PG_CASE (\d+) ([PF]) ?(.*)$/);
      if (m) byIdx[+m[1]] = { pass: m[2] === "P", got: m[3] };
    });
    if (!Object.keys(byIdx).length) {
      var msg = res.stderr || res.message || (res.status && res.status.description) || "No output from the judge.";
      return { error: trunc(msg) };
    }
    var results = prob.tests.map(function (t, i) {
      var r = byIdx[i];
      if (!r) return { pass: false, args: t.args, expected: t.expected, error: trunc(res.stderr || "run stopped before this case") };
      return { pass: r.pass, args: t.args, expected: t.expected, got: r.pass ? t.expected : tryParse(r.got) };
    });
    return { results: results };
  }

  function run(prob, langId, userCode, cb) {
    if (!enabled()) { cb({ error: "The code judge is not configured." }); return; }
    var src;
    try { src = buildSource(langId, prob, userCode); }
    catch (e) { cb({ error: String(e && e.message || e) }); return; }
    resolveIds().then(function (map) {
      var lid = map[langId];
      if (!lid) throw new Error(LANGS[langId].label + " is not available on this judge.");
      return fetch(base() + "/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_code: src, language_id: lid, cpu_time_limit: 5, wall_time_limit: 10, memory_limit: 128000 })
      });
    }).then(function (r) {
      if (!r.ok) throw new Error("judge returned HTTP " + r.status);
      return r.json();
    }).then(function (res) { cb(parseResult(prob, res)); })
      .catch(function (e) { cb({ error: "Judge error: " + String(e && e.message || e) }); });
  }

  /* ---------- what the app asks ---------- */
  function remoteLangsFor(prob) {
    if (!enabled() || !prob || !prob.sig || !prob.code) return [];
    var order = cfg().REMOTE_LANGS || DEFAULT_ORDER;
    return order.filter(function (id) { return LANGS[id] && prob.code[id] && prob.code[id].starter; });
  }
  function label(id) { return LANGS[id] ? LANGS[id].label : id; }
  function isRemote(id) { return !!LANGS[id]; }
  function starter(prob, id) { return prob.code && prob.code[id] ? prob.code[id].starter : ""; }
  function solution(prob, id) { return prob.code && prob.code[id] ? prob.code[id].solution : ""; }

  window.PGJudge = {
    enabled: enabled,
    langs: LANGS,
    label: label,
    isRemote: isRemote,
    remoteLangsFor: remoteLangsFor,
    starter: starter,
    solution: solution,
    buildSource: buildSource,   // exposed for tests
    run: run
  };
})();
