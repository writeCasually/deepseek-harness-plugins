import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyLocalizedDescriptionCheck,
  collectLocalizedDescriptions,
  detectDocumentLanguage,
  docCandidates,
  extractBriefDescription,
  isLanguageSwitcherText,
  isLanguageSwitcherLine,
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

test('detects language-switcher banner lines without flagging real text', () => {
  assert.equal(isLanguageSwitcherText('简体中文 | English'), true);
  assert.equal(isLanguageSwitcherText('English | 中文'), true);
  assert.equal(isLanguageSwitcherText('> 中文 · English'), true);
  assert.equal(isLanguageSwitcherText('中文 | English | 日本語'), true);
  // 带 emoji/图标前缀的横幅（如仓库 README 常见「> 🌐 中文 · English」）。
  assert.equal(isLanguageSwitcherText('> 🌐 中文 · English'), true);
  assert.equal(isLanguageSwitcherText('> 🌐 English · 中文'), true);
  assert.equal(isLanguageSwitcherText('> 🔤 中文 · English'), true);
  // 陌生语言名不应导致识别失败（拉丁与其他书写体系混合）。
  assert.equal(isLanguageSwitcherText('Icelandic | English | 中文'), true);
  assert.equal(isLanguageSwitcherText('English | Українська | 中文'), true);
  assert.equal(isLanguageSwitcherText('عربي | English'), true);
  assert.equal(isLanguageSwitcherText('Eesti | English | 日本語'), true);
  assert.equal(
    isLanguageSwitcherText('The place you run agents should look the way you like.'),
    false,
  );
  // 全是拉丁陌生词且无确定语言名 → 不误判为切换栏（避免整句英文被吞）。
  assert.equal(isLanguageSwitcherText('Icelandic | French'), false);
  assert.equal(isLanguageSwitcherText('Fancy | English | Spanish'), false);
  assert.equal(isLanguageSwitcherText('English'), false);
  assert.equal(isLanguageSwitcherText('中文'), false);
  assert.equal(isLanguageSwitcherText('A DSH vision plugin.'), false);
});

test('skips emoji-prefixed language-switcher banners when extracting a brief description', () => {
  const brief = extractBriefDescription(`
# dsh-suite

![GitHub stars](https://img.shields.io/github/stars/whyihaveyou/dsh-suite?style=flat-square)

> 🌐 中文 · [English](README.en.md)

**别再翻 dsh-plugin topic 了，这里都是还能跑的插件。**

Real Chinese description continues here.
`);

  assert.equal(brief, '别再翻 dsh-plugin topic 了，这里都是还能跑的插件。');
});

test('skips language-switcher banners when extracting a brief description', () => {
  const brief = extractBriefDescription(`
> 简体中文 | English

# My Plugin

The real plugin description about vision and OCR.
`);

  assert.equal(brief, 'The real plugin description about vision and OCR.');
});

test('skips markdown language-switcher links when extracting a brief description', () => {
  const brief = extractBriefDescription(`
# Example

![logo](x.png) [English](x) | [中文](y)

Actual description here.
`);

  assert.equal(brief, 'Actual description here.');
});

test('skips over a too-short first paragraph to the next real description', () => {
  const brief = extractBriefDescription(`
# My Plugin

展开查看项目截图

这是一个足够长的真实简介段落，介绍这个插件的功能与定位，所以应该被采用。
`);

  assert.equal(brief, '这是一个足够长的真实简介段落，介绍这个插件的功能与定位，所以应该被采用。');
});

test('keeps an explicit localized README short description (skipShort: false)', () => {
  const brief = extractBriefDescription(
    '# 插件\n显式中文简介。',
    { skipShort: false },
  );
  assert.equal(brief, '显式中文简介。');
});

test('detects single-line language-switcher links without flagging real text', () => {
  // 单行语言切换链接（区别于 | 分隔的多语言横幅）
  assert.equal(isLanguageSwitcherLine('[English](./README.md)'), true);
  assert.equal(isLanguageSwitcherLine('[中文说明](./README.zh-CN.md)'), true);
  assert.equal(isLanguageSwitcherLine('<a href="README.zh-CN.md">简体中文</a>'), true);
  assert.equal(isLanguageSwitcherLine('> [English](./README.md)'), true);
  // 真实内容/段落不应被误判
  assert.equal(isLanguageSwitcherLine('Experimental DeepSeek Harness agent presets'), false);
  assert.equal(isLanguageSwitcherLine('![logo](a.png) 一个真正的简介段落文字在此。'), false);
  assert.equal(isLanguageSwitcherLine('这是英文文档 [Contribution](CONTRIBUTING.md) 请阅读'), false);
});

test('skips single-line language-switcher links when extracting a brief description', () => {
  const brief = extractBriefDescription(`
# dsh-anchored-standard

[中文说明](./README.zh-CN.md)

Experimental DeepSeek Harness agent presets — one base mode plus two variants.
`);

  assert.equal(
    brief,
    'Experimental DeepSeek Harness agent presets — one base mode plus two variants.',
  );
});

test('skips promotional nav links when extracting a brief description', () => {
  const brief = extractBriefDescription(`
# AgentRQ

<p align="center">
  <a href="README.zh-CN.md">简体中文</a>
  <br />
  <a href="https://www.youtube.com/watch?v=GBAoSpuCzrU">Watch on YouTube in HD</a>
</p>

AgentRQ is a modern, high-performance platform designed for seamless collaboration between human operators and AI agents.
`);

  assert.equal(
    brief,
    'AgentRQ is a modern, high-performance platform designed for seamless collaboration between human operators and AI agents.',
  );
});

test('treats single language tags as missing so refresh re-collects', () => {
  // 之前被「单一语言标签」（English / 中文说明 / 简体中文）污染的字段应视为缺失
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: { zh: 'English', en: '中文说明' },
    }),
    true,
  );
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: { zh: 'English', en: '简体中文' },
    }),
    true,
  );
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

test('re-collects languages whose existing value is only a language-switcher banner', async () => {
  const api = async (path) => {
    if (path.includes('/readme')) {
      return {
        path: 'README.md',
        content: Buffer.from('# Plugin\nA real DSH plugin description.').toString('base64'),
      };
    }
    if (path.includes('/git/trees/')) {
      return { tree: [
        { type: 'blob', path: 'README.md' },
        { type: 'blob', path: 'README.zh-CN.md' },
      ] };
    }
    if (path.endsWith('/contents/README.zh-CN.md')) {
      return {
        content: Buffer.from('# 插件\n用于图片理解的 DSH 插件。').toString('base64'),
      };
    }
    return null;
  };

  const descriptions = await collectLocalizedDescriptions({
    api,
    repo: { full_name: 'owner/plugin', default_branch: 'main' },
    existing: { zh: '简体中文 | English', en: '简体中文 | English' },
  });

  assert.deepEqual(descriptions, {
    zh: '用于图片理解的 DSH 插件。',
    en: 'A real DSH plugin description.',
  });
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

test('rechecks localized descriptions corrupted by language-switcher banners', () => {
  // 之前被「语言切换横幅」污染的简介应视为缺失，允许刷新重采覆盖。
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: { zh: '简体中文 | English', en: '简体中文 | English' },
    }),
    true,
  );
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: {
        zh: 'English | 中文',
        en: 'The place you run agents should look the way you like.',
      },
    }),
    true,
  );
  // 已有 checked_at 时保持不重采（尊重既有的一次性检查记录）。
  assert.equal(
    needsLocalizedDescriptionCheck({
      description_i18n: { zh: '简体中文 | English', en: '简体中文 | English' },
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
