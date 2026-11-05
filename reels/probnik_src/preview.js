const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + __dirname + '/index.html'); await p.evaluate(() => window.ready);
  const info = await p.evaluate(() => ({ T: window.T, END: window.END }));
  console.log('END', info.END.toFixed(1));
  const pick = process.argv[2] ? process.argv.slice(2).map(Number) : info.T.map((s, i) => (s + (info.T[i + 1] || info.END)) / 2 + 0.3);
  let n = 0;
  for (const t of pick) { await p.evaluate(t => render(t), t); await p.locator('canvas').screenshot({ path: `prev/p_${String(n++).padStart(2, '0')}.png` }); }
  await b.close();
})();
