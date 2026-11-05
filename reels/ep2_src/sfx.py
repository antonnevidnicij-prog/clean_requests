import numpy as np, wave, json
d=json.load(open('timeline.json')); T=d['T']; END=d['END']; K=d['K']
SR=48000; N=int(SR*END); t=np.arange(N)/SR
rng=np.random.default_rng(5); noise=rng.standard_normal(N); out=np.zeros(N)
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
def clank(at,amp):
    s=seg(at,at+1.5); tt=t[s]-at
    out[s]+=amp*sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f,k in [(190,3),(430,5),(990,7)])/3
def burst(a,b,lo,hi,amp,ea=0.3,er=0.3,am=None):
    s=seg(a,b); n=s.stop-s.start; x=band(noise[s],lo,hi)*env(n,ea,er)
    if am is not None: x*=am(t[s]-a)
    out[s]+=amp*x
dr=0.5*np.sin(2*np.pi*49*t)+0.3*np.sin(2*np.pi*73.4*t)+0.5*band(noise,30,140)
gd=np.full(N,0.05); gd[seg(T[3],T[4])]=0.01; gd[seg(T[25],END)]=0.08
out+=dr*np.convolve(gd,np.ones(4800)/4800,'same')
for k in d['KN']: boom(k,0.45,70,10); clank(k,0.12)
for b in np.arange(T[1],T[3]+1,0.12): add(b,tone(2400,0.03,80,0.04))
for j in (0.2,0.35): add(T[4]+j,tone(1200,0.15,25,0.1))
burst(T[5],T[8],2000,7000,0.04)
for k0,k1 in [(8,12),(18,21),(27,len(T))]:
    for b in np.arange(T[k0],T[k1-1] if k1<len(T) else END-0.5,0.75): boom(b,0.18,55,9); boom(b+0.18,0.12,50,10)
for k in (10,19):
    for i in range(6): add(T[k]-2+i,tone(1800 if i<5 else 900,0.1,40,0.18))
for k in (11,20): boom(T[k],0.5,60,5); clank(T[k],0.18)
for k in (8,18,27):
    for j in (0.25,0.4): add(T[k]+j,tone(1200,0.15,25,0.1))
burst(T[12],T[15],300,2500,0.18,0.6,0.4,lambda x: 0.6+0.4*np.sin(2*np.pi*0.7*x))
span=T[15]-T[13]
for k in range(7): add(T[13]+k*span/7,tone(1500,0.12,30,0.12)+tone(2000,0.12,35,0.06))
burst(T[16],T[17],250,2200,0.3,0.3,0.3,lambda x: 0.5+0.5*np.abs(np.sin(2*np.pi*1.3*x)))
for h in d['MH']: boom(h,0.4,80,12); add(h,0.15*band(noise[seg(0,0.25)],2000,8000)*np.exp(-np.arange(int(0.25*SR))/SR*20))
burst(T[17],T[18],300,2000,0.2)
burst(T[23],T[25],100,600,0.16,0.3,0.2,lambda x: 0.6+0.4*np.sin(2*np.pi*3*x))
for k in np.arange(T[23],T[25],0.66): clank(k,0.12)
boom(T[24],0.6,40,3)
s=0.0
for b in np.arange(T[25],T[27],1): pass
x=T[25]; step=0.32
while x<T[27]:
    boom(x,0.2+0.25*(x-T[25])/(T[27]-T[25]),90,18); x+=step*(0.7+rng.random()*0.6); step*=0.97
burst(T[25]+0.5,T[27],150,900,0.12,0.5,0.1)
for i in range(1,len(K)):
    if K[i]!=K[i-1]:
        st=T[i]-0.18; sg=seg(st,st+0.45); n=sg.stop-sg.start
        out[sg]+=0.35*band(noise[sg],400,6000)*np.sin(np.linspace(0,np.pi,n))**3
boom(T[29],0.7,36,2)
out/=max(1,np.abs(out).max()/0.9)
with wave.open('sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
