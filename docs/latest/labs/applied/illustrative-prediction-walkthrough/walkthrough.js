const SCENARIOS = [
  {
    id: "customer-17850",
    label: "Customer 17850 · repeat household pattern",
    history: ["Heart lantern", "Glass star", "Wooden frame", "Heart lantern", "Tea-light set"],
    actual: ["Heart lantern", "Tea-light set", "Hanging star", "Ribbon reel"],
    predictions: [
      ["Wooden frame", 0.44], ["Heart lantern", 0.39], ["Glass star", 0.33],
      ["Tea-light set", 0.29], ["Cake cases", 0.25], ["Metal lantern", 0.22],
      ["Ribbon reel", 0.20], ["Bird ornament", 0.18], ["Party bunting", 0.16],
      ["Hanging star", 0.14]
    ],
    context: {
      "Wooden frame": { delta: -0.18, reason: "Low availability" },
      "Heart lantern": { delta: 0.32, reason: "Replenishable · in stock" },
      "Glass star": { filtered: true, reason: "Inventory constrained" },
      "Tea-light set": { delta: 0.48, reason: "Replenishable · basket fit" },
      "Cake cases": { filtered: true, reason: "Category mismatch" },
      "Metal lantern": { delta: -0.08, reason: "Lower decision utility" },
      "Ribbon reel": { delta: 0.55, reason: "Required complement" },
      "Bird ornament": { filtered: true, reason: "Unavailable" },
      "Party bunting": { delta: -0.05, reason: "Low basket affinity" },
      "Hanging star": { delta: 0.58, reason: "Seasonal affinity · in stock" }
    }
  },
  {
    id: "customer-13047",
    label: "Customer 13047 · seasonal gift progression",
    history: ["Birthday card", "Gift wrap", "Ribbon reel", "Christmas star", "Candle holder"],
    actual: ["Christmas star", "Candle holder", "Gift tags"],
    predictions: [
      ["Christmas star", 0.51], ["Gift tags", 0.42], ["Ribbon reel", 0.35],
      ["Candle holder", 0.31], ["Party bunting", 0.27], ["Gift wrap", 0.23],
      ["Wooden tree", 0.21], ["Glass star", 0.18], ["Paper chain", 0.16],
      ["Heart ornament", 0.13]
    ],
    context: {
      "Christmas star": { delta: 0.39, reason: "Seasonal intent · in stock" },
      "Gift tags": { delta: 0.43, reason: "Required gift complement" },
      "Ribbon reel": { delta: 0.18, reason: "Compatible complement" },
      "Candle holder": { delta: 0.48, reason: "Strong sequence relationship" },
      "Party bunting": { filtered: true, reason: "Category mismatch" },
      "Gift wrap": { filtered: true, reason: "Already observed · suppress" },
      "Wooden tree": { delta: 0.22, reason: "Seasonal catalog affinity" },
      "Glass star": { delta: -0.04, reason: "Low availability" },
      "Paper chain": { filtered: true, reason: "Unavailable" },
      "Heart ornament": { delta: 0.08, reason: "Eligible · low urgency" }
    }
  },
  {
    id: "customer-12583",
    label: "Customer 12583 · mixed basket progression",
    history: ["Lunch bag", "Storage tin", "Retro mug", "Lunch bag", "Picnic bottle"],
    actual: ["Lunch bag", "Picnic bottle", "Storage tin", "Tea towel", "Retro mug"],
    predictions: [
      ["Lunch bag", 0.58], ["Storage tin", 0.46], ["Retro mug", 0.40],
      ["Picnic bottle", 0.34], ["Tea towel", 0.30], ["Cutlery set", 0.26],
      ["Bottle carrier", 0.22], ["Cake tin", 0.19], ["Apron", 0.16],
      ["Coaster set", 0.12]
    ],
    context: {
      "Lunch bag": { delta: 0.35, reason: "Repeat pattern · replenishable" },
      "Storage tin": { delta: 0.39, reason: "Strong household relationship" },
      "Retro mug": { delta: 0.35, reason: "Sequence continuity" },
      "Picnic bottle": { delta: 0.47, reason: "Required activity complement" },
      "Tea towel": { delta: 0.42, reason: "Basket affinity · in stock" },
      "Cutlery set": { delta: 0.05, reason: "Compatible complement" },
      "Bottle carrier": { delta: 0.20, reason: "Product relationship" },
      "Cake tin": { filtered: true, reason: "Category mismatch" },
      "Apron": { delta: -0.02, reason: "Low current utility" },
      "Coaster set": { delta: 0.08, reason: "Eligible · low urgency" }
    }
  }
];

const root = document.getElementById("prediction-walkthrough");
const select = root?.querySelector("#scenario-select");
const stage = root?.querySelector(".comparison-stage");
let currentRecords = [];
let selectedKey = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function keyFor(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function scoreText(score) {
  return score.toFixed(2);
}

function movementText(modelRank, decisionRank, filtered) {
  if (filtered) return "FILTERED";
  const movement = modelRank - decisionRank;
  if (movement > 0) return `↑${movement}`;
  if (movement < 0) return `↓${Math.abs(movement)}`;
  return "—";
}

function buildRecords(scenario) {
  const records = scenario.predictions.map(([label, modelScore], index) => {
    const rule = scenario.context[label] || { delta: 0, reason: "Eligible" };
    return {
      key: keyFor(label),
      label,
      modelScore,
      modelRank: index + 1,
      decisionScore: rule.filtered ? null : Math.max(0, Math.min(0.99, modelScore + (rule.delta || 0))),
      filtered: Boolean(rule.filtered),
      reason: rule.reason,
      actualHit: scenario.actual.includes(label),
      decisionRank: null
    };
  });
  const eligible = records.filter((record) => !record.filtered).sort((a, b) => b.decisionScore - a.decisionScore);
  eligible.forEach((record, index) => { record.decisionRank = index + 1; });
  return records;
}

function transformerRow(record) {
  const row = element("div", "compare-row transformer-row" + (record.actualHit ? " actual-hit" : ""));
  row.dataset.key = record.key;
  row.setAttribute("role", "listitem");
  row.tabIndex = 0;
  row.setAttribute("aria-label", `Transformer rank ${record.modelRank}: ${record.label}, model score ${scoreText(record.modelScore)}. Open decision receipt.`);
  row.appendChild(element("span", "candidate-label", `${record.modelRank}. ${record.label}`));
  const track = element("div", "score-track");
  const bar = element("div", "score-bar model-bar");
  bar.style.width = `${record.modelScore * 100}%`;
  track.appendChild(bar);
  row.appendChild(track);
  row.appendChild(element("span", "score-value", scoreText(record.modelScore)));
  return row;
}

function cerniamRow(record) {
  const classes = ["compare-row", "cerniam-row"];
  if (record.filtered) classes.push("filtered");
  if (record.actualHit) classes.push("actual-hit");
  const row = element("div", classes.join(" "));
  row.dataset.key = record.key;
  row.setAttribute("role", "listitem");
  row.tabIndex = 0;
  const rank = record.filtered ? "—" : record.decisionRank;
  const score = record.filtered ? "Filtered" : scoreText(record.decisionScore);
  row.setAttribute("aria-label", `Cerniam rank ${rank}: ${record.label}, ${score}, ${record.reason}. Open decision receipt.`);
  row.appendChild(element("span", "candidate-label", `${rank}. ${record.label}`));
  const track = element("div", "score-track decision-track");
  if (!record.filtered) {
    const marker = element("i", "model-marker");
    marker.style.left = `${record.modelScore * 100}%`;
    track.appendChild(marker);
    const bar = element("div", "score-bar decision-bar");
    bar.style.width = `${record.decisionScore * 100}%`;
    track.appendChild(bar);
  }
  row.appendChild(track);
  row.appendChild(element("span", "score-value", record.filtered ? "FILTERED" : `${scoreText(record.decisionScore)} ${movementText(record.modelRank, record.decisionRank, false)}`));
  return row;
}

function reasonRow(record) {
  const row = element("div", "reason-row" + (record.filtered ? " filtered" : ""));
  row.dataset.key = record.key;
  row.appendChild(element("span", "reason-text", record.reason));
  row.appendChild(element("b", "movement", movementText(record.modelRank, record.decisionRank, record.filtered)));
  return row;
}

function ledgerRow(record) {
  const article = element("article", "ledger-row" + (record.filtered ? " filtered" : ""));
  article.dataset.key = record.key;
  article.tabIndex = 0;
  article.setAttribute("aria-label", `${record.label}. Open decision receipt.`);
  const heading = element("div", "ledger-heading");
  heading.appendChild(element("b", "", record.label));
  heading.appendChild(element("span", "", movementText(record.modelRank, record.decisionRank, record.filtered)));
  article.appendChild(heading);
  const facts = element("div", "ledger-facts");
  facts.innerHTML = `<span>Transformer</span><b>#${record.modelRank} / ${scoreText(record.modelScore)}</b><span>Cerniam</span><b>${record.filtered ? "Filtered" : `#${record.decisionRank} / ${scoreText(record.decisionScore)}`}</b><span>Reason</span><b>${record.reason}</b>`;
  article.appendChild(facts);
  return article;
}

function setLinkedCandidate(key) {
  root.querySelectorAll("[data-key]").forEach((node) => {
    node.classList.toggle("is-linked", node.dataset.key === key);
  });
}

function renderReceipt(record) {
  if (!record) return;
  selectedKey = record.key;
  setLinkedCandidate(record.key);
  root.querySelector("#receipt-candidate").textContent = record.label;
  root.querySelector("#receipt-transformer").textContent = `Rank ${record.modelRank} · model score ${scoreText(record.modelScore)}`;
  root.querySelector("#receipt-context").textContent = record.reason;
  root.querySelector("#receipt-cerniam").textContent = record.filtered
    ? "Removed from the eligible ranking"
    : `Rank ${record.decisionRank} · decision score ${scoreText(record.decisionScore)} · ${movementText(record.modelRank, record.decisionRank, false)}`;
  root.querySelector("#receipt-disposition").textContent = record.filtered
    ? "Filtered"
    : record.decisionRank === 1 ? "Selected placement" : "Eligible candidate";
}

function recordFromTarget(target) {
  const keyed = target.closest?.("[data-key]");
  return currentRecords.find((record) => record.key === keyed?.dataset.key);
}

function drawConnectors() {
  const svg = root.querySelector(".rank-connectors");
  if (!svg || window.innerWidth <= 1200 || stage.dataset.view !== "compare") {
    if (svg) svg.replaceChildren();
    return;
  }
  const stageRect = stage.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
  svg.setAttribute("width", stageRect.width);
  svg.setAttribute("height", stageRect.height);
  svg.replaceChildren(...currentRecords.map((record) => {
    const left = root.querySelector(`.transformer-row[data-key="${record.key}"]`)?.getBoundingClientRect();
    const right = root.querySelector(`.cerniam-row[data-key="${record.key}"]`)?.getBoundingClientRect();
    if (!left || !right) return document.createDocumentFragment();
    const x1 = left.right - stageRect.left;
    const y1 = left.top + left.height / 2 - stageRect.top;
    const x2 = right.left - stageRect.left;
    const y2 = right.top + right.height / 2 - stageRect.top;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const bend = Math.max(54, (x2 - x1) * 0.42);
    path.setAttribute("d", `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`);
    const movement = record.filtered ? "filtered" : record.modelRank - record.decisionRank > 0 ? "promoted" : record.modelRank - record.decisionRank < 0 ? "demoted" : "stable";
    path.setAttribute("class", `connector ${movement}`);
    path.dataset.key = record.key;
    return path;
  }));
}

function replay() {
  stage.classList.remove("is-replaying");
  void stage.offsetWidth;
  stage.classList.add("is-replaying");
  window.setTimeout(() => stage.classList.remove("is-replaying"), 1100);
}

function render() {
  const scenario = SCENARIOS[Number(select.value)];
  const actual = new Set(scenario.actual);
  const hitRanks = scenario.predictions.map(([label], index) => actual.has(label) ? index + 1 : null).filter(Boolean);
  currentRecords = buildRecords(scenario);
  const eligible = currentRecords.filter((record) => !record.filtered).sort((a, b) => a.decisionRank - b.decisionRank);
  const filtered = currentRecords.filter((record) => record.filtered).sort((a, b) => a.modelRank - b.modelRank);

  root.querySelector("#hit-count").textContent = String(hitRanks.length);
  root.querySelector("#recall").textContent = Math.round(100 * hitRanks.length / scenario.actual.length) + "%";
  root.querySelector("#first-hit").textContent = hitRanks.length ? "Rank " + hitRanks[0] : "No hit";
  root.querySelector("#candidate-count").textContent = String(currentRecords.length);
  root.querySelector("#eligible-count").textContent = String(eligible.length);
  root.querySelector("#filtered-count").textContent = String(filtered.length);
  root.querySelector("#selected-product").textContent = eligible[0]?.label || "—";

  const history = root.querySelector("#history");
  history.replaceChildren(...scenario.history.map((label) => {
    const node = element("span", "sequence-item", label);
    node.setAttribute("role", "listitem");
    return node;
  }));

  root.querySelector("#transformer-ranking").replaceChildren(...currentRecords.map(transformerRow));
  root.querySelector("#decision-reasons").replaceChildren(...currentRecords.map(reasonRow));
  root.querySelector("#cerniam-ranking").replaceChildren(...[...eligible, ...filtered].map(cerniamRow));
  root.querySelector("#mobile-ledger").replaceChildren(...currentRecords.map(ledgerRow));
  renderReceipt(eligible[0]);

  const actualNode = root.querySelector("#actual");
  actualNode.replaceChildren(...scenario.actual.map((label) => {
    const node = element("span", "chip", label);
    node.setAttribute("role", "listitem");
    return node;
  }));

  requestAnimationFrame(() => requestAnimationFrame(() => {
    drawConnectors();
    replay();
  }));
}

if (root && select && stage) {
  SCENARIOS.forEach((scenario, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = scenario.label;
    select.appendChild(option);
  });

  root.querySelectorAll(".view-switch button[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      stage.dataset.view = view;
      root.querySelectorAll(".view-switch button[data-view]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      requestAnimationFrame(drawConnectors);
    });
  });
  root.querySelector(".replay-button").addEventListener("click", replay);
  root.addEventListener("mouseover", (event) => {
    const record = recordFromTarget(event.target);
    if (record) setLinkedCandidate(record.key);
  });
  root.addEventListener("mouseout", (event) => {
    if (event.target.closest?.("[data-key]")) setLinkedCandidate(selectedKey);
  });
  root.addEventListener("focusin", (event) => {
    const record = recordFromTarget(event.target);
    if (record) setLinkedCandidate(record.key);
  });
  root.addEventListener("focusout", (event) => {
    if (event.target.closest?.("[data-key]")) setLinkedCandidate(selectedKey);
  });
  root.addEventListener("click", (event) => {
    const record = recordFromTarget(event.target);
    if (record) renderReceipt(record);
  });
  root.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const record = recordFromTarget(event.target);
    if (!record) return;
    event.preventDefault();
    renderReceipt(record);
    root.querySelector("#decision-receipt").scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  select.addEventListener("change", render);
  window.addEventListener("resize", () => requestAnimationFrame(drawConnectors), { passive: true });
  render();
}
