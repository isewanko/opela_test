(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-list a");
  const revealElements = document.querySelectorAll(".reveal");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("is-open");
    });
  }

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    const sections = document.querySelectorAll("main section[id]");
    let currentSectionId = sections.length ? sections[0].id : null;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const linkHash = link.hash;
      const linkPath = link.pathname.split("/").pop() || "index.php";
      const isHashMatch =
        linkHash && currentSectionId && linkHash === `#${currentSectionId}`;
      const isPathMatch = !linkHash && linkPath === currentPath;
      link.classList.toggle("is-active", Boolean(isHashMatch || isPathMatch));
    });
  };

  if (navLinks.length > 0) {
    setActiveLink();
    window.addEventListener("scroll", setActiveLink, { passive: true });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (navList.classList.contains("is-open")) {
        navList.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }

      const linkPath = link.pathname.split("/").pop() || "index.html";
      const isDifferentPage = linkPath !== currentPath;

      // 別ページへのリンクの場合、通常の遷移を許可
      if (isDifferentPage) {
        // デフォルトの動作を許可（ページ遷移）
        return;
      }

      // 同じページ内のハッシュリンクの場合、スムーズスクロール
      if (link.hash) {
        e.preventDefault();
        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // URLを更新（ブラウザの戻るボタン対応）
          history.pushState(null, null, link.hash);
        }
      }
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // ギャラリースライドショー
  const gallerySlider = document.querySelector('.gallery-slider');
  if (gallerySlider) {
    const slides = gallerySlider.querySelectorAll('.gallery-slide');
    const dots = gallerySlider.querySelectorAll('.gallery-dot');
    const prevBtn = gallerySlider.querySelector('.gallery-prev');
    const nextBtn = gallerySlider.querySelector('.gallery-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoSlide();
        startAutoSlide();
      });
    });

    // マウスホバーで自動スライドを一時停止
    gallerySlider.addEventListener('mouseenter', stopAutoSlide);
    gallerySlider.addEventListener('mouseleave', startAutoSlide);

    // 自動スライドを開始
    startAutoSlide();
  }
})();

