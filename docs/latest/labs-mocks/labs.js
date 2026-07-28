(()=>{
const views=[...document.querySelectorAll('[data-screen]')];
const nav=[...document.querySelectorAll('.nav-item')];
const workspace=document.querySelector('#workspace');
const valid=new Set(views.map(v=>v.dataset.screen));
function setView(name,{focus=false}={}){
 if(!valid.has(name))name='index';
 views.forEach(v=>{const on=v.dataset.screen===name;v.hidden=!on;v.classList.toggle('is-active',on)});
 const navName=name==='researcher'?'researchers':name;
 nav.forEach(b=>{const on=b.dataset.view===navName;b.classList.toggle('is-active',on);b.setAttribute('aria-current',on?'page':'false')});
 const activeNav=nav.find(b=>b.dataset.view===navName);
 if(activeNav&&activeNav.parentElement.scrollWidth>activeNav.parentElement.clientWidth)activeNav.scrollIntoView({block:'nearest',inline:'nearest'});
 if(location.hash.slice(1)!==name)history.replaceState(null,'','#'+name);
 const titles={index:'Research Index',report:'Research Report',models:'Model Registry',case:'Applied Research',researchers:'Researchers',researcher:'Researcher Profile'};
 document.title=`Cerniam Labs — ${titles[name]}`;
 if(focus){workspace.focus({preventScroll:true});scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
}
nav.forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view,{focus:true})));
document.querySelectorAll('[data-view-link]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setView(a.dataset.viewLink,{focus:true})}));
addEventListener('hashchange',()=>setView(location.hash.slice(1)));
const modelData={
 entity:{title:'Cortex Entity R3',summary:'Resolves operational events into persistent enterprise entities and current relationships.',base:'Cerniam encoder / graph projection',params:'1.7B',license:'Research evaluation',owner:'Operational Knowledge',metric:'F1 0.917',latency:'P50 86 ms',bar:'91.7%',use:'Entity continuity across live commerce, fulfillment, and service events.'},
 reason:{title:'Reason Ops R2',summary:'Ranks operational interventions against live constraints, policy, and current enterprise state.',base:'Cerniam reasoner / constraint head',params:'3.2B',license:'Internal research',owner:'Real-Time Reasoning',metric:'NDCG 0.884',latency:'P50 131 ms',bar:'88.4%',use:'Recommendation ranking for time-sensitive operational decisions.'},
 authority:{title:'Authority R1',summary:'Evaluates proposed actions against declared system, role, policy, and financial boundaries.',base:'Policy encoder / rules projection',params:'680M',license:'Apache 2.0',owner:'Governed Action',metric:'PASS 99.6%',latency:'P50 24 ms',bar:'99.6%',use:'Pre-action authorization and explanation for bounded enterprise agents.'},
 forecast:{title:'Flow Forecast R4',summary:'Forecasts near-term pressure across order, inventory, fulfillment, and carrier flows.',base:'Temporal graph transformer',params:'2.4B',license:'Research evaluation',owner:'Enterprise Simulation',metric:'MAPE 6.8%',latency:'HORIZON 4 h',bar:'86%',use:'Short-horizon operating pressure forecasts; not long-range demand planning.'}
};
const rows=[...document.querySelectorAll('.model-row')];
function selectModel(key){const d=modelData[key];if(!d)return;rows.forEach(r=>{const on=r.dataset.model===key;r.classList.toggle('is-selected',on);r.setAttribute('aria-pressed',on?'true':'false')});for(const [k,v] of Object.entries(d)){const el=document.querySelector(`[data-model-slot="${k}"]`);if(!el)continue;if(k==='bar')el.style.width=v;else el.textContent=v}}
rows.forEach((r,i)=>{r.addEventListener('click',()=>selectModel(r.dataset.model));r.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const n=(i+(e.key==='ArrowDown'?1:-1)+rows.length)%rows.length;rows[n].focus();selectModel(rows[n].dataset.model)})});
setView(location.hash.slice(1)||'index');selectModel('entity');
})();
