#!/usr/bin/env node
// 检索 GitHub `dsh-plugin` 话题，判断是否可用于 DeepSeek Harness，
// 做安全与隐私静态审查，并更新 docs/plugins.json 与 README。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { updateReadmeFiles } from './update-readme.mjs';
import { collectLocalizedDescriptions } from './plugin-docs.mjs';
import {
  analyzeDependencies,
  analyzePackageManifest,
  classifyRiskLevel,
  composeVerdict,
  extractExternalHosts,
  llmReview,
  privacyFindings,
  scanObfuscation,
  scanPaths,
  scanSecrets,
  scanSecurity,
} from './security-review.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(root, 'docs', 'plugins.json');
const LOG_PATH = join(root, 'data', 'review-log.json');
// 官方预设插件目录为 docs/official-plugins.json（随 DSH 分发的 @deepseek-ai/* 内置插件），
// 独立维护、不参与本 workflow 的发现/安全审查/刷新。本脚本只读写插件字段与社区 plugins.json，
// 绝不覆盖 docs/official-plugins.json；请勿在发现/评审流程中加入官方数据。

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const LIMIT = Number(process.env.LIMIT || process.env.MAX_REPOS || 40);
const MAX_PAGES = Number(process.env.MAX_PAGES || 3);

// 布尔开关的稳定解析：仅在显式真实值时启用，避免 Actions 传 '0'/'false' 被 truthy 误触发。
function envFlag(name) {
  const v = process.env[name];
  if (v === undefined || v === null || v === '') return false;
  return !/^(0|false|no|off)$/i.test(String(v).trim());
}
const FORCE_REREVIEW = envFlag('FORCE_REREVIEW');
const DRY_RUN = envFlag('DRY_RUN');
const PER_PAGE = 100;

const THIS_REPO = process.env.GITHUB_REPOSITORY || 'writeCasually/deepseek-harness-plugins';
const NOW = new Date().toISOString();
const API_BASE = 'https://api.github.com';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'deepseek-harness-plugins-aggregator',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

function decodeBase64(text) {
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

// --- 安全审查编排（规则引擎见 security-review.mjs） ---
// 每个候选仓库的代码文件采样预算（内容请求数，控制 API 用量）。
const SCAN_FILE_BUDGET = Number(process.env.SCAN_FILE_BUDGET || 28);
// OSV 供应链漏洞检查开关（需要对外网络，CI 默认开启，可显式关闭）。
const OSV_CHECK = process.env.OSV_CHECK !== '0';

// 代码文件扫描优先级：越靠前越先被拉取审查。
// -1 表示跳过（node_modules、锁文件、构建产物、文档/配置等非运行文件）。
export function scanFileScore(path) {
  const p = String(path).toLowerCase();

  // 直接排除非内容路径：依赖目录、构建产物/媒体/安装器、锁文件。
  if (
    /(^|\/)node_modules\//.test(p) ||
    /\.(?:min\.js|map|lock|sum|png|jpe?g|gif|webp|ico|svg|woff2?|ttf|eot|pdf|zip|tar\.gz|wasm|exe|msi|dmg|apk)$/.test(p) ||
    /(^|\/)(?:package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb|composer\.lock|go\.sum|Cargo\.lock)$/.test(p)
  ) {
    return -1;
  }

  // DSH 插件是 Node.js 项目，经 import() 实际运行的只有 JS/TS 生态。
  // 其余后缀（.md/.json/.yml/.py/.sh 等）都不是 agent 会运行的代码，一律不扫。
  // 例外：package.json（安装生命周期脚本）与 Dockerfile/Makefile（构建配方）单独保留。
  const runnable =
    /\.(?:mjs|cjs|js|ts|tsx|jsx)$/.test(p) ||
    /(^|\/)package\.json$/.test(p) ||
    /(^|\/)(?:dockerfile|makefile)$/.test(p);
  if (!runnable) return -1;

  // 可运行文件内部再排序：入口/清单/安装脚本 > 代码目录 > 普通代码文件 > 构建配方。
  if (/(^|\/)(?:index|main|entry|cli)\.(?:[jt]sx?|mjs|cjs)$/.test(p)) return 100;
  if (/(^|\/)package\.json$/.test(p)) return 95;
  if (/(^|\/)(?:install|setup|bootstrap|prepare)\.(?:mjs|cjs|js)$/.test(p)) return 90;
  if (/(^|\/)(?:src|lib|bin|scripts)\//.test(p)) return 80;
  if (/\.(?:mjs|cjs|js|ts|tsx|jsx)$/.test(p)) return 70;
  return 60;
}

// 从 dsh.* manifest 提取入口文件路径（优先审查真正的插件入口）。
export function manifestEntryPaths(packageJsonFiles) {
  const out = [];
  for (const pkg of packageJsonFiles || []) {
    const dsh = pkg && typeof pkg === 'object' ? pkg.dsh : undefined;
    if (!dsh || typeof dsh !== 'object') continue;
    const values = [];
    for (const key of ['bundle', 'client', 'profile']) {
      const v = dsh[key];
      if (typeof v === 'string') values.push(v);
      else if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === 'string') values.push(item);
          else if (item && typeof item === 'object') values.push(...Object.values(item).filter((x) => typeof x === 'string'));
        }
      } else if (v && typeof v === 'object') {
        values.push(...Object.values(v).filter((x) => typeof x === 'string'));
      }
    }
    for (const s of values) {
      // 只把「可运行代码」入口纳入内容扫描；.json/.yml 等配置入口不作为运行风险审查对象。
      if (/\.(?:[jt]sx?|mjs|cjs)$/i.test(s) && !/^https?:/i.test(s)) out.push(s);
    }
  }
  return out;
}

// 生成待扫描文件清单：manifest 入口 > 高分文件 > 采样上限。
export function prioritizeScanFiles(paths, packageJsonFiles) {
  const entry = new Set(manifestEntryPaths(packageJsonFiles));
  return (paths || [])
    .filter((p) => p && scanFileScore(p) !== -1)
    .sort((a, b) => {
      const ea = entry.has(a) ? 1 : 0;
      const eb = entry.has(b) ? 1 : 0;
      if (ea !== eb) return eb - ea;
      return scanFileScore(b) - scanFileScore(a);
    });
}

// 仓库元数据信任信号（信息性，不参与裁决）。
function trustNotesFor(repo) {
  const notes = [];
  if (repo.created_at) {
    const ageDays = (Date.now() - Date.parse(repo.created_at)) / 86_400_000;
    if (ageDays < 30) notes.push(`仓库创建不足 30 天（${repo.created_at.slice(0, 10)}）`);
  }
  if (!repo.license) notes.push('未声明开源许可证');
  return notes;
}

// 增量复查：拉取自上次审查 commit 以来变更的文件路径（减少 API 用量）。
async function changedPaths(repo, base, head, allPaths) {
  if (!base || !head || base === head) return null;
  const cmp = await api(
    `/repos/${repo.full_name}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
    null,
  );
  if (!cmp || !Array.isArray(cmp.files)) return null;
  return cmp.files.map((f) => f.filename).filter((p) => p && allPaths.includes(p));
}

// 以 (规则, 文件, 行) 去重，输出稳定排序的证据列表。
function dedupeFindings(findings) {
  const seen = new Set();
  const out = [];
  for (const f of findings) {
    const key = `${f.id}|${f.file || ''}|${f.line ?? 0}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

function uniqueExplanations(findings) {
  return [...new Set(findings.map((f) => f.explanation))];
}

// --- DeepSeek Harness 适用性判断 ---
// 判定策略（自上而下，避免仅凭 README 字符串误判）：
//   1. 注册文件判定：项目（或其 monorepo 子包）的 package.json 声明了 DSH manifest
//      （`dsh.bundle` / `dsh.client` / `dsh.profile`），即存在 DSH 插件注册文件。
//   2. 代码判定：package.json 依赖了 DSH/Cordis 包，或源码 import 了
//      `@deepseek-ai/dsh*` / `@deepseek-ai/cordis`，或落地了 Cordis 插件骨架
//      （cordis.patch.yml / .dsh-plugin 目录 / apply(ctx) 等）。
const DSH_REG_MANIFEST_KEYS = ['bundle', 'client', 'profile'];
// 依赖名命中即视为“DSH/Cordis 生态包”。
const DSH_DEP_RE = /^@deepseek-ai\/(?:dsh(?:-|$)|cordis(?:-|$))/;

// 拉取项目的 package.json 作为 DSH 注册文件的候选：根注册文件 + monorepo 子包 manifest（采样）。
async function fetchPackageManifests(repo, paths) {
  const manifests = [];
  const root = await api(`/repos/${repo.full_name}/contents/package.json`, null);
  if (root && typeof root.content === 'string') {
    try {
      manifests.push(JSON.parse(decodeBase64(root.content)));
    } catch {
      // 根注册文件非法 JSON，忽略。
    }
  }
  const nested = (paths || [])
    .filter((p) => /(^|\/)package\.json$/.test(p) && p !== 'package.json')
    .slice(0, 5);
  for (const p of nested) {
    const data = await api(`/repos/${repo.full_name}/contents/${encodeURIComponent(p)}`, null);
    if (!data || typeof data.content !== 'string') continue;
    try {
      manifests.push(JSON.parse(decodeBase64(data.content)));
    } catch {
      // 非法 JSON 的子包 manifest，忽略。
    }
  }
  return manifests;
}

// 在 package.json 里查找 DSH 插件注册文件：顶层 `dsh` manifest（bundle/client/profile 任一）。
function registrationReason(pkg) {
  const dsh = pkg && typeof pkg === 'object' ? pkg.dsh : undefined;
  if (!dsh || typeof dsh !== 'object') return null;
  const kinds = DSH_REG_MANIFEST_KEYS.filter((k) => dsh[k] !== undefined);
  if (kinds.length === 0) return null;
  const isProfileOnly = kinds.length === 1 && kinds[0] === 'profile';
  return {
    reason: `存在 DSH 插件注册文件：package.json 声明 dsh.${kinds.join(' / dsh.')} manifest`,
    isPlugin: !isProfileOnly,
    // 判定类型：有 bundle/client 就是可分发的插件；只有 profile 则是可启动的组合包引用。
    kind: isProfileOnly ? 'profile' : `dsh-${kinds.join('+')}`,
  };
}

// 代码判定（a）：package.json 的依赖列表里出现了 DSH/Cordis 生态包。
function dshDepReason(pkg) {
  if (!pkg || typeof pkg !== 'object') return null;
  const deps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  for (const d of deps) {
    if (DSH_DEP_RE.test(d)) return `依赖 DSH/Cordis 生态包 ${d}`;
  }
  return null;
}

// 代码判定（b）：路径/README 引用与源码采样里的 DSH/Cordis 信号。
async function detectFromSourceCode(repo, { paths, readme, api }) {
  const joined = `${(paths || []).join('\n')} ${readme || ''}`;
  if (/@deepseek-ai\/(?:dsh|cordis)/i.test(joined)) {
    return '源码/路径引用 @deepseek-ai/dsh 或 @deepseek-ai/cordis';
  }
  if (/cordis\.patch\.yml|\.dsh-plugin\/|dsh\.client/i.test(joined)) {
    return '存在 Cordis/DSH 落地标记（cordis.patch.yml/.dsh-plugin/dsh.client 等）';
  }
  const codePaths = (paths || [])
    .filter((p) => /\.(?:js|mjs|cjs|ts|tsx|mts|cts)$/i.test(p))
    .slice(0, 6);
  for (const file of codePaths) {
    const data = await api(`/repos/${repo.full_name}/contents/${encodeURIComponent(file)}`, null);
    if (!data || typeof data.content !== 'string') continue;
    const content = decodeBase64(data.content);
    if (/@deepseek-ai\/(?:dsh|cordis)/i.test(content)) {
      return `源码 ${file} import/引用 DSH 或 Cordis 模块`;
    }
    if (/apply\s*\(\s*ctx\b/.test(content)) {
      return `源码 ${file} 呈现 Cordis 插件骨架（apply(ctx)）`;
    }
  }
  return null;
}

async function detectCompatibility(repo, { paths, readme, packageJsonFiles, api }) {
  if (repo.full_name.startsWith('deepseek-ai/')) {
    return { official: true, compatible: true, kind: 'official', reason: 'DeepSeek AI 官方仓库' };
  }

  // 1) 注册文件判定：存在 DSH 插件注册文件（package.json 的 dsh.* manifest）。
  for (const pkg of packageJsonFiles || []) {
    const reg = registrationReason(pkg);
    if (reg) {
      return { official: false, compatible: true, kind: reg.kind, reason: reg.reason };
    }
  }

  // 2) 代码判定（a）：依赖列表命中 DSH/Cordis 生态包。
  for (const pkg of packageJsonFiles || []) {
    const dep = dshDepReason(pkg);
    if (dep) {
      return { official: false, compatible: true, kind: 'code', reason: dep };
    }
  }

  // 3) 代码判定（b）：源码采样与落地标记。
  const codeReason = await detectFromSourceCode(repo, { paths, readme, api });
  if (codeReason) {
    return { official: false, compatible: true, kind: 'code', reason: codeReason };
  }

  return {
    official: false,
    compatible: false,
    kind: null,
    reason: '未检测到 DSH 插件注册文件（package.json 的 dsh.* manifest）或 DSH/Cordis 代码标记',
  };
}

// 分类：优先按包名语义（core/distribution），否则按检测到的 DSH manifest 类型。
function categoryFor(repo, kind) {
  if (repo.full_name === 'deepseek-ai/deepseek-harness') return 'core';
  const text = [repo.name, repo.description || '', (repo.topics || []).join(' ')].join(' ');
  if (/发行版|distribution/i.test(text)) return 'distribution';
  // 仅声明 dsh.profile（无可分发的 bundle/client）的仓库归类为「配置组合」。
  if (kind === 'profile') return 'profile';
  return 'plugin';
}

// 使用提示（usage）已移除：不同插件的安装方式差异很大，统一模板（如
// `dsh plugin --profile web add github:...`）会对多数插件构成误导，因此
// 不再生成/存储/展示 usage 字段，安装方式请以各项目自己的 README 为准。

function toEntry(repo, review, compatibility, descriptionI18n = {}) {
  const kind = compatibility.kind || 'code';
  const { risk_level, risk_notes, risk_evidence } = classifyRiskLevel({
    findings: review.findings,
    privacyNotes: review.privacyNotes,
  });
  return {
    id: repo.full_name,
    name: repo.name,
    // 作者（GitHub 用户名/组织）。同名插件可能来自不同作者，须与 name 一起展示以区分。
    author: repo.owner?.login || String(repo.full_name).split('/')[0] || '',
    description: repo.description || '',
    repo_url: repo.html_url,
    homepage: repo.homepage || repo.html_url,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count ?? 0,
    open_issues: repo.open_issues_count ?? 0,
    // search 结果不含 subscribers_count，此处先置 0，后续由 refresh-live-data 用仓库接口补真值。
    watchers: repo.subscribers_count ?? 0,
    pushed_at: repo.pushed_at || '',
    archived: !!repo.archived,
    language: repo.language || 'unknown',
    license: (repo.license && repo.license.spdx_id) || 'unknown',
    topics: repo.topics || [],
    category: categoryFor(repo, kind),
    kind,
    official: compatibility.official,
    compatibility: compatibility.official ? 'official' : 'compatible',
    compatibility_reason: compatibility.reason,
    ...(Object.keys(descriptionI18n).length
      ? { description_i18n: descriptionI18n }
      : {}),
    // 风险分层：low/moderate/high + 风险说明 + 结构化风险位置（文件:行号），供使用者定位审计。
    risk_level,
    risk_notes,
    risk_evidence,
    privacy_risk: review.privacyNotes.length > 0,
    privacy_notes: review.privacyNotes.map((n) => n.explanation),
    security_notes: uniqueExplanations(
      review.findings.filter((f) => f.severity === 'warning'),
    ),
    // 审查留痕：记录本次审查对应的 commit，便于后续增量复查与追溯。
    reviewed_commit: review.reviewedCommit || '',
    source: 'discovered',
    review_status: review.verdict,
    reviewed_at: NOW,
  };
}

async function reviewRepo(repo, opts = {}) {
  const { previousCommit } = opts || {};
  const readmeData = await api(`/repos/${repo.full_name}/readme`, null);
  const readme = readmeData && readmeData.content ? decodeBase64(readmeData.content) : '';

  const treeData = await api(
    `/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`,
    null,
  );
  const paths = (treeData && treeData.tree ? treeData.tree : [])
    .filter((t) => t.type === 'blob')
    .map((t) => t.path);
  const reviewedCommit = (treeData && treeData.sha) || '';
  const totalFiles = paths.length;

  // 拉取项目 package.json 作为 DSH 插件注册文件候选（根 + monorepo 子包采样）。
  const packageJsonFiles = await fetchPackageManifests(repo, paths);

  const compatibility = await detectCompatibility(repo, {
    paths,
    readme,
    packageJsonFiles,
    api,
  });
  if (!compatibility.compatible) {
    return {
      verdict: 'skip',
      compatibility,
      findings: [],
      privacyNotes: [],
      readme,
      reviewedCommit,
      filesChecked: 0,
      totalFiles,
    };
  }

  const descriptionI18n = await collectLocalizedDescriptions({
    api,
    repo,
    paths,
    defaultReadme: readme,
    defaultReadmePath: readmeData?.path || '',
  });

  // 增量复查：上次审查 commit 已知时，只重新拉取变更文件（节省 API 预算）。
  // 仅在 FORCE_REREVIEW 下启用（默认每日任务只审新仓库，不做全量复查）。
  let codePaths = null;
  let deltaUsed = false;
  if (previousCommit && FORCE_REREVIEW && previousCommit !== reviewedCommit) {
    const changed = await changedPaths(repo, previousCommit, reviewedCommit, paths);
    if (Array.isArray(changed) && changed.length > 0) {
      // 增量路径同样只扫可运行代码，过滤掉文档/配置类变更（否则风险定位会指向 .md/.yml）。
      codePaths = changed.filter((p) => scanFileScore(p) !== -1);
      if (codePaths.length > 0) deltaUsed = true;
    }
  }
  if (!codePaths) {
    // 全量模式：manifest 入口文件优先，其次按启发式得分排序，受采样预算约束。
    codePaths = prioritizeScanFiles(paths, packageJsonFiles).slice(0, SCAN_FILE_BUDGET);
  }

  const securityFindings = [];
  const privacyNotes = [];
  const seenPrivacy = new Set();
  const externalHosts = new Set();
  const samplePool = [];

  const absorbFindings = (list) => {
    for (const f of list || []) securityFindings.push(f);
  };
  const absorbPrivacy = (notes) => {
    for (const n of notes || []) {
      if (!seenPrivacy.has(n.explanation)) {
        seenPrivacy.add(n.explanation);
        privacyNotes.push(n);
      }
    }
  };

  // README 是文档而非可运行代码，不做安全/隐私 finding 扫描（否则风险定位会指向 .md）。
  // 仅保留其外联主机，供 LLM 复核阶段的信息透明度参考。
  for (const h of extractExternalHosts(readme)) externalHosts.add(h);

  // 仓库文件清单零成本信号（双重扩展名伪装等；不消耗 content API）。
  absorbFindings(scanPaths(paths));

  // package.json 生命周期脚本 / 仿冒依赖名分析（复用已拉取的 manifest，零额外 API）。
  packageJsonFiles.forEach((pkg, i) => {
    absorbFindings(analyzePackageManifest(pkg, { file: i === 0 ? 'package.json' : `package.json#${i}` }));
  });

  let filesChecked = 0;
  for (const file of codePaths) {
    const data = await api(`/repos/${repo.full_name}/contents/${encodeURIComponent(file)}`, null);
    if (!data || typeof data.content !== 'string') continue;
    const content = decodeBase64(data.content);
    filesChecked += 1;
    if (samplePool.length < 8) samplePool.push({ file, snippet: content.slice(0, 500) });
    absorbFindings(scanSecurity(content, { file }));
    absorbFindings(scanSecrets(content, { file }));
    absorbFindings(scanObfuscation(content, { file }));
    absorbPrivacy(privacyFindings(content, { file }));
    for (const h of extractExternalHosts(content)) externalHosts.add(h);
    if (securityFindings.some((f) => f.severity === 'critical')) break;
  }

  const uniqueFindings = dedupeFindings(securityFindings);

  // 供应链检查：OSV 已知漏洞批量查询（外部服务不可用时失败容忍）。
  const osv = OSV_CHECK
    ? await analyzeDependencies(packageJsonFiles, { osvCheck: true })
    : { status: 'disabled', findings: [] };
  for (const f of osv.findings) uniqueFindings.push(f);

  // 可选 LLM 深度复核：配置 LLM_API_KEY 后，对确定性结果做第二轮语义审查；
  // LLM 只升不降（确定性 critical 永远阻断），失败即跳过，不影响主流程。
  const samples = uniqueFindings
    .map((f) => `${f.file || '?'}:${f.line || 0} ${String(f.snippet || '').slice(0, 120)}`)
    .slice(0, 12);
  for (const s of samplePool) {
    if (samples.length >= 12) break;
    samples.push(`${s.file}: ${s.snippet.slice(0, 120)}`);
  }
  const llm = await llmReview({
    repo: repo.full_name,
    verdict: composeVerdict({ findings: uniqueFindings, privacyNotes }).verdict,
    findings: uniqueFindings.map(
      (f) => `${f.severity} [${f.id}] ${f.explanation} @${f.file}:${f.line || 0}`,
    ),
    externalHosts: [...externalHosts].slice(0, 10),
    packageSummary: uniqueFindings
      .filter((f) => f.id.startsWith('lifecycle') || f.id === 'typosquat' || f.id === 'osv-vuln')
      .map((f) => f.explanation)
      .slice(0, 20),
    samples,
  });
  if (llm.status === 'ok' && llm.verdict !== 'none') {
    for (const f of llm.findings || []) {
      if (!f || !f.title) continue;
      uniqueFindings.push({
        id: 'llm-review',
        severity: f.severity === 'critical' ? 'critical' : 'warning',
        explanation: `LLM 深度复核：${f.title}`,
        file: 'llm-review',
        line: 0,
        snippet: String(f.evidence || '').slice(0, 160),
        source: 'llm',
      });
    }
  }

  const { verdict, blockedReasons, flaggedReasons } = composeVerdict({
    findings: uniqueFindings,
    privacyNotes,
  });

  return {
    verdict,
    compatibility,
    findings: uniqueFindings,
    privacyNotes,
    readme,
    descriptionI18n,
    reviewedCommit,
    deltaUsed,
    filesChecked,
    totalFiles,
    blockedReasons,
    flaggedReasons,
    trustNotes: trustNotesFor(repo),
    osv,
    llm: { status: llm.status, verdict: llm.verdict, rationale: llm.rationale || '', error: llm.error || '' },
  };
}

function normalizeEntry(p) {
  const official = p.official ?? p.id?.startsWith('deepseek-ai/') ?? false;
  const kind = p.kind ?? (official ? 'official' : 'code');
  let category = p.category ?? 'plugin';
  // 纯 profile 型（无可分发 bundle/client）固定归为「配置组合」类。
  if (kind === 'profile' && category === 'plugin') category = 'profile';
  return {
    ...p,
    // author 兼容旧条目：无 author 字段时按 id（owner/name）推导作者。
    author: p.author ?? (String(p.id || '').split('/')[0] || ''),
    official,
    kind,
    compatibility: p.compatibility ?? (official ? 'official' : 'compatible'),
    // risk_level 兼容旧条目：无风险标记时按 privacy_risk/security_notes 兜底推断。
    risk_level: p.risk_level ?? (p.privacy_risk || (p.security_notes || []).length ? 'moderate' : 'low'),
    risk_notes: p.risk_notes ?? [...(p.privacy_notes || []), ...(p.security_notes || [])],
    risk_evidence: Array.isArray(p.risk_evidence) ? p.risk_evidence : [],
    privacy_risk: p.privacy_risk ?? false,
    privacy_notes: p.privacy_notes ?? [],
    security_notes: p.security_notes ?? [],
    reviewed_commit: p.reviewed_commit ?? '',
    category,
    forks: p.forks ?? 0,
    open_issues: p.open_issues ?? 0,
    watchers: p.watchers ?? 0,
    pushed_at: p.pushed_at ?? '',
    archived: p.archived ?? false,
  };
}

async function main() {
  let existing = { plugins: [] };
  try {
    existing = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch {
    // 首次运行，尚无数据文件。
  }

  let reviewed = new Set();
  let logDecisions = [];
  try {
    const log = JSON.parse(readFileSync(LOG_PATH, 'utf8'));
    logDecisions = Array.isArray(log) ? log : log.decisions || [];
    reviewed = new Set(logDecisions.map((d) => d.id));
  } catch {
    // 尚无审查日志。
  }
  // 上次审查对应的 commit（用于 FORCE_REREVIEW 时的增量复查）。
  const previousCommitById = new Map();
  for (const d of logDecisions) {
    if (d.reviewed_commit) previousCommitById.set(d.id, d.reviewed_commit);
  }

  const byId = new Map((existing.plugins || []).map((p) => [p.id, p]));
  const reviewLog = [];

  let collected = [];
  for (let page = 1; page <= MAX_PAGES && collected.length < LIMIT * 3; page += 1) {
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

  console.log(`发现 ${collected.length} 个仓库，本次最多处理 ${LIMIT} 个新仓库。`);

  let processed = 0;
  for (const repo of candidates) {
    if (processed >= LIMIT) break;

    if (byId.has(repo.full_name) && byId.get(repo.full_name).source === 'curated') {
      continue;
    }
    if (reviewed.has(repo.full_name) && !FORCE_REREVIEW) {
      continue;
    }

    processed += 1;
    const review = await reviewRepo(repo, {
      previousCommit: previousCommitById.get(repo.full_name),
    });
    const decision = {
      id: repo.full_name,
      verdict: review.verdict,
      compatibility: review.compatibility,
      findings: review.findings.map((f) => f.explanation),
      privacy_notes: review.privacyNotes.map((n) => n.explanation),
      // 证据化审查留痕（规则/严重级/文件/行号/片段）与覆盖信息。
      evidence: review.findings
        .map((f) => ({
          rule: f.id,
          severity: f.severity,
          explanation: f.explanation,
          file: f.file || '',
          line: f.line ?? 0,
          snippet: String(f.snippet || '').slice(0, 160),
        }))
        .slice(0, 40),
      trust_notes: review.trustNotes || [],
      reviewed_commit: review.reviewedCommit || '',
      review_mode: review.deltaUsed ? 'delta' : 'full',
      scanned_files: review.filesChecked ?? 0,
      total_files: review.totalFiles ?? 0,
      osv: { status: review.osv?.status || 'disabled', findings: (review.osv?.findings || []).length },
      llm_review: review.llm || { status: 'skipped' },
      reviewed_at: NOW,
    };
    reviewLog.push(decision);
    console.log(
      `  ${repo.full_name} -> ${review.verdict}${review.verdict === 'skip' ? `（${review.compatibility.reason}）` : ''}`,
    );
    if (process.env.DEBUG_REVIEW) {
      for (const f of review.findings.slice(0, 20)) {
        console.log(`      [${f.severity}] ${f.id} ${f.file || ''}:${f.line ?? 0} ${String(f.snippet || '').slice(0, 100)}`);
      }
      for (const n of review.privacyNotes) {
        console.log(`      [${n.severity}] privacy ${n.explanation}`);
      }
    }

    if (review.verdict === 'approved' || review.verdict === 'flagged') {
      byId.set(
        repo.full_name,
        toEntry(repo, review, review.compatibility, review.descriptionI18n || {}),
      );
    } else if (
      review.verdict === 'blocked' &&
      byId.has(repo.full_name) &&
      byId.get(repo.full_name).source !== 'curated'
    ) {
      // 本轮复查判为 blocked（安全阻断），立即把已收录的旧条目移出列表。
      // curated 项在上面的循环开头 continue 跳过，不会走到这里。
      byId.delete(repo.full_name);
    }

    if (!TOKEN) await sleep(700);
  }

  // 汇总每个插件当前可用的最新 verdict：本轮新审查优先，其次既有审查日志
  // （decisions 为 新→旧 顺序，首个即代表最新判决）。
  const latestVerdictById = new Map();
  for (const d of [...reviewLog, ...logDecisions]) {
    if (!latestVerdictById.has(d.id)) latestVerdictById.set(d.id, d.verdict);
  }

  // 官方仓库与手动精选始终保留；未通过审查/不兼容的已收录项降级移除。
  // 关键修正：以「最新审查 verdict」为准，而不仅是条目里可能已陈旧的 review_status。
  // 此前已收录为 flagged 的插件，若最新被判为 blocked，也必须从公开列表移除。
  const approved = [...byId.values()]
    .map(normalizeEntry)
    .filter((p) => {
      if (p.source === 'curated' || p.official) return true;
      // 最新审查为 blocked（安全阻断）时，即便旧条目仍残留 flagged 也必须移除。
      if (latestVerdictById.get(p.id) === 'blocked') return false;
      // 兜底：无审查记录或非 blocked 时，以条目自身状态为准。
      return (
        (p.review_status === 'approved' || p.review_status === 'flagged') &&
        p.compatibility !== 'unverified'
      );
    });

  const output = {
    schema_version: 6,
    generated_at: NOW,
    plugins: approved,
  };

  if (!DRY_RUN) {
    mkdirSync(dirname(LOG_PATH), { recursive: true });
    let log = [];
    try {
      const parsed = JSON.parse(readFileSync(LOG_PATH, 'utf8'));
      log = Array.isArray(parsed) ? parsed : parsed.decisions || [];
    } catch {
      log = [];
    }
    log.unshift(...reviewLog);
    writeFileSync(
      LOG_PATH,
      JSON.stringify({ updated_at: NOW, decisions: log.slice(0, 1000) }, null, 2),
    );

    writeFileSync(DATA_PATH, JSON.stringify(output, null, 2));
    updateReadmeFiles();

    // 本轮新审查的最严重 verdict，供 workflow 的 worst_verdict 门禁作 PR 描述参考：
    //   worst_verdict = 'clean'     -> 本轮无新审查（只刷新元数据/README）
    //   worst_verdict = 'approved'  -> 本轮所有新插件全部通过静态审查
    //   worst_verdict = 'flagged'   -> 出现 warning 或灰区高风险，已标注并收录
    //   worst_verdict = 'blocked'   -> 出现确定恶意，已移出 plugins.json；剩余数据安全，仍自动合并
    const VERDICT_RANK = { approved: 0, skip: 0, flagged: 1, blocked: 2 };
    const worstVerdict = reviewLog.length === 0
      ? 'clean'
      : reviewLog.reduce(
          (worst, d) => ((VERDICT_RANK[d.verdict] ?? 0) > (VERDICT_RANK[worst] ?? 0) ? d.verdict : worst),
          'approved',
        );
    const verdictCounts = reviewLog.reduce((acc, d) => {
      acc[d.verdict] = (acc[d.verdict] ?? 0) + 1;
      return acc;
    }, {});
    const blockedReasons = [
      ...new Set(
        reviewLog
          .filter((d) => d.verdict === 'blocked')
          .flatMap((d) => d.findings || []),
      ),
    ].slice(0, 20);
    writeFileSync(
      join(root, 'data', 'run-summary.json'),
      JSON.stringify(
        {
          run_at: NOW,
          new_reviews: reviewLog.length,
          worst_verdict: worstVerdict,
          verdicts: verdictCounts,
          blocked_reasons: blockedReasons,
          scan: {
            files_checked: reviewLog.reduce((n, d) => n + (d.scanned_files || 0), 0),
            osv_used: reviewLog.some((d) => d.osv?.status === 'ok'),
            llm_used: reviewLog.some((d) => d.llm_review?.status === 'ok'),
          },
        },
        null,
        2,
      ),
    );
  }

  console.log(
    `完成：公开汇总 ${approved.length} 个插件，本次处理 ${reviewLog.length} 个仓库（剩余将留给下次任务）。`,
  );
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
