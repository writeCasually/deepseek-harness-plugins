#!/usr/bin/env node
// 依据 docs/plugins.json 重新生成 README.md 的插件列表区块。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = join(root, 'README.md');
const dataPath = join(root, 'docs', 'plugins.json');

const START = '<!-- PLUGINS_START -->';
const END = '<!-- PLUGINS_END -->';

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const plugins = [...(data.plugins || [])].sort((a, b) => (b.stars || 0) - (a.stars || 0));

const rows = plugins.map((p) => {
  const name = p.repo_url ? `[${p.name}](${p.repo_url})` : p.name;
  const desc = (p.description || '').replaceAll('|', '\\|').replaceAll('\n', ' ');
  const usage = (p.usage || '见项目 README').replaceAll('`', '').replaceAll('|', '\\|').replaceAll('\n', ' ');
  const link = p.repo_url || '';
  return `| ${name} | ${desc} | \`${usage}\` | [查看](${link}) |`;
});

const table = [
  '| 插件名称 | 功能简介 | 用法 | 项目链接 |',
  '| --- | --- | --- | --- |',
  ...rows,
  '',
  `共收录 ${plugins.length} 个插件，数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。`,
].join('\n');

const readme = readFileSync(readmePath, 'utf8');
const startIndex = readme.indexOf(START);
const endIndex = readme.indexOf(END);

if (startIndex === -1 || endIndex === -1) {
  console.error(`未找到 README 标记：${START} / ${END}`);
  process.exit(1);
}

const next = `${readme.slice(0, startIndex + START.length)}\n\n${table}\n\n${readme.slice(endIndex)}`;
writeFileSync(readmePath, next);
console.log(`已更新 README 插件列表：${plugins.length} 个插件`);
