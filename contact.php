<?php
// お問い合わせフォームの処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8');
  $organization = htmlspecialchars($_POST['organization'] ?? '', ENT_QUOTES, 'UTF-8');
  $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
  $message = htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8');
  
  // バリデーション
  $errors = [];
  if (empty($name)) {
    $errors[] = 'お名前を入力してください。';
  }
  if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = '有効なメールアドレスを入力してください。';
  }
  if (empty($message)) {
    $errors[] = 'お問い合わせ内容を入力してください。';
  }
  
  if (empty($errors)) {
    // メール送信処理（実際の実装ではメール送信ライブラリを使用）
    $to = 'info@operalab.jp';
    $subject = '【オーロララボ】お問い合わせ: ' . $name;
    $body = "お名前: $name\n";
    $body .= "ご所属: $organization\n";
    $body .= "メールアドレス: $email\n\n";
    $body .= "お問い合わせ内容:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
    
    // 実際のメール送信はサーバー環境に応じて実装
    // mail($to, $subject, $body, $headers);
    
    $success = true;
  }
}

$page_title = 'お問い合わせ | Aurora Stage Lab';
$page_description = 'Aurora Stage Lab（オーロララボ）へのお問い合わせページです。';
include 'includes/header.php';
?>

    <main>
      <section class="section hero page-hero">
        <div class="container hero-inner reveal">
          <h1 class="hero-title">お問い合わせ</h1>
          <p class="hero-lead">
            公演に関するお問い合わせ、コラボレーションのご相談など、お気軽にご連絡ください。
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container contact-container reveal">
          <?php if (isset($success) && $success): ?>
            <div class="contact-success">
              <h2>送信完了</h2>
              <p>お問い合わせありがとうございます。内容を確認次第、ご連絡いたします。</p>
              <a href="index.php" class="hero-cta">ホームに戻る</a>
            </div>
          <?php elseif (isset($errors) && !empty($errors)): ?>
            <div class="contact-errors">
              <h2>エラー</h2>
              <ul>
                <?php foreach ($errors as $error): ?>
                  <li><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
              </ul>
            </div>
          <?php endif; ?>
          
          <div class="contact-actions">
            <a href="mailto:info@operalab.jp" class="contact-link">メールで相談する</a>
            <a
              href="https://x.com/AuroraStageLab"
              class="contact-link"
              target="_blank"
              rel="noopener noreferrer"
              >X (旧Twitter)</a
            >
            <a href="#" class="contact-link">Instagram</a>
          </div>
          <form class="contact-form" action="contact.php" method="post">
            <div class="form-grid">
              <label>
                お名前
                <input type="text" name="name" placeholder="例）山田 太郎" value="<?php echo isset($name) ? htmlspecialchars($name, ENT_QUOTES, 'UTF-8') : ''; ?>" required />
              </label>
              <label>
                ご所属
                <input type="text" name="organization" placeholder="例）○○ホール" value="<?php echo isset($organization) ? htmlspecialchars($organization, ENT_QUOTES, 'UTF-8') : ''; ?>" />
              </label>
              <label class="form-full">
                メールアドレス
                <input
                  type="email"
                  name="email"
                  placeholder="info@example.com"
                  value="<?php echo isset($email) ? htmlspecialchars($email, ENT_QUOTES, 'UTF-8') : ''; ?>"
                  required
                />
              </label>
              <label class="form-full">
                お問い合わせ内容
                <textarea
                  name="message"
                  rows="4"
                  placeholder="公演依頼、ワークショップのご相談などお気軽にご記入ください。"
                  required
                ><?php echo isset($message) ? htmlspecialchars($message, ENT_QUOTES, 'UTF-8') : ''; ?></textarea>
              </label>
            </div>
            <button type="submit" class="form-submit">送信する</button>
          </form>
        </div>
      </section>
    </main>

<?php include 'includes/footer.php'; ?>

