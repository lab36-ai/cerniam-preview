(()=>{
  const current=document.querySelector('.nav-item[aria-current="page"]');
  if(current&&current.parentElement.scrollWidth>current.parentElement.clientWidth){
    current.scrollIntoView({block:'nearest',inline:'nearest'});
  }

  const modelData={
    entity:{title:'Cortex Entity R3',summary:'Resolves operational events into persistent enterprise entities and current relationships.',base:'Cerniam encoder / graph projection',params:'1.7B',license:'Research evaluation',owner:'Operational Knowledge',metric:'F1 0.917',latency:'P50 86 ms',bar:'91.7%',use:'Entity continuity across live commerce, fulfillment, and service events.'},
    reason:{title:'Reason Ops R2',summary:'Ranks operational interventions against live constraints, policy, and current enterprise state.',base:'Cerniam reasoner / constraint head',params:'3.2B',license:'Internal research',owner:'Real-Time Reasoning',metric:'NDCG 0.884',latency:'P50 131 ms',bar:'88.4%',use:'Recommendation ranking for time-sensitive operational decisions.'},
    authority:{title:'Authority R1',summary:'Evaluates proposed actions against declared system, role, policy, and financial boundaries.',base:'Policy encoder / rules projection',params:'680M',license:'Apache 2.0',owner:'Governed Action',metric:'PASS 99.6%',latency:'P50 24 ms',bar:'99.6%',use:'Pre-action authorization and explanation for bounded enterprise agents.'},
    forecast:{title:'Flow Forecast R4',summary:'Forecasts near-term pressure across order, inventory, fulfillment, and carrier flows.',base:'Temporal graph transformer',params:'2.4B',license:'Research evaluation',owner:'Enterprise Simulation',metric:'MAPE 6.8%',latency:'HORIZON 4 h',bar:'86%',use:'Short-horizon operating pressure forecasts; not long-range demand planning.'}
  };

  const rows=[...document.querySelectorAll('.model-row')];
  function selectModel(key){
    const data=modelData[key];
    if(!data)return;
    rows.forEach(row=>{
      const selected=row.dataset.model===key;
      row.classList.toggle('is-selected',selected);
      row.setAttribute('aria-pressed',selected?'true':'false');
    });
    for(const [slot,value] of Object.entries(data)){
      const element=document.querySelector(`[data-model-slot="${slot}"]`);
      if(!element)continue;
      if(slot==='bar')element.style.width=value;
      else element.textContent=value;
    }
  }

  rows.forEach((row,index)=>{
    row.addEventListener('click',()=>selectModel(row.dataset.model));
    row.addEventListener('keydown',event=>{
      if(!['ArrowDown','ArrowUp'].includes(event.key))return;
      event.preventDefault();
      const next=(index+(event.key==='ArrowDown'?1:-1)+rows.length)%rows.length;
      rows[next].focus();
      selectModel(rows[next].dataset.model);
    });
  });

  if(rows.length)selectModel('entity');
})();
