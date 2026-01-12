(() => {
  const header = document.querySelector(".site-header");
  const toggleBtn = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");
  const canvas = document.getElementById("grainCanvas");

  // Footer year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Grain overlay (static)
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const size = 2048;
      canvas.width = size;
      canvas.height = size;

      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 45; // intensità grain
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }

  if (!header || !toggleBtn || !mobileNav) return;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const updateMobileMenuHeightVar = () => {
    const open = header.classList.contains("is-open");
    if (!open) {
      document.documentElement.style.setProperty("--mobile-menu-height", "0px");
      return;
    }
    requestAnimationFrame(() => {
      const h = mobileNav.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--mobile-menu-height", `${h}px`);
    });
  };

  const setMenuOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    updateMobileMenuHeightVar();
  };

  toggleBtn.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-open"));
  });

  // Chiudi cliccando fuori dall'header
  document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    if (!e.target.closest(".site-header")) setMenuOpen(false);
  });

  // Chiudi cliccando un link nel menu mobile
  mobileNav.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    setMenuOpen(false);
  });

  // Smooth scroll con offset header
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    // top
    if (a.dataset.scroll === "top" || href === "#top") {
      e.preventDefault();
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    setMenuOpen(false);

    const headerH = header.offsetHeight || 0;
    const gap = 12;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH - gap;

    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  window.addEventListener("resize", updateMobileMenuHeightVar);
})();
