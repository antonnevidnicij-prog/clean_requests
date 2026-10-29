import json, subprocess, numpy as np, wave
SR = 48000
# beat -> narration segment (seconds in vo/narr.mp3); '#R' = radio file, ('H', sec) = hold
PLAN = [(0.11, 1.72), (2.42, 5.14), (6.11, 9.27), (10.33, 12.09), (12.89, 14.10), (14.96, 16.82), (17.66, 19.48),
        (20.62, 22.62), (23.33, 24.35), (25.07, 27.04), (27.88, 28.78), (29.86, 32.60), (33.41, 35.40), (36.14, 38.46),
        (39.36, 40.11), (41.41, 44.17), ('H', 3.0), (47.55, 48.51), '#R', (49.71, 52.30), (53.45, 55.87), (56.63, 57.39),
        (58.23, 61.25), ('H', 3.0), (64.70, 65.79), (66.95, 67.75), (68.47, 69.48), (70.14, 72.07), (72.84, 74.45),
        (75.43, 76.62), (77.67, 79.55), (80.44, 81.67), (82.82, 85.01), ('H', 4.5)]
MIND = {2: 3.4, 10: 1.8, 14: 1.6, 17: 1.6, 24: 1.8, 29: 2.0}
GAP = 0.3
def load(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
nar = load('vo/narr.mp3'); rad = load('vo/radio.mp3')
nz = np.where(np.abs(rad) > 0.02)[0]; rad = rad[max(0, nz[0] - 800):nz[-1] + 4800]
X = np.fft.rfft(rad); f = np.fft.rfftfreq(len(rad), 1 / SR); X[(f < 350) | (f > 3200)] = 0
rad = np.tanh(np.fft.irfft(X, len(rad)) * 4) * 0.5
T = []; cur = 0.3; out = []
for i, p in enumerate(PLAN):
    T.append(cur)
    if p == '#R': out.append((cur + 0.1, rad)); cur += len(rad) / SR + 0.45; continue
    if p[0] == 'H': cur += p[1]; continue
    a, b = p; seg = nar[int(max(0, a - 0.05) * SR):int((b + 0.12) * SR)].copy()
    fd = int(0.012 * SR); seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
    out.append((cur, seg)); cur += max(len(seg) / SR + GAP, MIND.get(i, 0))
END = cur + 0.2
buf = np.zeros(int(END * SR) + 1)
for at, sig in out: k = int(at * SR); buf[k:k + len(sig)] += sig[:len(buf) - k]
with wave.open('vo/vo.wav', 'wb') as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
open('vo_timeline.js', 'w').write('window.VO_T=' + json.dumps([round(x, 3) for x in T]) + ';window.VO_END=' + str(round(END, 3)) + ';')
print('beats', len(T), 'END', round(END, 2))
