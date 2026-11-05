import numpy as np, wave, json
d=json.load(open('timeline.json')); T=d['T']; END=d['END']
SR=48000; N=int(SR*END); t=np.arange(N)/SR
rng=np.random.default_rng(3); noise=rng.standard_normal(N); out=np.zeros(N)
def band(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X[(f<lo)|(f>hi)]=0; return np.fft.irfft(X,len(x))
def seg(a,b): return slice(max(0,int(a*SR)),min(N,int(b*SR)))
def env(n,a,r):
    e=np.ones(n); a=int(a*SR); r=int(r*SR)
    if a: e[:a]=np.linspace(0,1,a)
    if r: e[-r:]*=np.linspace(1,0,r)
    return e
def add(a,b,sig): s=seg(a,b); out[s]+=sig[:s.stop-s.start]
def tone(f,dur,dec,amp): tt=np.arange(int(dur*SR))/SR; return amp*np.sin(2*np.pi*f*tt)*np.exp(-tt*dec)
def boom(at,amp,f=45,dec=4):
    s=seg(at,at+2.5); tt=t[s]-at
    out[s]+=amp*(np.sin(2*np.pi*f*tt*(1-0.3*tt/2.5))*np.exp(-tt*dec)+0.5*band(noise[s],40,350)*np.exp(-tt*dec*2))
def clank(at,amp):
    s=seg(at,at+1.5); tt=t[s]-at
    out[s]+=amp*sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f,k in [(190,3),(430,5),(990,7)])/3
# cold pulsing drone
dr=0.5*np.sin(2*np.pi*49*t)+0.3*np.sin(2*np.pi*73.4*t)+0.25*np.sin(2*np.pi*98*t)*(0.5+0.5*np.sin(2*np.pi*0.25*t))+0.5*band(noise,30,140)
gd=np.full(N,0.05); gd[seg(T[25],T[26])]=0.006; gd[seg(T[31],END)]=0.075
out+=dr*np.convolve(gd,np.ones(4800)/4800,'same')
# heartbeat-ish pulse under decisions
for k0,k1 in [(9,14),(18,23)]:
    for b in np.arange(T[k0],T[k1],0.75): boom(b,0.18,55,9); boom(b+0.18,0.12,50,10)
# alarm klaxon in hook
for b in np.arange(T[0],T[5],1.2):
    s=seg(b,b+0.55); tt=t[s]-b; out[s]+=0.05*np.sign(np.sin(2*np.pi*440*tt))*env(len(tt),0.02,0.1)
boom(T[3],0.6,40,2.5)
# phone: no-answer beeps
for b in np.arange(T[6]+0.2,T[7],0.62):
    s=seg(b,b+0.32); tt=t[s]-b; out[s]+=0.09*np.sin(2*np.pi*425*tt)*env(len(tt),0.01,0.02)
# radio static + squelch
s=seg(T[8]-0.1,T[9]); n=s.stop-s.start; out[s]+=0.12*band(noise[s],1500,5000)*(0.5+0.5*np.abs(np.sin(np.arange(n)/SR*23)))
add(T[8]-0.1,T[8]+0.2,0.2*band(noise[seg(0,0.3)],800,6000))
# timer ticks + select thud
for k in (12,21):
    for i in range(6): add(T[k]-2+i,T[k]-2+i+0.1,tone(1800 if i<5 else 900,0.1,40,0.18))
for k in (13,22): boom(T[k],0.5,60,5); clank(T[k],0.18)
# UI blips: cards / slots / seals
for k in (9,18,36):
    for j in (0.25,0.4): add(T[k]+j,T[k]+j+0.15,tone(1200,0.15,25,0.1))
for tt0 in (T[27],T[27]+1.4,T[28],T[29]): add(tt0,tt0+0.3,tone(880,0.3,12,0.12)+tone(1320,0.3,14,0.06))
dd=d.get('seal',None)
for k in range(8): clank(T[30]+0.2+k*(3.6-1.2)/8,0.15)
boom(T[30]+3.6-0.9,0.5,45,3)
# crowd panic on cams
s=seg(T[14],T[18]); n=s.stop-s.start
am=np.convolve(rng.random(n),np.ones(2400)/2400,'same'); out[s]+=0.22*band(noise[s],300,2500)*am*env(n,0.8,0.3)
# gate: grind, hits, silence
s=seg(T[22]-0.2,T[23]+2.2); tt=t[s]-t[s][0]; out[s]+=0.16*band(noise[s],120,650)*(0.6+0.4*np.sin(2*np.pi*11*tt))*env(len(tt),0.2,0.1)
for h in [T[23]+2.3,T[23]+2.8,T[24]+0.1,T[24]+0.7]: boom(h,0.55,45,6)
boom(T[23]+2.2,0.6,38,3)
# rails + approaching
s=seg(T[32],END); n=s.stop-s.start; out[s]+=0.4*band(noise[s],25,200)*np.linspace(0,1,n)**2
for b in np.arange(T[32],END-0.5,0.85):
    for o in (0,0.13): clank(b+o,0.05+0.08*(b-T[32])/(END-T[32]))
boom(T[33],0.6,40,2.5); boom(T[36],0.7,36,2)
K=d['K']
for i in range(1,len(K)):
    if K[i]!=K[i-1]:
        st=T[i]-0.18; sg=seg(st,st+0.45); n=sg.stop-sg.start
        out[sg]+=0.35*band(noise[sg],400,6000)*np.sin(np.linspace(0,np.pi,n))**3
for k in range(len(T)):
    if K[k] not in ('D','F','J') : boom(T[k],0.12,70,12)
out/=max(1,np.abs(out).max()/0.9)
with wave.open('sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
