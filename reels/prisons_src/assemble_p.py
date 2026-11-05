import json, subprocess, numpy as np, wave, sys
V = sys.argv[1]; SR = 48000
CFG = {
 'swan': dict(tempo=1.05, plan=[(0.26, 4.56), (5.51, 10.73), (11.70, 16.15), (17.10, 20.79), (21.77, 26.01), (27.10, 31.14),
          (31.96, 37.21), (37.97, 39.91), (40.97, 45.43), (46.43, 51.12), (52.29, 54.49), ('H', 4.5)], mind={7: 2.2}),
 'alc': dict(tempo=1.08, plan=[(0.25, 5.69), (6.65, 14.28), (15.25, 20.73), (21.70, 27.03), (28.00, 29.84), (30.85, 35.95),
          (36.94, 43.45), (44.49, 48.68), (49.54, 53.65), (54.64, 58.55), (59.61, 61.42), (62.58, 64.54), ('H', 4.5)], mind={8: 2.8, 10: 2.4, 6: 3.2}),
}[V]
TEMPO = CFG['tempo']; GAP = 0.3
raw = subprocess.run(['ffmpeg','-v','error','-i',f'vo/{V}.mp3','-af',f'atempo={TEMPO}','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
nar = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
T = []; cur = 0.3; out = []
for i, p in enumerate(CFG['plan']):
    T.append(cur)
    if p[0] == 'H': cur += p[1]; continue
    a, b = p[0] / TEMPO, p[1] / TEMPO
    seg = nar[int(max(0, a - 0.05) * SR):int((b + 0.1) * SR)].copy()
    fd = int(0.012 * SR); seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd)
    out.append((cur, seg)); cur += max(len(seg) / SR + GAP, CFG['mind'].get(i, 0))
END = cur + 0.2
buf = np.zeros(int(END * SR) + 1)
for at, sig in out: k = int(at * SR); buf[k:k + len(sig)] += sig[:len(buf) - k]
buf *= 0.9 / max(1e-6, np.abs(buf).max())
with wave.open(f'vo/{V}_vo.wav', 'wb') as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
open(f'vo_{V}.js', 'w').write('window.VO_T=' + json.dumps([round(x, 3) for x in T]) + ';window.VO_END=' + str(round(END, 3)) + ';')
print(V, 'beats', len(T), 'END', round(END, 2))
