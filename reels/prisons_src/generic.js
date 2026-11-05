// ---------- generic prison explainer scenes ----------
function popIn(t, t0, dur = 0.35) { return eback(prog(t, t0, t0 + dur)); }
function stamp(t, t0, s, x, y, col, fs = 56, rot = -0.08) {
  const p = popIn(t, t0, 0.3); if (p <= 0) return;
  g.save(); g.font = `400 ${fs}px "Russo One"`; const w = g.measureText(s).width + fs;
  g.translate(x, y); g.rotate(rot); g.scale(lerp(2, 1, p), lerp(2, 1, p)); g.globalAlpha = clamp(p * 2);
  g.fillStyle = 'rgba(10,12,14,.75)'; rr(-w / 2, -fs * 0.9, w, fs * 1.8, 12); g.fill();
  g.strokeStyle = col; g.lineWidth = 7; g.stroke(); text(s, 0, 4, fs, col, { ui: true }); g.restore();
}
function bigCard(t, t0, big, small, y = 640, col = C.t) {
  const p = popIn(t, t0, 0.4); if (p <= 0) return;
  g.save(); g.translate(540, y); g.scale(p, p);
  g.fillStyle = 'rgba(10,12,14,.88)'; rr(-400, -150, 800, 300, 26); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke();
  text(big, 0, -25, big.length > 6 ? 110 : 160, col, { ui: true, glow: 20 }); text(small, 0, 95, 28, C.cy, { mono: true });
  g.restore();
}
function aerial(t, v) {
  const skyTop = v === 'desert' ? '#1a0f14' : v === 'island' ? '#06101a' : '#060a10';
  const skyBot = v === 'desert' ? '#6a3a2a' : v === 'island' ? '#1d3346' : '#1b2532';
  const sky = g.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, skyTop); sky.addColorStop(1, skyBot); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) circ(rnd(i) * W, rnd(i + 9) * 500, rnd(i + 3) * 2 + .4, 'rgba(255,255,255,.45)');
  if (v === 'desert') {
    for (let L = 0; L < 3; L++) { g.fillStyle = ['#2a1a1e', '#22161a', '#1a1215'][L]; g.beginPath(); g.moveTo(0, 900);
      for (let x = 0; x <= W; x += 60) g.lineTo(x, 760 + L * 50 - Math.abs(Math.sin(x * 0.006 + L * 2)) * (260 - L * 60)); g.lineTo(W, 900); g.fill(); }
    rect(0, 900, W, 1100, '#2a2024');
  } else if (v === 'island') {
    g.fillStyle = '#0a0f15'; for (let i = 0; i < 26; i++) { const h = 40 + rnd(i) * 110; g.fillRect(i * 44, 700 - h, 36, h); for (let k = 0; k < 4; k++) if (rnd(i * 5 + k) > 0.5) rect(i * 44 + 8, 700 - h + 10 + k * 22, 6, 8, '#ffd27a'); }
    const sea = g.createLinearGradient(0, 700, 0, H); sea.addColorStop(0, '#12263a'); sea.addColorStop(1, '#05101a'); g.fillStyle = sea; g.fillRect(0, 700, W, H);
    for (let i = 0; i < 70; i++) { const y = 720 + rnd(i) * 1100, x = (rnd(i + 3) * 1300 + t * 30 * (1 + rnd(i))) % 1300 - 100; rect(x, y, 40 + rnd(i + 1) * 90, 3, 'rgba(160,200,230,.18)'); }
    g.fillStyle = '#2a2622'; g.beginPath(); g.ellipse(540, 1180, 430, 170, 0, 0, Math.PI * 2); g.fill();
  } else {
    rect(0, 900, W, 1100, '#c8d3dc');
    for (let i = 0; i < 18; i++) { const x = i * 64 - 20, h = 120 + rnd(i) * 160; g.fillStyle = '#0d1a14'; g.beginPath(); g.moveTo(x, 910); g.lineTo(x + 30, 910 - h); g.lineTo(x + 60, 910); g.fill(); }
  }
  g.save(); g.translate(540, v === 'island' ? 1120 : 1180); g.scale(1, 0.55);
  g.strokeStyle = '#4a5058'; g.lineWidth = 26; g.strokeRect(-380, -340, 760, 680);
  for (const [x, y, w, h] of [[-280, -230, 560, 170], [-280, 60, 240, 160], [40, 60, 240, 160]]) { g.fillStyle = v === 'island' ? '#cfc6b4' : '#353b42'; g.fillRect(x, y, w, h); for (let k = 0; k < w; k += 40) rect(x + k + 10, y + 20, 18, 30, rnd(k + x + y) > 0.4 ? '#ffd27a' : '#20252a'); }
  g.restore();
  const towers = v === 'island' ? [[860, 1000]] : [[160, 960], [920, 960]];
  for (const [x, y] of towers) {
    rect(x - 14, y - 170, 28, 170, '#2a2f34'); rect(x - 40, y - 210, 80, 50, '#3a4048');
    g.save(); g.translate(x, y - 190); g.rotate(Math.sin(t * 0.8 + x) * 0.9 + (x < 540 ? 0.5 : 2.6));
    const lg = g.createLinearGradient(0, 0, 900, 0); lg.addColorStop(0, 'rgba(255,240,190,.4)'); lg.addColorStop(1, 'rgba(255,240,190,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(0, 0); g.lineTo(900, -110); g.lineTo(900, 110); g.fill(); g.restore(); circ(x, y - 190, 10, '#fff4cc');
  }
  if (v === 'snow') for (let i = 0; i < 180; i++) { const x = (rnd(i) * 1300 + t * 50 * (0.5 + rnd(i + 2))) % 1300 - 100, y = (rnd(i + 5) * 2000 + t * 130 * (0.5 + rnd(i + 7))) % 2000; rect(x, y, 3, 3, 'rgba(235,240,245,.7)'); }
  if (v === 'island') for (let i = 0; i < 8; i++) { const x = (t * 40 + i * 260) % 1500 - 300; glow(x, 820 + i * 40, 260, 'rgba(180,200,220,.12)'); }
  if (v === 'desert') for (let i = 0; i < 60; i++) { const x = (rnd(i) * 1300 + t * 160) % 1300 - 100, y = 600 + rnd(i + 4) * 1200; rect(x, y, 30, 2, 'rgba(230,180,140,.25)'); }
}
function titleOver(t, t0, big, small, col = C.t) {
  const p = popIn(t, t0 + 0.2, 0.5); if (p <= 0) return;
  g.save(); g.globalAlpha = clamp(p); g.translate(540, 480); g.scale(lerp(1.5, 1, p), lerp(1.5, 1, p));
  text(big, 0, 0, big.length > 8 ? 110 : 150, col, { ui: true, glow: 30 }); if (small) text(small, 0, 100, 40, C.w, { ui: true, ls: 4 }); g.restore();
}
function gridBg(col = 'rgba(240,179,58,.08)') {
  rect(0, 0, W, H, '#0b0e11'); g.strokeStyle = col; g.lineWidth = 2;
  for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
}
function mapPin(t, t0, o) {
  gridBg();
  (o.regions || []).forEach(([s, x, y]) => text(s, x, y, 70, '#2c3238', { ui: true, ls: 8 }));
  if (o.coast) { g.fillStyle = '#141b22'; g.beginPath(); g.moveTo(0, 0); g.lineTo(560, 0); for (let y = 0; y <= H; y += 80) g.lineTo(560 + Math.sin(y * 0.01) * 60, y); g.lineTo(0, H); g.fill(); text('САН-ФРАНЦИСКО', 270, 760, 40, '#5a6670', { ui: true }); }
  const p = popIn(t, t0 + 0.4, 0.4);
  if (o.from) { const q = eout(prog(t, t0 + 0.6, t0 + 1.8)); g.save(); g.setLineDash([22, 14]); g.strokeStyle = C.a; g.lineWidth = 6; g.beginPath(); g.moveTo(o.x, o.y); g.lineTo(lerp(o.x, o.from[0], q), lerp(o.y, o.from[1], q)); g.stroke(); g.restore();
    if (q > 0.9) text(o.dist, (o.x + o.from[0]) / 2, (o.y + o.from[1]) / 2 - 50, 60, C.a, { ui: true, glow: 14 }); }
  if (p > 0) { g.save(); g.translate(o.x, o.y); g.scale(p, p); glow(0, 0, 120 + 30 * Math.sin(t * 5), 'rgba(240,179,58,.5)'); circ(0, 0, 18, C.t); g.restore();
    text(o.name, o.x, o.y - 70, 60, C.t, { ui: true, glow: 14 }); if (o.sub) text(o.sub, o.x, o.y + 80, 28, C.cy, { mono: true, ls: 2 }); }
}
function parchment(t, t0, year, caption, extra) {
  const pg = g.createLinearGradient(0, 0, 0, H); pg.addColorStop(0, '#2a2218'); pg.addColorStop(1, '#14100b'); g.fillStyle = pg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#d8c7a2'; rr(80, 280, 920, 980, 10); g.fill();
  for (let i = 0; i < 300; i++) circ(80 + rnd(i) * 920, 280 + rnd(i + 3) * 980, 1 + rnd(i + 5) * 2, 'rgba(90,70,40,.15)');
  const p = popIn(t, t0 + 0.2, 0.5);
  g.save(); g.globalAlpha = clamp(p); text(year, 540, 620, 200, '#7a2a1a', { ui: true }); g.restore();
  text(caption, 540, 800, 36, '#4a3a24', { ui: true });
  if (extra) extra();
}
function bars(t, a = 1) { g.save(); g.globalAlpha *= a; for (let i = 0; i < 12; i++) rect(40 + i * 92, 0, 16, H, '#1a1e22'); g.restore(); }
function cellPlan(t, t0, o) {
  rect(0, 0, W, H, '#0e1114');
  const x0 = 540 - o.w / 2, y0 = 420, w = o.w, h = o.h;
  rect(x0 - 20, y0 - 20, w + 40, h + 40, '#4a4f55'); rect(x0, y0, w, h, '#2a2e33');
  const items = o.items || [];
  items.forEach(([lab, x, y, iw, ih, col], k) => { const p = popIn(t, t0 + 0.6 + k * 0.25, 0.3); if (p <= 0) return;
    g.save(); g.translate(x0 + x + iw / 2, y0 + y + ih / 2); g.scale(p, p); g.fillStyle = col || '#8a9096'; rr(-iw / 2, -ih / 2, iw, ih, 8); g.fill(); text(lab, 0, 0, 22, '#111', { mono: true }); g.restore(); });
  const q = eout(prog(t, t0, t0 + 0.8));
  g.strokeStyle = C.t; g.lineWidth = 5; g.beginPath(); g.moveTo(x0, y0 - 50); g.lineTo(x0 + w * q, y0 - 50); g.moveTo(x0 - 50, y0); g.lineTo(x0 - 50, y0 + h * q); g.stroke();
  if (q > 0.9) { text(o.wl, x0 + w / 2, y0 - 85, 40, C.t, { ui: true }); g.save(); g.translate(x0 - 90, y0 + h / 2); g.rotate(-Math.PI / 2); text(o.hl, 0, 0, 40, C.t, { ui: true }); g.restore(); }
  if (o.window) { rect(x0 + w - 12, y0 + h / 2 - 90, 12, 180, '#bfe3ff'); glow(x0 + w, y0 + h / 2, 120, 'rgba(190,227,255,.4)'); }
}
function slitWindow(t, t0) {
  rect(0, 0, W, H, '#16191c');
  for (let i = 0; i < 40; i++) rect(rnd(i) * W, rnd(i + 3) * H, 80 + rnd(i) * 120, 3, 'rgba(255,255,255,.03)');
  const sx = 520, sw = 40, sy = 330, sh = 900;
  const sky = g.createLinearGradient(0, sy, 0, sy + sh); sky.addColorStop(0, '#9fd0ff'); sky.addColorStop(1, '#5d8fc4');
  g.fillStyle = sky; g.fillRect(sx, sy, sw, sh); glow(sx + sw / 2, sy + sh / 2, 500, 'rgba(160,210,255,.25)');
  const p = eout(prog(t, t0 + 0.4, t0 + 1.2));
  g.strokeStyle = C.t; g.lineWidth = 4; g.beginPath(); g.moveTo(sx - 30 * p, sy - 40); g.lineTo(sx + sw + 30 * p, sy - 40); g.stroke();
  if (p > 0.9) text('10 СМ', 540, sy - 90, 70, C.t, { ui: true, glow: 14 });
  text('ВИДНО ТОЛЬКО НЕБО', 540, sy + sh + 70, 34, C.cy, { mono: true, ls: 2 });
}
function clock23(t, t0) {
  rect(0, 0, W, H, '#0b0e11');
  const cx = 540, cy = 760, R = 300, p = ease(prog(t, t0 + 0.2, t0 + 2.2));
  g.lineWidth = 60; g.strokeStyle = '#1d2329'; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
  g.strokeStyle = C.r; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 23 / 24 * p); g.stroke();
  if (p > 0.99) { g.strokeStyle = C.g || '#72c94b'; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2 + Math.PI * 2 * 23 / 24, -Math.PI / 2 + Math.PI * 2); g.stroke(); }
  text(Math.round(23 * p) + ' Ч', cx, cy - 20, 160, C.r, { ui: true, glow: 20 }); text('В ОДИНОЧКЕ', cx, cy + 100, 36, C.cy, { mono: true, ls: 3 });
  if (p > 0.99) text('1 Ч — ПРОГУЛКА В КЛЕТКЕ', cx, cy + R + 110, 32, '#72c94b', { mono: true });
}
function doorSlot(t, t0) {
  rect(0, 0, W, H, '#14181c');
  rect(240, 300, 600, 1000, '#4a5058'); rect(260, 320, 560, 960, '#5a616a');
  for (let i = 0; i < 6; i++) circ(300 + i * 96, 360, 8, '#3a4048');
  rect(400, 760, 280, 70, '#1a1d20');
  const p = ease(prog(t, t0 + 0.3, t0 + 1.4));
  g.fillStyle = '#c8ccd2'; rr(420, 770, 240, 50, 6); g.fill(); g.save(); g.globalAlpha = p; rect(420 + 240 * p * 0, 770, 240, 50, 'rgba(0,0,0,0)'); g.restore();
  g.fillStyle = '#9aa0a6'; rr(lerp(420, 420, p), lerp(770, 860, p), 240, 40, 6); g.fill();
  circ(470, lerp(780, 870, p), 12, '#d9a07a'); circ(520, lerp(780, 870, p), 10, '#7a9a5a');
  stamp(t, t0 + 1.6, 'БЕЗ КОНТАКТА', 540, 1150, C.r, 54);
}
function swanPose(t, t0) {
  rect(0, 0, W, H, '#0d1013'); rect(0, 1150, W, 800, '#1b2024');
  for (let i = 0; i < 8; i++) { const x = (i * 220 - t * 60) % 1760; const xx = x < -200 ? x + 1760 : x; rect(xx, 420, 140, 600, '#1f242a'); }
  const k = ease(prog(t, t0 + 0.4, t0 + 1.6));
  prisoner(540, 1220, 1.9, t, { bend: k, walk: false });
  const s = prog(t, t0 + 2.2, t0 + 3);
  if (s > 0) { g.save(); g.globalAlpha = s * 0.9; g.translate(560, 760); g.fillStyle = '#f2f2f2';
    g.beginPath(); g.ellipse(0, 40, 170, 70, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(-60, 20); g.quadraticCurveTo(-260, -200, -60, -260); g.quadraticCurveTo(-120, -140, 40, -20); g.fill();
    g.beginPath(); g.moveTo(140, 10); g.quadraticCurveTo(250, -160, 190, -230); g.lineWidth = 28; g.strokeStyle = '#f2f2f2'; g.stroke(); circ(200, -235, 26, '#f2f2f2');
    g.fillStyle = '#ff8a2a'; g.beginPath(); g.moveTo(222, -240); g.lineTo(262, -228); g.lineTo(222, -222); g.fill(); g.restore(); }
}
function dossier(t, t0, name, lines, tag) {
  rect(0, 0, W, H, '#0e1114'); bars(t, 0.4);
  const p = eout(prog(t, t0, t0 + 0.5));
  g.save(); g.translate(lerp(-900, 0, p), 0);
  g.fillStyle = '#e9e4d6'; rr(110, 420, 860, 640, 20); g.fill();
  rect(110, 420, 860, 70, '#2a2d33'); text('ДЕЛО', 150, 456, 26, '#d0d0d0', { mono: true, align: 'left' });
  g.fillStyle = '#b8b2a0'; rr(150, 520, 300, 380, 12); g.fill(); circ(300, 660, 80, '#555'); g.fillStyle = '#555'; rr(190, 740, 220, 160, 60); g.fill(); text('?', 300, 660, 90, '#b8b2a0', { ui: true });
  text(name, 490, 580, 56, '#15171b', { ui: true, align: 'left' });
  lines.forEach((l, k) => text(l, 490, 650 + k * 50, 28, '#4a4538', { mono: true, align: 'left' }));
  g.restore();
  if (tag) stamp(t, t0 + 0.9, tag, 720, 980, C.r, 50, -0.1);
}
function showerScene(t, t0) {
  rect(0, 0, W, H, '#10161b');
  for (let r = 0; r < 14; r++) for (let c = 0; c < 9; c++) rect(c * 125 + 4, 300 + r * 70 + 4, 117, 62, '#1c2630');
  for (let k = 0; k < 3; k++) { const x = 260 + k * 280; rect(x - 6, 300, 12, 160, '#8a9096'); circ(x, 470, 34, '#8a9096');
    for (let i = 0; i < 26; i++) { const ph = (t * 1.4 + i / 26) % 1; circ(x + (rnd(i + k) - .5) * 80 * (0.4 + ph), 500 + ph * 700, 4, 'rgba(180,220,255,.7)'); }
    for (let i = 0; i < 6; i++) { const ph = (t * 0.25 + i / 6 + k * 0.1) % 1; glow(x + Math.sin(i + t) * 60, 1200 - ph * 800, 140, `rgba(240,240,240,${0.18 * (1 - ph)})`); } }
  const p = popIn(t, t0 + 0.6, 0.4);
  if (p > 0) { g.save(); g.translate(300, 1320); g.scale(p, p); g.fillStyle = 'rgba(10,12,14,.88)'; rr(-200, -80, 400, 160, 20); g.fill(); text('ДУШ +40°', 0, 0, 60, C.a, { ui: true }); g.restore(); }
  const q = popIn(t, t0 + 1.4, 0.4);
  if (q > 0) { g.save(); g.translate(780, 1320); g.scale(q, q); g.fillStyle = 'rgba(10,12,14,.88)'; rr(-200, -80, 400, 160, 20); g.fill(); text('ЗАЛИВ +12°', 0, 0, 60, '#8fdcff', { ui: true }); g.restore(); }
}
function escapeNight(t, t0, i0) {
  rect(0, 0, W, H, '#05080b');
  if (t < T[i0 + 1]) {
    rect(160, 400, 760, 900, '#1c2126'); rect(220, 900, 640, 260, '#3d434a');
    circ(320, 920, 70, '#d9a07a'); g.fillStyle = '#5a3a20'; g.beginPath(); g.arc(320, 905, 74, Math.PI, 0); g.fill(); rect(380, 900, 440, 150, '#8a9096');
    g.save(); g.globalCompositeOperation = 'lighter'; const fx = 320 + Math.sin(t * 1.5) * 60; const fl = g.createRadialGradient(fx, 920, 0, fx, 920, 300); fl.addColorStop(0, 'rgba(255,240,200,.35)'); fl.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = fl; g.fillRect(0, 0, W, H); g.restore();
    rect(700, 560, 160, 120, '#0a0c0e'); for (let i = 0; i < 6; i++) rect(706 + i * 26, 566, 8, 108, '#5a616a');
    stamp(t, t0 + 1.2, 'ГОЛОВА-МАНЕКЕН', 540, 1250, C.a, 48);
  } else {
    const sea = g.createLinearGradient(0, 0, 0, H); sea.addColorStop(0, '#05080c'); sea.addColorStop(1, '#0a1824'); g.fillStyle = sea; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 24; i++) rect(i * 46, 500 - rnd(i) * 80, 36, 80 + rnd(i) * 80, '#0b1016');
    for (let i = 0; i < 40; i++) if (rnd(i + 7) > 0.5) rect(rnd(i) * W, 480 - rnd(i + 2) * 60, 6, 8, '#ffd27a');
    for (let i = 0; i < 120; i++) { const y = 600 + rnd(i) * 1300, x = (rnd(i + 3) * 1300 + t * 60 * (1 + rnd(i))) % 1300 - 100; rect(x, y, 60 + rnd(i + 1) * 120, 3, 'rgba(140,180,210,.18)'); }
    const bob = Math.sin(t * 2) * 12; g.save(); g.translate(540, 1050 + bob); g.rotate(Math.sin(t * 1.3) * 0.06);
    g.fillStyle = '#4a3a24'; rr(-220, -40, 440, 80, 30); g.fill(); for (let k = 0; k < 3; k++) { circ(-120 + k * 120, -80, 26, '#1a1a1a'); g.fillStyle = '#1a1a1a'; rr(-145 + k * 120, -60, 50, 50, 14); g.fill(); }
    g.restore();
    for (let i = 0; i < 6; i++) { const x = (t * 30 + i * 240) % 1500 - 300; glow(x, 900 + i * 60, 300, 'rgba(160,180,200,.12)'); }
    if (t > T[i0 + 2]) stamp(t, T[i0 + 2] + 0.2, 'ТЕЛА НЕ НАЙДЕНЫ', 540, 700, C.r, 54);
  }
}
