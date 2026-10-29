import json, re, subprocess, numpy as np, wave
SR = 48000
SPOKEN = ["Наверху — конец света.", "Под тобой — две тысячи триста человек.", "И ключ от затвора — только у тебя.",
 "У тебя девяносто секунд и три решения.", "Посмотрим, сможешь ли ты потом с ними жить.",
 "Ноль часов двенадцать минут. Последний поезд не пришёл.", "Соседняя станция не отвечает.", "И вдруг из динамика — голос диспетчера...",
 "#RADIO", "Сорок тонн стали опускаются девяносто секунд.", "На эскалаторе — толпа.", "Закроешь сразу — или будешь ждать?",
 "#HOLD3", "Ты ждёшь.", "Двадцать человек. Двести. Две тысячи.", "Ты слышишь их шаги...", "...а потом — другие. Быстрые. Неровные.",
 "У турникетов — те, кто уже не люди.", "Снаружи ещё тридцать живых.", "Прямо за ними — они.", "Подождёшь ещё — впустишь всех.",
 "#HOLD3", "Ты тянешь рычаг.", "Тридцать человек остались по ту сторону.", "Ты слышишь каждого.", "А потом — тишина.",
 "Теперь посчитай, что у тебя есть.", "Вода — из скважины. Свет — от дизеля.", "Воздух — через фильтры.", "А еды — на две недели. На всех.",
 "Ты запечатываешь выходы, шахты и оба тоннеля.", "Три часа семь минут. Ты почти засыпаешь...", "...и слышишь стук колёс.",
 "В тоннеле, который ты сама закрыла, — фара.", "Тот самый последний поезд.", "Там могут быть живые. А могут — нет.", "Открываешь?", "#HOLD4.5"]
MIND = {13: 1.6, 22: 1.6, 23: 3.0, 25: 2.6, 30: 3.6, 36: 2.0}
GAP = 0.22
def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
nar = load('vo/narr.mp3'); disp = load('vo/disp.mp3')
words, inb = [], False
for w in json.load(open('vo/words.json'))['words']:
    t = w['text']
    if t.startswith('['): inb = True
    if inb:
        if t.endswith(']'): inb = False
        continue
    if re.search(r'\w', t): words.append(w)
cnt = lambda s: len([x for x in s.split() if re.search(r'\w', x)])
need = sum(cnt(s) for s in SPOKEN if not s.startswith('#'))
assert need == len(words), (need, len(words))
# radio fx on dispatcher
X = np.fft.rfft(disp); f = np.fft.rfftfreq(len(disp), 1 / SR); X[(f < 350) | (f > 3200)] = 0
disp = np.tanh(np.fft.irfft(X, len(disp)) * 4) * 0.5
out = []; T = []; cur = 0.3; wi = 0
def place(sig, at):
    out.append((at, sig))
for i, s in enumerate(SPOKEN):
    T.append(cur)
    if s.startswith('#HOLD'): cur += float(s[5:]); continue
    if s == '#RADIO': place(disp, cur + 0.1); cur += len(disp) / SR + 0.45; continue
    n = cnt(s); ws = words[wi:wi + n]; wi += n
    a = max(0, ws[0]['start'] - 0.06)
    nxt = words[wi]['start'] if wi < len(words) else ws[-1]['end'] + 0.5
    b = min(ws[-1]['end'] + 0.12, nxt - 0.02)
    seg = nar[int(a * SR):int(b * SR)].copy()
    fade = int(0.012 * SR); seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
    place(seg, cur)
    cur += max(len(seg) / SR + GAP, MIND.get(i, 0))
END = cur + 0.2
buf = np.zeros(int(END * SR) + 1)
for at, sig in out: k = int(at * SR); buf[k:k + len(sig)] += sig[:len(buf) - k]
with wave.open('vo/vo.wav', 'wb') as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
open('vo_timeline.js', 'w').write('window.VO_T=' + json.dumps([round(x, 3) for x in T]) + ';window.VO_END=' + str(round(END, 3)) + ';')
print('END', round(END, 2))
