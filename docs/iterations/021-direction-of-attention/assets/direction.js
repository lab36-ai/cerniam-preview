(()=>{
  const root=document.querySelector('.compare');
  const range=document.querySelector('#comparison-slider');
  const buttons=[...document.querySelectorAll('.presets button')];
  let dragging=false,touchOrigin=null;

  function set(value){
    const v=Math.max(0,Math.min(100,Number(value)));
    root.style.setProperty('--split',`${v}%`);
    root.dataset.mode=v<=5?'back':v>=95?'forward':'split';
    range.value=v;
    buttons.forEach(button=>button.classList.toggle('active',Number(button.dataset.value)===v));
    range.setAttribute('aria-valuetext',v===0?'Classic architecture: look back':v===100?'Cerniam architecture: look forward':`${v} percent Cerniam architecture revealed`);
  }
  function setFromClientX(clientX){const rect=range.getBoundingClientRect();set(Math.round(((clientX-rect.left)/rect.width)*100))}

  range.addEventListener('input',event=>set(event.target.value));
  range.addEventListener('pointerdown',event=>{dragging=true;range.setPointerCapture(event.pointerId);setFromClientX(event.clientX)});
  range.addEventListener('pointermove',event=>{if(dragging)setFromClientX(event.clientX)});
  range.addEventListener('pointerup',()=>dragging=false);
  range.addEventListener('pointercancel',()=>dragging=false);
  range.addEventListener('touchstart',event=>{const t=event.touches[0];touchOrigin={x:t.clientX,y:t.clientY,horizontal:false,vertical:false}},{passive:true});
  range.addEventListener('touchmove',event=>{if(!touchOrigin)return;const t=event.touches[0],dx=t.clientX-touchOrigin.x,dy=t.clientY-touchOrigin.y;if(!touchOrigin.horizontal&&!touchOrigin.vertical&&Math.max(Math.abs(dx),Math.abs(dy))>8){touchOrigin.horizontal=Math.abs(dx)>Math.abs(dy);touchOrigin.vertical=!touchOrigin.horizontal}if(touchOrigin.horizontal){event.preventDefault();setFromClientX(t.clientX)}},{passive:false});
  range.addEventListener('touchend',event=>{if(touchOrigin&&!touchOrigin.vertical&&!touchOrigin.horizontal&&event.changedTouches[0])setFromClientX(event.changedTouches[0].clientX);touchOrigin=null},{passive:true});
  buttons.forEach(button=>button.addEventListener('click',()=>set(button.dataset.value)));

  const reveals=[...document.querySelectorAll('.reveal')];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)reveals.forEach(element=>element.classList.add('visible'));
  else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});reveals.forEach(element=>observer.observe(element))}

  set(50);
  window.__direction021={set,get value(){return Number(range.value)}};
})();
