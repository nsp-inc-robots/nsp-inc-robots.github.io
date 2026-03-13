import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const NOTE_RSS_URL = 'https://note.com/nsp_inc_robots/rss';
const MAX_ARTICLES = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const indexPath = path.join(projectRoot, 'index.html');

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}

function extractExcerpt(raw) {
  if (!raw) return '';
  const text = raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= 120) return text;
  return `${text.slice(0, 120)}...`;
}

function buildArticleCardHtml(article) {
  const { title, link, pubDate, excerpt } = article;
  const dateText = pubDate ? formatDate(pubDate) : '';

  return [
    `<a href="${link}" class="article-card" target="_blank" rel="noopener">`,
    `  <p class="article-meta">NOTE ARTICLE</p>`,
    dateText ? `  <p class="article-date article-meta">${dateText}</p>` : '',
    `  <h3 class="article-title">${title}</h3>`,
    excerpt ? `  <p class="article-excerpt">${excerpt}</p>` : '',
    `</a>`
  ]
    .filter(Boolean)
    .join('\n');
}

async function fetchRss() {
  const res = await fetch(NOTE_RSS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  return text;
}

async function buildArticlesHtml() {
  const xml = await fetchRss();

  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true
  });
  const json = parser.parse(xml);

  const items = json?.rss?.channel?.item || [];
  if (!Array.isArray(items) || items.length === 0) {
    return [
      `<p class="articles-placeholder" lang-jp>現在、表示できる記事がありません。</p>`,
      `<p class="articles-placeholder" lang-en>No articles are available at the moment.</p>`
    ].join('\n');
  }

  const limited = items.slice(0, MAX_ARTICLES);

  const cards = limited.map((item) => {
    const title = item.title || '';
    const link = item.link || '#';
    const pubDate = item.pubDate || '';
    const description = item.description || '';
    const content = item.encoded || '';
    const excerpt = extractExcerpt(content || description);

    return buildArticleCardHtml({ title, link, pubDate, excerpt });
  });

  return cards.join('\n\n');
}

async function updateIndexHtml() {
  const [html, articlesHtml] = await Promise.all([
    fs.readFile(indexPath, 'utf8'),
    buildArticlesHtml()
  ]);

  const startMarker = '<!-- ARTICLES-AUTO-GENERATED: START -->';
  const endMarker = '<!-- ARTICLES-AUTO-GENERATED: END -->';

  const pattern = new RegExp(
    `${startMarker}[\\s\\S]*?${endMarker}`,
    'm'
  );

  if (!pattern.test(html)) {
    throw new Error('Markers for auto-generated articles block not found in index.html');
  }

  const replacement = [
    startMarker,
    articlesHtml,
    endMarker
  ].join('\n');

  const nextHtml = html.replace(pattern, replacement);
  await fs.writeFile(indexPath, nextHtml, 'utf8');

  // eslint-disable-next-line no-console
  console.log('Updated articles section from note RSS.');
}

updateIndexHtml().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to update articles from note:', err);
  process.exitCode = 1;
});

