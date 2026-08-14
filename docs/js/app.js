const CATEGORY_LABELS = {
  core: "核心",
  plugin: "插件",
  distribution: "发行版",
  collection: "精选列表",
};

const state = {
  plugins: [],
  filter: "all",
  query: "",
};

const grid = document.querySelector("#grid");
const empty = document.querySelector("#empty");
const stats = document.querySelector("#stats");
const updated = document.querySelector("#updated");
const searchInput = document.querySelector("#search");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatStars(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function categoryLabel(category) {
  return CATEGORY_LABELS[category] || "插件";
}

function matches(plugin) {
  if (state.filter !== "all" && plugin.category !== state.filter) return false;
  if (!state.query) return true;
  const q = state.query.toLowerCase();
  const haystack = [
    plugin.name,
    plugin.description,
    plugin.usage,
    plugin.id,
    (plugin.topics || []).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function renderCard(plugin) {
  const category = plugin.category || "plugin";
  const meta = [
    plugin.language && plugin.language !== "unknown" ? plugin.language : null,
    plugin.license && plugin.license !== "unknown" ? plugin.license : null,
  ].filter(Boolean);

  return `
    <article class="card">
      <div class="card-top">
        <h2 class="card-title">
          <a href="${escapeHtml(plugin.repo_url)}" target="_blank" rel="noopener">${escapeHtml(plugin.name)}</a>
        </h2>
        <div class="badges">
          <span class="badge stars" title="Star 数">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
            </svg>
            ${formatStars(plugin.stars || 0)}
          </span>
          <span class="badge category-${escapeHtml(category)}">${categoryLabel(category)}</span>
        </div>
      </div>
      <p class="desc">${escapeHtml(plugin.description || "")}</p>
      <pre class="usage">${escapeHtml(plugin.usage || "安装与用法见项目 README")}</pre>
      <div class="card-meta">
        <span class="meta-left">
          ${meta.map((m) => `<span>${escapeHtml(m)}</span>`).join("")}
        </span>
        <a href="${escapeHtml(plugin.repo_url)}" target="_blank" rel="noopener">查看项目</a>
      </div>
    </article>
  `;
}

function render() {
  const list = state.plugins
    .filter(matches)
    .sort((a, b) => (b.stars || 0) - (a.stars || 0));

  grid.innerHTML = list.map(renderCard).join("");
  empty.hidden = list.length > 0;
  stats.textContent = `共 ${list.length} 个插件`;
}

async function load() {
  try {
    const res = await fetch("./plugins.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.plugins = Array.isArray(data.plugins) ? data.plugins : [];
    if (data.generated_at) {
      const d = new Date(data.generated_at);
      if (!Number.isNaN(d.getTime())) {
        updated.textContent = `数据更新时间：${d.toISOString().slice(0, 10)}`;
      }
    }
  } catch (err) {
    grid.innerHTML = "";
    empty.hidden = false;
    empty.textContent = "加载插件数据失败，请稍后重试。";
    console.error(err);
    return;
  }
  render();
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  render();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
    button.classList.add("is-active");
    state.filter = button.dataset.filter;
    render();
  });
});

load();
