import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRereviewCandidates,
  cleanseStaleRisk,
  manifestEntryPaths,
  prioritizeScanFiles,
  scanFileScore,
} from './discover-plugins.mjs';

// --- scanFileScore：只对「会运行的文件」给非负分 ---

test('scanFileScore: runnable code files get non-negative scores', () => {
  for (const p of ['src/index.js', 'lib/plugin.mjs', 'cli.ts', 'client.tsx', 'main.cjs', 'component.jsx']) {
    assert.ok(scanFileScore(p) >= 0, `${p} 应为可扫描文件`);
  }
});

test('scanFileScore: docs, config, and non-Node scripts are skipped (score -1)', () => {
  for (const p of [
    'README.md',
    'docs/guide.md',
    'CHANGELOG.md',
    '.github/workflows/ci.yml',
    'config.yaml',
    'deno.json',
    'tsconfig.json',
    'notes.txt',
    'scripts/helper.py',
    'setup.sh',
    'install.ps1',
    'run.zsh',
  ]) {
    assert.equal(scanFileScore(p), -1, `${p} 不应进入内容扫描`);
  }
});

test('scanFileScore: package.json keeps its priority but is not -1 (handled by manifest analysis)', () => {
  assert.equal(scanFileScore('package.json'), 95);
  // 其它 .json（tsconfig/deno/eslint 等）不是运行文件，不扫。
  assert.equal(scanFileScore('tsconfig.json'), -1);
  assert.equal(scanFileScore('nested/package.json'), 95);
  assert.equal(scanFileScore('packages/x/sub/package.json'), 95);
});

test('scanFileScore: Dockerfile/Makefile remain scannable, other extensionless files are not', () => {
  assert.equal(scanFileScore('Dockerfile'), 60);
  assert.equal(scanFileScore('Makefile'), 60);
  assert.equal(scanFileScore('NOTICE'), -1);
  assert.equal(scanFileScore('LICENSE'), -1);
});

// --- manifestEntryPaths：只提取可运行代码入口 ---

test('manifestEntryPaths: only code entries are scanned, json/yml are ignored', () => {
  const pkgs = [
    {
      name: 'p',
      dsh: {
        bundle: 'lib/index.js',
        client: ['lib/client.mjs', 'theme.json'],
        profile: { config: 'profile.yml' },
      },
    },
  ];
  const entries = manifestEntryPaths(pkgs);
  assert.deepEqual(entries, ['lib/index.js', 'lib/client.mjs']);
});

// --- prioritizeScanFiles：文档/配置不进清单 ---

test('prioritizeScanFiles: excludes .md/.yml/.json from scan list, keeps code', () => {
  const paths = [
    'README.md',
    'src/index.js',
    '.github/workflows/ci.yml',
    'plugin.config.yaml',
    'manifest.json',
    'scripts/install.mjs',
    'scripts/helper.py',
  ];
  const result = prioritizeScanFiles(paths, []);
  const set = new Set(result);
  assert.ok(set.has('src/index.js'));
  assert.ok(set.has('scripts/install.mjs'));
  assert.ok(!set.has('README.md'));
  assert.ok(!set.has('.github/workflows/ci.yml'));
  assert.ok(!set.has('plugin.config.yaml'));
  assert.ok(!set.has('manifest.json'));
  assert.ok(!set.has('scripts/helper.py'));
});

// --- cleanseStaleRisk：清洗未重审条目残留的陈旧风险数据 ---

test('cleanseStaleRisk: drops .md-located findings, keeps runnable-file and no-location ones', () => {
  // 08-17 后 schema：有结构化 evidence 与定位说明；privacy/security_notes 是冗余孪生说明
  const stale = {
    id: 'x/y',
    risk_level: 'high',
    risk_notes: [
      '访问第三方网络地址（如 a.com） @ README.md',
      '读取凭据类环境变量并发送到网络，可能泄露密钥 @ src/index.js',
      '使用动态代码执行', // 无定位 -> 保留（真实风险）
    ],
    risk_evidence: [
      { explanation: '访问第三方网络地址', file: 'README.md' },
      { explanation: '读取凭据类环境变量并发送到网络', file: 'src/index.js' },
      { explanation: '使用动态代码执行', file: '' },
      { explanation: '依赖漏洞', file: '<dependencies>' },
    ],
    privacy_notes: ['访问第三方网络地址'],
    security_notes: [],
  };
  const out = cleanseStaleRisk(stale);
  // .md 定位被剔除；可运行文件、无文件、OSV 占位证据保留
  assert.deepEqual(
    out.risk_evidence.map((e) => e.file),
    ['src/index.js', '', '<dependencies>'],
  );
  // README 定位说明被剔除；可运行定位与无定位说明保留
  assert.ok(!out.risk_notes.some((n) => n.includes('README.md')), '应剔除 README.md 定位说明');
  assert.ok(out.risk_notes.includes('使用动态代码执行'), '无定位说明应保留');
  // 有 evidence 时，冗余的 legacy 数组不并入（避免重复），并清空
  assert.ok(!out.risk_notes.includes('访问第三方网络地址'), '有 evidence 时不应并入无定位孪生说明');
  assert.deepEqual(out.privacy_notes, []);
  assert.deepEqual(out.security_notes, []);
  // critical 语义 -> high
  assert.equal(out.risk_level, 'high');
});

test('cleanseStaleRisk: critical runnable-file evidence keeps risk_level high', () => {
  const stale = {
    id: 'a/b',
    risk_level: 'high',
    risk_notes: ['【高风险，请自行审计】读取凭据并发送到网络 @ package.json'],
    risk_evidence: [{ explanation: '【高风险，请自行审计】读取凭据并发送到网络', file: 'package.json' }],
  };
  const out = cleanseStaleRisk(stale);
  assert.equal(out.risk_level, 'high');
  assert.ok(out.risk_evidence.some((e) => e.file === 'package.json'));
});

test('cleanseStaleRisk: only .md-located entry without legacy notes downgrades to low', () => {
  const stale = {
    id: 'c/d',
    risk_level: 'moderate',
    risk_notes: ['访问第三方网络地址 @ README.md'],
    risk_evidence: [{ explanation: '访问第三方网络地址', file: 'README.md' }],
    privacy_notes: [],
    security_notes: [],
  };
  const out = cleanseStaleRisk(stale);
  assert.equal(out.risk_level, 'low');
  assert.deepEqual(out.risk_notes, []);
  assert.deepEqual(out.risk_evidence, []);
});

test('cleanseStaleRisk: no-location legacy notes are kept (not masking real risk)', () => {
  // 旧 schema 条目：risk_evidence 为空，但 privacy_notes 含真实风险说明，不能清空为 low
  const stale = {
    id: 'e/f',
    risk_level: 'moderate',
    risk_notes: [],
    risk_evidence: [],
    privacy_notes: ['读取凭据类环境变量并发送到网络，可能泄露密钥', '访问第三方网络地址'],
    security_notes: ['存在疑似混淆内容'],
  };
  const out = cleanseStaleRisk(stale);
  assert.equal(out.risk_level, 'high', '含凭据泄露语义应保持 high，避免掩盖真实风险');
  assert.ok(out.risk_notes.includes('读取凭据类环境变量并发送到网络，可能泄露密钥'));
  assert.ok(out.risk_notes.includes('存在疑似混淆内容'));
});

// --- buildRereviewCandidates：FORCE_REREVIEW 全量复查候选池（含 blocked 复查） ---

test('buildRereviewCandidates: merges existing entries, excludes official and curated', async () => {
  const base = [{ full_name: 'a/search-repo' }];
  const existing = [
    { id: 'x/listed', stars: 5, source: 'discovered' },
    { id: 'deepseek-ai/dsh-core', source: 'discovered', official: true }, // 官方
    { id: 'y/curated', source: 'curated' }, // 精选
  ];
  const out = await buildRereviewCandidates(base, existing, [], async () => null);
  const names = out.map((r) => r.full_name);
  assert.ok(names.includes('a/search-repo'));
  assert.ok(names.includes('x/listed'), '应并入已收录条目');
  assert.ok(!names.includes('deepseek-ai/dsh-core'), '官方仓库不应参与审查');
  assert.ok(!names.includes('y/curated'), 'curated 精选不应参与审查');
});

test('buildRereviewCandidates: re-includes previously blocked repos for re-review', async () => {
  const base = [];
  const existing = [{ id: 'n/ok', source: 'discovered' }];
  const log = [
    { id: 'n/ok', verdict: 'flagged' },
    { id: 'z/blocked-before', verdict: 'blocked' }, // 旧策略误伤，需复查
    { id: 'deepseek-ai/official-blocked', verdict: 'blocked' }, // 官方，跳过
  ];
  const fetched = { full_name: 'z/blocked-before', stargazers_count: 123 };
  const seen = [];
  const out = await buildRereviewCandidates(base, existing, log, async (fn) => {
    seen.push(fn);
    return fn === 'z/blocked-before' ? fetched : null;
  });
  const names = out.map((r) => r.full_name);
  assert.ok(names.includes('z/blocked-before'), '曾被 blocked 的仓库应重新纳入候选');
  assert.ok(seen.includes('z/blocked-before'));
  assert.ok(!seen.includes('deepseek-ai/official-blocked'), '官方仓库不应被拉取复查');
  assert.equal(out.find((r) => r.full_name === 'z/blocked-before').stargazers_count, 123);
});

test('buildRereviewCandidates: dedups same repo across sources', async () => {
  const base = [{ full_name: 'dup/repo' }];
  const existing = [{ id: 'dup/repo', source: 'discovered' }];
  const log = [{ id: 'dup/repo', verdict: 'blocked' }];
  const out = await buildRereviewCandidates(base, existing, log, async () => ({ full_name: 'dup/repo' }));
  assert.equal(out.filter((r) => r.full_name === 'dup/repo').length, 1);
});
