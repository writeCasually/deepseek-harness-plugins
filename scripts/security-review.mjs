#!/usr/bin/env node
// 分层静态安全与隐私审查引擎。
//
// 设计目标（相比纯正则布尔扫描的「更智能」升级）：
//   1. 证据化：每个 finding 携带 文件/行号/命中片段，审查可解释、可追溯；
//   2. 分层：确定性规则（代码执行/破坏性命令/外发端点） -> 密钥扫描 -> 混淆度量
//      -> 包生命周期脚本与供应链（OSV 已知漏洞 + 仿冒包名） -> 可选 LLM 深度复核；
//   3. 行为组合：同文件内「读取凭据 + 网络发送」「Base64 解码 + eval」等组合判定；
//   4. 可控噪声：外发端点按域名白名单过滤、硬编码密钥按占位符上下文降噪；
//   5. 失败不失败：OSV / LLM 等外部依赖不可用时返回 status 标记，不阻断主流程。
//
// 本模块不直接访问网络（fetch/AbortSignal 由调用方注入或使用 Node 内置能力），
// 便于单元测试离线运行。运行入口见 scripts/discover-plugins.mjs。

// --- 第三方网络访问白名单（文档/基础设施域名，不算「可疑外联」） ---
export const EXTERNAL_URL_ALLOWLIST = [
  'github.com',
  'raw.githubusercontent.com',
  'api.github.com',
  'objects.githubusercontent.com',
  'githubusercontent.com',
  'gist.github.com',
  'npmjs.com',
  'registry.npmjs.org',
  'nodejs.org',
  'unpkg.com',
  'jsdelivr.net',
  'cdn.jsdelivr.net',
  'opensource.org',
  'choosealicense.com',
  'creativecommons.org',
  'img.shields.io',
  'shields.io',
  'badge.fury.io',
  'travis-ci.org',
  'travis-ci.com',
  'circleci.com',
  'codecov.io',
  'coveralls.io',
  'gitter.im',
  'discord.gg',
  'discord.com',
  'deepseek.com',
  'deepseek.ai',
  'api-docs.deepseek.com',
];

// --- 确定性安全规则（id / 严重级 / 正则 / 解释） ---
// 关键规则命中即视为 critical；其中 isDefiniteMalice() 判定为「确定恶意」时阻断收录，
// 其余 critical 视作「灰区高风险」收录并标记 risk_level=high。warning 为标记提示。
const SECURITY_RULES = [
  {
    id: 'remote-exec',
    severity: 'critical',
    re: /(?:curl|wget|iwr\b|aria2c)(?:[^|>\n]*)\|\s*(?:ba)?sh\b|(?:Invoke-WebRequest|Invoke-RestMethod|iwr)[^|>\n]*\|\s*(?:powershell|pwsh)\b/i,
    explanation: '下载远程脚本并直接执行（curl/wget | sh）',
  },
  {
    id: 'encoded-command',
    severity: 'critical',
    re: /(?:powershell|pwsh)[^\n]*-?(?:enc|encodedcommand|EncodedCommand)\b/i,
    explanation: '使用 PowerShell 编码命令执行',
  },
  {
    id: 'invoke-expression',
    severity: 'critical',
    re: /\bInvoke-Expression\b/i,
    explanation: '使用 PowerShell 动态表达式执行',
  },
  {
    id: 'iex-short',
    severity: 'warning',
    // psOnly：仅 PowerShell 场景（.ps1/.psm1/.psd1 文件，或片段邻近 powershell/pwsh 上下文）才上报。
    // 裸 iex 是极常见 token（变量/工具名/URL），在 JS/TS 里误报率极高，由 scanSecurity 按 psOnly 过滤。
    psOnly: true,
    re: /\biex\b/i,
    explanation: '使用 PowerShell 简写 iex 动态执行（需结合上下文确认）',
  },
  {
    id: 'shell-exec',
    severity: 'critical',
    re: /\bchild_process\.(?:exec|execSync|spawnSync)\s*\(|require\(\s*['"]node:child_process['"]\s*\)[^;\n]{0,60}\.(?:exec|execSync)\s*\(|(?:^|[^;\w{]\s{0,3})\b(?:execSync|execFileSync)\s*\(/i,
    explanation: '通过子进程 shell 执行命令（child_process.exec/execSync）',
  },
  {
    id: 'spawn-shell',
    severity: 'critical',
    re: /\b(?:spawn|spawnSync)\([^)]*shell\s*[:=]\s*true/i,
    explanation: '子进程以 shell 模式启动（spawn(...,{shell:true})）',
  },
  {
    id: 'shell-flag',
    severity: 'critical',
    re: /(?:subprocess|os\.system|\.run\(|\.Popen\(|\.call\()[\s\S]{0,120}?shell\s*=\s*True/i,
    explanation: 'Python 子进程开启 shell 执行（shell=True）',
  },
  {
    id: 'eval-exec',
    severity: 'warning',
    // GLOBAL_ONLY（借鉴 agent-audit GLOBAL_ONLY_TS_CALLS）：仅独立全局 eval / window|globalThis|global|self.eval / new Function 命中；
    // obj.eval(...)（如 redisClient.eval 的 Redis EVAL Lua）为成员方法，绝不误报为 RCE。
    re: /(?<![\w.$])eval\s*\(|\b(?:window|globalThis|global|self)\.eval\s*\(|\bnew\s+Function\s*\(/i,
    explanation: '使用动态代码执行（全局 eval / new Function）',
  },
  {
    id: 'os-exec',
    severity: 'warning',
    re: /\bos\.system\s*\(|subprocess\.(?:call|run|Popen)\s*\(/i,
    explanation: '使用系统/子进程执行外部命令',
  },
  {
    id: 'decode-exec',
    severity: 'critical',
    // GLOBAL_ONLY：仅独立全局 eval / window|globalThis|global|self.eval / new Function / Function 命中；
    // obj.eval(...)（Redis EVAL 等成员方法）不误报。解码 + 执行须共存于同一行才命中。
    re: /^(?=[^\n]*(?:atob|Buffer\.from|fromCharCode|decodeURIComponent|unescape))(?=[^\n]*(?:new\s+Function|Function|(?<![\w.$])eval)\s*\()[^\n]*$/gm,
    explanation: '解码后直接执行代码（Base64/编码字符串 -> 全局 eval/Function）',
  },
  {
    id: 'remote-code-import',
    severity: 'critical',
    re: /(?:\bimport\s*\(\s*['"`]?|from\s+['"`]|require\s*\(\s*['"`])https?:\/\//i,
    explanation: '动态加载远程 URL 代码（import/require 远程地址）',
  },
  {
    id: 'remote-code-fetch-eval',
    severity: 'critical',
    re: /fetch\s*\([^)]*\)[\s\S]{0,120}?\b(?:eval|exec|new\s+Function)\s*\(/i,
    explanation: '先 fetch 远程内容再执行（fetch -> eval/exec）',
  },
  {
    id: 'destructive',
    severity: 'critical',
    re: /rm\s+-rf\s+(?:\/\*(?![\/\w])|\/(?=[\s;&|]|$)|~(?=[\s;&|\/]|$))|shutil\.rmtree\(\s*['\"]\/|fs\.rmSync\s*\([^)]{0,80}recursive\s*:\s*true[^)]{0,40}['\"]\/(?:[*"\s])/i,
    explanation: '包含破坏性系统命令（rm -rf 根目录/主目录等）',
  },
  {
    id: 'fork-bomb',
    severity: 'critical',
    re: /:\s*\(\s*\)\s*\{\s*:\s*\|[^\n]*&/i,
    explanation: '包含 fork 炸弹模式',
  },
  {
    id: 'crypto-mining',
    severity: 'critical',
    // 仅命中明确的挖矿工具名（xmrig/nanominer/kryptex/moneroocean），降低对合法文档/池配置中
    // 通用词 cryptonight / stratum+tcp / 算力库说明 的误报。
    re: /\b(?:xmrig|nanominer|kryptex|moneroocean)\b/i,
    explanation: '包含加密货币挖矿相关代码/配置（明确挖矿工具名）',
  },
  {
    id: 'exfil-endpoint',
    severity: 'critical',
    re: /webhook\.site|requestbin|pipedream|discord\.com\/api\/webhooks|api\.telegram\.org\/bot\d+|ngrok\.io|serveo\.net|localtunnel\.me|smee\.io|cloudflared\s+tunnel/i,
    explanation: '可能把数据发送到第三方收集端点',
  },
  {
    id: 'websocket-exfil',
    severity: 'critical',
    re: /\bnew\s+WebSocket\s*\(\s*['"`]wss?:\/\//i,
    explanation: '建立 WebSocket 外联连接',
  },
  {
    id: 'base64',
    severity: 'warning',
    re: /atob\s*\(|Buffer\.from\s*\([^,]+,\s*['"]base64['"]|base64\s+-d|Convert\.FromBase64String/i,
    explanation: '存在 Base64 解码行为',
  },
  {
    id: 'keylog',
    severity: 'warning',
    re: /addEventListener\s*\(\s*['"](?:keydown|keypress|keyup)['"]/i,
    explanation: '监听键盘输入事件',
  },
  {
    id: 'screen-capture',
    severity: 'warning',
    re: /desktopCapturer|getDisplayMedia|captureStream|webContents\.capturePage|screenshot\s*\(/i,
    explanation: '使用屏幕/画面采集能力',
  },
];

// --- 硬编码密钥扫描（高精度锚点 + 占位符上下文降噪） ---
const SECRET_RULES = [
  { id: 'secret-aws', re: /\bAKIA[0-9A-Z]{16}\b/g, label: 'AWS Access Key' },
  { id: 'secret-github', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|github_pat_[A-Za-z0-9_]{22,}\b/g, label: 'GitHub Token' },
  { id: 'secret-private-key', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g, label: '私钥块' },
  { id: 'secret-sk', re: /\bsk-[A-Za-z0-9]{24,}\b/g, label: 'AI API 密钥（sk-*）' },
  { id: 'secret-slack', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g, label: 'Slack Token' },
  { id: 'secret-generic', re: /\b(?:api[_-]?key|secret|password|passwd|token)\s*[:=]\s*['"][A-Za-z0-9\/+_-]{24,}['"]/gi, label: '疑似硬编码密钥' },
];

const PLACEHOLDER_RE = /\b(?:example|placeholder|your[_-]|xxx+|demo|sample|dummy|changeme|test[_-]?key)\b/i;

// 从文本中提取一处命中的证据（文件/行号/截断片段）。
function evidenceFor(text, index, file, maxSnippet = 160) {
  const upto = text.slice(0, index);
  let line = upto.split('\n').length;
  if (text[index] === '\n') line += 1; // 命中位置恰为换行符时归属下一行
  const lineStart = upto.lastIndexOf('\n') + 1;
  const lineEndIdx = text.indexOf('\n', index);
  const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
  let raw = text.slice(lineStart, lineEnd).trim();
  if (raw.length > maxSnippet) raw = `${raw.slice(0, maxSnippet)}…`;
  return { file, line, snippet: raw };
}

// 按行/单行进行匹配并收集证据的通用扫描器。
function scanWithRules(text, rules, meta) {
  const findings = [];
  if (!text || typeof text !== 'string') return findings;
  const file = meta.file || '?';
  for (const rule of rules) {
    const re = new RegExp(rule.re.source, rule.re.flags.replace(/g/g, '') + 'g');
    let match = null;
    let hits = 0;
    const limit = rule.limit ?? 3;
    while ((match = re.exec(text)) !== null && hits < limit) {
      hits += 1;
      const evidence = evidenceFor(text, match.index, file);
      const finding = {
        id: rule.id,
        severity: rule.severity,
        explanation: rule.explanation,
        confidence: typeof rule.confidence === 'number' ? rule.confidence : 1.0,
        ...evidence,
      };
      findings.push(finding);
      if (match[0].length === 0) re.lastIndex += 1; // 防死循环
    }
  }
  return findings;
}

function isAllowlistedHost(text) {
  for (const host of EXTERNAL_URL_ALLOWLIST) {
    if (text.includes(host)) return true;
  }
  return false;
}

/**
 * 确定性安全规则扫描（代码执行/破坏性/外发端点等）。
 * @param {string} text - 待扫描文本（单文件内容或 README）。
 * @param {{file?: string}} meta - 附加元信息（文件名，用于证据）。
 * @returns {Array<{id,severity,explanation,file,line,snippet}>}
 */
// 在开发/测试脚本中降级为 warning 的「灰区执行」规则：CI/构建/测试脚本里跑 git/npm/编解码、
// 用 page.$eval 等属正常开发行为，不代表运行时风险；但仍保留提示供审计。
const DEV_SCRIPT_GRAY_EXEC = new Set([
  'shell-exec',
  'spawn-shell',
  'shell-flag',
  'eval-exec',
  'os-exec',
  'iex-short',
]);

export function scanSecurity(text, meta = {}) {
  const base = scanWithRules(text, SECURITY_RULES, meta);
  // 开发/测试脚本（scripts/、test/ 等）中出现的灰区执行调用降级为 warning，
  // 避免 CI/构建脚本里 execFileSync("git")/page.$eval 等被误判为确定恶意而硬阻断。
  // 确定恶意规则（remote-exec、decode-exec、destructive、exfil-endpoint 等）不受影响，任何位置均阻断。
  const devScript = isDevScriptPath(meta.file);
  return base
    .filter((f) => !(f.id === "websocket-exfil" && isAllowlistedHost(f.snippet)))
    // psOnly：只在其语言/上下文成立时上报（iex 需 PowerShell 场景，避免 JS/TS 里对 this.iex 等误报）。
    .filter((f) => !(PS_ONLY_RULES.has(f.id) && !isPowerShellContext(meta.file, f.snippet)))
    .map((f) => {
      let out = { ...f };
      // 网络外联类（websocket-exfil / exfil-endpoint）标注置信度梯度：
      // URL 含动态拼接（${ / 变量 / +）→ 高置信；引号包裹的固定 URL → 硬编码（0.25，但保留告警——
      // 已知恶意端点/白名单外 WebSocket 的硬编码 URL 本身就是信号，不丢弃，仅用于下游分级/LLM 参考）。
      if (NETWORK_URL_CONFIDENCE_RULES.has(f.id)) {
        const conf = networkUrlConfidence(f.snippet);
        if (conf !== null) out.confidence = Math.min(out.confidence, conf);
      }
      // 开发/测试脚本中的灰区执行降级为 warning。
      if (devScript && DEV_SCRIPT_GRAY_EXEC.has(f.id) && out.severity === "critical") {
        out = { ...out, severity: "warning" };
      }
      return out;
    });
}

// 命中片段中的网络 URL 是「硬编码字符串」还是「动态变量/拼接」（借鉴 agent-audit _compute_ssrf_confidence）：
// 引号包裹的固定 URL → 硬编码（0.25）；URL 内含 ${ / + / 反引号 → 动态（0.9）；仅出现 url/endpoint 等变量名 → 0.85。
function networkUrlConfidence(snippet) {
  const s = snippet || "";
  // 匹配引号包裹的 http(s) / ws(s) 字面量 URL。
  const quoted = /(?:["'])((?:https?|wss?):\/\/[^"']+)(?:["'])/.exec(s);
  if (quoted) {
    const url = quoted[1];
    const dynamic = /\$\{|\+|`/.test(url);
    return dynamic ? 0.9 : 0.25;
  }
  if (/\$\{|\b(?:url|endpoint|host|target)\b/i.test(s)) return 0.85;
  return null;
}

// 网络外联类规则的置信度标签（websocket-exfil / exfil-endpoint）。
const NETWORK_URL_CONFIDENCE_RULES = new Set(["websocket-exfil", "exfil-endpoint"]);
// 判定是否为测试文件（供硬编码密钥启发式降噪）。
// 测试目录/用例文件里出现的硬编码「密钥值」绝大多数是用于验证脱敏/密钥处理的固件假值
// （如 const SECRET = 'sk-dsh-secret-never-log'），并非真实凭据。
const TEST_FILE_RE = /(?:^|\/)(?:__tests__|test|tests|spec|specs)(?:\/|$)|(?:\.|_)(?:test|spec)\./i;

function isTestFilePath(file = '') {
  return TEST_FILE_RE.test(file);
}

// 判定是否为开发/测试脚本路径（scripts/ 目录、测试目录、*.test.* / *.spec.* 用例）。
// 这些文件是构建/验证/脱敏固件等开发期代码：其中的隐私访问、混淆指标通常不代表
// 运行时风险（如 e2e 测试故意读取凭据并外发以验证泄露检测），不应参与风险定级。
// 幂等覆盖 scripts/、test/、tests/、__tests__/、spec/、specs/ 及 .test./.spec. 后缀。
const DEV_SCRIPT_RE =
  /(?:^|\/)(?:__tests__|test|tests|spec|specs|scripts)(?:\/|$)|(?:\.|_)(?:test|spec)\./i;

function isDevScriptPath(file = '') {
  return DEV_SCRIPT_RE.test(file);
}
// 判定是否为 PowerShell 上下文：.ps1/.psm1/.psd1 文件，或片段邻近 powershell/pwsh 关键字。
// 用于 gating iex / Invoke-Expression 简写等 token 规则，避免在 JS/TS 里把 this.iex 等误报。
function isPowerShellContext(file = '', snippet = '') {
  if (/\.(?:ps1|psm1|psd1)$/i.test(file)) return true;
  if (/powershell|\bpwsh\b/i.test(snippet)) return true;
  return false;
}

// psOnly 规则：仅在其所属语言/上下文成立时才上报（当前为 PowerShell 简写 iex）。
const PS_ONLY_RULES = new Set(['iex-short']);


/**
 * 硬编码密钥扫描。命中即 critical；带占位符上下文、或命中测试文件里的启发式
 * 「疑似硬编码密钥」规则（secret-generic）时降级为忽略。
 * @returns {Array<{id,severity,explanation,file,line,snippet}>}
 */
export function scanSecrets(text, meta = {}) {
  const findings = [];
  if (!text) return findings;
  const file = meta.file || '?';
  const testFile = isTestFilePath(file);
  for (const rule of SECRET_RULES) {
    if (testFile && rule.id === 'secret-generic') {
      // 测试文件中的 secret/password/token = '...' 等启发式值多为固件假值，不视为真实密钥。
      continue;
    }
    const re = new RegExp(rule.re.source, rule.re.flags.includes('g') ? rule.re.flags : rule.re.flags + 'g');
    let match = null;
    while ((match = re.exec(text)) !== null) {
      const { line, snippet } = evidenceFor(text, match.index, file);
      if (PLACEHOLDER_RE.test(snippet)) {
        // 占位符上下文（example/your_key/xxx 等）不是真实密钥。
        continue;
      }
      findings.push({
        id: rule.id,
        severity: 'critical',
        explanation: `硬编码敏感凭据（${rule.label}）`,
        file,
        line,
        snippet,
      });
    }
  }
  return findings;
}

/**
 * 混淆度量检测：长 Base64/URL-safe 块、八进制/十六进制/Unicode 转义串、fromCharCode。
 * @returns {Array<{id,severity,explanation,file,line,snippet}>}
 */
export function scanObfuscation(text, meta = {}) {
  const findings = [];
  if (!text) return findings;
  const file = meta.file || '?';
  // 开发/测试脚本中的长 Base64/转义串多是测试向量、脱敏固件或构建产物，非运行时混淆，跳过。
  if (isDevScriptPath(file)) return findings;
  const blob = /[A-Za-z0-9+/]{80,}={0,2}/g;
  let m = null;
  while ((m = blob.exec(text)) !== null) {
    findings.push({
      id: 'obfuscation',
      severity: 'warning',
      explanation: '存在疑似混淆内容（长 Base64 块）',
      ...evidenceFor(text, m.index, file),
    });
  }
  const hexRun = /(?:\\x[0-9a-fA-F]{2}){8,}|(?:\\u[0-9a-fA-F]{4}){4,}|(?:%[0-9a-fA-F]{2}){8,}|(?:&#x?[0-9a-fA-F]+;){6,}/g;
  let h = null;
  while ((h = hexRun.exec(text)) !== null) {
    findings.push({
      id: 'hex-encoded',
      severity: 'warning',
      explanation: '存在编码转义字符串（疑似混淆）',
      ...evidenceFor(text, h.index, file),
    });
  }
  const charCode = /String\.fromCharCode\s*\(/g;
  let c = null;
  while ((c = charCode.exec(text)) !== null) {
    findings.push({
      id: 'char-code',
      severity: 'warning',
      explanation: '使用 String.fromCharCode 构造字符串（常见于混淆代码）',
      ...evidenceFor(text, c.index, file),
    });
  }
  return findings.slice(0, 12);
}

/**
 * 提取文本中所有非白名单外部主机名（去重、截断）。
 * @returns {string[]}
 */
export function extractExternalHosts(text) {
  const hosts = new Set();
  if (!text) return [];
  const re = /https?:\/\/([a-z0-9.-]+)/gi;
  let m = null;
  while ((m = re.exec(text)) !== null) {
    const host = (m[1] || '').toLowerCase();
    if (!host) continue;
    // 忽略本机/内网 IP 字面量与 localhost（不属于「第三方网络地址」）。
    if (host === 'localhost' || isIpLiteral(host)) continue;
    const root = host.startsWith('www.') ? host.slice(4) : host;
    const allowlisted = EXTERNAL_URL_ALLOWLIST.some((h) => root === h || root.endsWith(`.${h}`));
    if (!allowlisted) hosts.add(root);
  }
  return [...hosts].sort();
}

function isIpLiteral(host) {
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
  return host.split('.').every((octet) => Number(octet) >= 0 && Number(octet) <= 255);
}

// --- 仓库文件清单（tree 路径）零成本信号 ---
// 只做路径级判定，不额外消耗 content API。参考 ICSE'22 恶意 npm 包检测
// （Sejfia & Schäfer）中的「可疑文件形态」特征，仅保留低误报子集：
// 双重扩展名伪装（logo.png.exe / payload.js.bat 等）。单一的 .msi/.exe 等
// 正常安装器（如桌面端插件）不命中。
const EXEC_EXT_RE = /\.(?:exe|bat|scr|vbs|cmd|jar|msi|dll|bin|apk|ipa|vbe|com)$/i;

/**
 * 扫描仓库文件清单中的可疑路径形态（零 API 成本）。
 * @param {string[]} paths - git tree 的文件路径列表。
 * @returns {Array<{id,severity,explanation,file,line,snippet}>}
 */
export function scanPaths(paths = []) {
  const findings = [];
  for (const p of paths) {
    if (typeof p !== 'string' || p.length > 300) continue;
    if (!EXEC_EXT_RE.test(p)) continue;
    const base = p.slice(p.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');
    if (!base.includes('.')) continue; // 单一扩展名的可执行/安装文件属正常形态
    findings.push({
      id: 'suspicious-extension',
      severity: 'warning',
      explanation: `存在双重扩展名文件（${p}），可能为伪装的可执行文件`,
      file: p,
      line: 0,
      snippet: p.slice(-120),
    });
    if (findings.length >= 6) break;
  }
  return findings;
}

// --- 隐私泄露检测（保留原有语义，增加证据与主机名透明度） ---
const ENV_ACCESS = /process\.env|os\.environ|getenv\s*\(|environ\[/i;
// 注：DSH_ 前缀代表 DeepSeek Harness 自身注入的配置/路径/会话环境变量命名空间
// （如 DSH_HOME=home 目录路径、DSH_SHELL、DSH_SESSION_ID），并非凭据。真正敏感的
// DSH_TEST_* 或 *_API_KEY 等已由其名中 SECRET/TOKEN/KEY 捕获，故不将 DSH_ 整体列入凭据类，
// 避免 process.env.DSH_HOME 等良性用法被误判为“读取凭据类环境变量”。
const ENV_CRED =
  /(?:process\.env|os\.environ|getenv\s*\(\s*['"]?)[^)\n]{0,60}(?:SECRET|TOKEN|KEY|PASSWORD|PASSWD|CREDENTIAL|AWS_|OPENAI|ANTHROPIC|GITHUB)/i;
const NETWORK_SEND =
  /fetch\s*\(|axios|https?\.request\s*\(|requests\.(?:get|post|put|patch)\s*\(|sendBeacon\s*\(|XMLHttpRequest|WebSocket/i;
const CRED_FILES =
  /(?:\.ssh\/|id_rsa|\.aws\/credentials|\.npmrc|\.netrc|keychain|credentials\.json)\b/i;
const DOTENV_FILE = /(?:^|[^A-Za-z0-9_.])\.env(?:\.[A-Za-z0-9_-]+)?\b/i;
const BROWSER_STORE = /document\.cookie|localStorage|sessionStorage/i;

/**
 * 同文件隐私风险判定。
 * @returns {Array<{severity,explanation,file,line?}>}
 */
export function privacyFindings(text, meta = {}) {
  const notes = [];
  if (!text) return notes;
  const file = meta.file || '?';
  // 开发/测试脚本中的隐私行为（e2e 验证、脱敏固件等）不代表运行时风险，critical 降级为 warning。
  const devScript = isDevScriptPath(file);
  const criticalOrWarn = (severity) => (devScript ? 'warning' : severity);
  // 隐私 note 也带位置留痕（file:line + snippet），供 evidence 追溯（与安全 finding 一致）。
  const positioned = (note, index) => ({ ...note, ...evidenceFor(text, index, file) });
  const env = ENV_ACCESS.test(text);
  const envCred = ENV_CRED.test(text);
  const network = NETWORK_SEND.test(text);
  const credFiles = CRED_FILES.test(text);
  // dotenv 读取 .env 文件是 Node 插件加载配置的标准做法，仅作 warning，不与 network 组合成确定恶意。
  const dotenvRead = !credFiles && DOTENV_FILE.test(text);
  const browserStore = BROWSER_STORE.test(text);
  const hosts = extractExternalHosts(text).slice(0, 4);
  const hostSuffix = hosts.length ? `（如 ${hosts.join('、')}）` : '';

  // 仅为「读取本地凭据文件」不构成确定恶意（SSH/git/云插件读取 .ssh/.aws/.npmrc 属合法操作），
  // 只有「读取 + 同文件网络外发」才升级为确定恶意（硬阻断）。
  if (credFiles && network) {
    notes.push({ severity: criticalOrWarn('critical'), explanation: '读取本地凭据文件并发送到网络，可能泄露密钥', file });
  } else if (credFiles) {
    notes.push({ severity: criticalOrWarn('warning'), explanation: '读取本地凭据文件（如 .ssh/.aws/.npmrc）', file });
  }
  // dotenv：.env 是标准配置加载，独立告警、不参与确定恶意判定（避免被误判为窃密外发）。
  if (dotenvRead) {
    notes.push({ severity: criticalOrWarn('warning'), explanation: '读取本地环境配置文件（dotenv .env）', file, index: text.search(DOTENV_FILE) });
  }
  if (envCred && network) {
    notes.push({ severity: criticalOrWarn('critical'), explanation: '读取凭据类环境变量并发送到网络，可能泄露密钥', file });
  }
  if (browserStore && network) {
    // 浏览器存储读取只有「值确实进入网络请求」才升级为确定恶意（DM 文案）；
    // 否则（仅本地状态持久化 + 调 API）按灰区 warning 处理。
    const exfil = browserStoreExfil(text);
    if (exfil) {
      notes.push(positioned({ severity: criticalOrWarn('critical'), explanation: '读取浏览器 Cookie/存储并发送到网络', file }, exfil.index));
    } else {
      notes.push(positioned({ severity: criticalOrWarn('warning'), explanation: '读取浏览器 Cookie/存储（未发现值进入请求，需自行确认不外发）', file }, text.search(BROWSER_STORE)));
    }
  }
  if (env && externalUrlHasHosts(text) && !envCred) {
    notes.push(positioned({ severity: 'warning', explanation: `读取环境变量并访问第三方地址，需确认未外发敏感信息${hostSuffix}`, file }, text.search(ENV_ACCESS)));
  } else if (env && !envCred) {
    notes.push(positioned({ severity: 'warning', explanation: '读取环境变量（可能包含敏感信息）', file }, text.search(ENV_ACCESS)));
  }
  if (externalUrlHasHosts(text)) {
    notes.push(positioned({ severity: 'warning', explanation: `访问第三方网络地址${hostSuffix}`, file }, hostIndex(text)));
  }
  return notes;
}


// 定位第一个非白名单外部主机 URL 的出现位置（供「访问第三方网络地址」note 留痕）。
function hostIndex(text) {
  const m = text.match(/https?:\/\/([a-z0-9.-]+)/i);
  return m ? m.index : 0;
}
function externalUrlHasHosts(text) {
  return extractExternalHosts(text).length > 0;
}

// 浏览器存储「真外发」判定：仅当读取的浏览器存储值被赋值给变量、
// 且该变量出现在同一文件某处网络发送调用（fetch/axios/XHR/WebSocket）的参数中，
// 才认为存在「读取浏览器 Cookie/存储并发送到网络」的确定性外发行为。
// 否则（如 localStorage 仅用于存 UI 状态 + 相对路径 fetch 调自己 API）属正常 DSH 客户端操作，
// 只作灰区 warning，不升级为确定恶意。
const BROWSER_STORE_READ_RE =
  /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:document\.cookie|localStorage\.getItem\s*\([^)]*\)|localStorage\[[^]]*\]|sessionStorage\.getItem\s*\([^)]*\)|sessionStorage\[[^]]*\])/g;

export function browserStoreExfil(text = '') {
  if (!text) return null;
  // 收集被赋值的浏览器存储读取变量名
  const readVars = new Set();
  const readPositions = [];
  let m = null;
  const re = new RegExp(BROWSER_STORE_READ_RE.source, BROWSER_STORE_READ_RE.flags.replace(/g/g, '') + 'g');
  while ((m = re.exec(text)) !== null) {
    if (m[1]) readVars.add(m[1]);
    readPositions.push(m.index);
  }
  if (readVars.size === 0) return null;
  // 网络发送调用：对每个命中，提取「完整参数区域」（括号配对、跨行），
  // 只有读取变量以词边界形式出现在参数区域内部，才判定该值进入了请求。
  const sendRe =
    /fetch\s*\(|axios(?:\.\w+)?\s*\(|new\s+XMLHttpRequest|WebSocket\s*\(|sendBeacon\s*\(/gi;
  let s = null;
  const usedVars = new Set();
  while ((s = sendRe.exec(text)) !== null) {
    const open = text.indexOf('(', s.index);
    if (open === -1 || open - s.index > 120) continue;
    const close = matchingParen(text, open);
    if (close === -1) continue;
    const args = text.slice(open + 1, close);
    // 只有请求目标是「外部绝对 URL」（http/https 且非白名单）才存在真正的数据外发；
    // 相对路径（fetch('/api/..') 调自己后端）属正常 DSH 客户端操作，不算外发。
    if (!callTargetIsExternal(args)) continue;
    for (const v of readVars) {
      if (new RegExp('\\b' + v + '\\b').test(args)) usedVars.add(v);
    }
  }
  if (usedVars.size === 0) return null;
  return { index: readPositions[0] ?? 0, vars: [...usedVars] };
}

// 从 start 处开始，用括号配对提取匹配的右括号位置（跳过字符串/注释内的括号，限制扫描深度）。
function matchingParen(text, start, maxLen = 2000) {
  const end = Math.min(text.length, start + maxLen);
  let depth = 0;
  let inStr = null; // null | ' | "
  let inLineComment = false;
  for (let pos = start; pos < end; pos += 1) {
    const ch = text[pos];
    const next = text[pos + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inStr) {
      if (ch === '\\') { pos += 1; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '/' && next === '/') { inLineComment = true; pos += 1; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '(') depth += 1;
    else if (ch === ')') {
      depth -= 1;
      if (depth === 0) return pos;
    }
  }
  return -1; // 未找到配平（超深或语法奇异），保守返回 -1
}


// 提取网络调用参数区域中的第一个字符串字面量作为请求目标，判断是否为「外部绝对 URL」。
// - 相对路径（/api/...）、协议相对（//...）或无 URL（如 WebSocket 变量）不算外部外发；
// - 绝对 http(s) URL 若命中外联白名单（github.com 等文档/基础设施域）也不算可疑外发。
function callTargetIsExternal(args = '') {
  const m = args.match(/(['"`])(https?:\/\/[^'"`]+)\1/);
  if (!m) return false;
  const url = m[2];
  const host = url.replace(/^https?:\/\//i, '').split(/[/?#]/)[0].toLowerCase();
  if (!host) return false;
  const root = host.startsWith('www.') ? host.slice(4) : host;
  const allowlisted = EXTERNAL_URL_ALLOWLIST.some((h) => root === h || root.endsWith('.' + h));
  return !allowlisted;
}


// --- 包生命周期脚本与供应链分析 ---
const POPULAR_PACKAGES = [
  'express', 'axios', 'request', 'lodash', 'async', 'ws', 'sharp', 'playwright',
  'puppeteer', 'moment', 'underscore', 'chalk', 'commander', 'yargs', 'react',
  'react-dom', 'vue', 'typescript', 'esbuild', 'vite', 'webpack', 'tslib',
  'rxjs', 'bluebird', 'debug', 'minimist', 'uuid', 'jsonwebtoken', 'bcrypt',
  'socket.io', 'cheerio', 'fastify', 'koa', 'helmet', 'nodemailer', 'mysql2',
  'pg', 'redis', 'ioredis', 'zod', 'dotenv', 'cross-env', 'rimraf', 'concurrently',
  'node-fetch', 'glob', 'fs-extra', 'semver', 'rimraf', 'shelljs', 'execa',
];

/** 经典 Damerau–Levenshtein 距离（小字符串）。 */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 1; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
      }
    }
  }
  return dp[m][n];
}

/**
 * 依赖名仿冒（typosquat）启发式：与知名包编辑距离 <= 2 视为可疑。
 * @returns {Array<{name, closeTo, distance}>}
 */
export function findTyposquatCandidates(pkg) {
  const candidates = [];
  if (!pkg || typeof pkg !== 'object') return candidates;
  const deps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];
  for (const dep of deps) {
    // 生态/官方包（@deepseek-ai/* 等）是 DSH 插件会合法依赖的框架包，不可能是对
    // 第三方知名包的仿冒（如 @deepseek-ai/cordis 被误判为接近 ioredis），一律跳过。
    if (/^@[a-z0-9][\w.-]*\//.test(dep) && /deepseek|dsh|cordis/i.test(dep)) continue;
    const base = dep.includes('/') ? dep.slice(dep.indexOf('/') + 1).toLowerCase() : dep.toLowerCase();
    // 短名（<4 字符）过于歧义，跳过，避免把 ws/rss/web/api 等误报为仿冒。
    if (base.length < 4) continue;
    for (const popular of POPULAR_PACKAGES) {
      if (base === popular) continue;
      const distance = levenshtein(base, popular);
      // 名称越长越可信：6+ 字符允许距离 2，4-5 字符只认距离 1。
      const threshold = base.length >= 6 ? 2 : 1;
      if (distance > 0 && distance <= threshold) {
        candidates.push({ name: dep, closeTo: popular, distance });
      }
    }
  }
  // 每个依赖只保留最接近的一个命中，避免重复告警。
  const seen = new Map();
  for (const c of candidates) {
    const prev = seen.get(c.name);
    if (!prev || c.distance < prev.distance) seen.set(c.name, c);
  }
  return [...seen.values()].slice(0, 10);
}

/**
 * 分析 package.json：安装生命周期脚本风险 + 仿冒依赖名。
 * @param {object} pkg - 已解析的 package.json。
 * @param {{file?: string}} meta
 * @returns {Array<{id,severity,explanation,file,line,snippet}>}
 */
export function analyzePackageManifest(pkg, meta = {}) {
  const findings = [];
  if (!pkg || typeof pkg !== 'object') return findings;
  const file = meta.file || '<package.json>';
  const scripts = pkg.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};
  const lifecycleKeys = [
    'preinstall', 'install', 'postinstall', 'prepare',
    'preuninstall', 'prepack', 'postpack', 'prepublish', 'postpublish',
  ];
  for (const key of lifecycleKeys) {
    const cmd = scripts[key];
    if (typeof cmd !== 'string' || !cmd.trim()) continue;
    const finding = {
      id: `lifecycle-${key}`,
      severity: 'warning',
      explanation: `package.json 的 ${key} 脚本会在安装/发布时自动执行`,
      file,
      line: 0,
      snippet: cmd.trim().slice(0, 160),
    };
    if (
      /(?:curl|wget|iwr)[^|>\n]*\|\s*(?:ba)?sh\b|Invoke-Expression|powershell[^\n]*-enc/i.test(cmd) ||
      /node\s+[\w./-]*install[\w./-]*\.(?:js|mjs)[^|>\n]*\|\s*(?:ba)?sh\b/i.test(cmd)
    ) {
      finding.severity = 'critical';
      finding.id = `lifecycle-${key}-remote-exec`;
      finding.explanation = `package.json 的 ${key} 脚本下载并执行远程代码`;
    } else if (/rm\s+-rf\s+(?:\/\s*\*|\/\s*$|\/~|\$HOME)/i.test(cmd)) {
      finding.severity = 'critical';
      finding.id = `lifecycle-${key}-destructive`;
      finding.explanation = `package.json 的 ${key} 脚本包含破坏性命令`;
    } else if (/eval\s*\(|new\s+Function\s*\(/i.test(cmd) || /child_process\.exec(Sync)?\s*\(/i.test(cmd)) {
      finding.severity = 'warning';
      finding.id = `lifecycle-${key}-dynamic`;
      finding.explanation = `package.json 的 ${key} 脚本包含动态代码执行`;
    }
    findings.push(finding);
  }

  for (const c of findTyposquatCandidates(pkg)) {
    findings.push({
      id: 'typosquat',
      severity: 'warning',
      explanation: `依赖 ${c.name} 与知名包 ${c.closeTo} 名称高度相似（编辑距离 ${c.distance}），存在仿冒风险`,
      file,
      line: 0,
      snippet: c.name,
    });
  }
  return findings;
}

function semverCore(spec) {
  if (typeof spec !== 'string') return null;
  const m = spec.match(/\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?/);
  return m ? m[0] : null;
}

/**
 * 通过 OSV API 批量查询依赖已知漏洞（供应链检查）。
 * 外部服务不可用时不抛异常，返回 { status: 'failed'|'skipped', findings: [] }。
 * @param {Array<object>} pkgs - 解析后的 package.json 列表。
 * @param {{osvCheck?: boolean, fetchImpl?: Function, log?: object, retryDelayMs?: number}} opts
 * @returns {Promise<{status: string, findings: Array}>}
 */
export async function analyzeDependencies(
  pkgs,
  { osvCheck = true, fetchImpl = globalThis.fetch, log = console, retryDelayMs = 2000 } = {},
) {
  const empty = { status: 'skipped', findings: [] };
  if (!osvCheck) return empty;
  if (typeof fetchImpl !== 'function') return empty;

  const queries = [];
  const seen = new Set();
  for (const pkg of pkgs) {
    if (!pkg || typeof pkg !== 'object') continue;
    const deps = { ...(pkg.dependencies || {}), ...(pkg.peerDependencies || {}) };
    for (const [name, spec] of Object.entries(deps)) {
      if (typeof name !== 'string' || typeof spec !== 'string') continue;
      if (name.startsWith('@deepseek-ai/')) continue; // 生态包自身的漏洞语义不同，跳过
      const version = semverCore(spec);
      if (!name || !version) continue;
      const key = `${name}@${version}`;
      if (seen.has(key)) continue;
      seen.add(key);
      queries.push({ package: { name, ecosystem: 'npm' }, version });
    }
  }
  if (!queries.length) return { status: 'skipped', findings: [] };

  try {
    // OSV API 免费、无鉴权、当前未强制限流（google/osv.dev#321），但官方建议客户端
    // 防御性调用：超时、瞬时故障退避重试、单批次上限（endpoint 上限 1000 条/批）。
    let res = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        res = await fetchImpl('https://api.osv.dev/v1/querybatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queries: queries.slice(0, 1000) }),
          signal: AbortSignal.timeout(30_000),
        });
        break;
      } catch (err) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, retryDelayMs)); // 瞬时故障退避重试
          continue;
        }
        throw err;
      }
    }
    if (!res.ok) throw new Error(`OSV API status ${res.status}`);
    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    const findings = [];
    results.forEach((entry, i) => {
      const q = queries[i];
      if (!q || !entry) return;
      const vulns = Array.isArray(entry.vulns) ? entry.vulns : [];
      if (!vulns.length) return;
      const ids = vulns.slice(0, 3).map((v) => v.id || 'OSV').join(', ');
      findings.push({
        id: 'osv-vuln',
        severity: 'warning',
        explanation: `依赖 ${q.package.name}@${q.version} 存在已知漏洞（${ids}）`,
        file: '<dependencies>',
        line: 0,
        snippet: `${q.package.name}@${q.version}`,
      });
    });
    return { status: 'ok', findings };
  } catch (err) {
    if (log?.warn) log.warn(`[security-review] OSV 查询失败（忽略，不阻断）: ${err.message}`);
    return { status: 'failed', findings: [] };
  }
}

// 确定恶意模式（硬排除，仍 blocked、不收录）：
// 这些 finding 命中即视为恶意软件行为，无正当用途，不能通过「排版展示/使用者自行判断」合理化。
// 与之相对，未列入此集合的其它 critical（如读取凭据类环境变量并外发、动态执行、屏幕采集、硬编码密钥、
// lifecycle 动态脚本等）视为「灰区高风险」，允许收录但标记 risk_level=high 供使用者自行裁决。
const DEFINITE_MALICE_IDS = new Set([
  // 远程/动态代码执行
  'remote-exec',          // curl|sh 下载并执行
  'encoded-command',      // PowerShell -EncodedCommand
  'invoke-expression',    // PowerShell 动态表达式
  'decode-exec',          // Base64/编码字符串 -> eval
  'remote-code-import',   // import/require 远程 URL
  'remote-code-fetch-eval', // fetch -> eval/exec
  'shell-exec',           // child_process.exec/execSync
  'spawn-shell',          // spawn(...,{shell:true})
  'shell-flag',           // Python subprocess shell=True
  // 破坏性/恶意负载
  'destructive',          // rm -rf 根/主目录
  'fork-bomb',            // fork 炸弹
  'crypto-mining',        // 挖矿
  'exfil-endpoint',       // webhook.site/discord/telegram/ngrok 外发端点
  'websocket-exfil',      // WebSocket 外联（白名单外）
  // 包生命周期脚本中的确定性恶意
  'lifecycle-remote-exec', // 安装脚本下载并执行远程代码（* 通配覆盖 lifecycle-*-remote-exec）
  'lifecycle-destructive', // 安装脚本含破坏性命令（* 通配覆盖 lifecycle-*-destructive）
]);

// 按 finding id 或隐私文案判定是否属于「确定恶意」（硬排除，应 blocked）。
// 命中 DEFINITE_MALICE_IDS，命中 `lifecycle-*-remote-exec` / `lifecycle-*-destructive` 形态，
// 或命中隐私「直接窃取本地凭据文件 / 窃取浏览器 Cookie 存储」文案。
export function isDefiniteMalice(f) {
  if (!f) return false;
  // 隐私 finding 无 id，用文案判定：读取磁盘凭据文件「并外发」、窃取浏览器 Cookie/存储 属确定性恶意；
  // 仅读取本地凭据文件（无外发）为灰区高风险（SSH/git/云插件合法操作）。
  if (!f.id) {
    return /读取本地凭据文件并发送到网络|浏览器\s*Cookie|\blocalStorage|\bsessionStorage/.test(f.explanation || '');
  }
  return (
    DEFINITE_MALICE_IDS.has(f.id) ||
    /^lifecycle-.+-(?:remote-exec|destructive)$/.test(f.id)
  );
}

/**
 * 汇总每个插件的风险层级（供收录展示，区别于 verdict 的合并门禁）：
 *   - definite-malice critical（隐私或安全）-> 'high'（但此类最终 blocked，不会收录展示）
 *   - 其它 critical（灰区高风险，如凭据类环境变量外发、动态执行、屏幕采集、硬编码密钥）-> 'high'
 *   - 有 warning 提示 -> 'moderate'
 *   - 干净 -> 'low'
 * 同时返回 risk_evidence：结构化风险位置 [{explanation, file, line}]，供 UI/README 内联「文件:行号」定位；
 * 拿不到行号时降级为文件路径，连文件都没有时（如 OSV 依赖漏洞）记依赖名/label。
 * @param {Array<{severity,id,explanation,file?,line?}>} findings
 * @param {Array<{severity,explanation,file?}>} privacyNotes
 * @returns {{ risk_level: 'low'|'moderate'|'high', risk_notes: string[], risk_evidence: Array<{explanation,file,line?}> }}
 */
export function classifyRiskLevel({ findings = [], privacyNotes = [] } = {}) {
  const all = [...findings, ...privacyNotes];
  const critical = all.filter((f) => f.severity === 'critical');
  const warnings = all.filter((f) => f.severity === 'warning');

  // 位置降级策略：line>0 则记录 文件:行；缺行或 line=0 但带文件则记文件；两者皆无则记解释文本/label。
  function locOf(f) {
    if (Number(f.line) > 0) return `${f.file || '?'}:${f.line}`;
    if (f.file) return f.file;
    return null;
  }

  // 归一化：同一 (explanation, file, line) 去重。
  const evidenceMap = new Map();
  function pushEvidence(f, explanation) {
    const key = `${explanation}\u0000${f.file || ''}\u0000${Number(f.line) > 0 ? f.line : 0}`;
    if (evidenceMap.has(key)) return;
    const entry = { explanation };
    if (f.file) entry.file = f.file;
    if (Number(f.line) > 0) entry.line = f.line;
    evidenceMap.set(key, entry);
  }

  const notes = [];
  if (critical.length) {
    for (const f of critical) {
      const loc = locOf(f);
      const prefix = isDefiniteMalice(f) ? '【确定恶意，已阻断】' : '【高风险，请自行审计】';
      notes.push(`${prefix}${f.explanation}${loc ? ` @ ${loc}` : ''}`);
      pushEvidence(f, f.explanation);
    }
    // 高风险插件也纳入 warning 位置，供使用者一并定位审计（risk_level 仍为 high）。
    for (const f of warnings) {
      const loc = locOf(f);
      notes.push(`${f.explanation}${loc ? ` @ ${loc}` : ''}`);
      pushEvidence(f, f.explanation);
    }
    return { risk_level: 'high', risk_notes: [...new Set(notes)], risk_evidence: [...evidenceMap.values()] };
  }
  if (warnings.length) {
    for (const f of warnings) {
      const loc = locOf(f);
      notes.push(`${f.explanation}${loc ? ` @ ${loc}` : ''}`);
      pushEvidence(f, f.explanation);
    }
    return {
      risk_level: 'moderate',
      risk_notes: [...new Set(notes)],
      risk_evidence: [...evidenceMap.values()],
    };
  }
  return { risk_level: 'low', risk_notes: [], risk_evidence: [] };
}

/** 汇总裁决：任一确定恶意 critical -> blocked（硬排除）；其它 critical/warning 归入 flagged 供收录展示。 */
export function composeVerdict({ findings = [], privacyNotes = [] }) {
  const all = [...findings, ...privacyNotes];
  const definiteCritical = all.filter((f) => f.severity === 'critical' && isDefiniteMalice(f));
  const highRisk = all.filter((f) => f.severity === 'critical' && !isDefiniteMalice(f));
  const warnings = all.filter((f) => f.severity === 'warning');
  const notes = (list) => [...new Set(list.map((f) => f.explanation))];
  if (definiteCritical.length) {
    return {
      verdict: 'blocked',
      blockedReasons: notes(definiteCritical),
      flaggedReasons: notes([...highRisk, ...warnings]),
      highRiskReasons: notes(highRisk),
    };
  }
  if (highRisk.length) {
    return {
      verdict: 'flagged',
      blockedReasons: [],
      flaggedReasons: notes(highRisk),
      highRiskReasons: notes(highRisk),
    };
  }
  if (warnings.length) {
    return {
      verdict: 'flagged',
      blockedReasons: [],
      flaggedReasons: notes(warnings),
      highRiskReasons: [],
    };
  }
  return { verdict: 'approved', blockedReasons: [], flaggedReasons: [], highRiskReasons: [] };
}

// --- 可选 LLM 深度复核（OpenAI 兼容 chat/completions） ---
function sampleSnippets(findings, limit = 12) {
  return (findings || [])
    .slice(0, limit)
    .map((f) => `${f.file || '?'}:${f.line || 0} [${f.severity} ${f.id}] ${f.explanation} :: ${String(f.snippet || '').slice(0, 120)}`);
}

function buildPrompt(dossier) {
  const d = dossier || {};
  return [
    '你是第三方插件安全审查员。以下是一个 DeepSeek Harness 插件仓库的确定性扫描结果与代码样本。',
    '你的任务是发现确定性规则未覆盖的恶意行为（如：混淆后的窃密、隐蔽数据外发、隐藏的远程控制、供应链投毒迹象），',
    '不要报告良性用法（读取环境变量属于正常插件行为，除非它与外发结合）。',
    '',
    `仓库：${d.repo || '?'}`,
    `当前裁决：${d.verdict || 'approved'}`,
    `外部主机：${(d.externalHosts || []).slice(0, 10).join(', ') || '无'}`,
    `包脚本/依赖摘要：${(d.packageSummary || []).slice(0, 20).join(' | ') || '无'}`,
    '',
    '确定性发现：',
    ...(d.findings || []).slice(0, 15).map((f) => `- ${f}`),
    '',
    '代码样本：',
    ...(d.samples || []).slice(0, 12).map((s) => `- ${s}`),
    '',
    '只输出 JSON，不要输出其它文本，格式：',
    '{"escalation":"none|warning|critical","additionalFindings":[{"severity":"critical|warning|info","title":"简述","evidence":"局部的代码/文件证据","rationale":"为什么值得怀疑"}],"rationale":"一句话总结"}',
  ].join('\n');
}

/**
 * 可选的 LLM 深度复核。未配置 LLM_API_KEY / 调用失败时返回 status 标记，绝不抛异常。
 * @param {object} dossier - 审查材料汇总。
 * @param {{apiUrl?, apiKey?, model?, timeoutMs?, maxTokens?, fetchImpl?}} opts
 * @returns {Promise<{status: 'skipped'|'ok'|'error', verdict?: string, findings?: Array, rationale?: string, error?: string}>}
 */
export async function llmReview(dossier, opts = {}) {
  const apiKey = opts.apiKey ?? process.env.LLM_API_KEY;
  if (!apiKey) return { status: 'skipped', verdict: 'none', findings: [], rationale: '未配置 LLM_API_KEY' };
  const apiUrl = opts.apiUrl ?? (process.env.LLM_API_URL || 'https://api.deepseek.com/chat/completions');
  const model = opts.model ?? (process.env.LLM_MODEL || 'deepseek-chat');
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== 'function') return { status: 'error', verdict: 'none', findings: [], error: 'no fetch' };
  try {
    const res = await fetchImpl(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: '你是第三方插件安全审查员，输出严格 JSON。' },
          { role: 'user', content: buildPrompt(dossier) },
        ],
        temperature: 0,
        max_tokens: opts.maxTokens ?? 700,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 45_000),
    });
    if (!res.ok) throw new Error(`LLM API status ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    const parsed = JSON.parse(content);
    return {
      status: 'ok',
      verdict: parsed.escalation ?? 'none',
      findings: Array.isArray(parsed.additionalFindings) ? parsed.additionalFindings : [],
      rationale: parsed.rationale ?? '',
    };
  } catch (err) {
    return { status: 'error', verdict: 'none', findings: [], error: String(err?.message || err) };
  }
}