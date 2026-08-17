import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
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
