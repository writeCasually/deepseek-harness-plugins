#!/usr/bin/env node
// 检索 GitHub `dsh-plugin` 话题，判断是否可用于 DeepSeek Harness，
// 做安全与隐私静态审查，并更新 docs/plugins.json 与 README。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { updateReadmeFiles } from './update-readme.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(root, 'docs', 'plugins.json');
const LOG_PATH = join(root, 'data', 'review-log.json');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const LIMIT = Number(process.env.LIMIT || process.env.MAX_REPOS || 40);
const MAX_PAGES = Number(process.env.MAX_PAGES || 3);
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

// --- 安全扫描规则（可解释的静态启发式） ---
const SECURITY_RULES = [
  {
    id: 'remote-exec',
    re: /(?:curl|wget)[^|>\n]*\|\s*(?:ba)?sh\b/i,
    severity: 'critical',
    explanation: '下载远程脚本并直接执行（curl/wget | sh）',
  },
  {
    id: 'powershell-enc',
    re: /powershell[^\n]*-(?:enc|encodedcommand)\b/i,
    severity: 'critical',
    explanation: '使用 PowerShell 编码命令执行',
  },
  {
    id: 'invoke-expression',
    re: /Invoke-Expression/i,
    severity: 'critical',
    explanation: '使用 PowerShell 动态表达式执行',
  },
  {
    id: 'exfil-endpoint',
    re: /webhook\.site|requestbin|discord\.com\/api\/webhooks|api\.telegram\.org\/bot\d+|ngrok\.io/i,
    severity: 'critical',
    explanation: '可能把数据发送到第三方收集端点',
  },
  {
    id: 'destructive',
    re: /rm\s+-rf\s+(?:\/|~)|\bmkfs\b|\bdd\s+if=\/dev\/zero/i,
    severity: 'critical',
    explanation: '包含破坏性系统命令',
  },
  {
    id: 'eval-exec',
    re: /\beval\s*\(|\bexec\s*\(|child_process\.(?:exec|execSync|spawn)|os\.system\s*\(|subprocess\.(?:call|run|Popen)\s*\(/i,
    severity: 'warning',
    explanation: '使用动态代码或子进程执行',
  },
  {
    id: 'base64',
    re: /atob\s*\(|Buffer\.from\s*\([^,]+,\s*['"]base64['"]|base64\s+-d/i,
    severity: 'warning',
    explanation: '存在 Base64 解码行为',
  },
  {
    id: 'obfuscation',
    re: /String\.fromCharCode\s*\(|[A-Za-z0-9+/]{80,}={0,2}/,
    severity: 'warning',
    explanation: '存在疑似混淆内容',
  },
];

// --- 隐私泄露检测标记 ---
const ENV_ACCESS = /process\.env|os\.environ|getenv\s*\(|environ\[/i;
const ENV_CRED =
  /(?:process\.env|os\.environ|getenv\s*\(\s*['"]?)[^)\n]{0,60}(?:SECRET|TOKEN|KEY|PASSWORD|PASSWD|CREDENTIAL|AWS_|OPENAI|ANTHROPIC|GITHUB|DSH_)/i;
const NETWORK_SEND =
  /fetch\s*\(|axios|https?\.request\s*\(|requests\.(?:get|post|put|patch)\s*\(|sendBeacon\s*\(|XMLHttpRequest|WebSocket/i;
const CRED_FILES = /\.ssh\/|id_rsa|\.aws\/credentials|\.npmrc|\.netrc|keychain/i;
const BROWSER_STORE = /document\.cookie|localStorage|sessionStorage/i;
const EXTERNAL_URL =
  /https?:\/\/(?!github\.com|raw\.githubusercontent\.com|api\.github\.com|objects\.githubusercontent\.com|npmjs\.com|registry\.npmjs\.org|nodejs\.org|unpkg\.com|jsdelivr\.net)[a-z0-9.-]+/i;

function scanSecurity(text) {
  const findings = [];
  if (!text) return findings;
  for (const rule of SECURITY_RULES) {
    if (rule.re.test(text)) {
      findings.push({ id: rule.id, severity: rule.severity, explanation: rule.explanation });
    }
  }
  return findings;
}

function privacyFindings(text) {
  const notes = [];
  if (!text) return notes;
  const env = ENV_ACCESS.test(text);
  const envCred = ENV_CRED.test(text);
  const network = NETWORK_SEND.test(text);
  const credFiles = CRED_FILES.test(text);
  const browserStore = BROWSER_STORE.test(text);
  const externalUrl = EXTERNAL_URL.test(text);

  if (credFiles) {
    notes.push({ severity: 'critical', explanation: '读取本地凭据文件（如 .ssh/.aws/.npmrc）' });
  }
  if (envCred && network) {
    notes.push({ severity: 'critical', explanation: '读取凭据类环境变量并发送到网络，可能泄露密钥' });
  }
  if (browserStore && network) {
    notes.push({ severity: 'critical', explanation: '读取浏览器 Cookie/存储并发送到网络' });
  }
  if (env && externalUrl && !envCred) {
    notes.push({ severity: 'warning', explanation: '读取环境变量并访问第三方地址，需确认未外发敏感信息' });
  } else if (env && !envCred) {
    notes.push({ severity: 'warning', explanation: '读取环境变量（可能包含敏感信息）' });
  }
  if (externalUrl) {
    notes.push({ severity: 'warning', explanation: '访问第三方网络地址' });
  }
  const seen = new Set();
  return notes.filter((n) => {
    if (seen.has(n.explanation)) return false;
    seen.add(n.explanation);
    return true;
  });
}

// --- DeepSeek Harness 适用性判断 ---
function detectCompatibility(repo, paths, readme) {
  if (repo.full_name.startsWith('deepseek-ai/')) {
    return { official: true, compatible: true, reason: 'DeepSeek AI 官方仓库' };
  }
  const combined = `${paths.join('\n')} ${readme}`;
  const strong = /cordis|\.dsh-plugin|dsh\.bundle|dsh\.client|@deepseek-ai\/dsh|dsh\s+plugin/i;
  if (strong.test(combined)) {
    return { official: false, compatible: true, reason: '检测到 DSH 插件标记（cordis/.dsh-plugin/dsh.bundle 等）' };
  }
  return { official: false, compatible: false, reason: '未检测到明确的 DeepSeek Harness 插件标记' };
}

function categoryFor(repo) {
  if (repo.full_name === 'deepseek-ai/deepseek-harness') return 'core';
  const text = [repo.name, repo.description || '', (repo.topics || []).join(' ')].join(' ');
  if (/awesome/i.test(text)) return 'collection';
  if (/发行版|distribution/i.test(text)) return 'distribution';
  return 'plugin';
}

function usageFor(repo) {
  if (repo.full_name === 'deepseek-ai/deepseek-harness') return 'npx @deepseek-ai/dsh 启动核心';
  return `dsh plugin --profile web add github:${repo.full_name}`;
}

function toEntry(repo, review, compatibility) {
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
    official: compatibility.official,
    compatibility: compatibility.official ? 'official' : 'compatible',
    compatibility_reason: compatibility.reason,
    privacy_risk: review.privacyNotes.length > 0,
    privacy_notes: review.privacyNotes.map((n) => n.explanation),
    security_notes: review.findings
      .filter((f) => f.severity === 'warning')
      .map((f) => f.explanation),
    source: 'discovered',
    review_status: review.verdict,
    reviewed_at: NOW,
  };
}

async function reviewRepo(repo) {
  const readmeData = await api(`/repos/${repo.full_name}/readme`, null);
  const readme = readmeData && readmeData.content ? decodeBase64(readmeData.content) : '';

  const treeData = await api(
    `/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`,
    null,
  );
  const paths = (treeData && treeData.tree ? treeData.tree : [])
    .filter((t) => t.type === 'blob')
    .map((t) => t.path);

  const compatibility = detectCompatibility(repo, paths, readme);
  if (!compatibility.compatible) {
    return { verdict: 'skip', compatibility, findings: [], privacyNotes: [], readme };
  }

  const codePaths = paths
    .filter((p) => /\.(?:js|mjs|cjs|ts|tsx|py|sh|bash|zsh|ps1|yml|yaml|json)$/i.test(p))
    .slice(0, 18);

  const securityFindings = [];
  const privacyNotes = [];
  const seenPrivacy = new Set();

  securityFindings.push(...scanSecurity(readme));
  privacyFindings(readme).forEach((n) => {
    const key = n.explanation;
    if (!seenPrivacy.has(key)) {
      seenPrivacy.add(key);
      privacyNotes.push(n);
    }
  });

  for (const file of codePaths) {
    const data = await api(`/repos/${repo.full_name}/contents/${encodeURIComponent(file)}`, null);
    if (!data || typeof data.content !== 'string') continue;
    const content = decodeBase64(data.content);
    for (const f of scanSecurity(content)) {
      if (!securityFindings.some((x) => x.id === f.id)) securityFindings.push(f);
    }
    for (const n of privacyFindings(content)) {
      if (!seenPrivacy.has(n.explanation)) {
        seenPrivacy.add(n.explanation);
        privacyNotes.push(n);
      }
    }
    if (securityFindings.some((f) => f.severity === 'critical')) break;
  }

  const hasSecurityCritical = securityFindings.some((f) => f.severity === 'critical');
  const hasSecurityWarning = securityFindings.some((f) => f.severity === 'warning');
  const hasPrivacyCritical = privacyNotes.some((n) => n.severity === 'critical');
  const hasPrivacyWarning = privacyNotes.some((n) => n.severity === 'warning');

  let verdict = 'approved';
  if (hasSecurityCritical) verdict = 'blocked';
  else if (hasPrivacyCritical || hasSecurityWarning || hasPrivacyWarning) verdict = 'flagged';
  return { verdict, compatibility, findings: securityFindings, privacyNotes, readme };
}

function normalizeEntry(p) {
  const official = p.official ?? p.id?.startsWith('deepseek-ai/') ?? false;
  return {
    ...p,
    official,
    compatibility: p.compatibility ?? (official ? 'official' : 'compatible'),
    privacy_risk: p.privacy_risk ?? false,
    privacy_notes: p.privacy_notes ?? [],
    security_notes: p.security_notes ?? [],
    category: p.category ?? 'plugin',
  };
}

function sortPlugins(list) {
  return [...list].sort((a, b) => {
    if (Boolean(a.official) !== Boolean(b.official)) return a.official ? -1 : 1;
    return (b.stars || 0) - (a.stars || 0);
  });
}

async function main() {
  let existing = { plugins: [] };
  try {
    existing = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch {
    // 首次运行，尚无数据文件。
  }

  let reviewed = new Set();
  try {
    const log = JSON.parse(readFileSync(LOG_PATH, 'utf8'));
    reviewed = new Set((log.decisions || []).map((d) => d.id));
  } catch {
    // 尚无审查日志。
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
    if (reviewed.has(repo.full_name) && !process.env.FORCE_REREVIEW) {
      continue;
    }

    processed += 1;
    const review = await reviewRepo(repo);
    const decision = {
      id: repo.full_name,
      verdict: review.verdict,
      compatibility: review.compatibility,
      findings: review.findings.map((f) => f.explanation),
      privacy_notes: review.privacyNotes.map((n) => n.explanation),
      reviewed_at: NOW,
    };
    reviewLog.push(decision);
    console.log(
      `  ${repo.full_name} -> ${review.verdict}${review.verdict === 'skip' ? `（${review.compatibility.reason}）` : ''}`,
    );

    if (review.verdict === 'approved' || review.verdict === 'flagged') {
      byId.set(repo.full_name, toEntry(repo, review, review.compatibility));
    }

    if (!TOKEN) await sleep(700);
  }

  // 官方仓库与手动精选始终保留；未通过审查/不兼容的已收录项降级移除。
  const approved = [...byId.values()]
    .map(normalizeEntry)
    .filter(
      (p) =>
        (p.review_status === 'approved' || p.review_status === 'flagged') &&
        p.compatibility !== 'unverified',
    );

  const output = {
    schema_version: 2,
    generated_at: NOW,
    plugins: approved,
  };

  if (!process.env.DRY_RUN) {
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
  }

  console.log(
    `完成：公开汇总 ${approved.length} 个插件，本次处理 ${reviewLog.length} 个仓库（剩余将留给下次任务）。`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
