#!/usr/bin/env node
// Rebuild the plugin list blocks in the Chinese and English README files from
// docs/plugins.json and the English translation overlay.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { localizedPlugin } from '../docs/js/localization.mjs';

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
    ? '| Plugin | Author | Description |'
    : '| 插件名称 | 作者 | 功能简介 |';
  const separator = '| --- | --- | --- |';

  const rows = plugins.map((plugin) => {
    const localized = localizedPlugin(plugin, lang, translations);
    const official = localized.official ? (isEn ? '★ Official ' : '★ 官方 ') : '';
    const name = localized.repo_url
      ? `${official}[${localized.name}](${localized.repo_url})`
      : `${official}${localized.name}`;
    // 同名插件可能来自不同作者：作者列始终展示 GitHub 用户名，用于区分。
    const author = localized.author || String(localized.id || '').split('/')[0] || '';
    const authorCell = author ? `[@${escapeMarkdown(author)}](https://github.com/${encodeURIComponent(author)})` : '—';
    const desc = escapeMarkdown(localized.description || '')
      .replaceAll('|', '\\|')
      .replaceAll('\n', ' ');
    return `| ${name} | ${authorCell} | ${desc} |`;
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
