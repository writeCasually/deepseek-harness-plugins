#!/usr/bin/env node
// 定时刷新 docs/plugins.json 中的「实时」字段（当前为 stars），并重新生成 README 排序。
// 设计为可扩展：新增实时数据维度时，在 collectors 注册表中追加一个采集器即可。
// 仓库数据来自 GitHub REST API: GET /repos/{owner}/{repo}
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { updateReadmeFiles } from './update-readme.mjs';
import {
  applyLocalizedDescriptionCheck,
  collectLocalizedDescriptions,
  needsLocalizedDescriptionCheck,
} from './plugin-docs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(root, 'docs', 'plugins.json');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const API_BASE = 'https://api.github.com';
const NOW = new Date().toISOString();

// 可选上限，便于本地小规模验证；缺省刷新全部插件。
const LIMIT = Number(process.env.LIMIT || 0);
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'deepseek-harness-plugins-aggregator',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (res.status === 403) {
    const reset = res.headers.get('x-ratelimit-reset');
    const wait = reset ? Math.max(0, Number(reset) * 1000 - Date.now()) : 60_000;
    console.warn(`  速率限制，等待 ${Math.round(wait / 1000)}s…`);
    await sleep(Math.min(wait, 65_000));
    return request(path);
  }
  let body = null;
  if (res.status === 200) body = await res.json();
  return { status: res.status, body };
}

async function api(path, fallback = null) {
  const { status, body } = await request(path);
  return status === 200 ? body : fallback;
}

// 仅用于判断仓库是否存在：返回 HTTP 状态码与（200 时的）仓库对象。
// 仅 HTTP 404 表示仓库确实不存在（被删除/迁移不可达）；其它错误视为瞬时故障，
// 不据此移除插件，避免误删（详见 refresh 循环）。
async function fetchRepo(fullName) {
  const { status, body } = await request(`/repos/${fullName}`);
  return { status, repo: status === 200 ? body : null };
}

// --- 实时数据采集器 ---
// 每个 collector 从 GitHub 仓库对象中提取一个字段并写回 plugin 条目。
// 新增实时数据维度只需在此数组追加一行，前端按需读取对应字段即可。
// 以下字段均来自 GET /repos/{owner}/{repo} 响应。
const collectors = [
  { field: 'stars',       pick: (r) => r.stargazers_count ?? 0 },
  { field: 'forks',       pick: (r) => r.forks_count ?? 0 },
  { field: 'open_issues', pick: (r) => r.open_issues_count ?? 0 },
  // subscribers_count 是真正的 watch 订阅数；watchers_count 历史上等于 stars，会造成误导，故不取。
  { field: 'watchers',    pick: (r) => r.subscribers_count ?? 0 },
  { field: 'pushed_at',   pick: (r) => r.pushed_at ?? '' },
  { field: 'archived',    pick: (r) => !!r.archived },
];

function applyLiveData(entry, repo) {
  let changed = false;
  for (const c of collectors) {
    const value = c.pick(repo);
    if (value !== undefined && entry[c.field] !== value) {
      entry[c.field] = value;
      changed = true;
    }
  }
  return changed;
}

async function main() {
  let data;
  try {
    data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch {
    console.error(`无法读取 ${DATA_PATH}，请先运行 discover-plugins 生成数据。`);
    process.exit(1);
  }

  const plugins = Array.isArray(data.plugins) ? data.plugins : [];
  if (!plugins.length) {
    console.log('无插件数据，跳过。');
    return;
  }

  let updated = 0;
  let failed = 0;
  let archived = 0;
  let gone = 0;
  let descriptionsUpdated = 0;
  let visited = 0;
  const removedIds = new Set();
  for (const entry of plugins) {
    if (LIMIT && visited >= LIMIT) break;
    visited += 1;

    const [owner, name] = String(entry.id).split('/');
    if (!owner || !name) continue;

    const { status, repo } = await fetchRepo(`${owner}/${name}`);

    if (status === 404) {
      // 仓库确定不存在（被删除/不可达）。本项目旨在收录展示现存 dsh 插件，
      // 掉出搜索排名、stars 变化等都不影响收录，仅当仓库本身消失时才移除。
      removedIds.add(entry.id);
      gone += 1;
      console.log(`  ${entry.id} 仓库已不存在（404），将从列表移除`);
      if (!TOKEN) await sleep(700);
      continue;
    }
    if (!repo) {
      // 其它非 200（5xx 等）视为瞬时故障，保留条目，本轮跳过刷新。
      failed += 1;
      console.warn(`  跳过 ${entry.id}（接口失败 status=${status}）`);
      continue;
    }

    let changed = applyLiveData(entry, repo);

    if (!repo.archived && needsLocalizedDescriptionCheck(entry)) {
      const descriptionI18n = await collectLocalizedDescriptions({
        api,
        repo,
        existing: entry.description_i18n || {},
      });
      const addedLanguages = applyLocalizedDescriptionCheck(
        entry,
        descriptionI18n,
        NOW,
      );
      if (addedLanguages > 0) {
        descriptionsUpdated += 1;
      }
      changed = true;
    }

    if (changed) {
      updated += 1;
      console.log(`  已更新 ${entry.id}（stars=${entry.stars}, forks=${entry.forks}）`);
    }

    if (repo.archived) {
      removedIds.add(entry.id);
      archived += 1;
      console.log(`  ${entry.id} 已归档，将从列表移除`);
    }

    if (!TOKEN) await sleep(700);
  }

  if (removedIds.size > 0) {
    data.plugins = plugins.filter((p) => !removedIds.has(p.id));
  }
  const removed = archived + gone;

  if (updated > 0 || removed > 0) {
    data.generated_at = NOW;
    if (!process.env.DRY_RUN) {
      writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
      // README 按 stars 排序，star/排序变化时需重新生成。
      updateReadmeFiles();
    }
    const parts = [
      `刷新 ${updated}`,
      `移除 ${removed} 个（归档 ${archived}，仓库不存在 ${gone}）`,
    ];
    if (descriptionsUpdated) parts.push(`补充 ${descriptionsUpdated} 个多语言简介`);
    if (failed) parts.push(`${failed} 个获取失败`);
    console.log(`完成：${parts.join('，')}（共 ${plugins.length} 个插件已检查）。`);
  } else {
    console.log(`本次无实时数据变化（${plugins.length} 个插件已检查${failed ? `，${failed} 个获取失败` : ''}）。`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
