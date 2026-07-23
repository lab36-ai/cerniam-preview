(()=>{
const resources={
shopify:{status:'Active resource',title:'Shopify Commerce',meta:'commerce · source system',contract:'order.created → customer.order projected',observes:'Health · order schema · event receipts · binding',authority:'Shopify owns commerce transactions. Cortex owns cross-system operational context.'},
wms:{status:'Active resource',title:'Manhattan Active WMS',meta:'wms · fulfillment',contract:'inventory.changed → fulfillment.projected',observes:'Health · schema · receipts · binding',authority:'WMS owns execution. Cortex owns operational projection.'},
salesforce:{status:'Attention required',title:'Salesforce Service Cloud',meta:'service cloud · customer care',contract:'case.updated → customer-risk attention',observes:'Schema drift · health · delayed receipt · binding',authority:'Service Cloud owns case work. Cortex owns enterprise attention context.'},
fedex:{status:'Live wire',title:'FedEx Ship API',meta:'carrier · external API',contract:'shipment.status → delivery commitment',observes:'Endpoint health · latency · receipts · credentials',authority:'FedEx owns carrier movement. Cortex owns commitment projection.'},
oms:{status:'Active resource',title:'Manhattan Active OMS',meta:'oms · order orchestration',contract:'order.state → orchestration progressor',observes:'Health · state contract · receipts · binding',authority:'OMS owns orchestration execution. Cortex owns cross-domain state context.'},
sap:{status:'Active resource',title:'SAP S/4HANA',meta:'erp · finance',contract:'financial.posting → operational consequence',observes:'Health · IDoc schema · receipts · binding',authority:'SAP owns financial truth. Cortex owns operational consequence context.'},
stripe:{status:'Active resource',title:'Stripe Payments',meta:'payments · transaction service',contract:'payment.intent → payment commitment',observes:'Webhook health · schema · receipts · credentials',authority:'Stripe owns payment execution. Cortex owns fulfillment impact context.'},
akeneo:{status:'Registered fixture',title:'Akeneo PIM',meta:'pim · product',contract:'product.updated → catalog projection',observes:'Registration · schema · fixture health · binding',authority:'PIM owns product definition. Cortex consumes governed product context.'}
};
const cards=[...document.querySelectorAll('.system-card')];
const paths=[...document.querySelectorAll('[data-link]')];
const slots={status:document.querySelector('[data-slot="status"]'),title:document.querySelector('[data-slot="title"]'),meta:document.querySelector('[data-slot="meta"]'),contract:document.querySelector('[data-slot="contract"]'),observes:document.querySelector('[data-slot="observes"]'),authority:document.querySelector('[data-slot="authority"]')};
const setHighlight=id=>paths.forEach(path=>path.classList.toggle('is-highlighted',path.dataset.link===id));
const clearHighlight=()=>{const selected=document.querySelector('.system-card.is-selected');setHighlight(selected?.dataset.system)};
const select=id=>{const data=resources[id];if(!data)return;cards.forEach(card=>{const active=card.dataset.system===id;card.classList.toggle('is-selected',active);card.setAttribute('aria-pressed',String(active))});Object.entries(slots).forEach(([key,node])=>{if(node)node.textContent=data[key]});setHighlight(id)};
cards.forEach(card=>{const id=card.dataset.system;card.addEventListener('mouseenter',()=>setHighlight(id));card.addEventListener('mouseleave',clearHighlight);card.addEventListener('focus',()=>setHighlight(id));card.addEventListener('blur',clearHighlight);card.addEventListener('click',()=>select(id))});
select('wms');
})();
