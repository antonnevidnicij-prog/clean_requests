const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/index.html'); await p.evaluate(() => window.ready);
  const times = process.argv.slice(2).map(Number);
  for (const t of times) { await p.evaluate(t => render(t), t); await p.locator('canvas').screenshot({ path: `prev/f_${t.toFixed(1).padStart(5,'0')}.png` }); }
  console.log(errs.join('\n')); await b.close();
})();
