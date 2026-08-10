(()=>{
  const track=document.querySelector('[data-research-carousel]');
  const previous=document.querySelector('[data-carousel-previous]');
  const next=document.querySelector('[data-carousel-next]');
  if(!track||!previous||!next)return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const step=()=>{
    const card=track.querySelector('.research-carousel-card');
    if(!card)return track.clientWidth;
    return card.getBoundingClientRect().width+1;
  };

  const update=()=>{
    const max=Math.max(0,track.scrollWidth-track.clientWidth);
    previous.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft>=max-2;
  };

  const move=direction=>{
    track.scrollBy({left:direction*step(),behavior:reduced.matches?'auto':'smooth'});
  };

  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',update,{passive:true});
  track.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    move(event.key==='ArrowLeft'?-1:1);
  });
  window.addEventListener('resize',update,{passive:true});
  update();
})();
