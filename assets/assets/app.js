// Cadastro do catálogo.
// Use apenas fontes/embeds autorizados (ex.: trailers oficiais).
const CATALOG = [
  {
    id: "exemplo-yt",
    title: "Exemplo (YouTube)",
    type: "filme",
    year: "2024",
    rating: "Livre",
    desc: "Troque por sua descrição.",
    poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=60",
    embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    source: "https://www.youtube.com/"
  },
  {
    id: "exemplo-vimeo",
    title: "Exemplo (Vimeo)",
    type: "serie",
    year: "2023",
    rating: "12+",
    desc: "Conteúdo demonstrativo para o layout.",
    poster: "https://images.unsplash.com/photo-1522120692538-0f4f3f2ad2b8?auto=format&fit=crop&w=900&q=60",
    embed: "https://player.vimeo.com/video/76979871",
    source: "https://vimeo.com/"
  }
];

function $(sel){ return document.querySelector(sel); }
function esc(s){ return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function setYear(){
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

function getParams(){
  return new URLSearchParams(location.search);
}

// INDEX: render, busca e filtro
function initIndex(){
  const grid = $("#grid");
  if (!grid) return;

  let currentFilter = "all";
  let query = "";

  const chips = document.querySelectorAll(".chip");
  chips.forEach(btn => {
    btn.addEventListener("click", () => {
      chips.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentFilter = btn.dataset.filter || "all";
      render();
    });
  });

  const q = $("#q");
  const clear = $("#clear");
  if (q){
    q.addEventListener("input", () => { query = q.value.trim().toLowerCase(); render(); });
  }
  if (clear && q){
    clear.addEventListener("click", () => { q.value=""; query=""; q.focus(); render(); });
  }

  function match(item){
    const okFilter = currentFilter === "all" ? true : item.type === currentFilter;
    const okQuery = !query ? true : (item.title || "").toLowerCase().includes(query);
    return okFilter && okQuery;
  }

  function cardHTML(item){
    const meta = [item.type, item.year, item.rating].filter(Boolean).join(" • ");
    return `
      <a class="card" href="./player.html?id=${esc(item.id)}" data-open="${esc(item.id)}">
        <img class="thumb" src="${esc(item.poster)}" alt="${esc(item.title)}" loading="lazy" />
        <div class="cardBody">
          <h3 class="title">${esc(item.title)}</h3>
          <p class="meta">${esc(meta)}</p>
        </div>
      </a>
    `;
  }

  function render(){
    const items = CATALOG.filter(match);
    grid.innerHTML = items.length
      ? items.map(cardHTML).join("")
      : `<div class="muted">Nenhum resultado encontrado.</div>`;
  }

  render();
}

// PLAYER: carrega item via ?id=
function initPlayer(){
  const frame = $("#frame");
  if (!frame) return;

  const id = getParams().get("id");
  const item = CATALOG.find(x => x.id === id);

  if (!item){
    $("#title").textContent = "Título não encontrado";
    $("#meta").textContent = "";
    $("#desc").textContent = "Volte ao catálogo e selecione um item válido.";
    frame.src = "";
    return;
  }

  document.title = `${item.title} • Centro de Filmes`;

  $("#title").textContent = item.title;
  $("#meta").textContent = [item.type, item.year, item.rating].filter(Boolean).join(" • ");
  $("#desc").textContent = item.desc || "";
  $("#poster").src = item.poster || "";
  $("#poster").alt = item.title || "Capa";

  const sourceBtn = $("#openSource");
  if (item.source){
    sourceBtn.href = item.source;
  } else {
    sourceBtn.style.display = "none";
  }

  frame.src = item.embed || "";
}

setYear();
initIndex();
initPlayer();
