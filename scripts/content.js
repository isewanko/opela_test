// フライヤー画像の拡大表示機能を設定する関数
function setupFlyerModal(flyerImg) {
  flyerImg.addEventListener('click', function() {
    // モーダルオーバーレイを作成
    const modal = document.createElement('div');
    modal.className = 'flyer-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    const modalImg = document.createElement('img');
    modalImg.src = this.src;
    modalImg.alt = this.alt;
    modalImg.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
    `;
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // フェードイン
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
    
    // クリックで閉じる
    modal.addEventListener('click', function() {
      modal.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });
    
    // ESCキーで閉じる
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') {
        modal.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(modal);
          document.removeEventListener('keydown', closeOnEscape);
        }, 300);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
  });
  
  // ホバーエフェクト
  flyerImg.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
    this.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)';
  });
  flyerImg.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
  });
}

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

  // リストを作成
  const newsListWrap = document.createElement('div');
  newsListWrap.className = 'news-list-wrap';

  const newsList = document.createElement('ul');
  newsList.className = 'news-list';

  newsData.forEach(news => {
    const listItem = document.createElement('li');
    listItem.className = 'news-list-item';

    const headDiv = document.createElement('div');
    headDiv.className = 'news-list-head';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'news-list-date';
    dateSpan.textContent = news.date || '';

    const tagSpan = document.createElement('span');
    tagSpan.className = 'news-tag';
    tagSpan.setAttribute('data-category', news.tag || 'news');
    tagSpan.textContent = news.tag || 'ニュース';

    headDiv.appendChild(dateSpan);
    headDiv.appendChild(tagSpan);

    const link = document.createElement('a');
    link.className = 'news-list-cont';
    if (news.link) {
      const isExternal = news.link.startsWith('http');
      link.href = news.link;
      if (isExternal) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    } else {
      link.href = '#';
    }
    link.textContent = news.title;

    listItem.appendChild(headDiv);
    listItem.appendChild(link);
    newsList.appendChild(listItem);
  });

  newsListWrap.appendChild(newsList);
  newsGrid.appendChild(newsListWrap);
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

  // 公演がある場合 - トップページと同じWhat's Onスタイルで表示
  performances.forEach(performance => {
    const performanceCard = createPerformanceCard(performance, true, true); // hideImage = true でWhat's Onスタイル
    upcomingContainer.appendChild(performanceCard);
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

  // 公演がない場合
  if (performances.length === 0) {
    pastPerformancesContainer.innerHTML = `
      <p class="section-lead" style="text-align: center; color: var(--text-soft);">
        過去の公演情報はありません。
      </p>
    `;
    return;
  }

  // 公演アイテムを表示 - トップページと同じWhat's Onスタイルで表示
  performances.forEach(performance => {
    const performanceCard = createPerformanceCard(performance, false, true); // hideImage = true でWhat's Onスタイル
    pastPerformancesContainer.appendChild(performanceCard);
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

  // 今後の公演を表示（トップページ用なので画像は表示しない）
  if (latestUpcoming) {
    const performanceCard = createPerformanceCard(latestUpcoming, true, true);
    indexContainer.appendChild(performanceCard);
  }

  // 過去の公演を表示（トップページ用なので画像は表示しない）
  if (latestPast) {
    const performanceCard = createPerformanceCard(latestPast, false, true);
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

// トップページ用の簡潔な説明を作成する関数
function getShortDescription(description, isIndexPage) {
  if (!description || !isIndexPage) {
    return description;
  }
  // 最初の文（。まで）を取得、または100文字程度で切り詰め
  const firstSentence = description.split('。')[0];
  if (firstSentence.length <= 100) {
    return firstSentence + '。';
  }
  return description.substring(0, 100) + '...';
}

// 公演カードを作成する共通関数
function createPerformanceCard(performance, isUpcoming, hideImage = false) {
  const performanceCard = document.createElement('div');
  performanceCard.className = 'performance-card';
  // グリッドレイアウトの場合はmarginBottomを設定しない
  const isGridLayout = document.getElementById('upcoming-performances-container')?.classList.contains('performances-grid') ||
                       document.getElementById('past-performances-container')?.classList.contains('performances-grid');
  if (!isGridLayout) {
    performanceCard.style.marginBottom = '3rem';
  }
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
    const marginTop = hideImage ? '0.5rem' : '1.5rem';
    const detailLink = performance.id ? `
      <div style="margin-top: 0.5rem; text-align: center;">
        <a href="performance-${performance.id}.html" class="hero-cta detail-link-button" style="display: inline-block; text-decoration: none;">詳細を見る</a>
      </div>
    ` : '';
    actionButton = `
      <div style="margin-top: ${marginTop}; text-align: center;">
        <a href="${performance.ticketUrl}"${linkTarget} class="hero-cta" style="display: inline-block; text-decoration: none; white-space: nowrap;">チケットを購入</a>
        ${detailLink}
      </div>
    `;
  } else if (!isUpcoming && performance.id) {
    const marginTop = hideImage ? '0.5rem' : '1.5rem';
    actionButton = `
      <div style="margin-top: ${marginTop}; text-align: center;">
        <a href="performance-${performance.id}.html" class="hero-cta detail-link-button" style="display: inline-block; text-decoration: none;">詳細を見る</a>
      </div>
    `;
  } else if (isUpcoming && performance.id) {
    const marginTop = hideImage ? '0.5rem' : '1.5rem';
    actionButton = `
      <div style="margin-top: ${marginTop}; text-align: center;">
        <a href="performance-${performance.id}.html" class="hero-cta detail-link-button" style="display: inline-block; text-decoration: none;">詳細を見る</a>
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

  // フライヤー画像のHTML（タップで拡大表示）
  // 各公演に応じたフライヤー画像を使用
  let flyerImageSrc = './img/test_フライヤー.png';
  if (performance.id === 'american-dream') {
    flyerImageSrc = './img/flyer_americandream.jpg';
  } else if (performance.id === 'new-opera-2025') {
    flyerImageSrc = './img/flyer_dongiovanni.jpg';
  }
  const flyerImage = `
    <div class="performance-flyer" style="margin-top: 2rem; text-align: center;">
      <img 
        src="${flyerImageSrc}" 
        alt="公演フライヤー" 
        class="flyer-image" 
        loading="lazy"
        style="max-width: 100%; height: auto; border-radius: 12px; cursor: pointer; border: 1px solid var(--border-gold); transition: transform 0.3s ease, box-shadow 0.3s ease;"
      />
    </div>
  `;
  
  const flyerImageForIndex = `
    <div class="performance-flyer" style="margin: 0; text-align: center;">
      <img 
        src="${flyerImageSrc}" 
        alt="公演フライヤー" 
        class="flyer-image" 
        loading="lazy"
        style="max-width: 100%; height: auto; border-radius: 12px; cursor: pointer; border: 1px solid var(--border-gold); transition: transform 0.3s ease, box-shadow 0.3s ease;"
      />
    </div>
  `;

  // トップページの場合は画像を表示しない
  const displayDescription = hideImage 
    ? getShortDescription(performance.description, true)
    : performance.description;

  // トップページ用のレイアウト（新国立劇場スタイル）
  if (hideImage) {
    performanceCard.className = 'performance-card performance-card-whatson';
    
    // 日付をフォーマット（2024年11月30日（土）→ 2024.11.30）
    let formattedDate = '';
    if (performance.date) {
      formattedDate = performance.date
        .replace(/年/g, '.')
        .replace(/月/g, '.')
        .replace(/日.*$/, '');
    }
    
    // ボタンを2つに分ける
    const ticketButtonHtml = isUpcoming && performance.ticketUrl 
      ? `<a class="whatson-btn whatson-btn-ticket" href="${performance.ticketUrl}" target="_blank" rel="noopener noreferrer">チケット購入</a>`
      : '';
    const detailButtonHtml = performance.id
      ? `<a class="whatson-btn whatson-btn-info" href="performance-${performance.id}.html">公演情報</a>`
      : '';
    
    const statusTagUpcoming = isUpcoming && performance.status ? `<div class="whatson-status-tag whatson-status-tag-upcoming"><span>${performance.status}</span></div>` : '';
    
    performanceCard.innerHTML = `
      <div class="whatson-content">
        <div class="whatson-content-head">
          ${formattedDate ? `<p class="whatson-date">${formattedDate}</p>` : ''}
        </div>
        <h2 class="whatson-title">
          ${performance.id ? `<a href="performance-${performance.id}.html">${performance.title}</a>` : performance.title}
        </h2>
        <div class="whatson-info-grid">
          ${performance.composer ? `<div class="whatson-info-item"><span class="whatson-info-label">作曲</span><span class="whatson-info-value">${performance.composer}</span></div>` : '<div class="whatson-info-item"></div>'}
          ${performance.venue ? `<div class="whatson-info-item"><span class="whatson-info-label">会場</span><span class="whatson-info-value">${performance.venue}</span></div>` : '<div class="whatson-info-item"></div>'}
          ${performance.language ? `<div class="whatson-info-item"><span class="whatson-info-label">言語</span><span class="whatson-info-value">${performance.language}</span></div>` : '<div class="whatson-info-item"></div>'}
        </div>
        <div class="whatson-buttons">
          ${ticketButtonHtml}
          ${detailButtonHtml}
        </div>
      </div>
      <div class="whatson-image-wrap">
        ${statusTagUpcoming}
        <img src="${flyerImageSrc}" alt="${performance.title} 公演フライヤー" class="whatson-flyer-image" loading="lazy" />
      </div>
    `;
  } else {
    performanceCard.innerHTML = `
      ${!hideImage && performance.image ? `
      <div class="performance-media">
        <img src="${performance.image}" alt="${performance.imageAlt || performance.title}" loading="lazy" />
      </div>
      ` : ''}
      <div class="performance-body">
        ${metaTags.length > 0 ? `<div class="upcoming-meta" style="margin-bottom: 0.8rem;">${metaTags.join('')}</div>` : ''}
        ${performance.label ? `<p class="performance-label">${performance.label}</p>` : ''}
        <h3 class="performance-title">${performance.title}</h3>
        <dl class="performance-meta">
          ${metaItems.join('')}
        </dl>
        <p class="performance-description" style="${hideImage ? 'margin-bottom: 1rem;' : ''}">${displayDescription ? displayDescription.split('\n').map(p => `<p>${p}</p>`).join('') : ''}</p>
        ${flyerImage}
        ${actionButton}
      </div>
    `;
  }

  // フライヤー画像の拡大表示機能を追加
  const flyerImg = performanceCard.querySelector('.flyer-image');
  if (flyerImg) {
    setupFlyerModal(flyerImg);
  }
  
  // What's Onスタイルのフライヤー画像にも拡大表示機能を追加
  const whatsonFlyerImg = performanceCard.querySelector('.whatson-flyer-image');
  if (whatsonFlyerImg) {
    setupFlyerModal(whatsonFlyerImg);
  }

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

