// ---------- episode 2 scenes ----------
function trainFace(t, lightsOn) {
  g.fillStyle = '#17252b'; rr(270, 430, 540, 760, 60); g.fill();
  g.fillStyle = '#0a1316'; rr(320, 500, 440, 260, 30); g.fill();
  const on = lightsOn * (rnd(Math.floor(t * 12)) > 0.08 ? 1 : 0.3);
  for (const x of [360, 720]) { circ(x, 1000, 34, on > 0.1 ? '#f4fdff' : '#1d2a2e'); if (on > 0.1) glow(x, 1000, 220, 'rgba(230,250,255,.55)', on); }
  rect(300, 1100, 480, 30, '#0e1a1e'); text('7', 540, 860, 70, '#2a4a52', { ui: true });
}
function palm(x, y, s, a) {
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#d9b49a';
  rr(-40, -30, 80, 90, 30); g.fill(); for (let k = 0; k < 4; k++) { rr(-38 + k * 20, -86 + Math.abs(k - 1.5) * 8, 16, 62, 8); g.fill(); }
  rr(36, -10, 22, 50, 10); g.fill(); g.restore();
}
const KN = []; { let x = T[0] + 0.15; while (x < T[3] - 0.2) { KN.push(x); x += 0.38 + rnd(x * 10) * 0.45; } }
function knock(t, i0) {
  rect(0, 0, W, H, '#03080a');
  g.save(); g.translate(540, 760);
  for (let i = 10; i > 0; i--) { const c = 6 + i * 2.2; g.fillStyle = `rgb(${c},${c + 4},${c + 6})`; g.beginPath(); g.arc(0, 0, i * 75, 0, Math.PI * 2); g.fill(); }
  g.restore();
  const off = prog(t, T[3], T[3] + 1.2);
  trainFace(t, 1 - off);
  // hands on windshield
  KN.forEach((k, i) => { if (t > k) { const a = Math.exp(-(t - k) * 0.6) * (1 - off); palm(350 + rnd(i) * 380, 560 + rnd(i + 3) * 160, 0.9 + rnd(i + 7) * 0.4, a * 0.85); } });
  // grate
  for (let i = 0; i < 12; i++) {
    let fl = 0; for (const k of KN) if (t > k) fl = Math.max(fl, Math.exp(-(t - k) * 10) * (Math.floor(rnd(k * 7) * 12) === i ? 1 : 0));
    rect(60 + i * 88, 240, 18, 1300, fl > 0.05 ? `rgb(${60 + fl * 160},${80 + fl * 120},${90 + fl * 100})` : '#22363c');
  }
  rect(30, 240, 1020, 26, '#22363c'); rect(30, 1300, 1020, 26, '#22363c');
  if (off > 0) { g.save(); g.globalAlpha = off * 0.6; rect(0, 0, W, H, '#000'); g.restore(); }
}
function recap(t, i0) {
  blurBg(() => knock(t, 0));
  const p = eback(prog(t, T[i0], T[i0] + 0.4));
  g.save(); g.globalAlpha = clamp(p * 2);
  text('ВЫ ВЫБРАЛИ', 540, 470, 90, C.w, { ui: true, ls: 4 });
  text('ИТОГ ГОЛОСОВАНИЯ · ЧАСТЬ 1', 540, 550, 26, C.t, { mono: true, ls: 3 });
  g.restore();
  [['А', 'ОТКРЫТЬ ТОННЕЛЬ', 0], ['Б', 'ОСТАВИТЬ ЗАКРЫТЫМ', 1]].forEach(([L, lab, k]) => {
    const pc = eback(prog(t, T[i0] + 0.2 + k * 0.15, T[i0] + 0.6 + k * 0.15)); if (pc <= 0) return;
    g.save(); g.translate(540, 760 + k * 200); g.scale(pc, pc); g.globalAlpha = k ? 1 : 0.35;
    g.shadowColor = k ? C.t : 'transparent'; g.shadowBlur = 40;
    g.fillStyle = k ? '#0f3a3a' : '#0d1f25'; rr(-440, -80, 880, 160, 26); g.fill(); g.shadowBlur = 0;
    g.lineWidth = 5; g.strokeStyle = k ? C.t : '#2a4b55'; g.stroke();
    circ(-360, 0, 50, k ? C.t : '#173039'); text(L, -360, 4, 56, k ? '#04100f' : C.w, { ui: true });
    text(lab, -280, 4, 50, C.w, { ui: true, align: 'left' }); g.restore();
  });
}
function tcam(t, i0) {
  cam(0, 0, W, H, 'КАМ 7 · ТОННЕЛЬ I', t, (w, h) => {
    rect(0, 0, w, h, '#0a1517');
    g.fillStyle = '#0f1e21'; g.beginPath(); g.moveTo(0, 300); g.lineTo(w, 450); g.lineTo(w, 1300); g.lineTo(0, 1500); g.fill();
    // train side
    g.save(); g.transform(1, 0.12, 0, 1, 0, 0);
    rect(-40, 560, 1200, 520, '#1c3036'); rect(-40, 940, 1200, 30, '#13252a');
    const fl = rnd(Math.floor(t * 9)) > 0.12 ? 1 : 0.35;
    for (let d = 0; d < 3; d++) {
      const x = 80 + d * 360;
      g.fillStyle = `rgba(190,240,235,${0.75 * fl})`; g.fillRect(x, 620, 170, 420);
      rect(x + 80, 620, 10, 420, '#4a6a70');
      rect(x + 10, 900, 150, 60, '#2a4a50');
      glow(x + 85, 800, 260, `rgba(160,240,230,${0.25 * fl})`);
      rect(x - 60, 620, 60, 420, '#132429'); rect(x + 170, 620, 60, 420, '#132429');
    }
    g.restore();
    g.strokeStyle = '#2a3e42'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 1380); g.lineTo(w, 1200); g.moveTo(0, 1460); g.lineTo(w, 1260); g.stroke();
    text('07:40:' + String(Math.floor((t * 3) % 60)).padStart(2, '0'), w - 30, h - 560, 30, C.cy, { mono: true, align: 'right' });
  }, false);
}
function bubble(x, y, s, col, t, t0, side) {
  const p = eback(prog(t, t0, t0 + 0.3)); if (p <= 0) return;
  g.save(); g.font = '800 46px Inter'; const w = g.measureText(s).width + 70;
  g.translate(side ? x - w : x, y); g.scale(p, p); g.globalAlpha = clamp(p * 2);
  g.fillStyle = col; rr(0, -44, w, 88, 30); g.fill();
  g.fillStyle = '#071115'; g.textBaseline = 'middle'; g.fillText(s, 35, 2);
  g.restore();
}
function rumor(t, i0) {
  rect(0, 0, W, H, '#050c0f');
  g.fillStyle = '#0b1a1f'; rr(60, 250, 960, 1120, 30); g.fill();
  rect(60, 250, 960, 110, '#10252b');
  text('ЧАТ «ГЛУБОКАЯ · ЖИВЫЕ»', 110, 290, 34, C.w, { ui: true, align: 'left' });
  text(fmt(lerp(312, 2041, prog(t, T[i0], T[i0 + 2]))) + ' участников', 110, 332, 24, C.mute, { mono: true, align: 'left' });
  const msgs = ['она не открыла поезд', 'там были дети!!', 'я слышал, как стучали', 'кто дал ей право?', 'она решает за нас', 'сколько ещё молчать?', 'идём к посту'];
  const t0 = T[i0], span = (T[i0 + 2] - T[i0]);
  const shown = msgs.filter((m, k) => t > t0 + k * span / msgs.length).length;
  const scroll = Math.max(0, shown - 6) * 140 * 0 + Math.max(0, (shown - 6)) * 140;
  g.save(); g.beginPath(); g.rect(60, 360, 960, 1010); g.clip();
  msgs.forEach((m, k) => {
    const tk = t0 + k * span / msgs.length, y = 460 + k * 140 - scroll;
    const side = k % 2;
    circ(side ? 960 : 120, y, 34, ['#5c7f8c', '#8c6f5c', '#6f5c8c', '#8c5c6a'][k % 4]);
    bubble(side ? 910 : 170, y, m, k === msgs.length - 1 || k === 4 ? '#ff8a80' : '#d8eef0', t, tk, side);
  });
  g.restore();
}
function man(x, y, s, t, opt = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#23282d'; rr(-120, -330, 240, 340, 60); g.fill();
  rect(-30, -330, 60, 120, '#1a1e22');
  if (opt.fist) { g.save(); g.translate(110, -300); g.rotate(-2.4 + Math.sin(t * 6) * 0.15); g.fillStyle = '#23282d'; rr(-28, 0, 56, 200, 26); g.fill(); circ(0, 210, 36, '#c98a62'); g.restore(); }
  rect(-34, -380, 68, 60, '#b97c56');
  circ(0, -440, 90, '#c98a62');
  g.fillStyle = 'rgba(40,30,25,.35)'; g.beginPath(); g.arc(0, -420, 88, 0.15 * Math.PI, 0.85 * Math.PI); g.fill();
  g.strokeStyle = '#2a1d16'; g.lineWidth = 10; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-55, -480); g.lineTo(-15, -466); g.moveTo(55, -480); g.lineTo(15, -466); g.stroke();
  circ(-32, -446, 8, '#141414'); circ(32, -446, 8, '#141414');
  const mo = opt.talk ? 6 + 14 * Math.abs(Math.sin(t * 11)) : 4;
  g.fillStyle = '#4a1f18'; rr(-26, -392 - mo / 2, 52, mo, 6); g.fill();
  g.strokeStyle = '#8e5a40'; g.lineWidth = 5; g.beginPath(); g.moveTo(52, -470); g.lineTo(62, -425); g.stroke();
  g.restore();
}
function krylov(t, i0) {
  if (t < T[i0 + 1]) {
    blurBg(() => crowdShot(t));
    const p = eout(prog(t, T[i0], T[i0] + 0.5));
    g.save(); g.translate(lerp(-900, 0, p), 0);
    g.fillStyle = '#e9e4d6'; rr(110, 380, 860, 720, 20); g.fill();
    rect(110, 380, 860, 70, '#2a2d33'); text('ДОСЬЕ · ЖИТЕЛЬ СТАНЦИИ', 150, 416, 26, '#d0d0d0', { mono: true, align: 'left' });
    g.save(); g.beginPath(); g.rect(150, 480, 360, 440); g.clip(); rect(150, 480, 360, 440, '#b8b2a0'); man(330, 1060, 0.95, t); g.restore();
    text('КРЫЛОВ', 545, 540, 72, '#15171b', { ui: true, align: 'left' });
    text('АНДРЕЙ ВИКТОРОВИЧ', 545, 600, 28, '#4a4538', { mono: true, align: 'left' });
    text('44 ГОДА', 545, 670, 30, '#15171b', { mono: true, align: 'left' });
    text('БЫВШИЙ ПОЛИЦЕЙСКИЙ', 545, 715, 30, '#15171b', { mono: true, align: 'left' });
    text('СТОРОННИКОВ: ' + Math.floor(lerp(3, 140, prog(t, T[i0] + 0.5, T[i0 + 1]))), 545, 790, 30, '#b0201c', { mono: true, align: 'left' });
    g.restore();
    const ps = eback(prog(t, T[i0] + 0.9, T[i0] + 1.2));
    if (ps > 0) { g.save(); g.translate(760, 990); g.rotate(-0.12); g.scale(lerp(2, 1, ps), lerp(2, 1, ps)); g.globalAlpha = clamp(ps * 2);
      g.strokeStyle = C.r; g.lineWidth = 8; rr(-170, -50, 340, 100, 12); g.stroke(); text('УГРОЗА', 0, 4, 56, C.r, { ui: true }); g.restore(); }
  } else {
    rect(0, 0, W, H, '#140a0b'); glow(540, 500, 700, 'rgba(255,80,50,.25)');
    man(540, 1250, 1.45, t, { talk: true, fist: true });
    for (let i = 0; i < 26; i++) { const x = rnd(i) * W, y = 1260 + rnd(i + 5) * 300; g.fillStyle = '#07090a'; circ(x, y - 90, 60, '#07090a'); rr(x - 70, y - 40, 140, 400, 40); g.fill();
      if (i % 3 === 0) { g.save(); g.translate(x + 30, y - 60); g.rotate(-0.3 + Math.sin(t * 7 + i) * 0.25); rr(-14, -170, 28, 170, 14); g.fill(); circ(0, -175, 22, '#07090a'); g.restore(); } }
  }
}
const MOBHITS = [];
function mobHits() { if (MOBHITS.length) return; let x = T[17] + 0.15; while (x < T[18] - 0.1) { MOBHITS.push(x); x += 0.32 + rnd(x * 13) * 0.35; } }
function crack(x, y, s, a) {
  g.save(); g.globalAlpha *= a; g.strokeStyle = 'rgba(220,250,255,.75)'; g.lineWidth = 3; g.translate(x, y);
  for (let k = 0; k < 9; k++) { const ang = k / 9 * Math.PI * 2 + rnd(x + k); let px = 0, py = 0; g.beginPath(); g.moveTo(0, 0);
    for (let j = 1; j < 5; j++) { px += Math.cos(ang + (rnd(k * 9 + j + x) - .5) * 0.6) * s * 40; py += Math.sin(ang + (rnd(k * 7 + j + y) - .5) * 0.6) * s * 40; g.lineTo(px, py); } g.stroke(); }
  g.beginPath(); g.arc(0, 0, s * 30, 0, Math.PI * 2); g.stroke(); g.restore();
}
function glassView(t, inner, cracks) {
  rect(0, 0, W, H, '#05090b');
  inner();
  g.fillStyle = 'rgba(140,220,230,.05)'; g.fillRect(70, 260, 940, 1150);
  g.save(); g.globalAlpha = 0.06; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(140, 260); g.lineTo(300, 260); g.lineTo(80, 1410); g.lineTo(-80, 1410); g.fill(); g.restore();
  cracks();
  g.strokeStyle = '#1c343c'; g.lineWidth = 60; g.strokeRect(40, 230, 1000, 1210);
}
function mob(t, i0, leaving) {
  mobHits();
  glassView(t, () => {
    rect(70, 260, 940, 1150, leaving ? '#0b1418' : '#1a0e0b'); glow(540, 400, 700, leaving ? 'rgba(80,160,180,.2)' : 'rgba(255,140,60,.35)');
    const k = leaving ? eout(prog(t, T[i0], T[i0 + 1])) : 0;
    for (let i = 0; i < 20; i++) {
      const x = 120 + rnd(i + 40) * 840, s = lerp(4.2, 1.6, k * (0.6 + rnd(i) * 0.4)), y = lerp(1700, 1050, k * (0.6 + rnd(i) * 0.4));
      g.save(); g.globalAlpha = 1 - k * 0.6; figure(x, y + Math.sin(t * 6 + i) * 8, s, i + 600, leaving ? t : 0); g.restore();
    }
    if (!leaving) MOBHITS.forEach((h, i) => { if (t > h && t < h + 0.9) palm(150 + rnd(i + 2) * 780, 500 + rnd(i + 8) * 600, 2.2, 1 - (t - h) / 0.9); });
  }, () => {
    MOBHITS.forEach((h, i) => { if (i % 2 === 0 && (t > h || leaving)) crack(150 + rnd(i + 2) * 780, 500 + rnd(i + 8) * 600, 1 + rnd(i) * 1.5, 1); });
  });
  if (!leaving) for (const h of MOBHITS) if (t > h && t < h + 0.12) { g.save(); g.globalAlpha = 0.25; rect(0, 0, W, H, '#ffd0a0'); g.restore(); }
}
function crowbar(t, i0) {
  mobHits();
  glassView(t, () => {
    rect(70, 260, 940, 1150, '#0b1619');
    rect(70, 1150, 940, 260, '#12242a');
    // tunnel gate on the right
    const gap = t > T[i0 + 2] ? lerp(10, 20, eout(prog(t, T[i0 + 2], T[i0 + 2] + 0.6))) : lerp(0, 10, eout(prog(t, T[i0 + 1], T[i0 + 1] + 1.5)));
    rect(520, 520, 440, 640, '#2c3a3e');
    const gy = 1150 - gap * 4;
    rect(540, 540, 400, gy - 540, '#56666b'); rect(540, gy, 400, 1150 - gy, '#020405');
    g.save(); g.beginPath(); g.rect(540, gy - 34, 400, 34); g.clip();
    for (let i = -2; i < 12; i++) { g.fillStyle = i % 2 ? '#111' : C.a; g.beginPath(); g.moveTo(540 + i * 40, gy); g.lineTo(580 + i * 40, gy - 34); g.lineTo(620 + i * 40, gy - 34); g.lineTo(580 + i * 40, gy); g.fill(); } g.restore();
    // manual wheel
    g.save(); g.translate(470, 900); g.rotate(t * 0.8 * (t > T[i0 + 1] ? 1 : 0));
    g.strokeStyle = '#7a8a8e'; g.lineWidth = 14; g.beginPath(); g.arc(0, 0, 70, 0, Math.PI * 2); g.stroke();
    for (let k = 0; k < 3; k++) { g.rotate(Math.PI / 3); rect(-75, -6, 150, 12, '#7a8a8e'); } g.restore();
    // Krylov small with crowbar
    const push = Math.abs(Math.sin(t * 3));
    man(330, 1210, 0.55, t, {});
    g.save(); g.translate(380, 1010); g.rotate(-0.9 + push * 0.4); rect(0, -8, 190, 16, '#9aa6aa'); g.restore();
    if (push > 0.95) for (let k = 0; k < 8; k++) circ(470 + (rnd(k + Math.floor(t * 20)) - .5) * 80, 900 + (rnd(k * 3 + Math.floor(t * 20)) - .5) * 80, 5, C.a);
    glow(470, 900, 120, 'rgba(255,181,71,.3)', push);
    text('ЗАЗОР', 740, 470, 26, C.mute, { mono: true });
    text(Math.round(gap) + ' СМ', 740, 420, 64, gap >= 19 ? C.r : C.a, { ui: true, glow: 14 });
  }, () => { MOBHITS.forEach((h, i) => { if (i % 2 === 0) crack(150 + rnd(i + 2) * 780, 500 + rnd(i + 8) * 600, 1 + rnd(i) * 1.5, 1); }); });
}
function gapShot(t, i0) {
  rect(0, 0, W, H, '#020405');
  const sg = g.createLinearGradient(0, 0, 0, 700); sg.addColorStop(0, '#4f5e63'); sg.addColorStop(1, '#66767c');
  g.fillStyle = sg; g.fillRect(0, 0, W, 700);
  g.save(); g.beginPath(); g.rect(0, 640, W, 60); g.clip();
  for (let i = -2; i < 28; i++) { g.fillStyle = i % 2 ? '#111' : C.a; g.beginPath(); g.moveTo(i * 60, 700); g.lineTo(i * 60 + 60, 640); g.lineTo(i * 60 + 120, 640); g.lineTo(i * 60 + 60, 700); g.fill(); } g.restore();
  rect(0, 1100, W, 820, '#1a2a2f');
  const t0 = T[i0], k = prog(t, t0, (T[i0 + 2] || END));
  for (let i = 0; i < 9; i++) {
    const z = clamp(k * 1.4 - rnd(i) * 0.6); if (z <= 0) continue;
    const s = lerp(4, 26, z * z), x = 540 + (rnd(i + 5) - .5) * lerp(500, 1300, z), y = 900 + Math.sin(t * 9 + i) * 6 * z;
    eyesZ(x, y, s, t, i + 40);
  }
  if (k > 0.75) { const f = prog(k, 0.75, 1); for (let i = 0; i < 7; i++) { g.fillStyle = C.zomb; rr(140 + i * 130, 700, 44, 30 + f * 140, 18); g.fill(); } }
  speedLines(t, 0.35 + k * 0.4, 'rgba(255,220,120,.35)');
}
