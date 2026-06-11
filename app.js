const nodes = [
  { id: "A1", label: "Bad Bunny", tipo: "artista", album: "central", grupo: "central" },
  { id: "A2", label: "Chencho Corleone", tipo: "artista", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A3", label: "Jhayco", tipo: "artista", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A4", label: "Rauw Alejandro", tipo: "artista", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A5", label: "Bomba Estéreo", tipo: "grupo", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A6", label: "RaiNao", tipo: "artista", album: "DeBÍ TiRAR MáS FOToS", grupo: "colaborador_DTMF" },
  { id: "A7", label: "Chuwi", tipo: "grupo", album: "DeBÍ TiRAR MáS FOToS", grupo: "colaborador_DTMF" },
  { id: "A8", label: "Omar Courtz", tipo: "artista", album: "DeBÍ TiRAR MáS FOToS", grupo: "colaborador_DTMF" },
  { id: "A9", label: "Dei V", tipo: "artista", album: "DeBÍ TiRAR MáS FOToS", grupo: "colaborador_DTMF" },
  { id: "A10", label: "Los Pleneros de la Cresta", tipo: "grupo", album: "DeBÍ TiRAR MáS FOToS", grupo: "colaborador_DTMF" },
  { id: "A11", label: "Tony Dize", tipo: "artista", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A12", label: "The Marías", tipo: "grupo", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A13", label: "Buscabulla", tipo: "grupo", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" },
  { id: "A14", label: "Tainy", tipo: "artista", album: "Un Verano Sin Ti", grupo: "colaborador_UVST" }
];

const edges = [
  { source: "A1", target: "A2", relation: "colaboracion", weight: 1, cancion: "Me Porto Bonito", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A3", relation: "colaboracion", weight: 1, cancion: "Tarot", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A4", relation: "colaboracion", weight: 1, cancion: "Party", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A5", relation: "colaboracion", weight: 1, cancion: "Ojitos Lindos", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A6", relation: "colaboracion", weight: 1, cancion: "Perfumito Nuevo", album: "DeBÍ TiRAR MáS FOToS" },
  { source: "A1", target: "A7", relation: "colaboracion", weight: 1, cancion: "Weltita", album: "DeBÍ TiRAR MáS FOToS" },
  { source: "A1", target: "A8", relation: "colaboracion", weight: 1, cancion: "Veldá", album: "DeBÍ TiRAR MáS FOToS" },
  { source: "A1", target: "A9", relation: "colaboracion", weight: 1, cancion: "Veldá", album: "DeBÍ TiRAR MáS FOToS" },
  { source: "A1", target: "A10", relation: "colaboracion", weight: 1, cancion: "Café con Ron", album: "DeBÍ TiRAR MáS FOToS" },
  { source: "A8", target: "A9", relation: "co-colaboracion", weight: 1, cancion: "Veldá", album: "DeBÍ TiRAR MáS FOToS" },
  { source: "A1", target: "A11", relation: "colaboracion", weight: 1, cancion: "La Corriente", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A12", relation: "colaboracion", weight: 1, cancion: "Otro Atardecer", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A13", relation: "colaboracion", weight: 1, cancion: "Andrea", album: "Un Verano Sin Ti" },
  { source: "A1", target: "A14", relation: "colaboracion", weight: 1, cancion: "Callaita", album: "Un Verano Sin Ti" }
];

const svg = document.querySelector("#network");
const albumFilter = document.querySelector("#albumFilter");
const searchInput = document.querySelector("#searchInput");
const showCoCollab = document.querySelector("#showCoCollab");
const resetButton = document.querySelector("#resetButton");
const detailContent = document.querySelector("#detailContent");
const nodeCount = document.querySelector("#nodeCount");
const edgeCount = document.querySelector("#edgeCount");
const albumCount = document.querySelector("#albumCount");

let selected = null;

function colorFor(node) {
  if (node.grupo === "central") return "var(--central)";
  if (node.grupo === "colaborador_UVST") return "var(--uvst)";
  return "var(--dtmf)";
}

function getVisibleData() {
  const album = albumFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  let visibleEdges = edges.filter((edge) => {
    const albumMatch = album === "todos" || edge.album === album;
    const relationMatch = showCoCollab.checked || edge.relation !== "co-colaboracion";
    return albumMatch && relationMatch;
  });

  let visibleIds = new Set(["A1"]);
  visibleEdges.forEach((edge) => {
    visibleIds.add(edge.source);
    visibleIds.add(edge.target);
  });

  let visibleNodes = nodes.filter((node) => visibleIds.has(node.id));

  if (query) {
    const matchedIds = new Set(
      visibleNodes
        .filter((node) => node.label.toLowerCase().includes(query))
        .map((node) => node.id)
    );

    visibleEdges = visibleEdges.filter((edge) => matchedIds.has(edge.source) || matchedIds.has(edge.target));
    visibleIds = new Set(["A1", ...matchedIds]);
    visibleEdges.forEach((edge) => {
      visibleIds.add(edge.source);
      visibleIds.add(edge.target);
    });
    visibleNodes = visibleNodes.filter((node) => visibleIds.has(node.id));
  }

  return { visibleNodes, visibleEdges };
}

function computePositions(visibleNodes, width, height) {
  const center = { x: width / 2, y: height / 2 };
  const uvst = visibleNodes.filter((node) => node.grupo === "colaborador_UVST");
  const dtmf = visibleNodes.filter((node) => node.grupo === "colaborador_DTMF");
  const positions = new Map();

  positions.set("A1", center);
  placeArc(uvst, positions, center, Math.min(width, height) * 0.34, -150, 35);
  placeArc(dtmf, positions, center, Math.min(width, height) * 0.31, 145, 325);
  return positions;
}

function placeArc(groupNodes, positions, center, radius, startDeg, endDeg) {
  const span = endDeg - startDeg;
  groupNodes.forEach((node, index) => {
    const step = groupNodes.length === 1 ? 0.5 : index / (groupNodes.length - 1);
    const angle = (startDeg + span * step) * Math.PI / 180;
    positions.set(node.id, {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    });
  });
}

function render() {
  const { visibleNodes, visibleEdges } = getVisibleData();
  const rect = svg.getBoundingClientRect();
  const width = Math.max(rect.width, 640);
  const height = Math.max(rect.height, 480);
  const positions = computePositions(visibleNodes, width, height);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  const edgeLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const nodeLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const labelLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.append(edgeLayer, nodeLayer, labelLayer);

  visibleEdges.forEach((edge) => {
    const start = positions.get(edge.source);
    const end = positions.get(edge.target);
    if (!start || !end) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.classList.add("edge");
    if (edge.relation === "co-colaboracion") line.classList.add("co");
    if (isDimmed(edge)) line.classList.add("dim");
    if (isActiveEdge(edge)) line.classList.add("active");
    line.addEventListener("click", () => {
      selected = { type: "edge", id: `${edge.source}-${edge.target}-${edge.cancion}` };
      showEdgeDetail(edge, nodeById);
      render();
    });
    edgeLayer.appendChild(line);
  });

  visibleNodes.forEach((node) => {
    const pos = positions.get(node.id);
    if (!pos) return;

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", pos.x);
    circle.setAttribute("cy", pos.y);
    circle.setAttribute("r", node.id === "A1" ? 30 : node.tipo === "grupo" ? 21 : 18);
    circle.setAttribute("fill", colorFor(node));
    circle.classList.add("node");
    if (isDimmed(node)) circle.classList.add("dim");
    if (selected?.type === "node" && selected.id === node.id) circle.classList.add("active");
    circle.addEventListener("click", () => {
      selected = { type: "node", id: node.id };
      showNodeDetail(node, visibleEdges, nodeById);
      render();
    });
    nodeLayer.appendChild(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", pos.x);
    label.setAttribute("y", pos.y + (node.id === "A1" ? 48 : 34));
    label.setAttribute("text-anchor", "middle");
    label.classList.add("node-label");
    if (isDimmed(node)) label.classList.add("dim");
    label.textContent = node.label;
    labelLayer.appendChild(label);
  });

  nodeCount.textContent = visibleNodes.length;
  edgeCount.textContent = visibleEdges.length;
  albumCount.textContent = new Set(visibleEdges.map((edge) => edge.album)).size;
  renderCharts();
}

function isActiveEdge(edge) {
  return selected?.type === "edge" && selected.id === `${edge.source}-${edge.target}-${edge.cancion}`;
}

function isDimmed(item) {
  if (!selected) return false;
  if (selected.type === "node") {
    if (item.id) return item.id !== selected.id && !edges.some((edge) => edge.source === selected.id && edge.target === item.id || edge.target === selected.id && edge.source === item.id);
    return item.source !== selected.id && item.target !== selected.id;
  }
  if (selected.type === "edge") {
    const [source, target] = selected.id.split("-");
    if (item.id) return item.id !== source && item.id !== target;
    return !isActiveEdge(item);
  }
  return false;
}

function showNodeDetail(node, visibleEdges, nodeById) {
  const related = visibleEdges.filter((edge) => edge.source === node.id || edge.target === node.id);
  const relationItems = related.map((edge) => {
    const otherId = edge.source === node.id ? edge.target : edge.source;
    const other = nodeById.get(otherId);
    return `<li><strong>${other.label}</strong><br>${edge.cancion} · ${edge.album} · ${edge.relation}</li>`;
  }).join("");

  detailContent.innerHTML = `
    <h2>${node.label}</h2>
    <p>${node.tipo === "grupo" ? "Grupo" : "Artista"} · ${node.album}</p>
    <p>Conexiones visibles: <strong>${related.length}</strong></p>
    <ul class="detail-list">${relationItems || "<li>No hay relaciones visibles con el filtro actual.</li>"}</ul>
  `;
}

function showEdgeDetail(edge, nodeById) {
  const source = nodeById.get(edge.source);
  const target = nodeById.get(edge.target);
  detailContent.innerHTML = `
    <h2>${source.label} → ${target.label}</h2>
    <p><strong>${edge.cancion}</strong></p>
    <ul class="detail-list">
      <li>Álbum de referencia: ${edge.album}</li>
      <li>Tipo de relación: ${edge.relation}</li>
      <li>Peso: ${edge.weight}</li>
    </ul>
  `;
}

function renderCharts() {
  const albumBars = document.querySelector("#albumBars");
  const typeBars = document.querySelector("#typeBars");
  const collaborators = nodes.filter((node) => node.id !== "A1");

  const albumCounts = countBy(collaborators, "album");
  const typeCounts = countBy(nodes, "tipo");
  drawBars(albumBars, albumCounts, { "Un Verano Sin Ti": "var(--uvst)", "DeBÍ TiRAR MáS FOToS": "var(--dtmf)" });
  drawBars(typeBars, typeCounts, { artista: "var(--central)", grupo: "var(--accent)" });
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function drawBars(container, counts, colors) {
  const max = Math.max(...Object.values(counts));
  container.innerHTML = Object.entries(counts).map(([label, value]) => `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${(value / max) * 100}%; background:${colors[label] || "var(--muted)"}"></span></span>
      <span class="bar-value">${value}</span>
    </div>
  `).join("");
}

albumFilter.addEventListener("change", () => {
  selected = null;
  render();
});

searchInput.addEventListener("input", () => {
  selected = null;
  render();
});

showCoCollab.addEventListener("change", () => {
  selected = null;
  render();
});

resetButton.addEventListener("click", () => {
  selected = null;
  albumFilter.value = "todos";
  searchInput.value = "";
  showCoCollab.checked = true;
  detailContent.innerHTML = `
    <h2>Selecciona un nodo o una arista</h2>
    <p>Haz clic sobre un artista, grupo o relación para ver su información y destacar sus conexiones.</p>
  `;
  render();
});

window.addEventListener("resize", render);
render();
