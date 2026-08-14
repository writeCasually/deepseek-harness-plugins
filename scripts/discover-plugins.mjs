#!/usr/bin/env node
// 检索 GitHub `dsh-plugin` 话题，做静态安全审查，并更新 docs/plugins.json 与 README。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(root, 'docs', 'plugins.json');
const LOG_PATH = join(root, 'data', 'review-log.json');
const README_PATH = join(root, 'README.md');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const LIMIT = Number(process.env.LIMIT || process.env.MAX_REPOS || 100);
const MAX_PAGES = Number(process.env.MAX_PAGES || 2);
const PER_PAGE = 100;

const THIS_REPO = process.env.GITHUB_REPOSITORY || 'writeCasually/deepseek-harness-plugins';
const NOW = new Date().toISOString();

const API_BASE = 'https://api.github.com';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'deepseek-harness-plugins-aggregator',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function api(path, fallback = null) {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (res.status === 403) {
    const reset = res.headers.get('x-ratelimit-reset');
    const wait = reset ? Math.max(0, Number(reset) * 1000 - Date.now()) : 60_000;
    console.warn(`  速率限制，等待 ${Math.round(wait / 1000)}s…`);
    await sleep(Math.min(wait, 65_000));
    return api(path, fallback);
  }
  if (!res.ok) return fallback;
  return await res.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeBase64(text) {
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

// 安全扫描：返回 { findings: string[] }。
const CRITICAL = [
  /curl[^|>\n]*\|\s*(?:ba)?sh/i,
  /wget[^|>\n]*\|\s*(?:ba)?sh/i,
  /powershell[^\n]*-(?:enc|encodedcommand)\b/i,
  /Invoke-Expression/i,
  /webhook\.site/i,
  /requestbin/i,
  /discord\.com\/api\/webhooks/i,
  /api\.telegram\.org\/bot\d+/i,
  /ngrok\.io/i,
  /rm\s+-rf\s+(?:\/|~)/i,
  /\bmkfs(?:\.| )/i,
];

const WARNING = [
  /\beval\s*\(/i,
  /\bexec\s*\(/i,
  /child_process\.(?:exec|execSync|spawn)/i,
  /os\.system\s*\(/i,
  /subprocess\.(?:call|run|Popen)\s*\(/i,
  /atob\s*\(/i,
  /Buffer\.from\s*\([^,]+,\s*['"]base64['"]/i,
  /base64\s+-d/i,
  /String\.fromCharCode\s*\(/i,
  /[A-Za-z0-9+/]{80,}={0,2}/,
];

function scan(text) {
  const findings = [];
  if (!text) return findings;
  for (const re of CRITICAL) {
    if (re.test(text)) findings.push(`critical:${re.source}`);
  }
  for (const re of WARNING) {
    if (re.test(text)) findings.push(`warning:${re.source}`);
  }
  return findings;
}

function verdictFor(findings) {
  if (findings.some((f) => f.startsWith('critical:'))) return 'blocked';
  if (findings.length > 0) return 'review';
  return 'approved';
}

function categoryFor(repo) {
  if (repo.full_name === 'deepseek-ai/deepseek-harness') return 'core';
  const text = [
    repo.name,
    repo.description || '',
    (repo.topics || []).join(' '),
  ].join(' ');
  if (/awesome/i.test(text)) return 'collection';
  if (/发行版|distribution/i.test(text)) return 'distribution';
  return 'plugin';
}

async function reviewRepo(repo) {
  const findings = [];
  const readmeData = await api(`/repos/${repo.full_name}/readme`, null);
  let readme = '';
  if (readmeData && readmeData.content) {
    readme = decodeBase64(readmeData.content);
    findings.push(...scan(readme));
  }

  const treeData = await api(
    `/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`,
    null,
  );
  const paths = (treeData && treeData.tree ? treeData.tree : [])
    .filter((t) => t.type === 'blob')
    .map((t) => t.path);

  // 只抽样可能包含逻辑/安装命令的文件，控制 API 调用量。
  const codePaths = paths
    .filter((p) => /\.(?:js|mjs|cjs|ts|tsx|py|sh|bash|zsh|ps1|yml|yaml|json)$/i.test(p))
    .slice(0, 14);

  for (const file of codePaths) {
    const data = await api(`/repos/${repo.full_name}/contents/${encodeURIComponent(file)}`, null);
    if (!data || typeof data.content !== 'string') continue;
    findings.push(...scan(decodeBase64(data.content)));
    if (findings.some((f) => f.startsWith('critical:'))) break;
  }

  const deduped = [...new Set(findings)];
  return { verdict: verdictFor(deduped), findings: deduped };
}

function usageFor(repo) {
  if (repo.full_name === 'deepseek-ai/deepseek-harness') {
    return 'npx @deepseek-ai/dsh 启动核心';
  }
  return `dsh plugin --profile web add github:${repo.full_name}`;
}

function toEntry(repo, review) {
  return {
    id: repo.full_name,
    name: repo.name,
    description: repo.description || '',
    usage: usageFor(repo),
    repo_url: repo.html_url,
    homepage: repo.homepage || repo.html_url,
    stars: repo.stargazers_count || 0,
    language: repo.language || 'unknown',
    license: (repo.license && repo.license.spdx_id) || 'unknown',
    topics: repo.topics || [],
    category: categoryFor(repo),
    source: 'discovered',
    review_status: review.verdict,
    reviewed_at: NOW,
  };
}

function updateReadme(plugins) {
  const START = '<!-- PLUGINS_START -->';
  const END = '<!-- PLUGINS_END -->';
  const sorted = [...plugins].sort((a, b) => (b.stars || 0) - (a.stars || 0));
  const rows = sorted.map((p) => {
    const name = p.repo_url ? `[${p.name}](${p.repo_url})` : p.name;
    const desc = (p.description || '').replaceAll('|', '\\|').replaceAll('\n', ' ');
    const usage = (p.usage || '见项目 README').replaceAll('`', '').replaceAll('|', '\\|').replaceAll('\n', ' ');
    return `| ${name} | ${desc} | \`${usage}\` | [查看](${p.repo_url || ''}) |`;
  });
  const table = [
    '| 插件名称 | 功能简介 | 用法 | 项目链接 |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
    `共收录 ${sorted.length} 个插件，数据来源与更新时间见 [docs/plugins.json](docs/plugins.json)。`,
  ].join('\n');

  let readme = readFileSync(README_PATH, 'utf8');
  const startIndex = readme.indexOf(START);
  const endIndex = readme.indexOf(END);
  if (startIndex === -1 || endIndex === -1) {
    console.warn('README 中未找到插件列表标记，跳过更新。');
    return;
  }
  readme = `${readme.slice(0, startIndex + START.length)}\n\n${table}\n\n${readme.slice(endIndex)}`;
  writeFileSync(README_PATH, readme);
}

async function main() {
  let existing = { plugins: [] };
  try {
    existing = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch {
    // 首次运行，尚无数据文件。
  }

  const byId = new Map(existing.plugins.map((p) => [p.id, p]));
  const reviewLog = [];

  let collected = [];
  for (let page = 1; page <= MAX_PAGES && collected.length < LIMIT; page += 1) {
    const data = await api(
      `/search/repositories?q=topic%3Adsh-plugin&sort=stars&order=desc&per_page=${PER_PAGE}&page=${page}`,
      null,
    );
    if (!data || !Array.isArray(data.items)) break;
    collected = collected.concat(data.items);
    if (data.items.length < PER_PAGE) break;
    if (!TOKEN) await sleep(1000);
  }

  const candidates = collected.filter(
    (r) => !r.fork && !r.archived && r.full_name !== THIS_REPO,
  );

  console.log(`发现 ${collected.length} 个仓库，待审查 ${Math.min(candidates.length, LIMIT)} 个。`);

  for (const repo of candidates.slice(0, LIMIT)) {
    if (byId.has(repo.full_name) && byId.get(repo.full_name).source === 'curated') {
      continue;
    }
    const review = await reviewRepo(repo);
    reviewLog.push({ id: repo.full_name, ...review, reviewed_at: NOW });
    console.log(`  ${repo.full_name} -> ${review.verdict}${review.findings.length ? ` (${review.findings.join(', ')})` : ''}`);

    if (review.verdict === 'approved') {
      byId.set(repo.full_name, toEntry(repo, review));
    } else if (byId.has(repo.full_name)) {
      // 已收录但本次审查未通过：降级为待复核，避免继续公开展示未通过项。
      const prev = byId.get(repo.full_name);
      byId.set(repo.full_name, { ...prev, review_status: review.verdict, reviewed_at: NOW });
    }

    if (!TOKEN) await sleep(800);
  }

  // 仅保留 approved 的条目用于公开汇总；其他结果记录在 review-log。
  const approved = [...byId.values()].filter((p) => p.review_status === 'approved');
  const output = {
    schema_version: 1,
    generated_at: NOW,
    plugins: approved,
  };

  if (!process.env.DRY_RUN) {
    mkdirSync(dirname(LOG_PATH), { recursive: true });
    let log = [];
    try {
      log = JSON.parse(readFileSync(LOG_PATH, 'utf8'));
    } catch {
      log = [];
    }
    log.unshift(...reviewLog);
    writeFileSync(LOG_PATH, JSON.stringify({ updated_at: NOW, decisions: log.slice(0, 500) }, null, 2));

    writeFileSync(DATA_PATH, JSON.stringify(output, null, 2));
    updateReadme(approved);
  }
  console.log(`完成：公开汇总 ${approved.length} 个插件，本次审查 ${reviewLog.length} 个仓库。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
