(()=>{
  const root=document.querySelector('.compare');
  const range=document.querySelector('#comparison-slider');
  const buttons=[...document.querySelectorAll('.presets button')];
  let dragging=false;

  function set(value){
    const v=Math.max(0,Math.min(100,Number(value)));
    root.style.setProperty('--split',`${v}%`);
    root.dataset.mode=v<=5?'back':v>=95?'forward':'split';
    range.value=v;
    buttons.forEach(button=>button.classList.toggle('active',Number(button.dataset.value)===v));
    range.setAttribute('aria-valuetext',v===0?'Classic architecture: look back':v===100?'Cerniam architecture: look forward':`${v} percent Cerniam architecture revealed`);
  }

  function setFromClientX(clientX){
    const rect=range.getBoundingClientRect();
    set(Math.round(((clientX-rect.left)/rect.width)*100));
  }

  function setFromPointer(event){
    setFromClientX(event.clientX);
  }

  let touchOrigin=null;
  range.addEventListener('touchstart',event=>{
    const touch=event.touches[0];
    touchOrigin={x:touch.clientX,y:touch.clientY,horizontal:false,vertical:false};
  },{passive:true});
  range.addEventListener('touchmove',event=>{
    if(!touchOrigin) return;
    const touch=event.touches[0];
    const dx=touch.clientX-touchOrigin.x;
    const dy=touch.clientY-touchOrigin.y;
    if(!touchOrigin.horizontal&&!touchOrigin.vertical&&Math.max(Math.abs(dx),Math.abs(dy))>8){
      touchOrigin.horizontal=Math.abs(dx)>Math.abs(dy);
      touchOrigin.vertical=!touchOrigin.horizontal;
    }
    if(touchOrigin.horizontal){
      event.preventDefault();
      setFromClientX(touch.clientX);
    }
  },{passive:false});
  range.addEventListener('touchend',event=>{
    if(touchOrigin&&!touchOrigin.vertical&&!touchOrigin.horizontal&&event.changedTouches[0]) setFromClientX(event.changedTouches[0].clientX);
    touchOrigin=null;
  },{passive:true});

  range.addEventListener('input',event=>set(event.target.value));
  range.addEventListener('pointerdown',event=>{
    dragging=true;
    range.setPointerCapture(event.pointerId);
    setFromPointer(event);
  });
  range.addEventListener('pointermove',event=>{
    if(dragging) setFromPointer(event);
  });
  range.addEventListener('pointerup',()=>dragging=false);
  range.addEventListener('pointercancel',()=>dragging=false);
  buttons.forEach(button=>button.addEventListener('click',()=>set(button.dataset.value)));

  set(50);
  window.__lookDirection={set,get value(){return Number(range.value)}};
})();
