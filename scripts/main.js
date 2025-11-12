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
      const linkPath = link.pathname.split("/").pop() || "index.html";
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
    link.addEventListener("click", () => {
      if (navList.classList.contains("is-open")) {
        navList.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
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
})();

