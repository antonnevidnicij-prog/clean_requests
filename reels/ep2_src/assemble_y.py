import json, subprocess, numpy as np, wave
exec(open('align.py').read().split('sil = [')[0])  # SPOKEN
SR = 48000
MIND = {3: 2.0, 7: 1.6, 11: 1.6, 20: 1.6, 24: 1.3, 29: 1.6}
GAP = 0.25
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
nar = load('yvo/narr.mp3'); kr = load('yvo/krylov.mp3')
nz = np.where(np.abs(kr) > 0.02)[0]; kr = kr[max(0, nz[0] - 800):nz[-1] + 4800]
X = np.fft.rfft(kr); f = np.fft.rfftfreq(len(kr), 1 / SR); X[(f < 180) | (f > 4500)] = 0
kr = np.tanh(np.fft.irfft(X, len(kr)) * 2.5) * 0.6
segs = json.load(open('yvo/segs.json'))
T = []; cur = 0.3; out = []; si = 0
for i, s in enumerate(SPOKEN):
    T.append(cur)
    if s.startswith('#HOLD'): cur += float(s[5:]); continue
    if s == '#RADIO': out.append((cur + 0.1, kr)); cur += len(kr) / SR + 0.4; continue
    a, b = segs[si]; si += 1
    seg = nar[int(max(0, a - 0.05) * SR):int((b + 0.1) * SR)].copy()
    fd = int(0.012 * SR); seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
    out.append((cur, seg)); cur += max(len(seg) / SR + GAP, MIND.get(i, 0))
END = cur + 0.2
buf = np.zeros(int(END * SR) + 1)
for at, sig in out: k = int(at * SR); buf[k:k + len(sig)] += sig[:len(buf) - k]
with wave.open('yvo/vo.wav', 'wb') as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
open('vo_timeline.js', 'w').write('window.VO_T=' + json.dumps([round(x, 3) for x in T]) + ';window.VO_END=' + str(round(END, 3)) + ';')
print('END', round(END, 2))
