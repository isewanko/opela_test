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

// 今後の公演を表示する関数
function displayUpcomingPerformances(performances) {
  const upcomingContainer = document.getElementById('upcoming-performances-container');
  if (!upcomingContainer) {
    return;
  }

  // 既存の内容をクリア
  upcomingContainer.innerHTML = '';

  // 公演がない場合
  if (!performances || !Array.isArray(performances) || performances.length === 0) {
    upcomingContainer.innerHTML = `
      <p class="section-lead" style="text-align: center; color: var(--text-soft);">
        現在、今後の公演は予定されておりません。公演情報が決まり次第、こちらに掲載いたします。
      </p>
    `;
    return;
  }

  // 公演がある場合
  const upcomingGrid = document.createElement('div');
  upcomingGrid.className = 'upcoming-grid';

  performances.forEach(performance => {
    const upcomingCard = document.createElement('article');
    upcomingCard.className = 'upcoming-card';
    if (performance.id) {
      upcomingCard.id = performance.id;
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

    let ticketButton = '';
    if (performance.ticketUrl) {
      const isExternal = performance.ticketUrl.startsWith('http');
      const linkTarget = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      ticketButton = `
        <div style="margin-top: 2rem;">
          <a href="${performance.ticketUrl}"${linkTarget} class="hero-cta" style="display: inline-block; text-decoration: none;">チケットを購入</a>
        </div>
      `;
    }

    const metaTags = [];
    if (performance.season) {
      metaTags.push(`<span class="upcoming-season">${performance.season}</span>`);
    }
    if (performance.status) {
      metaTags.push(`<span class="upcoming-status">${performance.status}</span>`);
    }

    upcomingCard.innerHTML = `
      ${metaTags.length > 0 ? `<div class="upcoming-meta">${metaTags.join('')}</div>` : ''}
      <h3>${performance.title}</h3>
      ${metaItems.length > 0 ? `<dl class="performance-meta" style="margin-top: 1rem;">${metaItems.join('')}</dl>` : ''}
      ${performance.description ? `
      <div class="performance-description" style="margin-top: 1.5rem;">
        ${performance.description.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>
      ` : ''}
      ${ticketButton}
    `;

    upcomingGrid.appendChild(upcomingCard);
  });

  upcomingContainer.appendChild(upcomingGrid);

  // revealアニメーション用のクラスを追加
  const revealElements = upcomingContainer.querySelectorAll('.upcoming-card');
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
    
    // 今後の公演を表示
    if (contentData.upcomingPerformances !== undefined) {
      displayUpcomingPerformances(contentData.upcomingPerformances);
    } else {
      displayError('upcoming-performances-container', '今後の公演の読み込みに失敗しました。');
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
    displayError('upcoming-performances-container', 'コンテンツの読み込みに失敗しました。');
    displayError('past-performances-container', 'コンテンツの読み込みに失敗しました。');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContent);
} else {
  initContent();
}

