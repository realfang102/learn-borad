// Browser QA: JS errors, Mermaid render failures, uninitialized widgets and mobile overflow on every page.
// Requires Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
const { chromium } = require('playwright');
const fs = require('fs');
const dir = require('path').resolve(__dirname, '../docs') + '/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  let problems = 0;
  for (const f of files) {
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push('pageerror ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
    await p.goto('file://' + dir + f);
    const n = await p.locator('pre.mermaid').count();
    if (n) { await p.evaluate(() => document.querySelectorAll('pre.mermaid').forEach(e => e.scrollIntoView())); await p.waitForTimeout(400);
      await p.waitForFunction(() => [...document.querySelectorAll('pre.mermaid')].every(e => e.getAttribute('data-processed')), null, { timeout: 15000 }).catch(() => errs.push('mermaid not processed'));
      const bad = await p.evaluate(() => [...document.querySelectorAll('pre.mermaid')].map((e, i) => [i, !!e.querySelector('svg'), e.textContent.includes('Syntax error'), (e.dataset.src||'').slice(0,60)]).filter(x => !x[1] || x[2]));
      for (const x of bad) errs.push('mermaid #' + x[0] + ' failed: ' + x[3].replace(/\n/g,' '));
    }
    const wbad = await p.evaluate(() => [...document.querySelectorAll('.widget')].filter(w => !w.dataset.ready).length);
    if (wbad) errs.push(wbad + ' widget(s) not initialized');
    const over = await p.evaluate(() => { const w = document.documentElement.clientWidth; return [...document.querySelectorAll('main *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > w + 2 && !e.closest('.code-block pre,.table-wrap,.diagram,.w-textarea,.chart,.search-modal,.sidebar'); }).slice(0, 3).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right)); });
    if (over.length) errs.push('overflow: ' + over.join(' | '));
    if (errs.length) { problems++; console.log('✗ ' + f + (n ? ` (${n} diagrams)` : '') + '\n   ' + errs.join('\n   ')); }
    await p.close();
  }
  console.log(`checked ${files.length} pages, ${problems} with problems`);
  await b.close();
})();
