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
    .replace(/[*_~]{1,3}/g, '')
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

export function detectDocumentLanguage(text) {
  if (!text) return '';
  const han = (text.match(/\p{Script=Han}/gu) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;

  if (han > Math.max(latin * 0.08, 3)) return 'zh';
  if (latin > han * 0.08) return 'en';
  return '';
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
    if (NOISE_LINE.test(cleaned) || /^[-*_=]{3,}$/.test(cleaned)) continue;

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
  const defaultLanguage = detectDocumentLanguage(readmeContent);
  const defaultBrief = extractBriefDescription(readmeContent);

  if (defaultBrief && defaultLanguage && !descriptions[defaultLanguage]) {
    descriptions[defaultLanguage] = defaultBrief;
  }

  for (const language of ['zh', 'en']) {
    if (descriptions[language]) continue;
    const exactPath = candidates[language].find((path) => path !== readmePath);
    if (!exactPath) continue;

    const content = exactPath === readmePath
      ? readmeContent
      : await fetchDoc(api, repo, exactPath);
    const brief = extractBriefDescription(content);
    if (brief) descriptions[language] = brief;
  }

  const normalized = {};
  for (const language of ['zh', 'en']) {
    if (descriptions[language]?.trim()) normalized[language] = descriptions[language].trim();
  }
  return normalized;
}
