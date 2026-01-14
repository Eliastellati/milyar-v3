(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggleBtn = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");
  const canvas = document.getElementById("grainCanvas");

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Grain overlay (static)
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          // Low alpha so it stays subtle (soft-light blend in CSS)
          data[i + 3] = Math.random() < 0.55 ? 14 : 24;
        }

        ctx.putImageData(imageData, 0, 0);
      };

      const resize = () => {
        const w = Math.max(1, Math.floor(window.innerWidth * dpr));
        const h = Math.max(1, Math.floor(window.innerHeight * dpr));
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        draw();
      };

      // Draw once (and redraw only if viewport size changes)
      resize();
      window.addEventListener(
        "resize",
        () => {
          window.clearTimeout(window.__grainResizeT);
          window.__grainResizeT = window.setTimeout(resize, 120);
        },
        { passive: true }
      );
    }
  }

  // --- Mobile nav toggle ---
  if (!header || !toggleBtn || !mobileNav) return;

  const setMenuOpen = (open) => {
    header.classList.toggle("is-open", open);
    root.classList.toggle("nav-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggleBtn.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-open"));
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });

  // Close when clicking outside header/menu
  document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    if (!e.target.closest(".site-header")) setMenuOpen(false);
  });

  // Close when clicking a menu link
  mobileNav.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    setMenuOpen(false);
  });

  // Smooth scroll with header offset
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const isTop = a.dataset.scroll === "top" || href === "#top";
    const targetId = isTop ? "top" : href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    setMenuOpen(false);

    const headerH = header.offsetHeight || 0;
    const gap = 14;
    const y = isTop ? 0 : target.getBoundingClientRect().top + window.scrollY - headerH - gap;

    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
})();
