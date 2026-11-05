import re, json
SPOKEN = ["Ты не открыла.", "Всю ночь в тоннеле стучали.", "Кулаками. Ладонями. Чем-то железным.", "Утром стук прекратился.", "Так решили вы.",
 "Семь сорок утра. Камера в тоннеле.", "Поезд стоит у решётки. Двери открыты.", "Внутри — никого.",
 "Двое добровольцев готовы проверить.", "Выпустишь их — или никто не выходит?", "#HOLD3", "Никто не выходит.",
 "Но на станции — две тысячи триста человек.", "И слухи здесь расходятся быстрее воздуха.", "Она не открыла поезд. Там были дети.",
 "Крылов. Бывший полицейский.", "#RADIO", "У поста — двадцать человек. Стекло дрожит от ударов.", "Отдашь пульт — или запрёшься изнутри?",
 "#HOLD3", "Ты блокируешь дверь.", "Они уходят. Слишком спокойно.", "Через стекло ты видишь Крылова у тоннельного затвора.",
 "Лом. Ручной привод. Щель — десять сантиметров.", "Двадцать.", "А из темноты к щели кто-то бежит.", "Быстро. Неровно.",
 "Аварийное закрытие — и Крылов останется под створкой.", "Или дашь ему открыть?", "Решаешь ты.", "#HOLD4.5"]
sil = [tuple(map(float, l.split())) for l in open('yvo/sil.txt') if l.strip()]
import subprocess
dur = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','yvo/narr.mp3'],capture_output=True,text=True).stdout)
# speech start/end
s0 = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
e0 = sil[-1][0] if sil and sil[-1][1] > dur - 0.05 else dur
cands = [(a, b) for a, b in sil if a > s0 + 0.1 and b < e0 - 0.1]
beats = [s for s in SPOKEN if not s.startswith('#')]
chars = [len(re.sub(r'[^\wё]', '', s)) + 4 * len(re.findall(r'[.?!]', s)) for s in beats]
B = len(beats); total = e0 - s0; rate = total / sum(chars)
# points: start, candidate mids, end ; DP choose B-1 cands in order
pts = [(s0, s0, 0)] + [(a, b, b - a) for a, b in cands] + [(e0, e0, 0)]
P = len(pts); INF = 1e18
dp = [[INF] * P for _ in range(B + 1)]; bk = [[-1] * P for _ in range(B + 1)]
dp[0][0] = 0
for k in range(1, B + 1):
    for j in range(1, P):
        if k == B and j != P - 1: continue
        if k < B and j == P - 1: continue
        best = INF; bi = -1
        for i in range(j):
            if dp[k - 1][i] >= INF: continue
            d = pts[j][0] - pts[i][1]; ex = chars[k - 1] * rate
            c = dp[k - 1][i] + ((d - ex) / (ex + 0.4)) ** 2 - (3.0 * pts[j][2] if k < B else 0)
            if c < best: best, bi = c, i
        dp[k][j] = best; bk[k][j] = bi
j = P - 1; segs = []
for k in range(B, 0, -1):
    i = bk[k][j]; segs.append((pts[i][1], pts[j][0])); j = i
segs.reverse()
for b, (a, e), c in zip(beats, segs, chars): print(f'{a:6.2f}-{e:6.2f} ({e-a:4.2f} exp {c*rate:4.2f})  {b}')
json.dump(segs, open('yvo/segs.json', 'w'))
