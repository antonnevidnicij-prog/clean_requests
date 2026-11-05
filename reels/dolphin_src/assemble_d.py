import json, subprocess, numpy as np, wave
SR = 48000; TEMPO = 1.12
PLAN = [(0.25, 6.62), (7.45, 10.74), (11.71, 15.84), (16.72, 20.42), (21.41, 24.97), (25.82, 30.00), (31.09, 36.52),
        (37.59, 42.31), (43.27, 47.82), (48.80, 54.06), (55.01, 57.78), (58.78, 65.20), (66.28, 71.18), (72.04, 74.47),
        (75.56, 82.94), (83.88, 86.20), (87.38, 91.66), ('H', 4.5)]
MIND = {3: 2.4, 5: 4.0, 14: 4.4, 15: 2.0}
GAP = 0.3
raw = subprocess.run(['ffmpeg','-v','error','-i','vo/narr.mp3','-af',f'atempo={TEMPO}','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
nar = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
T = []; cur = 0.3; out = []
for i, p in enumerate(PLAN):
    T.append(cur)
    if p[0] == 'H': cur += p[1]; continue
    a, b = p[0] / TEMPO, p[1] / TEMPO
    seg = nar[int(max(0, a - 0.05) * SR):int((b + 0.1) * SR)].copy()
    fd = int(0.012 * SR); seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
    out.append((cur, seg)); cur += max(len(seg) / SR + GAP, MIND.get(i, 0))
END = cur + 0.2
buf = np.zeros(int(END * SR) + 1)
for at, sig in out: k = int(at * SR); buf[k:k + len(sig)] += sig[:len(buf) - k]
buf *= 0.9 / max(1e-6, np.abs(buf).max())
with wave.open('vo/vo.wav', 'wb') as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
open('vo_timeline.js', 'w').write('window.VO_T=' + json.dumps([round(x, 3) for x in T]) + ';window.VO_END=' + str(round(END, 3)) + ';')
print('beats', len(T), 'END', round(END, 2))
