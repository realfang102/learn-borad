/* Agents Made Simple — core: theme, mode, progress, quizzes, copy, reveal + the simulation player. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function md(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(“"])\*([^*\s][^*]*?)\*(?=[\s.,;:!?)”"]|$)/g, "$1<em>$2</em>")
      .replace(/(^|[\s(“"])_([^_\s][^_]*?)_(?=[\s.,;:!?)”"]|$)/g, "$1<em>$2</em>");
  }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function toast(msg) { var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); } t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2200); }
  function confetti() {
    if (reduceMotion) return;
    var colors = ["#6d28d9", "#db2777", "#f59e0b", "#0d9488", "#2563eb"];
    for (var i = 0; i < 60; i++) { var c = document.createElement("div"); c.className = "confetti"; c.style.left = Math.random() * 100 + "vw"; c.style.background = colors[i % colors.length]; c.style.animationDelay = Math.random() * 0.4 + "s"; c.style.animationDuration = 1.2 + Math.random() * 0.9 + "s"; document.body.appendChild(c); setTimeout(function (el) { el.remove(); }.bind(null, c), 2600); }
  }
  window.AMSG = { $: $, $$: $$, esc: esc, md: md, store: store, toast: toast, confetti: confetti, widgets: {}, reduceMotion: reduceMotion };

  // ---------- theme & explanation mode ----------
  function syncThemeBtn() { $$(".theme-btn").forEach(function (b) { b.setAttribute("aria-label", document.documentElement.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"); }); }
  $$(".theme-btn").forEach(function (b) { b.addEventListener("click", function () { var t = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = t; try { localStorage.setItem("ams-theme", t); } catch (e) {} syncThemeBtn(); document.dispatchEvent(new CustomEvent("ams-theme")); }); });
  syncThemeBtn();
  function syncMode() { var m = document.documentElement.dataset.mode === "detail" ? "detail" : "simple"; $$(".mode-opt").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === m ? "true" : "false"); }); }
  $$(".mode-opt").forEach(function (b) { b.addEventListener("click", function () { var m = b.dataset.mode; if ((document.documentElement.dataset.mode || "simple") === m) return; document.documentElement.dataset.mode = m; try { localStorage.setItem("ams-mode", m); } catch (e) {} syncMode(); toast(m === "detail" ? "Detailed explanations on" : "Simple explanations on"); }); });
  syncMode();

  // ---------- progress ----------
  function prog() { return store.get("ams-progress", {}); }
  function refreshProgress() {
    var p = prog();
    $$("[data-slug]").forEach(function (el) { if (el.classList.contains("ch-card") || el.classList.contains("ex-card")) el.classList.toggle("is-done", !!p[el.dataset.slug]); });
    (window.AMS && AMS.parts || []).forEach(function (pt) { var d = pt.ch.filter(function (s) { return p[s]; }).length; $$('[data-part="' + pt.id + '"]').forEach(function (e) { e.textContent = d ? d + "/" + pt.ch.length + " done" : ""; }); });
    $$(".done-btn").forEach(function (b) { var d = !!p[b.dataset.slug]; b.classList.toggle("done", d); b.textContent = d ? "✓ Done!" : "Mark as done"; });
    var all = (window.AMS && AMS.chapters) || [], next = all.filter(function (c) { return !p[c.s]; })[0];
    if (Object.keys(p).length && next) $$(".start-btn").forEach(function (b) { b.href = next.s + ".html"; b.textContent = "Continue: " + next.t + " →"; });
  }
  $$(".done-btn").forEach(function (b) { b.addEventListener("click", function () { var p = prog(); if (p[b.dataset.slug]) delete p[b.dataset.slug]; else { p[b.dataset.slug] = Date.now(); confetti(); toast("Chapter complete"); } store.set("ams-progress", p); refreshProgress(); }); });
  var main = $("main.example[data-slug]"); if (main) { var p0 = prog(); p0[main.dataset.slug] = p0[main.dataset.slug] || Date.now(); store.set("ams-progress", p0); }

  // ---------- copy buttons ----------
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".copy-btn"); if (!b) return;
    var card = b.closest(".prompt-card, .code-card"); var t = card && (card.querySelector(".prompt-text") || card.querySelector("pre"));
    if (!t) return; var text = t.innerText;
    var done = function () { b.textContent = "Copied!"; b.classList.add("copied"); setTimeout(function () { b.textContent = "Copy"; b.classList.remove("copied"); }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { done(); }); else done();
  });

  // ---------- quizzes ----------
  $$(".quiz").forEach(function (quiz) {
    var key = "ams-quiz-" + quiz.dataset.quiz, saved = store.get(key, {}), qs = $$(".quiz-q", quiz);
    function score() { var a = 0, c = 0; qs.forEach(function (q, i) { if (saved[i] !== undefined) { a++; if (saved[i] === +q.dataset.correct) c++; } }); $(".quiz-score", quiz).textContent = a === qs.length ? (c === a ? "🏆 " : "") + c + " / " + a + " correct" + (c === a ? " — perfect!" : "") : ""; if (a === qs.length && c === a && !quiz._cele) { quiz._cele = 1; } }
    function reveal(q, i, pick) { var right = +q.dataset.correct; $$(".quiz-opt", q).forEach(function (o, j) { o.disabled = true; o.classList.add(j === right ? "right" : j === pick ? "wrong" : "dim"); }); var ex = $(".quiz-expl", q); ex.hidden = false; var v = $(".verdict", ex); v.textContent = pick === right ? "✓ Yes!" : "✗ Not quite."; v.className = "verdict " + (pick === right ? "ok" : "no"); }
    qs.forEach(function (q, i) { $$(".quiz-opt", q).forEach(function (o, j) { o.addEventListener("click", function () { if (saved[i] !== undefined) return; saved[i] = j; store.set(key, saved); reveal(q, i, j); score(); if (j === +q.dataset.correct && qs.every(function (_, k) { return saved[k] === +qs[k].dataset.correct; })) confetti(); }); }); if (saved[i] !== undefined) reveal(q, i, saved[i]); });
    score();
  });

  // ---------- filters (examples + prompts) ----------
  $$(".filters").forEach(function (f) {
    var items = $$(".ex-grid .ex-card, .prompt-grid .prompt-card"), cat = "All", search = $(".prompt-search", f);
    function apply() { var q = search ? search.value.toLowerCase().trim() : ""; items.forEach(function (it) { it.hidden = !((cat === "All" || it.dataset.cat === cat) && (!q || (it.dataset.text || it.textContent.toLowerCase()).indexOf(q) >= 0)); }); }
    $$(".filter", f).forEach(function (b) { b.addEventListener("click", function () { $$(".filter", f).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); cat = b.dataset.cat; apply(); }); });
    if (search) search.addEventListener("input", apply);
  });

  // ---------- reveal + scroll bar ----------
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  var bar = $(".scroll-bar");
  if (bar) addEventListener("scroll", function () { var h = document.documentElement, m = h.scrollHeight - h.clientHeight; bar.style.width = (m > 0 ? 100 * h.scrollTop / m : 0) + "%"; }, { passive: true });

  /* ======================================================================
     SIMULATION PLAYER
     window.SIMS[id] = { title, intro, panes:[{id,type,title,span}], steps:[{phase, say, do:[{pane, op, ...}], tokens, t}] }
     ====================================================================== */
  var PHASES = [["user", "Goal"], ["think", "Think"], ["act", "Act"], ["observe", "Observe"], ["human", "You"], ["done", "Done"]];
  var CURSOR_SVG = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function Sim(el, spec) {
    this.el = el; this.spec = spec; this.i = 0; this.timer = null; this.playing = false; this.speed = 1; this.waiting = null;
    this.build(); this.reset();
  }
  Sim.prototype.build = function () {
    var s = this.spec, self = this;
    this.el.innerHTML = '<div class="sim-top"><div class="sim-title">' + esc(s.title || "Watch the agent work") + '</div><div class="sim-ctrl">' +
      '<button type="button" class="w-btn primary s-play">Play</button><button type="button" class="w-btn s-step">Step</button><button type="button" class="w-btn s-reset">Restart</button>' +
      '<select class="sim-speed" aria-label="Playback speed"><option value="0.6">Slow</option><option value="1" selected>Normal</option><option value="1.8">Fast</option></select></div></div>' +
      '<div class="sim-progress"><span></span></div>' +
      '<div class="sim-status"><div class="loop-ind">' + PHASES.map(function (p) { return '<span data-ph="' + p[0] + '" class="">' + p[1] + "</span>"; }).join("") + '</div>' +
      '<div class="sim-stats"><span>step <b class="st-step">0</b>/' + s.steps.length + '</span><span><b class="st-tools">0</b> tool calls</span><span><b class="st-tok">0</b> tokens</span><span><b class="st-time">0s</b></span></div></div>' +
      '<div class="sim-panes"></div><div class="sim-narr" aria-live="polite"><div class="narr-face" data-ph="info" aria-hidden="true"></div><div class="narr-text"></div><button type="button" class="w-btn primary s-next" aria-label="Next step">Next</button></div>';
    this.panesEl = $(".sim-panes", this.el);
    this.panes = {};
    (s.panes || []).forEach(function (p) {
      var d = document.createElement("div");
      d.className = "pane p-" + p.type + (p.type === "terminal" ? " term" : "") + (p.span ? " span2" : "");
      d.innerHTML = '<div class="pane-head"><span>' + esc(p.title || p.type) + '</span></div><div class="pane-body"></div>';
      self.panesEl.appendChild(d);
      self.panes[p.id] = { el: d, body: $(".pane-body", d), type: p.type, state: {} };
    });
    $(".s-play", this.el).addEventListener("click", function () { self.playing ? self.pause() : self.play(); });
    $(".s-step", this.el).addEventListener("click", function () { self.pause(); self.next(); });
    $(".s-next", this.el).addEventListener("click", function () { self.pause(); self.next(); });
    $(".s-reset", this.el).addEventListener("click", function () { self.pause(); self.reset(); });
    $(".sim-speed", this.el).addEventListener("change", function (e) { self.speed = +e.target.value; });
  };
  Sim.prototype.reset = function () {
    this.i = 0; this.tools = 0; this.tok = 0; this.secs = 0; this.ended = false; this.waiting = null;
    for (var k in this.panes) { this.panes[k].body.innerHTML = ""; this.panes[k].state = {}; this.panes[k].el.classList.remove("flash"); }
    $$(".loop-ind span", this.el).forEach(function (x) { x.className = ""; });
    this.narrate("info", this.spec.intro || "Press <strong>▶ Play</strong> to watch the agent work, or <strong>Step</strong> to go one move at a time.", true);
    this.stats(); $(".s-play", this.el).textContent = "Play"; $(".s-step", this.el).disabled = false; $(".s-next", this.el).disabled = false;
  };
  Sim.prototype.narrate = function (phase, html, raw) {
    $(".narr-face", this.el).dataset.ph = phase || "info";
    if (typeof html === "string") html = html.replace(/▶\s?/g, "");
    var kind = { user: "Goal", think: "Thinking", act: "Acting", observe: "Observing", human: "Your turn", done: "Finished" }[phase];
    $(".narr-text", this.el).innerHTML = (kind ? '<span class="narr-kind">' + kind + "</span>" : "") + (raw ? html : md(html));
  };
  Sim.prototype.stats = function () {
    $(".st-step", this.el).textContent = this.i; $(".st-tools", this.el).textContent = this.tools;
    $(".st-tok", this.el).textContent = this.tok.toLocaleString(); $(".st-time", this.el).textContent = this.secs < 90 ? Math.round(this.secs) + "s" : Math.round(this.secs / 60) + "m";
    $(".sim-progress span", this.el).style.width = (100 * this.i / this.spec.steps.length) + "%";
  };
  Sim.prototype.play = function () {
    if (this.ended) this.reset();
    this.playing = true; $(".s-play", this.el).textContent = "Pause"; this.loop();
  };
  Sim.prototype.pause = function () { this.playing = false; clearTimeout(this.timer); $(".s-play", this.el).textContent = this.ended ? "Replay" : "Play"; };
  Sim.prototype.loop = function () {
    var self = this; if (!this.playing || this.waiting) return;
    var dur = this.next(); if (this.ended || this.waiting) return;
    this.timer = setTimeout(function () { self.loop(); }, dur / this.speed);
  };
  Sim.prototype.next = function () {
    if (this.waiting || this.i >= this.spec.steps.length) return 0;
    var st = this.spec.steps[this.i++], self = this, txt = 0;
    this.stepDelay = 0;
    $$(".loop-ind span", this.el).forEach(function (x) { x.className = x.dataset.ph === st.phase ? "on " + (st.phase === "human" ? "human" : st.phase === "done" ? "done" : "") : ""; });
    this.narrate(st.phase, st.say || "");
    (st.do || []).forEach(function (op) { txt += self.apply(op) || 0; });
    this.tok += st.tokens || Math.round(120 + txt / 3.5);
    this.secs += st.t || (st.phase === "act" ? 3 : st.phase === "think" ? 4 : 1.5);
    this.stats();
    if (this.i >= this.spec.steps.length && !this.waiting) { this.ended = true; this.playing = false; $(".s-play", this.el).textContent = "Replay"; $(".s-step", this.el).disabled = true; $(".s-next", this.el).disabled = true; }
    var base = 1800 + Math.min(4200, ((st.say || "").length + txt) * 16) + (this.stepDelay || 0) * this.speed;
    return st.wait ? st.wait * 1000 : base;
  };
  Sim.prototype.flash = function (p) { p.el.classList.remove("flash"); void p.el.offsetWidth; p.el.classList.add("flash"); var e = p.el; clearTimeout(e._f); e._f = setTimeout(function () { e.classList.remove("flash"); }, 900); };
  Sim.prototype.add = function (p, html, cls) { var d = document.createElement("div"); d.className = cls || "p-line"; d.innerHTML = html; p.body.appendChild(d); p.body.scrollTop = p.body.scrollHeight; return d; };
  Sim.prototype.typeInto = function (node, text, p) {
    if (reduceMotion) { node.textContent = text; return; }
    var i = 0, step = Math.max(1, Math.round(text.length / 60)), speed = this.speed;
    node.classList.add("typing");
    var iv = setInterval(function () { i += step; node.textContent = text.slice(0, i); if (p) p.body.scrollTop = p.body.scrollHeight; if (i >= text.length) { clearInterval(iv); node.classList.remove("typing"); } }, 22 / speed);
  };
  Sim.prototype.apply = function (op) {
    var p = this.panes[op.pane], self = this; if (!p) { console.warn("sim: unknown pane", op.pane); return 0; }
    this.flash(p);
    var T = p.type, o = op.op, len = 0;
    var ACTION = { cmd: 1, open: 1, edit: 1, go: 1, click: 1, type: 1, addcol: 1, bars: 1, spawn: 1, list: 1, draft: 1, tag: 1 };
    if (T !== "tools" && (ACTION[o] || (o === "add" && T === "sources") || (o === "set" && T === "sheet"))) this.tools++;
    switch (o === "approval" ? "approval:ask" : T + ":" + o) {
      case "chat:msg": {
        var wrap = p.state.msgs || (p.state.msgs = this.add(p, "", "msgs"));
        var b = document.createElement("div"); b.className = "bubble " + (op.from === "user" ? "user" : "ai"); wrap.appendChild(b);
        if (op.from === "user") b.textContent = op.text; else this.typeInto(b, op.text, p);
        p.body.scrollTop = p.body.scrollHeight; len = op.text.length; break;
      }
      case "thoughts:think": this.add(p, esc(op.text), "thought"); len = op.text.length; break;
      case "tools:call": { this.tools++; var a = typeof op.args === "string" ? op.args : JSON.stringify(op.args || {}, null, 1).replace(/\n\s*/g, " "); this.add(p, "<b>→ " + esc(op.name) + "</b>(" + esc(a) + ")", "tool-card"); len = a.length; break; }
      case "tools:result": { var r = typeof op.text === "string" ? op.text : JSON.stringify(op.text); this.add(p, "<b>" + (op.error ? "⚠️ error" : "← result") + "</b> " + esc(r), "tool-card res"); len = r.length; break; }
      case "terminal:cmd": { var c = this.add(p, "", "cmd"); this.typeInto(c, op.text, p); len = op.text.length; break; }
      case "terminal:out": this.add(p, esc(op.text), op.style === "err" ? "err" : op.style === "ok" ? "ok" : "out"); len = op.text.length; break;
      case "editor:open": {
        p.state.lines = op.code.split("\n"); p.body.innerHTML = '<div class="file-tab">' + esc(op.file) + '</div><div class="code-lines"></div>';
        this.renderCode(p); len = op.code.length; break;
      }
      case "editor:highlight": p.state.hi = op.lines || []; this.renderCode(p); break;
      case "editor:edit": {
        // replace lines [from..to] (1-based, inclusive) with new code; show removed lines struck through first
        var from = op.from - 1, to = (op.to || op.from) - 1, newL = op.code.split("\n");
        p.state.del = []; for (var k = from; k <= to; k++) p.state.del.push(k);
        p.state.hi = []; this.renderCode(p);
        setTimeout(function () { p.state.lines.splice.apply(p.state.lines, [from, to - from + 1].concat(newL)); p.state.del = []; p.state.add = newL.map(function (_, j) { return from + j; }); self.renderCode(p); }, 700 / this.speed);
        len = op.code.length; break;
      }
      case "browser:go": {
        p.body.innerHTML = '<div class="browser-bar">🔒 <span>' + esc(op.url) + '</span></div><div class="browser-page">' + (op.title ? "<h4>" + esc(op.title) + "</h4>" : "") +
          (op.els || []).map(function (e, i) { return '<div class="b-el ' + (e.kind === "btn" ? "btnlike" : e.kind === "input" ? "inputlike" : e.kind === "danger" ? "danger" : "") + '" data-i="' + i + '"><span>' + esc(e.text) + "</span>" + (e.value ? "<span>" + esc(e.value) + "</span>" : "") + "</div>"; }).join("") +
          '<div class="cursor">' + CURSOR_SVG + "</div></div>";
        var cur = $(".cursor", p.body); cur.style.left = "70%"; cur.style.top = "10px"; len = 60; break;
      }
      case "browser:click": case "browser:type": {
        var el = $('.b-el[data-i="' + op.el + '"]', p.body), cu = $(".cursor", p.body); if (!el || !cu) break;
        var d0 = this.stepDelay || 0; this.stepDelay = d0 + 1300 / this.speed;
        setTimeout(function () {
          $$(".b-el", p.body).forEach(function (x) { x.classList.remove("target"); }); el.classList.add("target");
          cu.style.left = (el.offsetLeft + el.offsetWidth * 0.6) + "px"; cu.style.top = (el.offsetTop + el.offsetHeight * 0.45) + "px";
          setTimeout(function () {
            cu.classList.remove("click"); void cu.offsetWidth; cu.classList.add("click");
            if (o === "type") { var spans = el.querySelectorAll("span"); self.typeInto(spans[spans.length - 1], op.text); } // type into the value field if there is one
          }, 850 / self.speed);
        }, d0);
        len = (op.text || "").length + 20; break;
      }
      case "sheet:set": {
        p.state.cols = op.cols; p.state.rows = op.rows; p.state.hc = op.highlightCol; p.state.hr = op.highlightRow; this.renderSheet(p); len = 80; break;
      }
      case "sheet:highlight": p.state.hc = op.col; p.state.hr = op.row; this.renderSheet(p); break;
      case "sheet:addcol": p.state.cols = p.state.cols.concat([op.name]); p.state.rows = p.state.rows.map(function (r, i) { return r.concat([op.values[i]]); }); p.state.hc = p.state.cols.length - 1; this.renderSheet(p); break;
      case "chart:bars": {
        var max = Math.max.apply(null, op.data.map(function (d) { return d.value; }));
        p.body.innerHTML = (op.title ? '<div class="chart-title">' + esc(op.title) + "</div>" : "") + '<div class="bars">' + op.data.map(function (d) { return '<div class="bar' + (d.hi ? " hi" : "") + '"><b>' + esc(d.text || d.value + (op.unit || "")) + '</b><i data-h="' + (100 * d.value / max) + '"></i></div>'; }).join("") + '</div><div class="bar-labels">' + op.data.map(function (d) { return "<span>" + esc(d.label) + "</span>"; }).join("") + "</div>";
        setTimeout(function () { $$(".bar i", p.body).forEach(function (i) { i.style.height = i.dataset.h + "%"; }); }, 60);
        len = 60; break;
      }
      case "doc:heading": this.add(p, esc(op.text), "doc-h").outerHTML; p.body.lastChild.innerHTML = "<h4>" + esc(op.text) + "</h4>"; p.body.classList.add("doc"); len = op.text.length; break;
      case "doc:para": p.body.classList.add("doc"); this.add(p, "<p>" + md(op.text).replace(/\[(\d+)\]/g, '<span class="cite">[$1]</span>') + "</p>"); len = op.text.length; break;
      case "doc:bullets": p.body.classList.add("doc"); this.add(p, "<ul>" + op.items.map(function (x) { return "<li>" + md(x).replace(/\[(\d+)\]/g, '<span class="cite">[$1]</span>') + "</li>"; }).join("") + "</ul>"); len = op.items.join(" ").length; break;
      case "inbox:list": p.body.innerHTML = ""; p.state.mails = op.items.map(function (m, i) { return self.add(p, '<span class="from">' + esc(m.from) + '</span><span class="w-note">' + esc(m.time || "") + '</span><span class="tagslot"></span><span class="subj">' + esc(m.subj) + "</span>", "mail"); }); len = 40 * op.items.length; break;
      case "inbox:tag": { var m = p.state.mails && p.state.mails[op.i]; if (m) $(".tagslot", m).innerHTML = '<span class="tag ' + (op.color || "") + '">' + esc(op.label) + "</span>"; break; }
      case "inbox:draft": this.add(p, "<b>✍️ Draft" + (op.to ? " to " + esc(op.to) : "") + ":</b><br>" + esc(op.text).replace(/\n/g, "<br>"), "thought"); len = op.text.length; break;
      case "agents:spawn": {
        var box = p.state.box || (p.state.box = this.add(p, "", "agent-cards")); p.state.cards = p.state.cards || {};
        op.agents.forEach(function (a) { var d = document.createElement("div"); d.className = "agent-card" + (a.lead ? " lead" : ""); d.innerHTML = '<div class="an"><span>' + esc(a.name) + '</span><span class="tag">' + (a.lead ? "lead" : "working") + '</span></div><div class="as">' + esc(a.task || "") + '</div><div class="ap"><i></i></div>'; box.appendChild(d); p.state.cards[a.name] = d; });
        len = 40; break;
      }
      case "agents:progress": { var cd = p.state.cards && p.state.cards[op.name]; if (cd) { $(".ap i", cd).style.width = (op.pct || 0) + "%"; if (op.status) $(".as", cd).textContent = op.status; } break; }
      case "agents:done": { var cdd = p.state.cards && p.state.cards[op.name]; if (cdd) { cdd.classList.add("done"); $(".ap i", cdd).style.width = "100%"; $(".tag", cdd).textContent = "✓ done"; $(".tag", cdd).className = "tag green"; if (op.result) $(".as", cdd).textContent = op.result; } len = (op.result || "").length; break; }
      case "sources:add": op.items.forEach(function (s, i) { self.add(p, '<div class="st">' + esc(s.title) + '</div><div class="sm">' + esc(s.meta || "") + "</div>" + (s.score != null ? '<div class="score" title="relevance ' + s.score + '"><i style="width:' + Math.round(s.score * 100) + '%"></i></div><div class="sm">relevance ' + Math.round(s.score * 100) + '%</div>' : ""), "src"); }); len = 30 * op.items.length; break;
      case "sources:pick": { var all = $$(".src", p.body); (op.i instanceof Array ? op.i : [op.i]).forEach(function (i) { if (all[i]) all[i].classList.add("picked"); }); break; }
      case "checklist:set": p.body.innerHTML = '<ul class="checklist">' + op.items.map(function (x) { return "<li>" + md(x) + "</li>"; }).join("") + "</ul>"; len = op.items.join(" ").length; break;
      case "checklist:mark": { var li = $$(".checklist li", p.body)[op.i]; if (li) { li.className = op.state === "todo" ? "" : (op.state || "done"); if (op.text) li.innerHTML = md(op.text); } break; }
      case "approval:ask": {
        var ap = this.add(p, '<div class="aq">' + esc(op.title) + '</div><div class="ad">' + esc(op.detail || "") + '</div><div class="w-row"><button type="button" class="w-btn good a-yes">' + esc(op.approve || "Approve") + '</button><button type="button" class="w-btn bad a-no">' + esc(op.deny || "Deny") + '</button><span class="w-note a-hint">The agent is paused, waiting for you.</span></div>', "approval");
        this.waiting = ap;
        var finish = function (yes) {
          if (!self.waiting) return; self.waiting = null; ap.classList.add("resolved");
          $$("button", ap).forEach(function (b) { b.disabled = true; }); $(".a-hint", ap).textContent = yes ? "✓ You approved." : "✗ You denied.";
          if (!yes) { self.narrate("human", op.deniedSay || "You said no — the agent stops here and reports back instead of acting. That's exactly what an approval step is for."); self.ended = true; self.playing = false; $(".s-play", self.el).textContent = "Replay"; $(".s-step", self.el).disabled = true; return; }
          if (self.playing) self.loop();
        };
        $(".a-yes", ap).addEventListener("click", function () { finish(true); });
        $(".a-no", ap).addEventListener("click", function () { finish(false); });
        if (this.playing) { var hint = $(".a-hint", ap), n = 8; var cd2 = setInterval(function () { if (!self.waiting || self.waiting !== ap) { clearInterval(cd2); return; } n--; hint.textContent = "Waiting for you… auto-approving in " + n + "s"; if (n <= 0) { clearInterval(cd2); finish(true); } }, 1000); }
        len = (op.detail || "").length; break;
      }
      case "phone:line": {
        var w = p.state.wave || (p.state.wave = this.add(p, new Array(28).join("<i></i>") + "<i></i>", "wave"));
        w.className = "wave" + (op.who === "agent" ? " ai" : "");
        var bars = $$("i", w), ticks = Math.min(30, 6 + op.text.length / 4), tk = 0;
        var iv = setInterval(function () { bars.forEach(function (b) { b.style.height = (15 + Math.random() * 85) + "%"; }); if (++tk > ticks) { clearInterval(iv); bars.forEach(function (b) { b.style.height = "15%"; }); } }, 90);
        this.add(p, "<b>" + (op.who === "agent" ? "🤖 Agent" : "🧑 Caller") + ":</b> " + esc(op.text)); len = op.text.length; break;
      }
      case "info:set": { var dl = p.state.dl || (p.state.dl = this.add(p, "", "kv")); var cur2 = p.state.kv || (p.state.kv = {}); for (var key in op.pairs) cur2[key] = op.pairs[key]; dl.outerHTML; dl.innerHTML = Object.keys(cur2).map(function (k2) { return "<dt>" + esc(k2) + "</dt><dd>" + esc(cur2[k2]) + "</dd>"; }).join(""); break; }
      case "notes:add": this.add(p, md(op.text)); len = op.text.length; break;
      default:
        if (o === "clear") { p.body.innerHTML = ""; p.state = {}; p.body.classList.remove("doc"); } else console.warn("sim: unknown op", T + ":" + o);
    }
    return len;
  };
  Sim.prototype.renderCode = function (p) {
    var st = p.state, hi = st.hi || [], del = st.del || [], add = st.add || [];
    $(".code-lines", p.body).innerHTML = st.lines.map(function (l, i) { var c = del.indexOf(i) >= 0 ? "del" : add.indexOf(i) >= 0 ? "add" : hi.indexOf(i + 1) >= 0 ? "hi" : ""; return '<div class="' + c + '"><span class="ln">' + (i + 1) + "</span>" + esc(l) + "</div>"; }).join("");
  };
  Sim.prototype.renderSheet = function (p) {
    var st = p.state;
    p.body.innerHTML = '<table class="sheet"><thead><tr>' + st.cols.map(function (c, i) { return '<th class="' + (st.hc === i ? "hi" : "") + '">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      st.rows.map(function (r, ri) { return "<tr>" + r.map(function (v, ci) { return '<td class="' + (st.hc === ci || st.hr === ri ? "hi" : "") + '">' + esc(v) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
  };
  window.AMSG.Sim = Sim;

  // ---------- init (after widget + sim scripts have loaded) ----------
  document.addEventListener("DOMContentLoaded", function () {
    $$(".sim[data-sim]").forEach(function (el) {
      var spec = window.SIMS && window.SIMS[el.dataset.sim];
      if (!spec) { el.innerHTML = '<div class="w-body w-note">Simulation “' + esc(el.dataset.sim) + '” not found.</div>'; return; }
      try { new Sim(el, spec); el.dataset.ready = "1"; } catch (e) { console.error(e); el.innerHTML = '<div class="w-body w-note">This simulation failed to load.</div>'; }
    });
    $$("[data-widget]").forEach(function (el) {
      var fn = window.AMSG.widgets[el.dataset.widget];
      if (!fn) { el.innerHTML = '<div class="w-body w-note">Interactive demo “' + esc(el.dataset.widget) + '” is coming soon.</div>'; return; }
      try { fn(el); el.dataset.ready = "1"; } catch (e) { console.error(e); el.innerHTML = '<div class="w-body w-note">This demo failed to load.</div>'; }
    });
    refreshProgress();
  });
})();
