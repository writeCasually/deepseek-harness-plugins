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
    ? '| Plugin | Description | Usage |'
    : '| 插件名称 | 功能简介 | 用法 |';
  const separator = '| --- | --- | --- |';

  const rows = plugins.map((plugin) => {
    const localized = localizedPlugin(plugin, lang, translations);
    const official = localized.official ? (isEn ? '★ Official ' : '★ 官方 ') : '';
    // 高风险插件加醒目徽标，明确提示「平台未担保其安全，使用前请自行审计」。
    let riskBadge = '';
    if (localized.risk_level === 'high') {
      riskBadge = isEn ? '⚠️ HIGH RISK ' : '⚠️ 高风险 ';
    } else if (localized.risk_level === 'moderate') {
      riskBadge = isEn ? '● moderate ' : '● 中等 ';
    }
    const name = localized.repo_url
      ? `${official}${riskBadge}[${localized.name}](${localized.repo_url})`
      : `${official}${riskBadge}${localized.name}`;
    const desc = escapeMarkdown(localized.description || '')
      .replaceAll('|', '\\|')
      .replaceAll('\n', ' ');
    // 风险说明：优先用结构化 risk_evidence（附 文件:行号 定位），否则回退到 risk_notes 字符串。
    const riskEvidence = localized.risk_evidence && localized.risk_evidence.length
      ? localized.risk_evidence
      : null;
    const riskParts = riskEvidence
      ? riskEvidence.map((ev) => {
          const loc = ev.file ? `${ev.file}${ev.line ? `:${ev.line}` : ''}` : '';
          return `${ev.explanation}${loc ? ` [${loc}]` : ''}`;
        })
      : (localized.risk_notes || []);
    const risk = riskParts.length
      ? (isEn
          ? ` (Risk: ${riskParts.join('; ')})`
          : `（风险：${riskParts.join('；')}）`)
      : '';
    const usage = (localized.usage || (isEn ? 'See project README' : '见项目 README'))
      .replaceAll('`', '')
      .replaceAll('|', '\\|')
      .replaceAll('\n', ' ');
    return `| ${name} | ${desc}${risk} | \`${usage}\` |`;
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
