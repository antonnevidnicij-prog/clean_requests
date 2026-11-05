const { chromium } = require('playwright');
const FPS = 30, END = 84.89, N = Math.ceil(END * FPS), P = 4;
(async () => {
  const b = await chromium.launch();
  await Promise.all([...Array(P).keys()].map(async w => {
    const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('file://' + __dirname + '/index.html'); await p.evaluate(() => window.ready);
    for (let i = w; i < N; i += P) {
      const data = await p.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, i / FPS);
      require('fs').writeFileSync(`frames/${String(i).padStart(5, '0')}.jpg`, Buffer.from(data.split(',')[1], 'base64'));
      if (i % 300 === w) console.log('frame', i);
    }
  }));
  await b.close();
})();
