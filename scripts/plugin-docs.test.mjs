import test from 'node:test';
import assert from 'node:assert/strict';
import {
  collectLocalizedDescriptions,
  detectDocumentLanguage,
  docCandidates,
  extractBriefDescription,
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
