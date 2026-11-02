// ---------- episode 3 scenes ----------
function child(x, y, s, t, opt = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#c9cfc9'; rr(-8, -60, 7, 60, 3); g.fill(); rr(2, -60, 7, 60, 3); g.fill();
  g.fillStyle = '#4a4f4a'; rr(-22, -130, 44, 76, 14); g.fill();
  g.fillStyle = '#c9cfc9'; rr(-30, -124, 10, 56, 5); g.fill(); rr(20, -124, 10, 56, 5); g.fill();
  circ(0, -152, 22, '#d6dcd6');
  g.fillStyle = '#2a2420'; g.beginPath(); g.arc(0, -158, 23, Math.PI, 0); g.fill();
  if (!opt.back) { circ(-8, -152, 4.5, '#111'); circ(8, -152, 4.5, '#111'); circ(-8, -152, 1.5, '#ffe45a'); circ(8, -152, 1.5, '#ffe45a'); }
  g.restore();
}
function slit(t, i0) {
  gapShot(t, 99);
  rect(0, 0, W, H, 'rgba(0,0,0,0)');
  const ce = eout(prog(t, T[i0 + 2], T[i0 + 2] + 2.2));
  if (t > T[i0 + 2]) { g.save(); g.globalAlpha = clamp(ce * 2); child(540, lerp(760, 1360, ce), lerp(1.2, 3.4, ce), t); g.restore(); }
  if (t > T[i0 + 1]) man(170, 1700, 1.0, t, {});
}
function boyShot(t, i0) {
  rect(0, 0, W, H, '#060d10');
  rect(0, 1150, W, 770, '#0f1e23'); rect(0, 1150, W, 8, '#c9c3a6');
  for (let i = 0; i < 16; i++) { const x = rnd(i) * W; g.fillStyle = '#05090b'; circ(x, 1030 + rnd(i + 3) * 60, 50, '#05090b'); rr(x - 60, 1070, 120, 300, 40); g.fill(); }
  g.save(); g.globalCompositeOperation = 'lighter';
  const fl = g.createRadialGradient(540, 1150, 0, 540, 1150, 520); fl.addColorStop(0, 'rgba(230,245,255,.35)'); fl.addColorStop(1, 'rgba(230,245,255,0)'); g.fillStyle = fl; g.fillRect(0, 0, W, H); g.restore();
  child(540, 1390, 3.2, t);
  if (t > T[i0 + 2]) { const p = eback(prog(t, T[i0 + 2], T[i0 + 2] + 0.4)); g.save(); g.translate(540, 470); g.scale(p, p); g.strokeStyle = C.t; g.lineWidth = 6; rr(-300, -60, 600, 120, 14); g.stroke(); text('0 ЦАРАПИН', 0, 4, 64, C.t, { ui: true, glow: 14 }); g.restore(); }
  if (t > T[i0 + 3]) { g.save(); g.globalAlpha = prog(t, T[i0 + 3], T[i0 + 3] + 0.5); text('ЗА НИМ — НИКОГО', 540, 600, 40, C.mute, { mono: true, ls: 3 }); g.restore(); }
}
function kryBoy(t) {
  rect(0, 0, W, H, '#140a0b'); glow(540, 500, 700, 'rgba(255,80,50,.22)');
  man(540, 1250, 1.45, t, { talk: true });
  child(700, 820, 2.0, t);
  for (let i = 0; i < 26; i++) { const x = rnd(i) * W, y = 1260 + rnd(i + 5) * 300; g.fillStyle = '#07090a'; circ(x, y - 90, 60, '#07090a'); rr(x - 70, y - 40, 140, 400, 40); g.fill(); }
}
function stare(t, i0) {
  rect(0, 0, W, H, '#0b0606');
  const turn = ease(prog(t, T[i0], T[i0] + 1.2));
  for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
    const s = 0.55 + r * 0.17, x = 80 + c * 155 + (r % 2) * 70, y = 330 + r * 190 + r * r * 8;
    g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = '#1a1212'; rr(-110, 60, 220, 300, 80); g.fill(); circ(0, 0, 90, '#2a1d1b');
    const ex = lerp(rnd(r * 9 + c) > .5 ? 22 : -22, 0, turn);
    circ(-30, -5, 16, '#e8e2dc'); circ(30, -5, 16, '#e8e2dc'); circ(-30 + ex * 0.4, -5, 7, '#111'); circ(30 + ex * 0.4, -5, 7, '#111');
    g.restore();
  }
  glow(540, 960, 900, 'rgba(255,40,40,.12)');
}
function nightCam(t, i0, zoom) {
  cam(0, 0, W, H, zoom ? 'КАМ 3 · ЦИФРОВОЙ ЗУМ ×8' : 'КАМ 3 · ПЛАТФОРМА · ИК', t, (w, h) => {
    rect(0, 0, w, h, '#06140c');
    if (!zoom) {
      g.fillStyle = '#0b2214'; g.fillRect(0, 1100, w, 820); rect(0, 1100, w, 10, '#3c6a48');
      g.fillStyle = '#020604'; g.beginPath(); g.moveTo(340, 1100); g.lineTo(340, 700); g.arc(540, 700, 200, Math.PI, 0); g.lineTo(740, 1100); g.fill();
      for (let i = 0; i < 14; i++) { g.fillStyle = '#0e2a18'; rr(40 + i * 75, 1300 + rnd(i) * 200, 60, 30, 14); g.fill(); }
      child(540, 1120, 2.4, 0, { back: true });
    } else {
      const bl = 26;
      for (let y = 0; y < h; y += bl) for (let x = 0; x < w; x += bl) { const n = rnd(x * 7 + y * 3 + Math.floor(t * 8)) * 0.08; g.fillStyle = `rgba(120,255,160,${n})`; g.fillRect(x, y, bl, bl); }
      g.save(); g.translate(540, 820);
      circ(0, 0, 330, '#9bcfa8'); g.fillStyle = '#1c3a25'; g.beginPath(); g.arc(0, -40, 340, Math.PI * 1.05, Math.PI * 1.95); g.fill();
      circ(-110, -10, 46, '#f2fff4'); circ(110, -10, 46, '#f2fff4'); circ(-110, -10, 20, '#0a140c'); circ(110, -10, 20, '#0a140c');
      const mo = 8 + 22 * Math.abs(Math.sin(t * 7)); g.fillStyle = '#2a4a32'; rr(-70, 170 - mo / 2, 140, mo, 10); g.fill();
      g.restore();
      const cnt = Math.floor(lerp(2280, 2299, prog(t, T[i0], T[i0 + 2] || END)));
      text('… ' + fmt(cnt - 1) + ' · ' + fmt(cnt) + ' …', 540, 1240, 54, '#c8ffd4', { mono: true, glow: 14 });
      if (t > T[i0 + 1]) text('СЧИТАЕТ ЛЮДЕЙ?', 540, 1310, 30, '#7fb88f', { mono: true, ls: 3 });
    }
    text('02:14:' + String(Math.floor((t * 4) % 60)).padStart(2, '0'), w - 30, h - 560, 30, '#9cf0b8', { mono: true, align: 'right' });
  }, false);
  g.save(); g.globalAlpha = 0.12; rect(0, 0, W, H, '#30ff70'); g.restore();
}
function tent(t, i0) {
  rect(0, 0, W, H, '#05080a');
  g.fillStyle = '#1d2a24'; g.beginPath(); g.moveTo(80, 1350); g.lineTo(540, 380); g.lineTo(1000, 1350); g.fill();
  g.fillStyle = '#0c1410'; g.beginPath(); g.moveTo(260, 1350); g.lineTo(540, 640); g.lineTo(820, 1350); g.fill();
  const warm = 1 - prog(t, T[i0], (T[i0 + 2] || END)) * 0.6;
  g.save(); g.translate(540, 1180);
  const tg = g.createRadialGradient(0, 0, 10, 0, 0, 260); tg.addColorStop(0, `rgba(255,${140 + 60 * (1 - warm)},40,${0.9 * warm})`); tg.addColorStop(1, 'rgba(60,40,120,.4)');
  g.fillStyle = tg; rr(-240, -70, 480, 160, 70); g.fill(); g.restore();
  text('ТЕПЛОВИЗОР', 540, 470, 26, C.mute, { mono: true, ls: 3 });
  text('+' + Math.round(lerp(31, 24, 1 - warm) ) + ' °C', 540, 1010, 54, '#ffb070', { ui: true, glow: 12 });
  if (t > T[i0 + 1]) { const p = eback(prog(t, T[i0 + 1], T[i0 + 1] + 0.3)); g.save(); g.translate(540, 300 + 260); g.scale(p, p); g.strokeStyle = C.r; g.lineWidth = 7; rr(-300, -55, 600, 110, 12); g.stroke(); text('2 ПРОПАВШИХ', 0, 4, 56, C.r, { ui: true }); g.restore(); }
}
function wheelCam(t, i0) {
  cam(0, 0, W, H, 'КАМ 9 · ТОННЕЛЬНЫЙ ЗАТВОР', t, (w, h) => {
    rect(0, 0, w, h, '#0a1517'); rect(0, 1250, w, 670, '#12242a');
    const gap = lerp(20, 34, prog(t, T[i0 + 1], END));
    rect(360, 520, 640, 760, '#2c3a3e'); const gy = 1250 - gap * 5;
    rect(380, 540, 600, gy - 540, '#56666b'); rect(380, gy, 600, 1250 - gy, '#010203');
    for (let i = 0; i < 6; i++) eyesZ(440 + i * 100, gy + (1250 - gy) / 2, 6, t, i + 3);
    g.save(); g.translate(250, 900); g.rotate(t > T[i0 + 1] ? (t - T[i0 + 1]) * 2.2 : 0);
    g.strokeStyle = '#8a9a9e'; g.lineWidth = 18; g.beginPath(); g.arc(0, 0, 110, 0, Math.PI * 2); g.stroke();
    for (let k = 0; k < 3; k++) { g.rotate(Math.PI / 3); rect(-115, -8, 230, 16, '#8a9a9e'); } g.restore();
    text('ЗАЗОР ' + Math.round(gap) + ' СМ', 680, 470, 48, gap > 25 ? C.r : C.a, { ui: true, glow: 12 });
    if (t > T[i0 + 2]) text('ДВИЖЕНИЯ ЛЮДЕЙ: НЕТ', 540, 1420, 36, C.r, { mono: true, glow: 10 });
  }, t > T[i0 + 1]);
}
