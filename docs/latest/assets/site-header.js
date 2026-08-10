(()=>{
  const revealActive=()=>{
    const rail=document.querySelector('.site-nav');
    const active=rail?.querySelector('[aria-current="page"]');
    if(!rail||!active||rail.scrollWidth<=rail.clientWidth)return;
    const target=(active.offsetLeft-rail.offsetLeft)-(rail.clientWidth-active.offsetWidth)/2;
    rail.scrollLeft=Math.max(0,target);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',revealActive,{once:true});
  else revealActive();
})();
