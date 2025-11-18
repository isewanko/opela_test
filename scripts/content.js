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

    let ticketButton = '';
    if (performance.ticketUrl) {
      const isExternal = performance.ticketUrl.startsWith('http');
      const linkTarget = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      ticketButton = `
        <div style="margin-top: 1.5rem;">
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

    // 過去の公演と同じ形式（performance-card）で表示
    performanceCard.innerHTML = `
      <div class="performance-body">
        ${metaTags.length > 0 ? `<div class="upcoming-meta" style="margin-bottom: 1rem;">${metaTags.join('')}</div>` : ''}
        ${performance.label ? `<p class="performance-label">${performance.label}</p>` : ''}
        <h3 class="performance-title">${performance.title}</h3>
        <dl class="performance-meta">
          ${metaItems.join('')}
        </dl>
        <p class="performance-description">${performance.description ? performance.description.split('\n').map(p => `<p>${p}</p>`).join('') : ''}</p>
        ${ticketButton}
      </div>
      ${performance.image ? `
      <div class="performance-media">
        <img src="${performance.image}" alt="${performance.imageAlt || performance.title}" loading="lazy" />
      </div>
      ` : ''}
    `;

    upcomingContainer.appendChild(performanceCard);
  });

  // revealアニメーション用のクラスを追加
  const revealElements = upcomingContainer.querySelectorAll('.performance-card');
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
        <p class="performance-description">${performance.description ? performance.description.split('\n').map(p => `<p>${p}</p>`).join('') : ''}</p>
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

// index.html用：今後の最新公演1つと過去の最新公演1つを表示する関数
function displayIndexPerformances(upcomingPerformances, pastPerformances) {
  const indexContainer = document.getElementById('index-performances-container');
  if (!indexContainer) {
    return;
  }

  // 既存の内容をクリア
  indexContainer.innerHTML = '';

  // 今後の最新公演を1つ取得
  const latestUpcoming = upcomingPerformances && Array.isArray(upcomingPerformances) && upcomingPerformances.length > 0
    ? upcomingPerformances[0]
    : null;

  // 過去の最新公演を1つ取得（配列の最初の要素が最新と仮定）
  const latestPast = pastPerformances && Array.isArray(pastPerformances) && pastPerformances.length > 0
    ? pastPerformances[0]
    : null;

  // 今後の公演を表示
  if (latestUpcoming) {
    const performanceCard = createPerformanceCard(latestUpcoming, true);
    indexContainer.appendChild(performanceCard);
  }

  // 過去の公演を表示
  if (latestPast) {
    const performanceCard = createPerformanceCard(latestPast, false);
    indexContainer.appendChild(performanceCard);
  }

  // 両方ともない場合
  if (!latestUpcoming && !latestPast) {
    indexContainer.innerHTML = `
      <p class="section-lead" style="text-align: center; color: var(--text-soft);">
        公演情報は<a href="performances.html">公演情報ページ</a>でご確認いただけます。
      </p>
    `;
  }

  // revealアニメーション用のクラスを追加
  const revealElements = indexContainer.querySelectorAll('.performance-card');
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

// 公演カードを作成する共通関数
function createPerformanceCard(performance, isUpcoming) {
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

  let actionButton = '';
  if (isUpcoming && performance.ticketUrl) {
    const isExternal = performance.ticketUrl.startsWith('http');
    const linkTarget = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    actionButton = `
      <div style="margin-top: 1.5rem;">
        <a href="${performance.ticketUrl}"${linkTarget} class="hero-cta" style="display: inline-block; text-decoration: none;">チケットを購入</a>
      </div>
    `;
  } else if (!isUpcoming && performance.id) {
    actionButton = `
      <div style="margin-top: 1.5rem;">
        <a href="performances.html#${performance.id}" class="hero-cta" style="display: inline-block; text-decoration: none;">詳細を見る</a>
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

  performanceCard.innerHTML = `
    <div class="performance-body">
      ${metaTags.length > 0 ? `<div class="upcoming-meta" style="margin-bottom: 1rem;">${metaTags.join('')}</div>` : ''}
      ${performance.label ? `<p class="performance-label">${performance.label}</p>` : ''}
      <h3 class="performance-title">${performance.title}</h3>
      <dl class="performance-meta">
        ${metaItems.join('')}
      </dl>
      <p class="performance-description">${performance.description ? performance.description.split('\n').map(p => `<p>${p}</p>`).join('') : ''}</p>
      ${actionButton}
    </div>
    ${performance.image ? `
    <div class="performance-media">
      <img src="${performance.image}" alt="${performance.imageAlt || performance.title}" loading="lazy" />
    </div>
    ` : ''}
  `;

  return performanceCard;
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
    
    // index.htmlの場合は、今後の最新公演1つと過去の最新公演1つを表示
    const indexPerformancesContainer = document.getElementById('index-performances-container');
    if (indexPerformancesContainer) {
      displayIndexPerformances(contentData.upcomingPerformances, contentData.pastPerformances);
    }
    
    // 今後の公演を表示（performances.html用）
    if (contentData.upcomingPerformances !== undefined) {
      displayUpcomingPerformances(contentData.upcomingPerformances);
    } else {
      displayError('upcoming-performances-container', '今後の公演の読み込みに失敗しました。');
    }
    
    // 過去の公演を表示（performances.html用）
    if (contentData.pastPerformances) {
      displayPastPerformances(contentData.pastPerformances);
    } else {
      displayError('past-performances-container', '過去の公演の読み込みに失敗しました。');
    }
  } catch (error) {
    console.error('コンテンツの読み込みエラー:', error);
    displayError('news-grid', 'コンテンツの読み込みに失敗しました。');
    displayError('index-performances-container', 'コンテンツの読み込みに失敗しました。');
    displayError('upcoming-performances-container', 'コンテンツの読み込みに失敗しました。');
    displayError('past-performances-container', 'コンテンツの読み込みに失敗しました。');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContent);
} else {
  initContent();
}

