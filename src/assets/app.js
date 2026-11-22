/* Agent Academy — client app (no dependencies) */
(function () {
  "use strict";
  var COURSE = window.COURSE || { modules: [], lessons: {}, paths: [] };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.dataset.page;

  // ---------- storage ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var KEYS = ["aa-progress", "aa-quiz", "aa-notes", "aa-papers", "aa-fc", "aa-exam"];
  function progress() { var p = store.get("aa-progress", {}); p.done = p.done || {}; p.visited = p.visited || {}; return p; }
  function isDone(slug) { return !!progress().done[slug]; }
  function setDone(slug, v) {
    var p = progress();
    if (v) p.done[slug] = Date.now(); else delete p.done[slug];
    store.set("aa-progress", p); refreshProgressUI();
  }
  var allSlugs = Object.keys(COURSE.lessons).sort(function (a, b) { return COURSE.lessons[a].n - COURSE.lessons[b].n; });
  function countDone(list) { var p = progress(); return list.filter(function (s) { return p.done[s]; }).length; }

  function toast(msg) {
    var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  // ---------- progress UI ----------
  function refreshProgressUI() {
    var p = progress();
    $$("[data-slug]").forEach(function (el) {
      if (el.tagName === "MAIN" || el.classList.contains("complete-btn") || el.classList.contains("notes")) return;
      var target = el.tagName === "A" ? el : el;
      target.classList.toggle("is-done", !!p.done[el.dataset.slug]);
    });
    COURSE.modules.forEach(function (m) {
      var d = countDone(m.lessons), pct = m.lessons.length ? Math.round(100 * d / m.lessons.length) : 0;
      $$('[data-module-count="' + m.id + '"]').forEach(function (e) { e.textContent = d + "/" + m.lessons.length; });
      $$('[data-module-bar="' + m.id + '"]').forEach(function (e) { e.style.width = pct + "%"; });
    });
    COURSE.paths.forEach(function (pa) {
      var d = countDone(pa.lessons), pct = pa.lessons.length ? Math.round(100 * d / pa.lessons.length) : 0;
      $$('[data-path-bar="' + pa.id + '"]').forEach(function (e) { e.style.width = pct + "%"; });
      $$('[data-path-count="' + pa.id + '"]').forEach(function (e) { e.textContent = d + "/" + pa.lessons.length + " done"; });
    });
    var total = allSlugs.length, done = countDone(allSlugs), pct = total ? Math.round(100 * done / total) : 0;
    $$(".progress-pill").forEach(function (e) { $(".pp-ring", e).style.setProperty("--p", pct); $(".pp-text", e).textContent = pct + "%"; e.title = done + " of " + total + " lessons complete"; });
    $$(".complete-btn").forEach(function (b) {
      var d = !!p.done[b.dataset.slug];
      b.classList.toggle("done", d); b.textContent = d ? "✓ Completed — undo?" : "Mark as complete";
    });
    $$("[data-status-for]").forEach(function (e) { e.textContent = p.done[e.dataset.statusFor] ? "✓ Completed" : ""; });
  }

  // ---------- theme ----------
  function setTheme(t) {
    document.documentElement.dataset.theme = t; store.set("aa-theme-set", 1);
    try { localStorage.setItem("aa-theme", t); } catch (e) {}
    renderMermaid(true);
    document.dispatchEvent(new CustomEvent("aa-theme", { detail: t }));
  }
  function toggleTheme() { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); }
  $$(".theme-btn").forEach(function (b) { b.addEventListener("click", toggleTheme); });

  // ---------- mobile nav / sidebar ----------
  var sidebar = $(".sidebar"), menuBtn = $(".menu-btn"), mobileNav = $(".mobile-nav"), backdrop;
  function closeDrawers() {
    if (sidebar) sidebar.classList.remove("open");
    if (mobileNav) mobileNav.hidden = true;
    if (backdrop) { backdrop.remove(); backdrop = null; }
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    var useSidebar = sidebar && getComputedStyle(sidebar).position === "fixed";
    var open = useSidebar ? !sidebar.classList.contains("open") : mobileNav.hidden;
    closeDrawers();
    if (!open) return;
    if (useSidebar) sidebar.classList.add("open"); else mobileNav.hidden = false;
    backdrop = document.createElement("div"); backdrop.className = "sidebar-backdrop"; backdrop.addEventListener("click", closeDrawers); document.body.appendChild(backdrop);
    menuBtn.setAttribute("aria-expanded", "true");
  });
  if (sidebar) {
    var cur = $('a[aria-current="page"]', sidebar);
    if (cur) { var inner = $(".sidebar-inner", sidebar); inner.scrollTop = Math.max(0, cur.offsetTop - inner.clientHeight / 2); }
  }

  // ---------- lesson page ----------
  var lessonEl = $("main.lesson[data-slug]");
  var slug = lessonEl && lessonEl.dataset.slug;
  if (slug) {
    var p0 = progress(); p0.last = slug; p0.visited[slug] = Date.now(); store.set("aa-progress", p0);
    $$(".complete-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = !isDone(slug); setDone(slug, d);
        if (d) { toast("🎉 Lesson complete! " + countDone(allSlugs) + "/" + allSlugs.length + " done"); }
      });
    });
    var notes = $(".notes"); var allNotes = store.get("aa-notes", {});
    if (notes) {
      notes.value = allNotes[slug] || ""; var nt;
      notes.addEventListener("input", function () {
        clearTimeout(nt); nt = setTimeout(function () { var n = store.get("aa-notes", {}); if (notes.value.trim()) n[slug] = notes.value; else delete n[slug]; store.set("aa-notes", n); }, 400);
      });
    }
  }

  // reading progress bar
  var rp = $(".read-progress");
  if (rp && (page === "lesson" || page === "cheatsheet")) {
    var onScroll = function () { var h = document.documentElement; var max = h.scrollHeight - h.clientHeight; rp.style.width = (max > 0 ? 100 * h.scrollTop / max : 0) + "%"; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // TOC scrollspy
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {}; tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var heads = tocLinks.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    var activeId = null;
    var setActive = function (id) { if (id === activeId) return; activeId = id; tocLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + id); }); };
    var spy = function () {
      var y = 100, best = heads[0];
      for (var i = 0; i < heads.length; i++) { if (heads[i].getBoundingClientRect().top < y) best = heads[i]; else break; }
      if (best) setActive(best.id);
    };
    addEventListener("scroll", function () { requestAnimationFrame(spy); }, { passive: true }); spy();
  }

  // copy buttons
  $$(".copy-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var code = b.closest(".code-block").querySelector("code").innerText;
      var done = function () { b.textContent = "Copied!"; b.classList.add("copied"); setTimeout(function () { b.textContent = "Copy"; b.classList.remove("copied"); }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, function () { fallbackCopy(code); done(); });
      else { fallbackCopy(code); done(); }
    });
  });
  function fallbackCopy(t) { var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); }

  // print
  $$(".print-btn").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });

  // ---------- quizzes ----------
  function initQuiz(quiz, opts) {
    opts = opts || {};
    var id = quiz.dataset.quiz, saved = id ? (store.get("aa-quiz", {})[id] || {}) : {};
    var answers = saved.answers || {};
    var qs = $$(".quiz-q", quiz);
    function score() {
      var c = 0, a = 0;
      qs.forEach(function (q, i) { if (answers[i] !== undefined) { a++; if (answers[i] === +q.dataset.correct) c++; } });
      var el = $(".quiz-score", quiz);
      if (el) el.textContent = a ? (a === qs.length ? (c === qs.length ? "🏆 Perfect score! " : "Score: ") + c + " / " + qs.length + (c === qs.length ? "" : " — review the explanations above") : c + " / " + a + " correct so far (" + (qs.length - a) + " left)") : "";
      if (id) { var all = store.get("aa-quiz", {}); all[id] = { answers: answers, correct: c, answered: a, total: qs.length, ts: Date.now() }; store.set("aa-quiz", all); }
      if (opts.onChange) opts.onChange(c, a);
    }
    function reveal(q, i, choice, silent) {
      var correct = +q.dataset.correct;
      $$(".quiz-opt", q).forEach(function (o, j) {
        o.disabled = true;
        if (j === correct) o.classList.add("correct");
        else if (j === choice) o.classList.add("wrong");
        else o.classList.add("dim");
      });
      var ex = $(".quiz-expl", q); ex.hidden = false;
      var v = $(".quiz-verdict", ex); v.textContent = choice === correct ? "✓ Correct." : "✗ Not quite."; v.className = "quiz-verdict " + (choice === correct ? "ok" : "bad");
    }
    qs.forEach(function (q, i) {
      $$(".quiz-opt", q).forEach(function (o, j) {
        o.addEventListener("click", function () { if (answers[i] !== undefined) return; answers[i] = j; reveal(q, i, j); score(); });
      });
      if (answers[i] !== undefined) reveal(q, i, answers[i], true);
    });
    var reset = $(".quiz-reset", quiz);
    if (reset) reset.addEventListener("click", function () {
      answers = {};
      qs.forEach(function (q) { $$(".quiz-opt", q).forEach(function (o) { o.disabled = false; o.className = "quiz-opt"; }); $(".quiz-expl", q).hidden = true; });
      score();
    });
    score();
  }
  $$(".prose .quiz").forEach(function (q) { initQuiz(q); });

  // ---------- glossary tooltips ----------
  var tip = null, tipFor = null, tipHide;
  function showTip(d) {
    clearTimeout(tipHide);
    if (!tip) { tip = document.createElement("div"); tip.className = "gt-pop"; tip.setAttribute("role", "tooltip"); document.body.appendChild(tip);
      tip.addEventListener("mouseenter", function () { clearTimeout(tipHide); }); tip.addEventListener("mouseleave", hideTip); }
    tipFor = d;
    tip.innerHTML = "<strong>" + escHtml(d.dataset.t) + "</strong><p>" + escHtml(d.dataset.d) + '</p><div class="gt-links"><a href="glossary.html#' + d.dataset.a + '">Glossary</a>' + (d.dataset.l ? ' · <a href="' + d.dataset.l + '.html">' + escHtml((COURSE.lessons[d.dataset.l] || {}).t || "Lesson") + " →</a>" : "") + "</div>";
    tip.style.display = "block";
    var r = d.getBoundingClientRect(), tw = Math.min(320, innerWidth - 24), left = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), innerWidth - tw - 12);
    tip.style.width = tw + "px"; tip.style.left = left + scrollX + "px";
    var th = tip.offsetHeight, top = r.top - th - 10 > 70 ? r.top - th - 10 : r.bottom + 10;
    tip.style.top = top + scrollY + "px";
  }
  function hideTip() { clearTimeout(tipHide); tipHide = setTimeout(function () { if (tip) tip.style.display = "none"; tipFor = null; }, 180); }
  $$("dfn.gt").forEach(function (d) {
    d.addEventListener("mouseenter", function () { showTip(d); });
    d.addEventListener("mouseleave", hideTip);
    d.addEventListener("focus", function () { showTip(d); });
    d.addEventListener("blur", hideTip);
    d.addEventListener("click", function (e) { e.preventDefault(); if (tipFor === d && tip && tip.style.display === "block") hideTip(); else showTip(d); });
  });
  addEventListener("scroll", function () { if (tip && tip.style.display === "block" && tipFor && !tip.matches(":hover")) { tip.style.display = "none"; tipFor = null; } }, { passive: true });

  // ---------- mermaid ----------
  var mermaidLoading = null;
  function loadMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (mermaidLoading) return mermaidLoading;
    mermaidLoading = new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = "assets/vendor/mermaid.min.js"; s.onload = function () { res(window.mermaid); }; s.onerror = rej; document.head.appendChild(s);
    });
    return mermaidLoading;
  }
  function renderMermaid(rerender) {
    var els = $$("pre.mermaid"); if (!els.length) return;
    if (rerender && !window.mermaid) return;
    loadMermaid().then(function (mm) {
      var dark = document.documentElement.dataset.theme === "dark";
      mm.initialize({
        startOnLoad: false, securityLevel: "strict", theme: "base",
        fontFamily: getComputedStyle(document.body).fontFamily,
        flowchart: { htmlLabels: true, curve: "basis" },
        themeVariables: dark ? {
          darkMode: true, background: "#131626", primaryColor: "#221d44", primaryBorderColor: "#9a82ff", primaryTextColor: "#e7e8f2",
          secondaryColor: "#10293a", tertiaryColor: "#1a1e33", lineColor: "#8a8dab", textColor: "#e7e8f2", mainBkg: "#221d44",
          nodeBorder: "#9a82ff", clusterBkg: "#161a2e", clusterBorder: "#343a5c", noteBkgColor: "#33240b", noteTextColor: "#ffe2b0",
          actorBkg: "#221d44", actorBorder: "#9a82ff", actorTextColor: "#e7e8f2", signalColor: "#b7b9d0", signalTextColor: "#e7e8f2", labelBoxBkgColor: "#221d44", edgeLabelBackground: "#131626",
          cScale0: "#3b2f80", cScale1: "#0e4b5c", cScale2: "#4a2a5c", cScale3: "#5c3a0e", cScale4: "#1e4d33", cScale5: "#5c1e2b"
        } : {
          primaryColor: "#efeaff", primaryBorderColor: "#6d4aff", primaryTextColor: "#1b1b2b", secondaryColor: "#e0f6fb", tertiaryColor: "#f7f7fb",
          lineColor: "#73738c", textColor: "#1b1b2b", mainBkg: "#efeaff", nodeBorder: "#6d4aff", clusterBkg: "#f7f7fb", clusterBorder: "#cfcfe0",
          noteBkgColor: "#fff4e0", noteTextColor: "#5c3a00", actorBkg: "#efeaff", actorBorder: "#6d4aff", signalColor: "#4a4a63", edgeLabelBackground: "#ffffff"
        }
      });
      els.forEach(function (el) {
        if (!el.dataset.src) el.dataset.src = el.textContent;
        if (rerender) { el.removeAttribute("data-processed"); el.innerHTML = ""; el.textContent = el.dataset.src; }
      });
      return mm.run({ nodes: els, suppressErrors: true });
    }).catch(function (e) { console.warn("Mermaid failed", e); });
  }
  if ($("pre.mermaid")) {
    if ("IntersectionObserver" in window) {
      var mo = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { mo.disconnect(); renderMermaid(); } }, { rootMargin: "600px" });
      $$("pre.mermaid").forEach(function (e) { mo.observe(e); });
    } else renderMermaid();
  }

  // ---------- search ----------
  var modal = $(".search-modal"), sInput = modal && $("input", modal), sResults = modal && $(".search-results", modal);
  var indexLoading = null, sel = 0;
  function loadIndex() {
    if (window.SEARCH_INDEX) return Promise.resolve(window.SEARCH_INDEX);
    if (indexLoading) return indexLoading;
    indexLoading = new Promise(function (res) { var s = document.createElement("script"); s.src = "assets/search-index.js"; s.onload = function () { res(window.SEARCH_INDEX || []); }; s.onerror = function () { res([]); }; document.head.appendChild(s); });
    return indexLoading;
  }
  function openSearch() { if (!modal) return; modal.hidden = false; sInput.value = ""; sResults.innerHTML = '<div class="search-empty">Type to search ' + allSlugs.length + ' lessons, the glossary and the reading list.</div>'; setTimeout(function () { sInput.focus(); }, 10); loadIndex(); document.body.style.overflow = "hidden"; }
  function closeSearch() { if (!modal) return; modal.hidden = true; document.body.style.overflow = ""; }
  function escHtml(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function doSearch(q) {
    loadIndex().then(function (idx) {
      var terms = q.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1 || /\d/.test(t); });
      if (!terms.length) { sResults.innerHTML = '<div class="search-empty">Keep typing…</div>'; return; }
      var ql = q.toLowerCase().trim();
      var scored = [];
      idx.forEach(function (it) {
        var t = it.t.toLowerCase(), s = (it.s || "").toLowerCase(), x = (it.x || "").toLowerCase(), sc = 0;
        for (var i = 0; i < terms.length; i++) {
          var w = terms[i], hit = 0;
          if (t.indexOf(w) >= 0) hit += 10; if (s.indexOf(w) >= 0) hit += 6;
          var c = 0, pos = x.indexOf(w); while (pos >= 0 && c < 8) { c++; pos = x.indexOf(w, pos + w.length); }
          hit += c;
          if (!hit) return; sc += hit;
        }
        if (t === ql) sc += 40; else if (t.indexOf(ql) === 0) sc += 15;
        if (s.indexOf(ql) >= 0) sc += 8;
        if (it.k === "term") sc += 3;
        scored.push([sc, it]);
      });
      scored.sort(function (a, b) { return b[0] - a[0]; });
      var top = scored.slice(0, 30);
      if (!top.length) { sResults.innerHTML = '<div class="search-empty">No results for “' + escHtml(q) + '”.</div>'; return; }
      var re = new RegExp("(" + terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "gi");
      sResults.innerHTML = top.map(function (p, i) {
        var it = p[1], x = it.x || "", lx = x.toLowerCase(), pos = -1;
        for (var k = 0; k < terms.length && pos < 0; k++) pos = lx.indexOf(terms[k]);
        var start = Math.max(0, pos - 60), snip = (start ? "…" : "") + x.slice(start, start + 180) + (x.length > start + 180 ? "…" : "");
        var kind = { lesson: "Lesson", term: "Glossary", paper: "Paper" }[it.k];
        var ext = it.k === "paper" ? ' target="_blank" rel="noopener"' : "";
        return '<a href="' + escHtml(it.u) + '"' + ext + ' role="option" class="' + (i === 0 ? "sel" : "") + '"><div class="sr-title"><span class="sr-kind">' + kind + "</span>" + escHtml(it.t).replace(re, "<mark>$1</mark>") + (it.s && it.k === "lesson" ? ' <span class="sr-sec">› ' + escHtml(it.s) + "</span>" : "") + '</div><div class="sr-snip">' + escHtml(snip).replace(re, "<mark>$1</mark>") + "</div></a>";
      }).join("");
      sel = 0;
    });
  }
  if (modal) {
    $$(".search-btn").forEach(function (b) { b.addEventListener("click", openSearch); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeSearch(); });
    var st; sInput.addEventListener("input", function () { clearTimeout(st); st = setTimeout(function () { doSearch(sInput.value); }, 80); });
    sInput.addEventListener("keydown", function (e) {
      var items = $$("a", sResults);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); if (!items.length) return;
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach(function (a, i) { a.classList.toggle("sel", i === sel); }); items[sel].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") { if (items[sel]) { items[sel].click(); closeSearch(); } }
    });
    sResults.addEventListener("click", function (e) { if (e.target.closest("a")) closeSearch(); });
  }

  // ---------- keyboard ----------
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase(), typing = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); modal && modal.hidden ? openSearch() : closeSearch(); return; }
    if (e.key === "Escape") { closeSearch(); closeDrawers(); return; }
    if (typing) return;
    if (e.key === "/") { e.preventDefault(); openSearch(); }
    else if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) toggleTheme();
    else if (e.altKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      var a = $(e.key === "ArrowRight" ? ".pager-next" : ".pager-prev"); if (a && a.href) location.href = a.href;
    }
  });

  // ---------- home ----------
  if (page === "home") {
    var pp = progress(), last = pp.last, firstUndone = allSlugs.filter(function (s) { return !pp.done[s]; })[0];
    var target = last && !pp.done[last] ? last : firstUndone;
    var anyActivity = Object.keys(pp.done).length || last;
    if (anyActivity && target) {
      var rc = $(".resume-card"); rc.hidden = false;
      var d = countDone(allSlugs);
      $(".resume-detail", rc).innerHTML = "Next up: <strong>" + escHtml(COURSE.lessons[target].t) + "</strong> · " + d + " of " + allSlugs.length + " lessons complete";
      $(".bar span", rc).style.width = Math.round(100 * d / allSlugs.length) + "%";
      $(".continue-btn2", rc).href = target + ".html";
      $$(".continue-btn").forEach(function (b) { b.href = target + ".html"; b.textContent = "Continue learning →"; });
    } else if (anyActivity && !target) {
      var rc2 = $(".resume-card"); rc2.hidden = false; $("h2", rc2).textContent = "You finished the whole course! 🎓";
      $(".resume-detail", rc2).textContent = "Test yourself with the practice exam, or review with flashcards."; $(".bar span", rc2).style.width = "100%";
      $(".continue-btn2", rc2).href = "exam.html"; $(".continue-btn2", rc2).textContent = "Practice exam →";
    }
  }

  // ---------- glossary ----------
  if (page === "glossary") {
    var gf = $(".gl-filter"), items = $$(".gl-item"), letters = $$(".gl-letter");
    var gcount = $(".gl-count");
    var applyG = function () {
      var q = gf.value.toLowerCase().trim(), n = 0;
      items.forEach(function (it) { var show = !q || it.dataset.text.indexOf(q) >= 0; it.hidden = !show; if (show) n++; });
      letters.forEach(function (h) { var el = h.nextElementSibling, any = false; while (el && !el.classList.contains("gl-letter")) { if (!el.hidden) any = true; el = el.nextElementSibling; } h.hidden = !any; });
      gcount.textContent = n + " term" + (n === 1 ? "" : "s"); $(".gl-empty").hidden = n > 0;
    };
    gf.addEventListener("input", applyG); applyG();
  }

  // ---------- papers ----------
  if (page === "papers") {
    var readMap = store.get("aa-papers", {}), cat = "All";
    var pf = $(".pp-filter"), ess = $(".pp-essential"), unread = $(".pp-unread"), papers = $$(".paper");
    papers.forEach(function (p) {
      var cb = $("input[data-paper]", p); cb.checked = !!readMap[cb.dataset.paper]; p.classList.toggle("is-read", cb.checked);
      cb.addEventListener("change", function () { var m = store.get("aa-papers", {}); if (cb.checked) m[cb.dataset.paper] = Date.now(); else delete m[cb.dataset.paper]; store.set("aa-papers", m); p.classList.toggle("is-read", cb.checked); applyP(); });
    });
    var applyP = function () {
      var q = pf.value.toLowerCase().trim(), n = 0, r = 0;
      papers.forEach(function (p) {
        var cb = $("input[data-paper]", p);
        var show = (cat === "All" || p.dataset.cat === cat) && (!ess.checked || p.dataset.essential === "1") && (!unread.checked || !cb.checked) && (!q || p.dataset.text.indexOf(q) >= 0);
        p.hidden = !show; if (show) n++; if (cb.checked) r++;
      });
      $(".pp-count").textContent = n + " shown · " + r + "/" + papers.length + " read"; $(".pp-empty").hidden = n > 0;
    };
    $$(".chip").forEach(function (c) { c.addEventListener("click", function () { $$(".chip").forEach(function (x) { x.classList.remove("active"); }); c.classList.add("active"); cat = c.dataset.cat; applyP(); }); });
    [pf, ess, unread].forEach(function (el) { el.addEventListener("input", applyP); el.addEventListener("change", applyP); });
    applyP();
  }

  // ---------- flashcards ----------
  if (page === "flashcards" && window.FLASHCARDS) {
    var cards = window.FLASHCARDS, fcState = store.get("aa-fc", {}), deck = "", reverse = false, current = null, session = { seen: 0, good: 0 };
    var cardEl = $(".fc-card"), front = $(".fc-front"), back = $(".fc-back");
    var INTERVAL = [0, 1, 3, 7, 15]; // review spacing in "rounds"
    fcState._round = fcState._round || 0;
    function pool() { return cards.filter(function (c) { return !deck || c.m === deck; }); }
    function boxOf(c) { return (fcState[c.t] && fcState[c.t].b) || 1; }
    function renderBoxes() {
      var counts = [0, 0, 0, 0, 0]; pool().forEach(function (c) { counts[boxOf(c) - 1]++; });
      $(".fc-boxes").innerHTML = counts.map(function (n, i) { return "<div><strong>" + n + "</strong>Box " + (i + 1) + (i === 4 ? " ✓" : "") + "</div>"; }).join("");
    }
    function pick() {
      var p = pool(); if (!p.length) return null;
      var r = fcState._round, due = p.filter(function (c) { var s = fcState[c.t]; return !s || (s.r + INTERVAL[(s.b || 1) - 1] <= r); });
      if (!due.length) { fcState._round++; return pick(); }
      due.sort(function (a, b) { return boxOf(a) - boxOf(b) || Math.random() - .5; });
      var lowest = boxOf(due[0]); var cands = due.filter(function (c) { return boxOf(c) === lowest; });
      var c = cands[Math.floor(Math.random() * cands.length)];
      if (current && c.t === current.t && cands.length > 1) return pick();
      return c;
    }
    function show() {
      current = pick(); cardEl.classList.remove("flipped");
      if (!current) { front.innerHTML = "No cards in this deck."; back.innerHTML = ""; return; }
      var term = "<small>Term</small>" + escHtml(current.t), def = "<small>Definition</small>" + escHtml(current.d) + (current.l ? '<br><a href="' + current.l + '.html" onclick="event.stopPropagation()" style="font-size:14px">Learn more →</a>' : "");
      setTimeout(function () { front.innerHTML = reverse ? def : term; back.innerHTML = reverse ? term : def; }, cardEl.classList.contains("flipped") ? 250 : 0);
      renderBoxes();
      $(".fc-session").textContent = session.seen ? "This session: " + session.good + "/" + session.seen + " recalled" : "";
    }
    function grade(good) {
      if (!current) return;
      var s = fcState[current.t] || { b: 1 };
      s.b = good ? Math.min(5, (s.b || 1) + 1) : 1; s.r = fcState._round; fcState[current.t] = s;
      fcState._round++; session.seen++; if (good) session.good++;
      store.set("aa-fc", fcState); show();
    }
    cardEl.addEventListener("click", function () { cardEl.classList.toggle("flipped"); });
    $(".fc-flip").addEventListener("click", function () { cardEl.classList.toggle("flipped"); });
    $(".fc-good").addEventListener("click", function () { grade(true); });
    $(".fc-again").addEventListener("click", function () { grade(false); });
    $(".fc-deck").addEventListener("change", function (e) { deck = e.target.value; show(); });
    $(".fc-reverse").addEventListener("change", function (e) { reverse = e.target.checked; show(); });
    $(".fc-reset").addEventListener("click", function () { if (confirm("Reset all flashcard progress?")) { fcState = { _round: 0 }; store.set("aa-fc", fcState); show(); } });
    document.addEventListener("keydown", function (e) {
      if (/input|select|textarea/i.test(e.target.tagName)) return;
      if (e.key === " ") { e.preventDefault(); cardEl.classList.toggle("flipped"); }
      else if (e.key === "1") grade(false); else if (e.key === "2") grade(true);
    });
    show();
  }

  // ---------- exam ----------
  if (page === "exam" && window.EXAM) {
    var EX = window.EXAM, run = $(".exam-run"), setup = $(".exam-setup");
    var examStore = store.get("aa-exam", { history: [] });
    var showBest = function () { var h = examStore.history || []; if (h.length) { var best = h.reduce(function (a, b) { return b.pct > a.pct ? b : a; }); $(".ex-best").textContent = "Attempts: " + h.length + " · Best: " + best.pct + "% (" + best.c + "/" + best.n + ") · Last: " + h[h.length - 1].pct + "%"; } };
    showBest();
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    $(".ex-start").addEventListener("click", function () {
      var scope = $(".ex-scope").value, n = +$(".ex-n").value, done = progress().done;
      var pool = EX.filter(function (q) { return !scope || (scope === "done" ? done[q.s] : q.m === scope); });
      if (!pool.length) { toast(scope === "done" ? "Complete some lessons first!" : "No questions in this scope."); return; }
      var qs = shuffle(pool.slice()).slice(0, n), idx = 0, answers = [];
      setup.hidden = true; run.hidden = false;
      function renderQ() {
        var q = qs[idx], order = shuffle(q.options.map(function (_, i) { return i; }));
        run.innerHTML = '<div class="ex-progress"><span>Question ' + (idx + 1) + " of " + qs.length + '</span><div class="bar"><span style="width:' + Math.round(100 * idx / qs.length) + '%"></span></div><span>' + answers.filter(function (a) { return a.ok; }).length + " correct</span></div>" +
          '<div class="quiz-q" data-correct="' + order.indexOf(q.correct) + '"><div class="quiz-question"><span class="quiz-num">' + (idx + 1) + "</span><div>" + q.q + '</div></div><div class="quiz-options">' +
          order.map(function (oi, j) { return '<button type="button" class="quiz-opt" data-i="' + j + '"><span class="quiz-letter">' + String.fromCharCode(65 + j) + "</span><span>" + q.options[oi] + "</span></button>"; }).join("") +
          '</div><div class="quiz-expl" hidden><strong class="quiz-verdict"></strong> ' + q.e + '</div><p class="ex-from">From: <a href="' + q.s + '.html" target="_blank">' + escHtml((COURSE.lessons[q.s] || {}).t || q.s) + '</a></p></div><div class="ex-nav"><button type="button" class="btn btn-ghost ex-quit">Quit</button><button type="button" class="btn btn-primary ex-next" disabled>' + (idx + 1 === qs.length ? "See results" : "Next →") + "</button></div>";
        var qEl = $(".quiz-q", run), correct = +qEl.dataset.correct;
        $$(".quiz-opt", qEl).forEach(function (o, j) {
          o.addEventListener("click", function () {
            $$(".quiz-opt", qEl).forEach(function (x, k) { x.disabled = true; x.classList.add(k === correct ? "correct" : k === j ? "wrong" : "dim"); });
            var ex = $(".quiz-expl", qEl); ex.hidden = false; var v = $(".quiz-verdict", ex); v.textContent = j === correct ? "✓ Correct." : "✗ Not quite."; v.className = "quiz-verdict " + (j === correct ? "ok" : "bad");
            answers[idx] = { ok: j === correct, q: q, chosen: order[j] }; $(".ex-next", run).disabled = false; $(".ex-next", run).focus();
          });
        });
        $(".ex-next", run).addEventListener("click", function () { idx++; if (idx < qs.length) renderQ(); else results(); });
        $(".ex-quit", run).addEventListener("click", function () { run.hidden = true; setup.hidden = false; });
      }
      function results() {
        var c = answers.filter(function (a) { return a.ok; }).length, pct = Math.round(100 * c / qs.length);
        examStore.history = (examStore.history || []).concat([{ ts: Date.now(), c: c, n: qs.length, pct: pct }]).slice(-50); store.set("aa-exam", examStore);
        var byMod = {}; answers.forEach(function (a) { var m = a.q.m; byMod[m] = byMod[m] || [0, 0]; byMod[m][1]++; if (a.ok) byMod[m][0]++; });
        var titles = window.MODULE_TITLES || {};
        var missed = answers.filter(function (a) { return !a.ok; });
        run.innerHTML = '<div class="card ex-result"><p class="eyebrow">Your score</p><div class="w-big ' + (pct >= 80 ? "good" : pct >= 60 ? "mid" : "bad") + '">' + pct + "%</div><p>" + c + " of " + qs.length + " correct. " + (pct >= 90 ? "Outstanding — you really know this material. 🏆" : pct >= 75 ? "Strong work! Review the misses below." : pct >= 50 ? "Solid start. Revisit the lessons linked below." : "Keep going — re-read the linked lessons and try again.") + "</p>" +
          '<table class="ex-table"><thead><tr><th>Module</th><th>Score</th></tr></thead><tbody>' + Object.keys(byMod).map(function (m) { return "<tr><td>" + escHtml(titles[m] || m) + "</td><td>" + byMod[m][0] + "/" + byMod[m][1] + "</td></tr>"; }).join("") + "</tbody></table>" +
          '<div class="w-row" style="justify-content:center"><button type="button" class="btn btn-primary ex-again">Try another exam</button></div></div>' +
          (missed.length ? '<h2 style="margin-top:30px">Review what you missed</h2><div class="ex-review">' + missed.map(function (a) { return '<div class="quiz-q"><div class="quiz-question"><div>' + a.q.q + '</div></div><p><span class="w-pill bad">Your answer</span> ' + a.q.options[a.chosen] + '</p><p><span class="w-pill ok">Correct</span> ' + a.q.options[a.q.correct] + '</p><div class="quiz-expl">' + a.q.e + '</div><p class="ex-from">Review: <a href="' + a.q.s + '.html">' + escHtml((COURSE.lessons[a.q.s] || {}).t || a.q.s) + "</a></p></div>"; }).join("") + "</div>" : "");
        $(".ex-again", run).addEventListener("click", function () { run.hidden = true; setup.hidden = false; showBest(); window.scrollTo(0, 0); });
        window.scrollTo(0, 0);
      }
      renderQ();
    });
  }

  // ---------- progress dashboard ----------
  if (page === "progress") {
    var pr = progress(), quiz = store.get("aa-quiz", {}), notesAll = store.get("aa-notes", {});
    var doneN = countDone(allSlugs), pctAll = allSlugs.length ? Math.round(100 * doneN / allSlugs.length) : 0;
    $(".dash-pct").textContent = pctAll + "%";
    setTimeout(function () { $(".ring-fg").style.strokeDashoffset = 326.7 * (1 - pctAll / 100); }, 50);
    var minutesDone = allSlugs.filter(function (s) { return pr.done[s]; }).reduce(function (a, s) { return a + COURSE.lessons[s].d; }, 0);
    var qa = 0, qc = 0; Object.keys(quiz).forEach(function (k) { qa += quiz[k].answered || 0; qc += quiz[k].correct || 0; });
    var fc = store.get("aa-fc", {}), mastered = Object.keys(fc).filter(function (k) { return k[0] !== "_" && fc[k].b >= 4; }).length;
    var exam = store.get("aa-exam", { history: [] }), bestEx = (exam.history || []).reduce(function (a, b) { return Math.max(a, b.pct); }, 0);
    var papersRead = Object.keys(store.get("aa-papers", {})).length;
    $(".dash-stats").innerHTML = [[doneN + "/" + allSlugs.length, "lessons complete"], [Math.round(minutesDone / 60 * 10) / 10 + "h", "of study completed"], [qa ? Math.round(100 * qc / qa) + "%" : "—", "quiz accuracy (" + qa + " answered)"], [mastered, "flashcards mastered"], [bestEx ? bestEx + "%" : "—", "best exam score"], [papersRead, "papers read"]].map(function (s) { return "<div><strong>" + s[0] + "</strong><span>" + s[1] + "</span></div>"; }).join("");
    $(".dash-modules").innerHTML = COURSE.modules.map(function (m) {
      var d = countDone(m.lessons), pct = Math.round(100 * d / m.lessons.length);
      return '<div class="dash-mod"><h3>' + m.icon + " " + escHtml(m.title) + '</h3><div class="bar"><span style="width:' + pct + '%"></span></div><small>' + d + " of " + m.lessons.length + " lessons · " + pct + "%</small></div>";
    }).join("");
    var qRows = allSlugs.filter(function (s) { return quiz[s] && quiz[s].answered; });
    $(".dash-quizzes").innerHTML = qRows.length ? "<table><thead><tr><th>Lesson</th><th>Score</th></tr></thead><tbody>" + qRows.map(function (s) { var q = quiz[s]; return '<tr><td><a href="' + s + '.html#check-your-understanding">' + escHtml(COURSE.lessons[s].t) + "</a></td><td>" + q.correct + "/" + q.total + (q.answered < q.total ? " (" + q.answered + " answered)" : "") + "</td></tr>"; }).join("") + "</tbody></table>" : '<p class="empty">No quizzes taken yet.</p>';
    var nRows = allSlugs.filter(function (s) { return notesAll[s]; });
    $(".dash-notes").innerHTML = nRows.length ? "<table><tbody>" + nRows.map(function (s) { return '<tr><td><a href="' + s + '.html">' + escHtml(COURSE.lessons[s].t) + "</a></td><td>" + escHtml(notesAll[s]) + "</td></tr>"; }).join("") + "</tbody></table>" : '<p class="empty">No notes yet. Every lesson has a notes box at the bottom.</p>';
    $(".dash-export").addEventListener("click", function () {
      var data = { app: "agent-academy", version: 1, exported: new Date().toISOString() };
      KEYS.forEach(function (k) { data[k] = store.get(k, null); });
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "agent-academy-progress.json"; a.click();
    });
    $(".dash-import").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (t) { var d = JSON.parse(t); if (d.app !== "agent-academy") throw new Error("not an Agent Academy export"); KEYS.forEach(function (k) { if (d[k]) store.set(k, d[k]); }); toast("Progress imported"); setTimeout(function () { location.reload(); }, 600); }).catch(function (err) { toast("Import failed: " + err.message); });
    });
    $(".dash-reset").addEventListener("click", function () { if (confirm("Erase all progress, quiz answers, notes, flashcards and exam history? This cannot be undone.")) { KEYS.forEach(store.del); location.reload(); } });
  }

  refreshProgressUI();
  window.AA = { store: store, toast: toast, progress: progress };
})();
