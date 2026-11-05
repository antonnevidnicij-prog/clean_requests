import numpy as np, wave, json
d=json.load(open('timeline.json')); T=d['T']; END=d['END']; K=d['K']
SR=48000; N=int(SR*END); t=np.arange(N)/SR
rng=np.random.default_rng(11); noise=rng.standard_normal(N); out=np.zeros(N)
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
def crack(at,amp):
    s=seg(at,at+0.6); tt=t[s]-at; out[s]+=amp*band(noise[s],1500,9000)*np.exp(-tt*14)
def shot(K0): return [i for i,k in enumerate(K) if k==K0]
# wind with gusts (always), louder outside
gust=np.convolve(rng.random(N//2400+2),np.ones(3)/3,'same'); gust=np.interp(t,np.arange(len(gust))*0.05,gust)
wind=band(noise,150,1400)*(0.4+0.6*gust)
gw=np.full(N,0.10)
for k in ('LAB','RADIO','D2'):
    for i in shot(k): gw[seg(T[i],T[i+1] if i+1<len(T) else END)]=0.035
for i in shot('NIGHT')+shot('TRACKS')+shot('D3'): gw[seg(T[i],T[i+1] if i+1<len(T) else END)]=0.07
out+=wind*np.convolve(gw,np.ones(9600)/9600,'same')
# cold pad
pad=0.3*np.sin(2*np.pi*110*t)+0.2*np.sin(2*np.pi*164.8*t)+0.15*np.sin(2*np.pi*246.9*t*(1+0.002*np.sin(2*np.pi*0.2*t)))
out+=0.035*pad
# drill rumble
for i in shot('SNOW')+shot('SHAFT'):
    s=seg(T[i],T[i+1]); n=s.stop-s.start; out[s]+=0.25*band(noise[s],30,160)*env(n,0.3,0.3)*(0.7+0.3*np.sin(2*np.pi*7*(t[s])))
for i in shot('SHAFT')[1:]:
    s=seg(T[i],T[i+1]); n=s.stop-s.start; out[s]+=0.18*band(noise[s],300,2500)*np.linspace(0,1,n)**2
# hand reveal: crack + boom
crack(T[2]+2.55,0.6); boom(T[2]+2.6,0.6,38,3)
# plane fading
for i in shot('BASE')[2:3]:
    s=seg(T[i],T[i]+4); n=s.stop-s.start; tt=t[s]-T[i]; out[s]+=0.2*band(noise[s],80,500)*np.exp(-tt*0.7)*env(n,0.2,0.3)
for k in range(14): add(T[4]+k*0.07+0.1,tone(1500+k*30,0.12,30,0.06))
boom(T[6],0.35,60,6)
# radar pings
for i in shot('RADAR')[:1]:
    e=T[shot('RADAR')[-1]+1]
    for b in np.arange(T[i],e,1/0.55): add(b,tone(1050,0.6,6,0.12)+tone(1575,0.6,9,0.05))
# radio static / lost
for i in shot('RADIO'):
    s=seg(T[i],T[i+1]); n=s.stop-s.start; out[s]+=0.07*band(noise[s],1500,6000)*env(n,0.05,0.05)
crack(T[19],0.3)
# lab drips + generator hum (stops in NIGHT)
for i in shot('LAB')+shot('D2'):
    for b in np.arange(T[i],T[i+1],0.42): add(b+rng.random()*0.1,tone(1800+rng.random()*500,0.15,30,0.05))
hs,he=T[shot('LAB')[0]],T[shot('NIGHT')[1]]+0.5
s=seg(hs,he); tt=t[s]-hs; fall=np.clip((t[s]-(he-0.8))/0.8,0,1)
out[s]+=0.05*np.sin(2*np.pi*(100-60*fall)*tt)*(1-fall)
boom(he,0.5,40,3)
for b in np.arange(T[shot('NIGHT')[2]],T[shot('TRACKS')[0]],0.9): crack(b+rng.random()*0.5,0.12)
crack(T[shot('NIGHT')[-1]]+0.3,0.4); boom(T[shot('NIGHT')[-1]]+0.3,0.4,50,5)
# heartbeat under tracks + decision 3
for b in np.arange(T[shot('TRACKS')[0]],END-0.5,0.8): boom(b,0.18,55,9); boom(b+0.18,0.12,50,10)
# decisions
for k0 in (shot('D1')[0],shot('D2')[0]):
    for b in np.arange(T[k0],T[k0+2],0.75): boom(b,0.16,55,9); boom(b+0.18,0.1,50,10)
for k in (shot('D1')[1],shot('D2')[1]):
    for i in range(6): add(T[k]-2+i,tone(1800 if i<5 else 900,0.1,40,0.18))
for k in (shot('D1')[2],shot('D2')[2]): boom(T[k],0.5,60,5)
for k in (shot('D1')[0],shot('D2')[0],shot('D3')[0]):
    for j in (0.25,0.4): add(T[k]+j,tone(1200,0.15,25,0.1))
boom(T[shot('D3')[-1]],0.6,36,2)
for i in range(1,len(K)):
    if K[i]!=K[i-1]:
        st=T[i]-0.18; sg=seg(st,st+0.45); n=sg.stop-sg.start
        out[sg]+=0.3*band(noise[sg],400,6000)*np.sin(np.linspace(0,np.pi,n))**3
out/=max(1,np.abs(out).max()/0.9)
with wave.open('sfx.wav','wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((out*32767).astype(np.int16).tobytes())
