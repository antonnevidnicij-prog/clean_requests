import numpy as np, subprocess, json, re
SR=16000
raw=subprocess.run(['ffmpeg','-v','error','-i','yvo/narr.mp3','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
x=np.frombuffer(raw,np.int16).astype(np.float32)/32768
X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X[(f<300)|(f>2500)]=0; y=np.fft.irfft(X,len(x))
hop=160; e=np.sqrt(np.convolve(y**2,np.ones(400)/400,'same')[::hop])  # 10ms frames
e=np.convolve(e,np.hanning(7)/np.hanning(7).sum(),'same')
thr=np.percentile(e,60)*0.6
peaks=[i for i in range(2,len(e)-2) if e[i]>=e[i-1] and e[i]>e[i+1] and e[i]>thr]
# merge peaks closer than 90ms keeping max, require dip between
P=[]
for p in peaks:
    if P and p-P[-1]<9:
        if e[p]>e[P[-1]]: P[-1]=p
    elif P and min(e[P[-1]:p+1])>0.75*min(e[P[-1]],e[p]):
        if e[p]>e[P[-1]]: P[-1]=p
    else: P.append(p)
times=np.array(P)*hop/SR
json.dump(times.tolist(),open('yvo/peaks.json','w'))
txt=open('narr_text.txt').read()
print('peaks',len(times),'text vowels',len(re.findall('[аеёиоуыэюяАЕЁИОУЫЭЮЯ]',txt)))
