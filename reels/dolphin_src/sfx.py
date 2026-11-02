import numpy as np, wave, json
d=json.load(open('timeline.json')); T=d['T']; END=d['END']; K=d['K']
SR=48000; N=int(SR*END); t=np.arange(N)/SR
rng=np.random.default_rng(21); noise=rng.standard_normal(N); out=np.zeros(N)
def band(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X[(f<lo)|(f>hi)]=0; return np.fft.irfft(X,len(x))
def seg(a,b): return slice(max(0,int(a*SR)),min(N,int(b*SR)))
def env(n,a,r):
    e=np.ones(n); a=int(a*SR); r=int(r*SR)
    if a: e[:a]=np.linspace(0,1,a)
    if r: e[-r:]*=np.linspace(1,0,r)
    return e
def add(a,sig):
    k=int(a*SR); m=min(len(sig),N-k)
    if m>0: out[k:k+m]+=sig[:m]
def tone(f,dur,dec,amp): tt=np.arange(int(dur*SR))/SR; return amp*np.sin(2*np.pi*f*tt)*np.exp(-tt*dec)
def boom(at,amp,f=45,dec=4):
    s=seg(at,at+2.5); tt=t[s]-at
    out[s]+=amp*(np.sin(2*np.pi*f*tt*(1-0.3*tt/2.5))*np.exp(-tt*dec)+0.5*band(noise[s],40,350)*np.exp(-tt*dec*2))
def clang(at,amp):
    s=seg(at,at+2); tt=t[s]-at
    out[s]+=amp*sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f,k in [(140,2),(311,3),(677,4),(1230,6)])/3
def sh(k0): return [i for i,k in enumerate(K) if k==k0]
def span(k0): i=sh(k0); return T[i[0]], (T[i[-1]+1] if i[-1]+1<len(T) else END)
dr=0.5*np.sin(2*np.pi*41*t)+0.3*np.sin(2*np.pi*61.5*t)+0.5*band(noise,30,120)
out+=0.05*dr
a,b=span('AIR'); s=seg(a,b); out[s]+=0.12*band(noise[s],200,1500)*env(s.stop-s.start,0.5,0.4)
s=seg(0.2,2.5); tt=t[s]-0.2; out[s]+=0.06*np.sin(2*np.pi*(600*tt-180/(2*np.pi*0.6)*np.cos(2*np.pi*0.6*tt)))*env(len(tt),0.2,0.6)
boom(T[0]+0.3,0.6,40,2.5)
a,b=span('COUNT')
for x in np.arange(T[2],T[2]+1.6,0.05): add(x,tone(2200,0.02,120,0.05))
for k in range(3): boom(T[3]+0.15+k*0.55,0.5,55,6); clang(T[3]+0.15+k*0.55,0.08)
a,b=span('HIST'); s=seg(a,b); out[s]+=0.05*band(noise[s],2000,6000)*(0.5+0.5*np.sign(np.sin(2*np.pi*3*t[s])))
for x in np.arange(T[5],b,0.6): add(x,tone(900,0.08,30,0.05)); add(x+0.03,0.05*band(noise[seg(0,0.08)],3000,8000))
boom(T[5]+1.6,0.5,50,5)
a,b=span('FOUNT'); s=seg(a,b); out[s]+=0.07*band(noise[s],800,5000)*env(s.stop-s.start,0.4,0.4)
clang(T[sh('CELL')[0]],0.35)
a,b=span('LIGHT'); s=seg(a,b); out[s]+=0.03*np.sin(2*np.pi*100*t[s])*(1+0.3*np.sin(2*np.pi*50*t[s]))
for x in np.arange(a,b,1/1.3): add(x+0.58,0.12*band(noise[seg(0,0.12)],400,2500)*np.exp(-np.arange(int(0.12*SR))/SR*25))
a,b=span('BED')
for x in np.arange(a,b,0.5): add(x,tone(1600,0.05,60,0.07))
a,b=span('YARD'); s=seg(a,b); out[s]+=0.08*band(noise[s],150,1200)*env(s.stop-s.start,0.4,0.4)
a,b=span('CONV')
for x in np.arange(a,b,0.45): boom(x,0.12,90,20)
for x in (T[13]+0.3,T[13]+0.9): s=seg(x,x+0.25); tt=t[s]-x; out[s]+=0.25*np.tanh(4*np.sin(2*np.pi*(420-500*tt)*tt))*np.exp(-tt*10)
a,b=span('ESC')
for x in np.arange(a,T[15],0.8): s=seg(x,x+0.4); tt=t[s]-x; out[s]+=0.05*np.sin(2*np.pi*880*tt)*env(len(tt),0.02,0.1)
boom(T[14]+3,0.5,55,5); boom(T[15],0.8,36,2)
for k in (sh('END')[0],):
    for j in (0.25,0.4): add(T[k]+j,tone(1200,0.15,25,0.1))
for x in np.arange(T[16],END-0.5,0.8): boom(x,0.16,55,9); boom(x+0.18,0.1,50,10)
boom(T[17],0.6,36,2)
for i in range(1,len(K)):
    if K[i]!=K[i-1]:
        st=T[i]-0.18; sg=seg(st,st+0.45); n=sg.stop-sg.start
        out[sg]+=0.3*band(noise[sg],400,6000)*np.sin(np.linspace(0,np.pi,n))**3
out/=max(1,np.abs(out).max()/0.9)
with wave.open('sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
