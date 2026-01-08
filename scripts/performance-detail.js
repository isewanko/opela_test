// 公演詳細ページ用のJavaScript

// フライヤー画像の拡大表示機能を設定する関数
function setupFlyerModal(flyerImg) {
  flyerImg.addEventListener('click', function() {
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
    
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
    
    modal.addEventListener('click', function() {
      modal.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });
    
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
  
  flyerImg.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
    this.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)';
  });
  flyerImg.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = 'none';
  });
}

// パフォーマンスIDを取得する関数
function getPerformanceId() {
  // URLから取得を試みる（例: performance-new-opera-2025.html -> new-opera-2025）
  const path = window.location.pathname;
  const filename = path.split('/').pop() || path;
  const match = filename.match(/performance-(.+)\.html/);
  if (match) {
    return match[1];
  }
  
  // ページのdata属性から取得を試みる
  const pageElement = document.querySelector('[data-performance-id]');
  if (pageElement) {
    return pageElement.getAttribute('data-performance-id');
  }
  
  return null;
}

// パフォーマンスデータを読み込む関数
async function loadPerformanceData(performanceId) {
  const paths = ['./data/performances.json', 'data/performances.json', '/data/performances.json'];
  let response = null;

  for (const path of paths) {
    try {
      response = await fetch(path);
      if (response.ok) {
        const data = await response.json();
        return data[performanceId] || null;
      }
    } catch (err) {
      continue;
    }
  }

  throw new Error('パフォーマンスデータが見つかりません。');
}

// ページタイトルとメタ情報を更新
function updatePageMeta(performance) {
  if (performance.title) {
    document.title = `${performance.title} | Opera Lab Japan | オペラボ`;
  }
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && performance.metaDescription) {
    metaDescription.setAttribute('content', performance.metaDescription);
  }
}

// メインビジュアルを更新
function updateMainVisual(performance) {
  const mvImage = document.querySelector('.performance-mv-image');
  if (mvImage && performance.mainImage) {
    mvImage.src = performance.mainImage;
    mvImage.alt = performance.title || '';
  }
}

// 公演タイトルセクションを更新
function updateTitleSection(performance) {
  const seasonEl = document.querySelector('.performance-title-season');
  if (seasonEl && performance.year) {
    seasonEl.textContent = `${performance.year}年`;
  }
  
  const titleText = document.querySelector('.performance-title-text');
  if (titleText) {
    // 既存の内容をクリア
    titleText.innerHTML = '';
    
    // 作曲家のspanを追加
    if (performance.composer) {
      const composerSpan = document.createElement('span');
      composerSpan.textContent = performance.composer;
      titleText.appendChild(composerSpan);
    }
    
    // タイトルを追加
    if (performance.title) {
      const titleNode = document.createTextNode(performance.title);
      titleText.appendChild(titleNode);
    }
  }
  
  const subtitleEl = document.querySelector('.performance-title-text-sub');
  if (subtitleEl && performance.subtitle) {
    subtitleEl.textContent = performance.subtitle;
  }
  
  const scheduleInner = document.querySelector('.performance-title-schedule-inner');
  if (scheduleInner) {
    const dateDd = scheduleInner.querySelector('dl:first-of-type dd');
    if (dateDd && performance.date) {
      dateDd.textContent = performance.date;
    }
    
    const durationDd = scheduleInner.querySelector('dl:nth-of-type(2) dd');
    if (durationDd && performance.duration) {
      durationDd.textContent = performance.duration;
    }
    
    const venueDd = scheduleInner.querySelector('dl:nth-of-type(3) dd');
    if (venueDd && performance.venue) {
      venueDd.textContent = performance.venue;
    }
  }
}

// イントロセクションを更新
function updateIntroduction(performance) {
  if (!performance.introduction) return;
  
  const subtitleEl = document.querySelector('.introduction-subtitle');
  if (subtitleEl && performance.introduction.subtitle) {
    subtitleEl.textContent = performance.introduction.subtitle;
  }
  
  const textEl = document.querySelector('.introduction-content p');
  if (textEl && performance.introduction.text) {
    textEl.innerHTML = performance.introduction.text;
  }
}

// スタッフ・キャストセクションを更新
function updateStaffCast(performance) {
  const staffTable = document.querySelector('.staff-cast-box:first-of-type .staff-cast-table');
  if (staffTable && performance.staff) {
    staffTable.innerHTML = '';
    performance.staff.forEach(staff => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="staff-cast-role">【${staff.role}】</td>
        <td class="staff-cast-name">${staff.name}</td>
      `;
      staffTable.appendChild(tr);
    });
  }
  
  const castTable = document.querySelector('.staff-cast-box:last-of-type .staff-cast-table');
  if (castTable && performance.cast) {
    castTable.innerHTML = '';
    performance.cast.forEach(cast => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="staff-cast-role">【${cast.role}】</td>
        <td class="staff-cast-name">${cast.name}</td>
      `;
      castTable.appendChild(tr);
    });
  }
}

// ストーリーセクションを更新
function updateStory(performance) {
  if (!performance.story) return;
  
  const storyBlockLeft = document.querySelector('.story-block-left');
  if (storyBlockLeft && performance.story.act1) {
    const img = storyBlockLeft.querySelector('img');
    if (img && performance.story.act1.image) {
      img.src = performance.story.act1.image;
      img.alt = `${performance.title} 第1幕`;
    }
    const p = storyBlockLeft.querySelector('p');
    if (p && performance.story.act1.text) {
      p.textContent = performance.story.act1.text;
    }
  }
  
  const storyBlockRight = document.querySelector('.story-block-right');
  if (storyBlockRight && performance.story.act2) {
    const img = storyBlockRight.querySelector('img');
    if (img && performance.story.act2.image) {
      img.src = performance.story.act2.image;
      img.alt = `${performance.title} 第2幕`;
    }
    const p = storyBlockRight.querySelector('p');
    if (p && performance.story.act2.text) {
      p.textContent = performance.story.act2.text;
    }
  }
}

// フライヤーセクションを更新
function updateFlyer(performance) {
  if (!performance.flyer) return;
  
  const flyerWrapper = document.querySelector('.flyer-wrapper');
  if (!flyerWrapper) return;
  
  flyerWrapper.innerHTML = '';
  
  if (performance.flyer.front) {
    const container = document.createElement('div');
    container.className = 'performance-flyer-container';
    container.innerHTML = `
      <img 
        src="${performance.flyer.front}" 
        alt="${performance.title} 公演フライヤー${performance.flyer.back ? '（表）' : ''}" 
        class="flyer-image" 
        loading="lazy"
      />
    `;
    flyerWrapper.appendChild(container);
  }
  
  if (performance.flyer.back) {
    const container = document.createElement('div');
    container.className = 'performance-flyer-container';
    container.innerHTML = `
      <img 
        src="${performance.flyer.back}" 
        alt="${performance.title} 公演フライヤー（裏）" 
        class="flyer-image" 
        loading="lazy"
      />
    `;
    flyerWrapper.appendChild(container);
  }
  
  // フライヤー画像の拡大表示機能を設定
  const flyerImages = flyerWrapper.querySelectorAll('.flyer-image');
  flyerImages.forEach(flyerImg => {
    setupFlyerModal(flyerImg);
  });
}

// チケット情報セクションを更新
function updateTicketInfo(performance) {
  if (!performance.ticketInfo) return;
  
  const ticketText = document.querySelector('.ticket-section:first-of-type .ticket-text');
  if (ticketText && performance.ticketInfo.purchaseText) {
    ticketText.textContent = performance.ticketInfo.purchaseText;
  }
  
  const ticketActions = document.querySelector('.ticket-actions');
  if (ticketActions) {
    if (performance.ticketUrl) {
      ticketActions.innerHTML = `
        <a href="${performance.ticketUrl}" target="_blank" rel="noopener noreferrer" class="hero-cta" style="display: inline-block; text-decoration: none; margin-top: 1rem;">teketで購入</a>
      `;
    } else {
      ticketActions.innerHTML = `
        <a href="performances.html" class="hero-cta" style="display: inline-block; text-decoration: none; margin-top: 1rem;">他の公演を見る</a>
      `;
    }
  }
  
  const ticketNotes = document.querySelector('.ticket-notes');
  if (ticketNotes && performance.ticketInfo.notes) {
    ticketNotes.innerHTML = '';
    performance.ticketInfo.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      ticketNotes.appendChild(li);
    });
  }
}

// ローカルナビのスムーススクロールを設定
function setupLocalNav() {
  const localNavLinks = document.querySelectorAll('.local-nav-link');
  localNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ページを初期化
async function initPerformanceDetail() {
  const performanceId = getPerformanceId();
  if (!performanceId) {
    console.warn('パフォーマンスIDが見つかりません。');
    return;
  }
  
  try {
    const performance = await loadPerformanceData(performanceId);
    if (!performance) {
      console.error('パフォーマンスデータが見つかりません:', performanceId);
      return;
    }
    
    // 各セクションを更新
    updatePageMeta(performance);
    updateMainVisual(performance);
    updateTitleSection(performance);
    updateIntroduction(performance);
    updateStaffCast(performance);
    updateStory(performance);
    updateFlyer(performance);
    updateTicketInfo(performance);
    
    // ローカルナビのスムーススクロールを設定
    setupLocalNav();
    
    // 既存のフライヤー画像にも拡大表示機能を設定（HTMLに直接書かれている場合）
    const existingFlyerImages = document.querySelectorAll('.flyer-image');
    existingFlyerImages.forEach(flyerImg => {
      setupFlyerModal(flyerImg);
    });
    
  } catch (error) {
    console.error('パフォーマンスデータの読み込みエラー:', error);
  }
}

// ページ読み込み時に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPerformanceDetail);
} else {
  initPerformanceDetail();
}

