/* Proving Ground - engine. Depends on data.js (TRACKS, MODULES, PROBLEMS, PATTERNS, DECOMP, BUILDS, RAG_STAGES, RUBRIC). */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function problem(id) { return byId(PROBLEMS, id); }

  var INTERVALS = [0, 1, 3, 7, 16, 35], DAY = 86400000;
  function humanDays(d) { if (d < 1) return "now"; if (d < 7) return d + "d"; if (d < 30) return Math.round(d / 7) + "w"; return Math.round(d / 30) + "mo"; }

  /* ---------- state ---------- */
  var KEY = "pg.v2";
  var state = load();
  function load() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { s = {}; }
    s.code = s.code || {}; s.solved = s.solved || {}; s.quiz = s.quiz || {};
    s.learned = s.learned || {}; s.cards = s.cards || {}; s.rag = s.rag || {};
    s.builds = s.builds || {}; s.decompDone = s.decompDone || [];
    s.lang = s.lang || "js";
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} updateRing(); }

  /* ---------- spaced repetition (keyed cards) ---------- */
  function cardState(k) { return state.cards[k] || { box: 0, due: 0 }; }
  function nextLabel(k, g) {
    var box = cardState(k).box;
    if (g === "again") return "now";
    if (g === "hard") box = Math.max(1, box);
    else if (g === "good") box = Math.min(INTERVALS.length - 1, box + 1);
    else if (g === "easy") box = Math.min(INTERVALS.length - 1, box + 2);
    return humanDays(INTERVALS[box]);
  }
  function gradeCard(k, g) {
    var box = cardState(k).box;
    if (g === "again") box = 0;
    else if (g === "hard") box = Math.max(1, box);
    else if (g === "good") box = Math.min(INTERVALS.length - 1, box + 1);
    else if (g === "easy") box = Math.min(INTERVALS.length - 1, box + 2);
    state.cards[k] = { box: box, due: g === "again" ? Date.now() : Date.now() + INTERVALS[box] * DAY };
    save();
  }

  /* ---------- JS code runner (sandboxed worker) ---------- */
  var JS_WORKER = [
    'self.onmessage=function(e){',
    ' var code=e.data.code,tests=e.data.tests,fnName=e.data.fnName;',
    ' function deepEq(a,b){if(a===b)return true;if(typeof a!=="object"||typeof b!=="object"||a===null||b===null)return a===b;var ka=Object.keys(a),kb=Object.keys(b);if(ka.length!==kb.length)return false;for(var i=0;i<ka.length;i++){if(!deepEq(a[ka[i]],b[ka[i]]))return false;}return true;}',
    ' var fn;',
    ' try{fn=(0,eval)(code+"\\n;(typeof "+fnName+" === \\"function\\" ? "+fnName+" : null)");}catch(err){self.postMessage({error:String(err&&err.message||err)});return;}',
    ' if(typeof fn!=="function"){self.postMessage({error:"Define a function named "+fnName+" and try again."});return;}',
    ' var results=[];',
    ' for(var i=0;i<tests.length;i++){var t=tests[i],args;try{args=JSON.parse(JSON.stringify(t.args));}catch(_){args=t.args;}try{var out=fn.apply(null,args);results.push({pass:deepEq(out,t.expected),got:out,args:t.args,expected:t.expected});}catch(err){results.push({pass:false,error:String(err&&err.message||err),args:t.args,expected:t.expected});}}',
    ' self.postMessage({results:results});',
    '};'
  ].join("\n");
  function runProblem(prob, code, cb) {
    var url, w, done = false, timer;
    try {
      url = URL.createObjectURL(new Blob([JS_WORKER], { type: "application/javascript" }));
      w = new Worker(url);
    } catch (e) { cb({ error: "Could not start the sandbox in this browser." }); return; }
    function finish(data) { if (done) return; done = true; clearTimeout(timer); try { w.terminate(); URL.revokeObjectURL(url); } catch (e) {} cb(data); }
    timer = setTimeout(function () { finish({ error: "Time limit exceeded - check for an infinite loop." }); }, 2500);
    w.onmessage = function (e) { finish(e.data); };
    w.onerror = function (er) { finish({ error: er.message || "Runtime error." }); };
    w.postMessage({ code: code, tests: prob.tests, fnName: prob.fnName });
  }

  /* ---------- Python runner (Pyodide in a Web Worker, timeout-guarded) ---------- */
  var PY_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  var PY_WORKER = [
    'let pyReady=null;',
    'self.onmessage=function(e){',
    ' var m=e.data;',
    ' if(m.type==="init"){',
    '  if(!pyReady){ try{ importScripts(m.base+"pyodide.js"); }catch(err){ self.postMessage({type:"loaderror",error:String(err)}); return; } pyReady=self.loadPyodide({indexURL:m.base}); }',
    '  pyReady.then(function(){ self.postMessage({type:"ready"}); }, function(err){ self.postMessage({type:"loaderror",error:String(err)}); });',
    '  return;',
    ' }',
    ' if(m.type==="run"){',
    '  pyReady.then(function(py){',
    '   try{ py.globals.set("__TESTS_JSON", m.testsJson); py.runPython(m.program); self.postMessage({type:"result",id:m.id,result:py.globals.get("__result")}); }',
    '   catch(err){ self.postMessage({type:"runerror",id:m.id,error:String(err&&err.message||err)}); }',
    '  });',
    ' }',
    '};'
  ].join("\n");
  var _pyWorker = null, _pyReady = false, _pyReadyCbs = [], _pyReqId = 0, _pyReqs = {};
  function pyErrLine(e) { var m = String((e && e.message) || e || "Python error").trim().split("\n"); return m[m.length - 1] || "Python error"; }
  function _resetPyWorker() { try { if (_pyWorker) _pyWorker.terminate(); } catch (e) {} _pyWorker = null; _pyReady = false; }
  function _failPyReqs(msg) { Object.keys(_pyReqs).forEach(function (id) { var req = _pyReqs[id]; delete _pyReqs[id]; clearTimeout(req.timer); req.cb({ type: "runerror", error: msg }); }); }
  function _newPyWorker() {
    try { _pyWorker = new Worker(URL.createObjectURL(new Blob([PY_WORKER], { type: "application/javascript" }))); }
    catch (e) { var cbsE = _pyReadyCbs; _pyReadyCbs = []; cbsE.forEach(function (c) { c.err("Could not start the Python worker."); }); return; }
    _pyReady = false;
    _pyWorker.onmessage = function (e) {
      var m = e.data;
      if (m.type === "ready") { _pyReady = true; var cbs = _pyReadyCbs; _pyReadyCbs = []; cbs.forEach(function (c) { c.ok(); }); }
      else if (m.type === "loaderror") { var cbs2 = _pyReadyCbs; _pyReadyCbs = []; cbs2.forEach(function (c) { c.err("Could not load the Python runtime. Check your connection."); }); _resetPyWorker(); }
      else if (m.type === "result" || m.type === "runerror") { var req = _pyReqs[m.id]; if (req) { delete _pyReqs[m.id]; clearTimeout(req.timer); req.cb(m); } }
    };
    _pyWorker.onerror = function () { _failPyReqs("Python worker crashed."); _resetPyWorker(); };
    _pyWorker.postMessage({ type: "init", base: PY_BASE });
  }
  function ensurePy(onReady, onErr) {
    if (_pyReady) { onReady(); return; }
    _pyReadyCbs.push({ ok: onReady, err: onErr });
    if (!_pyWorker) _newPyWorker();
  }
  function runPythonProblem(prob, code, cb) {
    ensurePy(function () {
      var id = ++_pyReqId;
      var program =
        "import json\n" + code + "\n" +
        "__tests = json.loads(__TESTS_JSON)\n" +
        "__out = []\n" +
        "for __t in __tests:\n" +
        "    try:\n" +
        "        __r = " + prob.fnName + "(*__t['args'])\n" +
        "        __out.append({'got': __r, 'ok': True})\n" +
        "    except Exception as __e:\n" +
        "        __out.append({'error': str(__e), 'ok': False})\n" +
        "__result = json.dumps(__out)\n";
      var timer = setTimeout(function () {
        if (_pyReqs[id]) { delete _pyReqs[id]; _resetPyWorker(); _failPyReqs("Python was restarted after a timeout; run again."); cb({ error: "Time limit exceeded - check for an infinite loop." }); }
      }, 8000);
      _pyReqs[id] = { timer: timer, cb: function (m) {
        if (m.type === "runerror") { cb({ error: pyErrLine({ message: m.error }) }); return; }
        try {
          var out = JSON.parse(m.result);
          var results = out.map(function (o, i) { var t = prob.tests[i]; if (!o.ok) return { pass: false, error: o.error, args: t.args, expected: t.expected }; return { pass: JSON.stringify(o.got) === JSON.stringify(t.expected), got: o.got, args: t.args, expected: t.expected }; });
          cb({ results: results });
        } catch (e) { cb({ error: "Could not read Python output." }); }
      } };
      _pyWorker.postMessage({ type: "run", id: id, program: program, testsJson: JSON.stringify(prob.tests) });
    }, function (err) { cb({ error: err || "Python runtime failed to load." }); });
  }

  /* ---------- SQL runner (SQLite via WASM, lazy-loaded) ---------- */
  function sqlProblem(id) { return byId(SQL_PROBLEMS, id); }
  var _sqlPromise = null;
  function loadSql() {
    if (_sqlPromise) return _sqlPromise;
    _sqlPromise = new Promise(function (resolve, reject) {
      var base = "https://cdn.jsdelivr.net/npm/sql.js@1/dist/";
      var s = document.createElement("script");
      s.src = base + "sql-wasm.js";
      s.onload = function () {
        if (typeof window.initSqlJs !== "function") { reject(new Error("SQL engine did not initialize.")); return; }
        window.initSqlJs({ locateFile: function (f) { return base + f; } }).then(resolve, function (e) { reject(e); });
      };
      s.onerror = function () { reject(new Error("Could not load the SQL engine. Check your connection and retry.")); };
      document.head.appendChild(s);
    });
    return _sqlPromise;
  }
  function eqResult(got, exp) {
    return JSON.stringify(got.columns) === JSON.stringify(exp.columns) && JSON.stringify(got.values) === JSON.stringify(exp.rows);
  }
  function runSql(sqlProb, query, cb) {
    loadSql().then(function (SQL) {
      var db, res;
      try { db = new SQL.Database(); db.run(SQL_SETUP); } catch (e) { cb({ error: "Setup error: " + (e.message || e) }); return; }
      try { res = db.exec(query); } catch (e) { try { db.close(); } catch (_) {} cb({ error: String(e.message || e) }); return; }
      try { db.close(); } catch (_) {}
      if (!res || !res.length) { cb({ columns: [], rows: [], pass: false, empty: true }); return; }
      var last = res[res.length - 1];
      cb({ columns: last.columns, rows: last.values, pass: eqResult(last, sqlProb.expected) });
    }, function (err) { cb({ error: err.message || "SQL engine failed to load." }); });
  }
  function cellStr(v) { return v === null || v === undefined ? "NULL" : String(v); }
  function mountSqlCoder(container, sqlProb, opts) {
    opts = opts || {};
    var stKey = "sql:" + sqlProb.id;
    var saved = state.code[stKey] || sqlProb.starter;
    container.className = "coder";
    container.innerHTML =
      '<div class="coder-head"><span class="coder-title">' + esc(sqlProb.title) + ' <span class="chip-diff">' + esc(sqlProb.difficulty) + '</span></span><span class="coder-lang sql">SQL</span></div>' +
      '<p class="coder-prompt">' + esc(sqlProb.prompt) + '</p>' +
      '<textarea class="coder-editor" spellcheck="false">' + esc(saved) + '</textarea>' +
      '<div class="coder-actions"><button class="btn btn-primary c-run">Run query</button><button class="btn btn-ghost c-reset">Reset</button>' +
      (opts.showSolution ? '<button class="btn btn-ghost c-sol">Show solution</button>' : '') +
      '<span class="coder-status" aria-live="polite"></span></div><div class="coder-results"></div>';
    var ta = container.querySelector(".coder-editor"), results = container.querySelector(".coder-results"), status = container.querySelector(".coder-status");
    if (state.solved[stKey]) { status.textContent = "Solved ✓"; status.className = "coder-status ok"; }
    ta.addEventListener("keydown", function (e) { if (e.key === "Tab") { e.preventDefault(); var s = ta.selectionStart, en = ta.selectionEnd; ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en); ta.selectionStart = ta.selectionEnd = s + 2; } });
    ta.addEventListener("input", function () { state.code[stKey] = ta.value; save(); });
    container.querySelector(".c-run").addEventListener("click", function () {
      status.textContent = "Running..."; status.className = "coder-status"; results.innerHTML = "";
      runSql(sqlProb, ta.value, function (data) { renderSqlResults(results, status, data, sqlProb); if (data.pass && opts.onPass) opts.onPass(); });
    });
    container.querySelector(".c-reset").addEventListener("click", function () { ta.value = sqlProb.starter; state.code[stKey] = sqlProb.starter; save(); results.innerHTML = ""; status.textContent = ""; });
    if (opts.showSolution) container.querySelector(".c-sol").addEventListener("click", function () { ta.value = sqlProb.solution; state.code[stKey] = sqlProb.solution; save(); });
  }
  function renderSqlResults(results, status, data, sqlProb) {
    if (data.error) { status.textContent = "Error"; status.className = "coder-status err"; results.innerHTML = '<div class="res-err">' + esc(data.error) + '</div>'; return; }
    var cols = data.columns || [], rows = data.rows || [];
    var table = '<div class="sql-table-wrap"><table class="sql-table"><thead><tr>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join("") + '</tr></thead><tbody>' +
      (rows.length ? rows.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + esc(cellStr(v)) + '</td>'; }).join("") + '</tr>'; }).join("") : '<tr><td class="sql-empty" colspan="' + Math.max(1, cols.length) + '">no rows</td></tr>') +
      '</tbody></table></div>';
    if (data.pass) { status.textContent = "Correct"; status.className = "coder-status ok"; results.innerHTML = '<div class="res-ok">Correct result ✓</div>' + table; }
    else { status.textContent = "Not matching"; status.className = "coder-status err"; results.innerHTML = '<div class="res-row f"><span class="res-i">✗</span><span class="res-detail">Result does not match. Expected columns <code>' + esc(sqlProb.expected.columns.join(", ")) + '</code> and ' + sqlProb.expected.rows.length + ' row(s), in order.</span></div>' + table; }
  }

  /* ---------- progress / readiness ---------- */
  function buildDone(id) { var s = state.builds[id]; return !!(s && RUBRIC.every(function (r) { return s[r.key]; })); }
  function recallCards(m) {
    if (m.recall === "DECK") return PATTERNS.map(function (p) { return { key: "pat:" + p.id, front: p.tell, back: p.name + " - " + p.why }; });
    return (m.recall || []).map(function (c, i) { return { key: m.id + ":" + i, front: c.front, back: c.back }; });
  }
  function practiceDone(m) {
    var p = m.practice;
    if (p.type === "code") return p.refs.every(function (id) { return state.solved[id]; });
    if (p.type === "sql") return p.refs.every(function (id) { return state.solved["sql:" + id]; });
    if (p.type === "decomp") return p.refs.every(function (i) { return state.decompDone.indexOf(i) !== -1; });
    if (p.type === "build") return p.refs.every(function (id) { return buildDone(id); });
    if (p.type === "framework") return p.refs.every(function (id) { return state.rag[id]; });
    if (p.type === "deck") return PATTERNS.filter(function (x) { return cardState("pat:" + x.id).box >= 3; }).length >= 5;
    return false;
  }
  function quizPassed(m) { return !!(state.quiz[m.id] && state.quiz[m.id].passed); }
  function reinforceDone(m) {
    var cards = recallCards(m);
    if (!cards.length) return true;
    if (m.recall === "DECK") return cards.filter(function (c) { return cardState(c.key).box >= 3; }).length >= 5;
    return cards.every(function (c) { return cardState(c.key).box >= 1; });
  }
  function moduleSteps(m) {
    return { learn: state.learned[m.id] ? 1 : 0, practice: practiceDone(m) ? 1 : 0, quiz: quizPassed(m) ? 1 : 0, reinforce: reinforceDone(m) ? 1 : 0 };
  }
  function modulePct(m) { var s = moduleSteps(m); return (s.learn + s.practice + s.quiz + s.reinforce) / 4; }
  function trackModules(tid) { return MODULES.filter(function (m) { return m.track === tid; }); }
  function trackPct(tid) { var ms = trackModules(tid); if (!ms.length) return 0; return ms.reduce(function (a, m) { return a + modulePct(m); }, 0) / ms.length; }
  function overallPct() { return MODULES.reduce(function (a, m) { return a + modulePct(m); }, 0) / MODULES.length; }
  function dueCount() { var n = 0; MODULES.forEach(function (m) { recallCards(m).forEach(function (c) { if (cardState(c.key).due <= Date.now() && cardState(c.key).box > 0) n++; }); }); return n; }

  /* ---------- router ---------- */
  var view = { name: "home", track: null, module: null, step: "learn" };
  function go(v) { Object.keys(v).forEach(function (k) { view[k] = v[k]; }); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function render() {
    var app = $("#app");
    if (view.name === "home") app.innerHTML = homeHTML();
    else if (view.name === "track") app.innerHTML = trackHTML(view.track);
    else if (view.name === "module") app.innerHTML = moduleShellHTML(byId(MODULES, view.module));
    wire();
    if (view.name === "module") renderStep();
    updateRing();
  }

  /* ---------- home ---------- */
  function homeHTML() {
    var due = dueCount();
    var cards = TRACKS.map(function (t) {
      var ms = trackModules(t.id), pct = Math.round(trackPct(t.id) * 100);
      var ready = ms.filter(function (m) { return modulePct(m) >= 0.99; }).length;
      return '<button class="track-card" data-track="' + t.id + '">' +
        '<div class="tc-top"><span class="tc-short">' + esc(t.short) + '</span><span class="tc-pct">' + pct + '%</span></div>' +
        '<h3>' + esc(t.name) + '</h3><p>' + esc(t.blurb) + '</p>' +
        '<div class="tc-bar"><span style="width:' + pct + '%"></span></div>' +
        '<div class="tc-foot">' + ready + ' / ' + ms.length + ' modules interview-ready</div>' +
        '</button>';
    }).join("");
    return '<div class="wrap">' +
      '<section class="hero"><p class="eyebrow">Interview prep for the practical engineer</p>' +
      '<h1>Pick a track. Learn it, practice it, prove it.</h1>' +
      '<p class="lede">Every module runs the same loop: <b>Learn</b> the concept, <b>Practice</b> it hands-on, <b>Quiz</b> yourself to prove it sticks, then <b>Reinforce</b> with spaced repetition. Work a track to the end and the readiness meter tells you, honestly, when you are ready to interview.</p>' +
      (due > 0 ? '<div class="due-banner" data-review="1">' + due + ' review card' + (due === 1 ? '' : 's') + ' due across your modules. <span>Keep them warm &rarr;</span></div>' : '') +
      '</section>' +
      '<div class="loop-legend">' + ["Learn", "Practice", "Quiz", "Reinforce"].map(function (s, i) { return '<span class="ll"><b>' + (i + 1) + '</b>' + s + '</span>'; }).join('<span class="ll-arrow">&rarr;</span>') + '</div>' +
      (overallPct() === 0 ? '<div class="start-banner" data-start="1">New here? Start with <b>Two Pointers</b> in the DSA track. It runs the full Learn, Practice, Quiz, Reinforce loop end to end, so you feel how the whole thing works. <span>Start there &rarr;</span></div>' : '') +
      '<h2 class="section-title">Tracks</h2><div class="track-grid">' + cards + '</div>' +
      '<p class="fineprint">Progress is saved on this device. Built from adversarially-verified interview research; loop details vary by company and change over time.</p>' +
      '</div>';
  }

  /* ---------- track ---------- */
  function trackHTML(tid) {
    var t = byId(TRACKS, tid), ms = trackModules(tid);
    var cards = ms.map(function (m) {
      var pct = Math.round(modulePct(m) * 100), s = moduleSteps(m);
      var chips = [["Learn", s.learn], ["Practice", s.practice], ["Quiz", s.quiz], ["Reinforce", s.reinforce]].map(function (x) {
        return '<span class="mchip' + (x[1] ? " on" : "") + '">' + x[0] + '</span>';
      }).join("");
      return '<button class="module-card" data-module="' + m.id + '">' +
        '<div class="mc-head"><div><span class="mc-kicker">' + esc(m.kicker) + ' &middot; ' + esc(m.est) + '</span><h3>' + esc(m.title) + '</h3></div><span class="mc-pct">' + pct + '%</span></div>' +
        '<div class="mchips">' + chips + '</div>' +
        '<div class="mc-bar"><span style="width:' + pct + '%"></span></div>' +
        '</button>';
    }).join("");
    return '<div class="wrap">' +
      breadcrumb([["Tracks", "home"]], t.name) +
      '<div class="track-header"><span class="th-short">' + esc(t.short) + '</span><div><h1>' + esc(t.name) + '</h1><p>' + esc(t.blurb) + '</p></div></div>' +
      '<div class="module-grid">' + cards + '</div></div>';
  }

  /* ---------- module shell ---------- */
  var STEPS = [["learn", "Learn"], ["practice", "Practice"], ["quiz", "Quiz"], ["reinforce", "Reinforce"]];
  function byIdStep(k) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i][0] === k) return STEPS[i][1]; return k; }
  function moduleShellHTML(m) {
    var t = byId(TRACKS, m.track), s = moduleSteps(m);
    var tabs = STEPS.map(function (st) {
      var on = s[st[0]];
      return '<button class="step-tab' + (view.step === st[0] ? " active" : "") + '" data-step="' + st[0] + '">' +
        '<span class="st-dot' + (on ? " on" : "") + '"></span>' + st[1] + '</button>';
    }).join("");
    return '<div class="wrap">' +
      breadcrumb([["Tracks", "home"], [t.name, "track:" + t.id]], m.title) +
      '<div class="module-header"><div><span class="mh-kicker">' + esc(t.name) + ' &middot; ' + esc(m.kicker) + '</span><h1>' + esc(m.title) + '</h1></div>' +
      '<div class="mh-ring" id="mhPct">' + Math.round(modulePct(m) * 100) + '%</div></div>' +
      '<div class="step-tabs">' + tabs + '</div>' +
      '<div class="step-body" id="stepBody"></div></div>';
  }

  function renderStep() {
    var m = byId(MODULES, view.module), body = $("#stepBody");
    if (view.step === "learn") renderLearn(m, body);
    else if (view.step === "practice") renderPractice(m, body);
    else if (view.step === "quiz") renderQuiz(m, body);
    else if (view.step === "reinforce") renderReinforce(m, body);
    updateModuleChrome(m);
  }
  function updateModuleChrome(m) {
    var mh = $("#mhPct"); if (mh) mh.textContent = Math.round(modulePct(m) * 100) + "%";
    $$(".step-tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-step") === view.step);
      var done = moduleSteps(m)[t.getAttribute("data-step")];
      var dot = t.querySelector(".st-dot"); if (dot) dot.classList.toggle("on", !!done);
    });
  }
  function chrome() { var m = byId(MODULES, view.module); if (m) updateModuleChrome(m); }

  function stepNav(m, cur) {
    var order = ["learn", "practice", "quiz", "reinforce"], i = order.indexOf(cur), next = order[i + 1];
    var label = next ? "Next: " + byIdStep(next) : "Back to " + byId(TRACKS, m.track).name;
    return '<div class="step-nav"><button class="btn btn-primary" id="stepNext">' + (next ? esc(label) + " &rarr;" : "Finish module") + '</button></div>';
  }
  function wireStepNav(m, cur) {
    var btn = $("#stepNext"); if (!btn) return;
    btn.addEventListener("click", function () {
      var order = ["learn", "practice", "quiz", "reinforce"], i = order.indexOf(cur), next = order[i + 1];
      if (next) go({ step: next }); else go({ name: "track", track: m.track });
    });
  }

  /* ---------- LEARN ---------- */
  function renderLearn(m, body) {
    var L = m.learn;
    var points = (L.points || []).map(function (p) { return '<div class="learn-point"><h4>' + esc(p.h) + '</h4><p>' + esc(p.p) + '</p></div>'; }).join("");
    var tmpl = L.template ? '<div class="learn-code"><div class="lc-bar">' + esc(L.template.lang) + ' &middot; template</div><pre><code>' + esc(L.template.code) + '</code></pre></div>' : "";
    var ex = L.example ? '<div class="learn-example"><h4>' + esc(L.example.h) + '</h4><p>' + esc(L.example.p) + '</p></div>' : "";
    var read = state.learned[m.id];
    body.innerHTML = '<div class="learn"><p class="learn-intro">' + esc(L.intro) + '</p>' +
      '<div class="learn-points">' + points + '</div>' + tmpl + ex +
      '<div class="learn-actions"><button class="btn ' + (read ? "btn-ghost" : "btn-primary") + '" id="markLearned">' + (read ? "Marked as read ✓" : "Mark as read") + '</button>' +
      '<button class="btn btn-ghost" id="toPractice">Go to Practice &rarr;</button></div></div>';
    $("#markLearned").addEventListener("click", function () { state.learned[m.id] = true; save(); renderStep(); });
    $("#toPractice").addEventListener("click", function () { go({ step: "practice" }); });
  }

  /* ---------- PRACTICE ---------- */
  function renderPractice(m, body) {
    var p = m.practice;
    body.innerHTML = '<p class="step-note">' + esc(p.note || "") + '</p><div id="practiceArea"></div>' + stepNav(m, "practice");
    var area = $("#practiceArea");
    if (p.type === "code") {
      p.refs.forEach(function (id) {
        var wrap = document.createElement("div"); area.appendChild(wrap);
        mountCoder(wrap, problem(id), { showSolution: true, onPass: function () { state.solved[id] = true; save(); chrome(); } });
      });
    } else if (p.type === "sql") {
      p.refs.forEach(function (id) {
        var wrap = document.createElement("div"); area.appendChild(wrap);
        mountSqlCoder(wrap, sqlProblem(id), { showSolution: true, onPass: function () { state.solved["sql:" + id] = true; save(); chrome(); } });
      });
    } else if (p.type === "decomp") {
      p.refs.forEach(function (i) { area.appendChild(decompCard(i)); });
    } else if (p.type === "build") {
      p.refs.forEach(function (id) { area.appendChild(buildCard(byId(BUILDS, id))); });
    } else if (p.type === "framework") {
      area.appendChild(frameworkGrid(p.refs));
    } else if (p.type === "deck") {
      var note = document.createElement("p"); note.className = "step-note"; note.innerHTML = "The recognition deck lives under <b>Reinforce</b> - that is the practice for this module."; area.appendChild(note);
    }
    wireStepNav(m, "practice");
  }

  function mountCoder(container, prob, opts) {
    opts = opts || {};
    var lang = state.lang === "py" ? "py" : "js";
    var starter = lang === "py" ? prob.starterPy : prob.starter;
    var solution = lang === "py" ? prob.solutionPy : prob.solution;
    var codeKey = lang + ":" + prob.id;
    var saved = state.code[codeKey] || starter;
    container.className = "coder";
    container.innerHTML =
      '<div class="coder-head"><span class="coder-title">' + esc(prob.title) + ' <span class="chip-diff">' + esc(prob.difficulty) + '</span> <span class="chip-pat">' + esc(prob.pattern) + '</span></span>' +
      '<span class="lang-toggle"><button class="lang-opt' + (lang === "js" ? " on" : "") + '" data-lang="js">JavaScript</button><button class="lang-opt' + (lang === "py" ? " on" : "") + '" data-lang="py">Python</button></span></div>' +
      '<p class="coder-prompt">' + esc(prob.prompt) + '</p>' +
      '<textarea class="coder-editor" spellcheck="false">' + esc(saved) + '</textarea>' +
      '<div class="coder-actions"><button class="btn btn-primary c-run">Run tests</button><button class="btn btn-ghost c-reset">Reset</button>' +
      (opts.showSolution ? '<button class="btn btn-ghost c-sol">Show solution</button>' : '') +
      '<span class="coder-status" aria-live="polite"></span></div><div class="coder-results"></div>';
    var ta = container.querySelector(".coder-editor"), results = container.querySelector(".coder-results"), status = container.querySelector(".coder-status");
    if (state.solved[prob.id]) { status.textContent = "Solved ✓"; status.className = "coder-status ok"; }
    $$(".lang-opt", container).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var nl = btn.getAttribute("data-lang");
        if (nl === lang) return;
        state.code[codeKey] = ta.value; state.lang = nl; save();
        mountCoder(container, prob, opts);
      });
    });
    ta.addEventListener("keydown", function (e) { if (e.key === "Tab") { e.preventDefault(); var s = ta.selectionStart, en = ta.selectionEnd; ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en); ta.selectionStart = ta.selectionEnd = s + 2; } });
    ta.addEventListener("input", function () { state.code[codeKey] = ta.value; save(); });
    container.querySelector(".c-run").addEventListener("click", function () {
      results.innerHTML = "";
      status.textContent = (lang === "py" && !_pyReady) ? "Loading Python (first run, a few seconds)..." : "Running...";
      status.className = "coder-status";
      var runner = lang === "py" ? runPythonProblem : runProblem;
      runner(prob, ta.value, function (data) {
        var allPass = data.results && data.results.length && data.results.every(function (r) { return r.pass; });
        renderResults(results, status, data);
        if (allPass && opts.onPass) opts.onPass();
      });
    });
    container.querySelector(".c-reset").addEventListener("click", function () { ta.value = starter; state.code[codeKey] = starter; save(); results.innerHTML = ""; status.textContent = ""; });
    if (opts.showSolution) container.querySelector(".c-sol").addEventListener("click", function () { ta.value = solution; state.code[codeKey] = solution; save(); });
  }
  function renderResults(results, status, data) {
    if (data.error) { status.textContent = "Error"; status.className = "coder-status err"; results.innerHTML = '<div class="res-err">' + esc(data.error) + '</div>'; return; }
    var rs = data.results, passed = rs.filter(function (r) { return r.pass; }).length;
    status.textContent = passed + " / " + rs.length + " passed";
    status.className = "coder-status " + (passed === rs.length ? "ok" : "err");
    results.innerHTML = (passed === rs.length ? '<div class="res-ok">All tests passed ✓</div>' : '') + rs.map(function (r) {
      return '<div class="res-row ' + (r.pass ? "p" : "f") + '"><span class="res-i">' + (r.pass ? "✓" : "✗") + '</span>' +
        '<code class="res-in">' + esc(jshort(r.args)) + '</code>' +
        (r.error ? '<span class="res-detail">threw: ' + esc(r.error) + '</span>' :
          '<span class="res-detail">got <code>' + esc(jshort(r.got)) + '</code>' + (r.pass ? '' : ' &middot; expected <code>' + esc(jshort(r.expected)) + '</code>') + '</span>') +
        '</div>';
    }).join("");
  }
  function jshort(v) { try { var s = JSON.stringify(v); return s === undefined ? "undefined" : s; } catch (e) { return String(v); } }

  /* decomposition card (practice) */
  function decompCard(i) {
    var p = DECOMP[i], el = document.createElement("div"); el.className = "decomp-card";
    var done = state.decompDone.indexOf(i) !== -1;
    el.innerHTML =
      '<div class="decomp-top"><span class="decomp-badge">' + esc(p.badge) + '</span><p class="decomp-prompt">' + esc(p.prompt) + '</p></div>' +
      '<div class="decomp-body"><p class="decomp-instruct">Write every clarifying question you would ask before proposing anything. Then reveal the dimensions and check what you missed.</p>' +
      '<textarea class="decomp-input" placeholder="Your clarifying questions..."></textarea>' +
      '<div class="decomp-actions"><button class="btn btn-primary d-reveal">Reveal the dimensions</button><button class="btn btn-ghost d-mark">' + (done ? "Reviewed ✓" : "Mark reviewed") + '</button></div>' +
      '<div class="reveal-panel"><p class="reveal-title">Dimensions a strong candidate surfaces</p><div class="dim-list">' +
      p.dims.map(function (d) { return '<div class="dim"><h4>' + esc(d.h) + '</h4><ul>' + d.q.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + '</ul></div>'; }).join("") +
      '</div></div></div>';
    el.querySelector(".d-reveal").addEventListener("click", function () { el.querySelector(".reveal-panel").classList.add("show"); });
    el.querySelector(".d-mark").addEventListener("click", function () { if (state.decompDone.indexOf(i) === -1) { state.decompDone.push(i); save(); this.textContent = "Reviewed ✓"; chrome(); } });
    return el;
  }
  /* build card (practice) */
  function buildCard(b) {
    var el = document.createElement("div"); el.className = "build-card"; var scores = state.builds[b.id] || {};
    function list(items) { return '<ul class="build-list">' + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>"; }
    el.innerHTML =
      '<div class="build-top"><span class="build-badge">' + esc(b.badge) + '</span><h3 class="build-title">' + esc(b.title) + '</h3><p class="build-brief">' + esc(b.brief) + '</p></div>' +
      '<div class="build-body">' +
      '<div class="build-step"><div class="step-h"><span class="step-n">1</span><h4>Clarify &amp; scope</h4></div>' + list(b.clarify) + '</div>' +
      '<div class="build-step"><div class="step-h"><span class="step-n">2</span><h4>Build it in your editor</h4></div>' + list(b.build) + '</div>' +
      '<div class="build-step"><div class="step-h"><span class="step-n">3</span><h4>Curveball</h4></div><button class="btn btn-ghost b-cb">Reveal the curveball</button><div class="reveal-box"><div class="curveball">' + esc(b.curveball) + '</div></div></div>' +
      '<div class="build-step"><div class="step-h"><span class="step-n">4</span><h4>Explain it</h4></div>' + list(b.explain) + '</div>' +
      '<div class="build-step"><div class="step-h"><span class="step-n">5</span><h4>Self-score</h4></div><div class="rubric">' +
      RUBRIC.map(function (r) { return rubricRow(b.id, r, scores[r.key]); }).join("") + '</div><div class="readiness" data-rd="' + b.id + '"></div></div>' +
      '<div class="build-step"><div class="step-h"><span class="step-n">6</span><h4>What good looks like</h4></div><button class="btn btn-ghost b-ref">Reveal the reference</button><div class="reveal-box"><div class="reference"><h5>Signals of a strong build</h5><ul>' + b.reference.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul></div></div></div>' +
      '</div>';
    el.querySelector(".b-cb").addEventListener("click", function () { this.nextElementSibling.classList.add("show"); this.style.display = "none"; });
    el.querySelector(".b-ref").addEventListener("click", function () { this.nextElementSibling.classList.add("show"); this.style.display = "none"; });
    $$(".rate", el).forEach(function (btn) { btn.addEventListener("click", function () { rateBuild(b.id, btn.getAttribute("data-dim"), parseInt(btn.getAttribute("data-val"), 10)); }); });
    updateReadiness(el, b.id);
    return el;
  }
  function rubricRow(bid, r, chosen) {
    var labels = { 1: "Poor", 2: "OK", 3: "Strong" };
    var btns = [1, 2, 3].map(function (v) { return '<button class="rate' + (chosen === v ? " sel" : "") + '" data-dim="' + r.key + '" data-val="' + v + '">' + labels[v] + "</button>"; }).join("");
    return '<div class="rubric-row"><div class="rubric-label"><div class="rl-name">' + esc(r.name) + '</div><div class="rl-desc">' + esc(r.desc) + '</div></div><div class="rate-group">' + btns + '</div></div>';
  }
  function rateBuild(bid, dim, val) {
    var s = state.builds[bid] || {}; s[dim] = val; state.builds[bid] = s; save();
    var box = $('[data-rd="' + bid + '"]'); if (box) { var card = box.closest(".build-card"); $$(".rate", card).forEach(function (btn) { if (btn.getAttribute("data-dim") === dim) btn.classList.toggle("sel", parseInt(btn.getAttribute("data-val"), 10) === val); }); updateReadiness(card, bid); }
    chrome();
  }
  function updateReadiness(cardEl, bid) {
    var box = $('[data-rd="' + bid + '"]', cardEl); if (!box) return; var s = state.builds[bid] || {};
    var vals = RUBRIC.map(function (r) { return s[r.key] || 0; }), rated = vals.filter(function (v) { return v > 0; }).length;
    if (rated < RUBRIC.length) { box.innerHTML = '<span class="r-text">Rate all four to see your readiness on this build.</span>'; return; }
    var total = vals.reduce(function (a, c) { return a + c; }, 0), pct = Math.round(total / 12 * 100);
    var msg = total >= 11 ? "Interview-ready on this one." : total >= 8 ? "Solid. Tighten the weakest dimension." : "Rebuild it; target the lows.";
    box.innerHTML = '<span class="r-ring">' + pct + '%</span><span class="r-text">' + msg + '</span>';
  }
  function frameworkGrid(refs) {
    var el = document.createElement("div"); el.className = "rag-grid";
    el.innerHTML = refs.map(function (id) {
      var s = byId(RAG_STAGES, id); var checked = state.rag[id] ? " checked" : "";
      return '<div class="rag-stage"><span class="rs-step">' + esc(s.step) + '</span><h4>' + esc(s.h) + '</h4><p>' + esc(s.p) + '</p><label class="rag-check"><input type="checkbox" data-rag="' + id + '"' + checked + '> Internalized</label></div>';
    }).join("");
    $$('input[data-rag]', el).forEach(function (cb) { cb.addEventListener("change", function () { state.rag[cb.getAttribute("data-rag")] = cb.checked; save(); chrome(); }); });
    return el;
  }

  /* ---------- QUIZ ---------- */
  function renderQuiz(m, body) {
    if (!state.quiz[m.id]) state.quiz[m.id] = { items: {}, passed: false };
    body.innerHTML = '<p class="step-note">Prove it cold. Answer each question and pass the coding check. Get them all and the quiz is passed, updating your readiness. Retry as many times as you like.</p>' +
      '<div class="quiz" id="quizArea"></div><div class="quiz-summary" id="quizSummary"></div>' + stepNav(m, "quiz");
    var area = $("#quizArea");
    m.quiz.forEach(function (item, idx) {
      var wrap = document.createElement("div"); wrap.className = "quiz-item"; area.appendChild(wrap);
      if (item.code) {
        var head = document.createElement("p"); head.className = "quiz-q"; head.innerHTML = '<span class="qi-num">Q' + (idx + 1) + '</span> Coding check - make all tests pass:'; wrap.appendChild(head);
        var cw = document.createElement("div"); wrap.appendChild(cw);
        mountCoder(cw, problem(item.code), { showSolution: false, onPass: function () { markQuiz(m, idx); } });
      } else if (item.sql) {
        var sh = document.createElement("p"); sh.className = "quiz-q"; sh.innerHTML = '<span class="qi-num">Q' + (idx + 1) + '</span> SQL check - return the exact result:'; wrap.appendChild(sh);
        var sw = document.createElement("div"); wrap.appendChild(sw);
        mountSqlCoder(sw, sqlProblem(item.sql), { showSolution: false, onPass: function () { markQuiz(m, idx); } });
      } else {
        wrap.appendChild(mcItem(m, item, idx));
      }
    });
    updateQuizSummary(m);
    wireStepNav(m, "quiz");
  }
  function mcItem(m, item, idx) {
    var wrap = document.createElement("div"); var answered = state.quiz[m.id].items[idx];
    wrap.innerHTML = '<p class="quiz-q"><span class="qi-num">Q' + (idx + 1) + '</span> ' + esc(item.q) + '</p><div class="choices"></div><div class="explain"></div>';
    var choices = wrap.querySelector(".choices"), explain = wrap.querySelector(".explain");
    item.choices.forEach(function (c, ci) {
      var b = document.createElement("button"); b.className = "choice"; b.textContent = c;
      if (answered) { if (ci === item.answer) b.classList.add("correct"); b.disabled = true; }
      b.addEventListener("click", function () {
        if (state.quiz[m.id].items[idx]) return;
        if (ci === item.answer) { b.classList.add("correct"); markQuiz(m, idx); $$(".choice", choices).forEach(function (x) { x.disabled = true; }); explain.className = "explain show ok"; explain.innerHTML = "✓ " + esc(item.explain); }
        else { b.classList.add("wrong"); explain.className = "explain show"; explain.innerHTML = esc(item.explain) + ' <button class="retry">Try again</button>'; explain.querySelector(".retry").addEventListener("click", function () { b.classList.remove("wrong"); explain.className = "explain"; explain.innerHTML = ""; }); }
      });
      choices.appendChild(b);
    });
    if (answered) { explain.className = "explain show ok"; explain.innerHTML = "✓ " + esc(item.explain); }
    return wrap;
  }
  function markQuiz(m, idx) {
    state.quiz[m.id].items[idx] = true;
    var all = m.quiz.every(function (_, i) { return state.quiz[m.id].items[i]; });
    if (all) state.quiz[m.id].passed = true;
    save(); updateQuizSummary(m); chrome();
  }
  function updateQuizSummary(m) {
    var el = $("#quizSummary"); if (!el) return;
    var done = m.quiz.filter(function (_, i) { return state.quiz[m.id].items[i]; }).length, total = m.quiz.length;
    if (state.quiz[m.id].passed) el.innerHTML = '<div class="quiz-pass">Quiz passed, ' + total + ' / ' + total + '. This module counts toward your track readiness. ✓</div>';
    else el.innerHTML = '<div class="quiz-track">' + done + ' / ' + total + ' locked in. Get them all to pass.</div>';
  }

  /* ---------- REINFORCE (spaced repetition) ---------- */
  var deckQueue = [], deckCurrent = null, deckFlipped = false, deckCards = [];
  function renderReinforce(m, body) {
    deckCards = recallCards(m);
    if (!deckCards.length) { body.innerHTML = '<p class="step-note">No spaced-repetition cards for this module.</p>' + stepNav(m, "reinforce"); wireStepNav(m, "reinforce"); return; }
    body.innerHTML = '<p class="step-note">Grade your recall so the weak cards resurface sooner. This is what makes it stick.</p><div class="deck-stage" id="deckStage"></div>' + stepNav(m, "reinforce");
    deckQueue = deckCards.filter(function (c) { return cardState(c.key).due <= Date.now(); }).map(function (c) { return c.key; });
    if (!deckQueue.length) deckQueue = deckCards.map(function (c) { return c.key; });
    deckFlipped = false; drawCard(m);
    wireStepNav(m, "reinforce");
  }
  function byKey(k) { for (var i = 0; i < deckCards.length; i++) if (deckCards[i].key === k) return deckCards[i]; return null; }
  function drawCard(m) {
    var stage = $("#deckStage"); if (!stage) return;
    if (!deckQueue.length) {
      var mat = deckCards.filter(function (c) { return cardState(c.key).box >= (m.recall === "DECK" ? 3 : 1); }).length;
      stage.innerHTML = '<div class="deck-empty"><h3>Session complete.</h3><p>' + mat + ' / ' + deckCards.length + ' cards are maturing. Come back later and the due ones resurface.</p><button class="btn btn-ghost" id="againDeck">Run the whole set again</button></div>';
      $("#againDeck").addEventListener("click", function () { deckQueue = deckCards.map(function (c) { return c.key; }); deckFlipped = false; drawCard(m); });
      return;
    }
    deckCurrent = byKey(deckQueue[0]); deckFlipped = false;
    stage.innerHTML = '<div class="flashcard" id="flashcard"><p class="fc-side-label">Recall prompt</p><p class="fc-tell">' + esc(deckCurrent.front) + '</p><p class="fc-hint">Answer in your head, then check.</p><button class="btn btn-primary fc-reveal">Show the answer</button></div>' +
      '<div class="deck-legend"><span>' + deckQueue.length + ' left this session</span><span>' + deckCards.length + ' in this module</span></div>';
    $(".fc-reveal").addEventListener("click", function () { flipCard(m); });
    $("#flashcard").addEventListener("click", function () { flipCard(m); });
  }
  function flipCard(m) {
    if (deckFlipped || !deckCurrent) return; deckFlipped = true;
    var fc = $("#flashcard"); if (!fc) return; fc.style.cursor = "default";
    fc.innerHTML = '<p class="fc-side-label">Answer</p><p class="fc-answer">' + esc(deckCurrent.back) + '</p>' +
      '<p class="grade-prompt">How well did you recall it? Your grade sets when it comes back.</p><div class="grade-row">' +
      gbtn("again", "Again", "back this round") + gbtn("hard", "Hard", "in " + nextLabel(deckCurrent.key, "hard")) +
      gbtn("good", "Good", "in " + nextLabel(deckCurrent.key, "good")) + gbtn("easy", "Easy", "in " + nextLabel(deckCurrent.key, "easy")) + '</div>';
    $$(".grade", fc).forEach(function (b) { b.addEventListener("click", function () { doGrade(m, b.getAttribute("data-grade")); }); });
  }
  function gbtn(g, k, sub) { return '<button class="grade" data-grade="' + g + '"><span class="g-key">' + k + '</span><span class="g-sub">' + sub + '</span></button>'; }
  function doGrade(m, g) {
    if (!deckCurrent) return; gradeCard(deckCurrent.key, g);
    var id = deckQueue.shift(); if (g === "again") deckQueue.push(id);
    chrome(); drawCard(m);
  }

  /* ---------- shared wiring ---------- */
  function breadcrumb(trail, current) {
    return '<nav class="crumbs">' + trail.map(function (t) { return '<a data-nav="' + t[1] + '">' + esc(t[0]) + '</a><span>/</span>'; }).join("") + '<span class="cur">' + esc(current) + '</span></nav>';
  }
  function wire() {
    $$("[data-track]").forEach(function (el) { el.addEventListener("click", function () { go({ name: "track", track: el.getAttribute("data-track") }); }); });
    $$("[data-module]").forEach(function (el) { el.addEventListener("click", function () { go({ name: "module", module: el.getAttribute("data-module"), step: "learn" }); }); });
    $$(".step-tab").forEach(function (el) { el.addEventListener("click", function () { go({ step: el.getAttribute("data-step") }); }); });
    $$("[data-nav]").forEach(function (el) { el.addEventListener("click", function () { var v = el.getAttribute("data-nav"); if (v === "home") go({ name: "home" }); else if (v.indexOf("track:") === 0) go({ name: "track", track: v.slice(6) }); }); });
    var db = $("[data-review]"); if (db) db.addEventListener("click", function () { var m = firstDueModule(); if (m) go({ name: "module", module: m.id, step: "reinforce" }); });
    var sb = $("[data-start]"); if (sb) sb.addEventListener("click", function () { go({ name: "module", module: "two-pointers", step: "learn" }); });
  }
  function firstDueModule() { for (var i = 0; i < MODULES.length; i++) { var cs = recallCards(MODULES[i]); for (var j = 0; j < cs.length; j++) if (cardState(cs[j].key).due <= Date.now() && cardState(cs[j].key).box > 0) return MODULES[i]; } return MODULES[0]; }

  /* ---------- topbar ring ---------- */
  function updateRing() {
    var C = 2 * Math.PI * 16, fg = $("#ringFg"), pct = $("#ringPct");
    var o = overallPct();
    if (fg) { fg.style.strokeDasharray = C.toFixed(1); fg.style.strokeDashoffset = (C * (1 - o)).toFixed(1); }
    if (pct) pct.textContent = Math.round(o * 100) + "%";
  }

  /* ---------- init ---------- */
  $("#homeLink").addEventListener("click", function (e) { e.preventDefault(); go({ name: "home" }); });
  $("#progressRing").addEventListener("click", function () { go({ name: "home" }); });
  $("#resetAll").addEventListener("click", function () {
    if (!window.confirm("Reset all saved progress on this device? This cannot be undone.")) return;
    state = { code: {}, solved: {}, quiz: {}, learned: {}, cards: {}, rag: {}, builds: {}, decompDone: [], lang: "js" };
    save(); go({ name: "home" });
  });
  render();
})();
