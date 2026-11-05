// ---------- extra scenes (batch 2) ----------
function aerial2(t, v) {
  if (v === 'snow') return aerial(t, 'snow');
  const skyTop = { forest: '#0b1a24', city: '#0a0f1e', jungle: '#0b2030' }[v], skyBot = { forest: '#3a5a6a', city: '#3a2a4a', jungle: '#2f8ca8' }[v];
  const sky = g.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, skyTop); sky.addColorStop(1, skyBot); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  if (v === 'city') {
    g.fillStyle = '#1a1626'; g.beginPath(); g.moveTo(0, 760); for (let x = 0; x <= W; x += 40) g.lineTo(x, 520 - Math.abs(Math.sin(x * 0.004)) * 260 + 40 * Math.sin(x * 0.03)); g.lineTo(W, 760); g.fill();
    circ(820, 300, 40, '#f2e8d0');
    for (let i = 0; i < 400; i++) { const x = rnd(i) * W, y = 640 + rnd(i + 3) * 340; if (rnd(i + 9) > 0.3) rect(x, y, 4, 4, rnd(i + 5) > 0.5 ? '#ffd27a' : '#ffefc0'); }
    rect(0, 980, W, 1000, '#211c28');
  } else if (v === 'jungle') {
    const sea = g.createLinearGradient(0, 700, 0, H); sea.addColorStop(0, '#1d7a8c'); sea.addColorStop(1, '#0a3a4a'); g.fillStyle = sea; g.fillRect(0, 700, W, H);
    for (let i = 0; i < 70; i++) { const y = 720 + rnd(i) * 1100, x = (rnd(i + 3) * 1300 + t * 30 * (1 + rnd(i))) % 1300 - 100; rect(x, y, 40 + rnd(i + 1) * 90, 3, 'rgba(220,250,255,.25)'); }
    g.fillStyle = '#2c4a22'; g.beginPath(); g.ellipse(540, 1150, 440, 180, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 14; i++) { const x = 160 + i * 55 + rnd(i) * 30, y = 1060 + rnd(i + 2) * 120; rect(x - 4, y - 120, 8, 120, '#4a3a24');
      for (let k = 0; k < 5; k++) { g.save(); g.translate(x, y - 120); g.rotate(k * 1.25 + Math.sin(t + i) * 0.1); g.fillStyle = '#3f7a2c'; g.beginPath(); g.ellipse(40, 0, 45, 10, 0, 0, Math.PI * 2); g.fill(); g.restore(); } }
  } else {
    rect(0, 900, W, 1100, '#2f4a32');
    for (let i = 0; i < 18; i++) { const x = i * 64 - 20, h = 140 + rnd(i) * 180; g.fillStyle = '#163020'; g.beginPath(); g.moveTo(x, 910); g.lineTo(x + 30, 910 - h); g.lineTo(x + 60, 910); g.fill(); }
  }
  g.save(); g.translate(540, v === 'jungle' ? 1120 : 1180); g.scale(1, 0.55);
  g.strokeStyle = v === 'forest' ? '#b8c0c8' : '#4a5058'; g.lineWidth = 26; g.strokeRect(-380, -340, 760, 680);
  for (const [x, y, w, h] of [[-280, -230, 560, 170], [-280, 60, 240, 160], [40, 60, 240, 160]]) { g.fillStyle = v === 'forest' ? '#c9a77a' : v === 'jungle' ? '#d8cbb0' : '#6a5a4a'; g.fillRect(x, y, w, h); for (let k = 0; k < w; k += 40) rect(x + k + 10, y + 20, 18, 30, rnd(k + x + y) > 0.4 ? '#ffd27a' : '#20252a'); }
  g.restore();
}
function kitchen(t, t0) {
  rect(0, 0, W, H, '#1d1a17'); rect(0, 1100, W, 900, '#3a2e24');
  rect(80, 420, 300, 520, '#c8ccd2'); rect(90, 600, 280, 6, '#9aa0a6'); circ(350, 520, 8, '#666');
  rect(420, 620, 300, 320, '#2a2e33'); for (const x of [470, 560, 650]) circ(x, 650, 28, '#111'); rect(420, 600, 300, 20, '#4a4f55');
  rect(760, 420, 240, 160, '#5a7a9a'); glow(880, 500, 200, 'rgba(160,200,255,.3)');
  rect(180, 1000, 720, 30, '#7a5a3a'); for (const x of [230, 400, 570, 740]) { rect(x, 1030, 20, 120, '#5a4028'); }
  for (let k = 0; k < 4; k++) circ(260 + k * 170, 990, 22, ['#e0a47c', '#c98a62', '#f0c09a', '#a8704a'][k]);
  glow(540, 600, 700, 'rgba(255,200,120,.12)');
  stamp(t, t0 + 1, 'ОБЩАЯ КУХНЯ', 540, 330, C.t, 56);
}
function shop(t, t0) {
  rect(0, 0, W, H, '#14181c');
  for (let r = 0; r < 4; r++) { const y = 420 + r * 200; rect(80, y + 140, 920, 14, '#5a4a3a');
    for (let i = 0; i < 15; i++) { const cols = ['#e05a3a', '#f0b33a', '#5aa04a', '#4a8ad0', '#d8d8d8']; g.fillStyle = cols[(i + r) % 5]; rr(95 + i * 60, y + 60 + rnd(i + r) * 20, 44, 80 - rnd(i + r) * 20, 6); g.fill(); } }
  g.save(); g.translate(540 + Math.sin(t) * 40, 1230); g.strokeStyle = '#c8ccd2'; g.lineWidth = 8; g.strokeRect(-110, -70, 220, 120); g.restore();
  stamp(t, t0 + 1, 'ГОТОВЯТ САМИ', 540, 330, C.t, 56);
}
function family(t, t0) {
  rect(0, 0, W, H, '#1c1820'); rect(0, 1050, W, 900, '#3a3030');
  for (let i = 0; i < 4; i++) { rect(i * 270, 380, 250, 640, '#2a2430'); for (let k = 0; k < 3; k++) rect(i * 270 + 30 + k * 70, 440, 50, 70, '#ffd27a'); rect(i * 270 + 80, 820, 90, 200, '#4a3a2a'); }
  for (let i = 0; i < 14; i++) { const kid = i % 3 === 0; const x = 80 + rnd(i) * 920 + Math.sin(t * 0.8 + i) * 30; figure(x, 1200 + rnd(i + 4) * 120, kid ? 0.9 : 1.5, i + 40, t * (kid ? 1.6 : 0.6)); }
  if (t > t0 + 0.5) stamp(t, t0 + 0.8, 'ДЕТИ ВНУТРИ', 540, 300, C.r, 56);
}
function market(t, t0) {
  rect(0, 0, W, H, '#18141a'); rect(0, 1080, W, 900, '#33282a');
  const cols = ['#e05a3a', '#f0b33a', '#4a8ad0', '#5aa04a'];
  for (let i = 0; i < 4; i++) { const x = 40 + i * 260;
    g.fillStyle = cols[i]; g.beginPath(); g.moveTo(x, 640); g.lineTo(x + 240, 640); g.lineTo(x + 220, 560); g.lineTo(x + 20, 560); g.fill();
    for (let k = 0; k < 6; k++) rect(x + 20 + k * 36, 640, 18, 30, k % 2 ? '#fff' : cols[i]);
    rect(x + 20, 860, 200, 160, '#5a4030'); for (let k = 0; k < 5; k++) circ(x + 50 + k * 36, 850, 14, cols[(i + k) % 4]);
    figure(x + 120, 1060, 1.3, i + 70, 0); }
  ['КАФЕ', 'ЛАВКА', 'ЦИРЮЛЬНЯ', 'МАСТЕРСКАЯ'].forEach((s, i) => text(s, 160 + i * 260, 520, 30, C.w, { ui: true }));
}
function thermo(t, t0, val, sub) {
  rect(0, 0, W, H, '#0a1018');
  for (let i = 0; i < 220; i++) { const x = (rnd(i) * 1300 - t * 160 * (0.5 + rnd(i + 2))) % 1300; const xx = x < -100 ? x + 1300 : x; const y = (rnd(i + 5) * 2000 + t * 90 * (0.5 + rnd(i + 7))) % 2000; rect(xx, y, 6, 2, 'rgba(230,240,250,.6)'); }
  rect(480, 340, 120, 760, '#2a3440'); rect(510, 370, 60, 700, '#0d141c');
  const p = ease(prog(t, t0 + 0.2, t0 + 1.6)); const h = lerp(560, 120, p);
  rect(515, 1070 - h, 50, h, '#8fdcff'); circ(540, 1120, 80, '#8fdcff');
  text(val, 790, 600, 120, '#8fdcff', { ui: true, glow: 20 }); text(sub, 790, 700, 30, C.cy, { mono: true });
  for (let k = 0; k < 8; k++) { rect(470, 400 + k * 85, 20, 4, '#5a6a7a'); }
}
