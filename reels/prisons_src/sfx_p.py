import numpy as np, wave, json, sys
V=sys.argv[1]; d=json.load(open(f'timeline_{V}.json')); T=d['T']; END=d['END']; K=d['K']
SR=48000; N=int(SR*END); t=np.arange(N)/SR
rng=np.random.default_rng(7); noise=rng.standard_normal(N); out=np.zeros(N)
def band(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X[(f<lo)|(f>hi)]=0; return np.fft.irfft(X,len(x))
def seg(a,b): return slice(max(0,int(a*SR)),min(N,int(b*SR)))
def add(a,sig):
    k=int(a*SR); m=min(len(sig),N-k)
    if m>0: out[k:k+m]+=sig[:m]
def tone(f,dur,dec,amp): tt=np.arange(int(dur*SR))/SR; return amp*np.sin(2*np.pi*f*tt)*np.exp(-tt*dec)
def boom(at,amp,f=45,dec=4):
    s=seg(at,at+2.5); tt=t[s]-at
    out[s]+=amp*(np.sin(2*np.pi*f*tt*(1-0.3*tt/2.5))*np.exp(-tt*dec)+0.5*band(noise[s],40,350)*np.exp(-tt*dec*2))
out+=0.05*(0.5*np.sin(2*np.pi*41*t)+0.3*np.sin(2*np.pi*61.5*t)+0.5*band(noise,30,120))
amb={'swan':(200,1500,0.07),'alc':(80,900,0.09),'adx':(300,2500,0.05)}[V]
gust=np.interp(t,np.arange(N//2400+2)*0.05,np.convolve(rng.random(N//2400+2),np.ones(3)/3,'same'))
out+=amb[2]*band(noise,amb[0],amb[1])*(0.5+0.5*gust)
boom(T[0]+0.3,0.6,40,2.5)
for i in range(1,len(K)):
    if K[i]!=K[i-1]:
        st=T[i]-0.18; sg=seg(st,st+0.45); n=sg.stop-sg.start
        out[sg]+=0.3*band(noise[sg],400,6000)*np.sin(np.linspace(0,np.pi,n))**3
    boom(T[i]+0.2,0.25,55,7)
e=[i for i,k in enumerate(K) if k=='END'][0]
for j in (0.25,0.4): add(T[e]+j,tone(1200,0.15,25,0.1))
for x in np.arange(T[e],END-0.5,0.8): boom(x,0.16,55,9); boom(x+0.18,0.1,50,10)
boom(T[e+1],0.6,36,2)
out/=max(1,np.abs(out).max()/0.9)
with wave.open(f'sfx_{V}.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
