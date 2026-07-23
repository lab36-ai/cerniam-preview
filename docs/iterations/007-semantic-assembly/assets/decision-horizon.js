const scene=document.querySelector('.cinema-scene');
const canvas=document.querySelector('#signal-field');
const ctx=canvas.getContext('2d');
const replay=document.querySelector('.replay');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let width=0,height=0,dpr=1,start=performance.now(),raf=0,settleTimer=0;
const signals=Array.from({length:72},(_,i)=>({side:i%2?-1:1,lane:((i*17)%37-18)/18,slot:(i*11)%22,phase:((i*47)%101)/101,size:i%13===0?1.8:.75,priority:i%12===0}));
function resize(){dpr=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
function ease(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),4)}
function draw(now){ctx.clearRect(0,0,width,height);const elapsed=(now-start)/1000,settle=ease((elapsed-.2)/4.6),cx=width/2,cy=height/2;for(const s of signals){const startX=cx+s.side*(width*.72+s.slot*16),targetX=cx+s.side*(width*.12+s.slot*width*.011),startY=cy+s.lane*height*.58,targetY=cy+s.lane*height*.34;const x=startX+(targetX-startX)*settle+Math.sin(elapsed*.45+s.phase*6.28)*2.4,y=startY+(targetY-startY)*settle;const alpha=(.08+(1-Math.abs(s.lane))*.18)*Math.min(1,elapsed/.9),tail=18+(1-settle)*54;ctx.beginPath();ctx.strokeStyle=s.priority?`rgba(255,255,255,${alpha*.55})`:`rgba(0,139,139,${alpha*.72})`;ctx.lineWidth=s.priority?1.15:.75;ctx.moveTo(x-s.side*tail,y);ctx.lineTo(x,y);ctx.stroke();ctx.beginPath();ctx.fillStyle=s.priority?`rgba(255,255,255,${alpha})`:`rgba(82,199,199,${alpha})`;ctx.arc(x,y,s.size,0,Math.PI*2);ctx.fill()}if(!reduce)raf=requestAnimationFrame(draw)}
function play(){cancelAnimationFrame(raf);clearTimeout(settleTimer);scene.classList.remove('ready','settled');void scene.offsetWidth;start=performance.now();scene.classList.add('ready');if(!reduce)raf=requestAnimationFrame(draw);settleTimer=setTimeout(()=>scene.classList.add('settled'),10200)}
addEventListener('resize',resize,{passive:true});replay.addEventListener('click',play);resize();if(reduce){draw(performance.now()+7000);scene.classList.add('ready','settled')}else play();