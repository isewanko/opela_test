// ニュースデータ（フォールバック用）
const fallbackNewsData = [
  {
    "tag": "公演情報",
    "title": "《An American Dream》公演終了",
    "description": "2024年11月30日（土）に渋谷区文化総合センター大和田 伝承ホールにて上演された《An American Dream（アメリカン・ドリーム）》の公演が無事終了いたしました。ご来場いただいた皆様、ありがとうございました。",
    "link": "performances.html#american-dream",
    "linkText": "公演詳細を見る"
  },
  {
    "tag": "公演情報",
    "title": "公演情報ページ公開",
    "description": "最新公演情報や過去の公演について、詳しくご覧いただけます。各公演の詳細情報も掲載しています。",
    "link": "performances.html",
    "linkText": "公演一覧を見る"
  }
];

// ニュースデータを読み込んで表示する関数
async function loadNews() {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) {
    return;
  }

  try {
    // パスを複数試す
    const paths = ['./data/news.json', 'data/news.json', '/data/news.json'];
    let response = null;
    let lastError = null;

    for (const path of paths) {
      try {
        response = await fetch(path);
        if (response.ok) {
          break;
        }
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    if (!response || !response.ok) {
      throw new Error('JSONファイルが見つかりません。ローカルサーバーで実行してください。');
    }

    const newsData = await response.json();
    displayNews(newsData);
  } catch (error) {
    console.error('ニュースの読み込みエラー:', error);
    // エラー時はフォールバックデータを使用
    console.log('フォールバックデータを使用します');
    displayNews(fallbackNewsData);
  }
}

// ニュースを表示する関数
function displayNews(newsData) {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) {
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
  revealElements.forEach((element, index) => {
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

// ページ読み込み時にニュースを読み込む
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNews);
} else {
  loadNews();
}

