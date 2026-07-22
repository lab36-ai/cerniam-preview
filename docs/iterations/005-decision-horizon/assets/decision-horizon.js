const scene=document.querySelector('.cinema-scene');
const canvas=document.querySelector('#signal-field');
const ctx=canvas.getContext('2d');
const replay=document.querySelector('.replay');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let width=0,height=0,dpr=1,start=performance.now(),raf=0,settleTimer=0;
const seeds=Array.from({length:96},(_,i)=>{const a=(i*2.3999632297)%(Math.PI*2);return{a,ring:.32+((i*37)%67)/100,phase:(i*53)%997/997,speed:.35+((i*19)%50)/100,size:i%11===0?1.7:.7}});
function resize(){dpr=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
function ease(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),4)}
function draw(now){ctx.clearRect(0,0,width,height);const elapsed=(now-start)/1000,settle=ease((elapsed-.3)/4.4),cx=width/2,cy=height/2,rx=Math.min(width*.47,650),ry=Math.min(height*.25,235);for(const [i,s] of seeds.entries()){const theta=s.a+(1-settle)*2.4+Math.sin(elapsed*s.speed+s.phase*6.28)*.012,far=1+(1-settle)*(2.8+s.ring*2),x=cx+Math.cos(theta)*rx*s.ring*far,y=cy+Math.sin(theta)*ry*s.ring*far,alpha=(.05+s.ring*.18)*Math.min(1,elapsed/1.2);ctx.beginPath();ctx.fillStyle=`rgba(230,185,99,${alpha})`;ctx.arc(x,y,s.size,0,Math.PI*2);ctx.fill();if(i%9===0&&elapsed>1){const tail=16+22*(1-settle);ctx.beginPath();ctx.strokeStyle=`rgba(184,139,55,${alpha*.45})`;ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(theta)*tail,y-Math.sin(theta)*tail);ctx.stroke()}}if(!reduce)raf=requestAnimationFrame(draw)}
function play(){cancelAnimationFrame(raf);clearTimeout(settleTimer);scene.classList.remove('ready','settled');void scene.offsetWidth;start=performance.now();scene.classList.add('ready');if(!reduce)raf=requestAnimationFrame(draw);settleTimer=setTimeout(()=>scene.classList.add('settled'),6900)}
addEventListener('resize',resize,{passive:true});replay.addEventListener('click',play);resize();if(reduce){draw(performance.now()+7000);scene.classList.add('ready','settled')}else play();