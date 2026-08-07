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
    ]
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
    ]
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
    ]
  }
];

const root = document.getElementById("prediction-walkthrough");
const select = root?.querySelector("#scenario-select");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render() {
  const scenario = SCENARIOS[Number(select.value)];
  const actual = new Set(scenario.actual);
  const hitRanks = scenario.predictions
    .map(([label], index) => actual.has(label) ? index + 1 : null)
    .filter(Boolean);

  root.querySelector("#hit-count").textContent = String(hitRanks.length);
  root.querySelector("#recall").textContent = Math.round(100 * hitRanks.length / scenario.actual.length) + "%";
  root.querySelector("#first-hit").textContent = hitRanks.length ? "Rank " + hitRanks[0] : "No hit";

  const history = root.querySelector("#history");
  history.replaceChildren(...scenario.history.map((label) => {
    const node = element("span", "sequence-item", label);
    node.setAttribute("role", "listitem");
    return node;
  }));

  const ranking = root.querySelector("#ranking");
  ranking.replaceChildren(...scenario.predictions.map(([label, score], index) => {
    const hit = actual.has(label);
    const row = element("div", "rank-row" + (hit ? " hit" : ""));
    row.setAttribute("role", "listitem");
    row.setAttribute("aria-label", `Rank ${index + 1}: ${label}, score ${score.toFixed(2)}${hit ? ", actual hit" : ""}`);
    row.appendChild(element("span", "rank-label", `${index + 1}. ${label}`));
    const track = element("div", "bar-track");
    const bar = element("div", "bar");
    bar.style.width = Math.min(100, score / 0.60 * 100) + "%";
    track.appendChild(bar);
    row.appendChild(track);
    row.appendChild(element("span", "score", score.toFixed(2) + (hit ? " HIT" : "")));
    return row;
  }));

  const actualNode = root.querySelector("#actual");
  actualNode.replaceChildren(...scenario.actual.map((label) => {
    const node = element("span", "chip", label);
    node.setAttribute("role", "listitem");
    return node;
  }));
}

if (root && select) {
  SCENARIOS.forEach((scenario, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = scenario.label;
    select.appendChild(option);
  });
  select.addEventListener("change", render);
  render();
}
