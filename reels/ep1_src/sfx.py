import numpy as np, wave
SR=48000; D=89.5; N=int(SR*D); t=np.arange(N)/SR
rng=np.random.default_rng(7)
out=np.zeros(N)
def band(x,lo,hi):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); X[(f<lo)|(f>hi)]=0; return np.fft.irfft(X,len(x))
def seg(a,b): return slice(int(a*SR),min(N,int(b*SR)))
def env(n,att,rel):
    e=np.ones(n); a=int(att*SR); r=int(rel*SR)
    if a: e[:a]=np.linspace(0,1,a)
    if r: e[-r:]*=np.linspace(1,0,r)
    return e
noise=rng.standard_normal(N)
# drone
dr=0.5*np.sin(2*np.pi*55*t)+0.35*np.sin(2*np.pi*82.4*t)*(0.6+0.4*np.sin(2*np.pi*0.07*t))+0.6*band(noise,30,160)
g=np.full(N,0.05)
g[seg(55.4,57.6)]=0.008; g[seg(78.6,89.5)]=0.08
g=np.convolve(g,np.ones(4800)/4800,'same')
out+=dr*g
# sirens
def siren(a,b,amp):
    s=seg(a,b); tt=t[s]-a; ph=2*np.pi*(700*tt-200/(2*np.pi*0.7)*np.cos(2*np.pi*0.7*tt))
    out[s]+=amp*np.sin(ph)*env(len(tt),0.3,0.6)*(0.7+0.3*np.sign(np.sin(ph*3)))*0.8
siren(0,1.6,0.05); siren(32.45,36.8,0.11)
# dive whoosh
s=seg(1.5,5.8); n=s.stop-s.start; w=band(noise[s],60,900)*np.sin(np.linspace(0,np.pi,n))**2; out[s]+=0.35*w
def boom(at,amp,f=55,dec=5):
    s=seg(at,at+2.5); tt=t[s]-at
    out[s]+=amp*(np.sin(2*np.pi*f*tt*(1-0.3*tt/2.5))*np.exp(-tt*dec)+0.5*band(noise[s],40,400)*np.exp(-tt*dec*2))
def clank(at,amp):
    s=seg(at,at+2.0); tt=t[s]-at
    out[s]+=amp*sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f,k in [(173,3),(419,4),(967,6),(1530,8)])/3
clank(8.0,0.25); clank(50.72,0.3)
for h in [50.75,51.1,51.55,52.25,52.7,53.2]: boom(h,0.55,48,6)
boom(50.72,0.7,40,3); boom(12.4,0.35,45,3); boom(78.64,0.8,38,2.5); boom(86.4,0.6,42,2)
# crowd panic murmur
s=seg(37.1,50.9); n=s.stop-s.start
am=np.convolve(rng.random(n),np.ones(2400)/2400,'same')
out[s]+=0.25*band(noise[s],300,2500)*am*env(n,1.0,0.4)
# gate grinding
s=seg(47.7,50.7); tt=t[s]-47.7; n=len(tt)
out[s]+=0.18*band(noise[s],120,700)*(0.6+0.4*np.sin(2*np.pi*11*tt))*env(n,0.2,0.1)
# rails rumble + clacks
s=seg(79.7,89.5); n=s.stop-s.start
out[s]+=0.4*band(noise[s],25,220)*np.linspace(0,1,n)**2
for k in np.arange(83.0,89.3,0.85):
    for d in (0,0.13): clank(k+d,0.06*(k-82)/7)
out/=max(1,np.abs(out).max()/0.9)
pcm=(out*32767).astype(np.int16)
with wave.open('sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm.tobytes())
