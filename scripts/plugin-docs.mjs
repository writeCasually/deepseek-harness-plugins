// 从插件仓库的 README / 多语言 README 中提取可供卡片展示的简洁简介。
import { basename } from 'node:path';

const INTRO_HEADING =
  /^(?:插件?)?(?:简介|介绍|概述|功能简介)$|^(?:description|overview|about|introduction)$/i;
const NOISE_LINE =
  /^(?:badge|shield|license|npm|build|coverage|downloads?|stars?|version|status|dependencies?|github)\b|^https?:\/\//i;
const MAX_DESCRIPTION_LENGTH = 260;

function decodeBase64(text) {
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

function withoutFrontMatter(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function withoutCodeFences(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, '\n')
    .replace(/~~~[\s\S]*?~~~/g, '\n');
}

function cleanInline(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/`[^`]*`/g, (code) => code.slice(1, -1))
    .replace(/(?<![A-Za-z0-9])[*_~]{1,3}([\s\S]*?)[*_~]{1,3}(?![A-Za-z0-9])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateDescription(text, maxLength = MAX_DESCRIPTION_LENGTH) {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;

  const cut = compact.slice(0, maxLength);
  const boundaries = ['。', '！', '？', '. ', '! ', '? ', '；', '; ', ', ', '，', ' ']
    .map((marker) => cut.lastIndexOf(marker))
    .filter((index) => index >= maxLength * 0.55);
  const boundary = boundaries.length ? Math.max(...boundaries) : -1;
  const end = boundary >= 0 ? boundary + 1 : maxLength;

  return compact
    .slice(0, end)
    .trim()
    .replace(/[,，;；:：]$/, '');
}

// README 顶部的语言切换/导航横幅（如「简体中文 | English」）不是简介内容，
// 提取与语言完整性判断都必须把它们当作噪音忽略。
// 语言名不限定在闭集内：遇到陌生语言（如 Icelandic、Eesti、عربي 等）也不应导致识别失败。
const LANGUAGE_NAMES = new Set([
  '简体中文', '简体', '繁体中文', '繁体', '中文', 'zh', 'cn', 'chinese', 'zhongwen',
  'simplifiedchinese', 'traditionalchinese',
  '英语', '英文', 'english', 'en', 'us', 'usa', 'uk',
  '日本語', '日語', '日本语', 'japanese', 'ja', 'jp',
  '한국어', '한국말', '한글', 'joseon', 'korean', 'ko', 'kr',
  'français', 'francais', 'french', 'fr',
  'deutsch', 'german', 'de',
  'español', 'espanol', 'spanish', 'es',
  'русский', 'russian', 'ru',
  'português', 'portugues', 'portuguese', 'pt',
  'italiano', 'italian', 'it',
  'العربية', 'عربي', 'arabic', 'ar',
  'हिन्दी', 'hindi', 'hi',
  'ไทย', 'thai', 'th',
  'tiếng việt', 'tieng viet', 'vietnamese', 'vi',
  'polski', 'polish', 'pl',
  'nederlands', 'dutch', 'nl',
  'türkçe', 'turkish', 'tr',
  'čeština', 'czech', 'cs',
  'svenska', 'swedish', 'sv',
  'ελληνικά', 'greek', 'el',
  'українська', 'ukrainian', 'uk',
  'עברית', 'hebrew', 'he',
  'bahasa', 'indonesian', 'id',
  'magyar', 'hungarian', 'hu',
  'slovenčina', 'slovak', 'sk',
  'română', 'romanian', 'ro',
  'eesti', 'estonian', 'et',
  'latviešu', 'latvian', 'lv',
  'lietuvių', 'lithuanian', 'lt',
  'български', 'bulgarian', 'bg',
  'სქართველი', 'georgian', 'ka',
  'አማርኛ', 'amharic', 'am',
  'اردو', 'urdu', 'ur',
  'বাংলা', 'bengali', 'bn',
  'தமிழ்', 'tamil', 'ta',
  'తెలుగు', 'telugu', 'te',
  'ಕನ್ನಡ', 'kannada', 'kn',
  'മലയാളം', 'malayalam', 'ml',
  'ଓଡ଼ିଆ', 'odia', 'or',
  'punjabi', 'ਪੰਜਾਬੀ', 'pa',
  'icelandic', 'íslenska',
  'danish', 'dansk', 'da',
  'finnish', 'suomi', 'fi',
  'norwegian', 'norsk', 'no',
  'català', 'valencià', 'catalan', 'ca',
  'galego', 'galician', 'gl',
  'башҡорт', 'bashkir',
  'kazakh', 'қазақша', 'kk',
  'uzbek', 'oʻzbek', 'uz',
  'mongolian', 'монгол', 'mn',
  'swahili', 'kiswahili', 'sw',
]);
const LANG_SEPARATOR_RE = /[\s|/·•,，、:：()（）]+/g;
// 判定非拉丁文字 token 是否「几乎必然是语言名」的书写体系。
const NON_LATIN_LANG_SCRIPT_RE =
  /\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}|\p{Script=Arabic}|\p{Script=Devanagari}|\p{Script=Thai}|\p{Script=Cyrillic}|\p{Script=Greek}|\p{Script=Hebrew}|\p{Script=Georgian}|\p{Script=Ethiopic}|\p{Script=Armenian}|\p{Script=Bengali}|\p{Script=Tamil}|\p{Script=Telugu}|\p{Script=Kannada}|\p{Script=Malayalam}|\p{Script=Gujarati}|\p{Script=Gurmukhi}|\p{Script=Oriya}/u;

function scriptOf(token) {
  if (/\p{Script=Han}/u.test(token)) return 'han';
  if (/[A-Za-z]/u.test(token)) return 'latin';
  if (NON_LATIN_LANG_SCRIPT_RE.test(token)) return 'other';
  return '';
}

// 单个 token 是否「像语言名」。拉丁 token 只有在无空格、无语义句读时才当作候选，
// 否则（含空格/数字/句号等的短语）按真实句子拒识。
function isLikelyLanguageName(token) {
  const lower = token.toLowerCase();
  if (LANGUAGE_NAMES.has(lower)) return true;
  const script = scriptOf(token);
  if (script === 'other' || script === 'han') return true;
  if (script === 'latin') {
    // 单个拉丁单词 → 陌生语言名候选（如 icelandic）；含空格/数字/.*!? 则不是。
    if (/[0-9]/.test(token)) return false;
    if (/[\s.]/.test(token.trim())) return false;
    return true;
  }
  return false;
}

export function isLanguageSwitcherText(text) {
  const trimmed = (text || '').trim().replace(/^>+\s*/, '');
  if (!trimmed) return false;
  const tokens = trimmed.split(LANG_SEPARATOR_RE).filter(Boolean);
  if (tokens.length < 2) return false;

  let definiteLanguageCount = 0;
  let uncertainLatinCount = 0;
  const scripts = new Set();

  for (const token of tokens) {
    if (!isLikelyLanguageName(token)) return false;
    const lower = token.toLowerCase();
    const script = scriptOf(token);
    if (script) scripts.add(script);
    if (LANGUAGE_NAMES.has(lower)) {
      definiteLanguageCount += 1;
    } else if (script === 'latin') {
      uncertainLatinCount += 1;
    }
  }

  // 至少两种书写体系 → 更像真实的多语言切换栏。
  if (scripts.size < 2) return false;

  // 用「非拉丁语言 token + 至少一个确定语言名」作为强证据：
  // 存在不确定的拉丁陌生词时，须有一个确定语言名，避免把英文句子整行误判。
  if (uncertainLatinCount > 0 && definiteLanguageCount === 0) return false;

  return true;
}

export function detectDocumentLanguage(text) {
  if (!text) return '';
  const han = (text.match(/\p{Script=Han}/gu) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;

  if (han > Math.max(latin * 0.08, 3)) return 'zh';
  if (latin > han * 0.08) return 'en';
  return '';
}

export function needsLocalizedDescriptionCheck(entry = {}) {
  if (entry.description_i18n_checked_at) return false;
  const descriptions = entry.description_i18n || {};
  const present = (lang) => {
    const value = descriptions[lang];
    // 语言字段若只是「语言切换横幅」文本，则视为缺失，允许重采覆盖。
    return Boolean(value && value.trim() && !isLanguageSwitcherText(value));
  };
  return !present('zh') || !present('en');
}

export function applyLocalizedDescriptionCheck(entry, descriptions, checkedAt) {
  const previousCount = Object.keys(entry.description_i18n || {}).length;
  entry.description_i18n = descriptions;
  entry.description_i18n_checked_at = checkedAt;
  return Object.keys(descriptions).length - previousCount;
}

export function extractBriefDescription(markdown) {
  if (!markdown) return '';
  const lines = withoutCodeFences(withoutFrontMatter(markdown))
    .replace(/\r\n?/g, '\n')
    .split('\n');
  const headingMatches = [];

  lines.forEach((line, index) => {
    const match = line.match(/^#{1,6}\s+(.+)$/);
    if (!match) return;
    const heading = match[1].replace(/[:：]/g, '').trim();
    if (INTRO_HEADING.test(heading)) headingMatches.push(index);
  });

  let collected = [];
  let start = -1;

  if (headingMatches.length) {
    start = headingMatches[0] + 1;
  } else {
    const firstHeading = lines.findIndex((line) => /^#{1,6}\s+/.test(line));
    start = firstHeading >= 0 ? firstHeading + 1 : 0;
  }

  for (let index = start; index >= 0 && index < lines.length; index += 1) {
    const line = lines[index];
    if (/^#{1,6}\s+/.test(line)) break;

    const cleaned = cleanInline(line);
    if (!cleaned) {
      if (collected.length) break;
      continue;
    }
    if (
      isLanguageSwitcherText(cleaned)
      || NOISE_LINE.test(cleaned)
      || /^[-*_=]{3,}$/.test(cleaned)
    ) continue;

    collected.push(cleaned);
    if (cleaned.endsWith('.') || cleaned.endsWith('。') || collected.length >= 3) break;
  }

  return truncateDescription(collected.join(' ').trim());
}

function docName(path) {
  return basename(path).toLowerCase().replace(/\.(?:md|markdown)$/, '');
}

function sortDocPaths(paths) {
  return [...paths].sort((a, b) => {
    const aRoot = a.includes('/') ? 1 : 0;
    const bRoot = b.includes('/') ? 1 : 0;
    if (aRoot !== bRoot) return aRoot - bRoot;
    return a.length - b.length || a.localeCompare(b);
  });
}

export function docCandidates(paths) {
  const candidates = { zh: [], en: [] };
  for (const path of paths || []) {
    const name = docName(path);
    if (/^readme[._-]?(?:zh|zh-cn|zh_cn|zh-hans|cn|chinese)$/i.test(name)) {
      candidates.zh.push(path);
    } else if (/^readme[._-]?(?:en|en-us|en_us|english)$/i.test(name)) {
      candidates.en.push(path);
    }
  }
  return {
    zh: sortDocPaths(candidates.zh),
    en: sortDocPaths(candidates.en),
  };
}

async function fetchRepoTree(api, repo) {
  const data = await api(
    `/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`,
    null,
  );
  return (data && data.tree ? data.tree : [])
    .filter((item) => item.type === 'blob')
    .map((item) => item.path);
}

async function fetchDefaultReadme(api, repo) {
  const data = await api(`/repos/${repo.full_name}/readme`, null);
  return {
    path: data?.path || '',
    content: data?.content ? decodeBase64(data.content) : '',
  };
}

async function fetchDoc(api, repo, path) {
  const data = await api(
    `/repos/${repo.full_name}/contents/${encodeURIComponent(path)}`,
    null,
  );
  return data?.content ? decodeBase64(data.content) : '';
}

export async function collectLocalizedDescriptions({
  api,
  repo,
  paths,
  defaultReadme = '',
  defaultReadmePath = '',
  existing = {},
}) {
  let treePaths = paths;
  let readmeContent = defaultReadme;
  let readmePath = defaultReadmePath;

  if (!Array.isArray(treePaths)) {
    treePaths = await fetchRepoTree(api, repo);
  }
  if (!readmeContent) {
    const readme = await fetchDefaultReadme(api, repo);
    readmeContent = readme.content;
    readmePath = readme.path || readmePath;
  }

  const descriptions = { ...(existing || {}) };
  const candidates = docCandidates(treePaths);

  // 已存在的语言若只是「语言切换横幅」文本（历史上被误提取），视作缺失并重采覆盖。
  const isJunk = (value) => !value?.trim() || isLanguageSwitcherText(value);

  for (const language of ['zh', 'en']) {
    if (!isJunk(descriptions[language])) continue;
    const exactPath = candidates[language][0];
    if (!exactPath) continue;

    const content = exactPath === readmePath
      ? readmeContent
      : await fetchDoc(api, repo, exactPath);
    const brief = extractBriefDescription(content);
    if (brief) descriptions[language] = brief;
  }

  const defaultLanguage = detectDocumentLanguage(readmeContent);
  const defaultBrief = extractBriefDescription(readmeContent);
  if (defaultBrief && defaultLanguage && isJunk(descriptions[defaultLanguage])) {
    descriptions[defaultLanguage] = defaultBrief;
  }

  const normalized = {};
  for (const language of ['zh', 'en']) {
    if (descriptions[language]?.trim()) normalized[language] = descriptions[language].trim();
  }
  return normalized;
}
