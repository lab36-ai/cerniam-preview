(()=>{
  const dialog=document.querySelector('.direction-dialog');
  const open=document.querySelector('.direction-open');
  const close=document.querySelector('.dir-close');
  const root=document.querySelector('.dir-compare');
  const range=document.querySelector('.dir-range');
  const buttons=[...document.querySelectorAll('.dir-presets button')];
  if(!dialog||!open||!close||!root||!range)return;
  let dragging=false,touchOrigin=null;
  function set(value){
    const v=Math.max(0,Math.min(100,Number(value)));
    root.style.setProperty('--dir-split',`${v}%`);
    root.dataset.dirMode=v>=95?'back':v<=5?'forward':'split';
    range.value=v;
    buttons.forEach(button=>button.classList.toggle('active',Number(button.dataset.dirValue)===v));
    const revealed=100-v;
    range.setAttribute('aria-valuetext',v===100?'Classic architecture: look back':v===0?'Cerniam architecture: look forward':`${revealed} percent Cerniam architecture revealed`);
  }
  function setFromX(clientX){const rect=range.getBoundingClientRect();set(Math.round(((clientX-rect.left)/rect.width)*100))}
  open.addEventListener('click',()=>{dialog.showModal();set(50);requestAnimationFrame(()=>range.focus())});
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  range.addEventListener('input',event=>set(event.target.value));
  range.addEventListener('pointerdown',event=>{dragging=true;range.setPointerCapture(event.pointerId);setFromX(event.clientX)});
  range.addEventListener('pointermove',event=>{if(dragging)setFromX(event.clientX)});
  range.addEventListener('pointerup',()=>dragging=false);
  range.addEventListener('pointercancel',()=>dragging=false);
  range.addEventListener('touchstart',event=>{const t=event.touches[0];touchOrigin={x:t.clientX,y:t.clientY,horizontal:false,vertical:false}},{passive:true});
  range.addEventListener('touchmove',event=>{if(!touchOrigin)return;const t=event.touches[0],dx=t.clientX-touchOrigin.x,dy=t.clientY-touchOrigin.y;if(!touchOrigin.horizontal&&!touchOrigin.vertical&&Math.max(Math.abs(dx),Math.abs(dy))>8){touchOrigin.horizontal=Math.abs(dx)>Math.abs(dy);touchOrigin.vertical=!touchOrigin.horizontal}if(touchOrigin.horizontal){event.preventDefault();setFromX(t.clientX)}},{passive:false});
  range.addEventListener('touchend',event=>{if(touchOrigin&&!touchOrigin.vertical&&!touchOrigin.horizontal&&event.changedTouches[0])setFromX(event.changedTouches[0].clientX);touchOrigin=null},{passive:true});
  buttons.forEach(button=>button.addEventListener('click',()=>set(button.dataset.dirValue)));
  dialog.addEventListener('close',()=>open.focus());
  set(50);
  window.__directionPlate={open:()=>open.click(),set,get value(){return Number(range.value)}};
})();
