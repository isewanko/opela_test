// コンテンツデータを読み込む関数
async function loadContent() {
  // パスを複数試す
  const paths = ['./data/content.json', 'data/content.json', '/data/content.json'];
  let response = null;
  let lastError = null;

  for (const path of paths) {
    try {
      response = await fetch(path);
      if (response.ok) {
        const contentData = await response.json();
        return contentData;
      }
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  // すべてのパスで失敗した場合
  throw new Error('JSONファイルが見つかりません。ローカルサーバーで実行してください。');
}

// ニュースを表示する関数
function displayNews(newsData) {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid || !newsData || !Array.isArray(newsData)) {
    return;
  }

  // 既存の内容をクリア
  newsGrid.innerHTML = '';

  // ニュースアイテムを表示
  newsData.forEach(news => {
    const article = document.createElement('article');
    article.className = 'news-card';

    let linkHTML = '';
    if (news.link) {
      const isExternal = news.link.startsWith('http');
      const linkTarget = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      linkHTML = `<a class="news-link" href="${news.link}"${linkTarget}>${news.linkText || '詳細を見る'}</a>`;
    }

    article.innerHTML = `
      <span class="news-tag">${news.tag || 'ニュース'}</span>
      <h3>${news.title}</h3>
      <p>${news.description}</p>
      ${linkHTML}
    `;

    newsGrid.appendChild(article);
  });

  // revealアニメーション用のクラスを追加
  const revealElements = newsGrid.querySelectorAll('.news-card');
  revealElements.forEach((element) => {
    element.classList.add('reveal');
    // IntersectionObserverでアニメーションを適用
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -40px 0px',
        }
      );
      observer.observe(element);
    } else {
      element.classList.add('is-visible');
    }
  });
}

// 過去の公演を表示する関数
function displayPastPerformances(performances) {
  const pastPerformancesContainer = document.getElementById('past-performances-container');
  if (!pastPerformancesContainer || !performances || !Array.isArray(performances)) {
    return;
  }

  // 既存の内容をクリア
  pastPerformancesContainer.innerHTML = '';

  // 公演アイテムを表示
  performances.forEach(performance => {
    const performanceCard = document.createElement('div');
    performanceCard.className = 'performance-card';
    performanceCard.style.marginBottom = '3rem';
    if (performance.id) {
      performanceCard.id = performance.id;
    }

    const metaItems = [];
    if (performance.date) {
      metaItems.push(`<div><dt>上演日</dt><dd>${performance.date}</dd></div>`);
    }
    if (performance.venue) {
      metaItems.push(`<div><dt>会場</dt><dd>${performance.venue}</dd></div>`);
    }
    if (performance.composer) {
      metaItems.push(`<div><dt>作曲</dt><dd>${performance.composer}</dd></div>`);
    }
    if (performance.language) {
      metaItems.push(`<div><dt>言語</dt><dd>${performance.language}</dd></div>`);
    }

    performanceCard.innerHTML = `
      <div class="performance-body">
        ${performance.label ? `<p class="performance-label">${performance.label}</p>` : ''}
        <h3 class="performance-title">${performance.title}</h3>
        <dl class="performance-meta">
          ${metaItems.join('')}
        </dl>
        <p class="performance-description">${performance.description || ''}</p>
      </div>
      ${performance.image ? `
      <div class="performance-media">
        <img src="${performance.image}" alt="${performance.imageAlt || performance.title}" loading="lazy" />
      </div>
      ` : ''}
    `;

    pastPerformancesContainer.appendChild(performanceCard);
  });

  // revealアニメーション用のクラスを追加
  const revealElements = pastPerformancesContainer.querySelectorAll('.performance-card');
  revealElements.forEach((element) => {
    element.classList.add('reveal');
    // IntersectionObserverでアニメーションを適用
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -40px 0px',
        }
      );
      observer.observe(element);
    } else {
      element.classList.add('is-visible');
    }
  });
}

// エラーメッセージを表示する関数
function displayError(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-soft);">
        <p style="margin: 0;">${message}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: rgba(203, 213, 225, 0.8);">
          JSONファイル（data/content.json）を読み込めませんでした。<br>
          ローカルサーバーで実行してください。
        </p>
      </div>
    `;
  }
}

// ページ読み込み時にコンテンツを読み込む
async function initContent() {
  try {
    const contentData = await loadContent();
    
    // ニュースを表示
    if (contentData.news) {
      displayNews(contentData.news);
    } else {
      displayError('news-grid', 'ニュースの読み込みに失敗しました。');
    }
    
    // 過去の公演を表示
    if (contentData.pastPerformances) {
      displayPastPerformances(contentData.pastPerformances);
    } else {
      displayError('past-performances-container', '過去の公演の読み込みに失敗しました。');
    }
  } catch (error) {
    console.error('コンテンツの読み込みエラー:', error);
    displayError('news-grid', 'コンテンツの読み込みに失敗しました。');
    displayError('past-performances-container', 'コンテンツの読み込みに失敗しました。');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContent);
} else {
  initContent();
}

