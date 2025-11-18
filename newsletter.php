<?php
// メールニュース登録の処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = filter_var($_POST['newsletter-email'] ?? '', FILTER_SANITIZE_EMAIL);
  
  if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    // メールニュース登録処理（実際の実装ではデータベースに保存）
    // ここでは簡易的にセッションに保存
    session_start();
    $_SESSION['newsletter_email'] = $email;
    $success = true;
  } else {
    $error = '有効なメールアドレスを入力してください。';
  }
}

// リダイレクトまたはメッセージ表示
if (isset($success) && $success) {
  header('Location: index.php?newsletter=success');
  exit;
}
?>

