<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo isset($page_title) ? $page_title : 'Aurora Stage Lab | オーロララボ'; ?></title>
    <meta
      name="description"
      content="<?php echo isset($page_description) ? $page_description : 'Aurora Stage Lab（オーロララボ）は、若手中心の挑戦的な舞台クリエイティブ集団として、伝統と革新を織り交ぜた体験を届けます。'; ?>"
    />
    <link rel="stylesheet" href="./styles/style.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <div class="brand">
          <span class="brand-logo" aria-hidden="true">AL</span>
          <span class="brand-name">Aurora Stage Lab</span>
        </div>
        <nav class="site-nav" aria-label="メインメニュー">
          <button
            class="nav-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="site-nav-list"
          >
            <span class="nav-toggle-bar"></span>
            <span class="nav-toggle-bar"></span>
            <span class="nav-toggle-bar"></span>
            <span class="sr-only">メニューを開閉</span>
          </button>
          <ul id="site-nav-list" class="nav-list">
            <li><a href="index.php#home">ホーム</a></li>
            <li><a href="index.php#about">オペラボとは</a></li>
            <li><a href="index.php#programs">プログラム</a></li>
            <li><a href="index.php#performance">プロジェクト</a></li>
            <li><a href="index.php#news">ニュース</a></li>
            <li><a href="index.php#contact">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </header>

