function firstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

// 仓库 About（repo.description，GitHub 仓库「About」栏的一句话简介）是人写维护的字段，
// 比从 README 正文里做启发式截取更稳定、更准确，故作为描述展示的首选信源。
// 但它可能为空、或只是「<插件名> (plugin) for DeepSeek Harness」这类模板套话，
// 此时判定为「不可用」，回退到 README 提取的语言简介。
// 套话前缀的收尾关键词：仅在「名称 + 品类词」的模板里紧邻 for 之前出现，
// 而真实简介多以描述性短语收尾（如 understanding / tutorial / slider…）。
// 只匹配「紧邻 for 的最后一个词」，避免误伤前缀任意位置含 plugin 等字样的真实简介。
const PLACEHOLDER_KIND = /\b(?:plugins?|extensions?|integration|skills?|tools?|kits?|bundles?|clients?|desktops?|cli|webs?|uis?|runtime|preset|profile|wrapper)\b/i;
function isUsableAbout(text) {
  const s = (text || "").trim();
  if (!s) return false;
  // 仅语言标签，无实质简介。
  if (/^(?:中文|简体中文|繁體中文|繁体中文|英文|english|en|zh|cn)$/i.test(s)) return false;
  // 套话模板：整句只是「(A) DeepSeek Harness (plugin|extension|…)」（无实质描述）。
  if (/^(?:a\s+)?deepseek[- ]?harness(?:\s+(?:plugin|extension|integration|desktop|cli|ui|web|tools?))*$/i.test(s)) return false;
  // 套话模板：短句只是「<品类词> for DeepSeek Harness」。
  const tail = s.match(/\b(.+?)\s+for\s+deepseek[- ]?harness$/i);
  if (tail && tail[1] && tail[1].length <= 48) {
    const prefix = tail[1].trim();
    // 紧邻 for 之前的收尾词是品类词（如 "AgentTeams plugin"、"Tabbit Browser plugins"）→ 占位。
    const lastWord = (prefix.match(/(\S+)\s*$/) || [])[1] || '';
    if (PLACEHOLDER_KIND.test(lastWord)) return false;
    // 前缀是单个无空格/句读的裸 token（纯项目名，如 "dshtools"）→ 也视为占位。
    if (/^[a-zA-Z0-9._-]+$/.test(prefix) && prefix.length <= 40) return false;
  }
  return true;
}

export function localizedPlugin(plugin, lang, translations = {}) {
  const translation = lang === "en" ? translations.plugins?.[plugin.id] || {} : {};
  const descriptions = plugin.description_i18n || {};
  // 仓库 About 是否「可用」：About 无语言之分，故两种语言下都优先于 README 提取。
  const usableAbout = isUsableAbout(plugin.description);

  const description = usableAbout
    ? plugin.description
    : lang === "en"
      ? firstText(
          descriptions.en,
          translation.description,
          descriptions.zh,
        )
      : firstText(
          descriptions.zh,
          descriptions.en,
          translation.description,
        );

  return {
    ...plugin,
    description,
    name: translation.name || plugin.name,
    privacy_notes: Array.isArray(translation.privacy_notes)
      ? translation.privacy_notes
      : plugin.privacy_notes,
    security_notes: Array.isArray(translation.security_notes)
      ? translation.security_notes
      : plugin.security_notes,
  };
}
