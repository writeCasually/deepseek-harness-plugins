#!/usr/bin/env node
// 一次性迁移：用现有中文简介与英文翻译覆盖层生成 description_i18n。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { detectDocumentLanguage } from './plugin-docs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = join(root, 'docs', 'plugins.json');
const translationPath = join(root, 'docs', 'translations', 'en.json');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const translations = JSON.parse(readFileSync(translationPath, 'utf8'));

for (const plugin of data.plugins || []) {
  const descriptions = { ...(plugin.description_i18n || {}) };
  const translation = translations.plugins?.[plugin.id] || {};

  if (!descriptions.zh && detectDocumentLanguage(plugin.description) === 'zh') {
    descriptions.zh = plugin.description;
  }
  if (!descriptions.en) {
    const english = translation.description
      || (detectDocumentLanguage(plugin.description) === 'en' ? plugin.description : '');
    if (english) descriptions.en = english;
  }

  plugin.description_i18n = descriptions;
}

data.schema_version = 3;
writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`已迁移 ${data.plugins.length} 个插件的 description_i18n。`);
