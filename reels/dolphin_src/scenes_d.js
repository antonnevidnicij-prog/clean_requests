// ---------- BLACK DOLPHIN scenes ----------
function prisoner(x, y, s, t, opt = {}) {
  g.save(); g.translate(x, y); g.scale(s * (opt.flip ? -1 : 1), s);
  const bend = opt.bend || 0, walk = opt.walk ? Math.sin(t * 7 + (opt.ph || 0)) : 0;
  g.fillStyle = '#1b1d20';
  g.save(); g.translate(-10, -90); g.rotate(walk * 0.35); rr(-9, 0, 18, 90, 7); g.fill(); g.restore();
  g.save(); g.translate(10, -90); g.rotate(-walk * 0.35); rr(-9, 0, 18, 90, 7); g.fill(); g.restore();
  g.save(); g.translate(0, -90); g.rotate(bend * 1.25);
  g.fillStyle = '#2b2f33'; rr(-30, -120, 60, 125, 18); g.fill();
  for (let k = 0; k < 5; k++) rect(-30, -110 + k * 24, 60, 8, '#9aa0a6');
  circ(0, -150, 28, '#d9a07a'); g.fillStyle = '#2b2f33'; g.beginPath(); g.arc(0, -160, 29, Math.PI, 0); g.fill();
  if (bend) { g.save(); g.translate(-10, -105); g.rotate(-2.3); g.fillStyle = '#2b2f33'; rr(-8, 0, 16, 80, 8); g.fill(); circ(0, 86, 11, '#d9a07a'); g.restore();
    g.strokeStyle = '#c8ccd2'; g.lineWidth = 4; g.beginPath(); g.arc(-58, -150, 10, 0, Math.PI * 2); g.stroke(); }
  else { g.fillStyle = '#2b2f33'; rr(-44, -112, 14, 80, 7); g.fill(); rr(30, -112, 14, 80, 7); g.fill(); }
  g.restore(); g.restore();
}
function guard(x, y, s, t, ph) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const walk = Math.sin(t * 7 + ph);
  g.fillStyle = '#20283a';
  g.save(); g.translate(-10, -90); g.rotate(walk * 0.35); rr(-9, 0, 18, 90, 7); g.fill(); g.restore();
  g.save(); g.translate(10, -90); g.rotate(-walk * 0.35); rr(-9, 0, 18, 90, 7); g.fill(); g.restore();
  g.fillStyle = '#2f3d5a'; rr(-32, -215, 64, 130, 18); g.fill(); rect(-32, -150, 64, 10, '#1a2236');
  circ(0, -240, 28, '#d9a07a'); g.fillStyle = '#1a2236'; g.beginPath(); g.ellipse(0, -262, 36, 12, 0, 0, Math.PI * 2); g.fill(); rect(-24, -268, 48, 12, '#1a2236');
  g.restore();
}
function dog(x, y, s, t) {
  g.save(); g.translate(x, y); g.scale(s, s); const w = Math.sin(t * 10);
  g.fillStyle = '#3a2b1c'; rr(-60, -60, 110, 40, 20); g.fill(); circ(60, -70, 22, '#3a2b1c');
  g.beginPath(); g.moveTo(52, -90); g.lineTo(60, -112); g.lineTo(70, -88); g.fill(); rr(72, -72, 26, 14, 6); g.fill();
  for (const [lx, d] of [[-50, 1], [-30, -1], [25, 1], [40, -1]]) { g.save(); g.translate(lx, -25); g.rotate(w * 0.4 * d); rr(-5, 0, 10, 28, 4); g.fill(); g.restore(); }
  g.restore();
}
function prisonAerial(t) {
  const sky = g.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, '#05070a'); sky.addColorStop(1, '#1b2128');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 50; i++) circ(rnd(i) * W, rnd(i + 9) * 500, rnd(i + 3) * 2 + .4, 'rgba(255,255,255,.5)');
  rect(0, 820, W, 1100, '#1d2226');
  g.save(); g.translate(540, 1130); g.scale(1, 0.55);
  g.strokeStyle = '#4a5058'; g.lineWidth = 30; g.strokeRect(-430, -420, 860, 840);
  g.strokeStyle = '#2f3439'; g.lineWidth = 12; g.strokeRect(-470, -460, 940, 920);
  for (const [x, y, w, h] of [[-300, -250, 260, 180], [40, -250, 260, 180], [-300, 80, 600, 160]]) { g.fillStyle = '#353b42'; g.fillRect(x, y, w, h); for (let k = 0; k < w; k += 40) rect(x + k + 10, y + 20, 18, 30, rnd(k + x) > 0.4 ? '#ffd27a' : '#20252a'); }
  g.restore();
  for (const [x, y] of [[110, 900], [970, 900], [60, 1370], [1020, 1370]]) {
    rect(x - 14, y - 150, 28, 150, '#2a2f34'); rect(x - 40, y - 190, 80, 50, '#3a4048');
    const a = Math.sin(t * 0.9 + x) * 0.9 + (x < 540 ? 0.6 : 2.5);
    g.save(); g.translate(x, y - 170); g.rotate(a); const lg = g.createLinearGradient(0, 0, 900, 0); lg.addColorStop(0, 'rgba(255,240,190,.4)'); lg.addColorStop(1, 'rgba(255,240,190,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(0, 0); g.lineTo(900, -110); g.lineTo(900, 110); g.fill(); g.restore();
    circ(x, y - 170, 10, '#fff4cc');
  }
  for (let i = 0; i < 160; i++) { const x = (rnd(i) * 1300 + t * 40 * (0.5 + rnd(i + 2))) % 1300 - 100, y = (rnd(i + 5) * 2000 + t * 120 * (0.5 + rnd(i + 7))) % 2000; rect(x, y, 3, 3, 'rgba(230,235,240,.6)'); }
}
function mapShot(t, i0) {
  rect(0, 0, W, H, '#0b0e11');
  g.strokeStyle = 'rgba(240,179,58,.08)'; g.lineWidth = 2;
  for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  text('РОССИЯ', 360, 520, 80, '#2c3238', { ui: true, ls: 10 }); text('КАЗАХСТАН', 640, 1180, 80, '#2c3238', { ui: true, ls: 10 });
  const p = eout(prog(t, T[i0], T[i0] + 1.6));
  g.save(); g.setLineDash([26, 14]); g.strokeStyle = C.r; g.lineWidth = 6; g.beginPath();
  for (let k = 0; k <= 60 * p; k++) { const x = k / 60 * W, y = 860 + Math.sin(k * 0.5) * 30 + Math.sin(k * 0.13) * 60; k ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.restore();
  circ(330, 700, 10, '#6f777f'); text('Оренбург', 350, 700, 30, '#6f777f', { align: 'left' });
  const pin = eback(prog(t, T[i0] + 0.8, T[i0] + 1.2));
  if (pin > 0) { g.save(); g.translate(520, 790); g.scale(pin, pin); glow(0, 0, 120 + 30 * Math.sin(t * 5), 'rgba(240,179,58,.5)'); circ(0, 0, 18, C.t); g.restore();
    text('СОЛЬ-ИЛЕЦК', 520, 720, 54, C.t, { ui: true, glow: 14 }); text('ГРАНИЦА В ~7 КМ', 520, 960, 28, C.r, { mono: true, ls: 2 }); }
}
function cellsCount(t, i0) {
  rect(0, 0, W, H, '#0d1013');
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    const x = 90 + c * 160, y = 330 + r * 170;
    rect(x, y, 140, 150, '#2a2f34'); rect(x + 10, y + 10, 120, 130, '#3a4047'); rect(x + 50, y + 40, 40, 14, '#1a1d20');
    circ(x + 115, y + 80, 6, rnd(r * 6 + c + Math.floor(t * 2)) > 0.5 ? C.t : '#4a4f55');
  }
  const n = Math.floor(lerp(0, 700, ease(prog(t, T[i0], T[i0] + 1.6))));
  g.fillStyle = 'rgba(10,12,14,.85)'; rr(190, 560, 700, 260, 24); g.fill(); g.strokeStyle = C.t; g.lineWidth = 5; g.stroke();
  text('~' + n, 540, 660, 150, C.t, { ui: true, glow: 18 }); text('ЗАКЛЮЧЁННЫХ · ПОЧТИ ВСЕ — ПОЖИЗНЕННО', 540, 770, 26, C.cy, { mono: true });
  ['УБИЙЦЫ', 'ТЕРРОРИСТЫ', 'ЛЮДОЕДЫ'].forEach((w, k) => {
    const tk = T[i0 + 1] + 0.15 + k * 0.55; const p = eback(prog(t, tk, tk + 0.25)); if (p <= 0) return;
    g.save(); g.translate(540, 980 + k * 120); g.rotate((k - 1) * 0.05); g.scale(lerp(2.2, 1, p), lerp(2.2, 1, p)); g.globalAlpha = clamp(p * 2);
    g.strokeStyle = C.r; g.lineWidth = 7; rr(-260, -48, 520, 96, 12); g.stroke(); text(w, 0, 4, 64, C.r, { ui: true }); g.restore();
  });
}
function history(t, i0) {
  const pg = g.createLinearGradient(0, 0, 0, H); pg.addColorStop(0, '#2a2218'); pg.addColorStop(1, '#14100b'); g.fillStyle = pg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#d8c7a2'; rr(80, 280, 920, 980, 10); g.fill();
  for (let i = 0; i < 300; i++) circ(80 + rnd(i) * 920, 280 + rnd(i + 3) * 980, 1 + rnd(i + 5) * 2, 'rgba(90,70,40,.15)');
  g.strokeStyle = '#4a3a24'; g.lineWidth = 6;
  g.save(); g.translate(540, 640); g.beginPath();
  for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 - Math.PI / 2, b = a + Math.PI / 5; g.lineTo(Math.cos(a) * 230, Math.sin(a) * 230); g.lineTo(Math.cos(b) * 140, Math.sin(b) * 140); }
  g.closePath(); g.stroke(); rect(-40, -40, 80, 80, 'rgba(74,58,36,.4)'); g.restore();
  text('КРЕПОСТЬ ИЛЕЦКАЯ ЗАЩИТА', 540, 350, 34, '#4a3a24', { ui: true });
  text('1773', 540, 950, 120, '#7a2a1a', { ui: true });
  if (t > T[i0 + 1]) {
    for (let k = 0; k < 4; k++) { const x = ((t - T[i0 + 1]) * 70 + k * 160) % 900 + 90; prisoner(x, 1230, 0.75, t, { walk: true, ph: k }); g.fillStyle = '#efe8da'; rr(x - 30, 1040, 60, 40, 10); g.fill(); }
    const p = eback(prog(t, T[i0 + 1] + 1.6, T[i0 + 1] + 2));
    if (p > 0) { g.save(); g.translate(540, 1110); g.rotate(-0.08); g.scale(p, p); g.strokeStyle = '#8a1a10'; g.lineWidth = 8; rr(-280, -50, 560, 100, 10); g.stroke(); text('НАЗАД ПУТИ НЕТ', 0, 4, 54, '#8a1a10', { ui: true }); g.restore(); }
  }
}
function fountain(t) {
  rect(0, 0, W, H, '#14181c'); rect(0, 1050, W, 900, '#22272c');
  for (let i = 0; i < 6; i++) rect(i * 190, 300, 150, 520, '#1b1f23');
  g.fillStyle = '#3a4047'; g.beginPath(); g.ellipse(540, 1080, 380, 90, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#25506a'; g.beginPath(); g.ellipse(540, 1070, 340, 70, 0, 0, Math.PI * 2); g.fill();
  rect(520, 860, 40, 210, '#3a4047');
  g.save(); g.translate(540, 820); g.rotate(-0.3);
  g.fillStyle = '#0a0b0d'; g.beginPath(); g.ellipse(0, 0, 150, 60, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(-140, 0); g.lineTo(-230, -60); g.lineTo(-210, 50); g.fill();
  g.beginPath(); g.moveTo(-10, -50); g.lineTo(40, -120); g.lineTo(60, -45); g.fill();
  g.beginPath(); g.moveTo(140, -10); g.lineTo(220, 0); g.lineTo(140, 20); g.fill();
  circ(95, -10, 7, '#3a4047'); g.restore();
  for (let k = 0; k < 40; k++) { const ph = (t * 0.9 + k / 40) % 1, x = 740 + ph * 160 * Math.cos(k), y = 790 - Math.sin(ph * Math.PI) * 170 + ph * 260; circ(x, y, 4, 'rgba(160,210,240,.8)'); }
  text('ФОНТАН ПОСТРОИЛИ ЗАКЛЮЧЁННЫЕ', 540, 1300, 32, C.cy, { mono: true });
}
function cellBox(t, mode, i0) {
  rect(0, 0, W, H, '#0e1114');
  const x0 = 200, y0 = 360, w = 680, h = 860;
  rect(x0, y0, w, h, '#2a2e33');
  g.strokeStyle = '#7d848c'; g.lineWidth = 8;
  for (let x = x0 + 30; x < x0 + w; x += 52) { g.beginPath(); g.moveTo(x, y0 + 30); g.lineTo(x, y0 + 200); g.stroke(); }
  g.beginPath(); g.moveTo(x0 + 30, y0 + 200); g.lineTo(x0 + w - 30, y0 + 200); g.stroke();
  rect(x0 + 40, y0 + 380, 230, 420, '#3d434a'); rect(x0 + 40, y0 + 380, 230, 60, '#c8ccd2');
  rect(x0 + 420, y0 + 380, 230, 420, '#3d434a'); rect(x0 + 420, y0 + 380, 230, 60, '#c8ccd2');
  const lampOn = 1; glow(540, y0 + 60, 380, `rgba(255,240,190,${0.35 * lampOn})`); rect(500, y0 + 40, 80, 24, '#fff4cc');
  if (mode === 'size') {
    const p = eout(prog(t, T[i0], T[i0] + 0.8));
    g.strokeStyle = C.t; g.lineWidth = 5; g.beginPath(); g.moveTo(x0, y0 - 40); g.lineTo(x0 + w * p, y0 - 40); g.stroke();
    g.beginPath(); g.moveTo(x0 - 40, y0); g.lineTo(x0 - 40, y0 + h * p); g.stroke();
    if (p > 0.9) { g.fillStyle = 'rgba(10,12,14,.85)'; rr(330, 660, 420, 170, 20); g.fill(); text('4,5 М²', 540, 745, 110, C.t, { ui: true, glow: 18 }); }
    if (t > T[i0] + 1.6) text('КЛЕТКА ВНУТРИ КЛЕТКИ', 540, 1290, 36, C.cy, { mono: true, ls: 2 });
  }
  if (mode === 'light') {
    glow(540, y0 + 60, 600, 'rgba(255,240,190,.25)');
    const ph = (t * 1.3) % 1, open = ph > 0.75;
    g.fillStyle = '#121518'; rr(470, y0 + 250, 140, 60, 10); g.fill(); if (open) { circ(540, y0 + 280, 22, '#e8e2dc'); circ(540, y0 + 280, 10, '#111'); }
    g.fillStyle = 'rgba(10,12,14,.85)'; rr(300, 640, 480, 200, 20); g.fill();
    text('СВЕТ 24/7', 540, 700, 72, C.t, { ui: true, glow: 16 });
    const left = 15 * 60 - Math.floor(((t - T[i0]) * 120) % (15 * 60));
    text('ПРОВЕРКА ЧЕРЕЗ ' + String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'), 540, 790, 34, C.r, { mono: true });
  }
  if (mode === 'bed') {
    const hrs = lerp(6, 22, prog(t, T[i0] + 0.3, (T[i0 + 1] || END) - 0.3));
    g.fillStyle = 'rgba(10,12,14,.88)'; rr(300, 600, 480, 220, 20); g.fill();
    text(String(Math.floor(hrs)).padStart(2, '0') + ':00', 540, 690, 110, C.w, { ui: true });
    text('КОЙКА ЗАПРЕЩЕНА', 540, 780, 30, C.r, { mono: true, ls: 2 });
    for (const bx of [x0 + 155, x0 + 535]) { g.strokeStyle = C.r; g.lineWidth = 10; g.beginPath(); g.moveTo(bx - 80, y0 + 470); g.lineTo(bx + 80, y0 + 720); g.moveTo(bx + 80, y0 + 470); g.lineTo(bx - 80, y0 + 720); g.stroke(); }
    prisoner(540, 1180, 1.3, t);
  }
  if (mode === 'silence') {
    prisoner(380, 1180, 1.2, t); prisoner(700, 1180, 1.2, t, { flip: true });
    g.fillStyle = '#e8e2dc'; rr(420, 560, 240, 120, 40); g.fill(); text('...', 540, 610, 70, '#111');
    g.strokeStyle = C.r; g.lineWidth = 12; g.beginPath(); g.arc(540, 620, 110, 0, Math.PI * 2); g.moveTo(462, 542); g.lineTo(618, 698); g.stroke();
  }
}
function yard(t, i0) {
  rect(0, 0, W, H, '#14181c');
  rect(140, 340, 800, 960, '#4a4f55'); rect(180, 380, 720, 880, '#2a2e33');
  prisoner(540 + Math.sin(t * 0.8) * 200, 1150, 1.2, t, { walk: true });
  g.strokeStyle = '#8a9198'; g.lineWidth = 7;
  for (let x = 180; x <= 900; x += 60) { g.beginPath(); g.moveTo(x, 380); g.lineTo(x, 1260); g.stroke(); }
  for (let y = 380; y <= 1260; y += 60) { g.beginPath(); g.moveTo(180, y); g.lineTo(900, y); g.stroke(); }
  const left = Math.max(0, 90 * 60 - Math.floor((t - T[i0]) * 400));
  g.fillStyle = 'rgba(10,12,14,.85)'; rr(330, 230, 420, 120, 18); g.fill();
  text(String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'), 540, 292, 80, C.t, { ui: true, glow: 14 });
  text('ВМЕСТО НЕБА — РЕШЁТКА', 540, 1340, 32, C.cy, { mono: true, ls: 2 });
}
function convoy(t, i0) {
  rect(0, 0, W, H, '#101316'); rect(0, 1150, W, 800, '#1d2226'); rect(0, 1150, W, 8, '#3a4048');
  for (let i = 0; i < 8; i++) { const x = (i * 220 - t * 90) % 1760; const xx = x < -200 ? x + 1760 : x; rect(xx, 420, 140, 600, '#22272c'); glow(xx + 70, 400, 120, 'rgba(255,240,190,.2)'); }
  const x = 520;
  guard(x - 260, 1200, 1.4, t, 0); prisoner(x, 1200, 1.4, t, { bend: 1, walk: true });
  if (t > T[i0 + 1]) { guard(x + 230, 1200, 1.4, t, 1); guard(x - 430, 1220, 1.2, t, 2); dog(x + 400, 1215, 1.4, t); }
  const p = eback(prog(t, T[i0 + 1], T[i0 + 1] + 0.4));
  if (p > 0) { g.save(); g.translate(540, 380); g.scale(p, p); g.strokeStyle = C.t; g.lineWidth = 5; rr(-330, -55, 660, 110, 14); g.stroke(); text('3 КОНВОИРА + СОБАКА', 0, 4, 50, C.t, { ui: true }); g.restore(); }
}
function escape(t, i0) {
  rect(0, 0, W, H, '#0b0e11');
  g.strokeStyle = 'rgba(240,179,58,.08)'; g.lineWidth = 2;
  for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  const a = [300, 1080], b = [760, 520];
  circ(a[0], a[1], 14, C.t); text('УЧАСТОК КОЛОНИИ-ПОСЕЛЕНИЯ', a[0], a[1] + 60, 26, C.cy, { mono: true });
  const p = ease(prog(t, T[i0] + 0.5, T[i0] + 3));
  g.save(); g.setLineDash([20, 14]); g.strokeStyle = C.r; g.lineWidth = 6; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(700, 1000, lerp(a[0], b[0], p), lerp(a[1], b[1], p)); g.stroke(); g.restore();
  text('22.10.2016', a[0], a[1] - 60, 40, C.r, { ui: true });
  if (p > 0.95) { circ(b[0], b[1], 14, C.r); text('БУЗУЛУК', b[0], b[1] - 50, 40, C.w, { ui: true });
    const q = eback(prog(t, T[i0] + 3, T[i0] + 3.3)); g.save(); g.translate(b[0], b[1] + 90); g.rotate(-0.08); g.scale(q, q); g.strokeStyle = C.r; g.lineWidth = 7; rr(-200, -45, 400, 90, 10); g.stroke(); text('ЗАДЕРЖАН', 0, 4, 52, C.r, { ui: true }); g.restore(); }
  if (t > T[i0 + 1]) {
    g.save(); g.globalAlpha = 0.85; rect(0, 0, W, H, '#0b0e11'); g.restore();
    const q = eback(prog(t, T[i0 + 1], T[i0 + 1] + 0.4)); g.save(); g.translate(540, 760); g.scale(q, q);
    text('ПОБЕГОВ', 0, -150, 60, C.cy, { ui: true }); text('ИЗ ОСНОВНОЙ ЗОНЫ', 0, -90, 34, C.mute, { mono: true }); text('0', 0, 90, 300, C.t, { ui: true, glow: 30 }); g.restore();
  }
}
