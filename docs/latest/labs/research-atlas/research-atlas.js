(()=>{
const resources={
  commerce:{status:'Mapped contract',title:'Commerce record',meta:'orders · customer intent',contract:'order.created → demand context',observes:'health · order schema · event time · receipts',authority:'The commerce system owns transaction state. Cortex maintains cross-system demand context.'},
  fulfillment:{status:'Mapped contract',title:'Fulfillment record',meta:'inventory · execution',contract:'inventory.changed → fulfillment context',observes:'health · schema · event time · receipts',authority:'The fulfillment system owns execution. Cortex maintains cross-system operational context.'},
  care:{status:'Review required',title:'Customer-care record',meta:'cases · service state',contract:'case.updated → customer-risk attention',observes:'schema drift · health · delayed receipt · binding',authority:'The customer-care system owns case work. Cortex maintains enterprise attention context.'},
  carrier:{status:'External wire',title:'Carrier network',meta:'movement · commitment',contract:'shipment.status → delivery commitment',observes:'endpoint health · latency · event time · credentials',authority:'The carrier network owns movement state. Cortex maintains commitment context.'},
  orchestration:{status:'Mapped contract',title:'Order orchestration',meta:'order state · routing',contract:'order.state → orchestration context',observes:'health · state contract · event time · binding',authority:'The orchestration system owns workflow execution. Cortex maintains cross-domain order context.'},
  finance:{status:'Mapped contract',title:'Finance record',meta:'posting · settlement',contract:'financial.posting → operational consequence',observes:'health · posting schema · event time · receipts',authority:'The finance system owns the financial record. Cortex maintains operational consequence context.'},
  payments:{status:'Mapped contract',title:'Payment record',meta:'authorization · capture',contract:'payment.state → commitment context',observes:'endpoint health · schema · event time · receipts',authority:'The payment system owns transaction execution. Cortex maintains downstream impact context.'},
  product:{status:'Registered source',title:'Product record',meta:'definition · catalog',contract:'product.updated → governed catalog context',observes:'registration · schema · version · binding',authority:'The product system owns product definition. Cortex consumes governed product context.'}
};
const cards=[...document.querySelectorAll('.source-card')];
const slots={status:document.querySelector('[data-slot="status"]'),title:document.querySelector('[data-slot="title"]'),meta:document.querySelector('[data-slot="meta"]'),contract:document.querySelector('[data-slot="contract"]'),observes:document.querySelector('[data-slot="observes"]'),authority:document.querySelector('[data-slot="authority"]')};
const select=id=>{
  const data=resources[id];
  if(!data)return;
  cards.forEach(card=>{const active=card.dataset.source===id;card.classList.toggle('is-selected',active);card.setAttribute('aria-pressed',String(active))});
  Object.entries(slots).forEach(([key,node])=>{if(node)node.textContent=data[key]});
};
cards.forEach(card=>card.addEventListener('click',()=>select(card.dataset.source)));
select('fulfillment');
})();
