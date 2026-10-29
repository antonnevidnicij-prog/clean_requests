// ---------- KUPOL scenes ----------
function snow(t, n, sp, wind, seed = 1, a = 1) {
  g.save(); g.globalAlpha *= a; g.fillStyle = '#e8f6ff';
  for (let i = 0; i < n; i++) {
    const s = 1 + rnd(i + seed) * 3.5, v = sp * (0.5 + rnd(i + seed + 3));
    const x = ((rnd(i + seed + 7) * 1400 + t * wind * v) % 1400 + 1400) % 1400 - 160, y = ((rnd(i + seed + 11) * 2000 + t * v) % 2000) - 40;
    g.globalAlpha = a * (0.35 + rnd(i + seed) * 0.6); g.fillRect(x, y, s * (1 + Math.abs(wind) * 0.8), s);
  }
  g.restore();
}
function frost(k, t) {
  if (k <= 0) return;
  g.save();
  for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H], [0, H / 2], [W, H / 2]]) {
    const gr = g.createRadialGradient(x, y, 0, x, y, 700 * k); gr.addColorStop(0, 'rgba(225,245,255,.75)'); gr.addColorStop(1, 'rgba(225,245,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
  g.strokeStyle = 'rgba(240,250,255,.55)'; g.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    const side = i % 4, L = (120 + rnd(i) * 260) * k;
    let x = side === 0 ? 0 : side === 1 ? W : rnd(i + 3) * W, y = side === 2 ? 0 : side === 3 ? H : rnd(i + 5) * H;
    const ang = side === 0 ? 0 : side === 1 ? Math.PI : side === 2 ? Math.PI / 2 : -Math.PI / 2;
    g.beginPath(); g.moveTo(x, y);
    for (let j = 0; j < 6; j++) { x += Math.cos(ang + (rnd(i * 9 + j) - .5) * 1.4) * L / 6; y += Math.sin(ang + (rnd(i * 7 + j) - .5) * 1.4) * L / 6; g.lineTo(x, y); }
    g.stroke();
  }
  g.restore();
}
function iceField(t, opt = {}) {
  const sky = g.createLinearGradient(0, 0, 0, 1100); sky.addColorStop(0, '#040a14'); sky.addColorStop(0.7, '#14304a'); sky.addColorStop(1, '#5a87a6');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) circ(rnd(i) * W, rnd(i + 30) * 700, rnd(i + 2) * 2 + .4, 'rgba(255,255,255,.6)');
  // aurora
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let b = 0; b < 3; b++) {
    g.beginPath();
    for (let x = -50; x <= W + 50; x += 20) { const y = 380 + b * 60 + Math.sin(x * 0.006 + t * 0.4 + b) * 70 + Math.sin(x * 0.013 - t * 0.3) * 30; x === -50 ? g.moveTo(x, y) : g.lineTo(x, y); }
    g.lineTo(W + 50, 900); g.lineTo(-50, 900); g.closePath();
    const ag = g.createLinearGradient(0, 300, 0, 800); ag.addColorStop(0, `rgba(80,255,190,${0.16 - b * 0.04})`); ag.addColorStop(1, 'rgba(80,255,190,0)');
    g.fillStyle = ag; g.fill();
  }
  g.restore();
  const ground = g.createLinearGradient(0, 1050, 0, H); ground.addColorStop(0, '#c9dfee'); ground.addColorStop(1, '#6f8ea6');
  g.fillStyle = ground; g.fillRect(0, 1050, W, H);
  // drill tower
  g.save(); g.translate(700, 1060);
  g.strokeStyle = '#26323c'; g.lineWidth = 10;
  g.beginPath(); g.moveTo(-90, 0); g.lineTo(0, -560); g.lineTo(90, 0); g.stroke();
  for (let k = 1; k < 8; k++) { const y = -k * 70, w = 90 * (1 - k / 8); g.beginPath(); g.moveTo(-w, y); g.lineTo(w, y - 70); g.moveTo(w, y); g.lineTo(-w, y - 70); g.stroke(); }
  const bl = Math.floor(t * 1.5) % 2; circ(0, -570, 12, bl ? '#ff3b3b' : '#5a1515'); if (bl) glow(0, -570, 70, 'rgba(255,60,60,.6)');
  rect(-200, -90, 160, 90, '#2b3a46'); rect(-200, -90, 160, 14, C.a); rect(40, -70, 130, 70, '#2b3a46'); rect(40, -70, 130, 12, C.a);
  for (const x of [-170, -120, 70, 120]) { rect(x, -60, 26, 20, '#ffd59a'); glow(x + 13, -50, 40, 'rgba(255,200,120,.5)'); }
  g.restore();
  if (opt.dist) {
    const p = eout(prog(t, opt.dist, opt.dist + 1.2));
    g.save(); g.setLineDash([22, 16]); g.strokeStyle = C.a; g.lineWidth = 6; g.beginPath(); g.moveTo(700, 1000); g.lineTo(lerp(700, 1120, p), lerp(1000, 760, p)); g.stroke(); g.restore();
    if (p > 0.6) { g.save(); g.globalAlpha = prog(p, 0.6, 1); text('1 300 КМ', 830, 700, 90, C.a, { ui: true, glow: 18 }); text('ДО БЛИЖАЙШИХ ЛЮДЕЙ', 830, 770, 26, '#ffd0a8', { mono: true }); g.restore(); }
  }
  snow(t, 260, 260, -1.4, 3);
}
function iceCore(t, opt = {}) {
  rect(0, 0, W, H, '#07111a');
  glow(540, 900, 700, 'rgba(255,138,42,.22)');
  rect(0, 1080, W, 840, '#141f28'); rect(0, 1080, W, 8, '#2a3a46');
  g.save(); g.translate(540, 820); g.rotate(-0.06);
  const cg = g.createLinearGradient(0, -170, 0, 170); cg.addColorStop(0, '#d8f2ff'); cg.addColorStop(0.5, '#7fb8d8'); cg.addColorStop(1, '#3d6f8f');
  g.fillStyle = cg; rr(-470, -170, 940, 340, 160); g.fill();
  // hand inside
  g.save(); g.globalAlpha = 0.85; g.fillStyle = '#2b3f52';
  rr(-40, -70, 360, 120, 50); g.fill();               // forearm
  rr(-200, -95, 190, 170, 70); g.fill();               // fist
  for (let k = 0; k < 4; k++) { rr(-235, -88 + k * 40, 70, 34, 16); g.fill(); }
  rr(-160, -125, 90, 40, 18); g.fill();                // thumb
  g.restore();
  g.fillStyle = 'rgba(255,255,255,.12)'; rr(-450, -150, 900, 60, 40); g.fill();
  for (let i = 0; i < 60; i++) circ((rnd(i) - .5) * 880, (rnd(i + 4) - .5) * 300, 2 + rnd(i + 2) * 5, 'rgba(255,255,255,.35)');
  g.restore();
  if (opt.label) { text('КЕРН · ГЛУБИНА 3 214 М', 540, 1150, 34, C.cy, { mono: true, ls: 2 }); text('ВОЗРАСТ ЛЬДА: ~400 000 ЛЕТ', 540, 1205, 26, C.mute, { mono: true }); }
  snow(t, 60, 40, 0.2, 9, 0.5);
}
function baseTop(t, i0) {
  rect(0, 0, W, H, '#b9d0e0');
  for (let i = 0; i < 50; i++) { const y = rnd(i) * H, x = (t * 120 + rnd(i + 3) * 1600) % 1600 - 300; g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x, y, 260 + rnd(i) * 300, 3); }
  // modules + corridors
  g.strokeStyle = '#7d8f9c'; g.lineWidth = 26;
  g.beginPath(); g.moveTo(300, 700); g.lineTo(760, 700); g.lineTo(760, 1050); g.moveTo(300, 700); g.lineTo(300, 1100); g.stroke();
  const mods = [[300, 700, 220, 150], [760, 700, 200, 140], [760, 1050, 240, 160], [300, 1100, 200, 150], [540, 880, 150, 120]];
  mods.forEach(([x, y, w, h]) => { g.fillStyle = 'rgba(0,0,0,.18)'; rr(x - w / 2 + 14, y - h / 2 + 18, w, h, 14); g.fill(); g.fillStyle = '#34434f'; rr(x - w / 2, y - h / 2, w, h, 14); g.fill(); rect(x - w / 2, y - h / 2, w, 16, C.a); });
  text('КУПОЛ', 540, 470, 64, '#34434f', { ui: true, ls: 14 });
  // people dots appear
  const t0 = T[i0 + 1];
  for (let k = 0; k < 14; k++) {
    const m = mods[k % 5], x = m[0] + (rnd(k) - .5) * m[2] * 0.7, y = m[1] + (rnd(k + 9) - .5) * m[3] * 0.6;
    const p = eback(prog(t, t0 + k * 0.07, t0 + k * 0.07 + 0.3)); if (p <= 0) continue;
    glow(x, y, 40 * p, 'rgba(255,200,120,.8)'); circ(x, y, 10 * p, '#ffe2b0');
  }
  // plane leaving
  const pp = prog(t, T[i0 + 2], T[i0 + 3] + 1.2);
  if (pp > 0) {
    const x = lerp(540, 1250, eout(pp)), y = lerp(1500, 150, eout(pp)), s = lerp(1.4, 0.5, pp);
    g.save(); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 6; g.beginPath(); g.moveTo(540, 1500); g.lineTo(x, y); g.stroke();
    g.translate(x, y); g.rotate(Math.atan2(y - 1500, x - 540) + Math.PI / 2); g.scale(s, s); g.fillStyle = '#1d2a33';
    rr(-18, -110, 36, 220, 18); g.fill(); g.beginPath(); g.moveTo(-150, 10); g.lineTo(150, 10); g.lineTo(0, -40); g.fill(); g.beginPath(); g.moveTo(-60, 100); g.lineTo(60, 100); g.lineTo(0, 70); g.fill();
    g.restore();
  }
  const pd = eback(prog(t, T[i0 + 3], T[i0 + 3] + 0.4));
  if (pd > 0) { g.save(); g.translate(540, 1420); g.scale(pd, pd); g.fillStyle = 'rgba(7,17,26,.85)'; rr(-330, -110, 660, 220, 26); g.fill(); g.strokeStyle = C.a; g.lineWidth = 5; g.stroke();
    text('243', -110, 0, 140, C.a, { ui: true, glow: 18 }); text('ДНЯ', 130, -25, 50, C.w, { ui: true }); text('ДО САМОЛЁТА', 140, 35, 24, C.mute, { mono: true }); g.restore(); }
  snow(t, 140, 200, -1.6, 5, 0.8);
}
function shaft(t, i0) {
  rect(0, 0, W, H, '#06101a');
  const cam = ease(prog(t, T[i0], T[i0 + 1] + 0.5));
  g.save(); g.translate(0, -cam * 300);
  for (let k = 0; k < 14; k++) { const c = 220 - k * 14; g.fillStyle = `rgb(${c * 0.45},${c * 0.75},${c})`; g.fillRect(0, 250 + k * 130, W, 130); }
  for (let i = 0; i < 120; i++) circ(rnd(i) * W, 250 + rnd(i + 5) * 1800, 2 + rnd(i + 1) * 4, 'rgba(255,255,255,.25)');
  rect(510, 250, 60, 1820, '#020609');
  g.restore();
  // rising core
  const rp = prog(t, T[i0 + 1], T[i0 + 2]);
  const cy = lerp(1500, 300, ease(rp));
  g.fillStyle = '#a8dcf5'; rr(515, cy, 50, 260, 20); g.fill(); glow(540, cy + 130, 160, 'rgba(160,220,255,.4)');
  // ruler
  rect(110, 260, 6, 1100, '#3a5566');
  for (let m = 0; m <= 3200; m += 400) { const y = 260 + m / 3200 * 1100; rect(110, y, 30, 4, '#6f8ea6'); text(fmt(m) + ' м', 152, y, 24, C.mute, { mono: true, align: 'left' }); }
  const dm = lerp(0, 3214, ease(prog(t, T[i0], T[i0] + 1.6))), my = 260 + dm / 3200 * 1100;
  g.fillStyle = C.a; g.beginPath(); g.moveTo(118, my); g.lineTo(146, my - 16); g.lineTo(146, my + 16); g.fill();
  text(fmt(dm) + ' М', 860, 420, 90, C.a, { ui: true, glow: 18 }); text('ГЛУБИНА БУРА', 860, 490, 26, '#ffd0a8', { mono: true });
  if (rp > 0 && rp < 1) speedLines(t, 0.4, 'rgba(200,240,255,.45)');
}
const RADAR_N = 46;
function radar(t, i0) {
  rect(0, 0, W, H, '#0a0603');
  const x0 = 80, y0 = 300, w = 920, h = 1060;
  g.fillStyle = '#140b05'; rr(x0 - 20, y0 - 20, w + 40, h + 40, 20); g.fill();
  g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
  g.strokeStyle = 'rgba(255,138,42,.12)'; g.lineWidth = 2;
  for (let x = x0; x < x0 + w; x += 60) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 + h); g.stroke(); }
  for (let y = y0; y < y0 + h; y += 60) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke(); }
  for (let y = y0; y < y0 + h; y += 6) { const n = rnd(y + Math.floor(t * 10)) * 0.08; rect(x0, y, w, 2, `rgba(255,138,42,${n})`); }
  const t0 = T[i0], tEnd = T[i0 + 4] || END;
  const sweep = ((t - t0) * 0.55) % 1, sx = x0 + sweep * w;
  const nShow = Math.floor(lerp(1, RADAR_N, ease(prog(t, T[i0 + 1], T[i0 + 2] + 0.8))));
  for (let i = 0; i < RADAR_N; i++) {
    if (i >= nShow) break;
    const px = x0 + 60 + rnd(i + 70) * (w - 120), py = y0 + 220 + rnd(i + 90) * (h - 320), s = 0.6 + rnd(i) * 0.6;
    const age = ((sx - px) / w + 1) % 1, a = 0.25 + 0.75 * Math.exp(-age * 4);
    const pulse = t > T[i0 + 3] ? 0.6 + 0.4 * Math.sin(t * 6 + i) : 1;
    g.save(); g.globalAlpha = a * pulse; g.fillStyle = i === 0 ? '#ffd0a0' : C.a; g.translate(px, py); g.scale(s, s);
    circ(0, -70, 16, g.fillStyle); rr(-15, -52, 30, 70, 12); g.fill(); rr(-12, 16, 10, 50, 5); g.fill(); rr(2, 16, 10, 50, 5); g.fill();
    if (t > T[i0 + 2]) { g.strokeStyle = 'rgba(255,200,150,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -110); g.lineTo(0, 90); g.stroke(); }
    g.restore();
  }
  const lg = g.createLinearGradient(sx - 140, 0, sx, 0); lg.addColorStop(0, 'rgba(255,138,42,0)'); lg.addColorStop(1, 'rgba(255,138,42,.35)');
  g.fillStyle = lg; g.fillRect(sx - 140, y0, 140, h); rect(sx - 2, y0, 4, h, '#ffb070');
  g.restore();
  text('ГЕОРАДАР · РАЗРЕЗ ПОД СТАНЦИЕЙ', x0, y0 - 50, 26, C.a, { mono: true, align: 'left' });
  text('ОБЪЕКТОВ: ' + (nShow < 3 ? nShow : Math.floor(lerp(1, 412, ease(prog(t, T[i0 + 1], T[i0 + 2] + 0.8))))), x0 + w, y0 - 50, 30, '#ffd0a0', { ui: true, align: 'right' });
}
function radioSet(t, i0) {
  rect(0, 0, W, H, '#08121a');
  const lost = t > T[i0 + 1];
  g.fillStyle = '#2b3a33'; rr(110, 420, 860, 620, 30); g.fill(); g.fillStyle = '#1b2621'; rr(150, 470, 500, 280, 14); g.fill();
  g.strokeStyle = lost ? '#3a4a42' : '#9cf0b8'; g.lineWidth = 5; g.beginPath();
  for (let x = 0; x <= 480; x += 6) { const amp = lost ? rnd(x + Math.floor(t * 30)) * 10 : 20 + 90 * Math.abs(Math.sin(t * 9 + x * 0.05) * Math.sin(t * 3 + x * 0.013)); const y = 610 + Math.sin(x * 0.2 + t * 20) * amp; x ? g.lineTo(160 + x, y) : g.moveTo(160 + x, y); }
  g.stroke();
  for (const [x, y] of [[790, 560], [790, 720], [300, 880], [520, 880]]) { circ(x, y, 60, '#141c18'); g.save(); g.translate(x, y); g.rotate(t * 0.3 + x); rect(-6, -55, 12, 40, '#c8d8d0'); g.restore(); }
  text(lost ? 'НЕТ СИГНАЛА' : 'КВ · 8 255 КГЦ · МОСКВА', 400, 800, 30, lost ? C.r : '#9cf0b8', { mono: true, glow: lost ? 10 : 0 });
  if (lost) { for (let i = 0; i < 120; i++) rect(rnd(i + Math.floor(t * 40)) * W, rnd(i * 3 + Math.floor(t * 40)) * H, 60 + rnd(i) * 200, 4, 'rgba(220,240,240,.12)'); }
  snow(t, 40, 30, 0.1, 7, 0.3);
}
function lab(t, i0, dark) {
  rect(0, 0, W, H, dark ? '#03070b' : '#0f1d26');
  rect(0, 1150, W, 770, dark ? '#05090d' : '#18262f');
  // window with blizzard
  g.fillStyle = '#0a1420'; rr(620, 300, 360, 420, 10); g.fill();
  g.save(); g.beginPath(); g.rect(620, 300, 360, 420); g.clip(); snow(t, 120, 400, -2, 13, 0.9); g.restore();
  g.strokeStyle = '#2a3a46'; g.lineWidth = 14; g.strokeRect(620, 300, 360, 420);
  // table + tray + core
  rect(140, 960, 800, 26, '#3a4a56'); rect(170, 986, 22, 170, '#2a3640'); rect(890, 986, 22, 170, '#2a3640');
  rect(250, 930, 560, 30, '#7d8d99');
  const melt = dark ? 1 : prog(t, T[i0 + 1], T[i0 + 3] || END) * 0.6;
  const empty = dark && t > T[i0 + 4];
  if (!empty) { g.save(); g.globalAlpha = 1 - melt * 0.5; g.fillStyle = '#a8dcf5'; rr(290, 860 + melt * 30, 480, 80 - melt * 30, 36); g.fill(); g.fillStyle = 'rgba(43,63,82,.8)'; rr(380, 880 + melt * 30, 200, 40 - melt * 15, 18); g.fill(); g.restore(); }
  // drips + puddle
  for (let k = 0; k < 6; k++) { const ph = (t * 0.8 + k / 6) % 1; if (!empty || dark) circ(330 + k * 80, lerp(990, 1150, ph * ph), 6, 'rgba(160,220,255,.8)'); }
  const pw = lerp(120, 520, dark ? 1 : melt); g.fillStyle = 'rgba(130,190,230,.45)'; g.beginPath(); g.ellipse(540, 1170, pw, 26, 0, 0, Math.PI * 2); g.fill();
  // thermometer
  g.fillStyle = '#1b2832'; rr(140, 320, 300, 150, 14); g.fill();
  text(dark ? '−41 °C' : '+18 °C', 290, 380, 70, dark ? C.t : C.a, { ui: true, glow: 12 }); text('ЛАБОРАТОРИЯ', 290, 440, 22, C.mute, { mono: true });
  // Vera
  if (!dark) { g.save(); g.translate(880, 1150); g.fillStyle = '#e6edf2'; rr(-60, -330, 120, 250, 40); g.fill(); rect(-45, -90, 36, 90, '#2a3640'); rect(9, -90, 36, 90, '#2a3640'); circ(0, -370, 46, '#e0a47c'); g.fillStyle = '#3a2418'; g.beginPath(); g.arc(0, -380, 48, Math.PI, 0); g.fill(); g.restore(); }
  if (empty) { glow(530, 900, 260, 'rgba(255,138,42,.35)'); text('ПУСТО', 530, 820, 56, C.a, { ui: true, glow: 16 }); }
}
function night(t, i0) {
  const off = t > T[i0 + 1] + 0.5 ? 1 : t > T[i0 + 1] ? (rnd(Math.floor(t * 25)) > 0.5 ? 1 : 0) : 0;
  lab(t, i0, true);
  if (!off) { g.save(); g.globalAlpha = 0.5; rect(0, 0, W, H, '#16303d'); g.restore(); }
  // flashlight
  const fx = 540 + Math.sin(t * 0.9) * 180, fy = t > T[i0 + 3] ? 1120 : 880;
  g.save(); g.globalCompositeOperation = 'lighter';
  const fl = g.createRadialGradient(fx, fy, 0, fx, fy, 420); fl.addColorStop(0, 'rgba(255,240,210,.35)'); fl.addColorStop(1, 'rgba(255,240,210,0)');
  g.fillStyle = fl; g.fillRect(0, 0, W, H); g.restore();
  frost(lerp(0.15, 1, prog(t, T[i0 + 2], T[i0 + 3] + 1)), t);
  if (t < T[i0 + 1]) { const p = eback(prog(t, T[i0], T[i0] + 0.4)); g.save(); g.translate(540, 620); g.scale(p, p); text('03:40', 0, 0, 200, C.w, { ui: true, glow: 30 }); g.restore(); }
  if (t > T[i0 + 1] && t < T[i0 + 1] + 1.2) text('ГЕНЕРАТОР · ОТКАЗ', 540, 600, 48, C.r, { ui: true, glow: 18 });
  snow(t, 50, 60, -0.3, 21, 0.4);
}
function tracks(t, i0) {
  rect(0, 0, W, H, '#04090d');
  g.fillStyle = '#0c1820'; g.beginPath(); g.moveTo(0, 300); g.lineTo(440, 720); g.lineTo(640, 720); g.lineTo(W, 300); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  g.fillStyle = '#b9d0e0'; g.beginPath(); g.moveTo(0, 1920); g.lineTo(440, 940); g.lineTo(640, 940); g.lineTo(W, 1920); g.fill();
  rect(440, 720, 200, 220, '#2a2016');
  glow(540, 830, 160, 'rgba(255,190,120,.5)'); rect(530, 720, 14, 220, '#ffcf8a');
  g.fillStyle = '#0a1218'; rr(440, 670, 200, 44, 6); g.fill(); text('ЖИЛОЙ БЛОК', 540, 692, 22, C.a, { mono: true });
  const t0 = T[i0], n = 12;
  for (let k = 0; k < n; k++) {
    const z = 1 - k / n, tk = t0 + k * 0.18; if (t < tk) continue;
    const y = lerp(960, 1850, z * z), x = 540 + (k % 2 ? 1 : -1) * lerp(14, 90, z * z), s = lerp(0.2, 1.4, z * z);
    g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = 'rgba(40,70,95,.85)'; g.beginPath(); g.ellipse(0, 0, 34, 70, 0, 0, Math.PI * 2); g.fill(); circ(0, -88, 26, 'rgba(40,70,95,.85)'); g.restore();
  }
  g.save(); g.globalCompositeOperation = 'lighter';
  const fl = g.createRadialGradient(540, 1500, 0, 540, 1500, 700); fl.addColorStop(0, 'rgba(255,240,210,.25)'); fl.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = fl; g.fillRect(0, 0, W, H); g.restore();
  frost(0.8, t);
  if (t > T[i0 + 1]) { const p = eback(prog(t, T[i0 + 1], T[i0 + 1] + 0.4)); g.save(); g.translate(540, 520); g.scale(p, p); text('12', 0, 0, 160, C.a, { ui: true, glow: 22 }); text('СПЯТ', 0, 100, 36, C.w, { ui: true }); g.restore(); }
}
