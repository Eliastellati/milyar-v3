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
        data[i + 3] = 50; // intensità
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }

  if (!header || !toggleBtn || !mobileNav) return;

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
    const open = header.classList.contains("is-open");
    setMenuOpen(!open);
  });

  // Chiudi quando clicchi un link del menu
  mobileNav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    if (a.getAttribute("href")?.startsWith("#")) setMenuOpen(false);
  });

  // ESC chiude
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  // Recalcola altezza su resize/orientation change
  window.addEventListener("resize", updateMobileMenuHeightVar);

  // Smooth scroll con offset header
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header.offsetHeight || 0;
    const gap = 12;
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - gap;

    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
})();
