const NOTE_RSS_URL = 'https://note.com/nsp_inc_robots/rss';
const MAX_ARTICLES = 6;

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}

function createArticleCard(article) {
  const a = document.createElement('a');
  a.href = article.link;
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = 'article-card';

  const meta = document.createElement('p');
  meta.className = 'article-meta';
  meta.textContent = 'NOTE ARTICLE';
  a.appendChild(meta);

  if (article.pubDate) {
    const dateEl = document.createElement('p');
    dateEl.className = 'article-date article-meta';
    dateEl.textContent = formatDate(article.pubDate);
    a.appendChild(dateEl);
  }

  const title = document.createElement('h3');
  title.className = 'article-title';
  title.textContent = article.title || '';
  a.appendChild(title);

  if (article.excerpt) {
    const excerpt = document.createElement('p');
    excerpt.className = 'article-excerpt';
    excerpt.textContent = article.excerpt;
    a.appendChild(excerpt);
  }

  return a;
}

function extractExcerpt(raw) {
  if (!raw) return '';
  // Remove HTML tags
  const text = raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= 120) return text;
  return `${text.slice(0, 120)}...`;
}

async function loadNoteArticles() {
  const container = document.getElementById('articles-list');
  if (!container) return;

  try {
    const res = await fetch(NOTE_RSS_URL);
    if (!res.ok) throw new Error('Failed to fetch RSS');

    const xmlText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    const items = Array.from(doc.querySelectorAll('item')).slice(0, MAX_ARTICLES);

    if (!items.length) {
      container.innerHTML = '';
      const msg = document.createElement('p');
      msg.className = 'articles-placeholder';
      msg.textContent = '現在、表示できる記事がありません。';
      container.appendChild(msg);
      return;
    }

    container.innerHTML = '';

    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '#';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const content = item.querySelector('content\\:encoded')?.textContent || '';

      const excerpt = extractExcerpt(content || description);

      const article = { title, link, pubDate, excerpt };
      const card = createArticleCard(article);
      container.appendChild(card);
    });
  } catch (e) {
    console.error('Failed to load note articles:', e);
    const container = document.getElementById('articles-list');
    if (!container) return;
    container.innerHTML = '';

    const jp = document.createElement('p');
    jp.className = 'articles-placeholder';
    jp.setAttribute('lang-jp', '');
    jp.textContent = 'note から記事を取得できませんでした。時間をおいて再度お試しください。';

    const en = document.createElement('p');
    en.className = 'articles-placeholder';
    en.setAttribute('lang-en', '');
    en.textContent = 'Failed to load articles from note. Please try again later.';

    container.appendChild(jp);
    container.appendChild(en);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNoteArticles);
} else {
  loadNoteArticles();
}

