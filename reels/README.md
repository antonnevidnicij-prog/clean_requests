# Гермозатвор — рилсы

- `germozatvor_ep1.mp4` — серия 1 «Последний поезд» (1080×1920, 1:29).
- `ep1_src/` — исходники: `index.html` (сцены, HUD, субтитры на canvas), `data.js` (тайминги слов озвучки), `vo.mp3` (озвучка), `sfx.py` (звуковые эффекты).

Пересборка:

```bash
cd reels/ep1_src
npm install
mkdir -p frames && node render.js
python3 sfx.py
ffmpeg -framerate 30 -i frames/%05d.jpg -i vo.mp3 -i sfx.wav \
  -filter_complex "[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0[v];[2:a]pan=stereo|c0=c0|c1=c0,volume=0.55[s];[v][s]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]" \
  -map 0:v -map "[a]" -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -t 89.5 germozatvor_ep1.mp4
```
