import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyLocalizedDescriptionCheck,
  collectLocalizedDescriptions,
  detectDocumentLanguage,
  docCandidates,
  extractBriefDescription,
  needsLocalizedDescriptionCheck,
} from './plugin-docs.mjs';
import { localizedPlugin } from '../docs/js/localization.mjs';

test('detects Chinese and English documents', () => {
  assert.equal(detectDocumentLanguage('# 插件\nDeepSeek Harness 插件简介。'), 'zh');
  assert.equal(detectDocumentLanguage('# Plugin\nA brief DSH plugin description.'), 'en');
});

test('prioritizes root localized README files', () => {
  const candidates = docCandidates([
    'docs/README.zh-CN.md',
    'README.zh-CN.md',
    'docs/README.en.md',
    'README.en.md',
    'README.md',
  ]);

  assert.deepEqual(candidates.zh, ['README.zh-CN.md', 'docs/README.zh-CN.md']);
  assert.deepEqual(candidates.en, ['README.en.md', 'docs/README.en.md']);
});

test('extracts a concise paragraph from an introduction heading', () => {
  const brief = extractBriefDescription(`
---
title: Example
---
# Example

<img src="logo.png" alt="logo" />

[![badge](https://img.shields.io/badge/test-ok)](https://example.com)

## 简介

这是一个 [DSH 插件](https://example.com)，用于提供 \`vision\` 能力。
下一句仍属于简介。

## 安装
`);

  assert.equal(brief, '这是一个 DSH 插件，用于提供 vision 能力。');
});

test('extracts the first paragraph when no dedicated introduction heading exists', () => {
  const brief = extractBriefDescription(`
# ModLens

The first DeepSeek Harness vision plugin.
`);

  assert.equal(brief, 'The first DeepSeek Harness vision plugin.');
});

test('preserves snake-case identifiers while removing Markdown emphasis', () => {
  const brief = extractBriefDescription(`
# Example

Uses **dsh_workflow** and \`README_en.md\` to improve _plugin_memory_.
`);

  assert.equal(
    brief,
    'Uses dsh_workflow and README_en.md to improve plugin_memory.',
  );
});

test('collects localized README descriptions with API fallback', async () => {
  const calls = [];
  const api = async (path) => {
    calls.push(path);
    if (path.includes('/readme')) {
      return {
        path: 'README.md',
        content: Buffer.from('# Plugin\nA DSH vision plugin.').toString('base64'),
      };
    }
    if (path.endsWith('/contents/README.zh-CN.md')) {
      return {
        content: Buffer.from('# 插件\n用于图片理解的 DSH 插件。').toString('base64'),
      };
    }
    if (path.includes('/git/trees/')) {
      return { tree: [
        { type: 'blob', path: 'README.md' },
        { type: 'blob', path: 'README.zh-CN.md' },
      ] };
    }
    return null;
  };

  const descriptions = await collectLocalizedDescriptions({
    api,
    repo: { full_name: 'owner/plugin', default_branch: 'main' },
  });

  assert.deepEqual(descriptions, {
    en: 'A DSH vision plugin.',
    zh: '用于图片理解的 DSH 插件。',
  });
  assert.equal(calls.filter((path) => path.endsWith('/contents/README.zh-CN.md')).length, 1);
});

test('prefers explicit localized READMEs over inferred default README language', async () => {
  const api = async (path) => {
    if (path.includes('/readme')) {
      return {
        path: 'README.md',
        content: Buffer.from(
          '# 插件\n这是一个中英文混合的默认说明。English default text is also present.',
        ).toString('base64'),
      };
    }
    if (path.endsWith('/contents/README.zh-CN.md')) {
      return {
        content: Buffer.from('# 插件\n显式中文简介。').toString('base64'),
      };
    }
    if (path.endsWith('/contents/README.en.md')) {
      return {
        content: Buffer.from('# Plugin\nExplicit English description.').toString('base64'),
      };
    }
    if (path.includes('/git/trees/')) {
      return { tree: [
        { type: 'blob', path: 'README.md' },
        { type: 'blob', path: 'README.zh-CN.md' },
        { type: 'blob', path: 'README.en.md' },
      ] };
    }
    return null;
  };

  const descriptions = await collectLocalizedDescriptions({
    api,
    repo: { full_name: 'owner/plugin', default_branch: 'main' },
  });

  assert.deepEqual(descriptions, {
    zh: '显式中文简介。',
    en: 'Explicit English description.',
  });
});

test('keeps existing localized descriptions without fetching them again', async () => {
  const descriptions = await collectLocalizedDescriptions({
    api: async () => {
      throw new Error('unexpected API call');
    },
    repo: { full_name: 'owner/plugin', default_branch: 'main' },
    paths: ['README.md'],
    defaultReadme: '# Plugin\nExisting description.',
    defaultReadmePath: 'README.md',
    existing: { en: 'Existing description.' },
  });

  assert.deepEqual(descriptions, { en: 'Existing description.' });
});

test('decides when localized description data still needs a one-time check', () => {
  assert.equal(needsLocalizedDescriptionCheck({ description_i18n: {} }), true);
  assert.equal(
    needsLocalizedDescriptionCheck({ description_i18n: { zh: '中文简介' } }),
    true,
  );
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: { zh: '中文简介', en: 'English description' },
    }),
    false,
  );
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: { zh: '中文简介' },
      description_i18n_checked_at: '2026-08-14T00:00:00Z',
    }),
    false,
  );
});

test('persists the one-time description check even when no language was found', () => {
  const entry = { description_i18n: {} };
  const partialEntry = { description_i18n: { zh: '中文简介' } };

  assert.equal(
    applyLocalizedDescriptionCheck(entry, {}, '2026-08-14T00:00:00Z'),
    0,
  );
  assert.deepEqual(entry, {
    description_i18n: {},
    description_i18n_checked_at: '2026-08-14T00:00:00Z',
  });
  assert.equal(
    applyLocalizedDescriptionCheck(
      partialEntry,
      { zh: '中文简介', en: 'English description' },
      '2026-08-14T00:00:00Z',
    ),
    1,
  );
});

test('selects the description for the active site language with Chinese-first fallback', () => {
  const plugin = {
    id: 'owner/plugin',
    description: '默认简介',
    description_i18n: {
      zh: '中文简介',
      en: 'English description',
    },
  };
  const translations = {
    plugins: {
      'owner/plugin': {
        description: 'Overlay English description',
        usage: 'Overlay usage',
      },
    },
  };

  assert.equal(localizedPlugin(plugin, 'zh', translations).description, '中文简介');
  assert.equal(localizedPlugin(plugin, 'en', translations).description, 'English description');
  assert.equal(
    localizedPlugin({ ...plugin, description_i18n: { en: 'English description' } }, 'zh', translations)
      .description,
    '默认简介',
  );
  assert.equal(
    localizedPlugin({ ...plugin, description_i18n: {} }, 'en', translations).description,
    'Overlay English description',
  );
});
