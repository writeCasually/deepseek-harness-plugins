import { localizedPlugin } from "./localization.mjs";

const CATEGORY_LABELS = {
  zh: {
    core: "核心",
    plugin: "插件",
    distribution: "发行版",
    collection: "精选列表",
    profile: "配置组合",
  },
  en: {
    core: "Core",
    plugin: "Plugin",
    distribution: "Distribution",
    collection: "Collection",
    profile: "Profile",
  },
};

const UI = {
  zh: {
    title: "DeepSeek Harness 插件汇总",
    description:
      "DeepSeek Harness（DSH）社区插件汇总：按名称、功能简介与用法快速查找插件与项目链接。",
    tagline: "发现、检索与安全审查 DeepSeek Harness 社区插件",
    github: "项目仓库",
    topic: "dsh-plugin 话题",
    search: "搜索插件名称或功能简介…",
    all: "全部",
    official: "官方",
    plugin: "插件",
    collection: "精选列表",
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
    defaultUsage: "安装与用法见项目 README",
    profileUsageTip: "这是一个「配置组合」（仅 dsh.profile）：非独立可安装插件，参考其 bundles 组合来配置自己的 profile。",
    viewProject: "查看项目",
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
    dataSource:
      '数据来源：<a href="https://github.com/topics/dsh-plugin" target="_blank" rel="noopener">GitHub dsh-plugin 话题</a>，每天自动检索并做静态安全审查，结果以 Pull Request 形式合并。',
  },
  en: {
    title: "DeepSeek Harness Plugin Index",
    description:
      "A community index of DeepSeek Harness (DSH) plugins: find plugins and project links by name, description, and usage.",
    tagline: "Discover, search, and safely review DeepSeek Harness community plugins",
    github: "Repository",
    topic: "dsh-plugin topic",
    search: "Search plugin name or description…",
    all: "All",
    official: "Official",
    plugin: "Plugins",
    collection: "Collections",
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
    defaultUsage: "See the project README for installation and usage",
    profileUsageTip: "This is a composable profile (dsh.profile only): not an independently installable plugin; reference its bundles list to configure your own profile.",
    viewProject: "View project",
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
  translations: { plugins: {} },
  filter: "all",
  query: "",
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
  if (state.filter === "official" && !plugin.official) return false;
  if (state.filter !== "all" && state.filter !== "official" && plugin.category !== state.filter) {
    return false;
  }
  if (!state.query) return true;
  const q = state.query.toLowerCase();
  const localized = localizedPlugin(plugin, state.lang, state.translations);
  const haystack = [
    localized.name,
    localized.description,
    localized.usage,
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

function renderCard(plugin) {
  const category = plugin.category || "plugin";
  const separator = state.lang === "en" ? "; " : "；";
  const copy = UI[state.lang];

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
              ? `<span class="badge risk-${escapeHtml(plugin.risk_level)}" title="${escapeHtml(copy.riskTitle)}">${escapeHtml(copy.riskLevel[plugin.risk_level] || copy.riskLevel.moderate)}</span>`
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
      <p class="desc">${escapeHtml(plugin.description || "")}</p>
      <pre class="usage">${escapeHtml(plugin.usage || copy.defaultUsage)}</pre>
      ${
        plugin.kind === "profile"
          ? `<p class="usage-tip">${escapeHtml(copy.profileUsageTip)}</p>`
          : ""
      }
      ${
        (plugin.risk_evidence && plugin.risk_evidence.length) || (plugin.risk_notes && plugin.risk_notes.length)
          ? `<p class="risk-note risk-${escapeHtml(plugin.risk_level || "")}" title="${escapeHtml(copy.riskTitle)}">${escapeHtml(copy.riskTitle)}：${
              plugin.risk_evidence && plugin.risk_evidence.length
                ? plugin.risk_evidence
                    .map((ev) => {
                      const prefix = escapeHtml(ev.explanation);
                      if (!ev.file) return prefix;
                      const link = evidenceLink(plugin, ev.file, ev.line);
                      const label = `${escapeHtml(ev.file)}${ev.line ? `:${ev.line}` : ""}`;
                      return link
                        ? `${prefix} <a class="risk-loc" href="${escapeHtml(link)}" target="_blank" rel="noopener">${label}</a>`
                        : `${prefix} ${label}`;
                    })
                    .join("<br>")
                : escapeHtml(plugin.risk_notes.join(separator))
            }</p>`
          : ""
      }
      ${
        plugin.privacy_risk && !(plugin.risk_notes && plugin.risk_notes.length)
          ? `<p class="privacy-note">${copy.privacy}：${escapeHtml((plugin.privacy_notes || []).join(separator))}</p>`
          : ""
      }
      ${
        plugin.security_notes && plugin.security_notes.length && !(plugin.risk_notes && plugin.risk_notes.length)
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

  state.loaded = true;
  applyLanguageText(state.lang);
  updateLanguageButtons();
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

document.querySelectorAll(".lang-option").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

applyLanguageText(state.lang);
updateLanguageButtons();
load();
