    <footer class="site-footer">
      <div class="container">
        <div class="footer-newsletter">
          <h3>メールニュースに登録</h3>
          <p>新作情報・チケット先行案内・教育プログラム情報を月1回お届けします。</p>
          <form class="footer-form" action="newsletter.php" method="post">
            <label class="sr-only" for="newsletter-email">メールアドレス</label>
            <input
              id="newsletter-email"
              type="email"
              name="newsletter-email"
              placeholder="yourname@example.com"
              required
            />
            <button type="submit">登録する</button>
          </form>
        </div>
        <p>© <?php echo date('Y'); ?> Aurora Stage Lab. All rights reserved.</p>
        <p class="site-footer-subtitle">通称：オーロララボ</p>
      </div>
    </footer>

    <script src="./scripts/main.js" defer></script>
  </body>
</html>

