#!/usr/bin/env node
// Rebuild the plugin list blocks in the Chinese and English README files from
// docs/plugins.json and the English translation overlay.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(root, 'docs', 'plugins.json');
const TRANSLATION_PATH = join(root, 'docs', 'translations', 'en.json');

const START = '<!-- PLUGINS_START -->';
const END = '<!-- PLUGINS_END -->';

const TARGETS = [
  { path: join(root, 'README.md'), lang: 'zh' },
  { path: join(root, 'README.en.md'), lang: 'en' },
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function sortPlugins(plugins) {
  return [...plugins].sort((a, b) => {
    if (Boolean(a.official) !== Boolean(b.official)) return a.official ? -1 : 1;
    return (b.stars || 0) - (a.stars || 0);
  });
}

function localizedPlugin(plugin, lang, translations) {
  const translation = translations.plugins?.[plugin.id] || {};
  if (lang !== 'en') return plugin;

  return {
    ...plugin,
    name: translation.name || plugin.name,
    description: translation.description || plugin.description,
    usage: translation.usage || plugin.usage,
    privacy_notes: Array.isArray(translation.privacy_notes)
      ? translation.privacy_notes
      : plugin.privacy_notes,
    security_notes: Array.isArray(translation.security_notes)
      ? translation.security_notes
      : plugin.security_notes,
  };
}

// 转义可能触发主动渲染的 markdown 字符（链接 / HTML / 代码块），
// 防止插件 description 注入钓鱼链接等主动内容；其它字符保持原样以维持可读。
function escapeMarkdown(text) {
  return text
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('[', '\\[')
    .replaceAll('<', '\\<');
}

function buildTable(plugins, lang, translations) {
  const isEn = lang === 'en';
  const header = isEn
    ? '| Plugin | Description | Usage |'
    : '| 插件名称 | 功能简介 | 用法 |';
  const separator = '| --- | --- | --- |';

  const rows = plugins.map((plugin) => {
    const localized = localizedPlugin(plugin, lang, translations);
    const official = localized.official ? (isEn ? '★ Official ' : '★ 官方 ') : '';
    const name = localized.repo_url
      ? `${official}[${localized.name}](${localized.repo_url})`
      : `${official}${localized.name}`;
    const desc = escapeMarkdown(localized.description || '')
      .replaceAll('|', '\\|')
      .replaceAll('\n', ' ');
    const privacy = localized.privacy_risk
      ? (isEn
          ? ` (Privacy risk: ${(localized.privacy_notes || []).join('; ')})`
          : `（隐私风险：${(localized.privacy_notes || []).join('；')}）`)
      : '';
    const security = (localized.security_notes || []).length
      ? (isEn
          ? ` (Security note: ${localized.security_notes.join('; ')})`
          : `（安全提示：${localized.security_notes.join('；')}）`)
      : '';
    const usage = (localized.usage || (isEn ? 'See project README' : '见项目 README'))
      .replaceAll('`', '')
      .replaceAll('|', '\\|')
      .replaceAll('\n', ' ');
    return `| ${name} | ${desc}${privacy}${security} | \`${usage}\` |`;
  });

  const countText = isEn
    ? `Includes ${plugins.length} plugins, official plugins first; see [docs/plugins.json](docs/plugins.json) for source and update time.`
    : `共收录 ${plugins.length} 个插件，官方插件优先展示；数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。`;

  return [header, separator, ...rows, '', countText].join('\n');
}

export function updateReadmeFiles() {
  const data = readJson(DATA_PATH);
  const translations = (() => {
    try {
      return readJson(TRANSLATION_PATH);
    } catch {
      return { plugins: {} };
    }
  })();
  const plugins = sortPlugins(data.plugins || []);

  for (const target of TARGETS) {
    if (!existsSync(target.path)) {
      console.warn(`跳过不存在的 README：${target.path}`);
      continue;
    }

    const readme = readFileSync(target.path, 'utf8');
    const startIndex = readme.indexOf(START);
    const endIndex = readme.indexOf(END);

    if (startIndex === -1 || endIndex === -1) {
      console.error(`未找到 README 标记：${START} / ${END}（${target.path}）`);
      process.exit(1);
    }

    const table = buildTable(plugins, target.lang, translations);
    const next = `${readme.slice(0, startIndex + START.length)}\n\n${table}\n\n${readme.slice(endIndex)}`;
    writeFileSync(target.path, next);
    console.log(`已更新 ${target.path} 插件列表：${plugins.length} 个插件`);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) updateReadmeFiles();
