import { localizedPlugin } from "./localization.mjs";

const CATEGORY_LABELS = {
  zh: {
    core: "核心",
    plugin: "插件",
    distribution: "发行版",
    profile: "配置组合",
  },
  en: {
    core: "Core",
    plugin: "Plugin",
    distribution: "Distribution",
    profile: "Profile",
  },
};

const UI = {
  zh: {
    title: "DeepSeek Harness 插件汇总",
    description:
      "DeepSeek Harness（DSH）社区插件汇总：按名称、作者与功能简介快速查找插件与项目链接。",
    tagline: "发现、检索与安全审查 DeepSeek Harness 社区插件",
    github: "项目仓库",
    topic: "dsh-plugin 话题",
    search: "搜索插件名称或功能简介…",
    all: "全部",
    official: "官方",
    plugin: "插件",
    distribution: "发行版",
    core: "核心",
    profile: "配置组合",
    empty: "没有找到匹配的插件。",
    stats: (n) => `共 ${n} 个插件`,
    updated: (date) => `数据更新时间：${date}`,
    loadError: "加载插件数据失败，请稍后重试。",
    privacy: "隐私风险",
    security: "安全提示",
    riskLevel: {
      low: "低风险",
      moderate: "中等风险",
      high: "⚠️ 高风险",
    },
    riskTitle: "平台未担保其安全，使用前请自行审计",
    profileUsageTip: "这是一个「配置组合」（仅 dsh.profile）：非独立可安装插件，参考其 bundles 组合来配置自己的 profile。",
    viewProject: "查看项目",
    author: "作者：",
    stars: "Star 数",
    officialBadge: "官方",
    updatedTip: "最近更新",
    updatedToday: "今日更新",
    updatedDaysAgo: (n) => `${n}天前更新`,
    updatedMonthsAgo: (n) => `${n}个月前更新`,
    updatedYearsAgo: (n) => `${n}年前更新`,
    forksTip: "Fork 数",
    issuesTip: "未解决的问题",
    searchFilter: "搜索与筛选",
    filters: "分类筛选",
    pluginList: "插件列表",
    language: "语言",
    officialSearch: "官方预设插件搜索",
    officialSearchPlaceholder: "搜索官方插件名称或作用…",
    officialCount: (n) => `共 ${n} 个官方内置插件`,
    officialList: "官方预设插件列表",
    officialEmpty: "暂无官方预设插件。",
    dataSource:
      '数据来源：<a href="https://github.com/topics/dsh-plugin" target="_blank" rel="noopener">GitHub dsh-plugin 话题</a>，每天自动检索并做静态安全审查，结果以 Pull Request 形式合并。',
  },
  en: {
    title: "DeepSeek Harness Plugin Index",
    description:
      "A community index of DeepSeek Harness (DSH) plugins: find plugins and project links by name, author, and description.",
    tagline: "Discover, search, and safely review DeepSeek Harness community plugins",
    github: "Repository",
    topic: "dsh-plugin topic",
    search: "Search plugin name or description…",
    all: "All",
    official: "Official",
    plugin: "Plugins",
    distribution: "Distributions",
    core: "Core",
    profile: "Profiles",
    empty: "No matching plugins found.",
    stats: (n) => (n === 1 ? "1 plugin" : `${n} plugins`),
    updated: (date) => `Data updated: ${date}`,
    loadError: "Failed to load plugin data. Please try again later.",
    privacy: "Privacy risk",
    security: "Security note",
    riskLevel: {
      low: "Low risk",
      moderate: "Moderate risk",
      high: "⚠️ HIGH RISK",
    },
    riskTitle: "Not guaranteed safe by this platform — review before use",
    profileUsageTip: "This is a composable profile (dsh.profile only): not an independently installable plugin; reference its bundles list to configure your own profile.",
    officialSearch: "Official preset plugin search",
    officialSearchPlaceholder: "Search official plugins by name or description…",
    officialCount: (n) => `${n} official built-in plugins`,
    officialList: "Official preset plugin list",
    officialEmpty: "No official preset plugins found.",
    viewProject: "View project",
    author: "by",
    stars: "Stars",
    officialBadge: "Official",
    updatedTip: "Last update",
    updatedToday: "updated today",
    updatedDaysAgo: (n) => `updated ${n}d ago`,
    updatedMonthsAgo: (n) => `updated ${n}mo ago`,
    updatedYearsAgo: (n) => `updated ${n}y ago`,
    forksTip: "Forks",
    issuesTip: "Open issues",
    searchFilter: "Search and filter",
    filters: "Category filters",
    pluginList: "Plugin list",
    language: "Language",
    dataSource:
      'Data source: <a href="https://github.com/topics/dsh-plugin" target="_blank" rel="noopener">GitHub dsh-plugin topic</a>. Discovered and statically reviewed daily, then merged through pull requests.',
  },
};

const state = {
  plugins: [],
  official: [],
  translations: { plugins: {} },
  panel: "community",
  filter: "all",
  query: "",
  officialQuery: "",
  lang: detectLanguage(),
  generatedDate: "",
  loaded: false,
};

const grid = document.querySelector("#grid");
const empty = document.querySelector("#empty");
const stats = document.querySelector("#stats");
const updated = document.querySelector("#updated");
const searchInput = document.querySelector("#search");
const metaDescription = document.querySelector('meta[name="description"]');

// 官方预设插件独立面板（tab 入口，独立数据，不参与社区审查）
const communityPanel = document.querySelector("#community-panel");
const officialPanel = document.querySelector("#official-panel");
const officialGrid = document.querySelector("#official-grid");
const officialEmpty = document.querySelector("#official-empty");
const officialCount = document.querySelector("#official-count");
const officialSearchInput = document.querySelector("#official-search");

function readStoredLanguage() {
  try {
    return localStorage.getItem("dsh-language");
  } catch {
    return null;
  }
}

function detectLanguage() {
  const saved = readStoredLanguage();
  if (saved === "zh" || saved === "en") return saved;
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

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

function formatRelative(iso, copy) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d?.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days < 0) return null;
  const dateStr = d.toISOString().slice(0, 10);
  let str;
  if (days === 0) str = copy.updatedToday;
  else if (days < 30) str = copy.updatedDaysAgo(days);
  else if (days < 365) str = copy.updatedMonthsAgo(Math.round(days / 30));
  else str = copy.updatedYearsAgo(Math.floor(days / 365));
  return { str, dateStr, fresh: days <= 30 };
}

const ICON_CLOCK = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_FORK = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>';
const ICON_ISSUE = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>';

function categoryLabel(category) {
  return CATEGORY_LABELS[state.lang][category] || CATEGORY_LABELS[state.lang].plugin;
}

function matches(plugin) {
  if (state.filter !== "all" && plugin.category !== state.filter) {
    return false;
  }
  if (!state.query) return true;
  const q = state.query.toLowerCase();
  const localized = localizedPlugin(plugin, state.lang, state.translations);
  const haystack = [
    localized.name,
    localized.description,
    plugin.id,
    (plugin.topics || []).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

// GitHub 文件定位链接：repo/blob/HEAD/<file>#L<line>，HEAD 由 GitHub 自动解析为默认分支。
// 非真实文件路径（如 <dependencies>、<package.json> 等伪文件）不生成链接。
function evidenceLink(plugin, file, line) {
  const base = String(plugin.repo_url || "").replace(/\/+$/, "");
  if (!base || !file || /\s<[^>]+>\s*$/.test(file) || file.startsWith("<")) return null;
  const q = encodeURIComponent(file).replace(/%2F/g, "/");
  const frag = line ? `#L${line}` : "";
  return `${base}/blob/HEAD/${q}${frag}`;
}

// 风险条目归一化：优先用 risk_evidence；否则解析 risk_notes
// （"说明 @ 文件:行号" 或纯说明文字），统一成 { text, file, line }。
function riskItems(plugin) {
  const evidence = plugin.risk_evidence || [];
  if (evidence.length) {
    return evidence.map((ev) => ({
      text: String(ev.explanation || "").trim(),
      file: ev.file || null,
      line: ev.line || null,
    }));
  }
  return (plugin.risk_notes || []).map((note) => {
    const raw = String(note).trim();
    const m = raw.match(/^(.*?)\s*@\s*(.+)$/);
    if (!m) return { text: raw, file: null, line: null };
    const loc = m[2].trim();
    const lineMatch = loc.match(/:(\d+)$/);
    return {
      text: m[1].trim(),
      file: lineMatch ? loc.slice(0, -lineMatch[0].length) : loc,
      line: lineMatch ? Number(lineMatch[1]) : null,
    };
  });
}

// 渲染风险条目列表：每条 = 说明文字 + 可选的文件定位 chip。
function riskItemMarkup(plugin, copy) {
  const items = riskItems(plugin);
  const body = items
    .map((it) => {
      const text = escapeHtml(it.text);
      let locMarkup = "";
      if (it.file) {
        const link = evidenceLink(plugin, it.file, it.line);
        const label = `${escapeHtml(it.file)}${it.line ? `:${it.line}` : ""}`;
        locMarkup = `<span class="risk-popover__loc">${
          link
            ? `<a class="risk-loc" href="${escapeHtml(link)}" target="_blank" rel="noopener">${label}</a>`
            : `<span class="risk-loc risk-loc--plain">${label}</span>`
        }</span>`;
      }
      return `<li class="risk-popover__item"><span class="risk-popover__text">${text}</span>${locMarkup}</li>`;
    })
    .join("");
  if (body) return body;
  return `<li class="risk-popover__item"><span class="risk-popover__text">${escapeHtml(copy.riskTitle)}</span></li>`;
}

function renderCard(plugin) {
  const category = plugin.category || "plugin";
  const separator = state.lang === "en" ? "; " : "；";
  const copy = UI[state.lang];

  // 同名插件可能来自不同作者：始终在标题下展示作者（@用户名），以便区分。
  const author = plugin.author || String(plugin.id || "").split("/")[0] || "";
  const authorGap = state.lang === "en" ? " " : "";
  const authorMarkup = author
    ? `<p class="card-author">${escapeHtml(copy.author)}${authorGap}<a class="card-author__link" href="https://github.com/${encodeURIComponent(author)}" target="_blank" rel="noopener">@${escapeHtml(author)}</a></p>`
    : "";

  const updated = formatRelative(plugin.pushed_at, copy);
  const updatedItem = updated
    ? `<span class="meta-item meta-updated ${updated.fresh ? "is-fresh" : ""}" title="${copy.updatedTip}: ${updated.dateStr}">${ICON_CLOCK}${escapeHtml(updated.str)}</span>`
    : "";
  const forksItem = plugin.forks
    ? `<span class="meta-item" title="${copy.forksTip}">${ICON_FORK}${formatStars(plugin.forks)}</span>`
    : "";
  const issuesItem = plugin.open_issues > 0
    ? `<span class="meta-item meta-issue" title="${copy.issuesTip}">${ICON_ISSUE}${plugin.open_issues}</span>`
    : "";
  const baseMeta = [
    plugin.language && plugin.language !== "unknown" ? plugin.language : null,
    plugin.license && plugin.license !== "unknown" ? plugin.license : null,
  ].filter(Boolean);

  const metaLeft = [
    updatedItem,
    forksItem,
    issuesItem,
    ...baseMeta.map((m) => `<span class="meta-item">${escapeHtml(m)}</span>`),
  ].filter(Boolean).join("");

  return `
    <article class="card">
      <div class="card-top">
        <h2 class="card-title">
          <a href="${escapeHtml(plugin.repo_url)}" target="_blank" rel="noopener">${escapeHtml(plugin.name)}</a>
        </h2>
        <div class="badges">
          ${plugin.official ? `<span class="badge official">★ ${copy.officialBadge}</span>` : ""}
          ${
            plugin.risk_level && plugin.risk_level !== "low"
              ? `<div class="risk-popover risk-${escapeHtml(plugin.risk_level)}" tabindex="0">
                  <span class="badge risk-${escapeHtml(plugin.risk_level)} risk-popover__trigger">${escapeHtml(copy.riskLevel[plugin.risk_level] || copy.riskLevel.moderate)}</span>
                  <div class="risk-popover__content" role="tooltip">
                    <div class="risk-popover__head">
                      <span class="risk-popover__level risk-level-${escapeHtml(plugin.risk_level)}">${escapeHtml(copy.riskLevel[plugin.risk_level] || copy.riskLevel.moderate)}</span>
                      <span class="risk-popover__title">${escapeHtml(copy.riskTitle)}</span>
                    </div>
                    <ul class="risk-popover__list">${riskItemMarkup(plugin, copy)}</ul>
                  </div>
                </div>`
              : ""
          }
          <span class="badge stars" title="${copy.stars}">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
            </svg>
            ${formatStars(plugin.stars || 0)}
          </span>
          <span class="badge category-${escapeHtml(category)}">${categoryLabel(category)}</span>
        </div>
      </div>
      ${authorMarkup}
      <p class="desc">${escapeHtml(plugin.description || "")}</p>
      ${
        plugin.kind === "profile"
          ? `<p class="usage-tip">${escapeHtml(copy.profileUsageTip)}</p>`
          : ""
      }
      ${
        plugin.privacy_risk && !(plugin.risk_evidence && plugin.risk_evidence.length) && !(plugin.risk_notes && plugin.risk_notes.length)
          ? `<p class="privacy-note">${copy.privacy}：${escapeHtml((plugin.privacy_notes || []).join(separator))}</p>`
          : ""
      }
      ${
        plugin.security_notes && plugin.security_notes.length && !(plugin.risk_evidence && plugin.risk_evidence.length) && !(plugin.risk_notes && plugin.risk_notes.length)
          ? `<p class="security-note">${copy.security}：${escapeHtml(plugin.security_notes.join(separator))}</p>`
          : ""
      }
      <div class="card-meta">
        <span class="meta-left">${metaLeft}</span>
        <a href="${escapeHtml(plugin.repo_url)}" target="_blank" rel="noopener">${copy.viewProject}</a>
      </div>
    </article>
  `;
}

function render() {
  if (!state.loaded) return;

  const list = state.plugins
    .map((plugin) => localizedPlugin(plugin, state.lang, state.translations))
    .filter(matches)
    .sort((a, b) => {
      if (Boolean(a.official) !== Boolean(b.official)) return a.official ? -1 : 1;
      return (b.stars || 0) - (a.stars || 0);
    });

  grid.innerHTML = list.map(renderCard).join("");
  empty.hidden = list.length > 0;
  stats.textContent = UI[state.lang].stats(list.length);

  if (state.generatedDate) {
    updated.textContent = UI[state.lang].updated(state.generatedDate);
  } else {
    updated.textContent = "";
  }
}

// —— 官方预设插件（独立 tab，独立数据，不参与社区审查） ——
const OFFICIAL_REPO_BASE = "https://github.com/deepseek-ai/deepseek-harness/tree/master/packages";

function officialHref(entry) {
  const path = entry.path ? entry.path : `${entry.domain}/${entry.sub}`;
  return `${OFFICIAL_REPO_BASE}/${path.replace(/^\//, "")}`;
}

function renderOfficialCard(entry) {
  const description = entry.description_zh || entry.description_en || "";
  return `
    <article class="official-card">
      <div class="official-card__top">
        <h3 class="official-card__name"><a href="${escapeHtml(officialHref(entry))}" target="_blank" rel="noopener">${escapeHtml(entry.name)}</a></h3>
        <span class="badge official official-card__domain">${escapeHtml(entry.domain || "core")}</span>
      </div>
      <p class="official-card__desc">${escapeHtml(description)}</p>
    </article>
  `;
}

function officialMatches(entry) {
  if (!state.officialQuery) return true;
  const q = state.officialQuery.toLowerCase();
  const haystack = [
    entry.name || "",
    entry.description_zh || "",
    entry.description_en || "",
    entry.domain || "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function renderOfficial() {
  if (!officialPanel) return;
  const copy = UI[state.lang];
  const sorted = (state.official || []).filter(officialMatches).sort((a, b) => {
    if ((a.domain || "") !== (b.domain || "")) return (a.domain || "").localeCompare(b.domain || "");
    return (a.name || "").localeCompare(b.name || "");
  });
  officialGrid.innerHTML = sorted.map(renderOfficialCard).join("");
  officialEmpty.hidden = sorted.length > 0;
  officialCount.textContent = copy.officialCount(sorted.length);
}

// —— tab 面板切换：官方 tab 与社区 tab 互斥 ——
function setPanel(panel) {
  state.panel = panel;
  const isOfficial = panel === "official";
  if (officialPanel) officialPanel.hidden = !isOfficial;
  if (communityPanel) communityPanel.hidden = isOfficial;
  document.querySelectorAll(".filter").forEach((b) => {
    if (b.dataset.panel === "official") {
      // 官方 tab 入口按钮：仅官方 tab 激活时高亮
      b.classList.toggle("is-active", panel === "official");
    } else if (isOfficial) {
      // 官方 tab 激活时，社区分类按钮（含「全部」）全部取消高亮
      b.classList.remove("is-active");
    } else {
      // 社区面板：按当前社区分类高亮（「全部」也是社区分类之一）
      b.classList.toggle("is-active", (b.dataset.communityFilter || "all") === state.filter);
    }
  });
  if (isOfficial) {
    renderOfficial();
  } else {
    render();
  }
}

function applyLanguageText(lang) {
  const copy = UI[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = copy.title;
  if (metaDescription) metaDescription.setAttribute("content", copy.description);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[key]) element.textContent = copy[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (copy[key]) element.placeholder = copy[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const key = element.dataset.i18nHtml;
    if (copy[key]) element.innerHTML = copy[key];
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (copy[key]) element.setAttribute("aria-label", copy[key]);
  });
}

function updateLanguageButtons() {
  document.querySelectorAll(".lang-option").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === state.lang);
  });
}

function setLanguage(lang) {
  state.lang = lang;
  try {
    localStorage.setItem("dsh-language", lang);
  } catch {
    // 忽略无法写入 localStorage 的隐私/安全限制。
  }
  applyLanguageText(lang);
  updateLanguageButtons();
  render();
  renderOfficial();
}

async function load() {
  try {
    const res = await fetch("./plugins.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.plugins = Array.isArray(data.plugins) ? data.plugins : [];

    try {
      const translationRes = await fetch("./translations/en.json", { cache: "no-cache" });
      if (translationRes.ok) state.translations = await translationRes.json();
    } catch {
      state.translations = { plugins: {} };
    }

    if (data.generated_at) {
      const d = new Date(data.generated_at);
      if (!Number.isNaN(d.getTime())) {
        state.generatedDate = d.toISOString().slice(0, 10);
      }
    }
  } catch (err) {
    state.loaded = true;
    grid.innerHTML = "";
    empty.hidden = false;
    empty.textContent = UI[state.lang].loadError;
    console.error(err);
    return;
  }

  // 官方预设插件独立加载：与社区列表无关，失败不影响社区列表展示。
  try {
    const officialRes = await fetch("./official-plugins.json", { cache: "no-cache" });
    if (officialRes.ok) {
      const officialData = await officialRes.json();
      state.official = Array.isArray(officialData.plugins) ? officialData.plugins : [];
    }
  } catch (err) {
    console.error("Failed to load official plugins:", err);
  }

  state.loaded = true;
  applyLanguageText(state.lang);
  updateLanguageButtons();
  render();
  renderOfficial();
  setPanel(state.panel);
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  render();
});

officialSearchInput.addEventListener("input", (event) => {
  state.officialQuery = event.target.value.trim();
  if (state.panel === "official") renderOfficial();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.panel && button.dataset.panel === "official") {
      setPanel("official");
      return;
    }
    // 社区 tab（"全部"）或社区分类过滤：切到社区面板并应用分类
    if (button.dataset.panel === "community") state.filter = "all";
    else if (button.dataset.communityFilter) state.filter = button.dataset.communityFilter;
    setPanel("community");
  });
});

document.querySelectorAll(".lang-option").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

applyLanguageText(state.lang);
updateLanguageButtons();
load();
